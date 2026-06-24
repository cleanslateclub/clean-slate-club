# Admin Replacement Readiness Scorecard

This scorecard answers: are we ready to merge the new admin replacement work into `main`?

## Current answer

Close to review-ready, but not launch-ready.

The branch now has a passing CI build gate. It still needs Base44 live verification and manual smoke testing before merge or launch.

## Current GitHub status

- PR: `#6 Backend OS foundation and dynamic service menu`
- Branch: `backend-os-foundation`
- Draft: yes
- Latest known state: mergeable, but still not launch-ready
- CI/workflow checks: latest CI build gate passed

## Readiness summary

| Area | Status | Notes |
|---|---:|---|
| GitHub branch commits | In progress | Changes are committed to the PR branch in rollback-friendly chunks. |
| Rollback checkpoint | Done | Checkpoint branch exists. |
| Chunk documentation | In progress | Major chunks are documented with commit SHAs. |
| New admin replacement shell | Started | `/admin` now points to `AdminCommandCenter` on this branch. |
| Legacy admin fallback | Available in repo | Old `AdminDashboard` still exists for rollback/reference. |
| Command Center overview | Started | Preview shows dashboard counts and queues. |
| Bookings workspace | Partially started | Real queues, search, detail panel, and admin map links exist. Action flows still needed. |
| Calendar workspace | Partially started | Read-only schedule block view exists. Editing still needed. |
| Households workspace | Partially started | Household records and Google Maps direction links are wired into Command Center. |
| Providers workspace | Partially started | Real list, filters, search, and detail panel exist. Editing and assignment still needed. |
| Services workspace | Partially started | Services OS exists. Needs Base44 live save verification. |
| Payments workspace | Partially started | Read-only invoice view exists but is not wired into the portal yet. |
| Messages workspace | Partially started | Message log list, filters, search, and detail panel exist. Sending UI not wired. |
| Settings workspace | Partially started | Rules, saved settings, and feature flag views exist. Editing still needed. |
| Team directions links | Started | Provider-visible booking records now include a Google Maps directions URL. |
| CI build gate | Passed | Latest GitHub Actions CI run completed successfully. |
| Base44 schema sync | Unknown | Must be verified in live Base44. |
| Base44 backend functions | Unknown | Must match function contracts. |
| Owner policy decisions | Pending | Cancellation/reschedule/no-show rules need approval before automation. |

## Merge readiness levels

### Level 1: Commit-ready

Status: yes.

Meaning:

- It is fine to keep committing changes to the PR branch.
- Chunks are documented.
- Rollback checkpoint exists.
- CI build gate exists and has passed on the current branch.

### Level 2: PR review-ready

Status: close.

Needed:

- Review `docs/pre-merge-handoff-checklist.md`.
- Confirm no accidental references to the old dashboard as the final plan.
- Run or schedule Base44 preview testing using `docs/base44-live-test-script.md`.

### Level 3: Merge-ready to `main`

Status: not yet.

Needed:

- Base44 live schema verification.
- Base44 function verification.
- Manual smoke test of `/admin`, `/admin-os`, `/book`, and `/team`.
- Confirm admin login still works after switching `/admin` to `AdminCommandCenter`.
- Confirm old dashboard rollback path is acceptable.

### Level 4: Launch-ready

Status: no.

Needed:

- End-to-end booking with deposit.
- Calendar creation.
- Admin notification.
- Guest notification.
- Provider assignment.
- Final checkout.
- Policy decisions approved.
- Service area handling confirmed.
- Provider portal checked on mobile.

## Recommended next steps before merge

1. Run Base44 preview tests from `docs/base44-live-test-script.md`.
2. Verify all Base44 schemas and backend functions.
3. Decide whether to wire Payments later or keep it as a component only for this PR.
4. Only then mark the PR ready for review.

## Owner decision

Dawn does not need to approve every code chunk.

Dawn does need to approve before:

- Removing legacy admin files permanently.
- Merging into `main` if Base44 treats `main` as a deploy source.
- Enabling automated cancellation/reschedule/no-show fees.
- Going live with provider assignment and payment automation.
