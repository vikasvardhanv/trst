import React from 'react';
import { motion } from 'framer-motion';
import { BrandLogo, INDUSTRY_AGENTS } from '../constants';
import type { IndustryAgent } from '../types';

interface IndustryAgentHubProps {
  onSelectAgent: (agentId: string) => void;
  onRestart: () => void;
}

const AgentCard: React.FC<{ agent: IndustryAgent; onClick: () => void }> = ({ agent, onClick }) => (
  <button
    onClick={onClick}
    className="glass-card p-6 rounded-2xl text-left w-full h-full flex flex-col group overflow-hidden relative hover:scale-[1.02] transition-all duration-300 cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative z-10">
      <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300 p-3 rounded-xl bg-white/5 w-fit">
        {agent.icon}
      </div>
      <span className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-2 block">{agent.industry}</span>
      <h3 className="font-bold text-xl text-white mb-3">{agent.name}</h3>
      <p className="text-gray-300 text-sm leading-relaxed mb-6">{agent.description}</p>

      <div className="flex flex-wrap gap-2 mt-auto">
        {agent.features.slice(0, 3).map((feature, idx) => (
          <span key={idx} className="text-[10px] font-medium bg-white/10 text-white/80 px-2.5 py-1 rounded-full border border-white/5">
            {feature}
          </span>
        ))}
        {agent.features.length > 3 && (
          <span className="text-[10px] font-medium text-white/40 flex items-center">+{agent.features.length - 3} more</span>
        )}
      </div>

      {agent.demoAvailable && (
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between w-full group-hover:border-white/20 transition-colors">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Live Demo</span>
          </div>
          <div className="text-white/40 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      )}
    </div>
  </button>
);

export const IndustryAgentHub: React.FC<IndustryAgentHubProps> = ({ onSelectAgent, onRestart }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start p-6 sm:p-10 lg:p-16 relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <BrandLogo className="h-12 w-12" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Industry AI Agents</h1>
              <p className="text-sm text-white/50">Pre-built solutions for every business</p>
            </div>
          </div>
          <button
            onClick={onRestart}
            className="text-xs font-bold text-white/40 hover:text-white transition uppercase tracking-widest flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>

        {/* Description */}
        <div className="glass-panel rounded-2xl p-8 mb-12 border-white/5">
          <h2 className="text-xl font-bold text-white mb-4">Intelligent Automation for Every Industry</h2>
          <p className="text-white/60 leading-relaxed">
            Our AI agents are purpose-built for specific industries, handling everything from customer inquiries
            and appointment booking to order management and reporting. Each agent integrates seamlessly with
            your existing systems and can be customized to match your brand.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-sky-400">24/7</div>
              <div className="text-xs text-white/40 uppercase tracking-widest mt-1">Availability</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">95%</div>
              <div className="text-xs text-white/40 uppercase tracking-widest mt-1">Query Resolution</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">60%</div>
              <div className="text-xs text-white/40 uppercase tracking-widest mt-1">Cost Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">&lt;2min</div>
              <div className="text-xs text-white/40 uppercase tracking-widest mt-1">Response Time</div>
            </div>
          </div>
        </div>

        {/* Agent Grid */}
        <motion.div 
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {INDUSTRY_AGENTS.map((agent) => (
            <motion.div
              key={agent.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
            >
              <AgentCard
                agent={agent}
                onClick={() => onSelectAgent(agent.id)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <p className="text-white/40 mb-4">Don't see your industry? We build custom agents too.</p>
          <a
            href="mailto:info@highshiftmedia.com?subject=Custom AI Agent Inquiry"
            className="inline-flex items-center gap-2 bg-sky-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-sky-400 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Contact Us for Custom Solutions
          </a>
        </div>
      </motion.div>

      <footer className="w-full text-center mt-20 p-4 text-xs font-medium tracking-widest text-white/30 uppercase">
        &copy; {new Date().getFullYear()} Highshift Media &bull; Industry AI Agents
      </footer>
    </div>
  );
};
