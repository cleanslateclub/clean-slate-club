export const toMoneyNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const normalizeCheckoutLineItems = (lineItems = []) => (
  lineItems
    .map((item, index) => ({
      id: item.id ?? index + 1,
      description: String(item.description || 'Service').trim() || 'Service',
      qty: Math.max(1, toMoneyNumber(item.qty, 1)),
      rate: Math.max(0, toMoneyNumber(item.rate, 0)),
    }))
    .filter(item => item.description || item.rate > 0)
);

export const getDepositCredit = (booking = {}) => (
  booking.deposit_status === 'paid' ? Math.max(0, toMoneyNumber(booking.deposit_amount, 50)) : 0
);

export const calculateCheckoutTotals = ({
  lineItems = [],
  discount = 0,
  tip = 0,
  depositCredit = 0,
} = {}) => {
  const normalizedLineItems = normalizeCheckoutLineItems(lineItems);
  const subtotal = normalizedLineItems.reduce((sum, item) => sum + item.rate * item.qty, 0);
  const discountAmount = Math.max(0, toMoneyNumber(discount, 0));
  const tipAmount = Math.max(0, toMoneyNumber(tip, 0));
  const depositAmount = Math.max(0, toMoneyNumber(depositCredit, 0));
  const finalTotal = Math.max(0, subtotal - discountAmount + tipAmount);
  const finalBalanceDue = Math.max(0, finalTotal - depositAmount);

  return {
    lineItems: normalizedLineItems,
    subtotal,
    discountAmount,
    tipAmount,
    depositCredit: depositAmount,
    finalTotal,
    finalBalanceDue,
  };
};

export const getStoredOrCalculatedBalanceDue = (booking = {}) => {
  const stored = Number(booking.final_balance_due);
  if (Number.isFinite(stored)) return Math.max(0, stored);

  const finalTotal = Number.isFinite(Number(booking.final_price))
    ? Number(booking.final_price)
    : toMoneyNumber(booking.estimated_price_high, 0);

  return Math.max(0, finalTotal - getDepositCredit(booking));
};

export const buildCheckoutAuditNote = ({ balanceDue = 0, checkoutNote = '', actorName = 'Admin' } = {}) => {
  const note = checkoutNote ? ` Note: ${checkoutNote}` : '';
  return `Checkout prepared by ${actorName} at ${new Date().toISOString()}: $${Number(balanceDue).toFixed(2)} balance due.${note}`;
};
