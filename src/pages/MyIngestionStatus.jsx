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
