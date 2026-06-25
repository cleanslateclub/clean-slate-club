# Owner Decisions Before Launch

These are the few decisions Dawn needs to approve before the backend rules are allowed to act automatically.

The app can keep being built before these are finalized, but these should not be hidden inside code without owner approval.

## 1. Cancellation policy

Current safe default in code:

- Cancellation window: 48 hours
- On-time cancellation: deposit may be refunded automatically
- Late cancellation: deposit may be retained

Owner decision needed:

- Keep 48 hours or change to 24 hours?
- Should the $50 deposit always be refundable before the window?
- Should repeat late cancellations get flagged on the household profile?

Recommended launch policy:

- More than 48 hours before visit: deposit refundable or transferable.
- Less than 48 hours before visit: deposit retained.
- Same-day cancellation or no-show: deposit retained and future bookings may require admin approval.

## 2. Reschedule policy

Current safe default in code:

- Reschedule window: 48 hours
- Nonmember reschedule fee: $25
- Members get 3 free reschedules

Owner decision needed:

- Should members get 3 free reschedules per month, per year, or lifetime?
- Should the $25 nonmember fee apply inside the 48-hour window only, or every reschedule?

Recommended launch policy:

- More than 48 hours before visit: one free reschedule for everyone.
- Less than 48 hours before visit: $25 nonmember fee.
- Members receive 3 late-window reschedule waivers per year while active.

## 3. No-show policy

Owner decision needed:

- What counts as a no-show?
- How long should a provider wait?
- Should no-shows require admin approval for future bookings?

Recommended launch policy:

- Provider waits 15 minutes after scheduled arrival.
- If there is no access and no response, mark as no-show.
- Deposit is retained.
- Household profile gets a private admin flag.
- Next booking requires admin approval.

## 4. Shopping funds policy

Already confirmed direction:

- Providers never use personal funds.
- Shopping funds are separate from service payment.
- Guest provides Zelle/cash/payment method before shopping.

Owner decision needed:

- Should shopping-related bookings require admin approval until the process is proven?

Recommended launch policy:

- Shopping add-ons are allowed, but the booking confirmation should clearly say the guest must provide funds before the run starts.
- If funds are not available, the provider does not shop and the service time is not refunded.

## 5. Provider assignment policy

Already confirmed direction:

- No public provider signup at launch.
- Admin creates provider profiles.
- Provider must be active and compliant before assignment unless admin override exists.

Owner decision needed:

- Should guests be able to request a preferred provider at launch, or should that stay admin-only?

Recommended launch policy:

- Guests can request a provider later.
- At launch, admin assigns based on availability, service permission, compliance readiness, and location.

## 6. Membership reschedule benefit

Confirmed membership price:

- $49/month

Owner decision needed:

- Should reschedule benefits reset monthly, annually, or per membership lifetime?

Recommended launch policy:

- 3 late-window reschedule waivers per calendar year for active members.

## 7. Outside service area workflow

Current direction:

- Only the confirmed service towns should be client-facing at launch.

Owner decision needed:

- Should outside-area guests be blocked, waitlisted, or sent to consult?

Recommended launch policy:

- Do not auto-book outside-area requests.
- Send them to consult/waitlist/manual review.

## 8. Emergency or same-day requests

Already confirmed direction:

- Emergency same-day is not public-facing.
- Providers may pick up internal requests manually.

Owner decision needed:

- Should admin be able to create same-day manual bookings?

Recommended launch policy:

- Yes, admin-only same-day manual bookings are allowed.
- Public booking still requires 24-hour lead time.

## Current decision status

Build can continue with safe defaults.

Do not launch automated cancellation, reschedule, no-show, or fee charging until the final owner decisions above are approved.
