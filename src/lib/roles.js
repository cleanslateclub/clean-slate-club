/**
 * Role-based access control helpers.
 *
 * Roles in this app:
 *   admin    – CEO / Admin: full access to everything
 *   provider – Service provider: own jobs, own payout summary, no business intel
 *   user     – Guest/member: own bookings, profile, payments only
 */

export const ROLES = {
  ADMIN: 'admin',
  PROVIDER: 'provider',
  ASSISTANT: 'assistant', // provider-level access
  USER: 'user',
};

/** Is this user a CEO/Admin? */
export const isAdmin = (user) => user?.role === ROLES.ADMIN;

/** Is this user a provider or assistant? */
export const isProvider = (user) =>
  user?.role === ROLES.PROVIDER || user?.role === ROLES.ASSISTANT;

/** Is this user a regular guest/member? */
export const isGuest = (user) => user?.role === ROLES.USER || !user?.role;

// ─── Feature-level permission checks ────────────────────────────────────────

/** Can this user view company revenue / Stripe summaries / profit margins? */
export const canViewFinancials = (user) => isAdmin(user);

/** Can this user view/manage other providers? */
export const canViewProviders = (user) => isAdmin(user);

/** Can this user view all bookings (not just their own)? */
export const canViewAllBookings = (user) => isAdmin(user);

/** Can this user view CEO-only internal notes? */
export const canViewInternalNotes = (user) => isAdmin(user);

/** Can this user access feature toggles / settings? */
export const canAccessSettings = (user) => isAdmin(user);

/** Can this user view marketing analytics / lead sources / client LTV? */
export const canViewAnalytics = (user) => isAdmin(user);

/** Can this user edit service pricing? */
export const canEditPricing = (user) => isAdmin(user);

/** Can this user view/manage all incidents? */
export const canViewAllIncidents = (user) => isAdmin(user);

/**
 * Can this user view their own payout summary?
 * Providers: yes. Admins: yes (they see the full payouts tab). Guests: no.
 */
export const canViewOwnPayouts = (user) => isAdmin(user) || isProvider(user);

/**
 * Provider-safe booking fields — strips out admin/CEO-only data.
 * Use this before passing a booking object to provider-facing components.
 */
export const sanitizeBookingForProvider = (booking) => {
  if (!booking) return null;
  // Remove CEO-only fields
  const { admin_notes, estimated_price_low, estimated_price_high, ...safe } = booking;
  return safe;
};

/**
 * Guest-safe booking fields — only what the guest needs.
 */
export const sanitizeBookingForGuest = (booking) => {
  if (!booking) return null;
  const {
    admin_notes,
    // provider-internal fields that guests shouldn't see
    ...safe
  } = booking;
  return safe;
};