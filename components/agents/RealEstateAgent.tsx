import React, { useState, useRef, useEffect } from 'react';
import { RealEstateIcon } from '../../constants';

interface RealEstateAgentProps {
  onBack: () => void;
  onRestart: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  actions?: { label: string; action: string; data?: any }[];
}

export const RealEstateAgent: React.FC<RealEstateAgentProps> = ({ onBack, onRestart }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Welcome to Highshift Realty! 🏠\n\nI'm your AI real estate assistant. I can help you with:\n\n• Finding properties\n• Scheduling viewings\n• Market analysis\n• Mortgage estimation\n\nHow can I help you today?",
      timestamp: new Date(),
      actions: [
        { label: 'Search Properties', action: 'search_properties' },
        { label: 'Schedule Viewing', action: 'schedule_viewing' },
        { label: 'Sell My Home', action: 'sell_home' },
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (sender: 'user' | 'bot', text: string, actions?: Message['actions']) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender,
      text,
      timestamp: new Date(),
      actions
    }]);
  };

  const handleAction = async (action: string, data?: any) => {
    switch (action) {
      case 'search_properties':
        addMessage('user', 'I want to search for properties.');
        setTimeout(() => {
          addMessage('bot', "Great! What type of property are you looking for?", [
            { label: 'House', action: 'filter_type', data: 'House' },
            { label: 'Apartment', action: 'filter_type', data: 'Apartment' },
            { label: 'Condo', action: 'filter_type', data: 'Condo' },
          ]);
        }, 500);
        break;
      
      case 'filter_type':
        addMessage('user', `I'm looking for a ${data}.`);
        setTimeout(() => {
          addMessage('bot', `Understood. What is your budget range for a ${data}?`, [
            { label: 'Under $300k', action: 'filter_budget', data: '<300k' },
            { label: '$300k - $600k', action: 'filter_budget', data: '300k-600k' },
            { label: '$600k+', action: 'filter_budget', data: '600k+' },
          ]);
        }, 500);
        break;

      case 'filter_budget':
        addMessage('user', `My budget is ${data}.`);
        setTimeout(() => {
          addMessage('bot', "I found 3 properties that match your criteria:\n\n1. **123 Maple Ave** - $450,000 (3 Bed, 2 Bath)\n2. **456 Oak St** - $520,000 (4 Bed, 3 Bath)\n3. **789 Pine Ln** - $380,000 (2 Bed, 2 Bath)\n\nWould you like to schedule a viewing for any of these?", [
            { label: 'View 123 Maple Ave', action: 'schedule_specific', data: '123 Maple Ave' },
            { label: 'View 456 Oak St', action: 'schedule_specific', data: '456 Oak St' },
            { label: 'Start Over', action: 'restart' }
          ]);
        }, 800);
        break;

      case 'schedule_viewing':
        addMessage('user', 'I want to schedule a viewing.');
        setTimeout(() => {
          addMessage('bot', "Sure! Do you have a specific property in mind, or should we find one first?", [
            { label: 'Find Property', action: 'search_properties' },
            { label: 'Contact Agent', action: 'contact_agent' }
          ]);
        }, 500);
        break;

      case 'sell_home':
        addMessage('user', 'I want to sell my home.');
        setTimeout(() => {
          addMessage('bot', "I can help with that. To get started, could you tell me your property's address?", [
            { label: 'Enter Address', action: 'enter_address' } // Placeholder
          ]);
        }, 500);
        break;
        
      case 'schedule_specific':
        addMessage('user', `I'd like to see ${data}.`);
        setTimeout(() => {
          addMessage('bot', `Excellent choice! An agent will contact you shortly to confirm a time to view ${data}.`, [
             { label: 'Back to Menu', action: 'restart' }
          ]);
        }, 500);
        break;

      case 'restart':
        onRestart();
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    addMessage('user', input);
    setInput('');
    setTimeout(() => {
      addMessage('bot', "I'm a demo agent, so I can't process free text yet. Please use the buttons above to explore my capabilities! 🤖", [
        { label: 'Show Menu', action: 'restart' }
      ]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-slate-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Header */}
      <div className="bg-slate-800 p-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <RealEstateIcon className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">Real Estate Agent</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs text-white/60">Online</span>
            </div>
          </div>
        </div>
        <button onClick={onBack} className="text-white/40 hover:text-white transition">
          ✕
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-800 text-white/90 rounded-tl-none border border-white/5'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              {msg.actions && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {msg.actions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAction(action.action, action.data)}
                      className="text-xs font-medium bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition border border-white/5"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 bg-slate-800 border-t border-white/5">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 rounded-xl font-medium transition"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
