# Clean Slate Club Launch Blocker Register

Last updated: 2026-06-28

This register tracks the launch-critical gaps found during the GitHub-only backend/admin audit. It intentionally does not assume the live Base44 function layer is complete until each item is verified in Base44.

## P0 blockers

### 1. Final checkout is not launch-ready

Current state:

- Admin checkout can prepare a balance due.
- Live charge/payment-link actions remain locked.
- `BookingDrawer.jsx` currently saves partial checkout state only.
- `AdminPaymentsOS.jsx` now understands stored `final_balance_due` when present, but the checkout drawer still needs to persist it.

Required before launch:

- Persist normalized line items.
- Persist subtotal, discount amount, discount note, tip amount, deposit credit, final total, and final balance due.
- Create or link an Invoice record if invoices are part of the live schema.
- Wire `createFinalCheckoutSession` only after the backend contract is live and verified.
- Keep automatic charging disabled until Stripe webhook reconciliation is verified.

Acceptance criteria:

- A completed booking with a deposit shows the exact remaining balance in the admin payment dashboard.
- Admin can prepare checkout without duplicating payment records.
- A zero-balance booking can be marked paid without creating a Stripe session.
- Stripe and manual payments reconcile to the same balance fields.

---

### 2. Stripe webhook reconciliation is not verified

Current state:

- Deposit PaymentIntent flow is referenced by the booking frontend.
- Final checkout webhook flow is not verified in GitHub.

Required before launch:

- `stripeWebhook` must verify Stripe signatures.
- Webhook handler must be idempotent by Stripe event id.
- Deposit payment and final balance payment must update separate fields.
- Refunds, failures, and disputes must append audit/admin notes.

Acceptance criteria:

- Deposit success updates `deposit_status` without marking the final balance paid.
- Final checkout success updates `payment_status` and `final_balance_due`.
- Duplicate webhook deliveries do not double-apply payments.
- Refunded/disputed charges are visible in admin payment views.

---

### 3. Destructive booking delete paths remain in admin UI

Current state:

- Safe cancel/archive actions exist in the Booking Action Center.
- Some admin calendar/drawer paths still expose permanent delete behavior.

Required before launch:

- Replace booking delete controls with archive/cancel controls wherever possible.
- Keep true delete hidden from normal admin workflows.
- Never delete paid bookings unless there is a separate protected maintenance path.

Acceptance criteria:

- Admin cannot accidentally permanently delete a booking from calendar hover controls or drawer actions.
- Cancelled/archived bookings remain searchable for payment and dispute history.

---

### 4. Admin calendar reschedule audit is incomplete

Current state:

- Admin calendar drag updates booking start/end times directly.
- Provider drag has been disabled.

Required before launch:

- Every admin reschedule should persist previous date/time and new date/time.
- Append an admin note with actor/time.
- Trigger non-blocking schedule notifications after save.
- Consider requiring confirmation before drag-reschedule is saved.

Acceptance criteria:

- Dragging a booking produces a clear audit trail.
- Assigned provider notification failure does not block the reschedule.
- A mistaken drag can be understood and reversed from audit data.

---

### 5. Provider/team auth still depends on client-side session storage

Current state:

- Provider session now revalidates provider id/email against an active provider record.
- Session still lives in localStorage.

Required before launch:

- `verifyProviderLogin` should issue a non-sensitive session token or backend-verifiable token.
- Sensitive provider mutations should be checked server-side where Base44 allows it.
- Expired or inactive provider profiles must be rejected consistently.

Acceptance criteria:

- Inactive providers cannot view team portal data after status changes.
- Provider cannot change localStorage to impersonate another provider.
- Provider-only views never expose admin notes.

---

### 6. Base44 schema/RLS/function parity is not verified

Current state:

- GitHub contains frontend expectations and a schema verification panel.
- Live Base44 entities/functions may differ.

Required before launch:

- Verify every required entity exists with the fields currently used by GitHub.
- Verify provider permissions cannot read or mutate admin-only fields.
- Verify backend functions match `docs/backend-function-contracts.md`.

Acceptance criteria:

- Admin dashboard loads without schema errors.
- Provider dashboard loads without schema errors.
- Booking create, provider complete visit, admin checkout prepare, and cancel/archive all save and reload correctly.

## P1 launch-hardening items

### 1. Payment dashboard should use shared checkout math everywhere

A shared helper exists at `src/lib/checkoutMath.js`. The next safe patch is to wire it into:

- `AdminPaymentsOS.jsx`
- `BookingDrawer.jsx` checkout tab
- any future Invoice components

### 2. Checkout drawer should be split into smaller files

`BookingDrawer.jsx` is too large and risky to patch repeatedly. Before more checkout work, split it into:

- `BookingEditTab.jsx`
- `BookingCheckoutTab.jsx`
- `BookingQuoteTab.jsx`
- `BookingActionsTab.jsx`

This will make future fixes smaller, safer, and easier for Codex/Base44 to reason about.

### 3. GitHub CI is missing or not attached to commits

No GitHub Actions workflow runs or combined status checks were found for the latest audit commits.

Required:

- Add a build/typecheck workflow if the repo can build outside Base44.
- At minimum run `npm install` and `npm run build` locally or in a connected CI environment before launch.

## Current safe commits from audit

- Provider dashboard scoping/session/status fixes.
- Provider calendar/admin-only drag and status controls.
- Admin payment dashboard balance-due calculation hardening.
- Admin action patch hardening.
- Safe cancel action.
- Final checkout/backend payment contracts.
- Shared checkout balance math helper.
