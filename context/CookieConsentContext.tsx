import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  CookieConsent,
  CookieCategory,
  getConsentStatus,
  saveConsentStatus,
  hasUserResponded,
  acceptAllCookies,
  rejectAllCookies,
  hasConsent,
  deleteNonEssentialCookies,
  defaultConsent,
} from '../utils/cookies';
import { initializeAnalytics, disableAnalytics } from '../utils/analytics';

interface CookieConsentContextType {
  consent: CookieConsent;
  showBanner: boolean;
  showPreferences: boolean;
  setShowBanner: (show: boolean) => void;
  setShowPreferences: (show: boolean) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (preferences: Partial<CookieConsent>) => void;
  hasConsent: (category: CookieCategory) => boolean;
  openPreferences: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export const CookieConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [consent, setConsent] = useState<CookieConsent>(defaultConsent);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  // Initialize consent state on mount
  useEffect(() => {
    const storedConsent = getConsentStatus();
    setConsent(storedConsent);

    // Show banner if user hasn't responded yet
    if (!hasUserResponded()) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // User has already consented, initialize services accordingly
      if (storedConsent.analytics) {
        initializeAnalytics();
      }
    }
  }, []);

  const acceptAll = useCallback(() => {
    const newConsent = acceptAllCookies();
    setConsent(newConsent);
    setShowBanner(false);
    setShowPreferences(false);
    initializeAnalytics();
  }, []);

  const rejectAll = useCallback(() => {
    const newConsent = rejectAllCookies();
    setConsent(newConsent);
    setShowBanner(false);
    setShowPreferences(false);
    disableAnalytics();
  }, []);

  const savePreferences = useCallback((preferences: Partial<CookieConsent>) => {
    const newConsent = saveConsentStatus(preferences);
    setConsent(newConsent);
    setShowBanner(false);
    setShowPreferences(false);

    // Handle analytics based on new preferences
    if (newConsent.analytics) {
      initializeAnalytics();
    } else {
      disableAnalytics();
      deleteNonEssentialCookies();
    }
  }, []);

  const checkConsent = useCallback((category: CookieCategory) => {
    return hasConsent(category);
  }, []);

  const openPreferences = useCallback(() => {
    setShowBanner(false);
    setShowPreferences(true);
  }, []);

  const value: CookieConsentContextType = {
    consent,
    showBanner,
    showPreferences,
    setShowBanner,
    setShowPreferences,
    acceptAll,
    rejectAll,
    savePreferences,
    hasConsent: checkConsent,
    openPreferences,
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = (): CookieConsentContextType => {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
};
