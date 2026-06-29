import React, { useMemo, useState } from 'react';
import { X, Plus, Trash2, LockKeyhole } from 'lucide-react';

const DEPOSIT_CENTS = 5000;

const toSafeLineItemCents = (value = 0) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.round(Math.max(0, parsed) * 100);
};

export default function InvoiceModal({ booking, onClose }) {
  const cfg = booking._cfg;
  const quoteLow = booking.estimated_price_low || 0;
  const quoteHigh = booking.estimated_price_high || 0;
  const quotedMidpoint = Math.round((quoteLow + quoteHigh) / 2);
  const hasDeposit = booking.deposit_status === 'paid' || Boolean(
    booking.payment_intent_id ||
    booking.admin_notes?.includes('Stripe ID:') ||
    booking.admin_notes?.includes('Deposit paid')
  );

  const defaultItems = useMemo(() => [
    {
      description: cfg?.label || booking.service_category,
      amount: quotedMidpoint * 100,
    },
    ...(hasDeposit ? [{ description: 'Deposit paid at booking', amount: -DEPOSIT_CENTS, locked: true }] : []),
  ], [cfg?.label, booking.service_category, quotedMidpoint, hasDeposit]);

  const [lineItems, setLineItems] = useState(defaultItems);

  const total = Math.max(0, lineItems.reduce((s, i) => s + (Number(i.amount) || 0), 0));

  const updateItem = (idx, field, value) => {
    setLineItems(prev => prev.map((item, i) => {
      if (i !== idx || item.locked) return item;
      return {
        ...item,
        [field]: field === 'amount' ? toSafeLineItemCents(value) : value,
      };
    }));
  };

  const addItem = () => setLineItems(prev => [...prev, { description: '', amount: 0 }]);
  const removeItem = (idx) => setLineItems(prev => prev.filter((item, i) => i !== idx || item.locked));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="bg-warm-white rounded-3xl border border-taupe/15 shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-taupe/10">
          <div>
            <h3 className="font-heading text-lg font-semibold text-charcoal">Final Checkout Preview</h3>
            <p className="font-body text-xs text-charcoal/40 font-light mt-0.5">To: {booking.client_name} · {booking.client_email}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-taupe/10 transition-colors text-charcoal/40">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-2xl bg-coral/10 border border-coral/20 p-4 flex items-start gap-3">
            <LockKeyhole className="w-4 h-4 text-coral mt-0.5 shrink-0" />
            <div>
              <p className="font-body text-[10px] uppercase tracking-widest text-coral font-light">Checkout locked</p>
              <p className="font-body text-xs text-charcoal/45 font-light mt-1 leading-relaxed">
                This legacy invoice modal is preview-only. It does not create Stripe links, send checkout messages, or save invoice changes until Stripe behavior and owner payment policies are verified.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-cream border border-taupe/15 p-4">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-1">Original quote shown to guest</p>
            <p className="font-heading text-xl font-semibold text-coral">${quoteLow}–${quoteHigh}</p>
            <p className="font-body text-xs text-charcoal/40 font-light mt-1">Provider may adjust the final price before checkout is prepared.</p>
          </div>

          <div className="space-y-2">
            {lineItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  value={item.description}
                  onChange={e => updateItem(idx, 'description', e.target.value)}
                  placeholder="Description"
                  disabled={item.locked}
                  className="flex-1 px-3 py-2 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 disabled:opacity-60"
                />
                <div className="relative w-28">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-sm text-charcoal/40">$</span>
                  <input
                    type="number"
                    min="0"
                    value={(item.amount / 100).toFixed(2)}
                    onChange={e => updateItem(idx, 'amount', e.target.value)}
                    disabled={item.locked}
                    className="w-full pl-6 pr-3 py-2 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal focus:outline-none focus:border-coral/40 disabled:opacity-60"
                  />
                </div>
                {lineItems.length > 1 && !item.locked && (
                  <button onClick={() => removeItem(idx)} className="p-1.5 text-charcoal/30 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button onClick={addItem} className="flex items-center gap-1.5 text-xs font-body font-light text-coral hover:text-coral/70 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add line item
          </button>

          <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-cream border border-taupe/15">
            <span className="font-body text-sm font-light text-charcoal/50">Preview balance due</span>
            <span className="font-heading text-xl font-semibold text-coral">${(total / 100).toFixed(2)}</span>
          </div>

          <p className="font-body text-xs text-charcoal/30 font-light text-center">Preview only · Stripe sending locked</p>

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-taupe/20 text-charcoal/50 font-body text-sm font-light hover:border-coral/30 transition-colors">
              Close
            </button>
            <button
              type="button"
              disabled
              className="flex-1 py-3 rounded-2xl bg-coral text-white font-body text-sm tracking-wide flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
            >
              <LockKeyhole className="w-4 h-4" />
              Checkout Locked
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
