import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { GlassCard } from '../ui/GlassCard';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, setShowAuthModal, setAuthModalMode } = useAuth();

  const handleSignIn = () => {
    setAuthModalMode('login');
    setShowAuthModal(true);
  };

  const handleSignUp = () => {
    setAuthModalMode('signup');
    setShowAuthModal(true);
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-sky-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-sky-500/20 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <GlassCard className="p-8">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-sky-500/10 flex items-center justify-center">
              <Lock className="h-8 w-8 text-sky-400" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-3">
              Sign in to Access Demos
            </h2>
            <p className="text-white/60 mb-8">
              Create a free account to try our AI demos and see how they can transform your business.
            </p>

            <div className="space-y-3">
              <Button
                className="w-full"
                size="lg"
                onClick={handleSignUp}
                icon={<ArrowRight className="h-5 w-5" />}
              >
                Create Free Account
              </Button>

              <Button
                variant="secondary"
                className="w-full"
                size="lg"
                onClick={handleSignIn}
              >
                Sign In
              </Button>
            </div>

            <p className="text-xs text-white/40 mt-6">
              Free account includes access to all demos. No credit card required.
            </p>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  // Authenticated - render children
  return <>{children}</>;
};
