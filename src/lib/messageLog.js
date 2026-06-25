import { base44 } from '@/api/base44Client';

export const MESSAGE_CHANNELS = {
  email: 'email',
  sms: 'sms',
  phone: 'phone',
  internalNote: 'internal_note',
  system: 'system',
};

export const MESSAGE_STATUSES = {
  draft: 'draft',
  queued: 'queued',
  sent: 'sent',
  delivered: 'delivered',
  failed: 'failed',
  skipped: 'skipped',
};

export const buildMessageLogEntry = ({
  channel = MESSAGE_CHANNELS.email,
  direction = 'outbound',
  status = MESSAGE_STATUSES.queued,
  templateKey = '',
  subject = '',
  bodyPreview = '',
  recipientName = '',
  recipientEmail = '',
  recipientPhone = '',
  bookingId = '',
  householdProfileId = '',
  providerId = '',
  providerEmail = '',
  eventType = '',
  errorMessage = '',
  metadata = {},
} = {}) => ({
  channel,
  direction,
  status,
  template_key: templateKey,
  subject,
  body_preview: String(bodyPreview || '').slice(0, 500),
  recipient_name: recipientName,
  recipient_email: recipientEmail,
  recipient_phone: recipientPhone,
  booking_id: bookingId,
  household_profile_id: householdProfileId,
  provider_id: providerId,
  provider_email: providerEmail,
  event_type: eventType,
  error_message: errorMessage,
  metadata,
  sent_at: status === MESSAGE_STATUSES.sent || status === MESSAGE_STATUSES.delivered ? new Date().toISOString() : undefined,
});

export const writeMessageLog = async (entry = {}) => {
  try {
    const payload = buildMessageLogEntry(entry);
    await base44.entities.MessageLog.create(payload);
    return { success: true, payload };
  } catch (error) {
    console.warn('Message log write failed:', error);
    return { success: false, error };
  }
};

export const writeSkippedMessageLog = (entry = {}, reason = 'Skipped by rule') => writeMessageLog({
  ...entry,
  status: MESSAGE_STATUSES.skipped,
  errorMessage: reason,
});

export const writeFailedMessageLog = (entry = {}, error) => writeMessageLog({
  ...entry,
  status: MESSAGE_STATUSES.failed,
  errorMessage: error?.message || String(error || 'Unknown message error'),
});
