# Legacy Admin Audit

This audit tracks old admin pieces that should not be preserved by default.

## Current replacement status

`/admin` now renders `AdminCommandCenter` through `AdminPortal` on the `backend-os-foundation` branch.

The old `AdminDashboard` still exists in the repo for rollback/reference, but it is no longer the default admin portal target on this branch.

## Legacy files/components to audit

### Keep only if reworked into the new Command Center

- `src/pages/AdminDashboard.jsx`
- `src/components/admin/BookingListItem.jsx`
- `src/components/admin/BookingDetail.jsx`
- `src/components/admin/StatsOverview.jsx`
- `src/components/admin/ProvidersTab.jsx`
- `src/components/admin/GuestsTab.jsx`
- `src/components/admin/SettingsTab.jsx`
- `src/components/admin/QuickBookingModal.jsx`

### Likely replace with new modules

- `src/components/admin/ReportsTab.jsx`
- `src/components/admin/PayoutsTab.jsx`
- `src/components/admin/QuickActions.jsx`
- `src/components/provider/ProviderCalendar.jsx` when used inside admin
- `src/components/provider/CompleteVisitWizard.jsx` when used inside admin

### Naming/concept cleanup needed

- `ClientsTab` should not compete with `GuestsTab`.
- The new model should use `Households` as the main operating record.
- Revenue/Payouts should not be a random tab until Stripe/final checkout/provider payout logic is real.
- Incidents should become an internal review workflow, not a loose standalone tab.

## Routes to audit later

- `/admin`
- `/admin-os`
- `/admin-os/modules`
- `/admin-os/compliance`
- `/admin-os/overrides`
- `/admin-login`
- `/staff-login`
- `/provider-login`
- `/team`
- `/provider`

## Replacement rule

Do not delete a legacy file until one of these is true:

1. The replacement Command Center module exists and supports the required workflow.
2. The feature is confirmed out of scope for launch.
3. A rollback branch or commit is available and documented.

## Current safe fallback

Rollback to the checkpoint branch or revert the admin replacement shell commits if the new `/admin` shell causes problems.
