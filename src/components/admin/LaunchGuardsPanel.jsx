import React from 'react';
import { AlertTriangle, CheckCircle2, LockKeyhole } from 'lucide-react';

const LAUNCH_GUARDS = [
  {
    key: 'base44_schema_verification',
    label: 'Base44 schema verification',
    status: 'required',
    detail: 'Booking, TimeBlock, HouseholdProfile, Provider, Invoice, MessageLog, AuditLog, AppSettings, ProviderAvailability, CampaignTemplate, and WaitlistRequest must exist in live Base44.',
  },
  {
    key: 'backend_function_contracts',
    label: 'Backend function contracts',
    status: 'required',
    detail: 'adminLogin, verifyProviderLogin, scheduleConsultSlot, Stripe deposit, calendar, SMS, team notification, and schedule notification functions must match documented contracts.',
  },
  {
    key: 'payment_automation',
    label: 'Payment automation',
    status: 'locked',
    detail: 'Final checkout sends, refunds, cancellation fees, and reschedule fees stay off until Stripe behavior and owner policies are confirmed.',
  },
  {
    key: 'schedule_saves',
    label: 'Schedule edit saves',
    status: 'locked',
    detail: 'Schedule preview can test date/time conflicts, but it must not save TimeBlock or Booking changes until Base44 TimeBlock behavior is verified.',
  },
  {
    key: 'message_sending',
    label: 'Message sending actions',
    status: 'locked',
    detail: 'Admin message sends and guest/provider schedule-change messages stay off until notification contracts and opt-in handling are confirmed.',
  },
  {
    key: 'provider_auto_assignment',
    label: 'Provider auto-assignment',
    status: 'locked',
    detail: 'Provider matching can recommend, but assignments must remain controlled/admin-triggered until compliance and override behavior are verified.',
  },
  {
    key: 'legacy_admin_removal',
    label: 'Legacy admin removal',
    status: 'locked',
    detail: 'Legacy admin files stay in the repo until the Command Center passes live Base44 smoke testing.',
  },
  {
    key: 'owner_policy_approval',
    label: 'Owner policy approval',
    status: 'required',
    detail: 'Cancellation, rescheduling, no-show, member reschedules, non-member fees, final checkout timing, and outside-area handling must be finalized before launch.',
  },
];

const statusStyles = {
  locked: {
    icon: LockKeyhole,
    label: 'Locked',
    className: 'text-coral bg-coral/10 border-coral/20',
  },
  required: {
    icon: AlertTriangle,
    label: 'Required',
    className: 'text-charcoal/55 bg-cream border-taupe/15',
  },
  ready: {
    icon: CheckCircle2,
    label: 'Ready',
    className: 'text-sage bg-sage/10 border-sage/20',
  },
};

export default function LaunchGuardsPanel() {
  const lockedCount = LAUNCH_GUARDS.filter(item => item.status === 'locked').length;
  const requiredCount = LAUNCH_GUARDS.filter(item => item.status === 'required').length;

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-warm-white border border-taupe/15 p-6">
        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Launch guards</p>
        <h3 className="font-heading text-2xl text-charcoal mt-1">Do-not-launch safety checks</h3>
        <p className="font-body text-sm text-charcoal/45 font-light mt-2 max-w-3xl leading-relaxed">
          Read-only guardrail list for the Backend OS. These items prevent accidental launch behavior while the Command Center is still in Base44 verification.
        </p>
        <div className="grid grid-cols-2 gap-3 mt-5 max-w-md">
          <div className="rounded-2xl bg-cream border border-taupe/10 p-4">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Locked</p>
            <p className="font-heading text-2xl text-charcoal mt-1">{lockedCount}</p>
          </div>
          <div className="rounded-2xl bg-cream border border-taupe/10 p-4">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Required</p>
            <p className="font-heading text-2xl text-charcoal mt-1">{requiredCount}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {LAUNCH_GUARDS.map(item => {
          const meta = statusStyles[item.status] || statusStyles.required;
          const Icon = meta.icon;
          return (
            <div key={item.key} className="rounded-3xl bg-warm-white border border-taupe/15 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-heading text-lg text-charcoal">{item.label}</p>
                  <p className="font-body text-sm text-charcoal/45 font-light mt-2 leading-relaxed">{item.detail}</p>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-body uppercase tracking-widest ${meta.className}`}>
                  <Icon className="w-3 h-3" />
                  {meta.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
