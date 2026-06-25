import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Calendar, Clock, User, Phone, Mail, MapPin, ChevronDown } from 'lucide-react';

const SERVICE_OPTIONS = [
  { key: 'home_reset', label: 'Hot Mess Express — Home Reset' },
  { key: 'meal_prep', label: 'Clean Plate Club — Meal Prep' },
  { key: 'mothers_helper', label: 'Chaos Coordinator — Family Support' },
  { key: 'senior_support', label: 'The Check-In — Senior Support' },
  { key: 'errands', label: 'The Runaround — Errands' },
  { key: 'organization', label: 'Room Service — Organization' },
  { key: 'consult', label: 'Free Consult' },
];

const TIME_SLOTS = [
  '8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM','10:30 AM',
  '11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM',
  '2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM',
];

export default function CalendarNewBookingModal({ defaultDate, defaultTime, onClose, onSuccess }) {
  const [form, setForm] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    client_address: '',
    service_category: 'home_reset',
    scheduled_date: defaultDate || new Date().toISOString().split('T')[0],
    scheduled_start_time: defaultTime || '10:00 AM',
    total_duration_minutes: 180,
    estimated_price_low: 145,
    estimated_price_high: 275,
    status: 'confirmed',
    booking_source: 'admin_manual',
    admin_notes: '',
  });
  const [providers, setProviders] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    base44.entities.Provider.filter({ status: 'active' }).then(p => setProviders(p || []));
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Auto-set price/duration when service changes
  const handleServiceChange = (key) => {
    const defaults = {
      home_reset:    { low: 145, high: 275, dur: 180 },
      meal_prep:     { low: 125, high: 250, dur: 180 },
      mothers_helper:{ low: 95,  high: 180, dur: 120 },
      senior_support:{ low: 85,  high: 150, dur: 120 },
      errands:       { low: 75,  high: 140, dur: 120 },
      organization:  { low: 125, high: 225, dur: 120 },
      consult:       { low: 0,   high: 0,   dur: 15  },
    };
    const d = defaults[key] || { low: 0, high: 0, dur: 120 };
    setForm(f => ({ ...f, service_category: key, estimated_price_low: d.low, estimated_price_high: d.high, total_duration_minutes: d.dur }));
  };

  const submit = async () => {
    if (!form.client_name || !form.client_email) { setError('Name and email are required.'); return; }
    if (!form.scheduled_date) { setError('Please select a date.'); return; }
    setSaving(true);
    setError('');
    try {
      const serviceLabel = SERVICE_OPTIONS.find(s => s.key === form.service_category)?.label || form.service_category;
      const booking = await base44.entities.Booking.create({
        ...form,
        service_label: serviceLabel,
        deposit_status: 'not_required',
        payment_status: 'unpaid',
      });

      // Create time block
      const timeToMin = (t) => {
        const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (!m) return 600;
        let h = parseInt(m[1]); const min = parseInt(m[2]); const p = m[3].toUpperCase();
        if (p === 'PM' && h !== 12) h += 12;
        if (p === 'AM' && h === 12) h = 0;
        return h * 60 + min;
      };
      const minToStr = (mins) => {
        const h = Math.floor(mins / 60); const m = mins % 60;
        const p = h >= 12 ? 'PM' : 'AM'; const dh = h > 12 ? h - 12 : h === 0 ? 12 : h;
        return `${dh}:${m.toString().padStart(2,'0')} ${p}`;
      };
      const startMins = timeToMin(form.scheduled_start_time);
      const endMins = startMins + (form.total_duration_minutes || 120);
      await base44.entities.TimeBlock.create({
        date: form.scheduled_date,
        start_time: form.scheduled_start_time,
        end_time: minToStr(endMins),
        booking_id: booking.id,
        provider_name: form.provider_name || '',
        block_type: 'booking',
        status: 'active',
        label: `${form.client_name} — ${serviceLabel}`,
      });

      onSuccess(booking);
    } catch (e) {
      setError('Failed to save: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="font-heading text-lg font-bold text-gray-900">New Booking</h2>
            <p className="font-body text-xs text-gray-500">Admin-created appointment</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm font-body text-red-700">{error}</div>}

          {/* Client info */}
          <div>
            <p className="font-body text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Client Information</p>
            <div className="space-y-3">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={form.client_name} onChange={e => set('client_name', e.target.value)} placeholder="Full name *"
                  className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-3 py-3 text-sm font-body text-gray-900 focus:outline-none focus:border-coral placeholder-gray-400" />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={form.client_email} onChange={e => set('client_email', e.target.value)} placeholder="Email address *" type="email"
                  className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-3 py-3 text-sm font-body text-gray-900 focus:outline-none focus:border-coral placeholder-gray-400" />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={form.client_phone} onChange={e => set('client_phone', e.target.value)} placeholder="Phone number"
                  className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-3 py-3 text-sm font-body text-gray-900 focus:outline-none focus:border-coral placeholder-gray-400" />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={form.client_address} onChange={e => set('client_address', e.target.value)} placeholder="Service address"
                  className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-3 py-3 text-sm font-body text-gray-900 focus:outline-none focus:border-coral placeholder-gray-400" />
              </div>
            </div>
          </div>

          {/* Service */}
          <div>
            <p className="font-body text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Service</p>
            <select value={form.service_category} onChange={e => handleServiceChange(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-3 text-sm font-body text-gray-900 focus:outline-none focus:border-coral">
              {SERVICE_OPTIONS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>

          {/* Date & Time */}
          <div>
            <p className="font-body text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Date & Time</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="date" value={form.scheduled_date} onChange={e => set('scheduled_date', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-3 py-3 text-sm font-body text-gray-900 focus:outline-none focus:border-coral" />
              </div>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select value={form.scheduled_start_time} onChange={e => set('scheduled_start_time', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-3 py-3 text-sm font-body text-gray-900 focus:outline-none focus:border-coral appearance-none">
                  {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Duration & Price */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-body text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Duration (min)</label>
              <input type="number" value={form.total_duration_minutes} onChange={e => set('total_duration_minutes', parseInt(e.target.value))}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body text-gray-900 focus:outline-none focus:border-coral" />
            </div>
            <div>
              <label className="font-body text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Est. Low ($)</label>
              <input type="number" value={form.estimated_price_low} onChange={e => set('estimated_price_low', parseFloat(e.target.value))}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body text-gray-900 focus:outline-none focus:border-coral" />
            </div>
            <div>
              <label className="font-body text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Est. High ($)</label>
              <input type="number" value={form.estimated_price_high} onChange={e => set('estimated_price_high', parseFloat(e.target.value))}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body text-gray-900 focus:outline-none focus:border-coral" />
            </div>
          </div>

          {/* Provider */}
          {providers.length > 0 && (
            <div>
              <label className="font-body text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Assign Provider (optional)</label>
              <select value={form.provider_name || ''} onChange={e => {
                const p = providers.find(p => p.full_name === e.target.value);
                set('provider_name', e.target.value);
                if (p) set('provider_email', p.email);
              }}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-3 text-sm font-body text-gray-900 focus:outline-none focus:border-coral">
                <option value="">— Unassigned —</option>
                {providers.map(p => <option key={p.id} value={p.full_name}>{p.full_name}</option>)}
              </select>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="font-body text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Booking Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-3 text-sm font-body text-gray-900 focus:outline-none focus:border-coral">
              {[['pending','New Request'],['approved','Approved'],['confirmed','Confirmed'],['provider_assigned','Provider Assigned'],['in_progress','In Progress'],['completed','Completed']].map(([v,l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>

          {/* Admin notes */}
          <div>
            <label className="font-body text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Admin Notes (internal)</label>
            <textarea value={form.admin_notes} onChange={e => set('admin_notes', e.target.value)} rows={2}
              placeholder="Internal notes, not shown to client..."
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body text-gray-700 focus:outline-none focus:border-coral resize-none" />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3 rounded-b-2xl">
          <button onClick={submit} disabled={saving}
            className="flex-1 py-3 bg-coral text-white rounded-xl text-sm font-body font-bold hover:bg-coral/90 disabled:opacity-50 transition-colors">
            {saving ? 'Creating Booking...' : 'Create Booking'}
          </button>
          <button onClick={onClose} className="px-5 py-3 border-2 border-gray-200 rounded-xl text-sm font-body text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}