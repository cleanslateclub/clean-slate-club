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

const normalize = (value = '') => String(value || '').trim().toLowerCase();
const normalizeChannel = (value = MESSAGE_CHANNELS.email) => {
  const channel = normalize(value);
  return Object.values(MESSAGE_CHANNELS).includes(channel) ? channel : MESSAGE_CHANNELS.email;
};
const normalizeStatus = (value = MESSAGE_STATUSES.queued) => {
  const status = normalize(value);
  return Object.values(MESSAGE_STATUSES).includes(status) ? status : MESSAGE_STATUSES.queued;
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
} = {}) => {
  const normalizedStatus = normalizeStatus(status);
  return {
    channel: normalizeChannel(channel),
    direction: normalize(direction || 'outbound') || 'outbound',
    status: normalizedStatus,
    template_key: templateKey,
    subject,
    body_preview: String(bodyPreview || '').slice(0, 500),
    recipient_name: recipientName,
    recipient_email: normalize(recipientEmail),
    recipient_phone: recipientPhone,
    booking_id: bookingId,
    household_profile_id: householdProfileId,
    provider_id: providerId,
    provider_email: normalize(providerEmail),
    event_type: eventType,
    error_message: errorMessage,
    metadata,
    sent_at: [MESSAGE_STATUSES.sent, MESSAGE_STATUSES.delivered].includes(normalizedStatus) ? new Date().toISOString() : undefined,
  };
};

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
