const jobs = {};

const toKebabCase = (str) => {
  if (!str) return '';
  return str.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

export const createRepo = async (req, res) => {
  try {
    const formData = req.body;
    const dataName = formData.dataName || 'default-data';
    
    // Naming convention: aads-edb-<dataName-kebab>
    const repoName = `aads-edb-${toKebabCase(dataName)}`;
    
    // Tags from stage 2: maybe appName, costCenter, projectCenter?
    const rawTags = [formData.level1BusinessArea, formData.dataClassification, formData.businessArea];
    const tags = rawTags
      .filter(Boolean)
      .map(t => toKebabCase(t))
      .filter(t => t.length > 0);

    const jobId = `job-${Date.now()}`;
    jobs[jobId] = { status: 'loading' };
    
    res.status(202).json({ jobId, message: 'Repository creation started' });

    // Background process
    processRepoCreation(jobId, repoName, tags, formData);

  } catch (error) {
    res.status(500).json({ error: 'Failed to start repository creation' });
  }
};

const processRepoCreation = async (jobId, repoName, tags, formData) => {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  
  if (!token || !owner || token.includes('replace_with') || owner.includes('replace_with')) {
    // If not configured, just simulate success after 3 seconds for POC purposes
    console.warn("GitHub credentials not properly configured. Simulating success...");
    setTimeout(() => {
        jobs[jobId] = { 
            status: 'success', 
            url: `https://github.com/${owner || 'mock-owner'}/${repoName}`,
            message: 'Mock Repository created successfully (Missing credentials)' 
        };
    }, 3000);
    return;
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'User-Agent': 'AADS-EDB-App'
  };

  try {
    // 1. Create Repo in Organization
    let createRes = await fetch(`https://api.github.com/orgs/${owner}/repos`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: repoName,
        description: formData.dataDescription || `Repository for ${formData.dataName}`,
        private: true,
        auto_init: true
      })
    });

    let repoData = await createRes.json();
    let repoFullName = '';

    if (!createRes.ok) {
        if (repoData.errors && repoData.errors.some(e => e.message && e.message.includes('already exists'))) {
            // Repo already exists, let's just proceed with it
            repoFullName = `${owner}/${repoName}`;
        } else {
            throw new Error(repoData.message || 'Failed to create repo in organization');
        }
    } else {
        repoFullName = repoData.full_name || `${owner}/${repoName}`;
    }

    if (!repoFullName) repoFullName = `${owner}/${repoName}`;

    // 2. Set Topics/Labels
    if (tags.length > 0) {
      await fetch(`https://api.github.com/repos/${repoFullName}/topics`, {
        method: 'PUT',
        headers: {
            ...headers,
            'Accept': 'application/vnd.github.mercy-preview+json'
        },
        body: JSON.stringify({ names: tags })
      });
    }

    // 3. Add Files
    const filesToCreate = [
      {
        path: 'CODEOWNERS',
        content: `* @${owner}`
      },
      {
        path: '.github/workflows/main.yml',
        content: 'name: CI\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - run: echo "Hello World"'
      },
      {
        path: 'backend/.gitkeep',
        content: ''
      },
      {
        path: 'frontend/.gitkeep',
        content: ''
      }
    ];

    for (const file of filesToCreate) {
      // Check if file exists first to avoid 422 if we re-run
      const checkRes = await fetch(`https://api.github.com/repos/${repoFullName}/contents/${file.path}`, {
          method: 'GET',
          headers
      });
      
      let sha = undefined;
      if (checkRes.ok) {
          const fileData = await checkRes.json();
          sha = fileData.sha;
      }

      const contentEncoded = Buffer.from(file.content).toString('base64');
      await fetch(`https://api.github.com/repos/${repoFullName}/contents/${file.path}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          message: `Add ${file.path}`,
          content: contentEncoded,
          ...(sha && { sha })
        })
      });
    }

    jobs[jobId] = { 
      status: 'success', 
      url: `https://github.com/${repoFullName}`,
      message: 'Repository created successfully' 
    };

  } catch (error) {
    console.error('Repo creation error:', error);
    jobs[jobId] = { status: 'error', message: error.message || 'Error occurred during repo creation' };
  }
};

export const getRepoStatus = (req, res) => {
  const { jobId } = req.params;
  const job = jobs[jobId];
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json(job);
};
