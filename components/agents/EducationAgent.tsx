import React, { useState, useRef, useEffect } from 'react';
import { EducationIcon } from '../../constants';

interface EducationAgentProps {
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

export const EducationAgent: React.FC<EducationAgentProps> = ({ onBack, onRestart }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Welcome to Highshift University! 🎓\n\nI'm here to help prospective students and parents. I can assist with:\n\n• Course information\n• Admissions process\n• Campus life\n• Tuition & Financial Aid\n\nHow can I help you today?",
      timestamp: new Date(),
      actions: [
        { label: 'Explore Courses', action: 'explore_courses' },
        { label: 'Admissions Info', action: 'admissions' },
        { label: 'Campus Life', action: 'campus_life' },
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
      case 'explore_courses':
        addMessage('user', 'I want to explore courses.');
        setTimeout(() => {
          addMessage('bot', "We offer a wide range of programs. Which area interests you most?", [
            { label: 'Computer Science', action: 'program_details', data: 'Computer Science' },
            { label: 'Business', action: 'program_details', data: 'Business' },
            { label: 'Arts & Design', action: 'program_details', data: 'Arts' },
          ]);
        }, 500);
        break;

      case 'program_details':
        addMessage('user', `Tell me about ${data}.`);
        setTimeout(() => {
          addMessage('bot', `Our **${data}** program is top-ranked! It includes:\n\n• Hands-on projects\n• Industry partnerships\n• Expert faculty\n\nWould you like to download the syllabus or apply?`, [
            { label: 'Download Syllabus', action: 'download_syllabus' },
            { label: 'How to Apply', action: 'admissions' },
            { label: 'Back to Menu', action: 'restart' }
          ]);
        }, 500);
        break;

      case 'admissions':
        addMessage('user', 'How do I apply?');
        setTimeout(() => {
          addMessage('bot', "Applying is easy! You'll need:\n\n1. High school transcripts\n2. Personal statement\n3. Two letters of recommendation\n\nApplications are due by **January 15th**.", [
            { label: 'Start Application', action: 'start_app' },
            { label: 'Tuition Info', action: 'tuition' }
          ]);
        }, 500);
        break;

      case 'tuition':
        addMessage('user', 'What is the tuition?');
        setTimeout(() => {
          addMessage('bot', "Tuition for the upcoming academic year is $15,000 per semester. We also offer various scholarships and financial aid packages.", [
            { label: 'Scholarship Info', action: 'scholarships' },
            { label: 'Back to Menu', action: 'restart' }
          ]);
        }, 500);
        break;

      case 'campus_life':
        addMessage('user', 'What is campus life like?');
        setTimeout(() => {
          addMessage('bot', "Our campus is vibrant! We have over 50 student clubs, a state-of-the-art gym, and regular events. 🏟️", [
            { label: 'Housing Options', action: 'housing' },
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
      addMessage('bot', "I'm a demo agent. Please use the buttons to navigate.", [
        { label: 'Show Menu', action: 'restart' }
      ]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-slate-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Header */}
      <div className="bg-slate-800 p-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/20 rounded-lg">
            <EducationIcon className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">Education Agent</h3>
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
                  ? 'bg-yellow-600 text-white rounded-tr-none'
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
            className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition"
          />
          <button
            type="submit"
            className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 rounded-xl font-medium transition"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
