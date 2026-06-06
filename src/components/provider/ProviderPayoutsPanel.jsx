import React, { useMemo } from 'react';
import { DollarSign } from 'lucide-react';

const STATUS_COLORS = {
  paid: 'bg-sage/20 text-charcoal/60 border-sage/40',
  pending: 'bg-butter/20 text-charcoal/60 border-butter/40',
  processing: 'bg-blue-gray/20 text-charcoal/60 border-blue-gray/30',
  on_hold: 'bg-mauve/20 text-charcoal/60 border-mauve/30',
};

export default function ProviderPayoutsPanel({ payouts }) {
  const summary = useMemo(() => {
    const paid = payouts.filter(p => p.status === 'paid').reduce((s, p) => s + (p.total_payout || 0), 0);
    const pending = payouts.filter(p => p.status !== 'paid').reduce((s, p) => s + (p.total_payout || 0), 0);
    return { paid, pending };
  }, [payouts]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-charcoal mb-1">My Earnings</h2>
        <p className="font-body text-sm text-charcoal/40 font-light">Your personal payout history. Company revenue data is not shown here.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-sage/5 to-sage/10 rounded-2xl border border-sage/20 p-5">
          <p className="font-body text-xs font-light text-charcoal/50 mb-1">Total Paid Out</p>
          <p className="font-heading text-2xl font-semibold text-charcoal">${summary.paid.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-butter/5 to-butter/10 rounded-2xl border border-butter/20 p-5">
          <p className="font-body text-xs font-light text-charcoal/50 mb-1">Pending</p>
          <p className="font-heading text-2xl font-semibold text-charcoal">${summary.pending.toFixed(2)}</p>
        </div>
      </div>

      {/* Payout list */}
      {payouts.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border border-dashed border-taupe/30">
          <DollarSign className="w-8 h-8 text-charcoal/20 mx-auto mb-3" />
          <p className="font-body text-sm text-charcoal/30 font-light">No payout records yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {[...payouts].sort((a, b) => (b.created_date || '').localeCompare(a.created_date || '')).map(p => (
            <div key={p.id} className="bg-warm-white rounded-xl border border-taupe/15 px-4 py-3 flex items-center justify-between gap-3">
              <div>
                <p className="font-body text-sm text-charcoal font-light">{p.pay_period || 'One-time payout'}</p>
                <p className="font-body text-xs text-charcoal/40 font-light mt-0.5">
                  {p.paid_date ? `Paid ${p.paid_date}` : 'Awaiting payment'}
                  {p.tip_amount > 0 && ` · Tip: $${p.tip_amount}`}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-body font-light ${STATUS_COLORS[p.status] || STATUS_COLORS.pending}`}>
                  {p.status}
                </span>
                <p className="font-heading text-sm font-semibold text-charcoal">${(p.total_payout || 0).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}