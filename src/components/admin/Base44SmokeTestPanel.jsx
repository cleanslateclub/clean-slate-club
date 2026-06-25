import React from 'react';
import { AlertTriangle, CheckCircle2, ClipboardCheck, LockKeyhole } from 'lucide-react';

const SMOKE_TEST_SECTIONS = [
  {
    key: 'admin_shell',
    title: 'Admin shell',
    intent: 'Confirm the Command Center loads and stays clearly marked as draft-only.',
    checks: [
      'Log in through /admin and confirm the Command Center shell opens.',
      'Confirm the Draft Backend OS banner is visible.',
      'Open Command, Bookings, Actions, Calendar, Households, Providers, Services, Reports, Payments, Messages, and Settings tabs.',
      'Confirm each tab either loads records or shows a graceful empty/error state.',
    ],
  },
  {
    key: 'booking_flow',
    title: 'Booking records',
    intent: 'Confirm booking records can be reviewed without triggering live automation.',
    checks: [
      'Open Bookings and select a booking with as much real-looking test data as possible.',
      'Confirm Booking Readiness flags contact, service, schedule, address, service area, provider, duration, pricing, deposit, and focus details.',
      'Open Booking Action Center and check Needs Review, Unassigned, Upcoming, and All Active filters.',
      'Confirm controlled status actions still require an admin click and do not run policy fees or messages.',
    ],
  },
  {
    key: 'provider_flow',
    title: 'Provider flow',
    intent: 'Confirm provider records and provider dashboard are visible without enabling auto-assignment.',
    checks: [
      'Open Providers and confirm the readiness panel flags status, compliance, service permissions, notifications, and auto-assign.',
      'Use Provider Assignment Preview on a test booking and confirm recommendations are shown before any save.',
      'Log in through /team with a test provider and confirm the provider dashboard loads.',
      'Confirm provider dashboard readiness summary and Today’s Jobs directions display without changing records.',
    ],
  },
  {
    key: 'schedule_flow',
    title: 'Schedule preview',
    intent: 'Confirm calendar visibility and conflict preview before any schedule-save behavior is built.',
    checks: [
      'Open Calendar and select a block.',
      'Confirm Calendar Readiness flags date, start/end time, type, provider, booking link, location, travel buffer, and status.',
      'Use Schedule Preview from the Action Center to test a date/time change.',
      'Confirm conflict feedback updates but no Booking or TimeBlock schedule save is made.',
    ],
  },
  {
    key: 'payments_messages',
    title: 'Payments and messages',
    intent: 'Confirm financial/message previews are visible but cannot send or collect anything.',
    checks: [
      'Open Payments and select an invoice/payment record.',
      'Confirm Payment Readiness flags guest contact, service, line items, total, deposit, balance, status, and checkout lock.',
      'Confirm Checkout Preview recalculates without creating a Stripe link or sending checkout.',
      'Open Messages and confirm Message Readiness plus draft preview are visible without sending email/SMS.',
    ],
  },
  {
    key: 'launch_locks',
    title: 'Launch locks',
    intent: 'Confirm the do-not-launch items remain visible before any real workflow is enabled.',
    checks: [
      'Open Settings and confirm the Settings Scope notice is visible.',
      'Open Launch Guards and review every locked or required item.',
      'Confirm next verification steps are visible for each guard.',
      'Confirm no UI offers live final checkout sends, schedule saves, message sending, provider auto-assignment, or legacy admin removal.',
    ],
  },
];

const LOCKED_ITEMS = [
  'Final checkout/payment sends',
  'Cancellation or reschedule fee automation',
  'Refund automation',
  'Schedule edit saves',
  'Admin or schedule-change message sends',
  'Provider auto-assignment',
  'Legacy admin removal',
];

function SmokeTestSection({ section, index }) {
  return (
    <div className="rounded-3xl bg-warm-white border border-taupe/15 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Step {index + 1}</p>
          <h4 className="font-heading text-xl text-charcoal mt-1">{section.title}</h4>
          <p className="font-body text-sm text-charcoal/45 font-light mt-2 leading-relaxed">{section.intent}</p>
        </div>
        <ClipboardCheck className="w-5 h-5 text-coral/70 shrink-0" />
      </div>
      <div className="space-y-2 mt-4">
        {section.checks.map(check => (
          <div key={check} className="flex items-start gap-2 rounded-2xl bg-cream border border-taupe/10 px-3 py-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-sage mt-0.5 shrink-0" />
            <p className="font-body text-xs text-charcoal/55 font-light leading-relaxed">{check}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Base44SmokeTestPanel() {
  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-warm-white border border-taupe/15 p-6">
        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Base44 smoke test</p>
        <h3 className="font-heading text-2xl text-charcoal mt-1">Guided preview verification</h3>
        <p className="font-body text-sm text-charcoal/45 font-light mt-2 max-w-3xl leading-relaxed">
          Use this as the first live Base44 preview pass before treating the backend OS as launch-ready. It is intentionally read-only guidance and does not run tests, save records, send messages, collect payment, or unlock features.
        </p>
      </div>

      <div className="rounded-3xl bg-butter/15 border border-butter/30 p-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-2xl bg-warm-white border border-taupe/10 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-4 h-4 text-coral" />
        </div>
        <div>
          <p className="font-heading text-base text-charcoal">Do not treat a pass here as launch approval</p>
          <p className="font-body text-sm text-charcoal/45 font-light mt-1 leading-relaxed">
            This checklist is a practical first pass only. Launch still requires Base44 schema verification, backend function verification, Stripe behavior confirmation, owner policy approval, and manual smoke testing with real test data.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {SMOKE_TEST_SECTIONS.map((section, index) => (
          <SmokeTestSection key={section.key} section={section} index={index} />
        ))}
      </div>

      <div className="rounded-3xl bg-warm-white border border-taupe/15 p-5">
        <div className="flex items-center gap-2 mb-4">
          <LockKeyhole className="w-4 h-4 text-coral" />
          <p className="font-heading text-lg text-charcoal">Must remain locked during smoke testing</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {LOCKED_ITEMS.map(item => (
            <div key={item} className="rounded-2xl bg-cream border border-taupe/10 px-3 py-2 flex items-center gap-2">
              <LockKeyhole className="w-3.5 h-3.5 text-coral shrink-0" />
              <p className="font-body text-xs text-charcoal/50 font-light">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
