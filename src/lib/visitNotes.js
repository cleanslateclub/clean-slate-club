export const buildVisitNotesResponse = ({ booking = {}, provider = {}, answers = {} } = {}) => ({
  template_key: 'visit_completion_v1',
  template_name: 'Visit Completion Notes',
  category: 'visit_completion',
  status: 'submitted',
  guest_email: booking.client_email,
  guest_name: booking.client_name,
  booking_id: booking.id,
  household_profile_id: booking.household_profile_id || '',
  answers: {
    ...answers,
    provider_name: provider.full_name || provider.name || '',
    provider_email: provider.email || booking.provider_email || '',
    service_label: booking.service_label || booking.service_category || '',
    scheduled_date: booking.scheduled_date || '',
  },
  submitted_at: new Date().toISOString(),
});

export const summarizeVisitNotes = (answers = {}) => ([
  answers.completed_tasks ? `Completed: ${answers.completed_tasks}` : '',
  answers.unfinished_items ? `Still needed: ${answers.unfinished_items}` : '',
  answers.supplies_needed_next_time ? `Supplies next time: ${answers.supplies_needed_next_time}` : '',
  answers.guest_notes ? `Guest notes: ${answers.guest_notes}` : '',
].filter(Boolean).join('\n\n'));

export const buildProviderNotesPatch = ({ booking = {}, answers = {} } = {}) => ({
  ...booking,
  provider_notes: [booking.provider_notes, summarizeVisitNotes(answers)].filter(Boolean).join('\n\n'),
});
