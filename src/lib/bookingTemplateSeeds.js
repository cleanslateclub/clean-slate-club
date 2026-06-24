export const BOOKING_TEMPLATE_SEEDS = [
  {
    key: 'booking_request_received_v1',
    name: 'Booking Request Received',
    category: 'booking',
    channel: 'email',
    status: 'draft',
    subject: 'We got your request - Clean Slate Club',
    body: 'Hi {{guest_name}},\n\nYour Clean Slate Club request has been received. I will review the details and confirm availability shortly.\n\nService: {{service_label}}\nDate: {{scheduled_date}}\nTime: {{scheduled_start_time}}',
    trigger_event: 'booking_created',
    requires_opt_in: false,
  },
  {
    key: 'consult_booked_v1',
    name: 'Consult Booked',
    category: 'booking',
    channel: 'email',
    status: 'draft',
    subject: 'Your Clean Slate Club consult is scheduled',
    body: 'Hi {{guest_name}},\n\nYour free 15-minute consult is scheduled for {{scheduled_date}} at {{scheduled_start_time}}. I will call you at the number you provided.',
    trigger_event: 'consult_booked',
    requires_opt_in: false,
  },
  {
    key: 'visit_followup_v1',
    name: 'Visit Follow-Up',
    category: 'followup',
    channel: 'email',
    status: 'draft',
    subject: 'How did your Clean Slate visit go?',
    body: 'Hi {{guest_name}},\n\nI hope your visit helped create a little more breathing room. If you have a minute, I would love to hear how it went.',
    trigger_event: 'booking_completed',
    delay_minutes: 1440,
    requires_opt_in: true,
  },
];

export const renderTemplate = (template = {}, values = {}) => {
  const replaceTokens = (text = '') => Object.entries(values).reduce((output, [key, value]) => {
    return output.replaceAll(`{{${key}}}`, value == null ? '' : String(value));
  }, text || '');

  return {
    ...template,
    subject: replaceTokens(template.subject),
    body: replaceTokens(template.body),
    sms_body: replaceTokens(template.sms_body),
  };
};
