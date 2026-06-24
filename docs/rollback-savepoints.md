# Rollback Savepoints

This document records stable-ish checkpoints while the Backend OS foundation is being built in chunks.

## Savepoint 1: Operations foundation

Branch:

`checkpoint/backend-os-foundation-2026-06-23-ops-foundation`

Commit:

`0c5808145f35880132af679e6c68705390ea4076`

Use this checkpoint if later work needs to be rolled back to the point where the branch had:

- Backend OS draft PR protection
- Expanded operational schemas
- Booking rules helper
- Booking lifecycle helper
- Provider matching helper
- Service area helper
- Waitlist entity/helper
- Message log entity/helper
- Schedule block utilities
- Household record helper
- Membership rules helper
- Base44 sync checklist
- Public booking flow wired to service-area and booking-rule validation

## Rollback guidance

Prefer small reverts over resetting the whole branch.

Suggested rollback strategy:

1. Identify the chunk that introduced the problem.
2. Revert the commits in that chunk only.
3. Keep schema-only additions unless they break Base44 import.
4. If the branch becomes too tangled, reset from the checkpoint branch and replay only the clean commits.

## Commit chunking plan going forward

Future commits should be grouped by purpose:

- Forms and intake foundation
- Admin command center foundation
- Provider assignment workflow
- Communication template seeds
- Reports/dashboard summaries
- Payments/final checkout foundation
- Base44 function contract updates
- QA and launch checklist updates

Avoid mixing unrelated code, schema, and docs in the same commit unless the commit is intentionally a small coordination note.
