// Scheduling Service - Integrates with Modal scheduling endpoint
// Replaces Calendly with custom scheduling system
// All times are in CST (America/Chicago timezone)

const SCHEDULING_ENDPOINT = 'https://vikasvardhanv--scheduling-messaging-agent-schedule-appointment.modal.run';
const AVAILABILITY_ENDPOINT = 'https://vikasvardhanv--scheduling-messaging-agent-check-availability.modal.run';
const HEALTH_CHECK_ENDPOINT = 'https://vikasvardhanv--scheduling-messaging-agent-health.modal.run';

export interface SchedulingRequest {
  name: string;
  email: string;
  phone?: string;
  date: string; // Format: YYYY-MM-DD
  time: string; // Format: HH:MM (24-hour)
  service?: string;
  duration?: number; // Minutes, default 60
  send_email?: boolean;
  send_sms?: boolean;
}

export interface SchedulingResponse {
  success: boolean;
  message: string;
  appointment_id?: string;
  zoom_link?: string;
  zoom_meeting_id?: string;
  calendar_event_id?: string;
  error?: string;
}

export interface AvailabilityRequest {
  start_date: string; // Format: YYYY-MM-DD
  end_date: string; // Format: YYYY-MM-DD
  duration_minutes?: number; // Default 60
  business_hours_only?: boolean; // 9 AM - 6 PM CST
}

export interface AvailableSlot {
  datetime: string;
  formatted: string;
  date: string;
  time: string;
}

export interface AvailabilityResponse {
  success: boolean;
  available_slots: AvailableSlot[];
  total_available: number;
  duration_minutes: number;
  timezone: string;
  error?: string;
}

/**
 * Schedule an appointment via the Modal scheduling endpoint
 * Creates calendar event, Zoom meeting, and sends confirmation email/SMS
 */
export async function scheduleAppointment(request: SchedulingRequest): Promise<SchedulingResponse> {
  try {
    const payload = {
      name: request.name,
      email: request.email,
      phone: request.phone || '',
      date: request.date,
      time: request.time,
      service: request.service || 'AI Consultation',
      duration: request.duration || 60,
      send_email: request.send_email ?? true,
      send_sms: request.send_sms ?? (!!request.phone),
    };

    const response = await fetch(SCHEDULING_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Scheduling failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    return {
      success: true,
      message: data.message || 'Appointment scheduled successfully!',
      appointment_id: data.appointment_id,
      zoom_link: data.zoom_link,
      zoom_meeting_id: data.zoom_meeting_id,
      calendar_event_id: data.calendar_event_id,
    };
  } catch (error: any) {
    console.error('Scheduling error:', error);
    return {
      success: false,
      message: 'Failed to schedule appointment',
      error: error.message || 'Unknown error occurred',
    };
  }
}

/**
 * Check if the scheduling service is healthy
 */
export async function checkSchedulingHealth(): Promise<boolean> {
  try {
    const response = await fetch(HEALTH_CHECK_ENDPOINT, {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Check availability for a date range from Google Calendar
 * Returns available slots filtered by business hours (9 AM - 6 PM CST)
 */
export async function checkAvailability(request: AvailabilityRequest): Promise<AvailabilityResponse> {
  try {
    const payload = {
      start_date: request.start_date,
      end_date: request.end_date,
      duration_minutes: request.duration_minutes || 60,
      business_hours_only: request.business_hours_only ?? true,
    };

    const response = await fetch(AVAILABILITY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Availability check failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    return {
      success: true,
      available_slots: data.available_slots || [],
      total_available: data.total_available || 0,
      duration_minutes: data.duration_minutes || 60,
      timezone: data.timezone || 'America/Chicago (CST)',
    };
  } catch (error: any) {
    console.error('Availability check error:', error);
    return {
      success: false,
      available_slots: [],
      total_available: 0,
      duration_minutes: 60,
      timezone: 'America/Chicago (CST)',
      error: error.message || 'Failed to check availability',
    };
  }
}

/**
 * Get available time slots for a given date from Google Calendar
 * Calls the real availability endpoint and filters by the requested date
 * All times are in CST (America/Chicago timezone)
 */
export async function getAvailableSlots(date: string): Promise<string[]> {
  try {
    // Check availability for the single date
    const response = await checkAvailability({
      start_date: date,
      end_date: date,
      duration_minutes: 30, // 30-minute consultation slots
      business_hours_only: true,
    });

    if (response.success && response.available_slots.length > 0) {
      // Extract just the time strings from the available slots
      return response.available_slots
        .filter(slot => slot.date === date)
        .map(slot => slot.time);
    }

    // Fallback to default slots if API fails or returns empty
    console.warn('Using fallback time slots - availability API returned no slots');
    return getDefaultTimeSlots();
  } catch (error) {
    console.error('Error fetching available slots:', error);
    // Fallback to default slots on error
    return getDefaultTimeSlots();
  }
}

/**
 * Get default time slots as fallback (9 AM to 6 PM CST)
 * Used when the availability API is unavailable
 */
function getDefaultTimeSlots(): string[] {
  const slots: string[] = [];
  for (let hour = 9; hour <= 17; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return slots;
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Format time for display (12-hour format)
 */
export function formatTime12Hour(time24: string): string {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Get minimum date for scheduling (tomorrow)
 */
export function getMinDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDate(tomorrow);
}

/**
 * Get maximum date for scheduling (30 days from now)
 */
export function getMaxDate(): string {
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  return formatDate(maxDate);
}
