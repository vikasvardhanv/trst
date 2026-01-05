import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { LeadGenAgent } from '../../components/agents/LeadGenAgent';
import { motion } from 'framer-motion';
import { Target, Sparkles, Zap, Globe, ArrowLeft } from 'lucide-react';

export const LeadGenDemo: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/demos')}
            className="flex items-center gap-2 text-white/60 hover:text-white mb-8 transition group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Demos
          </motion.button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 mb-6">
              <Target className="h-4 w-4 text-violet-400" />
              <span className="text-sm text-violet-300">AI Lead Generation</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Google Maps Lead Scraper
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Instantly find and extract qualified business leads from Google Maps. 
              Perfect for sales teams, agencies, and marketers.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              { icon: <Sparkles className="w-5 h-5" />, label: 'AI-Powered', color: 'violet' },
              { icon: <Globe className="w-5 h-5" />, label: 'Any Location', color: 'blue' },
              { icon: <Zap className="w-5 h-5" />, label: 'Real-time', color: 'yellow' },
              { icon: <Target className="w-5 h-5" />, label: 'Qualified Leads', color: 'green' },
            ].map((feature, i) => (
              <div 
                key={i}
                className={`flex items-center gap-2 justify-center p-3 rounded-xl bg-${feature.color}-500/10 border border-${feature.color}-500/20`}
              >
                <span className={`text-${feature.color}-400`}>{feature.icon}</span>
                <span className="text-white/80 text-sm font-medium">{feature.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Main Agent Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <LeadGenAgent 
              onBack={() => navigate('/demos')}
              onRestart={() => window.location.reload()}
            />
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 p-6 bg-slate-800/30 rounded-2xl border border-white/5"
          >
            <h3 className="text-lg font-semibold text-white mb-4">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-violet-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-violet-400 font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-white">Enter Search</h4>
                  <p className="text-sm text-white/60">Choose business type and location</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-violet-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-violet-400 font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-white">AI Scrapes</h4>
                  <p className="text-sm text-white/60">Our AI extracts data from Google Maps</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-violet-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-violet-400 font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-white">Export Leads</h4>
                  <p className="text-sm text-white/60">Download as CSV for your CRM</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};
