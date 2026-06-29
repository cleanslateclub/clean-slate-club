# Clean Slate Club Backend Function Contracts

Branch: `backend-os-foundation`

This file lists the Base44 backend functions the frontend currently expects. The GitHub repo is not automatically the live Base44 source, so these contracts should be checked against the Base44 function layer before launch.

## Launch-critical functions

### `adminLogin`

Used by: `src/pages/StaffLogin.jsx`

Purpose: Admin portal login for `/admin`.

Expected request:

```json
{
  "data": {
    "username": "admin username",
    "password": "admin password"
  }
}
```

Expected success response:

```json
{
  "success": true,
  "token": "session token string"
}
```

Expected failure response:

```json
{
  "success": false,
  "error": "Invalid credentials."
}
```

Notes:

- The frontend retries once if the response says `Missing credentials.` because earlier Deno cold starts sometimes dropped the first body.
- Do not expose admin credentials or password hashes to the frontend.

---

### `verifyProviderLogin`

Used by: `src/pages/StaffLogin.jsx`

Purpose: Provider/team portal login for `/team`.

Expected request:

```json
{
  "data": {
    "username": "provider username",
    "password": "provider password"
  }
}
```

Expected success response:

```json
{
  "success": true,
  "providerId": "Provider record id",
  "providerEmail": "provider@example.com"
}
```

Expected failure response:

```json
{
  "success": false,
  "error": "Invalid username or password."
}
```

Rules:

- Provider signup is not public.
- Admin creates and approves provider profiles first.
- The provider should not receive access unless their profile exists and is allowed into the team portal.

---

### `scheduleConsultSlot`

Used by: `src/pages/BookNow.jsx`

Purpose: Auto-assign a free consult slot.

Expected request:

```json
{}
```

Expected success response:

```json
{
  "success": true,
  "date": "YYYY-MM-DD",
  "time": "HH:mm"
}
```

Expected failure response:

```json
{
  "success": false,
  "error": "No consult slots available."
}
```

Rules:

- Consults are free 15-minute calls.
- Consult availability should follow the confirmed launch rule: Mondays 10:00–12:00 only.

---

### `getStripePublishableKey`

Used by: `src/components/booking/Step6Payment.jsx`

Purpose: Return the Stripe publishable key for frontend Elements.

Expected request:

```json
{}
```

Expected success response:

```json
{
  "publishableKey": "pk_..."
}
```

Rules:

- Never return the Stripe secret key.

---

### `createDepositPaymentIntent`

Used by: `src/components/booking/Step6Payment.jsx`

Purpose: Create the $50 service deposit PaymentIntent.

Expected request:

```json
{
  "data": {
    "amount": 50,
    "clientName": "Guest Name",
    "clientEmail": "guest@example.com",
    "serviceLabel": "Hot Mess Express",
    "bookingData": {
      "clientInfo": {},
      "serviceKey": "home_reset",
      "selectedDate": "YYYY-MM-DD",
      "selectedTime": "HH:mm",
      "totalDuration": 240
    }
  }
}
```

Expected success response:

```json
{
  "clientSecret": "pi_..._secret_..."
}
```

Rules:

- Deposit amount is currently $50 for service bookings only.
- Deposit is applied to the final balance.
- Stripe is the payment source of truth.
- Providers never collect service payments or see card data.

---

### `createFinalCheckoutSession`

Used by: future admin checkout flow from `src/components/admin/os/BookingDrawer.jsx` or replacement checkout component.

Purpose: Create a Stripe Checkout Session or Payment Link for the final post-service balance after admin review.

Expected request:

```json
{
  "data": {
    "bookingId": "Booking record id",
    "clientEmail": "guest@example.com",
    "clientName": "Guest Name",
    "lineItems": [
      {
        "description": "Hot Mess Express",
        "quantity": 1,
        "amount": 300
      }
    ],
    "subtotal": 300,
    "discountAmount": 0,
    "discountNote": "Optional admin note",
    "tipAmount": 0,
    "depositCredit": 50,
    "finalTotal": 300,
    "finalBalanceDue": 250,
    "checkoutNote": "Optional guest-facing note"
  }
}
```

Expected success response:

```json
{
  "success": true,
  "checkoutUrl": "https://checkout.stripe.com/...",
  "stripeCheckoutSessionId": "cs_..."
}
```

Expected failure response:

```json
{
  "success": false,
  "error": "Unable to create final checkout session."
}
```

Rules:

- Must reject missing `bookingId`.
- Must reject `finalBalanceDue <= 0`; zero-balance visits should be marked paid without creating a Stripe checkout.
- Must use cents server-side and never trust frontend math as the only source of truth.
- Must write Stripe session id, checkout url, final balance, and checkout timestamp back to the Booking record or a linked Invoice record.
- Must not charge automatically from the admin drawer without an explicit, verified payment flow.
- Must be idempotent by booking id/status so duplicate button clicks do not create duplicate active checkout sessions.

---

### `recordManualPayment`

Used by: future admin reconciliation tools.

Purpose: Let admin record cash/Zelle/other non-Stripe payments against a booking without pretending Stripe collected the money.

Expected request:

```json
{
  "data": {
    "bookingId": "Booking record id",
    "amount": 250,
    "method": "zelle",
    "reference": "Optional reference id or note",
    "recordedBy": "Admin",
    "recordedAt": "ISO timestamp"
  }
}
```

Expected success response:

```json
{
  "success": true,
  "paymentStatus": "paid",
  "finalBalanceDue": 0
}
```

Rules:

- Must append an audit/admin note.
- Must not create a Stripe transaction record.
- Must preserve the manual method and reference for reconciliation.
- Must reduce balance due but never below zero.

---

### `stripeWebhook`

Used by: Stripe webhook endpoint, not directly by frontend.

Purpose: Reconcile deposit and final checkout payment events from Stripe back into Base44 records.

Expected event types:

```json
[
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
  "checkout.session.completed",
  "charge.refunded",
  "charge.dispute.created"
]
```

Rules:

- Must verify the Stripe signature before parsing the event.
- Must use Stripe metadata to resolve the Booking or Invoice record.
- Must update deposit status and final payment status separately.
- Must store Stripe ids for reconciliation.
- Must be idempotent by Stripe event id.
- Must append admin/audit notes for succeeded, failed, refunded, and disputed events.
- Must not expose webhook secrets to the frontend.

---

### `addBookingToCalendar`

Used by: `src/pages/BookNow.jsx`

Purpose: Add confirmed booking or consult to Google Calendar.

Expected request:

```json
{
  "data": {
    "clientName": "Guest Name",
    "clientEmail": "guest@example.com",
    "clientPhone": "555-555-5555",
    "clientAddress": "Street, City PA ZIP",
    "serviceLabel": "Hot Mess Express",
    "addonLabels": [],
    "selectedDate": "YYYY-MM-DD",
    "startTime": "HH:mm",
    "endTime": "HH:mm",
    "totalDuration": 240,
    "estimateLow": 195,
    "estimateHigh": 300,
    "specialNotes": "",
    "tasks": [],
    "sendInviteToClient": true,
    "isConsult": false
  }
}
```

Expected response:

```json
{
  "success": true,
  "eventId": "calendar event id"
}
```

Rules:

- Calendar sync failures must be non-blocking for booking creation.

---

### `sendClientSmsConfirmation`

Used by: `src/pages/BookNow.jsx`

Purpose: Send guest SMS confirmation after booking or consult request.

Expected request:

```json
{
  "data": {
    "bookingId": "Booking record id"
  }
}
```

Expected response:

```json
{
  "success": true
}
```

Rules:

- Must respect SMS opt-in language stored in booking intake answers.
- SMS failure should be non-blocking.

---

### `notifyTeamNewBooking`

Used by: `src/pages/BookNow.jsx` and as schedule-notification fallback.

Purpose: Notify admin/team that a new booking or important booking-related schedule event happened.

Expected request:

```json
{
  "data": {
    "bookingId": "Booking record id",
    "eventType": "booking_created",
    "source": "public_booking",
    "note": "Optional context"
  }
}
```

Expected response:

```json
{
  "success": true
}
```

Rules:

- Admin should receive email for every booking request.
- Admin SMS/email details should include guest name, phone, map-friendly address, service/add-ons, date/time, and estimated revenue where possible.

---

### `notifyScheduleChange`

Used by: `src/lib/scheduleNotifications.js`

Purpose: Preferred backend function for admin/provider schedule-change notifications.

Expected request:

```json
{
  "data": {
    "eventType": "time_block_updated",
    "source": "provider",
    "actor": "Provider Name",
    "note": "Provider-side schedule block changed.",
    "updates": {},
    "booking": {},
    "timeBlock": {},
    "rules": {},
    "occurredAt": "ISO timestamp"
  }
}
```

Expected response:

```json
{
  "success": true
}
```

Rules:

- Provider schedule changes must notify admin every time.
- Assigned provider schedule changes should notify the provider by email/text when applicable.
- Failure must never crash provider-side calendar updates.

## Non-blocking or module-specific functions

The repo also references payment, invoice, membership, quick booking, and dashboard actions in existing admin/member components. These should be audited in the next stabilization pass, but the functions above are the first launch-critical booking/provider/admin foundation layer.

## Launch reminder

Do not treat this PR as launch-ready until:

- The Base44 live function layer matches these contracts.
- Booking creation works with deposit payment.
- Final checkout creates one reconciled Stripe session or records a verified manual payment.
- Stripe webhooks reconcile deposits, final balances, refunds, failures, and disputes idempotently.
- Consults schedule only inside the confirmed consult window.
- Admin and provider portal login work on mobile and desktop.
- Provider compliance saves and reloads without schema errors.
- Schedule notifications fail safely and never block booking/provider workflows.
