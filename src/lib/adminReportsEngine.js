export const money = (value = 0) => Number(value || 0);

export const getBookingRevenueValue = (booking = {}) => (
  money(booking.final_price) || money(booking.estimated_price_high) || money(booking.estimated_price_low)
);

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
