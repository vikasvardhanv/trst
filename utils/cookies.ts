// Cookie utility functions for Highshift Media
// Handles cookie operations with consent awareness

export type CookieCategory = 'necessary' | 'analytics' | 'marketing' | 'preferences';

export interface CookieConsent {
  necessary: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  timestamp: number;
  version: string;
}

const CONSENT_KEY = 'highshift_cookie_consent';
const CONSENT_VERSION = '1.0';

// Default consent (only necessary)
export const defaultConsent: CookieConsent = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
  timestamp: 0,
  version: CONSENT_VERSION,
};

/**
 * Set a cookie with optional expiration
 */
export function setCookie(
  name: string,
  value: string,
  days: number = 365,
  category: CookieCategory = 'necessary'
): boolean {
  // Check if we have consent for this category
  const consent = getConsentStatus();
  if (category !== 'necessary' && !consent[category]) {
    console.warn(`Cookie "${name}" not set: no consent for category "${category}"`);
    return false;
  }

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  const cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax;Secure`;
  document.cookie = cookieString;
  return true;
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  const nameEQ = encodeURIComponent(name) + '=';
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  return null;
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name: string): void {
  document.cookie = `${encodeURIComponent(name)}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

/**
 * Delete all non-essential cookies
 */
export function deleteNonEssentialCookies(): void {
  const cookies = document.cookie.split(';');

  // List of essential cookies to keep
  const essentialCookies = ['highshift_auth_token', 'highshift_user', CONSENT_KEY];

  for (const cookie of cookies) {
    const [name] = cookie.split('=');
    const trimmedName = name.trim();

    if (!essentialCookies.includes(trimmedName)) {
      deleteCookie(trimmedName);
    }
  }

  // Also clear analytics-related localStorage items
  const analyticsKeys = ['_ga', '_gid', '_gat'];
  analyticsKeys.forEach(key => {
    localStorage.removeItem(key);
  });
}

/**
 * Get current consent status from localStorage
 */
export function getConsentStatus(): CookieConsent {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored) {
      const consent = JSON.parse(stored) as CookieConsent;
      // Check if consent version matches
      if (consent.version === CONSENT_VERSION) {
        return consent;
      }
    }
  } catch (e) {
    console.error('Error reading cookie consent:', e);
  }
  return defaultConsent;
}

/**
 * Save consent preferences to localStorage
 */
export function saveConsentStatus(consent: Partial<CookieConsent>): CookieConsent {
  const newConsent: CookieConsent = {
    ...defaultConsent,
    ...consent,
    necessary: true, // Always true
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };

  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(newConsent));
  } catch (e) {
    console.error('Error saving cookie consent:', e);
  }

  return newConsent;
}

/**
 * Check if user has given any consent (accepted or rejected)
 */
export function hasUserResponded(): boolean {
  const consent = getConsentStatus();
  return consent.timestamp > 0;
}

/**
 * Check if user has consented to a specific category
 */
export function hasConsent(category: CookieCategory): boolean {
  const consent = getConsentStatus();
  return consent[category] === true;
}

/**
 * Accept all cookies
 */
export function acceptAllCookies(): CookieConsent {
  return saveConsentStatus({
    necessary: true,
    analytics: true,
    marketing: true,
    preferences: true,
  });
}

/**
 * Reject all non-essential cookies
 */
export function rejectAllCookies(): CookieConsent {
  deleteNonEssentialCookies();
  return saveConsentStatus({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });
}

/**
 * Reset consent (for testing or user request)
 */
export function resetConsent(): void {
  localStorage.removeItem(CONSENT_KEY);
  deleteNonEssentialCookies();
}
