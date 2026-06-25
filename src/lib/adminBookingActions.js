export const buildApproveBookingPatch = ({ booking = {}, actorName = 'Admin' } = {}) => ({
  ...booking,
  status: booking.provider_email ? 'confirmed' : 'approved',
  requires_admin_approval: false,
  approval_status: 'approved',
  approval_notes: booking.approval_notes || `Approved by ${actorName}`,
});

export const buildReviewHoldPatch = ({ booking = {}, note = '', actorName = 'Admin' } = {}) => ({
  ...booking,
  status: 'needs_review',
  requires_admin_approval: true,
  approval_status: 'pending',
  approval_notes: note || `Held for review by ${actorName}`,
});

export const buildCompleteBookingPatch = ({ booking = {}, actorName = 'Admin' } = {}) => ({
  ...booking,
  status: 'completed',
  completed_at: new Date().toISOString(),
  admin_notes: booking.admin_notes || `Marked complete by ${actorName}`,
});

export const buildArchiveBookingPatch = ({ booking = {}, actorName = 'Admin' } = {}) => ({
  ...booking,
  status: 'archived',
  archived_at: new Date().toISOString(),
  admin_notes: booking.admin_notes || `Archived by ${actorName}`,
});
