import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { DollarSign, CheckCircle2 } from 'lucide-react';

const STATUS_COLORS = {
  pending: 'bg-butter/30 border-butter/40 text-charcoal/60',
  processing: 'bg-blue-50 border-blue-100 text-blue-500',
  paid: 'bg-sage/20 border-sage/30 text-charcoal/50',
  on_hold: 'bg-coral/10 border-coral/20 text-coral',
};

export default function PayoutsTab() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    base44.entities.ProviderPayout.list('-created_date', 200).then(p => { setPayouts(p || []); setLoading(false); });
  }, []);

  const markPaid = async (id) => {
    await base44.entities.ProviderPayout.update(id, { status: 'paid', paid_date: new Date().toISOString().split('T')[0] });
    setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: 'paid', paid_date: new Date().toISOString().split('T')[0] } : p));
  };

  const filtered = payouts.filter(p => filter === 'all' || p.status === filter);
  const totalPending = payouts.filter(p => p.status === 'pending').reduce((s, p) => s + (p.total_payout || 0), 0);

  // Group by provider
  const byProvider = {};
  filtered.forEach(p => {
    if (!byProvider[p.provider_name]) byProvider[p.provider_name] = [];
    byProvider[p.provider_name].push(p);
  });

  if (loading) return <div className="flex items-center justify-center py-16"><div className="w-6 h-6 border-2 border-taupe border-t-coral rounded-full animate-spin" /></div>;

  return (
    <div>
      {totalPending > 0 && (
        <div className="mb-5 p-4 rounded-2xl bg-butter/20 border border-butter/30 flex items-center gap-3">
          <DollarSign className="w-5 h-5 text-charcoal/40 shrink-0" />
          <div>
            <p className="font-body text-sm text-charcoal font-light">Pending payouts: <strong className="text-coral">${totalPending.toFixed(2)}</strong></p>
            <p className="font-body text-xs text-charcoal/40 font-light">Bi-weekly payout schedule · 50% service, 55% holiday, 100% tips</p>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-5">
        {['pending', 'paid', 'on_hold', 'all'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-body font-light border transition-all capitalize ${filter === s ? 'bg-coral border-coral text-white' : 'bg-warm-white border-taupe/20 text-charcoal/50 hover:border-coral/30'}`}>
            {s} ({s === 'all' ? payouts.length : payouts.filter(p => p.status === s).length})
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {Object.entries(byProvider).map(([provider, records]) => {
          const total = records.reduce((s, r) => s + (r.total_payout || 0), 0);
          return (
            <div key={provider} className="bg-warm-white rounded-2xl border border-taupe/15 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-taupe/10 bg-cream/50">
                <p className="font-heading text-sm font-semibold text-charcoal">{provider}</p>
                <p className="font-body text-sm text-coral font-light">${total.toFixed(2)}</p>
              </div>
              <div className="divide-y divide-taupe/10">
                {records.map(r => (
                  <div key={r.id} className="flex items-center justify-between px-5 py-3 gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-xs text-charcoal font-light">Booking #{r.booking_id?.slice(-6)}</p>
                      <p className="font-body text-[10px] text-charcoal/35 font-light">{r.pay_period} · {r.is_holiday_rate ? '55% holiday rate' : '50% standard'}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-body text-sm text-charcoal font-light">${(r.total_payout || 0).toFixed(2)}</p>
                      {r.tip_amount > 0 && <p className="font-body text-[10px] text-charcoal/30 font-light">incl. ${r.tip_amount} tip</p>}
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-body font-light shrink-0 ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                    {r.status === 'pending' && (
                      <button onClick={() => markPaid(r.id)} className="shrink-0 p-1.5 rounded-lg bg-sage/20 hover:bg-sage/30 transition-colors" title="Mark paid">
                        <CheckCircle2 className="w-3.5 h-3.5 text-sage" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {Object.keys(byProvider).length === 0 && (
          <div className="text-center py-12"><p className="font-body text-sm text-charcoal/30 font-light">No payout records found.</p></div>
        )}
      </div>
    </div>
  );
}