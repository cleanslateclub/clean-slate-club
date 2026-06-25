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
- Read-only booking audit/history panel
- Provider assignment recommendations
- Controlled provider assignment save action
- Preview-only schedule change tester with conflict detection

These actions are admin-triggered only. Automatic policy actions are still off. Schedule preview inputs do not save record changes.

### Messages

Messages workspace remains read-only for actual communication history.

Added:

- MessageLog list and detail view
- Sent, failed, queued, and all-message filters
- Search by subject, template, recipient, status, channel, or preview
- Preview-only message draft composer
- Token replacement preview for guest name, service label, and balance due

Message sending is still intentionally locked. The draft preview does not send email/SMS, create MessageLog records, or check opt-in status yet.

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

### Launch guards

A read-only Launch Guards view is now wired into the Settings workspace.

It keeps these launch blockers visible inside the admin portal:

- Base44 schema verification
- Backend function contract verification
- Payment automation lock
- Schedule save lock
- Message sending lock
- Provider auto-assignment lock
- Legacy admin removal lock
- Owner policy approval requirements

## Must verify before merge

1. `/admin` login still opens the Command Center.
2. Command overview loads without crashing.
3. Bookings tab loads or fails gracefully.
4. Actions tab loads or fails gracefully.
5. Action queue filters work.
6. Admin booking action buttons save correctly in Base44.
7. Booking audit/history panel loads or shows empty state.
8. Provider assignment recommendations load.
9. Controlled provider assignment saves correctly in Base44.
10. Schedule preview loads existing blocks or fails gracefully.
11. Preview-only date/time inputs update conflict preview without saving.
12. Calendar tab loads or fails gracefully.
13. Households tab loads or fails gracefully.
14. Providers tab loads or fails gracefully.
15. Messages tab loads or fails gracefully.
16. Message draft preview updates copy without sending.
17. Settings tab loads or fails gracefully.
18. Launch Guards view loads inside Settings.
19. Services tab loads or fails gracefully.
20. Reports tab loads or fails gracefully.
21. Payments tab loads or fails gracefully.
22. Team/provider login still opens the provider dashboard.
23. Provider Today's Jobs shows directions when an address exists.
24. Google Maps links open in a new tab.

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
- Schedule edit saves.
- Guest/provider schedule-change messages.
- Admin message sending.
- Removing legacy admin files.

## Safe next code chunks

1. Add final checkout preview only, not send actions.
2. Add launch-readiness completion toggles only after live Base44 smoke testing begins.
3. Add schedule edit saves only after Base44 TimeBlock behavior is verified.
4. Add admin message-send actions only after notification contracts are confirmed.

## Owner approval required before launch

- Final cancellation policy.
- Final reschedule policy.
- No-show policy.
- Whether members get 3 free reschedules exactly as drafted.
- Whether non-members pay a $25 reschedule fee exactly as drafted.
- Whether Stripe final checkout is manually sent or automatically triggered.
