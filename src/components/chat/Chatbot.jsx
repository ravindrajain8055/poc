import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, FileText, Database } from 'lucide-react';
import { mockResources } from '../../data/mockResources';

const Chatbot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [query, setQuery] = useState('');
  const [searchedQuery, setSearchedQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Listen for external toggle events
  useEffect(() => {
    const handleToggle = () => setIsOpen(true);
    window.addEventListener('toggle-chatbot', handleToggle);
    return () => window.removeEventListener('toggle-chatbot', handleToggle);
  }, []);

  const handleSearch = () => {
    const q = query.trim();
    if (!q) return;

    setSearchedQuery(q);
    setIsSearching(true);
    setHasSearched(true);
    
    // Simulate API Call delay
    // TODO: [LLM_INTEGRATION] Replace this mock implementation and fallback logic with actual backend API/LLM call.
    /*
      Example backend integration:
      fetch(`/api/search/ai?q=${encodeURIComponent(q)}`)
        .then(res => res.json())
        .then(data => { setResults(data.resources); setIsSearching(false); })
    */
    setTimeout(() => {
      const lowerQuery = q.toLowerCase();
      const filtered = mockResources.filter(resource => 
        resource.title.toLowerCase().includes(lowerQuery) || 
        resource.type.toLowerCase().includes(lowerQuery)
      );
      setResults(filtered);
      setIsSearching(false);
      setQuery(''); // clear input after search
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleNavigateToIngestion = () => {
    setIsOpen(false);
    navigate('/data-ingestion', { 
      state: { 
        prefillDataName: searchedQuery,
        prefillDataDescription: `Generated from search query: ${searchedQuery}`
      } 
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
            style={{ height: '520px' }}
          >
            {/* Header */}
            <div className="bg-[#d52b1e] p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageSquare size={20} />
                <h3 className="font-semibold">Resource Assistant</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-1 rounded-md transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-5">
              {/* Initial message */}
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-[#d52b1e] flex items-center justify-center text-white flex-shrink-0 mt-1">
                  <MessageSquare size={16} />
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm text-sm text-gray-700">
                  Hi! I can help you find resources and documents. What are you looking for today?
                </div>
              </div>

              {/* User search query bubble */}
              {hasSearched && searchedQuery && (
                <div className="flex gap-2 justify-end">
                  <div className="bg-[#d52b1e] p-3 rounded-2xl rounded-tr-sm shadow-sm text-sm text-white max-w-[80%] break-words">
                    {searchedQuery}
                  </div>
                </div>
              )}

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

              {/* Results & Fallback */}
              {!isSearching && hasSearched && (
                results.length > 0 ? (
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#d52b1e] flex items-center justify-center text-white flex-shrink-0 mt-1">
                      <MessageSquare size={16} />
                    </div>
                    <div className="bg-white p-3 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm w-full">
                      <p className="text-sm text-gray-700 mb-2 font-medium">I found these resources:</p>
                      <div className="space-y-2">
                        {results.map((res) => (
                          <a 
                            key={res.id} 
                            href={res.link}
                            className="flex items-start gap-2 p-2 rounded-md hover:bg-gray-50 border border-gray-100 transition-colors"
                          >
                            <FileText size={16} className="text-[#d52b1e] mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-800 leading-tight">{res.title}</p>
                              <p className="text-xs text-gray-500 mt-1">{res.type}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#d52b1e] flex items-center justify-center text-white flex-shrink-0 mt-1">
                      <MessageSquare size={16} />
                    </div>
                    <div className="bg-white p-3 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm w-full">
                      <p className="text-sm text-gray-700 mb-3">
                        I couldn't find an exact match for your query. Based on your input, the <strong>File Ingestion Core Component</strong> seems most relevant.
                      </p>
                      <p className="text-sm text-gray-700 mb-4">
                        Let me know if you'd like to proceed. I can redirect you to Data Ingestion to register this.
                      </p>
                      
                      {/* CTA Button */}
                      <button 
                        onClick={handleNavigateToIngestion}
                        className="w-full flex items-center justify-center gap-2 bg-[#d52b1e] hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium transition-colors text-sm"
                      >
                        <Database size={16} />
                        Start Data Ingestion
                      </button>
                    </div>
                  </div>
                )
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
                <span className="text-[10px] text-gray-400">Powered by AI Search</span>
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
