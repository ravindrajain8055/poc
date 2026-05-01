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
src/pages/Tickets.jsx
</directory_structure>

<files>
This section contains the contents of the repository's files.

<file path="src/App.jsx">
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import DemoPage from './pages/DemoPage';
import StartDataIngestion from './pages/StartDataIngestion';
import MyIngestionStatus from './pages/MyIngestionStatus';
import Tickets from './pages/Tickets';
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
          <Route path="/tickets" element={<Tickets />} />
        </Routes>
        <Chatbot />
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
</file>

<file path="src/components/chat/Chatbot.jsx">
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  FileText,
  Database,
  Menu,
  Plus,
} from "lucide-react";
import { mockResources } from "../../data/mockResources";

/*
  TODO: [LLM_INTEGRATION] Backend integration expected
  Suggested backend structure:
  - Store chats per user.
  - Each chat: chatId, messages[], createdAt, updatedAt
  APIs to plan:
  GET /chats - fetch user chats
  POST /chat - create new chat
  GET /chat/:id - get chat history
  DELETE /chat/:id - (for overflow >20)
*/

const Chatbot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const chatBodyRef = useRef(null);

  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("chatbot_chats");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) return parsed;
    }
    return [
      {
        id: Date.now().toString(),
        title: "New Chat",
        messages: [
          {
            role: "assistant",
            content:
              "Hi! I can help you find resources and documents. What are you looking for today?",
            type: "text",
            timestamp: Date.now(),
          },
        ],
        lastUpdated: Date.now(),
      },
    ];
  });

  const [activeChatId, setActiveChatId] = useState(chats[0]?.id);

  // Listen for external toggle events
  useEffect(() => {
    const handleToggle = () => setIsOpen(true);
    window.addEventListener("toggle-chatbot", handleToggle);
    return () => window.removeEventListener("toggle-chatbot", handleToggle);
  }, []);

  useEffect(() => {
    localStorage.setItem("chatbot_chats", JSON.stringify(chats));
  }, [chats]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chats, isSearching]);

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  const handleNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [
        {
          role: "assistant",
          content:
            "Hi! I can help you find resources and documents. What are you looking for today?",
          type: "text",
          timestamp: Date.now(),
        },
      ],
      lastUpdated: Date.now(),
    };
    setChats((prev) => [newChat, ...prev].slice(0, 20)); // FIFO keep top 20
    setActiveChatId(newChat.id);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleSearch = () => {
    const q = query.trim();
    if (!q) return;

    setQuery("");

    const userMsg = { role: "user", content: q, timestamp: Date.now() };
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === activeChatId) {
          return {
            ...c,
            messages: [...c.messages, userMsg],
            lastUpdated: Date.now(),
          };
        }
        return c;
      }),
    );

    setIsSearching(true);

    // Simulate API Call delay
    setTimeout(() => {
      const lowerQuery = q.toLowerCase();
      const filtered = mockResources.filter(
        (resource) =>
          resource.title.toLowerCase().includes(lowerQuery) ||
          resource.type.toLowerCase().includes(lowerQuery),
      );

      const newMessage =
        filtered.length > 0
          ? {
              role: "assistant",
              type: "results",
              content: "I found these resources:",
              data: filtered,
              timestamp: Date.now(),
            }
          : {
              role: "assistant",
              type: "fallback",
              content: `I couldn't find an exact match for your query.`,
              timestamp: Date.now(),
            };

      setChats((prev) => {
        let updated = prev.map((c) => {
          if (c.id === activeChatId) {
            return {
              ...c,
              title: c.title === "New Chat" ? q.slice(0, 20) : c.title,
              messages: [...c.messages, newMessage],
              lastUpdated: Date.now(),
            };
          }
          return c;
        });

        updated.sort((a, b) => b.lastUpdated - a.lastUpdated);
        if (updated.length > 20) {
          updated = updated.slice(0, 20); // FIFO automatically remove oldest
        }
        return updated;
      });

      setIsSearching(false);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleNavigateToIngestion = (fallbackQuery) => {
    setIsOpen(false);
    navigate("/data-ingestion", {
      state: {
        prefillDataName: fallbackQuery || "New Data Asset",
        prefillDataDescription: fallbackQuery
          ? `Generated from search query: ${fallbackQuery}`
          : "",
      },
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
            style={{ height: "520px" }}
          >
            <div className="relative flex flex-col h-full w-full">
              {/* Sidebar Overlay */}
              <div
                className={`absolute top-0 left-0 h-full w-64 bg-gray-50 border-r border-gray-200 z-20 transform transition-transform duration-300 flex flex-col ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}
              >
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white min-h-[60px]">
                  <h3 className="font-semibold text-gray-800">Chat History</h3>
                  <div className="flex gap-1">
                    <button
                      onClick={handleNewChat}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
                      title="New Chat"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors md:hidden"
                      title="Close Sidebar"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {chats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => {
                        setActiveChatId(chat.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm truncate transition-colors ${chat.id === activeChatId ? "bg-red-50 text-[#d52b1e] font-medium" : "hover:bg-gray-100 text-gray-700"}`}
                    >
                      {chat.title}
                    </button>
                  ))}
                </div>
                <div className="p-3 bg-white text-[10px] text-gray-400 border-t border-gray-200">
                  {/* <p className="font-semibold mb-1">Backend Planned:</p>
                  <p>GET /chats, POST /chat, GET /chat/:id, DELETE /chat/:id</p> */}
                  <p>Chat History</p>
                </div>
              </div>

              {/* Overlay backdrop when sidebar is open */}
              {isSidebarOpen && (
                <div
                  className="absolute inset-0 bg-black/10 z-10"
                  onClick={() => setIsSidebarOpen(false)}
                />
              )}

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col h-full z-0">
                {/* Header */}
                <div className="bg-[#d52b1e] p-4 text-white flex justify-between items-center min-h-[60px]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                      className="text-white hover:bg-white/20 p-1 rounded-md transition-colors mr-1"
                    >
                      <Menu size={20} />
                    </button>
                    <MessageSquare size={20} />
                    <h3 className="font-semibold">EDB Assistant</h3>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 p-1 rounded-md transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Chat Body */}
                <div
                  ref={chatBodyRef}
                  className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-5"
                >
                  {activeChat?.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-[#d52b1e] flex items-center justify-center text-white flex-shrink-0 mt-1">
                          <MessageSquare size={16} />
                        </div>
                      )}
                      {msg.role === "user" ? (
                        <div className="bg-[#d52b1e] p-3 rounded-2xl rounded-tr-sm shadow-sm text-sm text-white max-w-[80%] break-words">
                          {msg.content}
                        </div>
                      ) : (
                        <div className="bg-white p-3 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm w-full">
                          {msg.type === "text" && (
                            <div className="text-sm text-gray-700">
                              {msg.content}
                            </div>
                          )}
                          {msg.type === "results" && (
                            <>
                              <p className="text-sm text-gray-700 mb-2 font-medium">
                                {msg.content}
                              </p>
                              <div className="space-y-2">
                                {msg.data.map((res) => (
                                  <a
                                    key={res.id}
                                    href={res.link}
                                    className="flex items-start gap-2 p-2 rounded-md hover:bg-gray-50 border border-gray-100 transition-colors"
                                  >
                                    <FileText
                                      size={16}
                                      className="text-[#d52b1e] mt-0.5 flex-shrink-0"
                                    />
                                    <div>
                                      <p className="text-sm font-medium text-gray-800 leading-tight">
                                        {res.title}
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        {res.type}
                                      </p>
                                    </div>
                                  </a>
                                ))}
                              </div>
                            </>
                          )}
                          {msg.type === "fallback" && (
                            <>
                              <p className="text-sm text-gray-700 mb-3">
                                {msg.content} Based on your input, the{" "}
                                <strong>File Ingestion Core Component</strong>{" "}
                                seems most relevant.
                              </p>
                              <p className="text-sm text-gray-700 mb-4">
                                Let me know if you'd like to proceed. I can
                                redirect you to Data Ingestion to register this.
                              </p>

                              {/* CTA Button */}
                              <button
                                onClick={() =>
                                  handleNavigateToIngestion(
                                    activeChat.messages[idx - 1]?.content,
                                  )
                                }
                                className="w-full flex items-center justify-center gap-2 bg-[#d52b1e] hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium transition-colors text-sm"
                              >
                                <Database size={16} />
                                Start Data Ingestion
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

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
                    <span className="text-[10px] text-gray-400">
                      Powered by AI Search
                    </span>
                  </div>
                </div>
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

<file path="src/components/layout/Sidebar.jsx">
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
  Ticket,
} from "lucide-react";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    getStarted: false,
    myWork: false,
    marketplace: false,
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
                    My Data ingestion status
                  </NavLink>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Marketplace Accordion */}
        <div>
          <button
            onClick={() => toggleSection("marketplace")}
            className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-gray-200 text-gray-700"
          >
            <div className="flex items-center gap-3">
              <Store size={18} className="flex-shrink-0 text-gray-500" />
              {isExpanded && <span>Marketplace</span>}
            </div>
            {isExpanded &&
              (expandedSections.marketplace ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              ))}
          </button>
          <AnimatePresence>
            {isExpanded && expandedSections.marketplace && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="pl-9 pr-2 overflow-hidden"
              >
                <div className="py-1 flex flex-col gap-1">
                  <NavLink
                    to="/marketplace"
                    className={({ isActive }) =>
                      `block text-sm py-1.5 ${isActive && window.location.pathname === "/marketplace" ? "text-[#d52b1e] font-medium" : "text-gray-600 hover:text-gray-900"}`
                    }
                  >
                    Overview
                  </NavLink>
                </div>
                <div className="py-1 flex flex-col gap-1">
                  <NavLink
                    to="/tickets"
                    className={({ isActive }) =>
                      `flex items-center gap-2 text-sm py-1.5 ${isActive ? "text-[#d52b1e] font-medium" : "text-gray-600 hover:text-gray-900"}`
                    }
                  >
                    <Ticket size={16} />
                    Tickets
                  </NavLink>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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

<file path="src/pages/Home.jsx">
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Box, Database, Bot, ChevronRight } from "lucide-react";

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

<file path="src/pages/MyIngestionStatus.jsx">
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
                        <FileCheck size={12} /> Enterprise Agreement
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
          businessArea: "BU",
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
          businessArea: "LRL",
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
          businessArea: "GS",
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
                                      Business Area:
                                    </span>
                                    <span>{item.businessArea || "N/A"}</span>
                                  </p>
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
</file>

<file path="src/pages/StartDataIngestion.jsx">
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
    businessArea: "",
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
  const [level1BusinessAreaOption, setLevel1BusinessAreaOption] = useState("");

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
    if (!formData.businessArea)
      newErrors.businessArea = "Business Area is required";

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
    setLevel1BusinessAreaOption("");
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
        businessArea: "",
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
      setLevel1BusinessAreaOption("");
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
    const steps = [
      "Basic Details",
      "Technical Details",
      "Marketplace",
      "Review",
    ];
    return (
      <div className="flex justify-center items-center mb-6 px-4 mt-5 pb-4 border-b-1 border-gray-200">
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

  const renderSelectField = (label, field, options) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-3 border-b border-gray-100 last:border-0">
      <label className="w-full sm:w-1/3 text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="w-full sm:w-2/3">
        <select
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className={`block w-full px-3 py-2 border ${
            errors[field] ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-[#d52b1e] focus:border-[#d52b1e] sm:text-sm transition-colors bg-white`}
        >
          <option value="">Select...</option>
          {options.map((opt) => (
            <option key={opt.value || opt} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
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
                  placeholder="e.g. IQVA Commercials"
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
                placeholder="Provide a detailed description about the data and how this data is going to be used"
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
                  className={`block w-full pl-10 pr-10 py-1.5 border ${
                    errors.dataFormat ? "border-red-500" : "border-gray-300"
                  } bg-white rounded-md shadow-sm sm:text-sm min-h-[24px] flex items-center`}
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
                Data resides at ? (Source File System/DB/S3 Bucket)
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Area <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.businessArea}
                onChange={(e) =>
                  handleInputChange("businessArea", e.target.value)
                }
                className={`block w-full px-3 py-2.5 border ${
                  errors.businessArea ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-[#d52b1e] focus:border-[#d52b1e] sm:text-sm transition-colors bg-white`}
              >
                <option value="">Select...</option>
                <option value="BU">BU</option>
                <option value="LRL">LRL</option>
                <option value="GS">GS</option>
                <option value="GIS">GIS</option>
                <option value="MQ">MQ</option>
                <option value="AADS">AADS</option>
              </select>
              {errors.businessArea && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.businessArea}
                </p>
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
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 py-3 border-b border-gray-100 last:border-0">
                  <label className="w-full sm:w-1/3 text-sm font-medium text-gray-700 mt-2">
                    Level 1 Business Area{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full sm:w-2/3 space-y-2">
                    <select
                      value={level1BusinessAreaOption}
                      onChange={(e) => {
                        setLevel1BusinessAreaOption(e.target.value);
                        if (e.target.value !== "Other") {
                          handleInputChange(
                            "level1BusinessArea",
                            e.target.value,
                          );
                        } else {
                          handleInputChange("level1BusinessArea", "");
                        }
                      }}
                      className={`block w-full px-3 py-2 border ${
                        errors.level1BusinessArea && !level1BusinessAreaOption
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md shadow-sm focus:ring-[#d52b1e] focus:border-[#d52b1e] sm:text-sm transition-colors bg-white`}
                    >
                      <option value="">Select...</option>
                      <option value="MD IDS">MD IDS</option>
                      <option value="Business Units IDS">
                        Business Units IDS
                      </option>
                      <option value="MQ IDS">MQ IDS</option>
                      <option value="AADS">AADS</option>
                      <option value="Global Info services">
                        Global Info services
                      </option>
                      <option value="Other">Other</option>
                    </select>

                    {level1BusinessAreaOption === "Other" && (
                      <input
                        type="text"
                        value={formData.level1BusinessArea}
                        onChange={(e) =>
                          handleInputChange(
                            "level1BusinessArea",
                            e.target.value,
                          )
                        }
                        placeholder="Please specify"
                        className={`block w-full px-3 py-2 border ${
                          errors.level1BusinessArea
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md shadow-sm focus:ring-[#d52b1e] focus:border-[#d52b1e] sm:text-sm transition-colors`}
                      />
                    )}
                    {errors.level1BusinessArea && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.level1BusinessArea}
                      </p>
                    )}
                  </div>
                </div>
                {renderStage2Field(
                  "Project Center",
                  "projectCenter",
                  "e.g. 67890",
                )}
                {renderSelectField(
                  "Data Classification",
                  "dataClassification",
                  [
                    { value: "green", label: "Green" },
                    { value: "yellow", label: "Yellow" },
                    { value: "orange", label: "Orange" },
                    { value: "red", label: "Red" },
                  ],
                )}
                {renderSelectField("Require Hipaa compliance", "hipaa", [
                  "Yes",
                  "No",
                ])}
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
                <h4 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3 text-base">
                  Basic Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-500">Name:</span>{" "}
                    <span className="text-gray-900 block mt-1">
                      {formData.dataName}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Format:</span>{" "}
                    <span className="text-gray-900 block mt-1">
                      {formData.dataFormat}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">
                      Business Area:
                    </span>{" "}
                    <span className="text-gray-900 block mt-1">
                      {formData.businessArea}
                    </span>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <span className="font-medium text-gray-500">
                      Description:
                    </span>{" "}
                    <span className="text-gray-900 block mt-1">
                      {formData.dataDescription}
                    </span>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <span className="font-medium text-gray-500">Source:</span>{" "}
                    <span className="text-gray-900 break-all block mt-1">
                      {formData.sourceLink}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3 text-base">
                  Technical & Ownership Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <span className="font-medium text-gray-500">App Name:</span>{" "}
                    <span className="text-gray-900 block mt-1">
                      {formData.appName}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">App CI:</span>{" "}
                    <span className="text-gray-900 block mt-1">
                      {formData.applicationCi}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">
                      Cost Center:
                    </span>{" "}
                    <span className="text-gray-900 block mt-1">
                      {formData.costCenter}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">
                      Project Center:
                    </span>{" "}
                    <span className="text-gray-900 block mt-1">
                      {formData.projectCenter}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">
                      System Owner:
                    </span>{" "}
                    <span className="text-gray-900 block mt-1">
                      {formData.systemOwner}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">
                      System Custodian:
                    </span>{" "}
                    <span className="text-gray-900 block mt-1">
                      {formData.systemCustodian}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">HIPAA:</span>{" "}
                    <span className="text-gray-900 block mt-1">
                      {formData.hipaa}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">
                      Data Classification:
                    </span>{" "}
                    <span className="text-gray-900 block mt-1">
                      {formData.dataClassification}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 border-b border-gray-200 pb-2 mb-3 text-base">
                  Marketplace
                </h4>
                <div className="flex items-center mt-2">
                  <span className="font-medium text-gray-500">
                    Publish to Marketplace:
                  </span>
                  <span
                    className={`ml-3 px-2.5 py-1 rounded-md text-xs font-bold ${formData.publishToMarketplace === "Yes" ? "bg-green-100 text-green-800 border border-green-200" : "bg-gray-100 text-gray-800 border border-gray-200"}`}
                  >
                    {formData.publishToMarketplace}
                  </span>
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
</file>

<file path="src/pages/Tickets.jsx">
import React, { useState } from 'react';
import { Ticket, Search, Filter, Plus, Clock, CheckCircle2, AlertCircle, MoreHorizontal } from 'lucide-react';

const DUMMY_TICKETS = [
  {
    id: 'TKT-1042',
    title: 'Access Request: Sales Q3 Data',
    type: 'Access',
    status: 'Open',
    priority: 'High',
    assignee: 'Data Gov Team',
    date: '2026-04-28',
  },
  {
    id: 'TKT-1041',
    title: 'Ingestion Pipeline Failure: Marketing Assets',
    type: 'Bug',
    status: 'In Progress',
    priority: 'Critical',
    assignee: 'Data Eng Team',
    date: '2026-04-27',
  },
  {
    id: 'TKT-1038',
    title: 'Marketplace Publish Review',
    type: 'Review',
    status: 'Resolved',
    priority: 'Medium',
    assignee: 'Compliance',
    date: '2026-04-25',
  },
  {
    id: 'TKT-1035',
    title: 'Update Data Classification for Patient Demographics',
    type: 'Request',
    status: 'Closed',
    priority: 'Low',
    assignee: 'Security',
    date: '2026-04-20',
  }
];

const Tickets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredTickets = DUMMY_TICKETS.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) || ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Critical': return <AlertCircle size={14} className="text-red-500" />;
      case 'High': return <AlertCircle size={14} className="text-orange-500" />;
      case 'Medium': return <Clock size={14} className="text-yellow-500" />;
      case 'Low': return <CheckCircle2 size={14} className="text-green-500" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-full bg-gray-50 flex flex-col py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
              <Ticket className="text-[#d52b1e]" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Tickets</h1>
              <p className="text-gray-500 text-sm">Manage your support and request tickets</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-[#d52b1e] hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
            <Plus size={16} />
            Create Ticket
          </button>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by ID or title..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#d52b1e] focus:border-transparent outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Filter size={18} className="text-gray-400" />
            <select
              className="w-full sm:w-auto border border-gray-300 rounded-md py-2 pl-3 pr-8 focus:ring-2 focus:ring-[#d52b1e] focus:border-transparent outline-none text-sm text-gray-700"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  <th className="p-4 pl-6">Ticket</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4 hidden md:table-cell">Assignee</th>
                  <th className="p-4 hidden sm:table-cell">Date</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="font-medium text-gray-900 group-hover:text-[#d52b1e] transition-colors cursor-pointer">
                        {ticket.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{ticket.id}</div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-700">{ticket.type}</span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-700">
                        {getPriorityIcon(ticket.priority)}
                        {ticket.priority}
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell text-sm text-gray-600">
                      {ticket.assignee}
                    </td>
                    <td className="p-4 hidden sm:table-cell text-sm text-gray-500">
                      {ticket.date}
                    </td>
                    <td className="p-4 text-center">
                      <button className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-md hover:bg-gray-100">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredTickets.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              No tickets found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tickets;
</file>

</files>
