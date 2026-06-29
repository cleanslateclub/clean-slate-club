const normalize = (value = '') => String(value || '').trim().toLowerCase();
const inactiveStatuses = ['cancelled', 'archived', 'no_show'];

export const sumBy = (items = [], mapper = () => 0) => items.reduce((sum, item) => sum + (Number(mapper(item)) || 0), 0);

export const groupBy = (items = [], keyGetter = () => 'unknown') => items.reduce((acc, item) => {
  const key = keyGetter(item) || 'unknown';
  acc[key] = acc[key] || [];
  acc[key].push(item);
  return acc;
}, {});

export const getBookingOperationsSummary = (bookings = []) => {
  const total = bookings.length;
  const completed = bookings.filter(item => normalize(item.status) === 'completed').length;
  const cancelled = bookings.filter(item => normalize(item.status) === 'cancelled').length;
  const noShows = bookings.filter(item => normalize(item.status) === 'no_show').length;
  const pending = bookings.filter(item => ['pending', 'needs_review', 'approved'].includes(normalize(item.status))).length;
  const unassigned = bookings.filter(item => !item.provider_email && !inactiveStatuses.includes(normalize(item.status))).length;
  const needsReview = bookings.filter(item => item.requires_admin_approval || normalize(item.approval_status) === 'pending' || normalize(item.status) === 'needs_review').length;

  return {
    total,
    completed,
    cancelled,
    noShows,
    pending,
    unassigned,
    needsReview,
    cancellationRate: total ? cancelled / total : 0,
    noShowRate: total ? noShows / total : 0,
  };
};

export const getServiceOperationsSummary = (bookings = []) => {
  const grouped = groupBy(bookings, item => item.service_label || item.service_category);
  return Object.entries(grouped)
    .map(([service, items]) => ({
      service,
      count: items.length,
      completed: items.filter(item => normalize(item.status) === 'completed').length,
      cancelled: items.filter(item => normalize(item.status) === 'cancelled').length,
      needsReview: items.filter(item => normalize(item.status) === 'needs_review').length,
    }))
    .sort((a, b) => b.count - a.count);
};

export const getProviderOperationsSummary = (bookings = []) => {
  const assigned = bookings.filter(item => item.provider_email);
  const grouped = groupBy(assigned, item => normalize(item.provider_email));
  return Object.entries(grouped).map(([providerEmail, items]) => ({
    providerEmail,
    providerName: items[0]?.provider_name || providerEmail,
    assignedCount: items.length,
    completed: items.filter(item => normalize(item.status) === 'completed').length,
    cancelled: items.filter(item => normalize(item.status) === 'cancelled').length,
    noShows: items.filter(item => normalize(item.status) === 'no_show').length,
  })).sort((a, b) => b.assignedCount - a.assignedCount);
};

export const getMembershipOperationsSummary = (households = []) => ({
  totalHouseholds: households.length,
  activeMembers: households.filter(item => normalize(item.membership_status) === 'active').length,
  pastDueMembers: households.filter(item => normalize(item.membership_status) === 'past_due').length,
  cancelledMembers: households.filter(item => normalize(item.membership_status) === 'cancelled').length,
});
