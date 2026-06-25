import React from 'react';
import { AlertTriangle, CheckCircle2, ClipboardCheck, FileCheck2, LockKeyhole } from 'lucide-react';

const SMOKE_TEST_SECTIONS = [
  {
    key: 'admin_shell',
    title: 'Admin shell',
    priority: 'Critical',
    intent: 'Confirm the Command Center loads and stays clearly marked as draft-only.',
    checks: [
      'Log in through /admin and confirm the Command Center shell opens.',
      'Confirm the Draft Backend OS banner is visible.',
      'Open Command, Bookings, Actions, Calendar, Households, Providers, Services, Reports, Payments, Messages, and Settings tabs.',
      'Confirm each tab either loads records or shows a graceful empty/error state.',
    ],
    evidence: 'Capture which tabs loaded, which tabs had empty states, and any Base44 console errors.',
  },
  {
    key: 'booking_flow',
    title: 'Booking records',
    priority: 'Critical',
    intent: 'Confirm booking records can be reviewed without triggering live automation.',
    checks: [
      'Open Bookings and select a booking with as much real-looking test data as possible.',
      'Confirm Booking Readiness flags contact, service, schedule, address, service area, provider, duration, pricing, deposit, and focus details.',
      'Open Booking Action Center and check Needs Review, Unassigned, Upcoming, and All Active filters.',
      'Confirm controlled status actions still require an admin click and do not run policy fees or messages.',
    ],
    evidence: 'Record the test booking used, readiness gaps found, and whether controlled actions saved only when clicked.',
  },
  {
    key: 'provider_flow',
    title: 'Provider flow',
    priority: 'High',
    intent: 'Confirm provider records and provider dashboard are visible without enabling auto-assignment.',
    checks: [
      'Open Providers and confirm the readiness panel flags status, compliance, service permissions, notifications, and auto-assign.',
      'Use Provider Assignment Preview on a test booking and confirm recommendations are shown before any save.',
      'Log in through /team with a test provider and confirm the provider dashboard loads.',
      'Confirm provider dashboard readiness summary and Today’s Jobs directions display without changing records.',
    ],
    evidence: 'Record which provider was tested, assignment recommendation behavior, and whether provider dashboard data matched admin records.',
  },
  {
    key: 'schedule_flow',
    title: 'Schedule preview',
    priority: 'High',
    intent: 'Confirm calendar visibility and conflict preview before any schedule-save behavior is built.',
    checks: [
      'Open Calendar and select a block.',
      'Confirm Calendar Readiness flags date, start/end time, type, provider, booking link, location, travel buffer, and status.',
      'Use Schedule Preview from the Action Center to test a date/time change.',
      'Confirm conflict feedback updates but no Booking or TimeBlock schedule save is made.',
    ],
    evidence: 'Record the TimeBlock/booking tested, proposed date/time, conflict result, and confirmation that no schedule save occurred.',
  },
  {
    key: 'payments_messages',
    title: 'Payments and messages',
    priority: 'Critical',
    intent: 'Confirm financial/message previews are visible but cannot send or collect anything.',
    checks: [
      'Open Payments and select an invoice/payment record.',
      'Confirm Payment Readiness flags guest contact, service, line items, total, deposit, balance, status, and checkout lock.',
      'Confirm Checkout Preview recalculates without creating a Stripe link or sending checkout.',
      'Open Messages and confirm Message Readiness plus draft preview are visible without sending email/SMS.',
    ],
    evidence: 'Record invoice/message examples used, preview output, and confirmation that no Stripe link, email, or SMS was created.',
  },
  {
    key: 'launch_locks',
    title: 'Launch locks',
    priority: 'Critical',
    intent: 'Confirm the do-not-launch items remain visible before any real workflow is enabled.',
    checks: [
      'Open Settings and confirm the Settings Scope notice is visible.',
      'Open Schema Check and confirm required entities/functions are listed.',
      'Open Policy Decisions and confirm unresolved owner policies are listed.',
      'Open Launch Guards and review every locked or required item.',
      'Confirm no UI offers live final checkout sends, schedule saves, message sending, provider auto-assignment, or legacy admin removal.',
    ],
    evidence: 'Record any missing schema/function/policy items and confirm all launch-sensitive controls stayed locked.',
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

const PASS_FAIL_NOTES = [
  'Pass means the view loads, the expected data appears, and no locked automation is exposed.',
  'Watch means the view loads but has missing data, unclear labels, or test records that need cleanup.',
  'Fail means the view crashes, saves unexpectedly, sends unexpectedly, charges unexpectedly, or exposes a launch-sensitive action.',
];

const COMPLETION_REQUIREMENTS = [
  'All critical smoke-test sections pass or have documented fixes.',
  'No locked automation appears in the live preview UI.',
  'Schema Check required entities and functions are verified in Base44.',
  'Policy Decisions are approved by the owner before policy-based automation is enabled.',
  'Stripe behavior is verified before final checkout sends are enabled.',
  'Provider login and admin login are tested with live Base44 functions.',
];

const priorityStyles = {
  Critical: 'text-coral bg-coral/10 border-coral/20',
  High: 'text-charcoal/55 bg-cream border-taupe/15',
};

function SmokeTestSection({ section, index }) {
  return (
    <div className="rounded-3xl bg-warm-white border border-taupe/15 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Step {index + 1}</p>
            <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-body uppercase tracking-widest ${priorityStyles[section.priority] || priorityStyles.High}`}>
              {section.priority}
            </span>
          </div>
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
      <div className="rounded-2xl bg-butter/10 border border-butter/25 px-3 py-2 mt-4 flex items-start gap-2">
        <FileCheck2 className="w-3.5 h-3.5 text-coral mt-0.5 shrink-0" />
        <div>
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Evidence to record</p>
          <p className="font-body text-xs text-charcoal/50 font-light mt-1 leading-relaxed">{section.evidence}</p>
        </div>
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

      <div className="rounded-3xl bg-warm-white border border-taupe/15 p-5">
        <p className="font-heading text-lg text-charcoal">Pass, watch, fail notes</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-4">
          {PASS_FAIL_NOTES.map(note => (
            <div key={note} className="rounded-2xl bg-cream border border-taupe/10 px-3 py-2">
              <p className="font-body text-xs text-charcoal/50 font-light leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {SMOKE_TEST_SECTIONS.map((section, index) => (
          <SmokeTestSection key={section.key} section={section} index={index} />
        ))}
      </div>

      <div className="rounded-3xl bg-warm-white border border-taupe/15 p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileCheck2 className="w-4 h-4 text-sage" />
          <p className="font-heading text-lg text-charcoal">Before this can be considered complete</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {COMPLETION_REQUIREMENTS.map(item => (
            <div key={item} className="rounded-2xl bg-cream border border-taupe/10 px-3 py-2 flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-sage mt-0.5 shrink-0" />
              <p className="font-body text-xs text-charcoal/50 font-light leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
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
