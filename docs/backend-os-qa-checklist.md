# Clean Slate Club Backend OS QA Checklist

Branch: `backend-os-foundation`

This branch is a foundation build for the Clean Slate Club admin/team backend OS. Do not merge to `main` until the items below are checked in preview.

## Portal routing

- [ ] `/admin` shows admin login when logged out.
- [ ] `/admin` shows the current admin dashboard when logged in.
- [ ] `/team` shows the provider/team login when logged out.
- [ ] `/team` shows the provider dashboard when logged in.
- [ ] `/provider` redirects to `/team`.
- [ ] `/provider-login` redirects to `/team`.
- [ ] `/staff-login` redirects to `/team`.
- [ ] `/admin-login` redirects to `/admin`.
- [ ] `/admin-os` opens the Admin OS preview.
- [ ] `/admin-os/modules` opens the backend feature map.
- [ ] `/admin-os/compliance` opens the provider compliance center.
- [ ] `/admin-os/overrides` opens the admin overrides page.

## Admin OS preview

- [ ] `/admin-os` loads without a blank screen.
- [ ] Services tab displays all Clean Slate packages.
- [ ] Service cards show base time and base price.
- [ ] Selecting each service clears selected add-ons.
- [ ] Editing base minutes recalculates the estimate preview.
- [ ] Editing minimum minutes recalculates the estimate preview.
- [ ] Editing base price recalculates the estimate preview.
- [ ] Editing add-on minutes recalculates the visit time.
- [ ] Editing add-on price recalculates the estimate total.
- [ ] Save service menu creates or updates the `service_menu_v1` AppSettings record.
- [ ] Refreshing `/admin-os` reloads the saved service menu.
- [ ] Reset defaults loads the starter menu as an unsaved preview.

## Provider compliance center

- [ ] `/admin-os/compliance` loads provider records.
- [ ] Provider list shows readiness counts.
- [ ] Selecting a provider shows their compliance checklist.
- [ ] Service permissions can be toggled.
- [ ] Toggling service permissions changes which requirements appear.
- [ ] Provider status can be changed.
- [ ] Access level can be changed.
- [ ] Document requirements can be marked approved.
- [ ] Approved document state persists after refresh.
- [ ] Expiration dates can be saved for expiring documents.
- [ ] Internal notes can be saved on document requirements.
- [ ] A provider only reads as ready when active and all required items are complete.

## Admin overrides

- [ ] `/admin-os/overrides` loads provider records.
- [ ] Selecting a provider shows missing requirements available for override.
- [ ] Override cannot be created without a requirement.
- [ ] Override cannot be created without a reason.
- [ ] Override cannot be created without an expiration date.
- [ ] Override cannot be created without confirmation checkbox.
- [ ] Creating an override stores it on the provider record.
- [ ] Active overrides show in the override warning area.
- [ ] Active overrides can be revoked.
- [ ] Revoked overrides no longer appear as active.

## Public booking dynamic menu

- [ ] `/book` shows a loading state briefly before rendering.
- [ ] `/book` falls back to the default service menu if AppSettings is unavailable.
- [ ] Editing a service price in `/admin-os`, saving, then opening `/book` shows the updated starting price.
- [ ] Editing an add-on price in `/admin-os`, saving, then opening `/book` shows the updated add-on price.
- [ ] Editing an add-on duration in `/admin-os`, saving, then opening `/book` changes the estimated visit duration.
- [ ] Existing intake fields still appear for every service.
- [ ] Errands still shows Errand Details.
- [ ] Family/senior services still require emergency contact.
- [ ] Photo upload still works.
- [ ] SMS opt-in language still appears.
- [ ] Booking submit still creates a Booking record.
- [ ] Booking submit still creates TimeBlock records.
- [ ] Booking emails still send or fail non-blocking.
- [ ] Booking SMS still sends or fails non-blocking.

## Provider/team portal

- [ ] Provider login sends successful users to `/team`.
- [ ] Expired provider sessions return to `/team` login.
- [ ] Provider dashboard still shows assigned jobs.
- [ ] Provider-side time block updates do not crash.
- [ ] Provider-side time block updates call the schedule notification helper.

## Notification foundation

- [ ] `notifyScheduleChange` attempts the preferred backend function.
- [ ] If unavailable, booking-related notifications attempt fallback team notification.
- [ ] Failed schedule notifications do not break schedule updates.

## Known not-yet-complete items

- [ ] Service editor UI is not yet merged into the current live admin dashboard.
- [ ] Provider compliance document uploads are not yet wired.
- [ ] Google OAuth provider onboarding is not yet wired.
- [ ] Stripe final checkout/refund/reschedule fee engine is not yet wired.
- [ ] Campaign builder is not yet wired.
- [ ] Reports are not yet wired.
- [ ] Audit logs are not yet wired.

## High-risk areas to test carefully

- Booking page after service menu hydration.
- AppSettings availability in production.
- Any Base44 schema limitations for `AppSettings.value` size.
- Provider session/login redirects.
- Service key mapping: `family_support` maps to legacy booking key `mothers_helper`.
- Provider entity schema flexibility for `doc_*` compliance fields.
- Provider entity schema flexibility for `compliance_overrides` JSON.
