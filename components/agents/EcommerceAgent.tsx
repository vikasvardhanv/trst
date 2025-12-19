import React, { useState, useRef, useEffect } from 'react';
import { EcommerceIcon } from '../../constants';

interface EcommerceAgentProps {
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

export const EcommerceAgent: React.FC<EcommerceAgentProps> = ({ onBack, onRestart }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Hi there! 👋 Welcome to Highshift Store.\n\nI'm your shopping assistant. I can help you with:\n\n• Tracking orders\n• Finding products\n• Returns & Refunds\n• Sizing guides\n\nHow can I help you today?",
      timestamp: new Date(),
      actions: [
        { label: 'Track Order', action: 'track_order' },
        { label: 'Find Products', action: 'find_products' },
        { label: 'Return Policy', action: 'return_policy' },
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
      case 'track_order':
        addMessage('user', 'I want to track my order.');
        setTimeout(() => {
          addMessage('bot', "Sure! Please enter your order number (e.g., #12345).", [
            { label: 'Enter #12345', action: 'check_status', data: '#12345' }
          ]);
        }, 500);
        break;

      case 'check_status':
        addMessage('user', `Order ${data}`);
        setTimeout(() => {
          addMessage('bot', `📦 **Order ${data}**\nStatus: Out for Delivery\nEstimated Delivery: Today by 8 PM\n\nIs there anything else I can help with?`, [
            { label: 'Find Products', action: 'find_products' },
            { label: 'No, thanks', action: 'restart' }
          ]);
        }, 800);
        break;

      case 'find_products':
        addMessage('user', 'I want to find some products.');
        setTimeout(() => {
          addMessage('bot', "What are you looking for today?", [
            { label: 'Men\'s Apparel', action: 'category', data: 'Men' },
            { label: 'Women\'s Apparel', action: 'category', data: 'Women' },
            { label: 'Accessories', action: 'category', data: 'Accessories' },
          ]);
        }, 500);
        break;

      case 'category':
        addMessage('user', `Show me ${data}.`);
        setTimeout(() => {
          addMessage('bot', `Here are our top picks for **${data}**:\n\n1. Classic Tee - $25\n2. Denim Jacket - $85\n3. Summer Shorts - $45\n\nTap an item to view details.`, [
            { label: 'View Classic Tee', action: 'view_product', data: 'Classic Tee' },
            { label: 'View Denim Jacket', action: 'view_product', data: 'Denim Jacket' },
            { label: 'Back to Categories', action: 'find_products' }
          ]);
        }, 500);
        break;

      case 'view_product':
        addMessage('user', `I'm interested in the ${data}.`);
        setTimeout(() => {
          addMessage('bot', `**${data}** is a great choice! It's made from 100% organic cotton.\n\nWould you like to add it to your cart?`, [
            { label: 'Add to Cart', action: 'add_to_cart', data: data },
            { label: 'Keep Browsing', action: 'find_products' }
          ]);
        }, 500);
        break;

      case 'add_to_cart':
        addMessage('user', 'Add to cart.');
        setTimeout(() => {
          addMessage('bot', `✅ Added **${data}** to your cart.\n\nReady to checkout?`, [
            { label: 'Checkout', action: 'checkout' },
            { label: 'Continue Shopping', action: 'find_products' }
          ]);
        }, 500);
        break;

      case 'checkout':
        addMessage('user', 'I want to checkout.');
        setTimeout(() => {
          addMessage('bot', "Redirecting you to our secure checkout page... (Demo ends here)", [
            { label: 'Start Over', action: 'restart' }
          ]);
        }, 500);
        break;

      case 'return_policy':
        addMessage('user', 'What is your return policy?');
        setTimeout(() => {
          addMessage('bot', "We offer a 30-day return policy for all unworn items with tags attached. Returns are free!", [
            { label: 'Start a Return', action: 'start_return' },
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
          <div className="p-2 bg-pink-500/20 rounded-lg">
            <EcommerceIcon className="w-6 h-6 text-pink-400" />
          </div>
          <div>
            <h3 className="font-bold text-white">E-commerce Support</h3>
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
                  ? 'bg-pink-600 text-white rounded-tr-none'
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
            className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition"
          />
          <button
            type="submit"
            className="bg-pink-600 hover:bg-pink-500 text-white px-6 rounded-xl font-medium transition"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
