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

The public booking page creates the `Booking` record first, then attempts operational side effects such as `TimeBlock` creation, email, calendar sync, SMS, and team notifications.

This is mostly the correct order because the booking record is the source of truth, but TimeBlock creation currently runs inside the same main submit try/catch. If `TimeBlock.bulkCreate` fails after a Stripe deposit succeeds, the guest can be shown the generic booking failure even though a paid booking record may already exist.

That creates a dangerous launch-state problem:

- guest may pay deposit
- Booking may exist
- TimeBlock may fail
- guest may see failure message
- admin may not know the booking needs schedule repair

## Stabilization direction

Post-booking operational side effects should be handled as guarded follow-up actions:

- Booking creation remains blocking.
- Payment confirmation remains blocking before booking submission.
- TimeBlock creation should be attempted immediately, but failure should not erase the guest success state after payment.
- Calendar sync should remain non-blocking.
- Email/SMS/admin notifications should remain non-blocking where possible.
- Any operational follow-up failure should be logged clearly and surfaced to admin for repair.

## Next implementation target

Create a small helper pattern in `BookNow.jsx` for guarded post-booking tasks, beginning with TimeBlock creation. Then continue with a live Base44 verification checklist pass.

## Do not unlock yet

Keep these locked until owner policy and live Base44 behavior are verified:

- Final checkout send automation
- Cancellation fee collection
- Reschedule fee collection
- Refund automation
- Provider auto-assignment
- Schedule edit saves
- Guest/provider message sending from preview actions
- Legacy admin removal
