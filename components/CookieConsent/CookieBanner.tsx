import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCookieConsent } from '../../context/CookieConsentContext';
import { Button } from '../ui/Button';
import { Cookie, Settings, X } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const { showBanner, acceptAll, rejectAll, openPreferences, setShowBanner } = useCookieConsent();

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-6xl mx-auto">
            <div className="relative bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
              {/* Close button */}
              <button
                onClick={() => setShowBanner(false)}
                className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                {/* Icon and Text */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-xl bg-sky-500/20 text-sky-400 shrink-0">
                    <Cookie className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      We Value Your Privacy
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                      We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
                      By clicking "Accept All", you consent to our use of cookies.{' '}
                      <Link
                        to="/cookies"
                        className="text-sky-400 hover:text-sky-300 underline"
                        onClick={() => setShowBanner(false)}
                      >
                        Learn more
                      </Link>
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                  <button
                    onClick={rejectAll}
                    className="px-5 py-2.5 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={openPreferences}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-white/10 hover:bg-white/15 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Customize
                  </button>
                  <Button onClick={acceptAll} size="sm">
                    Accept All
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
