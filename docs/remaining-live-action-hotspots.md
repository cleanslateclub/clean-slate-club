# Remaining live-action hotspots

This note tracks the remaining launch-sensitive areas that should not be treated as launch-ready until they are reviewed with a full local build or Codex pass.

## Still needs surgical follow-up

### `src/components/admin/os/AdminCalendarOS.jsx`

Known risk areas:

- Direct Booking removal is still present in the large calendar file.
- Direct TimeBlock create/update/delete behavior may still be present.
- Drag/drop schedule behavior should be verified against the current launch rule that schedule saves stay locked until TimeBlock behavior is verified.

Recommended fix:

- Split the calendar into smaller components before deeper changes.
- Replace removal controls with archive/cancel-safe actions.
- Route schedule changes through preview/audit helpers before enabling saves.
- Run build and smoke test after patching.

### `src/components/admin/os/BookingDrawer.jsx`

Known risk areas:

- Large drawer file still needs a focused pass for checkout persistence, schedule edits, message actions, and any hidden launch-sensitive buttons.
- Final checkout should remain preview-only until Stripe and owner policy decisions are verified.

Recommended fix:

- Split checkout, schedule, actions, and message panels into smaller components.
- Use shared checkout math helpers.
- Ensure all live payment/message/schedule actions are locked or guarded.

### `src/pages/AdminDashboard.jsx`

Known risk areas:

- Legacy page still contains a direct `Booking.delete` helper and direct TimeBlock update handler.
- Current child components have been locked down, but the legacy page should still be cleaned up before launch.

Recommended fix:

- Remove the unused direct delete helper.
- Replace TimeBlock update behavior with a locked/no-op handler or route through verified schedule-preview logic.
- Prefer moving all admin work to the Command Center after smoke testing.

### `src/pages/ProviderDashboard.jsx`

Known risk areas:

- Provider-side TimeBlock update handler still exists in the large dashboard file.
- A direct rewrite attempt was blocked by the connector because it touched schedule/auth logic together.

Recommended fix:

- Patch locally or with Codex to make provider-side schedule edits no-op until TimeBlock behavior is verified.
- Normalize provider email/status comparisons in the same pass if build confirms no regressions.

## Already locked in recent commits

- Legacy quick checkout action.
- Legacy invoice send action.
- Legacy quick booking modal.
- Command Center new booking entry.
- Calendar new booking modal.
- Guest dashboard cancellation action.
- Legacy BookingDetail direct schedule/TimeBlock/calendar edit saves.
