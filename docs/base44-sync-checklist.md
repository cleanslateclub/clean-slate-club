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

## GitHub stabilization status

These backend-path items now exist or have been hardened in GitHub and must be synced/verified in live Base44:

- `src/pages/BookNow.jsx` guards TimeBlock creation after Booking creation.
- `src/pages/StaffLogin.jsx` includes a home escape link for `/team` and portal misclicks.
- `getStripePublishableKey` validates Stripe env setup.
- `createDepositPaymentIntent` accepts the frontend `{ data: ... }` payload contract.
- `scheduleConsultSlot` uses 15-minute Monday consult slots from 10am to 12pm.
- `verifyProviderLogin` has been added.
- `notifyTeamNewBooking` resolves `bookingId` before emailing admin.
- `sendClientSmsConfirmation` resolves `bookingId` and sends only when `intake_answers.sms_opt_in === true`.

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
- If TimeBlock creation fails after Booking creation, the guest still sees success and admin sees a repair flag.
- Admin email is sent.
- Guest email is sent.
- SMS does not send unless allowed by opt-in rules.
- Calendar sync failure does not break booking creation.

## Admin portal checks

- `/admin` opens login path.
- Admin login function exists.
- Command Center loads instead of the legacy dashboard.
- Command overview cards load or show safe empty states.
- Admin can see bookings.
- Admin can see guest/household details.
- Admin can see service-area status.
- Admin can see payment/deposit status.
- Admin can open the read-only Payments workspace.
- Payments workspace can list `Invoice` records or show a safe empty state.
- Admin can see provider assignment fields.
- Admin can manually review outside-area or approval-required bookings.
- Booking Action Center queues load or show safe empty states.
- Booking action buttons save only the intended controlled status changes.
- Booking audit/history panel loads or shows a safe empty state.
- Schedule preview loads existing `TimeBlock` records or fails gracefully.
- Preview-only date/time inputs update candidate blocks and conflict warnings without saving.
- Admin can see provider compliance.
- Admin can save service menu settings.

## Provider portal checks

- `/team` opens provider login path.
- `/team` has a clear back/home escape if a public visitor misclicks.
- Provider login function exists.
- Provider cannot self-register publicly.
- Provider only sees provider-safe job details.
- Provider cannot see sensitive admin notes.
- Provider schedule changes notify admin.
- Provider cannot be assigned unless active and compliant, unless admin override is active.
- Provider Today's Jobs directions link appears when a service address exists.

## Negative checks

These should remain disabled until explicitly approved:

- Final checkout send automation.
- Cancellation fee collection.
- Reschedule fee collection.
- Refund automation.
- Provider auto-assignment.
- Schedule edit saves from the preview panel.
- Guest/provider schedule-change messages from preview-only actions.
- Legacy admin file removal.

## Do not merge PR #6 until

PR #6 has been merged. Keep this section as historical context. The equivalent current rule is: do not launch publicly until the following are verified in live Base44.

- Live Base44 schemas match the branch.
- Live Base44 functions match contracts.
- The public booking path works end-to-end.
- Deposit payment works in test mode.
- Admin/provider login works.
- Schedule notifications fail safely.
- Owner decisions are approved for cancellation, rescheduling, no-show, and outside-area handling.
