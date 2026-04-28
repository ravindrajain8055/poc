import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Database,
  Link as LinkIcon,
  FileText,
  Type,
  ChevronDown,
  CheckCircle2,
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
    setErrors({});
  };

  const handleNextStage3 = (e) => {
    e.preventDefault();
    setCurrentStage(4);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem("ingestions") || "[]");
    const newSubmission = {
      ...formData,
      id: `ING-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split("T")[0],
      currentStage: "approval",
    };
    localStorage.setItem(
      "ingestions",
      JSON.stringify([...existing, newSubmission]),
    );

    setShowToast(true);
    setTimeout(() => {
      // Reset form
      setFormData({
        dataName: "",
        dataDescription: "",
        dataFormat: "",
        sourceLink: "",
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
        publishToMarketplace: "Yes",
      });
      setCurrentStage(1);
      navigate("/my-ingestion");
    }, 2000);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const renderStepper = () => {
    const steps = ["Basic Details", "Technical Details", "Marketplace", "Review"];
    return (
      <div className="flex justify-center items-center mb-6 px-4 mt-2">
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

  return (
    <div className="min-h-full bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {showToast && (
        <Toast
          message="Data ingestion submitted successfully!"
          type="success"
          onClose={() => setShowToast(false)}
        />
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
                  placeholder="e.g. Sales Q3 Report"
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
                placeholder="Provide a detailed description of the dataset contents..."
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
                  className={`block w-full pl-10 pr-10 py-2.5 border ${
                    errors.dataFormat ? "border-red-500" : "border-gray-300"
                  } bg-white rounded-md shadow-sm sm:text-sm min-h-[42px] flex items-center`}
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
                Data resides at / Source link{" "}
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
                {renderStage2Field(
                  "Level 1 Business Area",
                  "level1BusinessArea",
                  "e.g. AADS",
                )}
                {renderStage2Field(
                  "Project Center",
                  "projectCenter",
                  "e.g. 67890",
                )}
                {renderStage2Field(
                  "Data Classification",
                  "dataClassification",
                  "e.g. Yellow/Green",
                )}
                {renderStage2Field("HIPAA", "hipaa", "Yes/No")}
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
                <h4 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3 text-base">Basic Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><span className="font-medium text-gray-500">Name:</span> <span className="text-gray-900 block mt-1">{formData.dataName}</span></div>
                  <div><span className="font-medium text-gray-500">Format:</span> <span className="text-gray-900 block mt-1">{formData.dataFormat}</span></div>
                  <div className="col-span-1 md:col-span-2"><span className="font-medium text-gray-500">Description:</span> <span className="text-gray-900 block mt-1">{formData.dataDescription}</span></div>
                  <div className="col-span-1 md:col-span-2"><span className="font-medium text-gray-500">Source:</span> <span className="text-gray-900 break-all block mt-1">{formData.sourceLink}</span></div>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3 text-base">Technical & Ownership Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div><span className="font-medium text-gray-500">App Name:</span> <span className="text-gray-900 block mt-1">{formData.appName}</span></div>
                  <div><span className="font-medium text-gray-500">App CI:</span> <span className="text-gray-900 block mt-1">{formData.applicationCi}</span></div>
                  <div><span className="font-medium text-gray-500">Cost Center:</span> <span className="text-gray-900 block mt-1">{formData.costCenter}</span></div>
                  <div><span className="font-medium text-gray-500">Project Center:</span> <span className="text-gray-900 block mt-1">{formData.projectCenter}</span></div>
                  <div><span className="font-medium text-gray-500">System Owner:</span> <span className="text-gray-900 block mt-1">{formData.systemOwner}</span></div>
                  <div><span className="font-medium text-gray-500">System Custodian:</span> <span className="text-gray-900 block mt-1">{formData.systemCustodian}</span></div>
                  <div><span className="font-medium text-gray-500">HIPAA:</span> <span className="text-gray-900 block mt-1">{formData.hipaa}</span></div>
                  <div><span className="font-medium text-gray-500">Data Classification:</span> <span className="text-gray-900 block mt-1">{formData.dataClassification}</span></div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3 text-base">Marketplace</h4>
                <div className="flex items-center mt-2">
                  <span className="font-medium text-gray-500">Publish to Marketplace:</span> 
                  <span className={`ml-3 px-2.5 py-1 rounded-md text-xs font-bold ${formData.publishToMarketplace === 'Yes' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-gray-100 text-gray-800 border border-gray-200'}`}>{formData.publishToMarketplace}</span>
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
                className="cursor-pointer px-8 py-2 text-sm font-bold text-white bg-[#d52b1e] border border-transparent rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d52b1e] transition-colors"
              >
                Final Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default StartDataIngestion;
