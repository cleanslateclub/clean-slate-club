const appendAdminNote = (existingNote, nextNote) => {
  const existing = existingNote ? String(existingNote).trim() : '';
  return [existing, nextNote].filter(Boolean).join('\n\n');
};

const actionStamp = ({ actorName = 'Admin', action }) => (
  `${action} by ${actorName} at ${new Date().toISOString()}`
);

export const buildApproveBookingPatch = ({ booking = {}, actorName = 'Admin' } = {}) => {
  const action = actionStamp({ actorName, action: 'Approved' });
  return {
    status: booking.provider_email ? 'confirmed' : 'approved',
    requires_admin_approval: false,
    approval_status: 'approved',
    approval_notes: appendAdminNote(booking.approval_notes, action),
    admin_notes: appendAdminNote(booking.admin_notes, action),
  };
};

export const buildReviewHoldPatch = ({ booking = {}, note = '', actorName = 'Admin' } = {}) => {
  const action = actionStamp({ actorName, action: 'Held for review' });
  return {
    status: 'needs_review',
    requires_admin_approval: true,
    approval_status: 'pending',
    approval_notes: appendAdminNote(booking.approval_notes, note || action),
    admin_notes: appendAdminNote(booking.admin_notes, note || action),
  };
};

export const buildCompleteBookingPatch = ({ booking = {}, actorName = 'Admin' } = {}) => {
  const completedAt = new Date().toISOString();
  const action = `Marked complete by ${actorName} at ${completedAt}. Final checkout/payment collection still requires admin review.`;
  return {
    status: 'completed',
    completed_at: completedAt,
    admin_notes: appendAdminNote(booking.admin_notes, action),
  };
};

export const buildCancelBookingPatch = ({ booking = {}, reason = '', actorName = 'Admin' } = {}) => {
  const cancelledAt = new Date().toISOString();
  const action = `Cancelled by ${actorName} at ${cancelledAt}.${reason ? ` Reason: ${reason}` : ''} Refunds, retained deposits, and guest/provider notifications must be handled manually until policy automation is verified.`;
  return {
    status: 'cancelled',
    cancelled_at: cancelledAt,
    cancellation_reason: reason || booking.cancellation_reason || 'Admin cancelled',
    checkout_status: 'cancelled_before_checkout',
    admin_notes: appendAdminNote(booking.admin_notes, action),
  };
};

export const buildArchiveBookingPatch = ({ booking = {}, actorName = 'Admin' } = {}) => {
  const archivedAt = new Date().toISOString();
  const action = `Archived by ${actorName} at ${archivedAt}.`;
  return {
    status: 'archived',
    archived_at: archivedAt,
    admin_notes: appendAdminNote(booking.admin_notes, action),
  };
};
