import { TRAVEL_BUFFER } from '@/lib/bookingConfig';
import { timeToMinutes } from '@/lib/bookingRulesEngine';

const minutesToTime = (totalMinutes = 0) => {
  const normalized = ((Number(totalMinutes) || 0) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const toSafeMinutes = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toSafeTravelMinutes = (value = TRAVEL_BUFFER) => (
  Math.max(0, Math.min(120, Math.round(toSafeMinutes(value, TRAVEL_BUFFER))))
);

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
  const startMinutes = timeToMinutes(startTime);
  const duration = toSafeMinutes(durationMinutes, 0);

  if (!date || !startTime || !Number.isFinite(startMinutes) || duration <= 0) return [];

  const endTime = minutesToTime(startMinutes + duration);
  const blocks = [
    {
      date,
      start_time: startTime,
      end_time: endTime,
      booking_id: bookingId,
      block_type: TIME_BLOCK_TYPES.booking,
      status: BLOCK_STATUSES.active,
      label,
    },
  ];

  const travel = toSafeTravelMinutes(travelMinutes);
  if (travel > 0) {
    blocks.push({
      date,
      start_time: endTime,
      end_time: minutesToTime(timeToMinutes(endTime) + travel),
      booking_id: bookingId,
      block_type: TIME_BLOCK_TYPES.travel,
      status: BLOCK_STATUSES.active,
      label: 'Travel buffer',
      travel_minutes: travel,
    });
  }

  return blocks;
};

export const buildConsultBlock = ({ bookingId, date, startTime, label = 'Consult' } = {}) => {
  const startMinutes = timeToMinutes(startTime);
  if (!date || !startTime || !Number.isFinite(startMinutes)) return null;
  return {
    date,
    start_time: startTime,
    end_time: minutesToTime(startMinutes + 15),
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
  if (![aStart, aEnd, bStart, bEnd].every(Number.isFinite)) return false;
  return aStart < bEnd && bStart < aEnd;
};

export const findScheduleConflicts = (candidateBlocks = [], existingBlocks = []) => {
  return candidateBlocks.flatMap(candidate => (
    existingBlocks
      .filter(existing => existing.status !== BLOCK_STATUSES.cancelled && blocksOverlap(candidate, existing))
      .map(existing => ({ candidate, existing }))
  ));
};
