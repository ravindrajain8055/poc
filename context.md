This file is a merged representation of a subset of the codebase, containing specifically included files, combined into a single document by Repomix.

<file_summary>
This section contains a summary of this file.

<purpose>
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.
</purpose>

<file_format>
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  - File path as an attribute
  - Full contents of the file
</file_format>

<usage_guidelines>
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.
</usage_guidelines>

<notes>
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: src/**/*.{js,jsx,ts,tsx}
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)
</notes>

</file_summary>

<directory_structure>
src/App.jsx
src/components/chat/Chatbot.jsx
src/components/layout/MainLayout.jsx
src/components/layout/Sidebar.jsx
src/components/ui/Toast.jsx
src/data/mockResources.js
src/main.jsx
src/pages/DemoPage.jsx
src/pages/Home.jsx
src/pages/MyIngestionStatus.jsx
src/pages/StartDataIngestion.jsx
</directory_structure>

<files>
This section contains the contents of the repository's files.

<file path="src/components/layout/MainLayout.jsx">
import React from 'react';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
</file>

<file path="src/components/ui/Toast.jsx">
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 min-w-[300px] bg-white border border-gray-200 rounded-lg shadow-xl p-4 flex items-start gap-3"
      >
        {type === 'success' ? (
          <CheckCircle2 className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
        ) : (
          <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
        )}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={16} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
</file>

<file path="src/data/mockResources.js">
export const mockResources = [
  { id: 1, title: "Enterprise Data Strategy 2026", type: "Document", link: "#" },
  { id: 2, title: "Data Catalog User Guide", type: "PDF", link: "#" },
  { id: 3, title: "API Reference for Analytics", type: "Documentation", link: "#" },
  { id: 4, title: "Metadata Manager Onboarding", type: "Video", link: "#" },
];
</file>

<file path="src/main.jsx">
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
</file>

<file path="src/pages/DemoPage.jsx">
import React from 'react';
import { Sparkles } from 'lucide-react';

const DemoPage = () => {
  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-800">Demo Page</h1>
        <p className="text-gray-500 mt-2">This is a proof-of-concept page to demonstrate routing and layout.</p>
      </div>
      
      <div className="p-8 flex-1 flex flex-col items-center justify-center">
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 text-[#d52b1e] rounded-full flex items-center justify-center mb-6">
            <Sparkles size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">You found the demo page!</h2>
          <p className="text-gray-500 mb-6">
            This area could be populated with forms, data tables, dashboards, or any other enterprise feature required.
          </p>
          <button className="bg-[#d52b1e] hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md transition-colors shadow-sm">
            Explore Features
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
</file>

<file path="src/pages/MyIngestionStatus.jsx">
import React from 'react';
import { Activity, CheckCircle2, Clock, Code, Send, LayoutTemplate } from 'lucide-react';

const STAGES = [
  { id: 'approval', label: 'Approval', icon: Clock },
  { id: 'development', label: 'Development', icon: Code },
  { id: 'testing', label: 'Testing', icon: Activity },
  { id: 'deploy', label: 'Deploy', icon: Send }
];

const DUMMY_INGESTIONS = [
  {
    id: 'ING-001',
    name: 'Sales Q3 Report',
    description: 'Quarterly sales figures and analysis for Q3 2025.',
    format: 'Excel',
    source: 'https://internal.lilly.com/data/sales-q3',
    currentStage: 'approval',
    date: '2026-04-26'
  },
  {
    id: 'ING-002',
    name: 'Patient Demographics',
    description: 'Anonymized patient demographic data for recent trials.',
    format: 'Parquet',
    source: 's3://lilly-clinical-data/demographics/',
    currentStage: 'deploy',
    date: '2026-04-20'
  }
];

const ProgressTracker = ({ currentStageId }) => {
  const currentIndex = STAGES.findIndex(s => s.id === currentStageId);
  
  return (
    <div className="flex items-center w-full max-w-sm">
      {STAGES.map((stage, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const Icon = isCompleted ? CheckCircle2 : stage.icon;
        
        return (
          <React.Fragment key={stage.id}>
            <div className="flex flex-col items-center relative group">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 bg-white
                  ${isCompleted ? 'border-green-500 text-green-500' : 
                    isCurrent ? 'border-[#d52b1e] text-[#d52b1e]' : 
                    'border-gray-200 text-gray-400'}`}
              >
                <Icon size={14} className={isCompleted ? 'text-green-500' : ''} />
              </div>
              <span className={`absolute -bottom-5 text-[10px] whitespace-nowrap font-medium
                ${isCurrent ? 'text-[#d52b1e]' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}
              >
                {stage.label}
              </span>
            </div>
            {index < STAGES.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1
                ${index < currentIndex ? 'bg-green-500' : 'bg-gray-200'}`} 
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const MyIngestionStatus = () => {
  return (
    <div className="min-h-full bg-gray-50 flex flex-col py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full">
        
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
            <LayoutTemplate className="text-[#d52b1e]" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My ingestion</h1>
            <p className="text-gray-500 text-sm">Track the status of your data assets</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  <th className="p-4 pl-6">Data Name & ID</th>
                  <th className="p-4 hidden md:table-cell">Format</th>
                  <th className="p-4 hidden lg:table-cell">Source</th>
                  <th className="p-4 min-w-[300px]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {DUMMY_INGESTIONS.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.id} • {item.date}</div>
                      <div className="text-xs text-gray-400 mt-1 truncate max-w-[200px]" title={item.description}>
                        {item.description}
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {item.format}
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <a href={item.source} className="text-sm text-blue-600 hover:underline truncate max-w-[150px] inline-block" target="_blank" rel="noopener noreferrer">
                        {item.source}
                      </a>
                    </td>
                    <td className="p-4 pb-8">
                      <ProgressTracker currentStageId={item.currentStage} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {DUMMY_INGESTIONS.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No ingestion requests found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyIngestionStatus;
</file>

<file path="src/pages/StartDataIngestion.jsx">
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Database, Link as LinkIcon, FileText, Type, ChevronDown } from 'lucide-react';
import Toast from '../components/ui/Toast';

const FORMAT_OPTIONS = [
  'PPT',
  'Image',
  'Excel',
  'Word',
  'PDF',
  'CSV',
  'JSON',
  'Parquet',
  'SQL Dump',
  'Other'
];

const StartDataIngestion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    dataName: location.state?.prefillDataName || '',
    dataDescription: location.state?.prefillDataDescription || '',
    dataFormat: '',
    sourceLink: ''
  });
  
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formatSearch, setFormatSearch] = useState('');

  const filteredFormats = FORMAT_OPTIONS.filter(format => 
    format.toLowerCase().includes(formatSearch.toLowerCase())
  );

  const validateForm = () => {
    const newErrors = {};
    if (!formData.dataName.trim()) newErrors.dataName = 'Data Name is required';
    if (!formData.dataDescription.trim()) newErrors.dataDescription = 'Data Description is required';
    if (!formData.dataFormat) newErrors.dataFormat = 'Data Format is required';
    if (!formData.sourceLink.trim()) newErrors.sourceLink = 'Source Link is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowToast(true);
      setTimeout(() => {
        navigate('/my-ingestion');
      }, 2000); // Wait for toast before redirect
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-full bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {showToast && (
        <Toast 
          message="Data ingestion started successfully!" 
          type="success"
          onClose={() => setShowToast(false)} 
        />
      )}
      
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="bg-[#d52b1e] px-8 py-6 text-white flex items-center gap-3">
          <Database size={28} />
          <div>
            <h1 className="text-2xl font-bold">Start Data Ingestion</h1>
            <p className="text-white/80 text-sm mt-1">Register a new data asset into the enterprise catalogue</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Data Name */}
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
                onChange={(e) => handleInputChange('dataName', e.target.value)}
                className={`block w-full pl-10 pr-3 py-2.5 border ${errors.dataName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-[#d52b1e] focus:border-[#d52b1e] sm:text-sm transition-colors`}
                placeholder="e.g. Sales Q3 Report"
              />
            </div>
            {errors.dataName && <p className="mt-1 text-xs text-red-500">{errors.dataName}</p>}
          </div>

          {/* Data Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={formData.dataDescription}
              onChange={(e) => handleInputChange('dataDescription', e.target.value)}
              className={`block w-full p-3 border ${errors.dataDescription ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-[#d52b1e] focus:border-[#d52b1e] sm:text-sm transition-colors`}
              placeholder="Provide a detailed description of the dataset contents..."
            />
            {errors.dataDescription && <p className="mt-1 text-xs text-red-500">{errors.dataDescription}</p>}
          </div>

          {/* Data Format (Searchable Dropdown) */}
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
              <div className={`block w-full pl-10 pr-10 py-2.5 border ${errors.dataFormat ? 'border-red-500' : 'border-gray-300'} bg-white rounded-md shadow-sm sm:text-sm min-h-[42px] flex items-center`}>
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
                        handleInputChange('dataFormat', format);
                        setIsDropdownOpen(false);
                        setFormatSearch('');
                      }}
                    >
                      {format}
                    </div>
                  ))
                ) : (
                  <div className="py-2 pl-3 text-gray-500">No formats found</div>
                )}
              </div>
            )}
            {errors.dataFormat && <p className="mt-1 text-xs text-red-500">{errors.dataFormat}</p>}
          </div>

          {/* Source Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data resides at / Source link <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon size={18} className="text-gray-400" />
              </div>
              <input
                type="url"
                value={formData.sourceLink}
                onChange={(e) => handleInputChange('sourceLink', e.target.value)}
                className={`block w-full pl-10 pr-3 py-2.5 border ${errors.sourceLink ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-[#d52b1e] focus:border-[#d52b1e] sm:text-sm transition-colors`}
                placeholder="https://..."
              />
            </div>
            {errors.sourceLink && <p className="mt-1 text-xs text-red-500">{errors.sourceLink}</p>}
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
              className="px-6 py-2 text-sm font-medium text-white bg-[#d52b1e] border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d52b1e] transition-colors"
            >
              Submit Ingestion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StartDataIngestion;
</file>

<file path="src/components/chat/Chatbot.jsx">
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, FileText, Database } from 'lucide-react';
import { mockResources } from '../../data/mockResources';

const Chatbot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [query, setQuery] = useState('');
  const [searchedQuery, setSearchedQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Listen for external toggle events
  useEffect(() => {
    const handleToggle = () => setIsOpen(true);
    window.addEventListener('toggle-chatbot', handleToggle);
    return () => window.removeEventListener('toggle-chatbot', handleToggle);
  }, []);

  const handleSearch = () => {
    const q = query.trim();
    if (!q) return;

    setSearchedQuery(q);
    setIsSearching(true);
    setHasSearched(true);
    
    // Simulate API Call delay
    // TODO: [LLM_INTEGRATION] Replace this mock implementation and fallback logic with actual backend API/LLM call.
    /*
      Example backend integration:
      fetch(`/api/search/ai?q=${encodeURIComponent(q)}`)
        .then(res => res.json())
        .then(data => { setResults(data.resources); setIsSearching(false); })
    */
    setTimeout(() => {
      const lowerQuery = q.toLowerCase();
      const filtered = mockResources.filter(resource => 
        resource.title.toLowerCase().includes(lowerQuery) || 
        resource.type.toLowerCase().includes(lowerQuery)
      );
      setResults(filtered);
      setIsSearching(false);
      setQuery(''); // clear input after search
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleNavigateToIngestion = () => {
    setIsOpen(false);
    navigate('/data-ingestion', { 
      state: { 
        prefillDataName: searchedQuery,
        prefillDataDescription: `Generated from search query: ${searchedQuery}`
      } 
    });
  };

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col z-50"
            style={{ height: '520px' }}
          >
            {/* Header */}
            <div className="bg-[#d52b1e] p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageSquare size={20} />
                <h3 className="font-semibold">Resource Assistant</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-1 rounded-md transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-5">
              {/* Initial message */}
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-[#d52b1e] flex items-center justify-center text-white flex-shrink-0 mt-1">
                  <MessageSquare size={16} />
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm text-sm text-gray-700">
                  Hi! I can help you find resources and documents. What are you looking for today?
                </div>
              </div>

              {/* User search query bubble */}
              {hasSearched && searchedQuery && (
                <div className="flex gap-2 justify-end">
                  <div className="bg-[#d52b1e] p-3 rounded-2xl rounded-tr-sm shadow-sm text-sm text-white max-w-[80%] break-words">
                    {searchedQuery}
                  </div>
                </div>
              )}

              {/* Loading Indicator */}
              {isSearching && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#d52b1e] flex items-center justify-center text-white flex-shrink-0 mt-1">
                    <MessageSquare size={16} />
                  </div>
                  <div className="bg-white p-3 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm text-sm text-gray-500 italic flex gap-1">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce delay-100">.</span>
                    <span className="animate-bounce delay-200">.</span>
                  </div>
                </div>
              )}

              {/* Results & Fallback */}
              {!isSearching && hasSearched && (
                results.length > 0 ? (
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#d52b1e] flex items-center justify-center text-white flex-shrink-0 mt-1">
                      <MessageSquare size={16} />
                    </div>
                    <div className="bg-white p-3 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm w-full">
                      <p className="text-sm text-gray-700 mb-2 font-medium">I found these resources:</p>
                      <div className="space-y-2">
                        {results.map((res) => (
                          <a 
                            key={res.id} 
                            href={res.link}
                            className="flex items-start gap-2 p-2 rounded-md hover:bg-gray-50 border border-gray-100 transition-colors"
                          >
                            <FileText size={16} className="text-[#d52b1e] mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-800 leading-tight">{res.title}</p>
                              <p className="text-xs text-gray-500 mt-1">{res.type}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#d52b1e] flex items-center justify-center text-white flex-shrink-0 mt-1">
                      <MessageSquare size={16} />
                    </div>
                    <div className="bg-white p-3 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm w-full">
                      <p className="text-sm text-gray-700 mb-3">
                        I couldn't find an exact match for your query. Based on your input, the <strong>File Ingestion Core Component</strong> seems most relevant.
                      </p>
                      <p className="text-sm text-gray-700 mb-4">
                        Let me know if you'd like to proceed. I can redirect you to Data Ingestion to register this.
                      </p>
                      
                      {/* CTA Button */}
                      <button 
                        onClick={handleNavigateToIngestion}
                        className="w-full flex items-center justify-center gap-2 bg-[#d52b1e] hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium transition-colors text-sm"
                      >
                        <Database size={16} />
                        Start Data Ingestion
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-200">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask or search resources..."
                  className="w-full pl-4 pr-10 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-[#d52b1e] focus:ring-1 focus:ring-[#d52b1e] text-sm transition-all"
                />
                <button 
                  className="absolute right-2 p-2 bg-[#d52b1e] text-white rounded-full hover:bg-red-700 transition-colors"
                  onClick={handleSearch}
                >
                  <Send size={14} />
                </button>
              </div>
              <div className="text-center mt-2">
                <span className="text-[10px] text-gray-400">Powered by AI Search</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-[#d52b1e] rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white/20 z-50 group"
          >
            <MessageSquare size={24} className="group-hover:animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
</file>

<file path="src/components/layout/Sidebar.jsx">
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  ChevronDown, 
  ChevronRight, 
  Store, 
  PanelLeftClose, 
  PanelLeftOpen, 
  FileText, 
  ExternalLink 
} from 'lucide-react';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    getStarted: false,
    myWork: false,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <motion.aside
      initial={{ width: 250 }}
      animate={{ width: isExpanded ? 250 : 64 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen bg-gray-100 border-r border-gray-200 flex flex-col flex-shrink-0 relative"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:bg-gray-50 z-10"
      >
        {isExpanded ? <PanelLeftClose size={16} className="text-gray-600" /> : <PanelLeftOpen size={16} className="text-gray-600" />}
      </button>

      {/* Logo Area */}
      <div className="p-4 flex items-center gap-2 h-16">
        <div className="text-lilly-red font-bold text-xl flex-shrink-0 italic" style={{ fontFamily: 'serif' }}>Lilly</div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-gray-800 font-semibold whitespace-nowrap"
            >
              data.lilly.com
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User Profile */}
      <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-200 mb-2">
        <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
          RJ
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col"
            >
              <span className="text-sm text-gray-800 leading-tight">Ravindra</span>
              <span className="text-sm text-gray-800 leading-tight">Jain</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1">
        {/* Home */}
        <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 px-2 py-2 rounded-md hover:bg-gray-200 text-gray-700 ${isActive ? 'bg-gray-200 font-medium' : ''}`}>
          <Home size={18} className="flex-shrink-0 text-lilly-red" />
          {isExpanded && <span>Home</span>}
        </NavLink>

        {/* Get Started Accordion */}
        <div>
          <button 
            onClick={() => toggleSection('getStarted')}
            className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-gray-200 text-gray-700"
          >
            <div className="flex items-center gap-3">
              <FileText size={18} className="flex-shrink-0 text-gray-500" />
              {isExpanded && <span>Get started</span>}
            </div>
            {isExpanded && (
              expandedSections.getStarted ? <ChevronDown size={16} /> : <ChevronRight size={16} />
            )}
          </button>
          <AnimatePresence>
            {isExpanded && expandedSections.getStarted && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="pl-9 pr-2 overflow-hidden"
              >
                <div className="py-1 flex flex-col gap-1">
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900 py-1">Quick Tour</a>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900 py-1">Documentation</a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* My Work Accordion */}
        <div>
          <button 
            onClick={() => toggleSection('myWork')}
            className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-gray-200 text-gray-700"
          >
            <div className="flex items-center gap-3">
              <FileText size={18} className="flex-shrink-0 text-gray-500" />
              {isExpanded && <span>My work</span>}
            </div>
            {isExpanded && (
              expandedSections.myWork ? <ChevronDown size={16} /> : <ChevronRight size={16} />
            )}
          </button>
          <AnimatePresence>
            {isExpanded && expandedSections.myWork && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="pl-9 pr-2 overflow-hidden"
              >
                <div className="py-1 flex flex-col gap-1">
                  <NavLink 
                    to="/my-ingestion" 
                    className={({ isActive }) => `block text-sm py-1.5 ${isActive ? 'text-[#d52b1e] font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    My ingestion status
                  </NavLink>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Marketplace */}
        <NavLink to="/marketplace" className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-gray-200 text-gray-700">
          <Store size={18} className="flex-shrink-0 text-gray-500" />
          {isExpanded && <span>Marketplace</span>}
        </NavLink>

        {/* Custom POC Links */}
        <div className="pt-4 mt-4 border-t border-gray-200">
          {isExpanded && <div className="px-2 mb-2 text-xs font-semibold text-gray-400 uppercase">POC Features</div>}
          <NavLink to="/demo" className={({ isActive }) => `flex items-center gap-3 px-2 py-2 rounded-md hover:bg-gray-200 text-gray-700 ${isActive ? 'bg-gray-200 font-medium' : ''}`}>
            <ExternalLink size={18} className="flex-shrink-0 text-gray-500" />
            {isExpanded && <span>Demo Page</span>}
          </NavLink>
        </div>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
</file>

<file path="src/pages/Home.jsx">
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Filter,
  Box,
  Database,
  Bot,
  ChevronRight,
} from "lucide-react";

const DUMMY_RESULTS = [
  {
    id: 1,
    title: "PR review EDB",
    description:
      "Standard operating procedure for performing PR reviews on Enterprise Data components.",
  },
  {
    id: 2,
    title: "EDB core components",
    description:
      "Documentation and repository links for the core foundational elements of the Enterprise Database.",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchState, setSearchState] = useState("idle"); // 'idle', 'results', 'no-results'

  const handleSearch = () => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      setSearchState("idle");
      return;
    }

    // Dummy matching logic
    if (
      q.includes("pr") ||
      q.includes("review") ||
      q.includes("edb") ||
      q.includes("component")
    ) {
      setSearchState("results");
    } else {
      setSearchState("no-results");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const openChatbot = () => {
    // Custom event to trigger chatbot from anywhere
    window.dispatchEvent(new Event("toggle-chatbot"));
  };

  const renderActionButtons = (compact = false) => (
    <div
      className={`flex gap-4 ${compact ? "justify-center z-10 relative -mb-4" : "justify-center w-full"}`}
    >
      <button
        onClick={() => navigate("/data-ingestion")}
        className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#d52b1e] text-gray-800 px-5 py-3 rounded-lg font-medium transition-all group"
      >
        <Database
          size={18}
          className="text-[#d52b1e] group-hover:scale-110 transition-transform"
        />
        Start data ingestion
      </button>
      <button
        onClick={openChatbot}
        className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-500 text-gray-800 px-5 py-3 rounded-lg font-medium transition-all group"
      >
        <Bot
          size={18}
          className="text-blue-500 group-hover:scale-110 transition-transform"
        />
        Can't find it? Try AI search
      </button>
    </div>
  );

  return (
    <div className="flex flex-col min-h-full bg-white">
      {/* Hero Section */}
      <div className="bg-[#d52b1e] w-full px-8 py-12 flex flex-col items-center justify-center relative">
        <div className="w-full max-w-5xl z-10">
          <h1 className="text-white text-5xl font-bold mb-4 tracking-tight">
            Welcome to <span className="font-extrabold">Enterprise Data</span>
          </h1>
          <p className="text-white text-lg font-medium mb-10 tracking-wide opacity-90">
            A Catalogue of technical products, to assist you in achieving your
            goals.
          </p>

          {/* Search Bar Container */}
          <div className="flex gap-4 w-full">
            <div className="relative flex-1 flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Start browsing our Marketplace for products..."
                className="w-full bg-white text-gray-800 rounded-md py-4 pl-6 pr-12 text-lg focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchState("idle");
                  }}
                  className="absolute right-14 text-gray-400 hover:text-gray-600 p-2"
                >
                  <X size={20} />
                </button>
              )}
              <button
                onClick={handleSearch}
                className="absolute right-2 bg-white text-gray-500 hover:text-gray-800 p-2 rounded-md transition-colors"
              >
                <Search size={24} />
              </button>
            </div>
            <button className="bg-[#e8e8e8] text-gray-800 px-6 py-4 rounded-md font-semibold flex items-center gap-2 hover:bg-gray-200 transition-colors shadow-lg">
              Filter by <Filter size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="w-full bg-gray-50 flex-1 py-12 px-8 flex justify-center relative">
        <div className="w-full max-w-5xl flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {searchState === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {/* Action Card 1 */}
                <button className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center gap-4 hover:shadow-md transition-all group">
                  <Box
                    size={32}
                    className="text-[#d52b1e] group-hover:scale-110 transition-transform"
                  />
                  <span className="font-medium text-gray-800 text-sm">
                    Your Favourites
                  </span>
                </button>
              </motion.div>
            )}

            {searchState === "no-results" && (
              <motion.div
                key="no-results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-8 gap-8"
              >
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-800">
                    No matching products found
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Try adjusting your search terms or explore these options.
                  </p>
                </div>
                {renderActionButtons()}
              </motion.div>
            )}

            {searchState === "results" && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col gap-6"
              >
                {/* Unsatisfied state actions - subtle and compact */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {renderActionButtons(true)}
                </motion.div>

                <h3 className="text-lg font-semibold text-gray-800 pt-2 border-b border-gray-200 pb-2">
                  Search Results
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {DUMMY_RESULTS.map((result, i) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -4 }}
                      className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden flex flex-col"
                    >
                      {/* Animated left accent border */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#d52b1e] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300"></div>

                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-bold text-[#d52b1e] group-hover:text-red-700 transition-colors">
                          {result.title}
                        </h4>
                        <ChevronRight
                          size={18}
                          className="text-gray-400 group-hover:text-[#d52b1e] group-hover:translate-x-1 transition-all"
                        />
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                        {result.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 px-8 text-center text-sm text-gray-500 mt-auto">
        &copy; {new Date().getFullYear()} Eli Lilly and Company. All rights
        reserved.
      </footer>
    </div>
  );
};

export default Home;
</file>

<file path="src/App.jsx">
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import DemoPage from './pages/DemoPage';
import StartDataIngestion from './pages/StartDataIngestion';
import MyIngestionStatus from './pages/MyIngestionStatus';
import Chatbot from './components/chat/Chatbot';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/marketplace" element={<DemoPage />} />
          <Route path="/data-ingestion" element={<StartDataIngestion />} />
          <Route path="/my-ingestion" element={<MyIngestionStatus />} />
        </Routes>
        <Chatbot />
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
</file>

</files>
