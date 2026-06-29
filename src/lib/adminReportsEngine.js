export const money = (value = 0) => Number(value || 0);

const INACTIVE_REVENUE_STATUSES = ['cancelled', 'archived'];

export const getBookingRevenueValue = (booking = {}) => {
  const finalPrice = money(booking.final_price);
  if (finalPrice > 0) return finalPrice;
  if (INACTIVE_REVENUE_STATUSES.includes(booking.status)) return 0;
  return money(booking.estimated_price_high) || money(booking.estimated_price_low);
};

export const summarizeBookings = (bookings = []) => {
  const active = bookings.filter(item => !['cancelled', 'archived'].includes(item.status));
  const completed = bookings.filter(item => item.status === 'completed');
  const needsReview = active.filter(item => item.requires_admin_approval || item.approval_status === 'pending' || item.status === 'needs_review');
  const unassigned = active.filter(item => !item.provider_email && !['draft', 'completed'].includes(item.status));
  const revenue = bookings.reduce((total, booking) => total + getBookingRevenueValue(booking), 0);

  return {
    total: bookings.length,
    active: active.length,
    completed: completed.length,
    needsReview: needsReview.length,
    unassigned: unassigned.length,
    revenue,
  };
};

export const summarizeServiceMix = (bookings = []) => {
  const counts = bookings.reduce((summary, booking) => {
    const key = booking.service_label || booking.service_category || 'Unlabeled service';
    summary[key] = (summary[key] || 0) + 1;
    return summary;
  }, {});

  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
};

export const summarizeProviderLoad = (bookings = []) => {
  const counts = bookings.reduce((summary, booking) => {
    const key = booking.provider_name || booking.provider_email || 'Unassigned';
    summary[key] = (summary[key] || 0) + 1;
    return summary;
  }, {});

  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
};

export const summarizePaymentStatus = (bookings = []) => {
  const counts = bookings.reduce((summary, booking) => {
    const key = booking.payment_status || booking.deposit_status || 'unknown';
    summary[key] = (summary[key] || 0) + 1;
    return summary;
  }, {});

  return Object.entries(counts)
    .map(([label, count]) => ({ label: String(label).replace(/_/g, ' '), count }))
    .sort((a, b) => b.count - a.count);
};

export const getOperationalReadinessRows = (bookings = []) => {
  const active = bookings.filter(item => !['cancelled', 'archived'].includes(item.status));
  const missingDate = active.filter(item => !item.scheduled_date);
  const missingTime = active.filter(item => !item.scheduled_start_time);
  const missingAddress = active.filter(item => !item.client_address && !item.intake_answers?.service_address?.formatted);
  const unassigned = active.filter(item => !item.provider_email && !['draft', 'completed', 'consult'].includes(item.status));
  const pendingApproval = active.filter(item => item.requires_admin_approval || item.approval_status === 'pending' || item.status === 'needs_review');
  const paymentReview = active.filter(item => ['failed', 'disputed', 'requires_review'].includes(item.payment_status) || ['failed', 'requires_review'].includes(item.deposit_status));
  const outsideArea = active.filter(item => item.intake_answers?.service_area?.status === 'outside_area' || item.service_area_status === 'outside_area');
  const missingContact = active.filter(item => !item.client_email && !item.client_phone);

  return [
    {
      key: 'missing_date',
      label: 'Missing date',
      count: missingDate.length,
      severity: missingDate.length ? 'high' : 'clear',
      helper: 'Active bookings need a scheduled date before launch testing.',
    },
    {
      key: 'missing_time',
      label: 'Missing start time',
      count: missingTime.length,
      severity: missingTime.length ? 'high' : 'clear',
      helper: 'Schedule previews and TimeBlock tests need a start time.',
    },
    {
      key: 'missing_address',
      label: 'Missing service address',
      count: missingAddress.length,
      severity: missingAddress.length ? 'medium' : 'clear',
      helper: 'Map links, service area checks, and provider job cards need an address.',
    },
    {
      key: 'unassigned',
      label: 'Unassigned active bookings',
      count: unassigned.length,
      severity: unassigned.length ? 'high' : 'clear',
      helper: 'Provider assignment should be tested manually before auto-assignment is considered.',
    },
    {
      key: 'pending_approval',
      label: 'Pending approval/review',
      count: pendingApproval.length,
      severity: pendingApproval.length ? 'medium' : 'clear',
      helper: 'These are expected during testing, but should be visible in the Action Center.',
    },
    {
      key: 'payment_review',
      label: 'Payment records needing review',
      count: paymentReview.length,
      severity: paymentReview.length ? 'high' : 'clear',
      helper: 'Payment automation stays locked until Stripe behavior is verified.',
    },
    {
      key: 'outside_area',
      label: 'Outside-area requests',
      count: outsideArea.length,
      severity: outsideArea.length ? 'medium' : 'clear',
      helper: 'Outside-area handling needs owner policy approval before launch.',
    },
    {
      key: 'missing_contact',
      label: 'Missing guest contact',
      count: missingContact.length,
      severity: missingContact.length ? 'high' : 'clear',
      helper: 'Guest email or phone is needed for confirmations and admin follow-up.',
    },
  ];
};
