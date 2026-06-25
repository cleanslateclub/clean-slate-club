import React, { useMemo, useState } from 'react';
import { CreditCard, LockKeyhole, ReceiptText } from 'lucide-react';

const centsToDollars = (value = 0) => `$${(Number(value || 0) / 100).toFixed(2)}`;
const dollarsToCents = (value = '') => Math.round(Number(String(value).replace(/[^0-9.]/g, '') || 0) * 100);

export default function CheckoutPreviewPanel({ invoice }) {
  const [manualSubtotal, setManualSubtotal] = useState('300.00');
  const [manualDeposit, setManualDeposit] = useState('50.00');
  const [manualDiscount, setManualDiscount] = useState('0.00');
  const [manualTip, setManualTip] = useState('0.00');

  const preview = useMemo(() => {
    const subtotal = invoice?.subtotal_cents ?? dollarsToCents(manualSubtotal);
    const deposit = invoice?.deposit_cents ?? dollarsToCents(manualDeposit);
    const discount = invoice?.discount_cents ?? dollarsToCents(manualDiscount);
    const tip = invoice?.tip_cents ?? dollarsToCents(manualTip);
    const total = invoice?.total_cents ?? Math.max(subtotal - discount + tip, 0);
    const paid = invoice?.amount_paid_cents ?? deposit;
    const balance = invoice?.balance_due_cents ?? Math.max(total - paid, 0);

    return { subtotal, deposit, discount, tip, total, paid, balance };
  }, [invoice, manualSubtotal, manualDeposit, manualDiscount, manualTip]);

  return (
    <div className="rounded-3xl bg-warm-white border border-taupe/15 p-6 space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Checkout preview</p>
          <h3 className="font-heading text-2xl text-charcoal mt-1">Final balance calculator</h3>
          <p className="font-body text-sm text-charcoal/45 font-light mt-2 max-w-3xl leading-relaxed">
            Preview-only final checkout math. This does not create Stripe links, send checkout messages, charge cards, refund payments, or save invoice changes.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-coral/20 bg-coral/10 px-3 py-1 text-[10px] font-body uppercase tracking-widest text-coral">
          <LockKeyhole className="w-3 h-3" />
          Checkout locked
        </span>
      </div>

      {!invoice && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <label className="block">
            <span className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Subtotal</span>
            <input value={manualSubtotal} onChange={(event) => setManualSubtotal(event.target.value)} className="mt-1 w-full rounded-2xl border border-taupe/15 bg-cream px-3 py-2 font-body text-sm text-charcoal/60 outline-none focus:border-coral/30" />
          </label>
          <label className="block">
            <span className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Deposit paid</span>
            <input value={manualDeposit} onChange={(event) => setManualDeposit(event.target.value)} className="mt-1 w-full rounded-2xl border border-taupe/15 bg-cream px-3 py-2 font-body text-sm text-charcoal/60 outline-none focus:border-coral/30" />
          </label>
          <label className="block">
            <span className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Discount</span>
            <input value={manualDiscount} onChange={(event) => setManualDiscount(event.target.value)} className="mt-1 w-full rounded-2xl border border-taupe/15 bg-cream px-3 py-2 font-body text-sm text-charcoal/60 outline-none focus:border-coral/30" />
          </label>
          <label className="block">
            <span className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Tip</span>
            <input value={manualTip} onChange={(event) => setManualTip(event.target.value)} className="mt-1 w-full rounded-2xl border border-taupe/15 bg-cream px-3 py-2 font-body text-sm text-charcoal/60 outline-none focus:border-coral/30" />
          </label>
        </div>
      )}

      <div className="rounded-3xl bg-cream border border-taupe/10 p-5">
        <div className="flex items-center gap-2 mb-4">
          <ReceiptText className="w-4 h-4 text-coral/70" />
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Balance summary</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl bg-warm-white border border-taupe/15 p-4">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Subtotal</p>
            <p className="font-heading text-xl text-charcoal mt-1">{centsToDollars(preview.subtotal)}</p>
          </div>
          <div className="rounded-2xl bg-warm-white border border-taupe/15 p-4">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Paid/deposit</p>
            <p className="font-heading text-xl text-charcoal mt-1">{centsToDollars(preview.paid)}</p>
          </div>
          <div className="rounded-2xl bg-warm-white border border-taupe/15 p-4">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Balance due</p>
            <p className="font-heading text-xl text-coral mt-1">{centsToDollars(preview.balance)}</p>
          </div>
        </div>
        <div className="rounded-2xl bg-warm-white border border-taupe/15 p-4 mt-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-sage" />
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Checkout action status</p>
          </div>
          <p className="font-body text-sm text-charcoal/45 font-light mt-2">
            Final checkout actions are intentionally disabled until Stripe checkout behavior, message sending, and owner payment policies are confirmed in Base44.
          </p>
        </div>
      </div>
    </div>
  );
}
