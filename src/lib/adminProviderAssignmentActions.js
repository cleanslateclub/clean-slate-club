const normalizeEmail = (value = '') => String(value || '').trim().toLowerCase();

export const buildProviderAssignmentPatch = ({ booking = {}, provider = {}, actorName = 'Admin' } = {}) => {
  const now = new Date().toISOString();
  const providerEmail = normalizeEmail(provider.email || booking.provider_email || '');
  const providerName = provider.full_name || provider.name || provider.email || booking.provider_name || '';
  const auditEntry = {
    type: 'provider_assigned',
    actor: actorName,
    provider_email: providerEmail,
    provider_name: providerName,
    created_at: now,
  };

  return {
    status: booking.status === 'completed' ? booking.status : 'provider_assigned',
    provider_id: provider.id || booking.provider_id || '',
    provider_email: providerEmail,
    provider_name: providerName,
    assignment_status: 'assigned',
    assigned_at: now,
    assigned_by: actorName,
    audit_log: [...(booking.audit_log || []), auditEntry],
  };
};

export const canAssignProviderToBooking = ({ booking = {}, provider = {} } = {}) => {
  if (!booking.id || !normalizeEmail(provider.email)) return false;
  if (['cancelled', 'archived', 'completed'].includes(booking.status)) return false;
  return true;
};
