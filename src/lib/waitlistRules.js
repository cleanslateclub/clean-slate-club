import { detectServiceArea } from '@/lib/serviceAreaRules';

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
    service_area_status: serviceArea.status,
    priority_score: calculateWaitlistPriority({ memberAtRequest, serviceAreaStatus: serviceArea.status }),
    admin_notes: adminNotes,
  };
};

export const calculateWaitlistPriority = ({ memberAtRequest = false, serviceAreaStatus = 'inside_area', createdAt } = {}) => {
  let score = 0;
  if (memberAtRequest) score += 50;
  if (serviceAreaStatus === 'inside_area') score += 25;
  if (serviceAreaStatus === 'manual_review') score += 5;

  if (createdAt) {
    const ageHours = Math.max(0, (Date.now() - new Date(createdAt).getTime()) / (60 * 60 * 1000));
    score += Math.min(25, Math.floor(ageHours / 24));
  }

  return score;
};

export const rankWaitlistRequests = (requests = [], mode = WAITLIST_MODES.manualPick) => {
  const active = requests.filter(item => item.status === WAITLIST_STATUSES.active);

  if (mode === WAITLIST_MODES.firstInLine) {
    return [...active].sort((a, b) => new Date(a.created_date || a.created_at || 0) - new Date(b.created_date || b.created_at || 0));
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

export const applyWaitlistOffer = ({ request = {}, bookingId = '', offerMinutes = 120 } = {}) => ({
  ...request,
  status: WAITLIST_STATUSES.offered,
  offered_booking_id: bookingId,
  offered_at: new Date().toISOString(),
  offer_expires_at: new Date(Date.now() + offerMinutes * 60 * 1000).toISOString(),
});
