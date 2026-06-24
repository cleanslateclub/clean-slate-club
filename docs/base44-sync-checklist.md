# Base44 Sync Checklist

This GitHub branch is the backend OS planning and code foundation. Before launch, the live Base44 app must be checked against this branch because Base44 may not automatically match GitHub.

## Entities that must exist in Base44

Critical:

- `Booking`
- `TimeBlock`
- `HouseholdProfile`
- `Provider`
- `AppSettings`
- `Invoice`
- `AuditLog`
- `MessageLog`
- `ProviderAvailability`
- `CampaignTemplate`
- `WaitlistRequest`

Existing related entities to verify:

- `Referral`
- Any member/subscription entity currently used by the app
- Any upload/document entity currently used by the app

## Backend functions that must exist in Base44

See `docs/backend-function-contracts.md` for request/response details.

Critical launch path:

- `adminLogin`
- `verifyProviderLogin`
- `scheduleConsultSlot`
- `getStripePublishableKey`
- `createDepositPaymentIntent`
- `addBookingToCalendar`
- `sendClientSmsConfirmation`
- `notifyTeamNewBooking`
- `notifyScheduleChange`

## Public booking flow must be checked

- Booking enabled setting works.
- Service selection works.
- Changing service clears stale add-ons and selected time.
- Intake requires contact details.
- Address is checked against launch service towns.
- Outside-area request is blocked or routed to manual review/waitlist.
- Booking rules run before deposit payment.
- Deposit payment receives name, email, service, date, time, and amount.
- Booking creates with correct status and payment status.
- TimeBlock records are created.
- Admin email is sent.
- Guest email is sent.
- SMS does not send unless allowed by opt-in rules.
- Calendar sync failure does not break booking creation.

## Admin portal checks

- `/admin` opens login path.
- Admin login function exists.
- Admin can see bookings.
- Admin can see guest/household details.
- Admin can see service-area status.
- Admin can see payment/deposit status.
- Admin can see provider assignment fields.
- Admin can manually review outside-area or approval-required bookings.
- Admin can see provider compliance.
- Admin can save service menu settings.

## Provider portal checks

- `/team` opens provider login path.
- Provider login function exists.
- Provider cannot self-register publicly.
- Provider only sees provider-safe job details.
- Provider cannot see sensitive admin notes.
- Provider schedule changes notify admin.
- Provider cannot be assigned unless active and compliant, unless admin override is active.

## Do not merge PR #6 until

- Live Base44 schemas match the branch.
- Live Base44 functions match contracts.
- The public booking path works end-to-end.
- Deposit payment works in test mode.
- Admin/provider login works.
- Schedule notifications fail safely.
- Owner decisions are approved for cancellation, rescheduling, no-show, and outside-area handling.
