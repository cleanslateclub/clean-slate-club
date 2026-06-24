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
- Calendar
- Households
- Providers
- Messages
- Settings
- Services

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

A read-only Payments workspace component exists.

Not yet wired into the Command Center because that specific portal update was blocked by the connector filter.

## Must verify before merge

1. `/admin` login still opens the Command Center.
2. Command overview loads without crashing.
3. Bookings tab loads or fails gracefully.
4. Calendar tab loads or fails gracefully.
5. Households tab loads or fails gracefully.
6. Providers tab loads or fails gracefully.
7. Messages tab loads or fails gracefully.
8. Settings tab loads or fails gracefully.
9. Services tab loads or fails gracefully.
10. Team/provider login still opens the provider dashboard.
11. Provider Today's Jobs shows directions when an address exists.
12. Google Maps links open in a new tab.

## Must verify in Base44

1. `Booking` schema is present.
2. `HouseholdProfile` schema is present.
3. `Provider` schema is present.
4. `TimeBlock` schema is present.
5. `MessageLog` schema is present.
6. `Invoice` schema is present.
7. `AppSettings` schema is present.
8. `service_menu_v1` can save and reload.
9. Backend functions match `docs/backend-function-contracts.md`.

## Do not enable yet

- Automatic payment collection beyond the existing deposit setup.
- Cancellation fee automation.
- Reschedule fee automation.
- Provider auto-assignment.
- Removing legacy admin files.

## Safe next code chunks

1. Wire Payments into the Command Center if the connector allows it later.
2. Add read-only booking action history.
3. Add provider assignment preview only.
4. Add schedule edit preview only.
5. Add Base44 sync verification notes after live testing.

## Owner approval required before launch

- Final cancellation policy.
- Final reschedule policy.
- No-show policy.
- Whether members get 3 free reschedules exactly as drafted.
- Whether non-members pay a $25 reschedule fee exactly as drafted.
- Whether Stripe final checkout is manually sent or automatically triggered.
