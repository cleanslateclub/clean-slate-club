export const cents = (amount = 0) => Math.round(Number(amount || 0) * 100);
export const dollars = (amountCents = 0) => Math.round(Number(amountCents || 0)) / 100;

export const normalizeLineItem = (item = {}) => ({
  description: item.description || item.label || 'Line item',
  amount_cents: Number(item.amount_cents ?? item.amount ?? 0),
  locked: Boolean(item.locked),
});

export const calculateInvoiceTotals = ({ lineItems = [], depositCents = 0, discountCents = 0, tipCents = 0 } = {}) => {
  const normalized = lineItems.map(normalizeLineItem);
  const subtotalCents = normalized.reduce((sum, item) => sum + Number(item.amount_cents || 0), 0);
  const totalCents = Math.max(0, subtotalCents - Number(depositCents || 0) - Number(discountCents || 0) + Number(tipCents || 0));

  return {
    lineItems: normalized,
    subtotalCents,
    depositCents: Number(depositCents || 0),
    discountCents: Number(discountCents || 0),
    tipCents: Number(tipCents || 0),
    totalCents,
    balanceDueCents: totalCents,
  };
};

export const buildInvoiceDraft = ({ booking = {}, lineItems = [], depositCents = 0, discountCents = 0, tipCents = 0 } = {}) => {
  const totals = calculateInvoiceTotals({ lineItems, depositCents, discountCents, tipCents });

  return {
    booking_id: booking.id || '',
    household_profile_id: booking.household_profile_id || '',
    client_name: booking.client_name || '',
    client_email: booking.client_email || '',
    service_label: booking.service_label || booking.service_category || '',
    status: 'draft',
    line_items: totals.lineItems,
    subtotal_cents: totals.subtotalCents,
    deposit_cents: totals.depositCents,
    discount_cents: totals.discountCents,
    tip_cents: totals.tipCents,
    total_cents: totals.totalCents,
    amount_paid_cents: 0,
    balance_due_cents: totals.balanceDueCents,
  };
};
