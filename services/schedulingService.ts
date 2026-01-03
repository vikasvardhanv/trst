// Scheduling Service - Integrates with Modal scheduling endpoint
// Replaces Calendly with custom scheduling system

const SCHEDULING_ENDPOINT = 'https://vikasvardhanv--scheduling-messaging-agent-schedule-appointment.modal.run';
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
 * Get available time slots for a given date
 * Note: This requires the backend to implement this endpoint
 */
export async function getAvailableSlots(date: string): Promise<string[]> {
  // Default available time slots (9 AM to 5 PM)
  // In the future, this could call an endpoint to get real availability
  const slots: string[] = [];
  for (let hour = 9; hour <= 17; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 17) {
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
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
