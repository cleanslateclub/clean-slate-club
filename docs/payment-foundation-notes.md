# Payment Foundation Notes

This chunk intentionally stays small.

## Current safe payment foundation

Files:

- `src/lib/invoiceTotals.js`

Purpose:

- Calculate invoice line item totals.
- Apply deposit credit.
- Apply discounts.
- Add tips.
- Produce a draft invoice payload shape.

## What this does not do yet

- Does not create Stripe checkout sessions.
- Does not issue refunds.
- Does not charge reschedule fees.
- Does not store card data.
- Does not automate cancellation charges.

## Why this is split out

Payment logic should be very easy to audit and roll back. Stripe/backend function implementation should be added in later, smaller commits after Base44 function contracts are confirmed.
