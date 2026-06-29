export const LAUNCH_SERVICE_AREAS = [
  'Flourtown',
  'Wyndmoor',
  'Erdenheim',
  'Chestnut Hill',
  'Lafayette Hill',
  'Blue Bell',
  'Conshohocken',
  'Plymouth Meeting',
  'Ambler',
  'Glenside',
  'Oreland',
  'Fort Washington',
  'Willow Grove',
];

export const normalizeAddressText = (value = '') => (
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
);

export const detectServiceArea = (address = '') => {
  const normalized = normalizeAddressText(address);
  const matchedTown = LAUNCH_SERVICE_AREAS.find(town => normalized.includes(normalizeAddressText(town)));

  if (matchedTown) {
    return {
      status: 'inside_area',
      matchedTown,
      requiresManualReview: false,
    };
  }

  if (!normalized) {
    return {
      status: 'manual_review',
      matchedTown: null,
      requiresManualReview: true,
    };
  }

  return {
    status: 'outside_area',
    matchedTown: null,
    requiresManualReview: true,
  };
};

export const shouldAllowPublicBookingForAddress = (address = '') => {
  const result = detectServiceArea(address);
  return result.status === 'inside_area';
};

export const getOutsideAreaMessage = () => (
  'This address may be outside the current Clean Slate Club launch area. Please request a consult or join the waitlist so I can review it manually.'
);
