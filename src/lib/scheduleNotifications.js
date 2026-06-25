import { base44 } from '@/api/base44Client';
import { SCHEDULE_NOTIFICATION_RULES } from '@/lib/backendOSConfig';

const compactBookingSummary = (booking = {}) => ({
  id: booking.id,
  client_name: booking.client_name,
  client_email: booking.client_email,
  client_phone: booking.client_phone,
  client_address: booking.client_address,
  service_category: booking.service_category,
  scheduled_date: booking.scheduled_date,
  scheduled_start_time: booking.scheduled_start_time,
  scheduled_end_time: booking.scheduled_end_time,
  provider_email: booking.provider_email,
  provider_name: booking.provider_name,
  status: booking.status,
});

const compactTimeBlockSummary = (timeBlock = {}) => ({
  id: timeBlock.id,
  booking_id: timeBlock.booking_id,
  date: timeBlock.date,
  start_time: timeBlock.start_time,
  end_time: timeBlock.end_time,
  block_type: timeBlock.block_type,
  label: timeBlock.label,
  provider_email: timeBlock.provider_email,
});

export const buildScheduleChangePayload = ({
  eventType,
  source = 'admin',
  actor = 'Clean Slate Admin',
  booking = null,
  timeBlock = null,
  updates = {},
  note = '',
} = {}) => ({
  eventType,
  source,
  actor,
  note,
  updates,
  booking: booking ? compactBookingSummary(booking) : null,
  timeBlock: timeBlock ? compactTimeBlockSummary(timeBlock) : null,
  rules: SCHEDULE_NOTIFICATION_RULES,
  occurredAt: new Date().toISOString(),
});

export const notifyScheduleChange = async (payload) => {
  const normalizedPayload = buildScheduleChangePayload(payload);

  // Preferred new backend function. It should notify admin for every schedule change,
  // and notify providers by email/SMS when their assigned schedule changes.
  try {
    await base44.functions.invoke('notifyScheduleChange', { data: normalizedPayload });
    return { success: true, method: 'notifyScheduleChange' };
  } catch (primaryError) {
    console.warn('notifyScheduleChange function unavailable or failed:', primaryError);
  }

  // Backward-compatible fallback so schedule changes still ping the team while
  // the full backend function is being built out.
  try {
    if (normalizedPayload.booking?.id) {
      await base44.functions.invoke('notifyTeamNewBooking', {
        data: {
          bookingId: normalizedPayload.booking.id,
          eventType: normalizedPayload.eventType,
          source: normalizedPayload.source,
          note: normalizedPayload.note,
        },
      });
      return { success: true, method: 'notifyTeamNewBooking' };
    }
  } catch (fallbackError) {
    console.warn('Schedule change fallback notification failed:', fallbackError);
  }

  return { success: false };
};
