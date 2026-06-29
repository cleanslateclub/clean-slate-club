import { buildBookingBlocks, findScheduleConflicts } from '@/lib/scheduleBlocks';

export const buildSchedulePreview = ({ booking = {}, existingBlocks = [] } = {}) => {
  const candidateBlocks = buildBookingBlocks({
    bookingId: booking.id,
    date: booking.scheduled_date,
    startTime: booking.scheduled_start_time,
    durationMinutes: booking.total_duration_minutes,
    label: `${booking.service_label || booking.service_category || 'Visit'} - ${booking.client_name || 'Guest'}`,
    travelMinutes: booking.travel_buffer_minutes,
  });

  return {
    candidateBlocks,
    conflicts: findScheduleConflicts(candidateBlocks, existingBlocks),
  };
};

export const buildRescheduleFields = ({ booking = {}, date, startTime, endTime, actorName = 'Admin' } = {}) => ({
  status: 'rescheduled',
  original_scheduled_date: booking.original_scheduled_date || booking.scheduled_date,
  original_scheduled_start_time: booking.original_scheduled_start_time || booking.scheduled_start_time,
  scheduled_date: date || booking.scheduled_date,
  scheduled_start_time: startTime || booking.scheduled_start_time,
  scheduled_end_time: endTime || booking.scheduled_end_time,
  reschedule_count: Number(booking.reschedule_count || 0) + 1,
  last_schedule_change_by: actorName,
  last_schedule_change_at: new Date().toISOString(),
});
