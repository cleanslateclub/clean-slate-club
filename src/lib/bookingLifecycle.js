import { AUDIT_EVENTS, appendInlineAuditEvent } from '@/lib/auditLog';
import { BOOKING_RULES_DEFAULTS } from '@/lib/backendOSConfig';

const normalizeEmail = (value = '') => String(value || '').trim().toLowerCase();

export const BOOKING_STATUSES = {
  draft: 'draft',
  pending: 'pending',
  needsReview: 'needs_review',
  approved: 'approved',
  confirmed: 'confirmed',
  providerAssigned: 'provider_assigned',
  inProgress: 'in_progress',
  completed: 'completed',
  cancelled: 'cancelled',
  noShow: 'no_show',
  rescheduled: 'rescheduled',
  archived: 'archived',
};

export const PAYMENT_STATUSES = {
  unpaid: 'unpaid',
  depositPaid: 'deposit_paid',
  checkoutSent: 'checkout_sent',
  partiallyPaid: 'partially_paid',
  paid: 'paid',
  refunded: 'refunded',
  disputed: 'disputed',
  void: 'void',
};

export const APPROVAL_STATUSES = {
  notRequired: 'not_required',
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
};

export const getBookingDisplayStatus = (booking = {}) => {
  const status = booking.status || BOOKING_STATUSES.pending;
  return status.replace(/_/g, ' ');
};

export const isBookingActive = (booking = {}) => {
  return ![
    BOOKING_STATUSES.cancelled,
    BOOKING_STATUSES.noShow,
    BOOKING_STATUSES.archived,
  ].includes(booking.status);
};

export const requiresAdminApproval = (booking = {}) => {
  return Boolean(booking.requires_admin_approval || booking.approval_status === APPROVAL_STATUSES.pending || booking.status === BOOKING_STATUSES.needsReview);
};

export const canAssignProvider = (booking = {}) => {
  return isBookingActive(booking) && !requiresAdminApproval(booking) && [
    BOOKING_STATUSES.approved,
    BOOKING_STATUSES.confirmed,
    BOOKING_STATUSES.providerAssigned,
  ].includes(booking.status);
};

export const canSendFinalCheckout = (booking = {}) => {
  return [BOOKING_STATUSES.completed, BOOKING_STATUSES.inProgress].includes(booking.status) && booking.payment_status !== PAYMENT_STATUSES.paid;
};

export const applyProviderAssignment = (booking = {}, provider = {}, actorName = 'Admin') => ({
  status: BOOKING_STATUSES.providerAssigned,
  provider_id: provider.id || booking.provider_id || '',
  provider_name: provider.full_name || provider.name || booking.provider_name || '',
  provider_email: normalizeEmail(provider.email || booking.provider_email || ''),
  audit_log: appendInlineAuditEvent(booking.audit_log, {
    eventType: AUDIT_EVENTS.providerAssigned,
    summary: `Provider assigned: ${provider.full_name || provider.email || 'Provider'}`,
    actorName,
    actorRole: 'admin',
    metadata: { provider_id: provider.id, provider_email: normalizeEmail(provider.email || '') },
  }),
});

export const applyCancellation = ({ booking = {}, reason = '', actorName = 'Admin', retainDeposit = false } = {}) => ({
  status: BOOKING_STATUSES.cancelled,
  cancelled_at: new Date().toISOString(),
  cancelled_by: actorName,
  cancellation_reason: reason,
  deposit_status: retainDeposit ? 'retained' : booking.deposit_status,
  refund_status: retainDeposit ? 'not_applicable' : booking.refund_status,
  audit_log: appendInlineAuditEvent(booking.audit_log, {
    eventType: AUDIT_EVENTS.bookingCancelled,
    summary: reason ? `Booking cancelled: ${reason}` : 'Booking cancelled',
    actorName,
    actorRole: 'admin',
    metadata: { retainDeposit },
  }),
});

export const applyReschedule = ({ booking = {}, date, startTime, endTime, actorName = 'Admin', isMember = false } = {}) => {
  const previousCount = Number(booking.reschedule_count) || 0;
  const nextCount = previousCount + 1;
  const freeMemberReschedules = Number(BOOKING_RULES_DEFAULTS.memberFreeReschedules) || 0;
  const feeDue = !isMember || nextCount > freeMemberReschedules
    ? Number(BOOKING_RULES_DEFAULTS.nonMemberRescheduleFee) || 0
    : 0;

  return {
    status: BOOKING_STATUSES.rescheduled,
    original_scheduled_date: booking.original_scheduled_date || booking.scheduled_date,
    original_scheduled_start_time: booking.original_scheduled_start_time || booking.scheduled_start_time,
    scheduled_date: date || booking.scheduled_date,
    scheduled_start_time: startTime || booking.scheduled_start_time,
    scheduled_end_time: endTime || booking.scheduled_end_time,
    reschedule_count: nextCount,
    reschedule_fee_due: feeDue,
    audit_log: appendInlineAuditEvent(booking.audit_log, {
      eventType: AUDIT_EVENTS.bookingRescheduled,
      summary: `Booking rescheduled to ${date || booking.scheduled_date} at ${startTime || booking.scheduled_start_time}`,
      actorName,
      actorRole: 'admin',
      metadata: { isMember, feeDue, previousCount, nextCount },
    }),
  };
};

export const applyCheckoutSent = ({ booking = {}, checkoutUrl = '', actorName = 'Admin' } = {}) => ({
  payment_status: PAYMENT_STATUSES.checkoutSent,
  checkout_link_url: checkoutUrl || booking.checkout_link_url,
  checkout_sent_at: new Date().toISOString(),
  audit_log: appendInlineAuditEvent(booking.audit_log, {
    eventType: AUDIT_EVENTS.invoiceSent,
    summary: 'Final checkout sent',
    actorName,
    actorRole: 'admin',
    metadata: { checkoutUrl },
  }),
});
