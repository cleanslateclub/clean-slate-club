import React, { useState } from 'react';
import { ExternalLink, DollarSign, CalendarPlus, Users, FileText, Zap, LockKeyhole } from 'lucide-react';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';

const CHECKOUT_SERVICES = Object.entries(SERVICE_CONFIG)
  .filter(([k]) => k !== 'consult')
  .map(([k, v]) => ({ key: k, label: v.label, low: v.priceRange?.[0] || 0, high: v.priceRange?.[1] || 0 }));

function QuickCheckoutModal({ onClose }) {
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [service, setService] = useState('');
  const [amount, setAmount] = useState(50);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="bg-warm-white rounded-3xl border border-taupe/15 shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-base font-semibold text-charcoal">Quick Checkout Preview</h3>
          <button onClick={onClose} className="text-charcoal/30 hover:text-charcoal transition-colors text-lg">×</button>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-coral/10 border border-coral/20 p-4 flex items-start gap-3">
            <LockKeyhole className="w-4 h-4 text-coral mt-0.5 shrink-0" />
            <div>
              <p className="font-body text-[10px] uppercase tracking-widest text-coral font-light">Checkout locked</p>
              <p className="font-body text-xs text-charcoal/45 font-light mt-1 leading-relaxed">
                Quick checkout is preview-only until Stripe deposit behavior and owner payment policies are verified. No payment link will be created from this screen.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-body text-xs text-charcoal/50 font-light block mb-1.5">Email</label>
              <input value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="guest@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40" />
            </div>
            <div>
              <label className="font-body text-xs text-charcoal/50 font-light block mb-1.5">Phone</label>
              <input value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="(555) 555-5555"
                className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40" />
            </div>
          </div>
          <div>
            <label className="font-body text-xs text-charcoal/50 font-light block mb-1.5">Service</label>
            <select value={service} onChange={e => setService(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal focus:outline-none focus:border-coral/40">
              <option value="">Select service...</option>
              {CHECKOUT_SERVICES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="font-body text-xs text-charcoal/50 font-light block mb-1.5">Deposit Amount ($)</label>
            <input type="number" value={amount} onChange={e => setAmount(Math.max(0, Number(e.target.value) || 0))} min="0"
              className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal focus:outline-none focus:border-coral/40" />
          </div>
          <button disabled
            className="w-full py-3 rounded-2xl bg-coral text-white font-body text-sm tracking-wide opacity-50 cursor-not-allowed flex items-center justify-center gap-2">
            <LockKeyhole className="w-4 h-4" />
            Checkout Locked
          </button>
          <button onClick={onClose} className="block w-full py-2.5 rounded-2xl border border-taupe/20 text-charcoal/50 font-body text-sm font-light hover:border-coral/30 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function QuickActions() {
  const [showCheckout, setShowCheckout] = useState(false);

  const actions = [
    {
      icon: <CalendarPlus className="w-4 h-4" />,
      label: 'New Booking',
      sub: 'Open booking form',
      href: '/book',
      external: true,
      color: '#EB9486',
    },
    {
      icon: <DollarSign className="w-4 h-4" />,
      label: 'Quick Checkout',
      sub: 'Preview only, locked',
      onClick: () => setShowCheckout(true),
      color: '#CAE7B9',
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: 'View Members',
      sub: 'Membership dashboard',
      href: '/dashboard',
      color: '#EFB988',
    },
    {
      icon: <FileText className="w-4 h-4" />,
      label: 'Services Page',
      sub: 'Public services list',
      href: '/services',
      external: true,
      color: '#B58A90',
    },
  ];

  return (
    <>
      <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-coral" />
          <p className="font-heading text-sm font-semibold text-charcoal">Quick Actions</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {actions.map(a => (
            a.href ? (
              <a key={a.label} href={a.href} target={a.external ? '_blank' : undefined} rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl border border-taupe/15 hover:border-coral/25 bg-cream hover:bg-cream/80 transition-all group">
                <span className="p-1.5 rounded-lg" style={{ background: a.color + '25', color: a.color }}>{a.icon}</span>
                <div>
                  <p className="font-body text-xs font-light text-charcoal group-hover:text-coral transition-colors">{a.label}</p>
                  <p className="font-body text-[10px] text-charcoal/30 font-light">{a.sub}</p>
                </div>
              </a>
            ) : (
              <button key={a.label} onClick={a.onClick}
                className="flex items-center gap-3 p-3 rounded-xl border border-taupe/15 hover:border-coral/25 bg-cream hover:bg-cream/80 transition-all group text-left">
                <span className="p-1.5 rounded-lg" style={{ background: a.color + '25', color: a.color }}>{a.icon}</span>
                <div>
                  <p className="font-body text-xs font-light text-charcoal group-hover:text-coral transition-colors">{a.label}</p>
                  <p className="font-body text-[10px] text-charcoal/30 font-light">{a.sub}</p>
                </div>
              </button>
            )
          ))}
        </div>
      </div>
      {showCheckout && <QuickCheckoutModal onClose={() => setShowCheckout(false)} />}
    </>
  );
}
