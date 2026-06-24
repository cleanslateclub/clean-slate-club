# Admin Replacement Readiness Scorecard

This scorecard answers: are we ready to merge the new admin replacement work into `main`?

## Current answer

Not yet.

The branch is being committed in clean chunks, but it should not be treated as merge-ready until the checks below pass.

## Current GitHub status

- PR: `#6 Backend OS foundation and dynamic service menu`
- Branch: `backend-os-foundation`
- Draft: yes
- Latest known state: mergeable, but still not launch-ready
- CI/workflow checks: none detected for latest checked commit

## Readiness summary

| Area | Status | Notes |
|---|---:|---|
| GitHub branch commits | In progress | Changes are committed to the PR branch in rollback-friendly chunks. |
| Rollback checkpoint | Done | Checkpoint branch exists. |
| Chunk documentation | In progress | Major chunks are documented with commit SHAs. |
| New admin replacement shell | Started | `/admin` now points to `AdminCommandCenter` on this branch. |
| Legacy admin fallback | Available in repo | Old `AdminDashboard` still exists for rollback/reference. |
| Command Center overview | Started | Preview shows dashboard counts and queues. |
| Bookings workspace | Partially started | Real queues, search, and detail panel exist. Action flows still needed. |
| Calendar workspace | Not complete | Placeholder only. Needs real calendar and conflict handling UI. |
| Households workspace | Not complete | Placeholder only. Connector blocked this area twice. |
| Providers workspace | Partially started | Real list, filters, search, and detail panel exist. Editing and assignment still needed. |
| Services workspace | Partially started | Services OS exists. Needs Base44 live save verification. |
| Payments workspace | Not complete | Math helper exists only. Final checkout not wired. |
| Messages workspace | Not complete | Template/log helpers exist only. Sending UI not wired. |
| Settings workspace | Not complete | Placeholder only. Needs toggles/rules UI. |
| Base44 schema sync | Unknown | Must be verified in live Base44. |
| Base44 backend functions | Unknown | Must match function contracts. |
| Build/typecheck/lint | Unknown | No CI detected and local build was not available. |
| Owner policy decisions | Pending | Cancellation/reschedule/no-show rules need approval before automation. |

## Merge readiness levels

### Level 1: Commit-ready

Status: yes.

Meaning:

- It is fine to keep committing changes to the PR branch.
- Chunks are documented.
- Rollback checkpoint exists.

### Level 2: PR review-ready

Status: close, but not complete.

Needed:

- Re-check PR body so it reflects current replacement strategy.
- Confirm no accidental references to the old dashboard as the final plan.
- Add a focused reviewer/test checklist for the new `/admin` shell.

### Level 3: Merge-ready to `main`

Status: no.

Needed:

- Build/preview verification.
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

1. Finish the key replacement workspaces enough that `/admin` is useful, not just a shell.
2. Add a temporary `/admin-legacy` route only if rollback/testing needs it.
3. Update PR description to reflect the new replacement plan.
4. Run build/preview checks through Base44 or local environment.
5. Only then mark the PR ready for review.

## Owner decision

Dawn does not need to approve every code chunk.

Dawn does need to approve before:

- Removing legacy admin files permanently.
- Merging into `main` if Base44 treats `main` as a deploy source.
- Enabling automated cancellation/reschedule/no-show fees.
- Going live with provider assignment and payment automation.
