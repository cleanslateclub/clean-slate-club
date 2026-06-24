# Vagaro-Style Gap Punch List

This is the practical gap list between the current Backend OS branch and a true Vagaro-style operating system.

## Current strongest areas

### Admin Command Center

The new admin shell exists and is replacing the old dashboard direction.

Started tabs:

- Command
- Bookings
- Actions
- Calendar
- Households
- Providers
- Services
- Reports
- Payments placeholder
- Messages
- Settings

### Booking operations

Started:

- Booking queues
- Booking detail views
- Controlled approve action
- Controlled hold-for-review action
- Controlled complete action
- Controlled archive action
- Provider recommendations
- Controlled provider assignment
- Schedule preview

Still needed:

- Full schedule edit/save flow
- Booking action history wired into the Action Center
- Confirm all Booking update permissions in Base44 preview

### Households

Started:

- Household records
- Household detail view
- Membership/service area visibility
- Provider-safe notes
- Parking notes
- Address and Google Maps directions

Still needed:

- Edit household details
- Booking history timeline
- Payment history timeline
- Referral/membership activity

### Providers

Started:

- Provider records
- Provider dashboard
- Provider assignment recommendations
- Controlled assignment save
- Provider job directions

Still needed:

- Provider compliance editing
- Provider availability editing
- Provider assignment notification
- Provider document upload flow

### Calendar

Started:

- TimeBlock records
- Calendar workspace
- Schedule preview
- Conflict preview

Still needed:

- Create schedule blocks from booking
- Edit schedule blocks
- Reschedule confirmation flow
- Admin/provider schedule-change notification

### Reports

Started:

- Total bookings
- Active bookings
- Needs-review count
- Unassigned count
- Estimated revenue
- Service mix
- Provider load
- Payment status

Still needed:

- Date range filters
- CSV export
- Membership reporting
- Cancellation/reschedule/no-show reporting
- Provider reliability reporting

## Biggest remaining Vagaro-style gaps

### 1. Payments and checkout

Current status: partial.

Still needed:

- Wire Payments workspace into Command Center if the connector allows it
- Final checkout creation
- Deposit application
- Manual line item adjustments
- Tip tracking
- Refund status tracking
- Stripe webhook verification

### 2. Live communications

Current status: communication history only.

Still needed:

- Draft-only communication composer
- Send confirmation screen
- Email function verification
- SMS opt-in verification
- Failed-send behavior testing
- Template review

### 3. Base44 live verification

Current status: unknown until tested in Base44 preview.

Must verify:

- Schemas match this branch
- Backend functions match documented contracts
- Admin login works
- Provider login works
- Booking flow still reaches deposit checkout
- New admin tabs load without crashing
- Controlled actions save as expected

## Suggested build order from here

1. Base44 preview smoke test.
2. Confirm Action Center saves booking actions.
3. Confirm controlled provider assignment saves correctly.
4. Wire schedule creation after assignment.
5. Add final checkout actions.
6. Add draft-only message composer.
7. Add reports filters/export.
8. Only then consider removing Draft status.

## Do not do yet

- Do not merge to `main` until Base44 preview is verified.
- Do not remove legacy admin files permanently.
- Do not enable automatic payment collection beyond intended deposit behavior.
- Do not enable cancellation, no-show, or reschedule fees until Dawn approves final policy.
- Do not enable provider auto-assignment.
- Do not enable live SMS until opt-ins are verified.
