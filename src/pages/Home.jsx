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
