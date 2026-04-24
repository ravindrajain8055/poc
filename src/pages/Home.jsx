import React, { useState } from "react";
import {
  Search,
  X,
  Filter,
  Box,
  Download,
  FilePlus,
  Wrench,
} from "lucide-react";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col min-h-full bg-white">
      {/* Hero Section */}
      <div className="bg-[#d52b1e] w-full px-8 py-12 flex flex-col items-center justify-center relative">
        {/* Abstract background texture/pattern if needed could go here */}
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
                placeholder="Start browsing our Marketplace for products..."
                className="w-full bg-white text-gray-800 rounded-md py-4 pl-6 pr-12 text-lg focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-14 text-gray-400 hover:text-gray-600 p-2"
                >
                  <X size={20} />
                </button>
              )}
              <button className="absolute right-2 bg-white text-gray-500 hover:text-gray-800 p-2 rounded-md transition-colors">
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
      <div className="w-full bg-gray-50 flex-1 py-8 px-8 flex justify-center">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 px-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Eli Lilly and Company. All rights
        reserved.
      </footer>
    </div>
  );
};

export default Home;
