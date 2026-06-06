import React from 'react';

const POLICY_ROWS = [
  { scenario: '48+ hours before', guest: 'Full refund of deposit', provider: 'No compensation', action: 'Auto-refund' },
  { scenario: '24–48 hours before', guest: 'Deposit forfeited', provider: '25% of estimated service fee', action: 'Admin review' },
  { scenario: 'Under 24 hours', guest: 'Deposit forfeited + 50% service fee charged', provider: '50% of estimated service fee', action: 'Charge & notify' },
  { scenario: 'No-show / lockout', guest: 'Full service fee charged', provider: '50% of estimated service fee', action: 'Full charge' },
  { scenario: 'Member cancellation', guest: '1 free cancel/mo, then standard fees apply', provider: 'Standard rules', action: 'Check membership' },
];

export default function CancellationPolicyPanel({ compact = false }) {
  if (compact) {
    return (
      <div className="rounded-2xl border border-taupe/20 bg-cream/60 p-4">
        <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-3">Cancellation Policy Reference</p>
        <div className="space-y-2">
          {POLICY_ROWS.map(row => (
            <div key={row.scenario} className="flex items-start gap-3 text-xs font-body font-light">
              <span className="text-charcoal/50 min-w-[140px] shrink-0">{row.scenario}</span>
              <span className="text-charcoal/40">→ {row.guest}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-taupe/20 bg-cream/60 p-5">
      <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-4">Cancellation Policy</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-body font-light">
          <thead>
            <tr className="text-charcoal/30 uppercase tracking-widest text-[10px]">
              <th className="text-left pb-2 pr-4">Scenario</th>
              <th className="text-left pb-2 pr-4">Guest Outcome</th>
              <th className="text-left pb-2 pr-4">Provider Compensation</th>
              <th className="text-left pb-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-taupe/10">
            {POLICY_ROWS.map(row => (
              <tr key={row.scenario}>
                <td className="py-2 pr-4 text-charcoal/60">{row.scenario}</td>
                <td className="py-2 pr-4 text-charcoal/50">{row.guest}</td>
                <td className="py-2 pr-4 text-charcoal/50">{row.provider}</td>
                <td className="py-2 text-coral">{row.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}