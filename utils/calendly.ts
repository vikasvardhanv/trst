// Scheduling utility
// This provides a consistent way to trigger scheduling across the app
// Note: The actual modal rendering is handled by SchedulingModal component

import { scheduleAppointment, SchedulingRequest, SchedulingResponse } from '../services/schedulingService';

// Re-export types for convenience
export type { SchedulingRequest, SchedulingResponse };

// Event for opening scheduling modal
// Components can listen to this event to open the modal
const SCHEDULING_EVENT = 'openSchedulingModal';

interface SchedulingOptions {
  email?: string;
  name?: string;
  source?: string;
}

// Event payload type
interface SchedulingEventDetail extends SchedulingOptions {}

/**
 * Dispatches an event to open the scheduling modal
 * Components with SchedulingModal can listen for this event
 * @param options - Optional prefill data (email, name, source)
 */
export const openScheduling = (options?: SchedulingOptions) => {
  if (typeof window === 'undefined') return;

  const event = new CustomEvent<SchedulingEventDetail>(SCHEDULING_EVENT, {
    detail: {
      email: options?.email || '',
      name: options?.name || '',
      source: options?.source || 'website',
    },
  });

  window.dispatchEvent(event);
};

/**
 * Opens scheduling with email prompt
 * Prompts user for email before triggering scheduling modal
 */
export const openSchedulingWithEmail = (source?: string) => {
  if (typeof window === 'undefined') return;

  const email = window.prompt(
    'Enter your email to receive booking confirmation:',
    ''
  );

  if (email && email.includes('@')) {
    const name = window.prompt('Enter your name (optional):', '') || '';
    openScheduling({ email, name, source });
  } else if (email !== null) {
    alert('Please enter a valid email address to receive your booking confirmation.');
    openSchedulingWithEmail(source);
  }
};

/**
 * Simple scheduling open without prefill
 */
export const openSchedulingSimple = () => {
  openScheduling();
};

/**
 * Hook for listening to scheduling modal open events
 * @param callback - Function to call when scheduling should open
 * @returns Cleanup function
 */
export const onSchedulingOpen = (callback: (options: SchedulingOptions) => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<SchedulingEventDetail>;
    callback(customEvent.detail);
  };

  window.addEventListener(SCHEDULING_EVENT, handler);

  return () => {
    window.removeEventListener(SCHEDULING_EVENT, handler);
  };
};

// Export the direct scheduling function for programmatic use
export { scheduleAppointment };

// Legacy exports for backward compatibility (if needed elsewhere)
// These now use the new scheduling system
export const openCalendly = openScheduling;
export const openCalendlySimple = openSchedulingSimple;
export const openCalendlyWithEmail = openSchedulingWithEmail;

// Legacy constant - no longer used but kept for compatibility
export const CALENDLY_URL = 'https://calendly.com/d/cxff-b85-5pd/schedule-ai-consultation';
