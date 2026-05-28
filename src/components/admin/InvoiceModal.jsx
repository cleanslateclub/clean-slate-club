import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Plus, Trash2, Send } from 'lucide-react';

export default function InvoiceModal({ booking, onClose }) {
  const cfg = booking._cfg;

  const defaultItems = [
    {
      description: cfg?.label || booking.service_category,
      amount: Math.round(((booking.estimated_price_low || 0) + (booking.estimated_price_high || 0)) / 2) * 100,
    },
  ];

  const [lineItems, setLineItems] = useState(defaultItems);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const [invoiceUrl, setInvoiceUrl] = useState(null);

  const total = lineItems.reduce((s, i) => s + (i.amount || 0), 0);

  const updateItem = (idx, field, value) => {
    setLineItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: field === 'amount' ? Math.round(parseFloat(value || 0) * 100) : value } : item));
  };

  const addItem = () => setLineItems(prev => [...prev, { description: '', amount: 0 }]);
  const removeItem = (idx) => setLineItems(prev => prev.filter((_, i) => i !== idx));

  const handleSend = async () => {
    setSending(true);
    setError(null);
    try {
      const res = await base44.functions.invoke('sendInvoice', {
        bookingId: booking.id,
        clientName: booking.client_name,
        clientEmail: booking.client_email,
        serviceLabel: cfg?.label || booking.service_category,
        amountCents: total,
        lineItems,
      });
      setInvoiceUrl(res.data?.invoiceUrl);
      setSent(true);
    } catch (e) {
      setError('Failed to send invoice. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="bg-warm-white rounded-3xl border border-taupe/15 shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-taupe/10">
          <div>
            <h3 className="font-heading text-lg font-semibold text-charcoal">Send Invoice</h3>
            <p className="font-body text-xs text-charcoal/40 font-light mt-0.5">To: {booking.client_name} · {booking.client_email}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-taupe/10 transition-colors text-charcoal/40">
            <X className="w-4 h-4" />
          </button>
        </div>

        {sent ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-sage/30 flex items-center justify-center mx-auto mb-4 text-lg">✓</div>
            <h4 className="font-heading text-lg font-semibold text-charcoal mb-1">Invoice sent!</h4>
            <p className="font-body text-sm text-charcoal/45 font-light mb-4">Stripe invoice delivered to {booking.client_email}</p>
            {invoiceUrl && (
              <a href={invoiceUrl} target="_blank" rel="noreferrer"
                className="text-coral text-xs font-body font-light underline">
                View invoice →
              </a>
            )}
            <button onClick={onClose} className="mt-6 block w-full py-3 rounded-2xl bg-coral text-white font-body text-sm tracking-wide">
              Done
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {/* Line items */}
            <div className="space-y-2">
              {lineItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    value={item.description}
                    onChange={e => updateItem(idx, 'description', e.target.value)}
                    placeholder="Description"
                    className="flex-1 px-3 py-2 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40"
                  />
                  <div className="relative w-24">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-sm text-charcoal/40">$</span>
                    <input
                      type="number"
                      value={(item.amount / 100).toFixed(2)}
                      onChange={e => updateItem(idx, 'amount', e.target.value)}
                      className="w-full pl-6 pr-3 py-2 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal focus:outline-none focus:border-coral/40"
                    />
                  </div>
                  {lineItems.length > 1 && (
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

            {/* Total */}
            <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-cream border border-taupe/15">
              <span className="font-body text-sm font-light text-charcoal/50">Total</span>
              <span className="font-heading text-xl font-semibold text-coral">${(total / 100).toFixed(2)}</span>
            </div>

            {/* Due in 7 days note */}
            <p className="font-body text-xs text-charcoal/30 font-light text-center">Payment due in 7 days · Powered by Stripe</p>

            {error && <p className="text-red-500 text-xs font-body text-center">{error}</p>}

            <div className="flex gap-3 pt-1">
              <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-taupe/20 text-charcoal/50 font-body text-sm font-light hover:border-coral/30 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={sending || lineItems.some(i => !i.description)}
                className="flex-1 py-3 rounded-2xl bg-coral text-white font-body text-sm tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90 transition-all"
              >
                <Send className="w-4 h-4" />
                {sending ? 'Sending...' : 'Send Invoice'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}