import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';
import { Check, Save } from 'lucide-react';

const SERVICE_KEYS = ['home_reset', 'mothers_helper', 'errands', 'senior_support', 'meal_prep', 'organization'];
const TIME_OPTIONS = ["Morning (9–11 AM)", "Midday (11 AM–1 PM)", "Afternoon (1–4 PM)", "No preference"];
const DAY_OPTIONS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "No preference"];
const SUPPLY_OPTIONS = ["Use my products", "Bring your own", "Either is fine"];

export default function ServicePreferencesForm({ userEmail }) {
  const [prefs, setPrefs] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    preferred_services: [],
    preferred_time: 'No preference',
    preferred_day: 'No preference',
    supply_preference: 'Either is fine',
    access_notes: '',
    special_notes: '',
  });

  useEffect(() => {
    if (!userEmail) return;
    base44.entities.ServicePreferences.filter({ user_email: userEmail }).then(results => {
      if (results.length > 0) {
        const p = results[0];
        setPrefs(p);
        setForm({
          preferred_services: p.preferred_services || [],
          preferred_time: p.preferred_time || 'No preference',
          preferred_day: p.preferred_day || 'No preference',
          supply_preference: p.supply_preference || 'Either is fine',
          access_notes: p.access_notes || '',
          special_notes: p.special_notes || '',
        });
      }
    });
  }, [userEmail]);

  const toggleService = (key) => {
    setForm(f => ({
      ...f,
      preferred_services: f.preferred_services.includes(key)
        ? f.preferred_services.filter(s => s !== key)
        : [...f.preferred_services, key]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form, user_email: userEmail };
    if (prefs) {
      await base44.entities.ServicePreferences.update(prefs.id, data);
    } else {
      const created = await base44.entities.ServicePreferences.create(data);
      setPrefs(created);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Services */}
      <div>
        <label className="font-body text-xs tracking-[0.15em] uppercase text-charcoal/40 font-light block mb-3">
          Services I use most
        </label>
        <div className="flex flex-wrap gap-2">
          {SERVICE_KEYS.map(key => {
            const cfg = SERVICE_CONFIG[key];
            const selected = form.preferred_services.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleService(key)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-body font-light transition-all duration-200"
                style={selected
                  ? { background: cfg.color + '25', borderColor: cfg.color, color: '#333' }
                  : { background: '#fdfcfb', borderColor: '#dcdcdc', color: '#999' }
                }
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: cfg.color }} />
                {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time & Day */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="font-body text-xs tracking-[0.15em] uppercase text-charcoal/40 font-light block mb-3">
            Preferred visit time
          </label>
          <div className="flex flex-col gap-2">
            {TIME_OPTIONS.map(opt => (
              <button key={opt} type="button" onClick={() => setForm(f => ({ ...f, preferred_time: opt }))}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-body font-light text-left transition-all ${form.preferred_time === opt ? 'border-coral/40 bg-coral/5 text-charcoal' : 'border-taupe/20 bg-cream text-charcoal/50 hover:border-coral/20'}`}>
                <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${form.preferred_time === opt ? 'border-coral bg-coral' : 'border-charcoal/20'}`}>
                  {form.preferred_time === opt && <Check className="w-2 h-2 text-white" strokeWidth={3} />}
                </span>
                {opt}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="font-body text-xs tracking-[0.15em] uppercase text-charcoal/40 font-light block mb-3">
            Preferred day of week
          </label>
          <div className="flex flex-wrap gap-2">
            {DAY_OPTIONS.map(day => (
              <button key={day} type="button" onClick={() => setForm(f => ({ ...f, preferred_day: day }))}
                className={`px-3 py-2 rounded-full border text-xs font-body font-light transition-all ${form.preferred_day === day ? 'bg-coral border-coral text-white' : 'border-taupe/20 bg-cream text-charcoal/50 hover:border-coral/20'}`}>
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Supply preference */}
      <div>
        <label className="font-body text-xs tracking-[0.15em] uppercase text-charcoal/40 font-light block mb-3">
          Cleaning supply preference
        </label>
        <div className="flex flex-wrap gap-2">
          {SUPPLY_OPTIONS.map(opt => (
            <button key={opt} type="button" onClick={() => setForm(f => ({ ...f, supply_preference: opt }))}
              className={`px-4 py-2 rounded-full border text-xs font-body font-light transition-all ${form.supply_preference === opt ? 'bg-sage/40 border-sage text-charcoal' : 'border-taupe/20 bg-cream text-charcoal/50 hover:border-sage/40'}`}>
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-body text-xs tracking-[0.15em] uppercase text-charcoal/40 font-light block mb-2">
            Home access notes
          </label>
          <textarea
            value={form.access_notes}
            onChange={e => setForm(f => ({ ...f, access_notes: e.target.value }))}
            placeholder="e.g. lockbox code, parking spot, gate code, dog at door..."
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 transition-colors resize-none"
          />
        </div>
        <div>
          <label className="font-body text-xs tracking-[0.15em] uppercase text-charcoal/40 font-light block mb-2">
            Ongoing special notes
          </label>
          <textarea
            value={form.special_notes}
            onChange={e => setForm(f => ({ ...f, special_notes: e.target.value }))}
            placeholder="e.g. fragrance-free only, avoid left bedroom, specific products I love..."
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 transition-colors resize-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        {saved && (
          <span className="font-body text-xs text-sage font-light flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Preferences saved
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-coral text-white font-body text-sm tracking-wide px-7 py-2.5 rounded-full hover:bg-coral/90 disabled:opacity-50 transition-all"
        >
          <Save className="w-3.5 h-3.5" />
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
}