import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { GradientText } from '../components/ui/FloatingElements';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export const ClientLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert("This is a demo portal. In a real deployment, this would authenticate with your backend.");
    }, 1500);
  };

  return (
    <Layout>
      <SEO 
        title="Client Portal Login | Highshift Media"
        description="Secure client access for Highshift Media project management and analytics."
        keywords="Client Portal, Login, Project Dashboard"
      />

      <section className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              <GradientText>Client Portal</GradientText>
            </h1>
            <p className="text-white/50 text-sm">
              Access your project status, analytics, and billing.
            </p>
          </div>

          <GlassCard className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg" 
                disabled={isLoading}
                icon={isLoading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white" /> : <ArrowRight className="h-5 w-5" />}
              >
                {isLoading ? 'Authenticating...' : 'Sign In'}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-white/40 mt-4">
                <Lock className="h-3 w-3" />
                <span>256-bit SSL Encrypted Connection</span>
              </div>
            </form>
          </GlassCard>

          <div className="text-center mt-6">
            <p className="text-white/40 text-sm">
              Don't have an account? <a href="/contact" className="text-sky-400 hover:underline">Contact Support</a>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};
