# Base44 Live Test Script

Use this after syncing/importing the `backend-os-foundation` branch into Base44 preview.

## Before testing

Confirm the app is using the expected branch/source.

Do not test against the public live site unless you intentionally deployed this branch.

## Admin login

1. Open `/admin`.
2. Confirm admin login appears if no admin session exists.
3. Log in with the admin credentials.
4. Confirm the new Command Center loads.
5. Confirm the old legacy dashboard is not the default admin landing page.

## Command Center tabs

Test each tab without making changes first.

### Command

- Confirm dashboard cards load.
- Confirm empty states do not crash.

### Bookings

- Open Bookings.
- Confirm queue cards appear.
- Click a booking.
- Confirm booking detail appears.
- Confirm service address appears when saved.
- Confirm Google Maps directions opens in a new tab when address exists.

### Calendar

- Open Calendar.
- Confirm upcoming blocks load or empty state appears.
- Click a block.
- Confirm detail panel appears.
- Do not test drag/reschedule as launch-ready until schedule actions are confirmed.

### Households

- Open Households.
- Confirm household list loads or empty state appears.
- Search by name, email, phone, or address.
- Click a household.
- Confirm detail view appears.
- Confirm Google Maps directions opens in a new tab when address exists.

### Providers

- Open Providers.
- Confirm provider list loads or empty state appears.
- Search by name or email.
- Click a provider.
- Confirm detail panel appears.

### Messages

- Open Messages.
- Confirm message records load or empty state appears.
- Filter by status.
- Click a record.
- Confirm detail panel appears.

### Settings

- Open Settings.
- Confirm booking rules are visible.
- Confirm saved settings load if present.
- Confirm feature flag view does not crash.

### Services

- Open Services.
- Confirm service menu loads.
- Do not publish service edits until Base44 save/reload is confirmed.

### Payments

- Payments component exists in the codebase but is not wired into the Command Center because the connector blocked that update.

## Team/provider login

1. Open `/team`.
2. Confirm provider login appears if no provider session exists.
3. Log in as a provider.
4. Confirm provider dashboard loads.
5. Confirm Today's Jobs appears when a provider has a visit today.
6. Confirm Directions link appears when the booking has an address.
7. Confirm Directions opens Google Maps in a new tab.

## Public booking smoke test

1. Open `/book`.
2. Choose a service.
3. Confirm add-ons still load.
4. Confirm pricing/estimate still advances.
5. Stop before real payment unless testing in a safe environment.

## Stop testing if

- `/admin` does not load.
- Any workspace crashes the page.
- Base44 schema fields are missing.
- Service menu save/reload fails.
- Booking flow cannot reach the payment step.
- Team/provider login fails.

## Do not launch until

- The above smoke test passes.
- Base44 schemas are confirmed.
- Backend functions match contracts.
- Stripe checkout behavior is verified in the intended mode.
- Owner policy decisions are final.
