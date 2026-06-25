import { getBookingOperationsSummary, getMembershipOperationsSummary, getProviderOperationsSummary, getServiceOperationsSummary } from '@/lib/operationsSummary';

export const COMMAND_ALERT_TYPES = {
  needsReview: 'needs_review',
  unassigned: 'unassigned',
  paymentIssue: 'payment_issue',
  providerWarning: 'provider_warning',
  scheduleToday: 'schedule_today',
  outsideArea: 'outside_area',
};

export const getTodayDateKey = (date = new Date()) => date.toISOString().split('T')[0];

export const getTodayBookings = (bookings = [], dateKey = getTodayDateKey()) => (
  bookings.filter(booking => booking.scheduled_date === dateKey && !['cancelled', 'archived'].includes(booking.status))
);

export const getUpcomingBookings = (bookings = [], dateKey = getTodayDateKey(), limit = 10) => (
  bookings
    .filter(booking => booking.scheduled_date >= dateKey && !['cancelled', 'archived'].includes(booking.status))
    .sort((a, b) => `${a.scheduled_date || ''} ${a.scheduled_start_time || ''}`.localeCompare(`${b.scheduled_date || ''} ${b.scheduled_start_time || ''}`))
    .slice(0, limit)
);

export const getCommandCenterAlerts = ({ bookings = [], providers = [], households = [] } = {}) => {
  const alerts = [];

  bookings.forEach(booking => {
    if (booking.status === 'needs_review' || booking.approval_status === 'pending') {
      alerts.push({
        type: COMMAND_ALERT_TYPES.needsReview,
        priority: 'high',
        title: 'Booking needs review',
        message: `${booking.client_name || 'Guest'} · ${booking.service_label || booking.service_category || 'Service'}`,
        entityType: 'Booking',
        entityId: booking.id,
      });
    }

    if (!booking.provider_email && !['cancelled', 'archived', 'consult'].includes(booking.status)) {
      alerts.push({
        type: COMMAND_ALERT_TYPES.unassigned,
        priority: 'high',
        title: 'Booking is unassigned',
        message: `${booking.client_name || 'Guest'} · ${booking.scheduled_date || 'No date'}`,
        entityType: 'Booking',
        entityId: booking.id,
      });
    }

    if (booking.deposit_status === 'failed' || booking.payment_status === 'disputed') {
      alerts.push({
        type: COMMAND_ALERT_TYPES.paymentIssue,
        priority: 'critical',
        title: 'Payment needs attention',
        message: `${booking.client_name || 'Guest'} · ${booking.payment_status || booking.deposit_status}`,
        entityType: 'Booking',
        entityId: booking.id,
      });
    }

    if (booking.intake_answers?.service_area?.status === 'outside_area') {
      alerts.push({
        type: COMMAND_ALERT_TYPES.outsideArea,
        priority: 'medium',
        title: 'Outside area request',
        message: `${booking.client_name || 'Guest'} · manual review needed`,
        entityType: 'Booking',
        entityId: booking.id,
      });
    }
  });

  providers.forEach(provider => {
    if (['pending_review', 'restricted', 'suspended'].includes(provider.status)) {
      alerts.push({
        type: COMMAND_ALERT_TYPES.providerWarning,
        priority: provider.status === 'suspended' ? 'critical' : 'medium',
        title: 'Provider status needs attention',
        message: `${provider.full_name || provider.email || 'Provider'} · ${provider.status}`,
        entityType: 'Provider',
        entityId: provider.id,
      });
    }
  });

  households.forEach(profile => {
    if (profile.service_area_status === 'outside_area' || Number(profile.no_show_count || 0) > 0) {
      alerts.push({
        type: profile.service_area_status === 'outside_area' ? COMMAND_ALERT_TYPES.outsideArea : COMMAND_ALERT_TYPES.needsReview,
        priority: 'medium',
        title: 'Household may need manual review',
        message: profile.guest_name || profile.guest_email || 'Household',
        entityType: 'HouseholdProfile',
        entityId: profile.id,
      });
    }
  });

  return alerts.sort((a, b) => {
    const weight = { critical: 4, high: 3, medium: 2, low: 1 };
    return (weight[b.priority] || 0) - (weight[a.priority] || 0);
  });
};

export const buildCommandCenterSnapshot = ({ bookings = [], providers = [], households = [] } = {}) => ({
  generatedAt: new Date().toISOString(),
  today: getTodayBookings(bookings),
  upcoming: getUpcomingBookings(bookings),
  alerts: getCommandCenterAlerts({ bookings, providers, households }),
  bookingSummary: getBookingOperationsSummary(bookings),
  serviceSummary: getServiceOperationsSummary(bookings),
  providerSummary: getProviderOperationsSummary(bookings),
  membershipSummary: getMembershipOperationsSummary(households),
});
