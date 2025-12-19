import React, { useState, useRef, useEffect } from 'react';
import { RecruitmentIcon } from '../../constants';

interface RecruitmentAgentProps {
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

export const RecruitmentAgent: React.FC<RecruitmentAgentProps> = ({ onBack, onRestart }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Hello! I'm the Highshift Recruiter. 🤝\n\nI can help you find your next career opportunity. I can assist with:\n\n• Viewing open positions\n• Submitting your resume\n• Learning about our culture\n\nHow can I help you today?",
      timestamp: new Date(),
      actions: [
        { label: 'View Openings', action: 'view_openings' },
        { label: 'Submit Resume', action: 'submit_resume' },
        { label: 'Company Culture', action: 'culture' },
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
      case 'view_openings':
        addMessage('user', 'I want to see open positions.');
        setTimeout(() => {
          addMessage('bot', "Here are our current openings:\n\n1. **Senior Frontend Developer** (Remote)\n2. **Product Manager** (New York)\n3. **Sales Representative** (London)\n\nWhich one interests you?", [
            { label: 'Frontend Dev', action: 'job_details', data: 'Frontend Developer' },
            { label: 'Product Manager', action: 'job_details', data: 'Product Manager' },
            { label: 'Sales Rep', action: 'job_details', data: 'Sales Representative' },
          ]);
        }, 500);
        break;

      case 'job_details':
        addMessage('user', `Tell me more about the ${data} role.`);
        setTimeout(() => {
          addMessage('bot', `The **${data}** role is a key position in our team. You'll be working on exciting projects with a competitive salary and benefits.\n\nRequirements:\n• 3+ years experience\n• Strong communication skills\n\nDo you want to apply?`, [
            { label: 'Apply Now', action: 'apply', data: data },
            { label: 'Back to Jobs', action: 'view_openings' }
          ]);
        }, 500);
        break;

      case 'apply':
        addMessage('user', `I want to apply for ${data}.`);
        setTimeout(() => {
          addMessage('bot', "Great! Please upload your resume to get started (Demo: Click 'Upload').", [
            { label: 'Upload Resume', action: 'upload_resume' }
          ]);
        }, 500);
        break;

      case 'upload_resume':
        addMessage('user', '[Resume Uploaded]');
        setTimeout(() => {
          addMessage('bot', "Thanks! I've received your resume. I'll analyze it and get back to you shortly.", [
            { label: 'Back to Menu', action: 'restart' }
          ]);
        }, 500);
        break;

      case 'culture':
        addMessage('user', 'What is the company culture like?');
        setTimeout(() => {
          addMessage('bot', "We value innovation, collaboration, and work-life balance. We have flexible hours, remote work options, and regular team retreats! 🌴", [
            { label: 'View Openings', action: 'view_openings' },
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
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <RecruitmentIcon className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">Recruitment Agent</h3>
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
                  ? 'bg-cyan-600 text-white rounded-tr-none'
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
            className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition"
          />
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 rounded-xl font-medium transition"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
