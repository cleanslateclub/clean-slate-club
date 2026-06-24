import { base44 } from '@/api/base44Client';

export const AUDIT_EVENTS = {
  bookingCreated: 'booking_created',
  bookingUpdated: 'booking_updated',
  bookingRescheduled: 'booking_rescheduled',
  bookingCancelled: 'booking_cancelled',
  providerAssigned: 'provider_assigned',
  providerComplianceUpdated: 'provider_compliance_updated',
  complianceOverrideCreated: 'compliance_override_created',
  complianceOverrideRevoked: 'compliance_override_revoked',
  serviceMenuUpdated: 'service_menu_updated',
  paymentStatusUpdated: 'payment_status_updated',
  invoiceSent: 'invoice_sent',
  scheduleChanged: 'schedule_changed',
  messageSent: 'message_sent',
};

export const buildAuditEntry = ({
  eventType,
  entityType,
  entityId,
  actorName = 'System',
  actorEmail = '',
  actorRole = 'system',
  summary,
  before = null,
  after = null,
  metadata = {},
} = {}) => ({
  event_type: eventType,
  entity_type: entityType,
  entity_id: entityId,
  actor_name: actorName,
  actor_email: actorEmail,
  actor_role: actorRole,
  summary: summary || eventType || 'Backend OS event',
  before: before || undefined,
  after: after || undefined,
  metadata,
  created_at: new Date().toISOString(),
});

export const writeAuditLog = async (entry) => {
  try {
    const payload = buildAuditEntry(entry);
    await base44.entities.AuditLog.create(payload);
    return { success: true, payload };
  } catch (error) {
    console.warn('Audit log write failed:', error);
    return { success: false, error };
  }
};

export const appendInlineAuditEvent = (existingLog = [], entry = {}) => {
  const log = Array.isArray(existingLog) ? existingLog : [];
  return [
    ...log,
    {
      event_type: entry.eventType,
      summary: entry.summary || entry.eventType || 'Event',
      actor_name: entry.actorName || 'System',
      actor_role: entry.actorRole || 'system',
      metadata: entry.metadata || {},
      created_at: new Date().toISOString(),
    },
  ];
};
