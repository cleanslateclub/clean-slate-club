import { detectServiceArea } from '@/lib/serviceAreaRules';

const normalize = (value = '') => String(value || '').trim().toLowerCase();
const safeDateMs = (value) => {
  const parsed = new Date(value || 0).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
};

export const WAITLIST_STATUSES = {
  active: 'active',
  offered: 'offered',
  booked: 'booked',
  expired: 'expired',
  cancelled: 'cancelled',
  archived: 'archived',
};

export const WAITLIST_MODES = {
  manualPick: 'manual_pick',
  firstInLine: 'first_in_line',
  priorityMembers: 'priority_members',
  instantOffer: 'instant_offer',
};

export const buildWaitlistRequest = ({
  guestName = '',
  guestEmail = '',
  guestPhone = '',
  householdProfileId = '',
  serviceCategory = '',
  serviceLabel = '',
  preferredDates = [],
  preferredTimeWindows = [],
  memberAtRequest = false,
  serviceAddress = '',
  adminNotes = '',
} = {}) => {
  const serviceArea = detectServiceArea(serviceAddress);
  const serviceAreaStatus = normalize(serviceArea.status) || 'manual_review';
  return {
    status: WAITLIST_STATUSES.active,
    guest_name: guestName,
    guest_email: guestEmail,
    guest_phone: guestPhone,
    household_profile_id: householdProfileId,
    service_category: serviceCategory,
    service_label: serviceLabel,
    preferred_dates: preferredDates,
    preferred_time_windows: preferredTimeWindows,
    member_at_request: memberAtRequest,
    service_address: serviceAddress,
    service_area_status: serviceAreaStatus,
    priority_score: calculateWaitlistPriority({ memberAtRequest, serviceAreaStatus }),
    admin_notes: adminNotes,
  };
};

export const calculateWaitlistPriority = ({ memberAtRequest = false, serviceAreaStatus = 'inside_area', createdAt } = {}) => {
  const normalizedServiceAreaStatus = normalize(serviceAreaStatus);
  let score = 0;
  if (memberAtRequest) score += 50;
  if (normalizedServiceAreaStatus === 'inside_area') score += 25;
  if (normalizedServiceAreaStatus === 'manual_review') score += 5;

  if (createdAt) {
    const createdMs = safeDateMs(createdAt);
    const ageHours = Math.max(0, (Date.now() - createdMs) / (60 * 60 * 1000));
    score += Math.min(25, Math.floor(ageHours / 24));
  }

  return score;
};

export const rankWaitlistRequests = (requests = [], mode = WAITLIST_MODES.manualPick) => {
  const active = requests.filter(item => normalize(item.status) === WAITLIST_STATUSES.active);

  if (mode === WAITLIST_MODES.firstInLine) {
    return [...active].sort((a, b) => safeDateMs(a.created_date || a.created_at) - safeDateMs(b.created_date || b.created_at));
  }

  if (mode === WAITLIST_MODES.priorityMembers) {
    return [...active].sort((a, b) => {
      const scoreA = calculateWaitlistPriority({ memberAtRequest: a.member_at_request, serviceAreaStatus: a.service_area_status, createdAt: a.created_date || a.created_at });
      const scoreB = calculateWaitlistPriority({ memberAtRequest: b.member_at_request, serviceAreaStatus: b.service_area_status, createdAt: b.created_date || b.created_at });
      return scoreB - scoreA;
    });
  }

  return active;
};

export const applyWaitlistOffer = ({ request = {}, bookingId = '', offerMinutes = 120 } = {}) => {
  const minutes = Math.max(15, Number(offerMinutes) || 120);
  return {
    status: WAITLIST_STATUSES.offered,
    offered_booking_id: bookingId,
    offered_at: new Date().toISOString(),
    offer_expires_at: new Date(Date.now() + minutes * 60 * 1000).toISOString(),
  };
};
