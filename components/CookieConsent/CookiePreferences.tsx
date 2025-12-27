import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCookieConsent } from '../../context/CookieConsentContext';
import { Button } from '../ui/Button';
import { GlassCard } from '../ui/GlassCard';
import { X, Cookie, Shield, BarChart3, Target, Settings, Check } from 'lucide-react';

interface CookieCategory {
  id: 'necessary' | 'analytics' | 'marketing' | 'preferences';
  name: string;
  description: string;
  icon: React.ReactNode;
  required: boolean;
}

const cookieCategories: CookieCategory[] = [
  {
    id: 'necessary',
    name: 'Necessary Cookies',
    description: 'Essential for the website to function properly. These cookies enable core functionality such as security, authentication, and accessibility. They cannot be disabled.',
    icon: <Shield className="h-5 w-5" />,
    required: true,
  },
  {
    id: 'analytics',
    name: 'Analytics Cookies',
    description: 'Help us understand how visitors interact with our website. We use this data to improve our services and user experience. Data is anonymized.',
    icon: <BarChart3 className="h-5 w-5" />,
    required: false,
  },
  {
    id: 'marketing',
    name: 'Marketing Cookies',
    description: 'Used to deliver relevant advertisements and track ad campaign performance. These cookies may be set by our advertising partners.',
    icon: <Target className="h-5 w-5" />,
    required: false,
  },
  {
    id: 'preferences',
    name: 'Preference Cookies',
    description: 'Allow the website to remember your preferences such as language, theme, and other customizations for a better experience.',
    icon: <Settings className="h-5 w-5" />,
    required: false,
  },
];

export const CookiePreferences: React.FC = () => {
  const { showPreferences, setShowPreferences, consent, savePreferences, acceptAll, rejectAll } = useCookieConsent();

  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  // Sync with current consent on open
  useEffect(() => {
    if (showPreferences) {
      setPreferences({
        necessary: true,
        analytics: consent.analytics,
        marketing: consent.marketing,
        preferences: consent.preferences,
      });
    }
  }, [showPreferences, consent]);

  const handleToggle = (category: 'analytics' | 'marketing' | 'preferences') => {
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSave = () => {
    savePreferences(preferences);
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowPreferences(false);
    };
    if (showPreferences) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [showPreferences, setShowPreferences]);

  return (
    <AnimatePresence>
      {showPreferences && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowPreferences(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <GlassCard className="p-8" tilt={false}>
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-sky-500/20 text-sky-400">
                    <Cookie className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Cookie Preferences</h2>
                    <p className="text-white/50 text-sm">Manage your cookie settings</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Description */}
              <p className="text-white/60 text-sm mb-6">
                We use cookies to enhance your experience. You can choose which categories of cookies you want to allow.
                For more information, please read our{' '}
                <Link to="/cookies" className="text-sky-400 hover:underline" onClick={() => setShowPreferences(false)}>
                  Cookie Policy
                </Link>.
              </p>

              {/* Cookie Categories */}
              <div className="space-y-4 mb-8">
                {cookieCategories.map((category) => (
                  <div
                    key={category.id}
                    className={`p-4 rounded-xl border transition-all ${
                      preferences[category.id]
                        ? 'bg-sky-500/10 border-sky-500/30'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${
                        preferences[category.id] ? 'bg-sky-500/20 text-sky-400' : 'bg-white/10 text-white/50'
                      }`}>
                        {category.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4 mb-1">
                          <h3 className="font-semibold text-white">{category.name}</h3>

                          {category.required ? (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-500/20 text-emerald-400">
                              Always Active
                            </span>
                          ) : (
                            <button
                              onClick={() => handleToggle(category.id as 'analytics' | 'marketing' | 'preferences')}
                              className={`relative w-12 h-6 rounded-full transition-colors ${
                                preferences[category.id] ? 'bg-sky-500' : 'bg-white/20'
                              }`}
                            >
                              <span
                                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                  preferences[category.id] ? 'translate-x-6' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          )}
                        </div>
                        <p className="text-white/50 text-sm">{category.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={rejectAll}
                  className="flex-1 px-5 py-3 text-sm font-medium text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                >
                  Reject All
                </button>
                <button
                  onClick={acceptAll}
                  className="flex-1 px-5 py-3 text-sm font-medium text-white bg-white/10 hover:bg-white/15 rounded-xl transition-colors"
                >
                  Accept All
                </button>
                <Button onClick={handleSave} className="flex-1" icon={<Check className="h-4 w-4" />}>
                  Save Preferences
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
