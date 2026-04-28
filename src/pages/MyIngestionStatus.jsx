import React, { useState, useEffect } from "react";
import {
  Activity,
  CheckCircle2,
  Clock,
  Code,
  Send,
  LayoutTemplate,
  Database,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const STAGES = [
  { id: "approval", label: "Approval", icon: Clock },
  { id: "development", label: "Development", icon: Code },
  { id: "testing", label: "Testing", icon: Activity },
  { id: "deploy", label: "Deploy", icon: Send },
];

const ProgressTracker = ({ currentStageId }) => {
  const currentIndex = STAGES.findIndex((s) => s.id === currentStageId);

  return (
    <div className="flex items-center w-full max-w-sm mt-4">
      {STAGES.map((stage, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const Icon = isCompleted ? CheckCircle2 : stage.icon;

        return (
          <React.Fragment key={stage.id}>
            <div className="flex flex-col items-center relative group">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 bg-white
                  ${
                    isCompleted
                      ? "border-green-500 text-green-500"
                      : isCurrent
                        ? "border-[#d52b1e] text-[#d52b1e]"
                        : "border-gray-200 text-gray-400"
                  }`}
              >
                <Icon
                  size={14}
                  className={isCompleted ? "text-green-500" : ""}
                />
              </div>
              <span
                className={`absolute -bottom-5 text-[10px] whitespace-nowrap font-medium
                ${isCurrent ? "text-[#d52b1e]" : isCompleted ? "text-gray-700" : "text-gray-400"}`}
              >
                {stage.label}
              </span>
            </div>
            {index < STAGES.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1
                ${index < currentIndex ? "bg-green-500" : "bg-gray-200"}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const MyIngestionStatus = () => {
  const [ingestions, setIngestions] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    // Read from localStorage or use fallback if empty
    const stored = JSON.parse(localStorage.getItem("ingestions") || "[]");

    if (stored.length === 0) {
      // Provide some default dummy data to show if localStorage is empty
      const dummyData = [
        {
          id: "ING-001",
          dataName: "Sales Q3 Report",
          dataDescription: "Quarterly sales figures and analysis for Q3 2025.",
          dataFormat: "Excel",
          sourceLink: "https://internal.lilly.com/data/sales-q3",
          currentStage: "approval",
          date: "2026-04-26",
          publishToMarketplace: "Yes",
        },
        {
          id: "ING-002",
          dataName: "Patient Demographics",
          dataDescription:
            "Anonymized patient demographic data for recent trials.",
          dataFormat: "Parquet",
          sourceLink: "s3://lilly-clinical-data/demographics/",
          currentStage: "deploy",
          date: "2026-04-20",
          publishToMarketplace: "No",
        },
      ];
      setIngestions(dummyData);
    } else {
      setIngestions(stored);
    }
  }, []);

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-full bg-gray-50 flex flex-col py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
            <LayoutTemplate className="text-[#d52b1e]" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Data Ingestion Status
            </h1>
            <p className="text-gray-500 text-sm">
              Track the status of your data assets
            </p>
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
                {ingestions.map((item) => (
                  <React.Fragment key={item.id}>
                    <tr
                      className="hover:bg-gray-50 transition-colors cursor-pointer group"
                      onClick={() => toggleRow(item.id)}
                    >
                      <td className="p-4 pl-6">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 text-gray-400 group-hover:text-[#d52b1e] transition-colors">
                            {expandedRows[item.id] ? (
                              <ChevronUp size={18} />
                            ) : (
                              <ChevronDown size={18} />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {item.dataName}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {item.id} • {item.date}
                            </div>
                            <div
                              className="text-xs text-gray-400 mt-1 truncate max-w-[200px]"
                              title={item.dataDescription}
                            >
                              {item.dataDescription}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {item.dataFormat}
                        </span>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <a
                          href={item.sourceLink}
                          className="text-sm text-blue-600 hover:underline truncate max-w-[150px] inline-block"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {item.sourceLink}
                        </a>
                      </td>
                      <td className="p-4 pb-8">
                        <ProgressTracker
                          currentStageId={item.currentStage || "approval"}
                        />
                      </td>
                    </tr>

                    {/* Expandable Accordion Row */}
                    {expandedRows[item.id] && (
                      <tr className="bg-gray-50/80 border-t border-gray-100">
                        <td colSpan={4} className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-sm pl-8">
                            {/* Technical Details */}
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Code size={16} className="text-[#d52b1e]" />
                                Technical Details
                              </h4>
                              <div className="space-y-2 text-gray-600">
                                <p className="flex justify-between border-b border-gray-50 pb-1">
                                  <span className="font-medium">App Name:</span>
                                  <span>{item.appName || "N/A"}</span>
                                </p>
                                <p className="flex justify-between border-b border-gray-50 pb-1">
                                  <span className="font-medium">App CI:</span>
                                  <span>{item.applicationCi || "N/A"}</span>
                                </p>
                                <p className="flex justify-between border-b border-gray-50 pb-1">
                                  <span className="font-medium">Git Repo:</span>
                                  <span
                                    className="truncate max-w-[120px]"
                                    title={item.sourceGitRepo}
                                  >
                                    {item.sourceGitRepo || "N/A"}
                                  </span>
                                </p>
                                <p className="flex justify-between border-b border-gray-50 pb-1">
                                  <span className="font-medium">
                                    Data Class:
                                  </span>
                                  <span>
                                    {item.dataClassification || "N/A"}
                                  </span>
                                </p>
                                <p className="flex justify-between">
                                  <span className="font-medium">HIPAA:</span>
                                  <span>{item.hipaa || "N/A"}</span>
                                </p>
                              </div>
                            </div>

                            {/* Ownership */}
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Activity
                                  size={16}
                                  className="text-[#d52b1e]"
                                />
                                Ownership
                              </h4>
                              <div className="space-y-2 text-gray-600">
                                <p className="flex justify-between border-b border-gray-50 pb-1">
                                  <span className="font-medium">
                                    System Owner:
                                  </span>
                                  <span>{item.systemOwner || "N/A"}</span>
                                </p>
                                <p className="flex justify-between border-b border-gray-50 pb-1">
                                  <span className="font-medium">
                                    Custodian:
                                  </span>
                                  <span>{item.systemCustodian || "N/A"}</span>
                                </p>
                                <p className="flex justify-between border-b border-gray-50 pb-1">
                                  <span className="font-medium">
                                    IT Contact:
                                  </span>
                                  <span>{item.primaryItContact || "N/A"}</span>
                                </p>
                                <p className="flex justify-between">
                                  <span className="font-medium">
                                    Approver Grp:
                                  </span>
                                  <span>{item.approverGroup || "N/A"}</span>
                                </p>
                              </div>
                            </div>

                            {/* Business */}
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <LayoutTemplate
                                  size={16}
                                  className="text-[#d52b1e]"
                                />
                                Business
                              </h4>
                              <div className="space-y-2 text-gray-600">
                                <p className="flex justify-between border-b border-gray-50 pb-1">
                                  <span className="font-medium">
                                    L1 Business:
                                  </span>
                                  <span>
                                    {item.level1BusinessArea || "N/A"}
                                  </span>
                                </p>
                                <p className="flex justify-between border-b border-gray-50 pb-1">
                                  <span className="font-medium">
                                    Cost Center:
                                  </span>
                                  <span>{item.costCenter || "N/A"}</span>
                                </p>
                                <p className="flex justify-between border-b border-gray-50 pb-1">
                                  <span className="font-medium">
                                    CC Approver:
                                  </span>
                                  <span>
                                    {item.costCenterApprover || "N/A"}
                                  </span>
                                </p>
                                <p className="flex justify-between border-b border-gray-50 pb-1">
                                  <span className="font-medium">
                                    Proj Center:
                                  </span>
                                  <span>{item.projectCenter || "N/A"}</span>
                                </p>
                                <div className="mt-3 pt-3 flex justify-between items-center">
                                  <span className="font-medium text-gray-900">
                                    Publish to Marketplace:
                                  </span>
                                  <span
                                    className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                                      item.publishToMarketplace === "Yes"
                                        ? "bg-green-100 text-green-800 border border-green-200"
                                        : "bg-gray-100 text-gray-800 border border-gray-200"
                                    }`}
                                  >
                                    {item.publishToMarketplace || "No"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          {ingestions.length === 0 && (
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
