# CI Notes

A GitHub Actions workflow has been added for this branch.

## Workflow

`.github/workflows/ci.yml`

Runs:

- `npm install`
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Current limitation

The repo does not currently show a lockfile, so the workflow uses `npm install` instead of `npm ci`.

The current `jsconfig.json` typecheck include list covers pages and components. Helper files under `src/lib` should still be treated carefully and verified through lint/build unless typecheck coverage is expanded later.

## Why this matters

Before this workflow, the PR had no visible build check. This workflow gives the branch a path toward real merge readiness, but the first run still needs to be reviewed.

## Before marking ready for review

Confirm the workflow has run and check whether lint, typecheck, and build passed.
