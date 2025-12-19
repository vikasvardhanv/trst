import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, User, Bot } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { BrandLogo } from '../constants';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const GlobalChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there! 👋 I'm the Highshift AI Assistant. I can help you with:\n\n• Project requirements\n• Service information\n• Scheduling a consultation\n\nHow can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY;
      
      if (!apiKey) {
        throw new Error("API Key missing");
      }

      // Use v1alpha for the experimental model
      const client = new GoogleGenAI({ apiKey, apiVersion: 'v1alpha' });

      // Construct history for the new SDK
      // The new SDK expects 'user' and 'model' roles.
      // Filter out the initial hardcoded bot message if it's the first one to ensure conversation starts with user
      const historyMessages = messages.filter((m, index) => {
          if (index === 0 && m.sender === 'bot') return false;
          return true;
      });

      const contents = historyMessages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      // Add the new user message
      contents.push({
        role: 'user',
        parts: [{ text: userMessage.text }]
      });

      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
          systemInstruction: {
            parts: [{ text: `You are the Highshift Media AI Consultant. Your goal is to help potential clients by understanding their needs and gathering requirements for their AI or software projects.

            Your capabilities:
            1. Discuss Highshift services: Custom Chatbots, AI Automation, Voice Agents, Web Design, Marketing.
            2. Onboarding: Ask relevant questions to understand their project (industry, goals, budget, timeline).
            3. Lead Capture: If they seem interested, ask for their name and email or phone number so a human expert can contact them.
            4. Handoff: If you can't answer something or if they want to talk to a human, tell them you've noted their request and a senior consultant will reach out shortly (after you've got their contact info).

            Tone: Professional, helpful, modern, and concise.
            Do not make up technical details you don't know.
            Always try to move the conversation towards gathering requirements or booking a consultation.` }]
          }
        }
      });

      const text = response.text();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: text || "I'm sorry, I didn't catch that.",
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `I'm having trouble connecting to the server right now. (Error: ${error.message || 'Unknown'}). Please try again later or contact us directly at info@highshiftmedia.com.`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 z-50 bg-sky-500 text-white p-4 rounded-full shadow-2xl shadow-sky-500/30 flex items-center justify-center group"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        
        {/* Notification dot if closed and initial message exists */}
        {!isOpen && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 sm:right-8 z-50 w-[90vw] sm:w-[400px] h-[600px] max-h-[80vh] flex flex-col bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-sky-500/20 flex items-center justify-center border border-sky-500/30">
                <BrandLogo className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-white">Highshift Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-white/60">Online</span>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-sky-500 text-white rounded-br-none'
                        : 'bg-white/10 text-white/90 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span className="text-[10px] opacity-50 mt-1 block">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 p-3 rounded-2xl rounded-bl-none flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-sky-400" />
                    <span className="text-xs text-white/50">Typing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white/5 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-sky-500/50 focus:bg-white/10 transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-sky-500 text-white p-2 rounded-xl hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
