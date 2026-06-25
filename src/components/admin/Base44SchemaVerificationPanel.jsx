import React from 'react';
import { AlertTriangle, CheckCircle2, Database, FunctionSquare, LockKeyhole } from 'lucide-react';

const REQUIRED_ENTITIES = [
  { key: 'Booking', purpose: 'Guest booking records, status workflow, service details, schedule fields, provider assignment, and deposit/payment references.' },
  { key: 'HouseholdProfile', purpose: 'Household-level profile, service area status, notes, access details, parking, provider-safe context, and visit history.' },
  { key: 'Provider', purpose: 'Provider profile, compliance fields, permissions, contact channels, assignment eligibility, and provider dashboard access.' },
  { key: 'ProviderAvailability', purpose: 'Provider availability windows and future assignment/scheduling logic.' },
  { key: 'TimeBlock', purpose: 'Calendar blocks, travel blocks, booking-linked schedule blocks, and future schedule edit behavior.' },
  { key: 'Invoice', purpose: 'Payment review, checkout preview, deposit application, paid amount, balance due, and Stripe references.' },
  { key: 'MessageLog', purpose: 'Read-only communication history, draft preview context, channel/status review, and future send audit trail.' },
  { key: 'AuditLog', purpose: 'Admin action history, booking action trail, provider assignment trace, and future accountability.' },
  { key: 'AppSettings', purpose: 'Saved service menu, feature flags, booking rules, launch locks, and backend OS settings.' },
  { key: 'CampaignTemplate', purpose: 'Reusable message/campaign copy for future reminders and follow-up workflows.' },
  { key: 'FormTemplate', purpose: 'Reusable intake form structure and service-specific questions.' },
  { key: 'FormResponse', purpose: 'Guest intake answers, focus items, photos, and service request details.' },
  { key: 'WaitlistRequest', purpose: 'Outside-area, rejected, unavailable, or future scheduling requests.' },
];

const REQUIRED_FUNCTIONS = [
  { key: 'adminLogin', purpose: 'Admin authentication for /admin and Command Center access.' },
  { key: 'verifyProviderLogin', purpose: 'Provider authentication for /team and provider dashboard access.' },
  { key: 'scheduleConsultSlot', purpose: 'Free consult scheduling, constrained to Mondays 10am to 12pm.' },
  { key: 'getStripePublishableKey', purpose: 'Safe public Stripe key retrieval for frontend payment setup.' },
  { key: 'createDepositPaymentIntent', purpose: 'Initial $50 service deposit flow only, not final checkout automation.' },
  { key: 'addBookingToCalendar', purpose: 'Calendar sync for bookings/consults, with failures treated as non-blocking.' },
  { key: 'sendClientSmsConfirmation', purpose: 'Guest SMS confirmation after booking when opt-in and contract behavior are verified.' },
  { key: 'notifyTeamNewBooking', purpose: 'Admin/team alert for each booking with guest, address, service, time, and revenue context.' },
  { key: 'notifyScheduleChange', purpose: 'Admin/provider schedule-change notifications after contracts and opt-in are verified.' },
];

const LOCKED_UNTIL_VERIFIED = [
  'Final checkout links or sends',
  'Policy-based fee collection',
  'Refunds',
  'Schedule edit saves',
  'Message sending actions',
  'Provider auto-assignment',
  'Legacy admin removal',
];

function VerificationCard({ item, icon: Icon }) {
  return (
    <div className="rounded-3xl bg-warm-white border border-taupe/15 p-5">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-2xl bg-cream border border-taupe/10 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-coral" />
        </div>
        <div>
          <p className="font-heading text-lg text-charcoal">{item.key}</p>
          <p className="font-body text-sm text-charcoal/45 font-light mt-2 leading-relaxed">{item.purpose}</p>
          <div className="inline-flex items-center gap-1 rounded-full border border-taupe/15 bg-cream px-2.5 py-1 mt-3 text-[10px] font-body uppercase tracking-widest text-charcoal/45">
            <AlertTriangle className="w-3 h-3" />
            Verify in live Base44
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Base44SchemaVerificationPanel() {
  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-warm-white border border-taupe/15 p-6">
        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Base44 verification</p>
        <h3 className="font-heading text-2xl text-charcoal mt-1">Schema and function checklist</h3>
        <p className="font-body text-sm text-charcoal/45 font-light mt-2 max-w-3xl leading-relaxed">
          This is a read-only launch gate. Use it to compare the GitHub branch against live Base44 entities and backend functions before treating the Command Center as ready for live workflow testing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-3xl bg-cream border border-taupe/15 p-4">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Required entities</p>
          <p className="font-heading text-3xl text-charcoal mt-1">{REQUIRED_ENTITIES.length}</p>
        </div>
        <div className="rounded-3xl bg-cream border border-taupe/15 p-4">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Required functions</p>
          <p className="font-heading text-3xl text-charcoal mt-1">{REQUIRED_FUNCTIONS.length}</p>
        </div>
        <div className="rounded-3xl bg-cream border border-taupe/15 p-4">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Locked items</p>
          <p className="font-heading text-3xl text-charcoal mt-1">{LOCKED_UNTIL_VERIFIED.length}</p>
        </div>
      </div>

      <div className="rounded-3xl bg-butter/15 border border-butter/30 p-4 flex items-start gap-3">
        <LockKeyhole className="w-5 h-5 text-coral shrink-0 mt-0.5" />
        <div>
          <p className="font-heading text-base text-charcoal">Verification does not unlock anything automatically</p>
          <p className="font-body text-sm text-charcoal/45 font-light mt-1 leading-relaxed">
            Even after these items are confirmed, payment sends, schedule saves, message sends, provider auto-assignment, refunds, and policy fees must stay off until owner approval and targeted workflow testing are complete.
          </p>
        </div>
      </div>

      <div>
        <p className="font-heading text-xl text-charcoal mb-3">Required Base44 entities</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {REQUIRED_ENTITIES.map(entity => <VerificationCard key={entity.key} item={entity} icon={Database} />)}
        </div>
      </div>

      <div>
        <p className="font-heading text-xl text-charcoal mb-3">Required backend functions</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {REQUIRED_FUNCTIONS.map(fn => <VerificationCard key={fn.key} item={fn} icon={FunctionSquare} />)}
        </div>
      </div>

      <div className="rounded-3xl bg-warm-white border border-taupe/15 p-5">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-4 h-4 text-sage" />
          <p className="font-heading text-lg text-charcoal">Keep locked until targeted testing is complete</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {LOCKED_UNTIL_VERIFIED.map(item => (
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
