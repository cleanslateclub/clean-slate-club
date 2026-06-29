export const FORM_CATEGORIES = {
  guestIntake: 'guest_intake',
  serviceIntake: 'service_intake',
  visitCompletion: 'visit_completion',
  incident: 'incident',
  internal: 'internal',
};

export const FIELD_TYPES = {
  text: 'text',
  textarea: 'textarea',
  email: 'email',
  phone: 'phone',
  select: 'select',
  multiselect: 'multiselect',
  checkbox: 'checkbox',
  date: 'date',
  time: 'time',
  address: 'address',
};

export const buildField = ({ key, label, type = FIELD_TYPES.text, required = false, options = [], helper = '' } = {}) => ({
  key,
  label,
  type,
  required,
  options,
  helper,
});

export const FORM_TEMPLATE_SEEDS = [
  {
    key: 'guest_household_intake_v1',
    name: 'Guest Household Intake',
    category: FORM_CATEGORIES.guestIntake,
    description: 'Core household details used to create or update a guest profile.',
    fields: [
      buildField({ key: 'guest_name', label: 'Full name', required: true }),
      buildField({ key: 'guest_email', label: 'Email', type: FIELD_TYPES.email, required: true }),
      buildField({ key: 'guest_phone', label: 'Phone', type: FIELD_TYPES.phone, required: true }),
      buildField({ key: 'service_address', label: 'Service address', type: FIELD_TYPES.address, required: true }),
      buildField({ key: 'access_notes', label: 'Entry/access notes', type: FIELD_TYPES.textarea }),
      buildField({ key: 'pets', label: 'Pets in the home', type: FIELD_TYPES.textarea }),
      buildField({ key: 'supply_preferences', label: 'Supply preferences', type: FIELD_TYPES.textarea }),
      buildField({ key: 'preferred_contact_method', label: 'Preferred contact method', type: FIELD_TYPES.select, options: ['Text', 'Email', 'Phone call'] }),
    ],
  },
  {
    key: 'visit_completion_v1',
    name: 'Visit Completion Notes',
    category: FORM_CATEGORIES.visitCompletion,
    description: 'Provider-safe visit completion summary for admin review.',
    fields: [
      buildField({ key: 'completed_tasks', label: 'What was completed?', type: FIELD_TYPES.textarea, required: true }),
      buildField({ key: 'unfinished_items', label: 'What still needs attention?', type: FIELD_TYPES.textarea }),
      buildField({ key: 'supplies_needed_next_time', label: 'Supplies needed next time', type: FIELD_TYPES.textarea }),
      buildField({ key: 'guest_notes', label: 'Guest notes or preferences for next visit', type: FIELD_TYPES.textarea }),
      buildField({ key: 'incident_or_concern', label: 'Any incident or concern?', type: FIELD_TYPES.textarea }),
    ],
  },
  {
    key: 'incident_report_v1',
    name: 'Incident Report',
    category: FORM_CATEGORIES.incident,
    description: 'Internal report for anything that needs admin attention.',
    requires_admin_review: true,
    fields: [
      buildField({ key: 'incident_date', label: 'Date', type: FIELD_TYPES.date, required: true }),
      buildField({ key: 'incident_time', label: 'Time', type: FIELD_TYPES.time }),
      buildField({ key: 'summary', label: 'What happened?', type: FIELD_TYPES.textarea, required: true }),
      buildField({ key: 'immediate_action', label: 'What action was taken?', type: FIELD_TYPES.textarea }),
      buildField({ key: 'followup_needed', label: 'Follow-up needed?', type: FIELD_TYPES.checkbox }),
    ],
  },
];

export const buildFormResponse = ({ template = {}, answers = {}, guest = {}, bookingId = '', householdProfileId = '' } = {}) => ({
  template_key: template.key,
  template_name: template.name,
  category: template.category,
  status: 'submitted',
  guest_email: guest.email || guest.guest_email || '',
  guest_name: guest.name || guest.guest_name || '',
  booking_id: bookingId,
  household_profile_id: householdProfileId,
  answers,
  submitted_at: new Date().toISOString(),
});

const hasRequiredAnswer = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  return value !== null && value !== undefined && value !== false;
};

export const validateFormAnswers = (template = {}, answers = {}) => {
  const missing = (template.fields || [])
    .filter(field => field.required && !hasRequiredAnswer(answers[field.key]))
    .map(field => field.label || field.key);

  return {
    valid: missing.length === 0,
    missing,
  };
};
