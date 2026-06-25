# Clean Slate Club Vagaro-Style Backend OS Roadmap

This roadmap uses Vagaro-style functionality as the guide, but adapts it for Clean Slate Club's in-home support model instead of salon/spa appointments.

## Product principle

Clean Slate Club needs a business operating system, not just a booking form.

The system should let admin see what is happening, make changes safely, collect money, assign providers, protect guests, protect providers, and keep records clean enough to run the business without memory or sticky notes.

## Core operating modules

### 1. Command Center

Purpose: Daily owner dashboard.

Must show:

- Today's visits
- Upcoming visits
- Pending bookings
- Bookings needing admin approval
- Unassigned bookings
- Payment/deposit issues
- Provider compliance warnings
- Schedule changes
- Recent messages/notifications
- Quick actions

Clean Slate adaptation:

- Show household/service-area context, not salon chair context.
- Prioritize provider readiness and travel feasibility.
- Show whether a booking has supply/funding issues.

---

### 2. Calendar & Scheduling

Purpose: Vagaro-style calendar control for service blocks.

Must support:

- Day/week/month views
- Provider filters
- Booking blocks
- Travel buffers
- Prep/wrap blocks
- Manual holds
- Provider unavailable blocks
- Holiday blackout blocks
- Waitlist holds
- Drag/drop or edit with confirmation
- Schedule-change notifications
- Schedule-change audit logs

Clean Slate adaptation:

- Travel buffer is required by default.
- Provider availability and service area matter more than chair availability.
- Admin should receive every schedule-change alert.
- Providers should receive updates when assigned jobs change.

---

### 3. Guests & Households

Purpose: Customer records.

Must support:

- Guest profile
- Household/service address
- Saved addresses
- Service area status
- Access notes
- Parking notes
- Supply notes
- Pet notes
- Child/senior notes
- Emergency contact
- Provider-safe notes
- Private admin notes
- Preferred provider
- Communication opt-ins
- Booking history
- Payment history
- Referral credits
- Membership status

Clean Slate adaptation:

- Say guest/household, not client.
- Household profile should carry context forward so every booking is easier.
- Sensitive admin notes must not be visible to providers.

---

### 4. Booking Rules

Purpose: Prevent bad bookings before they happen.

Confirmed Clean Slate rules:

- Public hours: 10am–6pm
- Minimum lead time: 24 hours
- No client-facing Sundays
- Minimum booking: 2 hours
- Maximum suggested booking: 8 hours
- One package per visit
- Travel buffer: 20 minutes
- Free consult: 15 minutes, Mondays 10am–12pm only
- Blackout holidays: Jan 1, Thanksgiving Day, Dec 25
- Premium holidays: Easter weekend, Memorial Day weekend, July 4, Labor Day, Dec 24, Dec 31
- $50 service deposit
- Membership: $49/month

Still needs final policy lock:

- Cancellation window
- Reschedule window
- No-show treatment
- Deposit retention/refund treatment
- Member vs nonmember reschedule fee logic

---

### 5. Services, Add-ons & Estimator

Purpose: One source of truth for service menu, price, time, permissions, and checkout.

Must support:

- Editable package labels
- Base price
- Base duration
- Minimum duration
- Add-on price
- Add-on duration
- Focus items
- Service approval flags
- Provider permission requirements
- Online visibility
- Estimate preview
- Booking integration
- Final checkout integration

Clean Slate adaptation:

- Only one package per visit.
- Guest can pick focus items and add-ons.
- Admin can adjust final amount after actual visit scope.
- Service menu changes should persist through `AppSettings` key `service_menu_v1`.

---

### 6. Provider OS

Purpose: Provider onboarding, compliance, schedule visibility, and job readiness.

Must support:

- Admin-created provider profile
- Invite-only provider access
- Provider login
- Provider status
- Provider service permissions
- Provider access level
- Compliance checklist
- Expiration dates
- Internal notes
- Manual compliance override with reason and expiration
- Provider-safe assigned job view
- Provider payouts
- Provider schedule updates

Clean Slate adaptation:

- No public provider signup at launch.
- Provider document uploads are not wired yet.
- Admin should control provider activation.
- Provider cannot be considered assignable until active and compliant, unless an admin override is active.

---

### 7. Checkout, Invoices & Payments

Purpose: Deposit, final balance, refunds, fees, and payment status.

Must support:

- $50 service deposit
- Final checkout line items
- Deposit applied to final balance
- Manual add/remove line items
- Discount/credit support
- Tip tracking
- Payment status
- Invoice status
- Refund status
- Payment/refund audit trail
- Checkout link sent timestamp

Clean Slate adaptation:

- Stripe is the payment source of truth.
- Providers should not handle card data.
- Store purchases are funded separately by guest, not provider funds.
- Zelle/cash may be used for shopping funds, not as the main service checkout path.

---

### 8. Communications

Purpose: Email/SMS lifecycle.

Must support:

- Booking request received
- Booking confirmed
- Consult booked
- Provider assigned
- Schedule changed
- Visit reminders
- Checkout link sent
- Payment received
- Cancellation confirmation
- Reschedule confirmation
- Provider alerts
- Admin alerts
- Communication log

Clean Slate adaptation:

- Admin gets email/SMS-style operational alerts with clickable phone/address where possible.
- SMS must respect opt-in.
- Failed notifications must not crash booking or provider workflows.

---

### 9. Memberships

Purpose: $49/month member layer.

Must support:

- Active/inactive/past-due/cancelled status
- Stripe subscription connection
- Priority booking
- Preferred windows
- Reduced hourly rates
- Member-only availability logic
- Reschedule benefits
- Membership cancellation
- Membership receipt email

Clean Slate adaptation:

- One membership tier only.
- Member benefits should be operationally useful, not fluffy.

---

### 10. Reports

Purpose: Owner visibility.

Must support:

- Revenue
- Bookings
- Cancellations
- Reschedules
- No-shows
- Membership value
- Provider payouts
- Provider reliability
- Service popularity
- Discount/referral usage
- Export CSV

Clean Slate adaptation:

- Reports should help decide staffing, scheduling, provider pay, and service menu adjustments.

## Current backend stabilization direction

Already strengthened in this branch:

- Booking entity expanded for operational states, deposits, approvals, reschedules, refunds, provider assignment, and audit history.
- TimeBlock entity expanded for operations calendar blocks.
- HouseholdProfile expanded for guest/household records.
- Provider schema expanded for compliance OS fields.
- AppSettings schema expanded for saved service menu settings.
- Invoice entity added for final checkout tracking.
- AuditLog entity added for traceability.
- Payment step stabilized to accept full booking data.
- Backend function contracts documented.

## Do not launch until

- Base44 live source has matching schemas.
- Required backend functions exist and match documented contracts.
- Admin login works.
- Provider login works.
- Booking request creates Booking + TimeBlock records.
- Deposit checkout works.
- Final checkout can be sent and tracked.
- Provider assignment works.
- Provider compliance saves and reloads.
- Schedule changes notify admin/provider safely.
- Cancellation/reschedule/no-show rules are finalized and wired.
- Admin has enough dashboard visibility to run the day without checking raw records.
