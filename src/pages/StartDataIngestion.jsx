import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Database,
  Link as LinkIcon,
  FileText,
  Type,
  ChevronDown,
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

  const [formData, setFormData] = useState({
    dataName: location.state?.prefillDataName || "",
    dataDescription: location.state?.prefillDataDescription || "",
    dataFormat: "",
    sourceLink: "",
  });

  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formatSearch, setFormatSearch] = useState("");

  const filteredFormats = FORMAT_OPTIONS.filter((format) =>
    format.toLowerCase().includes(formatSearch.toLowerCase()),
  );

  const validateForm = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowToast(true);
      setTimeout(() => {
        navigate("/my-ingestion");
      }, 2000); // Wait for toast before redirect
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
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
            <p className="text-white/80 text-sm mt-1">
              Register a new data asset into the enterprise catalogue
            </p>
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
                onChange={(e) => handleInputChange("dataName", e.target.value)}
                className={`block w-full pl-10 pr-3 py-2.5 border ${errors.dataName ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:ring-[#d52b1e] focus:border-[#d52b1e] sm:text-sm transition-colors`}
                placeholder="e.g. IQVA commercials"
              />
            </div>
            {errors.dataName && (
              <p className="mt-1 text-xs text-red-500">{errors.dataName}</p>
            )}
          </div>

          {/* Data Description */}
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
              className={`block w-full p-3 border ${errors.dataDescription ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:ring-[#d52b1e] focus:border-[#d52b1e] sm:text-sm transition-colors`}
              placeholder="Provide a detailed description about what the data is & how is it going to be used"
            />
            {errors.dataDescription && (
              <p className="mt-1 text-xs text-red-500">
                {errors.dataDescription}
              </p>
            )}
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
              <div
                className={`block w-full pl-10 pr-10 py-2.5 border ${errors.dataFormat ? "border-red-500" : "border-gray-300"} bg-white rounded-md shadow-sm sm:text-sm min-h-[42px] flex items-center`}
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

          {/* Source Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data resides at / Source File System/DB/AWS S3, etc{" "}
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
                className={`block w-full pl-10 pr-3 py-2.5 border ${errors.sourceLink ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:ring-[#d52b1e] focus:border-[#d52b1e] sm:text-sm transition-colors`}
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
      </div>
    </div>
  );
};

export default StartDataIngestion;
