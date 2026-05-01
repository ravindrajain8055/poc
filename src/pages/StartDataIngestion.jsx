import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Database,
  Link as LinkIcon,
  FileText,
  Type,
  ChevronDown,
  CheckCircle2,
  Loader2,
  Copy,
  ExternalLink,
  Github
} from "lucide-react";
import Toast from "../components/ui/Toast";

const FORMAT_OPTIONS = [
  "PPT",
  "Image",
  "Excel",
  "Word",
  "PDF",
  "CSV",
  "JSON",
  "Parquet",
  "SQL Dump",
  "Other",
];

const StartDataIngestion = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentStage, setCurrentStage] = useState(1);
  const [formData, setFormData] = useState({
    // Stage 1
    dataName: location.state?.prefillDataName || "",
    dataDescription: location.state?.prefillDataDescription || "",
    dataFormat: "",
    sourceLink: "",
    businessArea: "",
    // Stage 2
    appName: "",
    costCenter: "",
    costCenterApprover: "",
    systemOwner: "",
    systemCustodian: "",
    primaryItContact: "",
    level1BusinessArea: "",
    projectCenter: "",
    dataClassification: "",
    hipaa: "",
    sourceGitRepo: "",
    approverGroup: "",
    applicationCi: "",
    // Stage 3
    publishToMarketplace: "Yes",
  });

  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formatSearch, setFormatSearch] = useState("");
  const [level1BusinessAreaOption, setLevel1BusinessAreaOption] = useState("");
  const [isCreatingRepo, setIsCreatingRepo] = useState(false);
  const [repoStatus, setRepoStatus] = useState(null);
  const [repoData, setRepoData] = useState(null);

  const filteredFormats = FORMAT_OPTIONS.filter((format) =>
    format.toLowerCase().includes(formatSearch.toLowerCase()),
  );

  const validateStage1 = () => {
    const newErrors = {};
    if (!formData.dataName.trim()) newErrors.dataName = "Data Name is required";
    if (!formData.dataDescription.trim())
      newErrors.dataDescription = "Data Description is required";
    if (!formData.dataFormat) newErrors.dataFormat = "Data Format is required";
    if (!formData.sourceLink.trim())
      newErrors.sourceLink = "Source Link is required";
    if (!formData.businessArea)
      newErrors.businessArea = "Business Area is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStage2 = () => {
    const newErrors = {};
    const requiredFields = [
      "appName",
      "costCenter",
      "costCenterApprover",
      "systemOwner",
      "systemCustodian",
      "primaryItContact",
      "level1BusinessArea",
      "projectCenter",
      "dataClassification",
      "hipaa",
      "sourceGitRepo",
      "approverGroup",
      "applicationCi",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field] || !formData[field].trim()) {
        newErrors[field] = "This field is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStage1 = (e) => {
    e.preventDefault();
    if (validateStage1()) {
      setCurrentStage(2);
      setErrors({});
    }
  };

  const handleNextStage2 = (e) => {
    e.preventDefault();
    if (validateStage2()) {
      setCurrentStage(3);
      setErrors({});
    }
  };

  const handleClearStage2 = () => {
    setFormData((prev) => ({
      ...prev,
      appName: "",
      costCenter: "",
      costCenterApprover: "",
      systemOwner: "",
      systemCustodian: "",
      primaryItContact: "",
      level1BusinessArea: "",
      projectCenter: "",
      dataClassification: "",
      hipaa: "",
      sourceGitRepo: "",
      approverGroup: "",
      applicationCi: "",
    }));
    setLevel1BusinessAreaOption("");
    setErrors({});
  };

  const handleNextStage3 = (e) => {
    e.preventDefault();
    setCurrentStage(4);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setIsCreatingRepo(true);
    setRepoStatus(null);
    
    try {
      const response = await fetch("http://localhost:8080/api/github/create-repo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ formData })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to start creation");
      
      const { jobId } = data;
      
      const pollInterval = setInterval(async () => {
        try {
          const statusRes = await fetch(`http://localhost:8080/api/github/status/${jobId}`);
          const statusData = await statusRes.json();
          
          if (statusData.status === 'success') {
            clearInterval(pollInterval);
            setIsCreatingRepo(false);
            setRepoStatus("success");
            setRepoData(statusData);
            
            const existing = JSON.parse(localStorage.getItem("ingestions") || "[]");
            const newSubmission = {
              ...formData,
              id: `ING-${Math.floor(1000 + Math.random() * 9000)}`,
              date: new Date().toISOString().split("T")[0],
              currentStage: "approval",
              repoUrl: statusData.url
            };
            localStorage.setItem(
              "ingestions",
              JSON.stringify([...existing, newSubmission])
            );
          } else if (statusData.status === 'error') {
            clearInterval(pollInterval);
            setIsCreatingRepo(false);
            setRepoStatus("error");
            setShowToast(true);
          }
        } catch (pollErr) {
          console.error("Polling error", pollErr);
        }
      }, 2000);
      
    } catch (err) {
      console.error(err);
      setIsCreatingRepo(false);
      setRepoStatus("error");
      setShowToast(true);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const renderStepper = () => {
    const steps = [
      "Basic Details",
      "Technical Details",
      "Marketplace",
      "Review",
    ];
    return (
      <div className="flex justify-center items-center mb-6 px-4 mt-5 pb-4 border-b-1 border-gray-200">
        {steps.map((step, index) => {
          const stageNum = index + 1;
          const isActive = currentStage === stageNum;
          const isCompleted = currentStage > stageNum;

          return (
            <React.Fragment key={step}>
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 font-medium text-sm transition-colors z-10 bg-white flex-shrink-0
                  ${
                    isActive
                      ? "border-[#d52b1e] text-[#d52b1e]"
                      : isCompleted
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 text-gray-400"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={16} /> : stageNum}
                </div>
                <span
                  className={`hidden md:block text-sm font-medium whitespace-nowrap ${
                    isActive
                      ? "text-gray-900"
                      : isCompleted
                        ? "text-green-600"
                        : "text-gray-400"
                  }`}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-16 h-0.5 mx-2 transition-colors ${
                    isCompleted ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const renderStage2Field = (label, field, placeholder) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-3 border-b border-gray-100 last:border-0">
      <label className="w-full sm:w-1/3 text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="w-full sm:w-2/3">
        <input
          type="text"
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={placeholder}
          className={`block w-full px-3 py-2 border ${
            errors[field] ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-[#d52b1e] focus:border-[#d52b1e] sm:text-sm transition-colors`}
        />
        {errors[field] && (
          <p className="mt-1 text-xs text-red-500">{errors[field]}</p>
        )}
      </div>
    </div>
  );

  const renderSelectField = (label, field, options) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-3 border-b border-gray-100 last:border-0">
      <label className="w-full sm:w-1/3 text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="w-full sm:w-2/3">
        <select
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className={`block w-full px-3 py-2 border ${
            errors[field] ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-[#d52b1e] focus:border-[#d52b1e] sm:text-sm transition-colors bg-white`}
        >
          <option value="">Select...</option>
          {options.map((opt) => (
            <option key={opt.value || opt} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
        {errors[field] && (
          <p className="mt-1 text-xs text-red-500">{errors[field]}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-full bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {showToast && (
        <Toast
          message={repoStatus === 'error' ? "Error creating repository!" : "Data ingestion submitted successfully!"}
          type={repoStatus === 'error' ? "error" : "success"}
          onClose={() => setShowToast(false)}
        />
      )}

      {repoStatus === "success" && repoData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
            <div className="bg-green-500 p-6 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Github size={32} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-white">Success!</h2>
              <p className="text-green-50 mt-1">Repository created successfully</p>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-gray-600 text-sm text-center">
                Your new repository is ready. You can now start adding your data and code.
              </p>
              
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Repository URL</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={repoData.url} 
                    className="bg-white border border-gray-300 text-gray-800 text-sm rounded-md block w-full p-2.5 focus:ring-green-500 focus:border-green-500"
                  />
                  <button 
                    onClick={() => navigator.clipboard.writeText(repoData.url)}
                    className="p-2.5 bg-gray-100 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy size={18} />
                  </button>
                  <a 
                    href={repoData.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2.5 bg-green-50 border border-green-200 rounded-md text-green-600 hover:bg-green-100 hover:text-green-700 transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setRepoStatus(null);
                  setFormData({
                    dataName: "", dataDescription: "", dataFormat: "", sourceLink: "", businessArea: "",
                    appName: "", costCenter: "", costCenterApprover: "", systemOwner: "", systemCustodian: "",
                    primaryItContact: "", level1BusinessArea: "", projectCenter: "", dataClassification: "",
                    hipaa: "", sourceGitRepo: "", approverGroup: "", applicationCi: "", publishToMarketplace: "Yes",
                  });
                  setLevel1BusinessAreaOption("");
                  setCurrentStage(1);
                  navigate("/my-ingestion");
                }}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors focus:ring-4 focus:ring-green-300"
              >
                Continue to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-8">
        <div className="bg-[#d52b1e] px-8 py-6 text-white flex items-center gap-3">
          <Database size={28} />
          <div>
            <h1 className="text-2xl font-bold">Start Data Ingestion</h1>
            <p className="text-white/80 text-sm mt-1">
              Register a new data asset into the enterprise catalogue
            </p>
          </div>
        </div>

        <div className="px-8 pb-4">{renderStepper()}</div>

        {/* STAGE 1 */}
        {currentStage === 1 && (
          <form onSubmit={handleNextStage1} className="px-8 pb-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Type size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.dataName}
                  onChange={(e) =>
                    handleInputChange("dataName", e.target.value)
                  }
                  className={`block w-full pl-10 pr-3 py-2.5 border ${
                    errors.dataName ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:ring-[#d52b1e] focus:border-[#d52b1e] sm:text-sm transition-colors`}
                  placeholder="e.g. IQVA Commercials"
                />
              </div>
              {errors.dataName && (
                <p className="mt-1 text-xs text-red-500">{errors.dataName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={formData.dataDescription}
                onChange={(e) =>
                  handleInputChange("dataDescription", e.target.value)
                }
                className={`block w-full p-3 border ${
                  errors.dataDescription ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-[#d52b1e] focus:border-[#d52b1e] sm:text-sm transition-colors`}
                placeholder="Provide a detailed description about the data and how this data is going to be used"
              />
              {errors.dataDescription && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.dataDescription}
                </p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Format <span className="text-red-500">*</span>
              </label>
              <div
                className="relative cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText size={18} className="text-gray-400" />
                </div>
                <div
                  className={`block w-full pl-10 pr-10 py-1.5 border ${
                    errors.dataFormat ? "border-red-500" : "border-gray-300"
                  } bg-white rounded-md shadow-sm sm:text-sm min-h-[24px] flex items-center`}
                >
                  {formData.dataFormat ? (
                    <span className="text-gray-900">{formData.dataFormat}</span>
                  ) : (
                    <span className="text-gray-500">Select format...</span>
                  )}
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown size={18} className="text-gray-400" />
                </div>
              </div>

              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  <div className="px-3 py-2 sticky top-0 bg-white border-b border-gray-100">
                    <input
                      type="text"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#d52b1e] focus:border-[#d52b1e] sm:text-sm p-2 border"
                      placeholder="Search format..."
                      value={formatSearch}
                      onChange={(e) => setFormatSearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  {filteredFormats.length > 0 ? (
                    filteredFormats.map((format) => (
                      <div
                        key={format}
                        className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-red-50 text-gray-900"
                        onClick={() => {
                          handleInputChange("dataFormat", format);
                          setIsDropdownOpen(false);
                          setFormatSearch("");
                        }}
                      >
                        {format}
                      </div>
                    ))
                  ) : (
                    <div className="py-2 pl-3 text-gray-500">
                      No formats found
                    </div>
                  )}
                </div>
              )}
              {errors.dataFormat && (
                <p className="mt-1 text-xs text-red-500">{errors.dataFormat}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data resides at ? (Source File System/DB/S3 Bucket)
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon size={18} className="text-gray-400" />
                </div>
                <input
                  type="url"
                  value={formData.sourceLink}
                  onChange={(e) =>
                    handleInputChange("sourceLink", e.target.value)
                  }
                  className={`block w-full pl-10 pr-3 py-2.5 border ${
                    errors.sourceLink ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:ring-[#d52b1e] focus:border-[#d52b1e] sm:text-sm transition-colors`}
                  placeholder="https://..."
                />
              </div>
              {errors.sourceLink && (
                <p className="mt-1 text-xs text-red-500">{errors.sourceLink}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Area <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.businessArea}
                onChange={(e) =>
                  handleInputChange("businessArea", e.target.value)
                }
                className={`block w-full px-3 py-2.5 border ${
                  errors.businessArea ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-[#d52b1e] focus:border-[#d52b1e] sm:text-sm transition-colors bg-white`}
              >
                <option value="">Select...</option>
                <option value="BU">BU</option>
                <option value="LRL">LRL</option>
                <option value="GS">GS</option>
                <option value="GIS">GIS</option>
                <option value="MQ">MQ</option>
                <option value="AADS">AADS</option>
              </select>
              {errors.businessArea && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.businessArea}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d52b1e]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cursor-pointer px-6 py-2 text-sm font-medium text-white bg-[#d52b1e] border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d52b1e] transition-colors"
              >
                Next Step
              </button>
            </div>
          </form>
        )}

        {/* STAGE 2 */}
        {currentStage === 2 && (
          <form onSubmit={handleNextStage2} className="px-8 pb-8">
            <div className="bg-gray-50/50 p-6 rounded-lg border border-gray-100 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Technical & Ownership Details
              </h3>
              <div className="space-y-1">
                {renderStage2Field(
                  "App Name",
                  "appName",
                  "e.g. aads-edb-core-webapp",
                )}
                {renderStage2Field("Cost Center", "costCenter", "e.g. 12345")}
                {renderStage2Field(
                  "Cost Center Approver",
                  "costCenterApprover",
                  "e.g. John Doe",
                )}
                {renderStage2Field(
                  "System Owner",
                  "systemOwner",
                  "e.g. Jane Smith",
                )}
                {renderStage2Field(
                  "System Custodian",
                  "systemCustodian",
                  "e.g. IT Dept",
                )}
                {renderStage2Field(
                  "Primary IT Contact",
                  "primaryItContact",
                  "e.g. IT Support",
                )}
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 py-3 border-b border-gray-100 last:border-0">
                  <label className="w-full sm:w-1/3 text-sm font-medium text-gray-700 mt-2">
                    Level 1 Business Area{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full sm:w-2/3 space-y-2">
                    <select
                      value={level1BusinessAreaOption}
                      onChange={(e) => {
                        setLevel1BusinessAreaOption(e.target.value);
                        if (e.target.value !== "Other") {
                          handleInputChange(
                            "level1BusinessArea",
                            e.target.value,
                          );
                        } else {
                          handleInputChange("level1BusinessArea", "");
                        }
                      }}
                      className={`block w-full px-3 py-2 border ${
                        errors.level1BusinessArea && !level1BusinessAreaOption
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm focus:ring-[#d52b1e] focus:border-[#d52b1e] sm:text-sm transition-colors bg-white`}
                    >
                      <option value="">Select...</option>
                      <option value="MD IDS">MD IDS</option>
                      <option value="Business Units IDS">
                        Business Units IDS
                      </option>
                      <option value="MQ IDS">MQ IDS</option>
                      <option value="AADS">AADS</option>
                      <option value="Global Info services">
                        Global Info services
                      </option>
                      <option value="Other">Other</option>
                    </select>

                    {level1BusinessAreaOption === "Other" && (
                      <input
                        type="text"
                        value={formData.level1BusinessArea}
                        onChange={(e) =>
                          handleInputChange(
                            "level1BusinessArea",
                            e.target.value,
                          )
                        }
                        placeholder="Please specify"
                        className={`block w-full px-3 py-2 border ${
                          errors.level1BusinessArea
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md shadow-sm focus:ring-[#d52b1e] focus:border-[#d52b1e] sm:text-sm transition-colors`}
                      />
                    )}
                    {errors.level1BusinessArea && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.level1BusinessArea}
                      </p>
                    )}
                  </div>
                </div>
                {renderStage2Field(
                  "Project Center",
                  "projectCenter",
                  "e.g. 67890",
                )}
                {renderSelectField(
                  "Data Classification",
                  "dataClassification",
                  [
                    { value: "green", label: "Green" },
                    { value: "yellow", label: "Yellow" },
                    { value: "orange", label: "Orange" },
                    { value: "red", label: "Red" },
                  ],
                )}
                {renderSelectField("Require Hipaa compliance", "hipaa", [
                  "Yes",
                  "No",
                ])}
                {renderStage2Field(
                  "Source Git Repo",
                  "sourceGitRepo",
                  "https://github.com/... ",
                )}
                {renderStage2Field(
                  "Approver Group",
                  "approverGroup",
                  "e.g. Data Stewards",
                )}
                {renderStage2Field(
                  "Application CI",
                  "applicationCi",
                  "e.g. CI-123",
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStage(1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d52b1e]"
              >
                Back
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClearStage2}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d52b1e]"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="cursor-pointer px-6 py-2 text-sm font-medium text-white bg-[#d52b1e] border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d52b1e] transition-colors"
                >
                  Proceed to Last Step
                </button>
              </div>
            </div>
          </form>
        )}

        {/* STAGE 3 */}
        {currentStage === 3 && (
          <form onSubmit={handleNextStage3} className="px-8 pb-8">
            <div className="bg-gray-50/50 p-8 rounded-lg border border-gray-100 mb-6 text-center">
              <h3 className="text-xl font-medium text-gray-900 mb-6">
                Do you want to publish this data in marketplace?
              </h3>

              <div className="flex justify-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer p-4 border border-gray-200 rounded-lg hover:border-[#d52b1e] hover:bg-red-50 transition-colors w-32 justify-center">
                  <input
                    type="radio"
                    name="publish"
                    value="Yes"
                    checked={formData.publishToMarketplace === "Yes"}
                    onChange={(e) =>
                      handleInputChange("publishToMarketplace", e.target.value)
                    }
                    className="w-4 h-4 text-[#d52b1e] focus:ring-[#d52b1e]"
                  />
                  <span className="text-gray-900 font-medium">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-4 border border-gray-200 rounded-lg hover:border-[#d52b1e] hover:bg-red-50 transition-colors w-32 justify-center">
                  <input
                    type="radio"
                    name="publish"
                    value="No"
                    checked={formData.publishToMarketplace === "No"}
                    onChange={(e) =>
                      handleInputChange("publishToMarketplace", e.target.value)
                    }
                    className="w-4 h-4 text-[#d52b1e] focus:ring-[#d52b1e]"
                  />
                  <span className="text-gray-900 font-medium">No</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStage(2)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d52b1e]"
              >
                Back
              </button>
              <button
                type="submit"
                className="cursor-pointer px-8 py-2 text-sm font-bold text-white bg-[#d52b1e] border border-transparent rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d52b1e] transition-colors"
              >
                Review Details
              </button>
            </div>
          </form>
        )}

        {/* STAGE 4 - Review Summary */}
        {currentStage === 4 && (
          <form onSubmit={handleFinalSubmit} className="px-8 pb-8">
            <div className="bg-gray-50/50 p-6 rounded-lg border border-gray-100 mb-6 space-y-6 text-sm">
              <div>
                <h4 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3 text-base">
                  Basic Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-500">Name:</span>{" "}
                    <span className="text-gray-900 block mt-1">
                      {formData.dataName}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Format:</span>{" "}
                    <span className="text-gray-900 block mt-1">
                      {formData.dataFormat}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">
                      Business Area:
                    </span>{" "}
                    <span className="text-gray-900 block mt-1">
                      {formData.businessArea}
                    </span>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <span className="font-medium text-gray-500">
                      Description:
                    </span>{" "}
                    <span className="text-gray-900 block mt-1">
                      {formData.dataDescription}
                    </span>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <span className="font-medium text-gray-500">Source:</span>{" "}
                    <span className="text-gray-900 break-all block mt-1">
                      {formData.sourceLink}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3 text-base">
                  Technical & Ownership Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <span className="font-medium text-gray-500">App Name:</span>{" "}
                    <span className="text-gray-900 block mt-1">
                      {formData.appName}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">App CI:</span>{" "}
                    <span className="text-gray-900 block mt-1">
                      {formData.applicationCi}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">
                      Cost Center:
                    </span>{" "}
                    <span className="text-gray-900 block mt-1">
                      {formData.costCenter}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">
                      Project Center:
                    </span>{" "}
                    <span className="text-gray-900 block mt-1">
                      {formData.projectCenter}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">
                      System Owner:
                    </span>{" "}
                    <span className="text-gray-900 block mt-1">
                      {formData.systemOwner}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">
                      System Custodian:
                    </span>{" "}
                    <span className="text-gray-900 block mt-1">
                      {formData.systemCustodian}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">HIPAA:</span>{" "}
                    <span className="text-gray-900 block mt-1">
                      {formData.hipaa}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">
                      Data Classification:
                    </span>{" "}
                    <span className="text-gray-900 block mt-1">
                      {formData.dataClassification}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3 text-base">
                  Marketplace
                </h4>
                <div className="flex items-center mt-2">
                  <span className="font-medium text-gray-500">
                    Publish to Marketplace:
                  </span>
                  <span
                    className={`ml-3 px-2.5 py-1 rounded-md text-xs font-bold ${formData.publishToMarketplace === "Yes" ? "bg-green-100 text-green-800 border border-green-200" : "bg-gray-100 text-gray-800 border border-gray-200"}`}
                  >
                    {formData.publishToMarketplace}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStage(3)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d52b1e]"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isCreatingRepo}
                className="cursor-pointer flex items-center justify-center min-w-[140px] px-8 py-2 text-sm font-bold text-white bg-[#d52b1e] border border-transparent rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d52b1e] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isCreatingRepo ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Creating Repo...
                  </>
                ) : (
                  "Final Submit"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default StartDataIngestion;
