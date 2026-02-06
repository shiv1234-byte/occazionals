import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react'; // Fix 1: Change 'bot' to 'Bot'
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../utils/config';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom whenever messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const predefinedFAQs = [
    "What is the rental duration?",
    "How does the return process work?",
    "What sizes do you offer?",
    "Do you offer delivery in Delhi?",
    "Can I buy a rented dress?"
  ];

  const handleSendMessage = async (textToSend = input) => {
    const messageText = typeof textToSend === 'string' ? textToSend : input;
    if (messageText.trim() === '') return;

    const userMessage = { text: messageText, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5000/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: messageText }),
      });
      const data = await response.json();
      
      const botMessage = { 
        text: data.response || "I'm sorry, I don't have an answer for that right now. Please try again.", 
        sender: 'bot' 
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot API error:", error);
      setMessages((prev) => [...prev, { text: "Oops! Server is not responding. Check if backend is running.", sender: 'bot' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFAQClick = (question) => {
    handleSendMessage(question); // Fix 2: Directly pass question
  };

  return (
    <>
      {/* Floating Chat Bubble */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-black text-white p-4 rounded-full shadow-2xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-85 h-450px bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
          >
            {/* Chat Header */}
            <div className="bg-black text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Bot size={20} /> {/* Fix 3: Use Bot component */}
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Occazionals AI</h3>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50"
            >
              {messages.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm mb-4">Hi! I'm your Occazionals assistant. How can I help you?</p>
                  <div className="flex flex-col gap-2">
                    {predefinedFAQs.map((faq, idx) => (
                      <button 
                        key={idx} 
                        className="text-xs bg-white border border-gray-200 hover:border-black hover:bg-gray-50 p-3 rounded-xl text-left transition-all shadow-sm"
                        onClick={() => handleFAQClick(faq)}
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
                    className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                      msg.sender === 'user' 
                      ? 'bg-black text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Field */}
            <div className="p-4 bg-white border-t">
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent border-none outline-none text-sm py-2"
                />
                <button 
                  onClick={() => handleSendMessage()}
                  className="text-black hover:scale-110 transition-transform"
                >
                  <Send size={20} />
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
