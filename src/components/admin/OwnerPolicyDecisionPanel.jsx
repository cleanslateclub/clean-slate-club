import React from 'react';
import { AlertTriangle, ClipboardList, LockKeyhole, ShieldCheck } from 'lucide-react';

const POLICY_DECISIONS = [
  {
    key: 'cancellation_policy',
    label: 'Cancellation policy',
    currentDraft: 'A final cancellation window and fee structure still needs owner approval.',
    decisionNeeded: 'Confirm the exact timing, fee, deposit treatment, and provider compensation rule for cancellations.',
    automationImpact: 'Cancellation fee automation must stay off until this is final.',
  },
  {
    key: 'reschedule_policy',
    label: 'Reschedule policy',
    currentDraft: 'Reschedule logic exists as a business need, but final terms are not approved.',
    decisionNeeded: 'Confirm allowed reschedule window, maximum reschedules, member/non-member treatment, and any fee amount.',
    automationImpact: 'Reschedule fee automation and schedule-change messages must stay off until this is final.',
  },
  {
    key: 'no_show_policy',
    label: 'No-show policy',
    currentDraft: 'No-show handling is still a launch blocker.',
    decisionNeeded: 'Confirm what counts as a no-show, whether the deposit is retained, whether additional fees apply, and how providers are paid.',
    automationImpact: 'No-show fees and automated guest follow-up must stay off until approved.',
  },
  {
    key: 'member_reschedules',
    label: 'Member reschedules',
    currentDraft: 'Membership is $49/month with priority perks and reduced overtime, but reschedule perks need final confirmation.',
    decisionNeeded: 'Confirm whether members receive a specific number of free reschedules and how those reset.',
    automationImpact: 'Member-specific fee logic must stay off until this is final.',
  },
  {
    key: 'non_member_reschedule_fee',
    label: 'Non-member reschedule fee',
    currentDraft: 'A non-member reschedule fee was discussed but should not be treated as final yet.',
    decisionNeeded: 'Confirm exact fee, timing, deposit interaction, and whether it is charged automatically or manually.',
    automationImpact: 'Do not create or send reschedule fee payment links automatically yet.',
  },
  {
    key: 'final_checkout_timing',
    label: 'Final checkout timing',
    currentDraft: 'Deposit is $50 for service only. Final checkout behavior still needs live Stripe and owner approval.',
    decisionNeeded: 'Confirm whether final checkout is manually sent, triggered on completion, or handled another way.',
    automationImpact: 'Final checkout sends and payment links must remain preview-only.',
  },
  {
    key: 'outside_area_handling',
    label: 'Outside-area requests',
    currentDraft: 'Service area is limited and outside-area handling must remain careful.',
    decisionNeeded: 'Confirm whether outside-area requests go to waitlist, manual approval, travel surcharge, or rejection flow.',
    automationImpact: 'Outside-area approval, pricing, and messages must remain manual until confirmed.',
  },
  {
    key: 'holiday_premium_policy',
    label: 'Holiday premium policy',
    currentDraft: 'Blackout and premium holidays are drafted, but live surcharge handling needs final confirmation.',
    decisionNeeded: 'Confirm surcharge amount, manual approval rules, provider pay impact, and guest-facing wording.',
    automationImpact: 'Holiday surcharge automation should stay off until final.',
  },
];

const LOCKED_AUTOMATIONS = [
  'Cancellation fee charging',
  'Reschedule fee charging',
  'No-show fee charging',
  'Member-specific fee waivers',
  'Final checkout send automation',
  'Outside-area pricing automation',
  'Holiday surcharge automation',
  'Policy-based SMS/email messages',
];

function DecisionCard({ item }) {
  return (
    <div className="rounded-3xl bg-warm-white border border-taupe/15 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-heading text-xl text-charcoal">{item.label}</p>
          <p className="font-body text-sm text-charcoal/45 font-light mt-2 leading-relaxed">{item.currentDraft}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-coral/20 bg-coral/10 px-2.5 py-1 text-[10px] font-body uppercase tracking-widest text-coral shrink-0">
          <AlertTriangle className="w-3 h-3" />
          Needs approval
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        <div className="rounded-2xl bg-cream border border-taupe/10 p-4">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Decision needed</p>
          <p className="font-body text-xs text-charcoal/55 font-light mt-2 leading-relaxed">{item.decisionNeeded}</p>
        </div>
        <div className="rounded-2xl bg-cream border border-taupe/10 p-4">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Automation impact</p>
          <p className="font-body text-xs text-charcoal/55 font-light mt-2 leading-relaxed">{item.automationImpact}</p>
        </div>
      </div>
    </div>
  );
}

export default function OwnerPolicyDecisionPanel() {
  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-warm-white border border-taupe/15 p-6">
        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Owner policy decisions</p>
        <h3 className="font-heading text-2xl text-charcoal mt-1">Policy choices before launch</h3>
        <p className="font-body text-sm text-charcoal/45 font-light mt-2 max-w-3xl leading-relaxed">
          These decisions control money, messaging, provider expectations, and guest experience. This panel is read-only and keeps unresolved launch decisions visible without turning on any policy automation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-3xl bg-cream border border-taupe/15 p-4">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Policy decisions</p>
          <p className="font-heading text-3xl text-charcoal mt-1">{POLICY_DECISIONS.length}</p>
        </div>
        <div className="rounded-3xl bg-cream border border-taupe/15 p-4">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Locked automations</p>
          <p className="font-heading text-3xl text-charcoal mt-1">{LOCKED_AUTOMATIONS.length}</p>
        </div>
        <div className="rounded-3xl bg-cream border border-taupe/15 p-4">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Launch status</p>
          <p className="font-heading text-3xl text-charcoal mt-1">Draft</p>
        </div>
      </div>

      <div className="rounded-3xl bg-butter/15 border border-butter/30 p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-coral shrink-0 mt-0.5" />
        <div>
          <p className="font-heading text-base text-charcoal">Policy review does not activate policy rules</p>
          <p className="font-body text-sm text-charcoal/45 font-light mt-1 leading-relaxed">
            Nothing in this panel changes fees, deposits, refunds, reschedules, holiday pricing, or messages. It exists so owner decisions are not hidden in notes while the backend OS is still draft.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {POLICY_DECISIONS.map(item => <DecisionCard key={item.key} item={item} />)}
      </div>

      <div className="rounded-3xl bg-warm-white border border-taupe/15 p-5">
        <div className="flex items-center gap-2 mb-4">
          <LockKeyhole className="w-4 h-4 text-coral" />
          <p className="font-heading text-lg text-charcoal">Locked until policy approval</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {LOCKED_AUTOMATIONS.map(item => (
            <div key={item} className="rounded-2xl bg-cream border border-taupe/10 px-3 py-2 flex items-center gap-2">
              <ClipboardList className="w-3.5 h-3.5 text-coral shrink-0" />
              <p className="font-body text-xs text-charcoal/50 font-light">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
