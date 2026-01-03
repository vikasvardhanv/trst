import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, Calendar } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { BrandIcon } from '../constants';
import { SchedulingModal } from './SchedulingModal';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const sanitizeAssistantText = (text: string) => {
  return text
    .replace(/\*\*/g, '')
    .replace(/[`*_>#]/g, '')
    .replace(/^\s*[-•]\s+/gm, '')
    .replace(/[•]/g, '')
    .replace(/\r/g, '')
    .replace(/[^\x20-\x7E\n]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

// Detect if message indicates booking intent
const hasBookingIntent = (text: string) => {
  const bookingKeywords = [
    'book', 'schedule', 'consultation', 'meeting', 'call', 'appointment',
    'talk to someone', 'speak with', 'get in touch', 'contact', 'demo',
    'calendly', 'available', 'free time', 'slot', 'set up a call'
  ];
  const lowerText = text.toLowerCase();
  return bookingKeywords.some(keyword => lowerText.includes(keyword));
};

export const GlobalChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm the Highshift Assistant. I can help with project requirements, service details, and booking a consultation. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBookingButton, setShowBookingButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleBookConsultation = () => {
    setIsSchedulingOpen(true);
    const bookingMessage: Message = {
      id: Date.now().toString(),
      text: "I've opened the booking calendar for you. Select a date and time that works best, and we'll set up your consultation with Zoom meeting and calendar invite!",
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, bookingMessage]);
    setShowBookingButton(false);
  };

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

      // Use v1beta for the latest models
      const client = new GoogleGenAI({ apiKey, apiVersion: 'v1beta' });

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
            parts: [{ text: `You are the Highshift Media assistant. Your goal is to help potential clients by understanding their needs and gathering requirements for AI or software projects. Speak like a knowledgeable human consultant. Use plain text only. Do not use markdown, bullet points, numbered lists, emojis, or special symbols. Use short paragraphs and complete sentences. Ask relevant questions about industry, goals, budget, timeline, integrations, and success metrics. When they want to book a consultation, schedule a call, or talk to someone, tell them you can open the booking calendar right now. Say something like "I can open our booking calendar for you right now. Just click the Book Consultation button below." Do not invent technical details. Aim to move the conversation toward a consultation booking.` }]
          }
        }
      });

      const text = sanitizeAssistantText(response.text || '');

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: text || "Sorry, I did not catch that. Could you rephrase your question?",
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Check if user or bot response indicates booking intent
      if (hasBookingIntent(userMessage.text) || hasBookingIntent(text)) {
        setShowBookingButton(true);
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: sanitizeAssistantText(`I am having trouble connecting to the server right now. Error details: ${error.message || 'Unknown'}. Please try again later or contact us directly at info@highshiftmedia.com.`),
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
      {/* Scheduling Modal */}
      <SchedulingModal
        isOpen={isSchedulingOpen}
        onClose={() => setIsSchedulingOpen(false)}
        source="chatbot"
      />

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
            <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-sky-500/20 flex items-center justify-center border border-sky-500/30">
                  <BrandIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Highshift Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-white/60">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleBookConsultation}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/30 rounded-full text-sky-400 text-xs font-medium transition-colors"
              >
                <Calendar className="h-3.5 w-3.5" />
                Book Call
              </button>
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

            {/* Booking Button - Shows when booking intent detected */}
            <AnimatePresence>
              {showBookingButton && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="px-4 py-3 bg-gradient-to-r from-sky-500/20 to-purple-500/20 border-t border-white/10"
                >
                  <button
                    onClick={handleBookConsultation}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-xl transition-colors"
                  >
                    <Calendar className="h-5 w-5" />
                    Book Consultation Now
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

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
