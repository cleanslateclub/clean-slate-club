import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  X, MapPin, Phone, Mail, User, Clock, DollarSign, CheckSquare, AlertTriangle,
  ExternalLink, ChevronDown, ChevronUp, Lock, MessageSquare, Edit3, CreditCard,
  FileText, Save, RefreshCw, CheckCircle, XCircle, Tag, Plus, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUSES = [
  { key: 'pending', label: 'New Request' },
  { key: 'needs_review', label: 'Needs Review' },
  { key: 'approved', label: 'Approved' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'provider_assigned', label: 'Assigned' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'no_show', label: 'No Show' },
  { key: 'archived', label: 'Archived' },
];

const SERVICE_CATEGORIES = [
  { key: 'home_reset', label: 'Hot Mess Express' },
  { key: 'meal_prep', label: 'Clean Plate Club' },
  { key: 'mothers_helper', label: 'Chaos Coordinator' },
  { key: 'senior_support', label: 'The Check-In' },
  { key: 'errands', label: 'The Runaround' },
  { key: 'organization', label: 'Room Service' },
  { key: 'family_support', label: 'Family Support' },
  { key: 'consult', label: 'Free Consult' },
];

const STATUS_BADGE = {
  pending:           'bg-coral/15 border-coral/40 text-coral',
  needs_review:      'bg-coral/10 border-coral text-coral',
  approved:          'bg-sage/20 border-sage/60 text-green-700',
  confirmed:         'bg-sage/25 border-sage text-green-800',
  provider_assigned: 'bg-blue-gray/15 border-blue-gray/40 text-blue-gray',
  in_progress:       'bg-peach/20 border-peach/60 text-amber-800',
  completed:         'bg-sage/15 border-sage/40 text-green-600',
  cancelled:         'bg-taupe/15 border-taupe/40 text-charcoal/40',
  no_show:           'bg-red-50 border-red-200 text-red-600',
  archived:          'bg-taupe/10 border-taupe/30 text-charcoal/30',
};

const TIME_SLOTS = [
  '8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
  '12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM',
  '4:00 PM','4:30 PM','5:00 PM','5:30 PM','6:00 PM',
];

function Field({ label, children }) {
  return (
    <div>
      <label className="font-body text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1 block">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, type = 'text', placeholder }) {
  return (
    <input
      type={type}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-body text-gray-900 focus:outline-none focus:border-coral bg-white"
    />
  );
}

function Select({ value, onChange, children }) {
  return (
    <select
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-body text-gray-900 focus:outline-none focus:border-coral bg-white"
    >
      {children}
    </select>
  );
}

// ── EDIT TAB ──────────────────────────────────────────────────────────────────
function EditTab({ booking, onSave, saving }) {
  const [form, setForm] = useState({
    client_name: booking.client_name || '',
    client_email: booking.client_email || '',
    client_phone: booking.client_phone || '',
    client_address: booking.client_address || '',
    service_category: booking.service_category || '',
    service_label: booking.service_label || '',
    scheduled_date: booking.scheduled_date || '',
    scheduled_start_time: booking.scheduled_start_time || '',
    scheduled_end_time: booking.scheduled_end_time || '',
    total_duration_minutes: booking.total_duration_minutes || '',
    provider_name: booking.provider_name || '',
    provider_email: booking.provider_email || '',
    estimated_price_low: booking.estimated_price_low || '',
    estimated_price_high: booking.estimated_price_high || '',
    final_price: booking.final_price || '',
    deposit_amount: booking.deposit_amount || 50,
    deposit_status: booking.deposit_status || 'pending',
    payment_status: booking.payment_status || 'unpaid',
    special_notes: booking.special_notes || '',
    admin_notes: booking.admin_notes || '',
    provider_notes: booking.provider_notes || '',
    addons: booking.addons || [],
    status: booking.status || 'pending',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleServiceChange = (cat) => {
    const svc = SERVICE_CATEGORIES.find(s => s.key === cat);
    set('service_category', cat);
    if (svc) set('service_label', svc.label);
  };

  return (
    <div className="p-4 space-y-5">
      {/* Client */}
      <div>
        <p className="font-body text-[10px] uppercase tracking-widest font-bold text-coral mb-3">Client Info</p>
        <div className="space-y-3">
          <Field label="Full Name"><Input value={form.client_name} onChange={v => set('client_name', v)} /></Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Email"><Input value={form.client_email} onChange={v => set('client_email', v)} type="email" /></Field>
            <Field label="Phone"><Input value={form.client_phone} onChange={v => set('client_phone', v)} type="tel" /></Field>
          </div>
          <Field label="Service Address"><Input value={form.client_address} onChange={v => set('client_address', v)} /></Field>
        </div>
      </div>

      {/* Service */}
      <div>
        <p className="font-body text-[10px] uppercase tracking-widest font-bold text-coral mb-3">Service</p>
        <div className="space-y-3">
          <Field label="Service Category">
            <Select value={form.service_category} onChange={handleServiceChange}>
              <option value="">— Select —</option>
              {SERVICE_CATEGORIES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </Select>
          </Field>
          <Field label="Service Label (display)"><Input value={form.service_label} onChange={v => set('service_label', v)} /></Field>
          <Field label="Status">
            <Select value={form.status} onChange={v => set('status', v)}>
              {STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </Select>
          </Field>
        </div>
      </div>

      {/* Schedule */}
      <div>
        <p className="font-body text-[10px] uppercase tracking-widest font-bold text-coral mb-3">Schedule</p>
        <div className="space-y-3">
          <Field label="Date"><Input value={form.scheduled_date} onChange={v => set('scheduled_date', v)} type="date" /></Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Start Time">
              <Select value={form.scheduled_start_time} onChange={v => set('scheduled_start_time', v)}>
                <option value="">— Time —</option>
                {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>
            <Field label="End Time">
              <Select value={form.scheduled_end_time} onChange={v => set('scheduled_end_time', v)}>
                <option value="">— Time —</option>
                {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>
          </div>
          <Field label="Duration (minutes)"><Input value={form.total_duration_minutes} onChange={v => set('total_duration_minutes', v)} type="number" /></Field>
        </div>
      </div>

      {/* Provider */}
      <div>
        <p className="font-body text-[10px] uppercase tracking-widest font-bold text-coral mb-3">Provider</p>
        <div className="space-y-3">
          <Field label="Provider Name"><Input value={form.provider_name} onChange={v => set('provider_name', v)} /></Field>
          <Field label="Provider Email"><Input value={form.provider_email} onChange={v => set('provider_email', v)} type="email" /></Field>
        </div>
      </div>

      {/* Pricing */}
      <div>
        <p className="font-body text-[10px] uppercase tracking-widest font-bold text-coral mb-3">Pricing</p>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Est. Low ($)"><Input value={form.estimated_price_low} onChange={v => set('estimated_price_low', v)} type="number" /></Field>
            <Field label="Est. High ($)"><Input value={form.estimated_price_high} onChange={v => set('estimated_price_high', v)} type="number" /></Field>
          </div>
          <Field label="Final Price ($)"><Input value={form.final_price} onChange={v => set('final_price', v)} type="number" /></Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Deposit ($)"><Input value={form.deposit_amount} onChange={v => set('deposit_amount', v)} type="number" /></Field>
            <Field label="Deposit Status">
              <Select value={form.deposit_status} onChange={v => set('deposit_status', v)}>
                <option value="not_required">Not Required</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
                <option value="retained">Retained</option>
              </Select>
            </Field>
          </div>
          <Field label="Payment Status">
            <Select value={form.payment_status} onChange={v => set('payment_status', v)}>
              <option value="unpaid">Unpaid</option>
              <option value="deposit_paid">Deposit Paid</option>
              <option value="checkout_sent">Checkout Sent</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="paid">Paid in Full</option>
              <option value="refunded">Refunded</option>
              <option value="disputed">Disputed</option>
            </Select>
          </Field>
        </div>
      </div>

      {/* Notes */}
      <div>
        <p className="font-body text-[10px] uppercase tracking-widest font-bold text-coral mb-3">Notes</p>
        <div className="space-y-3">
          <Field label="Guest Special Notes">
            <textarea value={form.special_notes} onChange={e => set('special_notes', e.target.value)} rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-body text-gray-700 focus:outline-none focus:border-coral resize-none" />
          </Field>
          <Field label="Admin Notes (internal only)">
            <textarea value={form.admin_notes} onChange={e => set('admin_notes', e.target.value)} rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-body text-gray-700 focus:outline-none focus:border-coral resize-none" />
          </Field>
          <Field label="Provider Notes (provider can see)">
            <textarea value={form.provider_notes} onChange={e => set('provider_notes', e.target.value)} rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-body text-gray-700 focus:outline-none focus:border-coral resize-none" />
          </Field>
        </div>
      </div>

      <button
        onClick={() => onSave(form)}
        disabled={saving}
        className="w-full py-3 bg-coral text-white rounded-xl font-body font-bold text-sm hover:bg-coral/90 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Save className="w-4 h-4" />
        {saving ? 'Saving...' : 'Save All Changes'}
      </button>
    </div>
  );
}

// ── CHECKOUT TAB ──────────────────────────────────────────────────────────────
function CheckoutTab({ booking, onSave, saving, showToast }) {
  const [lineItems, setLineItems] = useState(() => {
    const items = [];
    if (booking.service_label || booking.service_category) {
      items.push({
        id: 1,
        description: booking.service_label || booking.service_category?.replace(/_/g, ' '),
        qty: 1,
        rate: booking.final_price || booking.estimated_price_high || 0,
      });
    }
    if (booking.addons?.length) {
      booking.addons.forEach((a, i) => items.push({ id: i + 2, description: a, qty: 1, rate: 0 }));
    }
    if (!items.length) {
      items.push({ id: 1, description: 'Service', qty: 1, rate: 0 });
    }
    return items;
  });
  const [depositPaid] = useState(booking.deposit_status === 'paid' ? (booking.deposit_amount || 50) : 0);
  const [discount, setDiscount] = useState(0);
  const [discountNote, setDiscountNote] = useState('');
  const [tip, setTip] = useState(0);
  const [checkoutNote, setCheckoutNote] = useState('');
  const [nextId, setNextId] = useState(lineItems.length + 1);

  const subtotal = lineItems.reduce((s, i) => s + (parseFloat(i.rate) || 0) * (parseFloat(i.qty) || 1), 0);
  const discountAmt = parseFloat(discount) || 0;
  const tipAmt = parseFloat(tip) || 0;
  const total = subtotal - discountAmt + tipAmt;
  const balanceDue = Math.max(0, total - depositPaid);

  const addLine = () => {
    setLineItems(prev => [...prev, { id: nextId, description: '', qty: 1, rate: 0 }]);
    setNextId(n => n + 1);
  };
  const removeLine = (id) => setLineItems(prev => prev.filter(i => i.id !== id));
  const updateLine = (id, field, val) => setLineItems(prev => prev.map(i => i.id === id ? { ...i, [field]: val } : i));

  const handleFinalizeCheckout = async () => {
    const updates = {
      final_price: total,
      payment_status: 'checkout_sent',
      checkout_sent_at: new Date().toISOString(),
      admin_notes: (booking.admin_notes ? booking.admin_notes + '\n' : '') + `Checkout sent: $${balanceDue.toFixed(2)} due. ${checkoutNote}`,
    };
    await onSave(updates);
    showToast(`Checkout prepared — balance due: $${balanceDue.toFixed(2)}`);
  };

  return (
    <div className="p-4 space-y-5">
      {/* Line items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="font-body text-[10px] uppercase tracking-widest font-bold text-coral">Line Items</p>
          <button onClick={addLine} className="flex items-center gap-1 text-xs font-body text-coral hover:text-coral/70">
            <Plus className="w-3.5 h-3.5" /> Add line
          </button>
        </div>
        <div className="space-y-2">
          {/* header */}
          <div className="grid grid-cols-12 gap-1 px-1">
            <span className="col-span-6 font-body text-[9px] uppercase tracking-wider text-gray-400">Description</span>
            <span className="col-span-2 font-body text-[9px] uppercase tracking-wider text-gray-400 text-center">Qty</span>
            <span className="col-span-3 font-body text-[9px] uppercase tracking-wider text-gray-400 text-right">Rate</span>
            <span className="col-span-1" />
          </div>
          {lineItems.map(item => (
            <div key={item.id} className="grid grid-cols-12 gap-1 items-center bg-cream/40 rounded-lg px-2 py-2">
              <input
                className="col-span-6 text-sm font-body text-gray-900 bg-transparent border-b border-gray-200 focus:outline-none focus:border-coral px-1 py-0.5"
                value={item.description}
                onChange={e => updateLine(item.id, 'description', e.target.value)}
                placeholder="Item..."
              />
              <input
                className="col-span-2 text-sm font-body text-gray-900 bg-transparent border-b border-gray-200 focus:outline-none focus:border-coral text-center px-1 py-0.5"
                value={item.qty}
                type="number"
                min="1"
                onChange={e => updateLine(item.id, 'qty', e.target.value)}
              />
              <input
                className="col-span-3 text-sm font-body text-gray-900 bg-transparent border-b border-gray-200 focus:outline-none focus:border-coral text-right px-1 py-0.5"
                value={item.rate}
                type="number"
                onChange={e => updateLine(item.id, 'rate', e.target.value)}
                placeholder="0"
              />
              <button onClick={() => removeLine(item.id)} className="col-span-1 flex justify-center text-gray-300 hover:text-red-400">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Adjustments */}
      <div className="space-y-2">
        <p className="font-body text-[10px] uppercase tracking-widest font-bold text-coral">Adjustments</p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="font-body text-[10px] text-gray-400 uppercase tracking-wider">Discount ($)</label>
            <input type="number" value={discount} onChange={e => setDiscount(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-body text-gray-900 focus:outline-none focus:border-coral mt-1" />
          </div>
          <div>
            <label className="font-body text-[10px] text-gray-400 uppercase tracking-wider">Tip ($)</label>
            <input type="number" value={tip} onChange={e => setTip(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-body text-gray-900 focus:outline-none focus:border-coral mt-1" />
          </div>
        </div>
        {discountAmt > 0 && (
          <input placeholder="Discount reason (optional)..." value={discountNote} onChange={e => setDiscountNote(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-body text-gray-500 focus:outline-none focus:border-coral" />
        )}
      </div>

      {/* Totals */}
      <div className="bg-cream rounded-xl border border-taupe/15 p-4 space-y-2">
        <div className="flex justify-between font-body text-sm text-gray-700">
          <span>Subtotal</span><span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        {discountAmt > 0 && (
          <div className="flex justify-between font-body text-sm text-green-700">
            <span>Discount{discountNote ? ` (${discountNote})` : ''}</span><span>− ${discountAmt.toFixed(2)}</span>
          </div>
        )}
        {tipAmt > 0 && (
          <div className="flex justify-between font-body text-sm text-gray-700">
            <span>Tip</span><span>+ ${tipAmt.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-body text-sm text-gray-700 border-t border-taupe/10 pt-2">
          <span>Total</span><span className="font-semibold">${total.toFixed(2)}</span>
        </div>
        {depositPaid > 0 && (
          <div className="flex justify-between font-body text-sm text-green-700">
            <span>Deposit Paid</span><span>− ${depositPaid.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-heading text-base font-bold text-gray-900 border-t border-taupe/15 pt-2">
          <span>Balance Due</span><span className="text-coral">${balanceDue.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout note */}
      <div>
        <label className="font-body text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1 block">Note to client (optional)</label>
        <textarea value={checkoutNote} onChange={e => setCheckoutNote(e.target.value)} rows={2}
          placeholder="e.g. Thank you! Balance due at completion."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-body text-gray-700 focus:outline-none focus:border-coral resize-none" />
      </div>

      <button
        onClick={handleFinalizeCheckout}
        disabled={saving}
        className="w-full py-3 bg-coral text-white rounded-xl font-body font-bold text-sm hover:bg-coral/90 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <CreditCard className="w-4 h-4" />
        {saving ? 'Saving...' : `Finalize Checkout — $${balanceDue.toFixed(2)} Due`}
      </button>
      <p className="text-center font-body text-xs text-gray-400">This saves the final price and marks checkout as sent. Live payment collection coming soon.</p>
    </div>
  );
}

// ── QUOTE TAB ─────────────────────────────────────────────────────────────────
function QuoteTab({ booking }) {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!booking.client_email) { setLoading(false); return; }
    base44.entities.Quote.filter({ client_email: booking.client_email })
      .then(results => {
        const match = results?.find(q => q.service_category === booking.service_category) || results?.[0];
        setQuote(match || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [booking.client_email, booking.service_category]);

  if (loading) return <div className="flex justify-center p-10"><div className="w-5 h-5 border-2 border-coral border-t-transparent rounded-full animate-spin" /></div>;

  if (!quote) return (
    <div className="p-6 text-center">
      <FileText className="w-10 h-10 mx-auto text-gray-200 mb-3" />
      <p className="font-body text-sm font-semibold text-gray-600">No quote on file</p>
      <p className="font-body text-xs text-gray-400 mt-1">This booking was made without a prior online quote, or it hasn't been linked yet.</p>
    </div>
  );

  const ia = quote.intake_answers || {};

  return (
    <div className="p-4 space-y-4">
      <div className="bg-cream rounded-xl border border-taupe/15 p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-heading text-base font-semibold text-gray-900">Original Quote</p>
          <span className={`px-2 py-0.5 rounded-full border text-[9px] uppercase tracking-wider font-body font-bold
            ${quote.status === 'accepted' ? 'bg-sage/20 border-sage text-green-700' : 'bg-butter/15 border-butter text-amber-700'}`}>
            {quote.status}
          </span>
        </div>
        <div className="space-y-2 text-sm font-body">
          <div className="flex justify-between">
            <span className="text-gray-500">Service</span>
            <span className="font-semibold text-gray-800">{quote.service_category?.replace(/_/g, ' ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Quoted Price</span>
            <span className="font-bold text-coral">${quote.estimated_price_low} – ${quote.estimated_price_high}</span>
          </div>
          {quote.total_duration_minutes && (
            <div className="flex justify-between">
              <span className="text-gray-500">Est. Duration</span>
              <span className="font-semibold text-gray-800">{quote.total_duration_minutes} min</span>
            </div>
          )}
          {quote.sent_date && (
            <div className="flex justify-between">
              <span className="text-gray-500">Sent</span>
              <span className="font-semibold text-gray-800">{quote.sent_date}</span>
            </div>
          )}
          {quote.accepted_date && (
            <div className="flex justify-between">
              <span className="text-gray-500">Accepted</span>
              <span className="font-semibold text-green-700">{quote.accepted_date}</span>
            </div>
          )}
        </div>
      </div>

      {/* Add-ons from quote */}
      {quote.addons?.length > 0 && (
        <div>
          <p className="font-body text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-2">Quoted Add-ons</p>
          <div className="space-y-1">
            {quote.addons.map(a => (
              <div key={a} className="flex items-center gap-2 text-sm font-body text-gray-700">
                <Tag className="w-3.5 h-3.5 text-gray-400" />
                {a.replace(/_/g, ' ')}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Intake answers */}
      {Object.keys(ia).length > 0 && (
        <div>
          <p className="font-body text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-2">Intake Answers</p>
          <div className="space-y-2">
            {Object.entries(ia).map(([k, v]) => v ? (
              <div key={k} className="bg-cream/60 rounded-lg p-3 border border-taupe/10">
                <p className="font-body text-[10px] uppercase tracking-wider text-gray-400">{k.replace(/_/g, ' ')}</p>
                <p className="font-body text-sm text-gray-800 font-medium mt-0.5">{String(v)}</p>
              </div>
            ) : null)}
          </div>
        </div>
      )}

      {quote.admin_notes && (
        <div className="bg-coral/5 border border-coral/20 rounded-xl p-3">
          <p className="font-body text-[10px] uppercase tracking-wider text-coral mb-1">Quote Notes</p>
          <p className="font-body text-sm text-gray-700">{quote.admin_notes}</p>
        </div>
      )}
    </div>
  );
}

// ── ACTIONS TAB ───────────────────────────────────────────────────────────────
function ActionsTab({ booking, onStatusChange, onSendSms, onDelete, saving }) {
  const quickStatuses = [
    { key: 'approved', label: 'Approve', icon: CheckCircle, variant: 'success' },
    { key: 'confirmed', label: 'Confirm', icon: CheckSquare, variant: 'success' },
    { key: 'in_progress', label: 'In Progress', icon: RefreshCw, variant: 'default' },
    { key: 'completed', label: 'Complete', icon: CheckCircle, variant: 'success' },
    { key: 'needs_review', label: 'Flag Review', icon: AlertTriangle, variant: 'warn' },
    { key: 'cancelled', label: 'Cancel', icon: XCircle, variant: 'danger' },
    { key: 'no_show', label: 'No Show', icon: AlertTriangle, variant: 'danger' },
  ];

  return (
    <div className="p-4 space-y-4">
      <div>
        <p className="font-body text-[10px] uppercase tracking-widest font-bold text-coral mb-3">Quick Status</p>
        <div className="grid grid-cols-2 gap-2">
          {quickStatuses.map(s => {
            const Icon = s.icon;
            const active = booking.status === s.key;
            const colors = {
              success: active ? 'bg-sage text-white border-sage' : 'border-sage/40 text-green-700 hover:bg-sage/15',
              danger: active ? 'bg-red-400 text-white border-red-400' : 'border-red-200 text-red-500 hover:bg-red-50',
              warn: active ? 'bg-butter text-amber-800 border-butter' : 'border-butter/50 text-amber-700 hover:bg-butter/15',
              default: active ? 'bg-blue-gray text-white border-blue-gray' : 'border-blue-gray/30 text-blue-gray hover:bg-blue-gray/10',
            };
            return (
              <button key={s.key} onClick={() => onStatusChange(s.key)} disabled={saving || active}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-body font-semibold border transition-all ${colors[s.variant]}`}>
                <Icon className="w-4 h-4" />
                {s.label}
                {active && <span className="ml-auto text-[9px] uppercase tracking-wider opacity-70">Current</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-taupe/10 pt-4 space-y-2">
        <p className="font-body text-[10px] uppercase tracking-widest font-bold text-coral mb-3">Communications</p>
        <button onClick={onSendSms} disabled={saving || !booking.client_phone}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-body font-semibold border border-blue-gray/30 text-blue-gray hover:bg-blue-gray/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
          <MessageSquare className="w-4 h-4" />
          Send SMS Confirmation
          {!booking.client_phone && <span className="ml-auto text-[9px] text-gray-400">No phone</span>}
        </button>
      </div>

      <div className="border-t border-taupe/10 pt-4 space-y-2">
        <p className="font-body text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3">Requires Integration</p>
        {[
          { label: 'Charge Final Balance', icon: DollarSign },
          { label: 'Issue Refund', icon: RefreshCw },
          { label: 'Send Payment Link', icon: CreditCard },
        ].map(a => (
          <div key={a.label} className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-taupe/10 text-gray-300 cursor-not-allowed">
            <Lock className="w-3.5 h-3.5" />
            <span className="font-body text-sm font-semibold">{a.label}</span>
            <span className="ml-auto font-body text-[9px] uppercase tracking-wider text-gray-300">Locked</span>
          </div>
        ))}
      </div>

      {/* Meta */}
      {onDelete && (
        <div className="border-t border-taupe/10 pt-4">
          <p className="font-body text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Danger Zone</p>
          <button
            onClick={() => { if (window.confirm('Permanently delete this booking? This cannot be undone.')) onDelete(); }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-body font-semibold border border-red-200 text-red-500 hover:bg-red-50 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Delete Booking Permanently
          </button>
        </div>
      )}

      <div className="border-t border-taupe/10 pt-4">
        <p className="font-body text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Booking Info</p>
        <div className="space-y-1 font-body text-xs text-gray-600">
          <p>ID: <span className="font-mono text-gray-400">{booking.id?.slice(-12)}</span></p>
          <p>Source: <span className="font-semibold">{booking.booking_source?.replace(/_/g, ' ') || 'unknown'}</span></p>
          <p>Created: <span className="font-semibold">{booking.created_date ? new Date(booking.created_date).toLocaleString() : '—'}</span></p>
        </div>
      </div>
    </div>
  );
}

// ── MAIN DRAWER ───────────────────────────────────────────────────────────────
export default function BookingDrawer({ booking, onClose, onUpdate, onDelete }) {
  const [tab, setTab] = useState('edit');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [currentBooking, setCurrentBooking] = useState(booking);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async (updates) => {
    setSaving(true);
    try {
      await base44.entities.Booking.update(currentBooking.id, updates);
      const merged = { ...currentBooking, ...updates };
      setCurrentBooking(merged);
      onUpdate(currentBooking.id, updates);
      showToast('Saved successfully');
    } catch (e) {
      showToast('Save failed: ' + e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    await handleSave({ status: newStatus });
  };

  const handleSendSms = async () => {
    if (!currentBooking.client_phone) { showToast('No phone number on file', 'error'); return; }
    setSaving(true);
    try {
      const dateStr = currentBooking.scheduled_date
        ? new Date(currentBooking.scheduled_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
        : 'TBD';
      await base44.functions.invoke('sendClientSmsConfirmation', {
        clientPhone: currentBooking.client_phone,
        clientName: currentBooking.client_name,
        message: `Hi ${currentBooking.client_name?.split(' ')[0]}! ✨ This is a reminder from Clean Slate Club — your ${currentBooking.service_label || currentBooking.service_category?.replace(/_/g, ' ')} is confirmed for ${dateStr} at ${currentBooking.scheduled_start_time || 'TBD'}. Questions? Text us at (215) 500-3758. Reply STOP to opt out.`,
      });
      showToast('SMS sent!');
    } catch (e) {
      showToast('SMS failed: ' + e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const TABS = [
    { key: 'edit', label: 'Edit', icon: Edit3 },
    { key: 'checkout', label: 'Checkout', icon: CreditCard },
    { key: 'quote', label: 'Quote', icon: FileText },
    { key: 'actions', label: 'Actions', icon: CheckSquare },
  ];

  const displayDate = currentBooking.scheduled_date
    ? new Date(currentBooking.scheduled_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    : 'Date TBD';

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-[480px] shrink-0 bg-white border-l border-taupe/15 flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`absolute top-3 left-4 right-4 z-10 rounded-xl px-4 py-2.5 text-xs font-body text-white shadow-lg ${toast.type === 'error' ? 'bg-red-500' : 'bg-sage'}`}>
              {toast.msg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="px-4 pt-4 pb-0 border-b border-taupe/10 bg-cream/50">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h2 className="font-heading text-xl font-bold text-gray-900">{currentBooking.client_name}</h2>
              <p className="font-body text-sm font-medium text-gray-600">
                {currentBooking.service_label || currentBooking.service_category?.replace(/_/g, ' ')}
                {currentBooking.scheduled_date ? <span className="text-gray-400"> · {displayDate}</span> : ''}
              </p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[9px] font-body uppercase tracking-wider font-bold ${STATUS_BADGE[currentBooking.status] || 'bg-taupe/10 border-taupe text-charcoal/40'}`}>
                  {currentBooking.status?.replace(/_/g, ' ')}
                </span>
                {currentBooking.member_at_booking && (
                  <span className="px-2.5 py-0.5 rounded-full border border-coral/30 bg-coral/8 text-[9px] font-body text-coral font-bold">✦ Member</span>
                )}
                {currentBooking.final_price && (
                  <span className="px-2.5 py-0.5 rounded-full border border-sage/40 bg-sage/10 text-[9px] font-body text-green-700 font-bold">${currentBooking.final_price}</span>
                )}
                {!currentBooking.final_price && currentBooking.estimated_price_low && (
                  <span className="px-2.5 py-0.5 rounded-full border border-taupe/30 bg-cream text-[9px] font-body text-gray-600 font-bold">Est. ${currentBooking.estimated_price_low}–${currentBooking.estimated_price_high}</span>
                )}
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-taupe/10 rounded-lg transition-colors text-charcoal/40 ml-2 shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab bar */}
          <div className="flex gap-0.5 mt-2">
            {TABS.map(t => {
              const Icon = t.icon;
              return (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-body font-semibold transition-all border-b-2 ${
                    tab === t.key
                      ? 'border-coral text-coral'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}>
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          {tab === 'edit' && <EditTab booking={currentBooking} onSave={handleSave} saving={saving} />}
          {tab === 'checkout' && <CheckoutTab booking={currentBooking} onSave={handleSave} saving={saving} showToast={showToast} />}
          {tab === 'quote' && <QuoteTab booking={currentBooking} />}
          {tab === 'actions' && <ActionsTab booking={currentBooking} onStatusChange={handleStatusChange} onSendSms={handleSendSms} onDelete={onDelete ? () => onDelete(currentBooking.id) : null} saving={saving} />}
        </div>
      </motion.div>
    </div>
  );
}