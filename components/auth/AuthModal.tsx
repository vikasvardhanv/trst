import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import {
  X, Mail, Lock, User, Building2, Phone, ArrowRight, Eye, EyeOff,
  AlertCircle, CheckCircle2, Loader2, ArrowLeft
} from 'lucide-react';

// Google Icon
const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// Apple Icon
const AppleIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

type AuthView = 'options' | 'email-login' | 'email-signup';

export const AuthModal: React.FC = () => {
  const navigate = useNavigate();
  const {
    showAuthModal,
    setShowAuthModal,
    authModalMode,
    setAuthModalMode,
    login,
    signup,
    oauthLogin,
    pendingDemoRedirect,
    setPendingDemoRedirect
  } = useAuth();

  const [view, setView] = useState<AuthView>('options');
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (showAuthModal) {
      setView('options');
      setError('');
      setSuccess('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFullName('');
      setCompany('');
      setPhone('');
      setAgreeToTerms(false);
    }
  }, [showAuthModal, authModalMode]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowAuthModal(false);
    };
    if (showAuthModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [showAuthModal, setShowAuthModal]);

  const handleSuccess = () => {
    setTimeout(() => {
      setShowAuthModal(false);
      if (pendingDemoRedirect) {
        navigate(pendingDemoRedirect);
        setPendingDemoRedirect(null);
      }
    }, 500);
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    setOauthLoading('google');
    setError('');

    try {
      // Load Google Identity Services
      const google = (window as any).google;
      if (!google?.accounts?.id) {
        // If Google SDK not loaded, show error
        setError('Google Sign-In is not available. Please try email sign-in.');
        setOauthLoading(null);
        return;
      }

      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (response: any) => {
          try {
            // Decode JWT to get user info
            const payload = JSON.parse(atob(response.credential.split('.')[1]));

            const result = await oauthLogin({
              email: payload.email,
              fullName: payload.name,
              provider: 'google',
              providerId: payload.sub
            });

            if (result.success) {
              setSuccess('Signed in with Google!');
              handleSuccess();
            } else {
              setError(result.message);
            }
          } catch (err) {
            setError('Failed to sign in with Google');
          }
          setOauthLoading(null);
        }
      });

      google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback: Open popup
          google.accounts.id.renderButton(
            document.getElementById('google-signin-btn'),
            { theme: 'outline', size: 'large', width: '100%' }
          );
          document.getElementById('google-signin-btn')?.click();
        }
      });
    } catch (err) {
      setError('Google Sign-In failed. Please try email sign-in.');
      setOauthLoading(null);
    }
  };

  // Apple Sign-In
  const handleAppleSignIn = async () => {
    setOauthLoading('apple');
    setError('');

    try {
      const AppleID = (window as any).AppleID;
      if (!AppleID?.auth) {
        setError('Apple Sign-In is not available. Please try email sign-in.');
        setOauthLoading(null);
        return;
      }

      AppleID.auth.init({
        clientId: import.meta.env.VITE_APPLE_CLIENT_ID,
        scope: 'name email',
        redirectURI: window.location.origin,
        usePopup: true
      });

      const response = await AppleID.auth.signIn();

      const result = await oauthLogin({
        email: response.user?.email || '',
        fullName: response.user?.name?.firstName
          ? `${response.user.name.firstName} ${response.user.name.lastName || ''}`.trim()
          : '',
        provider: 'apple',
        providerId: response.user?.id || response.authorization?.id_token
      });

      if (result.success) {
        setSuccess('Signed in with Apple!');
        handleSuccess();
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      if (err.error !== 'popup_closed_by_user') {
        setError('Apple Sign-In failed. Please try email sign-in.');
      }
    }
    setOauthLoading(null);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (view === 'email-login') {
        const result = await login(email, password);
        if (result.success) {
          setSuccess('Login successful!');
          handleSuccess();
        } else {
          setError(result.message);
        }
      } else {
        // Signup validation
        if (!agreeToTerms) {
          setError('Please agree to the Terms and Privacy Policy');
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }
        if (password.length < 8) {
          setError('Password must be at least 8 characters');
          setIsLoading(false);
          return;
        }

        const result = await signup({ email, password, fullName, company, phone });
        if (result.success) {
          setSuccess('Account created successfully!');
          handleSuccess();
        } else {
          setError(result.message);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!showAuthModal) return null;

  const isSignUp = authModalMode === 'signup';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={() => setShowAuthModal(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <GlassCard className="p-8">
            {/* Close button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Back button for email forms */}
            {view !== 'options' && (
              <button
                onClick={() => setView('options')}
                className="absolute top-4 left-4 p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {view === 'options'
                  ? (isSignUp ? 'Create Account' : 'Welcome Back')
                  : view === 'email-login'
                    ? 'Sign in with Email'
                    : 'Sign up with Email'
                }
              </h2>
              <p className="text-white/60 text-sm">
                {view === 'options'
                  ? (isSignUp ? 'Choose how to create your account' : 'Choose how to sign in')
                  : (view === 'email-login' ? 'Enter your email and password' : 'Fill in your details')
                }
              </p>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-emerald-400 text-sm">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {success}
              </div>
            )}

            {/* Options View */}
            {view === 'options' && (
              <div className="space-y-3">
                {/* Google Button */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={oauthLoading !== null}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {oauthLoading === 'google' ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <GoogleIcon />
                  )}
                  Continue with Google
                </button>
                <div id="google-signin-btn" className="hidden" />

                {/* Apple Button */}
                <button
                  onClick={handleAppleSignIn}
                  disabled={oauthLoading !== null}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition-colors border border-white/20 disabled:opacity-50"
                >
                  {oauthLoading === 'apple' ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <AppleIcon />
                  )}
                  Continue with Apple
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gray-900 text-white/50">or</span>
                  </div>
                </div>

                {/* Email Button */}
                <button
                  onClick={() => setView(isSignUp ? 'email-signup' : 'email-login')}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/5 text-white font-medium rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                >
                  <Mail className="h-5 w-5" />
                  Continue with Email
                </button>

                {/* Terms notice */}
                <p className="text-xs text-white/40 text-center mt-6">
                  By continuing, you agree to our{' '}
                  <Link to="/terms" onClick={() => setShowAuthModal(false)} className="text-sky-400 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" onClick={() => setShowAuthModal(false)} className="text-sky-400 hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            )}

            {/* Email Login Form */}
            {view === 'email-login' && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-12 text-white placeholder-white/30 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  className="w-full mt-6"
                  size="lg"
                  disabled={isLoading}
                  icon={isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

                <p className="text-center text-sm text-white/50 mt-4">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMode('signup');
                      setView('options');
                    }}
                    className="text-sky-400 hover:text-sky-300"
                  >
                    Sign up
                  </button>
                </p>
              </form>
            )}

            {/* Email Signup Form */}
            {view === 'email-signup' && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-12 text-white placeholder-white/30 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
                      placeholder="••••••••"
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-white/40 mt-1">Minimum 8 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Company (Optional)</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
                      placeholder="Acme Inc."
                    />
                  </div>
                </div>

                {/* Terms checkbox */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-sky-500 focus:ring-sky-500/50"
                  />
                  <span className="text-sm text-white/60">
                    I agree to the{' '}
                    <Link to="/terms" onClick={() => setShowAuthModal(false)} className="text-sky-400 hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" onClick={() => setShowAuthModal(false)} className="text-sky-400 hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>

                <Button
                  className="w-full mt-4"
                  size="lg"
                  disabled={isLoading}
                  icon={isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>

                <p className="text-center text-sm text-white/50 mt-4">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMode('login');
                      setView('options');
                    }}
                    className="text-sky-400 hover:text-sky-300"
                  >
                    Sign in
                  </button>
                </p>
              </form>
            )}

            {/* Security note */}
            <div className="flex items-center justify-center gap-2 text-xs text-white/40 mt-6">
              <Lock className="h-3 w-3" />
              <span>256-bit SSL Encrypted</span>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
