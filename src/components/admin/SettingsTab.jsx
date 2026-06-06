import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Save, ToggleLeft, ToggleRight, RefreshCw, MapPin, Bell, Clock, CreditCard, Globe } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';

const DEFAULT_SETTINGS = [
  // Feature Toggles
  { key: 'booking_enabled', label: 'Online Booking', description: 'Allow clients to submit new bookings through the website', category: 'feature_toggles', value_type: 'boolean', value: 'true' },
  { key: 'deposit_required', label: 'Deposit Required', description: 'Require a deposit payment to complete a booking', category: 'feature_toggles', value_type: 'boolean', value: 'true' },
  { key: 'memberships_enabled', label: 'Memberships', description: 'Show and allow purchase of membership plans', category: 'feature_toggles', value_type: 'boolean', value: 'true' },
  { key: 'consult_enabled', label: 'Free Consult Booking', description: 'Allow clients to request a free 15-min consult call', category: 'feature_toggles', value_type: 'boolean', value: 'true' },
  { key: 'wip_banner_enabled', label: 'WIP Banner', description: 'Show the "Work in Progress" banner on the public site', category: 'feature_toggles', value_type: 'boolean', value: 'false' },
  { key: 'sms_enabled', label: 'SMS Notifications', description: 'Send SMS reminders and confirmations to clients', category: 'feature_toggles', value_type: 'boolean', value: 'true' },

  // Booking Constraints
  { key: 'min_notice_hours', label: 'Minimum Booking Notice (hours)', description: 'Minimum hours in advance a client must book', category: 'booking_constraints', value_type: 'number', value: '24' },
  { key: 'max_days_ahead', label: 'Maximum Days Ahead', description: 'How many days into the future clients can book', category: 'booking_constraints', value_type: 'number', value: '30' },
  { key: 'sunday_blackout', label: 'Sunday Blackout', description: 'Block all Sunday bookings automatically', category: 'booking_constraints', value_type: 'boolean', value: 'true' },
  { key: 'service_hours_start', label: 'Service Hours Start', description: 'Earliest available booking time (e.g. 10:00)', category: 'booking_constraints', value_type: 'string', value: '10:00' },
  { key: 'service_hours_end', label: 'Service Hours End', description: 'Latest session end time (e.g. 18:00)', category: 'booking_constraints', value_type: 'string', value: '18:00' },
  { key: 'deposit_amount', label: 'Deposit Amount ($)', description: 'Fixed deposit amount required at booking', category: 'booking_constraints', value_type: 'number', value: '50' },

  // Notifications
  { key: 'notify_email', label: 'Admin Notification Email', description: 'Email address for new booking alerts', category: 'notifications', value_type: 'string', value: 'cleanslateclubpa@gmail.com' },
  { key: 'notify_new_booking', label: 'Notify on New Booking', description: 'Send admin email for every new booking', category: 'notifications', value_type: 'boolean', value: 'true' },
  { key: 'notify_cancellation', label: 'Notify on Cancellation', description: 'Send admin email when a booking is cancelled', category: 'notifications', value_type: 'boolean', value: 'true' },
  { key: 'client_reminder_hours', label: 'Client Reminder (hours before)', description: 'Hours before appointment to send SMS/email reminder', category: 'notifications', value_type: 'number', value: '24' },
];

const CATEGORY_META = {
  feature_toggles: { label: 'Feature Toggles', icon: ToggleRight, color: '#EB9486' },
  booking_constraints: { label: 'Booking Constraints', icon: Clock, color: '#EFB988' },
  notifications: { label: 'Notifications', icon: Bell, color: '#CAE7B9' },
  territory: { label: 'Territory', icon: MapPin, color: '#B58A90' },
  payments: { label: 'Payments', icon: CreditCard, color: '#7E7F9A' },
};

function SettingRow({ setting, onChange }) {
  const { label, description, value_type, value } = setting;

  if (value_type === 'boolean') {
    const isOn = value === 'true';
    return (
      <div className="flex items-center justify-between py-3.5 border-b border-taupe/10 last:border-0">
        <div className="flex-1 pr-4">
          <p className="font-body text-sm text-charcoal font-light">{label}</p>
          <p className="font-body text-xs text-charcoal/40 font-light mt-0.5">{description}</p>
        </div>
        <button
          onClick={() => onChange(isOn ? 'false' : 'true')}
          className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-all duration-200 ${isOn ? 'bg-coral' : 'bg-taupe/30'}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${isOn ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
      </div>
    );
  }

  if (value_type === 'number') {
    return (
      <div className="flex items-center justify-between py-3.5 border-b border-taupe/10 last:border-0 gap-4">
        <div className="flex-1">
          <p className="font-body text-sm text-charcoal font-light">{label}</p>
          <p className="font-body text-xs text-charcoal/40 font-light mt-0.5">{description}</p>
        </div>
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-24 px-3 py-1.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal text-center focus:outline-none focus:border-coral/40"
        />
      </div>
    );
  }

  // string
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-taupe/10 last:border-0 gap-4">
      <div className="flex-1">
        <p className="font-body text-sm text-charcoal font-light">{label}</p>
        <p className="font-body text-xs text-charcoal/40 font-light mt-0.5">{description}</p>
      </div>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-40 px-3 py-1.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal focus:outline-none focus:border-coral/40"
      />
    </div>
  );
}

export default function SettingsTab() {
  const { invalidate } = useAppSettings();
  const [settings, setSettings] = useState({});
  const [dirty, setDirty] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const records = await base44.entities.AppSettings.list();
    const map = {};
    (records || []).forEach(r => { map[r.key] = r; });

    // Merge defaults with saved values
    const merged = {};
    DEFAULT_SETTINGS.forEach(def => {
      merged[def.key] = {
        ...def,
        value: map[def.key] ? map[def.key].value : def.value,
        _id: map[def.key]?.id || null,
      };
    });
    setSettings(merged);
    setDirty({});
    setLoading(false);
  };

  const handleChange = (key, newValue) => {
    setSettings(prev => ({ ...prev, [key]: { ...prev[key], value: newValue } }));
    setDirty(prev => ({ ...prev, [key]: true }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const toSave = Object.keys(dirty).map(key => settings[key]);
    await Promise.all(toSave.map(s => {
      if (s._id) {
        return base44.entities.AppSettings.update(s._id, { value: s.value });
      } else {
        return base44.entities.AppSettings.create({
          key: s.key,
          value: s.value,
          label: s.label,
          description: s.description,
          category: s.category,
          value_type: s.value_type,
        }).then(created => {
          setSettings(prev => ({ ...prev, [s.key]: { ...prev[s.key], _id: created.id } }));
        });
      }
    }));
    setDirty({});
    setSaving(false);
    setSaved(true);
    invalidate(); // Clear cache so next page load re-fetches fresh settings
    setTimeout(() => setSaved(false), 3000);
  };

  const categories = [...new Set(DEFAULT_SETTINGS.map(s => s.category))];
  const hasDirty = Object.keys(dirty).length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-taupe border-t-coral rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading text-xl font-semibold text-charcoal">Settings</h2>
          <p className="font-body text-xs text-charcoal/40 font-light mt-0.5">Control how the platform behaves for clients and providers.</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="font-body text-xs text-sage font-light">✓ Saved</span>}
          <button
            onClick={handleSave}
            disabled={!hasDirty || saving}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-coral text-white font-body text-xs tracking-wide disabled:opacity-30 hover:bg-coral/90 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {categories.map(cat => {
          const meta = CATEGORY_META[cat];
          const Icon = meta?.icon || Globe;
          const catSettings = DEFAULT_SETTINGS.filter(s => s.category === cat);

          return (
            <div key={cat} className="bg-warm-white rounded-2xl border border-taupe/15 overflow-hidden">
              {/* Category header */}
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-taupe/10" style={{ borderLeft: `3px solid ${meta?.color || '#EB9486'}` }}>
                <Icon className="w-4 h-4" style={{ color: meta?.color || '#EB9486' }} />
                <p className="font-heading text-sm font-semibold text-charcoal">{meta?.label || cat}</p>
                {catSettings.some(s => dirty[s.key]) && (
                  <span className="ml-auto text-[10px] font-body font-light text-coral bg-coral/10 px-2 py-0.5 rounded-full">unsaved</span>
                )}
              </div>

              {/* Settings rows */}
              <div className="px-5">
                {catSettings.map(def => (
                  <SettingRow
                    key={def.key}
                    setting={settings[def.key] || def}
                    onChange={val => handleChange(def.key, val)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Territory management link */}
      <div className="mt-5 bg-warm-white rounded-2xl border border-taupe/15 p-5">
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-mauve" />
          <div className="flex-1">
            <p className="font-heading text-sm font-semibold text-charcoal">Service Territory Management</p>
            <p className="font-body text-xs text-charcoal/40 font-light mt-0.5">Add, remove, or toggle active service towns. Manage holiday blackout dates.</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TerritoryManager />
          <HolidayManager />
        </div>
      </div>
    </div>
  );
}

function TerritoryManager() {
  const [territories, setTerritories] = useState([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Territory.list().then(t => { setTerritories(t || []); setLoading(false); });
  }, []);

  const toggle = async (t) => {
    await base44.entities.Territory.update(t.id, { is_active: !t.is_active });
    setTerritories(prev => prev.map(x => x.id === t.id ? { ...x, is_active: !x.is_active } : x));
  };

  const add = async () => {
    if (!newName.trim()) return;
    const created = await base44.entities.Territory.create({ name: newName.trim(), state: 'PA', is_active: true });
    setTerritories(prev => [...prev, created]);
    setNewName('');
  };

  const remove = async (id) => {
    await base44.entities.Territory.delete(id);
    setTerritories(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="border border-taupe/15 rounded-xl p-4 bg-cream">
      <p className="font-body text-xs font-semibold text-charcoal mb-3">Service Towns</p>
      {loading ? <div className="w-4 h-4 border-2 border-taupe border-t-coral rounded-full animate-spin" /> : (
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 mb-3">
          {territories.map(t => (
            <div key={t.id} className="flex items-center justify-between gap-2">
              <span className="font-body text-xs text-charcoal/70 font-light flex-1">{t.name}</span>
              <button onClick={() => toggle(t)} className={`text-[10px] px-2 py-0.5 rounded-full border font-body font-light transition-colors ${t.is_active ? 'bg-sage/20 border-sage/40 text-charcoal/60' : 'bg-taupe/20 border-taupe/30 text-charcoal/30'}`}>
                {t.is_active ? 'Active' : 'Off'}
              </button>
              <button onClick={() => remove(t.id)} className="text-charcoal/20 hover:text-coral transition-colors text-xs">×</button>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} placeholder="Add town..." className="flex-1 px-3 py-1.5 rounded-lg border border-taupe/20 bg-warm-white font-body text-xs text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40" />
        <button onClick={add} className="px-3 py-1.5 rounded-lg bg-coral text-white font-body text-xs hover:bg-coral/90 transition-colors">+</button>
      </div>
    </div>
  );
}

function HolidayManager() {
  const [holidays, setHolidays] = useState([]);
  const [form, setForm] = useState({ name: '', date: '', type: 'blackout' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.HolidayBlackout.list('-date').then(h => { setHolidays(h || []); setLoading(false); });
  }, []);

  const add = async () => {
    if (!form.name || !form.date) return;
    const created = await base44.entities.HolidayBlackout.create({
      ...form,
      booking_allowed: form.type !== 'blackout',
      manual_approval_required: form.type === 'premium',
    });
    setHolidays(prev => [...prev, created].sort((a, b) => a.date.localeCompare(b.date)));
    setForm({ name: '', date: '', type: 'blackout' });
  };

  const remove = async (id) => {
    await base44.entities.HolidayBlackout.delete(id);
    setHolidays(prev => prev.filter(h => h.id !== id));
  };

  const typeColors = { blackout: 'bg-coral/15 text-coral border-coral/20', premium: 'bg-butter/30 text-charcoal/60 border-butter/40', normal: 'bg-sage/20 text-charcoal/60 border-sage/30' };

  return (
    <div className="border border-taupe/15 rounded-xl p-4 bg-cream">
      <p className="font-body text-xs font-semibold text-charcoal mb-3">Holiday / Blackout Dates</p>
      {loading ? <div className="w-4 h-4 border-2 border-taupe border-t-coral rounded-full animate-spin" /> : (
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 mb-3">
          {holidays.map(h => (
            <div key={h.id} className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <span className="font-body text-xs text-charcoal/70 font-light block truncate">{h.name}</span>
                <span className="font-body text-[10px] text-charcoal/35 font-light">{h.date}</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-body font-light shrink-0 ${typeColors[h.type]}`}>{h.type}</span>
              <button onClick={() => remove(h.id)} className="text-charcoal/20 hover:text-coral transition-colors text-xs shrink-0">×</button>
            </div>
          ))}
        </div>
      )}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-1.5">
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Holiday name" className="px-3 py-1.5 rounded-lg border border-taupe/20 bg-warm-white font-body text-xs text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40" />
          <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="px-3 py-1.5 rounded-lg border border-taupe/20 bg-warm-white font-body text-xs text-charcoal focus:outline-none focus:border-coral/40" />
        </div>
        <div className="flex gap-1.5">
          {['blackout', 'premium', 'normal'].map(t => (
            <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))} className={`flex-1 py-1 rounded-lg border text-[10px] font-body font-light transition-colors ${form.type === t ? 'bg-coral border-coral text-white' : 'border-taupe/20 text-charcoal/40 hover:border-coral/30'}`}>{t}</button>
          ))}
          <button onClick={add} className="px-3 py-1 rounded-lg bg-coral text-white font-body text-xs hover:bg-coral/90 transition-colors">+</button>
        </div>
      </div>
    </div>
  );
}