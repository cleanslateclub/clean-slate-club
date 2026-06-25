import { TRAVEL_BUFFER } from '@/lib/bookingConfig';
import { timeToMinutes } from '@/lib/bookingRulesEngine';

const minutesToTime = (totalMinutes = 0) => {
  const normalized = ((Number(totalMinutes) || 0) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

export const TIME_BLOCK_TYPES = {
  booking: 'booking',
  travel: 'travel',
  prep: 'prep',
  wrap: 'wrap',
  manualBlock: 'manual_block',
  unavailable: 'provider_unavailable',
  adminHold: 'admin_hold',
  consult: 'consult',
  holiday: 'holiday_blackout',
  waitlistHold: 'waitlist_hold',
};

export const BLOCK_STATUSES = {
  active: 'active',
  tentative: 'tentative',
  held: 'held',
  cancelled: 'cancelled',
  completed: 'completed',
};

export const buildBookingBlocks = ({ bookingId, date, startTime, durationMinutes, label = 'Visit', travelMinutes = TRAVEL_BUFFER } = {}) => {
  if (!date || !startTime || !durationMinutes) return [];
  const endTime = minutesToTime(timeToMinutes(startTime) + Number(durationMinutes));
  const travelEnd = minutesToTime(timeToMinutes(endTime) + Number(travelMinutes || 0));

  return [
    {
      date,
      start_time: startTime,
      end_time: endTime,
      booking_id: bookingId,
      block_type: TIME_BLOCK_TYPES.booking,
      status: BLOCK_STATUSES.active,
      label,
    },
    {
      date,
      start_time: endTime,
      end_time: travelEnd,
      booking_id: bookingId,
      block_type: TIME_BLOCK_TYPES.travel,
      status: BLOCK_STATUSES.active,
      label: 'Travel buffer',
      travel_minutes: Number(travelMinutes || 0),
    },
  ];
};

export const buildConsultBlock = ({ bookingId, date, startTime, label = 'Consult' } = {}) => {
  if (!date || !startTime) return null;
  return {
    date,
    start_time: startTime,
    end_time: minutesToTime(timeToMinutes(startTime) + 15),
    booking_id: bookingId,
    block_type: TIME_BLOCK_TYPES.consult,
    status: BLOCK_STATUSES.active,
    label,
  };
};

export const blocksOverlap = (a = {}, b = {}) => {
  if (!a.date || !b.date || a.date !== b.date) return false;
  const aStart = timeToMinutes(a.start_time);
  const aEnd = timeToMinutes(a.end_time);
  const bStart = timeToMinutes(b.start_time);
  const bEnd = timeToMinutes(b.end_time);
  return aStart < bEnd && bStart < aEnd;
};

export const findScheduleConflicts = (candidateBlocks = [], existingBlocks = []) => {
  return candidateBlocks.flatMap(candidate => (
    existingBlocks
      .filter(existing => existing.status !== BLOCK_STATUSES.cancelled && blocksOverlap(candidate, existing))
      .map(existing => ({ candidate, existing }))
  ));
};
