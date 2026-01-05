import React, { useEffect, useMemo } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { ArrowRight, LogIn, UserPlus } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

type AuthPageProps = {
  mode: 'login' | 'signup';
};

const getSafeRedirect = (search: string) => {
  const params = new URLSearchParams(search);
  const target = params.get('redirect');

  if (!target) return '/';
  if (!target.startsWith('/') || target.startsWith('//')) return '/';
  if (target === '/login' || target === '/signup') return '/';

  return target;
};

export const AuthPage: React.FC<AuthPageProps> = ({ mode }) => {
  const { isAuthenticated, isLoading, setShowAuthModal, setAuthModalMode } = useAuth();
  const location = useLocation();
  const redirectPath = useMemo(() => getSafeRedirect(location.search), [location.search]);
  const isSignup = mode === 'signup';

  useEffect(() => {
    if (isLoading || isAuthenticated) return;

    setAuthModalMode(mode);
    setShowAuthModal(true);

    return () => {
      setShowAuthModal(false);
    };
  }, [isLoading, isAuthenticated, mode, setAuthModalMode, setShowAuthModal]);

  if (isLoading) {
    return (
      <Layout showFooter={false}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-sky-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-sky-500/20 animate-pulse" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <Layout showFooter={false}>
      <SEO
        title={isSignup ? 'Create Account' : 'Sign In'}
        description="Sign in or create a Highshift account."
        url={isSignup ? '/signup' : '/login'}
        noindex
      />
      <section className="min-h-screen pt-28 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <GlassCard className="p-8 sm:p-10 text-center">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/15 text-sky-400">
              {isSignup ? <UserPlus className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">
              {isSignup ? 'Create your Highshift account' : 'Sign in to Highshift'}
            </h1>
            <p className="text-base text-white/60 mb-8">
              {isSignup
                ? 'Create a free account to access AI demos, saved sessions, and personalized recommendations.'
                : 'Welcome back. Sign in to access AI demos, saved sessions, and personalized recommendations.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                onClick={() => {
                  setAuthModalMode(mode);
                  setShowAuthModal(true);
                }}
                icon={<ArrowRight className="h-5 w-5" />}
              >
                {isSignup ? 'Create account' : 'Sign in'}
              </Button>
              <Link to={redirectPath}>
                <Button variant="secondary" size="lg">
                  Back to site
                </Button>
              </Link>
            </div>
            <p className="text-sm text-white/50 mt-6">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <Link
                to={isSignup ? '/login' : '/signup'}
                className="text-sky-400 hover:text-sky-300"
              >
                {isSignup ? 'Sign in' : 'Create one'}
              </Link>
            </p>
          </GlassCard>
        </div>
      </section>
    </Layout>
  );
};
