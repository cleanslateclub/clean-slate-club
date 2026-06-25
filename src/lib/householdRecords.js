export const buildHouseholdProfileFromBooking = (booking = {}) => {
  const intake = booking.intake_answers || {};
  const address = intake.service_address || {};

  return {
    guest_email: booking.client_email,
    guest_name: booking.client_name,
    guest_phone: booking.client_phone,
    primary_service_address: booking.client_address || address.formatted || '',
    saved_addresses: booking.client_address || address.formatted || '',
    service_area_status: intake.service_area?.status || 'manual_review',
    access_notes: intake.access_notes || intake.entry_notes || '',
    parking_notes: intake.parking_notes || '',
    pets: intake.pets || intake.pet_notes || '',
    children_notes: intake.children_notes || '',
    senior_notes: intake.senior_notes || '',
    emergency_contact_name: [intake.emergency_contact_details?.first_name, intake.emergency_contact_details?.last_name].filter(Boolean).join(' '),
    emergency_contact_phone: intake.emergency_contact_details?.phone || '',
    supply_preferences: intake.supply_preferences || '',
    provider_safe_notes: intake.provider_safe_notes || '',
    preferred_contact_method: intake.preferred_contact || '',
    sms_opt_in: Boolean(intake.sms_opt_in),
    email_opt_in: true,
    lead_source: intake.lead_source || '',
    last_booking_date: booking.scheduled_date,
    booking_count: 1,
  };
};

export const mergeBookingIntoHouseholdProfile = (profile = {}, booking = {}) => {
  const intake = booking.intake_answers || {};
  const bookingCount = Number(profile.booking_count || 0) + 1;
  const cancelledCount = Number(profile.cancelled_booking_count || 0) + (booking.status === 'cancelled' ? 1 : 0);
  const noShowCount = Number(profile.no_show_count || 0) + (booking.status === 'no_show' ? 1 : 0);

  return {
    ...profile,
    guest_name: profile.guest_name || booking.client_name,
    guest_phone: profile.guest_phone || booking.client_phone,
    primary_service_address: profile.primary_service_address || booking.client_address,
    service_area_status: profile.service_area_status || intake.service_area?.status,
    last_booking_date: booking.scheduled_date || profile.last_booking_date,
    booking_count: bookingCount,
    cancelled_booking_count: cancelledCount,
    no_show_count: noShowCount,
  };
};

export const getHouseholdRiskFlags = (profile = {}) => {
  const flags = [];
  if (Number(profile.no_show_count || 0) > 0) flags.push('Prior no-show');
  if (Number(profile.cancelled_booking_count || 0) >= 2) flags.push('Repeated cancellations');
  if (profile.service_area_status === 'outside_area') flags.push('Outside service area');
  if (Array.isArray(profile.private_flags)) flags.push(...profile.private_flags);
  return [...new Set(flags)];
};

export const shouldRequireManualReviewForHousehold = (profile = {}) => {
  return getHouseholdRiskFlags(profile).length > 0;
};
