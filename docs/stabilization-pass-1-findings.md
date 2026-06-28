# Backend Stabilization Pass 1 Findings

Date: 2026-06-28

## Scope

This pass focuses on the launch-critical public booking path and the backend OS safety gates. The goal is not to add new product features. The goal is to make sure a guest can book safely and the owner/admin has enough backend reliability to operate without guessing.

## Confirmed repo state

The repo already contains launch-gate documentation for:

- Base44 live schema verification
- Required backend function contracts
- Backend OS QA checklist
- Admin Command Center replacement strategy
- Launch guards for locked workflow areas

## Launch-critical backend functions to verify in live Base44

These must exist in Base44 and match the documented request/response contracts before launch testing is treated as meaningful:

- `adminLogin`
- `verifyProviderLogin`
- `scheduleConsultSlot`
- `getStripePublishableKey`
- `createDepositPaymentIntent`
- `addBookingToCalendar`
- `sendClientSmsConfirmation`
- `notifyTeamNewBooking`
- `notifyScheduleChange`

## First stabilization concern found

The public booking page created the `Booking` record first, then attempted operational side effects such as `TimeBlock` creation, email, calendar sync, SMS, and team notifications.

This is mostly the correct order because the booking record is the source of truth, but `TimeBlock.bulkCreate` was previously inside the same main submit try/catch. If `TimeBlock.bulkCreate` failed after a Stripe deposit succeeded, the guest could be shown the generic booking failure even though a paid booking record may already exist.

That created a dangerous launch-state problem:

- guest may pay deposit
- Booking may exist
- TimeBlock may fail
- guest may see failure message
- admin may not know the booking needs schedule repair

## Stabilization completed

`src/pages/BookNow.jsx` now treats Booking creation as the source-of-truth blocking step, then attempts TimeBlock creation as a guarded operational side effect.

If TimeBlock creation fails after the Booking exists:

- the failure is logged clearly
- the Booking is flagged with `backend_repair_needed: true`
- the Booking gets `backend_repair_reason: 'timeblock_creation_failed'`
- admin notes are appended with a repair warning
- team/admin notification is triggered with repair context
- the guest can still move to the success screen because the Booking exists

Additional backend function hardening completed in this pass:

- `/team` and portal home escape link added in `src/pages/StaffLogin.jsx`
- `getStripePublishableKey` validates Stripe env setup
- `createDepositPaymentIntent` accepts the frontend `{ data: ... }` payload contract
- `scheduleConsultSlot` uses 15-minute Monday slots from 10am to 12pm
- `verifyProviderLogin` backend function added
- `notifyTeamNewBooking` resolves `bookingId` before emailing admin
- `sendClientSmsConfirmation` resolves `bookingId` and enforces `intake_answers.sms_opt_in === true`

## Next verification target

Run a Base44 smoke test for the public booking path:

1. Booking enabled setting works.
2. Guest can complete service, intake, add-ons, schedule, policy acknowledgements, and deposit.
3. Stripe PaymentIntent succeeds in test mode.
4. Booking record is created with deposit/payment fields.
5. TimeBlock records are created.
6. If TimeBlock fails, Booking remains successful and admin sees repair flag.
7. Admin email sends.
8. Guest email sends.
9. SMS sends only with opt-in.
10. Calendar sync failure does not block booking success.

## Do not unlock yet

Keep these locked until owner policy and live Base44 behavior are verified:

- Final checkout links or sends
- Cancellation fee collection
- Reschedule fee collection
- Refund automation
- Provider auto-assignment
- Schedule edit saves
- Guest/provider message sending from preview actions
- Legacy admin removal
