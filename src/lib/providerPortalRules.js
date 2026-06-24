export const PROVIDER_PORTAL_TABS = [
  { key: 'today', label: 'Today', description: 'Assigned visits for today.' },
  { key: 'upcoming', label: 'Upcoming', description: 'Future assigned visits.' },
  { key: 'availability', label: 'Availability', description: 'Provider schedule windows and time off.' },
  { key: 'completion', label: 'Visit Notes', description: 'Completion notes and follow-up needs.' },
  { key: 'profile', label: 'Profile', description: 'Provider-safe profile details.' },
];

export const getProviderVisibleBooking = (booking = {}) => ({
  id: booking.id,
  status: booking.status,
  client_name: booking.client_name,
  client_phone: booking.client_phone,
  client_address: booking.client_address,
  service_category: booking.service_category,
  service_label: booking.service_label,
  scheduled_date: booking.scheduled_date,
  scheduled_start_time: booking.scheduled_start_time,
  scheduled_end_time: booking.scheduled_end_time,
  total_duration_minutes: booking.total_duration_minutes,
  addons: booking.addons || [],
  addon_labels: booking.addon_labels || [],
  provider_notes: booking.provider_notes || '',
  special_notes: booking.special_notes || '',
  intake_answers: {
    service_address: booking.intake_answers?.service_address,
    emergency_contact_details: booking.intake_answers?.emergency_contact_details,
    uploaded_photos: booking.intake_answers?.uploaded_photos,
  },
});

export const filterProviderBookings = (bookings = [], providerEmail = '') => (
  bookings.filter(booking => booking.provider_email === providerEmail)
);

export const getProviderTodayBookings = (bookings = [], providerEmail = '', dateKey = new Date().toISOString().split('T')[0]) => (
  filterProviderBookings(bookings, providerEmail)
    .filter(booking => booking.scheduled_date === dateKey && !['cancelled', 'archived'].includes(booking.status))
    .map(getProviderVisibleBooking)
);

export const getProviderUpcomingBookings = (bookings = [], providerEmail = '', dateKey = new Date().toISOString().split('T')[0]) => (
  filterProviderBookings(bookings, providerEmail)
    .filter(booking => booking.scheduled_date >= dateKey && !['cancelled', 'archived'].includes(booking.status))
    .sort((a, b) => `${a.scheduled_date || ''} ${a.scheduled_start_time || ''}`.localeCompare(`${b.scheduled_date || ''} ${b.scheduled_start_time || ''}`))
    .map(getProviderVisibleBooking)
);

export const canProviderEditBooking = (booking = {}, providerEmail = '') => {
  return booking.provider_email === providerEmail && ['provider_assigned', 'confirmed', 'in_progress'].includes(booking.status);
};
