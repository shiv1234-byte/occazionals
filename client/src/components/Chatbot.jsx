import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../utils/config';

const API_URL = import.meta.env.PROD 
  ? "https://Occasionals.onrender.com/api/chatbot" 
  : "http://localhost:5000/api/chatbot";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const predefinedFAQs = [
    "Do you have Kundan Jewellery?",
    "What is the shipping time?",
    "How to track my order?",
    "Do you offer delivery in Delhi?",
  ];

  const handleSendMessage = async (textToSend = input) => {
    const messageText = typeof textToSend === 'string' ? textToSend : input;
    if (!messageText.trim()) return;

    const userMessage = { text: messageText, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: messageText }),
      });
      const data = await response.json();
      
      const botMessage = { 
        text: data.response || "I'm having trouble understanding. Could you rephrase?", 
        sender: 'bot' 
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { text: "Server connection lost.", sender: 'bot' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button - Adaptive Colors */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[999] bg-black dark:bg-pink-600 text-white p-4 rounded-full shadow-2xl transition-colors duration-500"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Main Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-[999] w-[90vw] sm:w-[350px] h-[500px] max-h-[70vh] bg-white dark:bg-[#1a1a1a] rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-gray-100 dark:border-gray-800 transition-colors duration-500"
          >
            {/* Header - Pink Accent for Brand Feel */}
            <div className="bg-black dark:bg-black text-white p-5 flex items-center justify-between shrink-0 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="bg-pink-600 p-2 rounded-xl">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Occazi-Bot</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">Online Help</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform text-gray-400">
                <X size={20} />
              </button>
            </div>

            {/* Messages Area - Dark Mode Ready */}
            <div 
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50 dark:bg-transparent scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800"
            >
              {messages.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-400 dark:text-gray-500 text-[11px] mb-6 uppercase font-bold tracking-widest">How can I help you, {user?.name?.split(' ')[0] || 'friend'}?</p>
                  <div className="flex flex-col gap-2">
                    {predefinedFAQs.map((faq, idx) => (
                      <button 
                        key={idx} 
                        className="text-[11px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-pink-500 dark:hover:border-pink-500 p-3 rounded-2xl text-left transition-all shadow-sm text-gray-700 dark:text-gray-300 font-medium"
                        onClick={() => handleSendMessage(faq)}
                      >
                        {faq}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm break-words transition-colors ${
                      msg.sender === 'user' 
                      ? 'bg-pink-600 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area - Adaptive */}
            <div className="p-4 bg-white dark:bg-[#1a1a1a] border-t border-gray-100 dark:border-gray-800 shrink-0">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 rounded-2xl px-4 py-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about jewelry..."
                  className="flex-1 bg-transparent border-none outline-none text-sm py-2 text-gray-800 dark:text-white placeholder:text-gray-400"
                />
                <button 
                  onClick={() => handleSendMessage()}
                  className="text-pink-600 dark:text-pink-500 p-1 hover:scale-125 transition-transform"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
