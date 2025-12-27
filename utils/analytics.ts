// Google Analytics 4 utility functions
// Only initializes after user consent

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

let isInitialized = false;

/**
 * Initialize Google Analytics (only call after consent)
 */
export function initializeAnalytics(): void {
  if (isInitialized || !GA_MEASUREMENT_ID) {
    return;
  }

  // Check for Do Not Track
  if (navigator.doNotTrack === '1') {
    console.log('Analytics disabled: Do Not Track is enabled');
    return;
  }

  try {
    // Load gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure',
    });

    isInitialized = true;
    console.log('Google Analytics initialized');
  } catch (error) {
    console.error('Failed to initialize Google Analytics:', error);
  }
}

/**
 * Disable analytics and remove cookies
 */
export function disableAnalytics(): void {
  if (!GA_MEASUREMENT_ID) return;

  // Disable GA
  window.gtag?.('config', GA_MEASUREMENT_ID, {
    'send_page_view': false
  });

  // Set opt-out
  (window as any)[`ga-disable-${GA_MEASUREMENT_ID}`] = true;

  // Remove GA cookies
  const gaCookies = ['_ga', '_gid', '_gat', `_ga_${GA_MEASUREMENT_ID.replace('G-', '')}`];
  gaCookies.forEach(cookie => {
    document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
    document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });

  isInitialized = false;
}

/**
 * Track a page view
 */
export function trackPageView(path: string, title?: string): void {
  if (!isInitialized || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
  });
}

/**
 * Track a custom event
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, any>
): void {
  if (!isInitialized || !window.gtag) return;

  window.gtag('event', eventName, params);
}

/**
 * Track demo interaction
 */
export function trackDemoStart(demoType: string, demoName: string): void {
  trackEvent('demo_start', {
    demo_type: demoType,
    demo_name: demoName,
  });
}

/**
 * Track demo interaction
 */
export function trackDemoInteraction(demoType: string, interactionType: string): void {
  trackEvent('demo_interaction', {
    demo_type: demoType,
    interaction_type: interactionType,
  });
}

/**
 * Track form submission
 */
export function trackFormSubmit(formType: string): void {
  trackEvent('form_submit', {
    form_type: formType,
  });
}

/**
 * Track CTA click
 */
export function trackCTAClick(buttonLocation: string, buttonText: string): void {
  trackEvent('cta_click', {
    button_location: buttonLocation,
    button_text: buttonText,
  });
}

/**
 * Track signup
 */
export function trackSignup(method: 'email' | 'google' | 'apple'): void {
  trackEvent('sign_up', {
    method: method,
  });
}

/**
 * Track login
 */
export function trackLogin(method: 'email' | 'google' | 'apple'): void {
  trackEvent('login', {
    method: method,
  });
}

/**
 * Custom hook for analytics - use in components
 */
export const useAnalytics = () => {
  return {
    trackPageView,
    trackEvent,
    trackDemoStart,
    trackDemoInteraction,
    trackFormSubmit,
    trackCTAClick,
    trackSignup,
    trackLogin,
  };
};
