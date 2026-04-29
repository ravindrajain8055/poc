import React, { useState, useEffect } from "react";
import {
  Activity,
  CheckCircle2,
  Clock,
  Code,
  Send,
  LayoutTemplate,
  ChevronDown,
  ChevronUp,
  Search,
  Store,
  XCircle,
  MessageSquare,
  FileCheck,
  UserCheck,
  ShieldCheck,
} from "lucide-react";

const BASE_STAGES = [
  { id: "review", label: "Review", icon: Search },
  { id: "approval", label: "Approval", icon: Clock },
  { id: "development", label: "Development", icon: Code },
  { id: "testing", label: "Testing", icon: Activity },
  { id: "deploy", label: "Deploy", icon: Send },
];

const getStagesForItem = (item) => {
  let stages = [...BASE_STAGES];

  if (item.publishToMarketplace === "Yes") {
    stages.push({
      id: "submit_marketplace",
      label: "To Marketplace",
      icon: Store,
    });
  }

  if (item.isCancelled && item.cancelledAfterStage) {
    const targetIdx = stages.findIndex(
      (s) => s.id === item.cancelledAfterStage,
    );
    if (targetIdx !== -1) {
      stages.splice(targetIdx + 1, 0, {
        id: "cancelled",
        label: "Cancelled",
        icon: XCircle,
      });
    }
  }

  return stages;
};

const ProgressTracker = ({ item }) => {
  const stages = getStagesForItem(item);
  let currentIndex = stages.findIndex((s) => s.id === item.currentStage);
  if (currentIndex === -1) currentIndex = 0; // Default if not found

  // Mock approval sub-status if the item doesn't have one
  const approvalStatus = item.approvalStatus || {
    enterprise_agreement: true,
    change_request: true,
    user_story: false,
  };
  const isApprovalFullyGreen =
    approvalStatus.enterprise_agreement &&
    approvalStatus.change_request &&
    approvalStatus.user_story;

  return (
    <div className="flex items-center w-full max-w-md mt-4">
      {stages.map((stage, index) => {
        const isCancelled = item.isCancelled && stage.id === "cancelled";
        const isPastCancelled =
          item.isCancelled &&
          stages.findIndex((s) => s.id === "cancelled") !== -1 &&
          index > stages.findIndex((s) => s.id === "cancelled");

        let isCompleted = index < currentIndex;
        let isCurrent = index === currentIndex && !isCancelled;

        // If this is approval stage, override completion status based on mini-stages
        if (stage.id === "approval") {
          isCompleted = isCompleted && isApprovalFullyGreen;
        }

        if (isPastCancelled) {
          isCompleted = false;
          isCurrent = false;
        }

        const Icon = isCancelled
          ? XCircle
          : isCompleted
            ? CheckCircle2
            : stage.icon;

        return (
          <React.Fragment key={stage.id}>
            <div className="flex flex-col items-center relative group">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 bg-white
                  ${
                    isCancelled
                      ? "border-red-500 text-red-500"
                      : isCompleted
                        ? "border-green-500 text-green-500"
                        : isCurrent
                          ? "border-[#d52b1e] text-[#d52b1e]"
                          : "border-gray-200 text-gray-400"
                  }`}
              >
                <Icon
                  size={14}
                  className={
                    isCompleted
                      ? "text-green-500"
                      : isCancelled
                        ? "text-red-500"
                        : ""
                  }
                />
              </div>

              {/* Hover Tooltip for Approval Mini-Stages */}
              {stage.id === "approval" && (
                <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 bg-gray-800 text-white text-xs rounded-md shadow-xl p-3 z-50 pointer-events-none">
                  <div className="font-semibold mb-2 text-gray-200 border-b border-gray-600 pb-1">
                    Approval Checks
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <FileCheck size={12} /> EA
                      </span>
                      {approvalStatus.enterprise_agreement ? (
                        <CheckCircle2 size={12} className="text-green-400" />
                      ) : (
                        <Clock size={12} className="text-yellow-400" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck size={12} /> Change Request
                      </span>
                      {approvalStatus.change_request ? (
                        <CheckCircle2 size={12} className="text-green-400" />
                      ) : (
                        <Clock size={12} className="text-yellow-400" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <UserCheck size={12} /> User Story
                      </span>
                      {approvalStatus.user_story ? (
                        <CheckCircle2 size={12} className="text-green-400" />
                      ) : (
                        <Clock size={12} className="text-yellow-400" />
                      )}
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
              )}

              <span
                className={`absolute -bottom-5 text-[10px] whitespace-nowrap font-medium
                ${
                  isCancelled
                    ? "text-red-600"
                    : isCurrent
                      ? "text-[#d52b1e]"
                      : isCompleted
                        ? "text-gray-700"
                        : "text-gray-400"
                }`}
              >
                {stage.label}
              </span>
            </div>
            {index < stages.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 transition-colors
                ${
                  isCancelled
                    ? "bg-gray-200"
                    : index < currentIndex
                      ? "bg-green-500"
                      : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const TimelineView = ({ item }) => {
  const stages = getStagesForItem(item);
  let currentIndex = stages.findIndex((s) => s.id === item.currentStage);
  if (currentIndex === -1) currentIndex = 0;

  return (
    <div className="bg-white px-6 py-4 rounded-lg shadow-sm border border-gray-100 max-h-[405px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-50 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
      <h4 className="font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3 flex items-center gap-2 sticky top-0 bg-white z-10 pt-1">
        <Activity size={18} className="text-[#d52b1e]" /> Stage Timeline
      </h4>
      <div className="relative border-l-2 border-gray-100 ml-4 space-y-8 pb-4">
        {stages.map((stage, index) => {
          const isCancelled = item.isCancelled && stage.id === "cancelled";
          const isPastCancelled =
            item.isCancelled &&
            stages.findIndex((s) => s.id === "cancelled") !== -1 &&
            index > stages.findIndex((s) => s.id === "cancelled");

          const isCompleted =
            index < currentIndex && !isPastCancelled && !isCancelled;
          const isCurrent = index === currentIndex && !isCancelled;
          const showComment = isCompleted || isCurrent || isCancelled;

          return (
            <div key={stage.id} className="relative pl-8">
              {/* Marker */}
              <div
                className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white transition-colors
                  ${
                    isCancelled
                      ? "border-red-500"
                      : isCompleted
                        ? "border-green-500"
                        : isCurrent
                          ? "border-[#d52b1e]"
                          : "border-gray-300"
                  }`}
              >
                {isCompleted && (
                  <CheckCircle2 size={12} className="text-green-500" />
                )}
                {isCancelled && <XCircle size={12} className="text-red-500" />}
              </div>

              <div>
                <h5
                  className={`font-semibold text-sm ${
                    isCurrent
                      ? "text-[#d52b1e]"
                      : isCompleted
                        ? "text-gray-900"
                        : isCancelled
                          ? "text-red-600"
                          : "text-gray-400"
                  }`}
                >
                  {stage.label}
                </h5>

                {/* Show comments if stage is active or completed */}
                {showComment && (
                  <div className="mt-3 bg-gray-50/80 rounded-md p-3 text-sm text-gray-600 border border-gray-100 shadow-sm relative">
                    {/* Tiny triangle for speech bubble effect */}
                    <div className="absolute -top-2 left-4 border-4 border-transparent border-b-gray-100"></div>
                    <div className="absolute -top-[7px] left-4 border-4 border-transparent border-b-gray-50"></div>

                    <p className="font-semibold text-gray-800 mb-1 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                      <MessageSquare size={12} className="text-gray-500" />{" "}
                      Updates
                    </p>
                    <p className="text-gray-600">
                      {item.comments?.[stage.id] ||
                        "No updates available for this stage yet."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MyIngestionStatus = () => {
  const [ingestions, setIngestions] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("ingestions") || "[]");

    if (stored.length === 0) {
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
          approvalStatus: {
            enterprise_agreement: true,
            change_request: true,
            user_story: false,
          },
          comments: {
            review: "Initial review passed. Data schema looks well-formed.",
            approval: "Waiting on final user approval sign-off.",
          },
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
          approvalStatus: {
            enterprise_agreement: true,
            change_request: true,
            user_story: true,
          },
          comments: {
            review: "Review approved.",
            approval: "All approvals acquired (EA, CR, User).",
            development: "Dev environment setup complete.",
            testing: "Passed all QA and compliance tests.",
            deploy: "Deployment in progress on target environment.",
          },
        },
        {
          id: "ING-003",
          dataName: "Legacy Marketing Assets",
          dataDescription: "Old marketing campaigns from 2022.",
          dataFormat: "JSON",
          sourceLink: "s3://lilly-marketing/2022/",
          currentStage: "cancelled",
          date: "2026-04-28",
          publishToMarketplace: "No",
          isCancelled: true,
          cancelledAfterStage: "development",
          approvalStatus: {
            enterprise_agreement: true,
            crchange_request: true,
            user_story: true,
          },
          comments: {
            review: "Looks good to proceed.",
            approval: "Approved for development.",
            development:
              "Began parsing, but encountered severe data corruption.",
            cancelled:
              "Ingestion cancelled due to corrupt source files. Cannot proceed further.",
          },
        },
      ];
      setIngestions(dummyData);
    } else {
      // Hydrate stored data with mock comments and approval status if missing
      const hydratedStored = stored.map((item) => ({
        ...item,
        currentStage: item.currentStage || "review",
        approvalStatus: item.approvalStatus || {
          enterprise_agreement: true,
          change_request: true,
          user_story: false,
        },
        comments: item.comments || {
          review: "Submitted for initial review.",
        },
      }));
      setIngestions(hydratedStored);
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
                  <th className="p-4 min-w-[300px]">Status Tracker</th>
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
                            <div className="font-medium text-gray-900 flex items-center gap-2">
                              {item.dataName}
                              {item.isCancelled && (
                                <span className="bg-red-100 text-red-700 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
                                  Cancelled
                                </span>
                              )}
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
                        <ProgressTracker item={item} />
                      </td>
                    </tr>

                    {/* Expandable Accordion Row */}
                    {expandedRows[item.id] && (
                      <tr className="bg-gray-50/80 border-t border-gray-100">
                        <td colSpan={4} className="py-6 pr-3">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-sm pl-8">
                            {/* Detailed Metadata Fields */}
                            <div className="lg:col-span-2 space-y-6">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Technical Details */}
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Code
                                      size={16}
                                      className="text-[#d52b1e]"
                                    />
                                    Technical Details
                                  </h4>
                                  <div className="space-y-2 text-gray-600 text-xs">
                                    <p className="flex justify-between border-b border-gray-50 pb-1">
                                      <span className="font-medium">
                                        App Name:
                                      </span>
                                      <span>{item.appName || "N/A"}</span>
                                    </p>
                                    <p className="flex justify-between border-b border-gray-50 pb-1">
                                      <span className="font-medium">
                                        App CI:
                                      </span>
                                      <span>{item.applicationCi || "N/A"}</span>
                                    </p>
                                    <p className="flex justify-between border-b border-gray-50 pb-1">
                                      <span className="font-medium">
                                        Git Repo:
                                      </span>
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
                                      <span className="font-medium">
                                        HIPAA:
                                      </span>
                                      <span>{item.hipaa || "N/A"}</span>
                                    </p>
                                  </div>
                                </div>

                                {/* Ownership */}
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <UserCheck
                                      size={16}
                                      className="text-[#d52b1e]"
                                    />
                                    Ownership
                                  </h4>
                                  <div className="space-y-2 text-gray-600 text-xs">
                                    <p className="flex justify-between border-b border-gray-50 pb-1">
                                      <span className="font-medium">
                                        Sys Owner:
                                      </span>
                                      <span>{item.systemOwner || "N/A"}</span>
                                    </p>
                                    <p className="flex justify-between border-b border-gray-50 pb-1">
                                      <span className="font-medium">
                                        Custodian:
                                      </span>
                                      <span>
                                        {item.systemCustodian || "N/A"}
                                      </span>
                                    </p>
                                    <p className="flex justify-between border-b border-gray-50 pb-1">
                                      <span className="font-medium">
                                        IT Contact:
                                      </span>
                                      <span>
                                        {item.primaryItContact || "N/A"}
                                      </span>
                                    </p>
                                    <p className="flex justify-between">
                                      <span className="font-medium">
                                        Approver Grp:
                                      </span>
                                      <span>{item.approverGroup || "N/A"}</span>
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Business Details */}
                              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                  <LayoutTemplate
                                    size={16}
                                    className="text-[#d52b1e]"
                                  />
                                  Business & Finance
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
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
                                      Proj Center:
                                    </span>
                                    <span>{item.projectCenter || "N/A"}</span>
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
                                  <div className="col-span-2 mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                                    <span className="font-bold text-gray-900 text-sm">
                                      Marketplace Intent
                                    </span>
                                    <span
                                      className={`px-3 py-1 rounded-md font-bold uppercase tracking-wider ${
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

                            {/* Timeline Column */}
                            <div className="lg:col-span-1">
                              <TimelineView item={item} />
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
