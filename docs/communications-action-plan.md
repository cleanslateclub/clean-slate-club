# Communications Action Plan

This plan defines the next safe steps for Vagaro-style communication features.

## Current state

The Messages workspace shows communication history from `MessageLog` records.

It supports:

- All messages
- Sent/delivered messages
- Failed messages
- Draft/queued messages
- Search
- Message detail view

## Do not wire live sending yet

Do not enable live outbound communication until Base44 function contracts and opt-in behavior are verified.

## Safe next steps

1. Add a draft-only communication composer.
2. Store drafts in `MessageLog` with status `draft`.
3. Require admin confirmation before any send attempt.
4. Add separate send functions for email and SMS only after contracts are verified.
5. Confirm opt-in fields exist before SMS actions are enabled.
6. Make failed notifications non-blocking so booking, payment, and provider workflows do not crash.

## Required communication events

- Booking request received
- Booking confirmed
- Consult booked
- Provider assigned
- Schedule changed
- Visit reminder
- Checkout ready
- Payment received
- Cancellation confirmation
- Reschedule confirmation
- Provider alert
- Admin alert

## Launch rule

Communication history can be visible before launch.

Live communication sending should remain off until:

- Base44 functions are present
- Opt-in handling is confirmed
- Templates are reviewed
- Failed-send behavior is tested
