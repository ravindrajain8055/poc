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
