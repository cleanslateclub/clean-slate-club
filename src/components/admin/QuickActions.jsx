import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { ExternalLink, DollarSign, CalendarPlus, Users, FileText, Zap } from 'lucide-react';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';

const CHECKOUT_SERVICES = Object.entries(SERVICE_CONFIG)
  .filter(([k]) => k !== 'consult')
  .map(([k, v]) => ({ key: k, label: v.label, low: v.basePrice?.[0] || 0, high: v.basePrice?.[1] || 0 }));

function QuickCheckoutModal({ onClose }) {
  const [clientEmail, setClientEmail] = useState('');
  const [service, setService] = useState('');
  const [amount, setAmount] = useState(50);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(null);

  const handleCreate = async () => {
    setLoading(true);
    const res = await base44.functions.invoke('createDepositPaymentIntent', {
      amount: amount * 100,
      customerEmail: clientEmail,
      serviceLabel: SERVICE_CONFIG[service]?.label || service,
      bookingId: 'manual-' + Date.now(),
    });
    setUrl(res.data?.checkoutUrl || res.data?.url);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="bg-warm-white rounded-3xl border border-taupe/15 shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-base font-semibold text-charcoal">Quick Checkout Link</h3>
          <button onClick={onClose} className="text-charcoal/30 hover:text-charcoal transition-colors text-lg">×</button>
        </div>

        {url ? (
          <div className="text-center space-y-4">
            <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center mx-auto text-base">✓</div>
            <p className="font-body text-sm text-charcoal/60 font-light">Checkout link created!</p>
            <a href={url} target="_blank" rel="noreferrer"
              className="block w-full py-3 rounded-2xl bg-coral text-white font-body text-sm tracking-wide text-center hover:opacity-90 transition-all">
              Open Checkout →
            </a>
            <button
              onClick={() => { navigator.clipboard.writeText(url); }}
              className="block w-full py-2.5 rounded-2xl border border-taupe/20 text-charcoal/50 font-body text-sm font-light hover:border-coral/30 transition-colors">
              Copy Link
            </button>
            <button onClick={onClose} className="font-body text-xs text-charcoal/30 font-light hover:text-charcoal transition-colors">Done</button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="font-body text-xs text-charcoal/50 font-light block mb-1.5">Client Email</label>
              <input value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="client@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40" />
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
              <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} min="1"
                className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal focus:outline-none focus:border-coral/40" />
            </div>
            <button onClick={handleCreate} disabled={!clientEmail || !service || loading}
              className="w-full py-3 rounded-2xl bg-coral text-white font-body text-sm tracking-wide disabled:opacity-40 hover:opacity-90 transition-all flex items-center justify-center gap-2">
              <DollarSign className="w-4 h-4" />
              {loading ? 'Creating...' : 'Create Checkout Link'}
            </button>
          </div>
        )}
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
      sub: 'Create a payment link',
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