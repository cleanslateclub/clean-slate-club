# Pre-Merge Handoff Checklist

This is the practical checklist before this branch should be merged or treated as ready for Base44 sync.

## Current branch

- PR: `#6 Backend OS foundation and dynamic service menu`
- Branch: `backend-os-foundation`
- Status: Draft
- Current checkpoint: `checkpoint/backend-os-households-maps-2026-06-23`

## What is now meaningfully built

### Admin Command Center

`/admin` now points to the new Command Center shell on this branch.

Started sections:

- Command overview
- Bookings
- Booking Action Center
- Calendar
- Households
- Providers
- Messages
- Settings
- Services
- Reports
- Payments

### Booking actions

A separate Booking Action Center now exists because the connector blocked direct edits to the existing Bookings detail panel.

Added:

- Needs Review action queue
- Unassigned action queue
- Upcoming action queue
- All Active action queue
- Controlled approve action
- Controlled hold-for-review action
- Controlled mark-complete action
- Controlled archive action
- Provider assignment recommendations
- Controlled provider assignment save action

These actions are admin-triggered only. Automatic policy actions are still off.

### Households and directions

Households are now important and active, not deferred.

Added:

- Household list
- Household detail view
- Address display
- Google Maps directions link
- Booking detail directions link
- Provider daily job directions link
- Provider-safe directions URL helper

### Payments

A read-only Payments workspace is now wired into the Command Center.

Added:

- Invoice/payment record list
- Draft, sent, paid, and needs-review filters
- Search by guest, email, service, status, or notes
- Read-only invoice detail view with subtotal, deposit, discount, tip, total, paid amount, and balance due

Payment automation is still intentionally off. Do not enable final checkout sends, cancellation fee collection, reschedule fee collection, refunds, or provider-facing payment tools until Stripe behavior and owner policies are confirmed.

## Must verify before merge

1. `/admin` login still opens the Command Center.
2. Command overview loads without crashing.
3. Bookings tab loads or fails gracefully.
4. Actions tab loads or fails gracefully.
5. Action queue filters work.
6. Admin booking action buttons save correctly in Base44.
7. Provider assignment recommendations load.
8. Controlled provider assignment saves correctly in Base44.
9. Calendar tab loads or fails gracefully.
10. Households tab loads or fails gracefully.
11. Providers tab loads or fails gracefully.
12. Messages tab loads or fails gracefully.
13. Settings tab loads or fails gracefully.
14. Services tab loads or fails gracefully.
15. Reports tab loads or fails gracefully.
16. Payments tab loads or fails gracefully.
17. Team/provider login still opens the provider dashboard.
18. Provider Today's Jobs shows directions when an address exists.
19. Google Maps links open in a new tab.

## Must verify in Base44

1. `Booking` schema is present.
2. `HouseholdProfile` schema is present.
3. `Provider` schema is present.
4. `ProviderAvailability` schema is present.
5. `TimeBlock` schema is present.
6. `MessageLog` schema is present.
7. `Invoice` schema is present.
8. `AppSettings` schema is present.
9. `service_menu_v1` can save and reload.
10. Backend functions match `docs/backend-function-contracts.md`.

## Do not enable yet

- Automatic payment collection beyond the existing deposit setup.
- Final checkout send automation.
- Cancellation fee automation.
- Reschedule fee automation.
- Refund automation.
- Provider auto-assignment.
- Removing legacy admin files.

## Safe next code chunks

1. Add read-only booking action history.
2. Add schedule edit preview only.
3. Add Base44 sync verification notes after live testing.
4. Add admin message-send actions only after notification contracts are confirmed.
5. Add final checkout actions only after Stripe checkout behavior and owner policies are confirmed.

## Owner approval required before launch

- Final cancellation policy.
- Final reschedule policy.
- No-show policy.
- Whether members get 3 free reschedules exactly as drafted.
- Whether non-members pay a $25 reschedule fee exactly as drafted.
- Whether Stripe final checkout is manually sent or automatically triggered.
