import React, { useState, useRef, useEffect } from 'react';
import { LegalIcon } from '../../constants';

interface LegalAgentProps {
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

export const LegalAgent: React.FC<LegalAgentProps> = ({ onBack, onRestart }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Welcome to Highshift Law. ⚖️\n\nI am your virtual legal assistant. I can help you with:\n\n• New case inquiries\n• Scheduling consultations\n• Information about our practice areas\n\nHow can I assist you today?",
      timestamp: new Date(),
      actions: [
        { label: 'New Case Inquiry', action: 'new_case' },
        { label: 'Schedule Consultation', action: 'schedule_consultation' },
        { label: 'Practice Areas', action: 'practice_areas' },
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
      case 'new_case':
        addMessage('user', 'I have a new case inquiry.');
        setTimeout(() => {
          addMessage('bot', "I can help screen your case. What type of legal issue are you facing?", [
            { label: 'Personal Injury', action: 'case_type', data: 'Personal Injury' },
            { label: 'Family Law', action: 'case_type', data: 'Family Law' },
            { label: 'Business/Corporate', action: 'case_type', data: 'Business' },
            { label: 'Other', action: 'case_type', data: 'Other' },
          ]);
        }, 500);
        break;

      case 'case_type':
        addMessage('user', `It's regarding ${data}.`);
        setTimeout(() => {
          addMessage('bot', "Thank you. To better assist you, when did this incident occur or when did the issue start?", [
            { label: 'Recently (Last 30 days)', action: 'timeline', data: 'Recent' },
            { label: 'Within the last year', action: 'timeline', data: 'Within Year' },
            { label: 'Over a year ago', action: 'timeline', data: 'Over Year' },
          ]);
        }, 500);
        break;

      case 'timeline':
        addMessage('user', `It happened ${data}.`);
        setTimeout(() => {
          addMessage('bot', "Thank you for that information. Based on what you've told me, we should schedule a brief consultation with an attorney to discuss your options.", [
            { label: 'Schedule Now', action: 'schedule_consultation' },
            { label: 'Not Ready Yet', action: 'restart' }
          ]);
        }, 500);
        break;

      case 'schedule_consultation':
        addMessage('user', 'I would like to schedule a consultation.');
        setTimeout(() => {
          addMessage('bot', "Please select a preferred time for a 15-minute initial call:", [
            { label: 'Tomorrow Morning', action: 'confirm_time', data: 'Tomorrow Morning' },
            { label: 'Tomorrow Afternoon', action: 'confirm_time', data: 'Tomorrow Afternoon' },
            { label: 'Next Week', action: 'confirm_time', data: 'Next Week' },
          ]);
        }, 500);
        break;

      case 'confirm_time':
        addMessage('user', `I prefer ${data}.`);
        setTimeout(() => {
          addMessage('bot', `Confirmed. We have tentatively booked you for ${data}. You will receive an email confirmation shortly.`, [
            { label: 'Back to Menu', action: 'restart' }
          ]);
        }, 500);
        break;

      case 'practice_areas':
        addMessage('user', 'What are your practice areas?');
        setTimeout(() => {
          addMessage('bot', "We specialize in:\n\n• **Personal Injury**: Car accidents, slip and fall.\n• **Family Law**: Divorce, custody, support.\n• **Corporate Law**: Incorporation, contracts, disputes.\n\nWould you like to discuss a specific area?", [
            { label: 'Yes, New Case', action: 'new_case' },
            { label: 'No, thanks', action: 'restart' }
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
      addMessage('bot', "I'm a demo agent. Please use the buttons to navigate the conversation.", [
        { label: 'Show Menu', action: 'restart' }
      ]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-slate-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Header */}
      <div className="bg-slate-800 p-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-500/20 rounded-lg">
            <LegalIcon className="w-6 h-6 text-slate-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">Legal Intake Agent</h3>
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
                  ? 'bg-slate-600 text-white rounded-tr-none'
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
            className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-slate-500 transition"
          />
          <button
            type="submit"
            className="bg-slate-600 hover:bg-slate-500 text-white px-6 rounded-xl font-medium transition"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
