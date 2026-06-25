# Admin Replacement Strategy

The goal is not to put a new visual layer on top of the old dashboard.

The goal is to replace the defunct admin experience with a cleaner Clean Slate Club Command Center and then retire the old pieces once the new workflow is stable.

## Current state

`/admin` currently loads `AdminPortal`, which checks local admin session state and then renders `AdminDashboard`.

`AdminDashboard` is a large legacy-style dashboard that mixes many concerns:

- Overview
- Calendar
- Bookings
- Guests
- Clients
- Providers
- Revenue
- Payouts
- Incidents
- Settings
- Quick booking
- Quick actions
- Provider calendar pieces
- Complete visit wizard pieces

This is functional as a fallback, but it is not the desired final operating system.

## New direction

The new admin experience should be a true Command Center, not a patched version of the old dashboard.

Temporary staging route:

- `/admin-os`

Final intended route:

- `/admin`

The `/admin-os` route exists so new work can be built and checked without breaking the current admin fallback during development.

## Replacement plan

### Phase 1: Build new Command Center in isolation

Status: in progress.

- Build command center helpers.
- Build command center preview UI.
- Keep it in `/admin-os` while incomplete.
- Do not remove working fallback until new path can support daily operations.

### Phase 2: Move required workflows into the new Command Center

Required before replacing `/admin`:

- Today / upcoming view
- Needs review queue
- Unassigned booking queue
- Booking detail drawer/page
- Provider assignment workflow
- Schedule preview / conflict handling
- Guest household profile view
- Payment/deposit/final checkout view
- Provider compliance view
- Settings/service menu access
- Basic reports summary

### Phase 3: Make `/admin` load the new Command Center

When the new Command Center is operational:

- Keep `AdminPortal` as the login/session wrapper.
- Change `AdminPortal` to render the new Command Center instead of legacy `AdminDashboard`.
- Keep old dashboard available temporarily at a private fallback route only if needed.

### Phase 4: Retire defunct pieces

After the new Command Center is confirmed:

- Remove legacy tabs that no longer match the business model.
- Remove duplicate client/guest concepts.
- Remove old reports/payouts views if replaced.
- Remove old quick actions if replaced.
- Remove old calendar wiring if replaced.
- Remove any unused provider/admin login routes.

## Do not preserve these just because they exist

These need audit before launch:

- `ClientsTab` versus `GuestsTab`
- Old `ReportsTab` versus new operations summaries
- Old `PayoutsTab` versus future provider payout workflow
- Old `IncidentsTab` versus future internal review workflow
- Old `QuickActions` versus new admin booking actions
- Old `QuickBookingModal` versus future admin manual booking workflow
- Old `ProviderCalendar` inside admin dashboard
- Old `CompleteVisitWizard` inside admin dashboard
- `AdminLogin`, `ProviderLogin`, and `StaffLogin` route overlap

## Owner-facing answer

This is not lipstick on a pig.

The old dashboard is currently being used as a safety fallback while the replacement Command Center is built in parallel. Once the new Command Center has the required workflows, `/admin` should be switched to it and the defunct dashboard pieces should be deleted or archived.
