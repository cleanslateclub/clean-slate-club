import { BOOKING_RULES_DEFAULTS } from '@/lib/backendOSConfig';

const DAY_MS = 24 * 60 * 60 * 1000;

export const BLACKOUT_HOLIDAY_KEYS = ['jan_1', 'thanksgiving', 'dec_25'];
export const PREMIUM_HOLIDAY_KEYS = ['easter_weekend', 'memorial_day_weekend', 'july_4', 'labor_day', 'dec_24', 'dec_31'];

export const parseBookingDateTime = (date, time = '00:00') => {
  if (!date) return null;
  return new Date(`${date}T${time || '00:00'}:00`);
};

export const getLeadTimeHours = ({ date, time, now = new Date() } = {}) => {
  const target = parseBookingDateTime(date, time);
  if (!target) return 0;
  return (target.getTime() - now.getTime()) / (60 * 60 * 1000);
};

export const isSunday = (date) => {
  const target = parseBookingDateTime(date);
  return target ? target.getDay() === 0 : false;
};

export const timeToMinutes = (time = '00:00') => {
  const [hours, minutes] = String(time).split(':').map(Number);
  return (Number(hours) || 0) * 60 + (Number(minutes) || 0);
};

export const isInsidePublicHours = ({ startTime, endTime, rules = BOOKING_RULES_DEFAULTS } = {}) => {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime || startTime);
  const publicStart = timeToMinutes(rules.publicHours?.start || '10:00');
  const publicEnd = timeToMinutes(rules.publicHours?.end || '18:00');
  return start >= publicStart && end <= publicEnd;
};

export const isConsultWindow = ({ date, startTime } = {}) => {
  const target = parseBookingDateTime(date);
  if (!target) return false;
  const day = target.getDay();
  const start = timeToMinutes(startTime);
  return day === 1 && start >= timeToMinutes('10:00') && start < timeToMinutes('12:00');
};

export const isFixedBlackoutHoliday = (date) => {
  const target = parseBookingDateTime(date);
  if (!target) return false;
  const month = target.getMonth() + 1;
  const day = target.getDate();
  return (month === 1 && day === 1) || (month === 12 && day === 25);
};

export const isFixedPremiumHoliday = (date) => {
  const target = parseBookingDateTime(date);
  if (!target) return false;
  const month = target.getMonth() + 1;
  const day = target.getDate();
  return (month === 7 && day === 4) || (month === 12 && [24, 31].includes(day));
};

export const validateBookingRequest = ({
  date,
  startTime,
  endTime,
  serviceKey,
  durationMinutes = 0,
  packageCount = 1,
  rules = BOOKING_RULES_DEFAULTS,
  now = new Date(),
} = {}) => {
  const errors = [];
  const warnings = [];

  if (!date) errors.push('A booking date is required.');
  if (!startTime) errors.push('A start time is required.');

  if (date && startTime) {
    const leadHours = getLeadTimeHours({ date, time: startTime, now });
    if (leadHours < Number(rules.minimumLeadTimeHours || 0)) {
      errors.push(`Bookings require at least ${rules.minimumLeadTimeHours} hours notice.`);
    }
  }

  if (rules.noClientFacingSundays && isSunday(date)) {
    errors.push('Public Sunday bookings are not available.');
  }

  if (serviceKey === 'consult') {
    if (!isConsultWindow({ date, startTime })) {
      errors.push('Consults are limited to Mondays between 10:00am and 12:00pm.');
    }
  } else if (!isInsidePublicHours({ startTime, endTime, rules })) {
    errors.push('Bookings must stay inside public hours.');
  }

  if (durationMinutes && durationMinutes < Number(rules.minimumVisitMinutes || 0) && serviceKey !== 'consult') {
    errors.push(`Bookings must be at least ${Math.round(rules.minimumVisitMinutes / 60)} hours.`);
  }

  if (durationMinutes && durationMinutes > Number(rules.maximumVisitMinutes || Infinity)) {
    warnings.push('This visit is longer than the standard maximum and should be reviewed manually.');
  }

  if (rules.onePackagePerVisit && packageCount > 1) {
    errors.push('Only one package can be booked per visit.');
  }

  if (isFixedBlackoutHoliday(date)) {
    errors.push('This date is a blackout holiday.');
  }

  if (isFixedPremiumHoliday(date)) {
    warnings.push('This date may require premium holiday handling.');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

export const shouldSuggestTwoProviders = ({ addonCount = 0, rules = BOOKING_RULES_DEFAULTS } = {}) => {
  return Number(addonCount) > Number(rules.suggestTwoProvidersAfterAddonCount || 4);
};

export const getCancellationPolicyOutcome = ({ booking = {}, cancelledAt = new Date(), rules = BOOKING_RULES_DEFAULTS } = {}) => {
  const scheduled = parseBookingDateTime(booking.scheduled_date, booking.scheduled_start_time);
  if (!scheduled) return { insideWindow: false, retainDeposit: true, refundDeposit: false };

  const hoursBefore = (scheduled.getTime() - cancelledAt.getTime()) / (60 * 60 * 1000);
  const insideWindow = hoursBefore >= Number(rules.cancellationWindowHours || 48);

  return {
    hoursBefore,
    insideWindow,
    retainDeposit: !insideWindow && Boolean(rules.retainDepositOnLateCancellation),
    refundDeposit: insideWindow && Boolean(rules.autoRefundOnTimeCancellation),
  };
};
