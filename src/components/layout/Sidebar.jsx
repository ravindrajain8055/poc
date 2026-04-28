import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  ChevronDown,
  ChevronRight,
  Store,
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
  ExternalLink,
} from "lucide-react";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    getStarted: false,
    myWork: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <motion.aside
      initial={{ width: 250 }}
      animate={{ width: isExpanded ? 250 : 64 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen bg-gray-100 border-r border-gray-200 flex flex-col flex-shrink-0 relative"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:bg-gray-50 z-10"
      >
        {isExpanded ? (
          <PanelLeftClose size={16} className="text-gray-600" />
        ) : (
          <PanelLeftOpen size={16} className="text-gray-600" />
        )}
      </button>

      {/* Logo Area */}
      <div className="p-4 flex items-center gap-2 h-16">
        <div
          className="text-lilly-red font-bold text-xl flex-shrink-0 italic"
          style={{ fontFamily: "serif" }}
        >
          Lilly
        </div>
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
              <span className="text-sm text-gray-800 leading-tight">
                Ravindra
              </span>
              <span className="text-sm text-gray-800 leading-tight">Jain</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1">
        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-2 py-2 rounded-md hover:bg-gray-200 text-gray-700 ${isActive ? "bg-gray-200 font-medium" : ""}`
          }
        >
          <Home size={18} className="flex-shrink-0 text-lilly-red" />
          {isExpanded && <span>Home</span>}
        </NavLink>

        {/* Get Started Accordion */}
        <div>
          <button
            onClick={() => toggleSection("getStarted")}
            className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-gray-200 text-gray-700"
          >
            <div className="flex items-center gap-3">
              <FileText size={18} className="flex-shrink-0 text-gray-500" />
              {isExpanded && <span>Get started</span>}
            </div>
            {isExpanded &&
              (expandedSections.getStarted ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              ))}
          </button>
          <AnimatePresence>
            {isExpanded && expandedSections.getStarted && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="pl-9 pr-2 overflow-hidden"
              >
                <div className="py-1 flex flex-col gap-1">
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900 py-1"
                  >
                    Quick Tour
                  </a>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900 py-1"
                  >
                    Documentation
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* My Work Accordion */}
        <div>
          <button
            onClick={() => toggleSection("myWork")}
            className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-gray-200 text-gray-700"
          >
            <div className="flex items-center gap-3">
              <FileText size={18} className="flex-shrink-0 text-gray-500" />
              {isExpanded && <span>My work</span>}
            </div>
            {isExpanded &&
              (expandedSections.myWork ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              ))}
          </button>
          <AnimatePresence>
            {isExpanded && expandedSections.myWork && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="pl-9 pr-2 overflow-hidden"
              >
                <div className="py-1 flex flex-col gap-1">
                  <NavLink
                    to="/data-ingestion"
                    className={({ isActive }) =>
                      `block text-sm py-1.5 ${isActive ? "text-[#d52b1e] font-medium" : "text-gray-600 hover:text-gray-900"}`
                    }
                  >
                    Start Data Ingestion
                  </NavLink>
                </div>
                <div className="py-1 flex flex-col gap-1">
                  <NavLink
                    to="/my-ingestion"
                    className={({ isActive }) =>
                      `block text-sm py-1.5 ${isActive ? "text-[#d52b1e] font-medium" : "text-gray-600 hover:text-gray-900"}`
                    }
                  >
                    My ingestion status
                  </NavLink>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Marketplace */}
        <NavLink
          to="/marketplace"
          className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-gray-200 text-gray-700"
        >
          <Store size={18} className="flex-shrink-0 text-gray-500" />
          {isExpanded && <span>Marketplace</span>}
        </NavLink>

        {/* Custom POC Links */}
        <div className="pt-4 mt-4 border-t border-gray-200">
          {isExpanded && (
            <div className="px-2 mb-2 text-xs font-semibold text-gray-400 uppercase">
              POC Features
            </div>
          )}
          <NavLink
            to="/demo"
            className={({ isActive }) =>
              `flex items-center gap-3 px-2 py-2 rounded-md hover:bg-gray-200 text-gray-700 ${isActive ? "bg-gray-200 font-medium" : ""}`
            }
          >
            <ExternalLink size={18} className="flex-shrink-0 text-gray-500" />
            {isExpanded && <span>Demo Page</span>}
          </NavLink>
        </div>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
