export const MEMBERSHIP_STATUS = {
  none: 'none',
  active: 'active',
  pastDue: 'past_due',
  cancelled: 'cancelled',
  paused: 'paused',
};

export const MEMBERSHIP_PRICE = 49;
export const MEMBER_HOURLY_RATE = 60;
export const NON_MEMBER_HOURLY_RATE = 75;
export const MEMBER_FREE_RESCHEDULES = 3;

export const isActiveMember = (profile = {}) => profile.membership_status === MEMBERSHIP_STATUS.active;

export const getHourlyRateForHousehold = (profile = {}) => isActiveMember(profile) ? MEMBER_HOURLY_RATE : NON_MEMBER_HOURLY_RATE;

export const getMembershipBenefits = () => [
  'Priority booking access',
  'Preferred scheduling windows',
  'Reduced hourly rate',
  'Three late-window reschedule waivers per year',
  'First access to recurring openings',
];

export const getRemainingMemberReschedules = (profile = {}) => {
  const used = Number(profile.member_reschedules_used || 0);
  return Math.max(0, MEMBER_FREE_RESCHEDULES - used);
};

export const canUseMemberRescheduleWaiver = (profile = {}) => isActiveMember(profile) && getRemainingMemberReschedules(profile) > 0;

export const applyMemberRescheduleUse = (profile = {}) => ({
  ...profile,
  member_reschedules_used: Number(profile.member_reschedules_used || 0) + 1,
});

export const buildMembershipSnapshot = (profile = {}) => ({
  status: profile.membership_status || MEMBERSHIP_STATUS.none,
  active: isActiveMember(profile),
  hourlyRate: getHourlyRateForHousehold(profile),
  remainingRescheduleWaivers: getRemainingMemberReschedules(profile),
  stripeCustomerId: profile.stripe_customer_id || '',
});
