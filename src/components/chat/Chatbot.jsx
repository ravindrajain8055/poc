import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, FileText, Database, Menu, Plus } from 'lucide-react';
import { mockResources } from '../../data/mockResources';

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
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const chatBodyRef = useRef(null);

  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('chatbot_chats');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) return parsed;
    }
    return [
      {
        id: Date.now().toString(),
        title: 'New Chat',
        messages: [{ role: 'assistant', content: 'Hi! I can help you find resources and documents. What are you looking for today?', type: 'text', timestamp: Date.now() }],
        lastUpdated: Date.now()
      }
    ];
  });
  
  const [activeChatId, setActiveChatId] = useState(chats[0]?.id);

  // Listen for external toggle events
  useEffect(() => {
    const handleToggle = () => setIsOpen(true);
    window.addEventListener('toggle-chatbot', handleToggle);
    return () => window.removeEventListener('toggle-chatbot', handleToggle);
  }, []);

  useEffect(() => {
    localStorage.setItem('chatbot_chats', JSON.stringify(chats));
  }, [chats]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chats, isSearching]);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  const handleNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [{ role: 'assistant', content: 'Hi! I can help you find resources and documents. What are you looking for today?', type: 'text', timestamp: Date.now() }],
      lastUpdated: Date.now()
    };
    setChats(prev => [newChat, ...prev].slice(0, 20)); // FIFO keep top 20
    setActiveChatId(newChat.id);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleSearch = () => {
    const q = query.trim();
    if (!q) return;

    setQuery('');
    
    const userMsg = { role: 'user', content: q, timestamp: Date.now() };
    setChats(prev => prev.map(c => {
      if (c.id === activeChatId) {
        return {
          ...c,
          messages: [...c.messages, userMsg],
          lastUpdated: Date.now()
        };
      }
      return c;
    }));

    setIsSearching(true);
    
    // Simulate API Call delay
    setTimeout(() => {
      const lowerQuery = q.toLowerCase();
      const filtered = mockResources.filter(resource => 
        resource.title.toLowerCase().includes(lowerQuery) || 
        resource.type.toLowerCase().includes(lowerQuery)
      );
      
      const newMessage = filtered.length > 0 
        ? { role: 'assistant', type: 'results', content: 'I found these resources:', data: filtered, timestamp: Date.now() }
        : { role: 'assistant', type: 'fallback', content: `I couldn't find an exact match for your query.`, timestamp: Date.now() };

      setChats(prev => {
        let updated = prev.map(c => {
          if (c.id === activeChatId) {
            return {
              ...c,
              title: c.title === 'New Chat' ? q.slice(0, 20) : c.title,
              messages: [...c.messages, newMessage],
              lastUpdated: Date.now()
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
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleNavigateToIngestion = (fallbackQuery) => {
    setIsOpen(false);
    navigate('/data-ingestion', { 
      state: { 
        prefillDataName: fallbackQuery || 'New Data Asset',
        prefillDataDescription: fallbackQuery ? `Generated from search query: ${fallbackQuery}` : ''
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
            <div className="relative flex flex-col h-full w-full">
              {/* Sidebar Overlay */}
              <div 
                className={`absolute top-0 left-0 h-full w-64 bg-gray-50 border-r border-gray-200 z-20 transform transition-transform duration-300 flex flex-col ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}
              >
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white min-h-[60px]">
                  <h3 className="font-semibold text-gray-800">Chat History</h3>
                  <div className="flex gap-1">
                    <button onClick={handleNewChat} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors" title="New Chat">
                      <Plus size={16} />
                    </button>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors md:hidden" title="Close Sidebar">
                      <X size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {chats.map(chat => (
                    <button
                      key={chat.id}
                      onClick={() => { setActiveChatId(chat.id); setIsSidebarOpen(false); }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm truncate transition-colors ${chat.id === activeChatId ? 'bg-red-50 text-[#d52b1e] font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
                    >
                      {chat.title}
                    </button>
                  ))}
                </div>
                <div className="p-3 bg-white text-[10px] text-gray-400 border-t border-gray-200">
                  <p className="font-semibold mb-1">Backend Planned:</p>
                  <p>GET /chats, POST /chat, GET /chat/:id, DELETE /chat/:id</p>
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
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white hover:bg-white/20 p-1 rounded-md transition-colors mr-1">
                      <Menu size={20} />
                    </button>
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
                <div ref={chatBodyRef} className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-5">
                  {activeChat?.messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-[#d52b1e] flex items-center justify-center text-white flex-shrink-0 mt-1">
                          <MessageSquare size={16} />
                        </div>
                      )}
                      {msg.role === 'user' ? (
                        <div className="bg-[#d52b1e] p-3 rounded-2xl rounded-tr-sm shadow-sm text-sm text-white max-w-[80%] break-words">
                          {msg.content}
                        </div>
                      ) : (
                        <div className="bg-white p-3 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm w-full">
                          {msg.type === 'text' && (
                            <div className="text-sm text-gray-700">{msg.content}</div>
                          )}
                          {msg.type === 'results' && (
                            <>
                              <p className="text-sm text-gray-700 mb-2 font-medium">{msg.content}</p>
                              <div className="space-y-2">
                                {msg.data.map((res) => (
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
                            </>
                          )}
                          {msg.type === 'fallback' && (
                            <>
                              <p className="text-sm text-gray-700 mb-3">
                                {msg.content} Based on your input, the <strong>File Ingestion Core Component</strong> seems most relevant.
                              </p>
                              <p className="text-sm text-gray-700 mb-4">
                                Let me know if you'd like to proceed. I can redirect you to Data Ingestion to register this.
                              </p>
                              
                              {/* CTA Button */}
                              <button 
                                onClick={() => handleNavigateToIngestion(activeChat.messages[idx - 1]?.content)}
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
                    <span className="text-[10px] text-gray-400">Powered by AI Search</span>
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
