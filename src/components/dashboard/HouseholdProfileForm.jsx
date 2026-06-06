import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Home } from 'lucide-react';

export default function HouseholdProfileForm({ userEmail, userName }) {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!userEmail) return;
    base44.entities.HouseholdProfile.filter({ guest_email: userEmail }).then(results => {
      if (results?.length > 0) {
        setProfile(results[0]);
        setForm(results[0]);
      } else {
        setForm({ guest_email: userEmail, guest_name: userName || '' });
      }
      setLoading(false);
    });
  }, [userEmail]);

  const f = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    if (profile) {
      await base44.entities.HouseholdProfile.update(profile.id, form);
    } else {
      const created = await base44.entities.HouseholdProfile.create(form);
      setProfile(created);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <div className="flex items-center justify-center py-8"><div className="w-5 h-5 border-2 border-taupe border-t-coral rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-coral/10 flex items-center justify-center">
          <Home className="w-4 h-4 text-coral" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-semibold text-charcoal">Your Household Profile</h2>
          <p className="font-body text-xs text-charcoal/40 font-light">This helps us prepare for every visit. Auto-fills future bookings.</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Address */}
        <div>
          <label className="font-body text-xs text-charcoal/60 font-light block mb-1.5">Home Address(es)</label>
          <textarea value={form.saved_addresses || ''} onChange={e => f('saved_addresses', e.target.value)}
            placeholder="123 Main St, Flourtown, PA 19031&#10;(Add multiple addresses on new lines)"
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-body text-xs text-charcoal/60 font-light block mb-1.5">Property Type</label>
            <select value={form.property_type || ''} onChange={e => f('property_type', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal focus:outline-none focus:border-coral/40">
              <option value="">Select...</option>
              {['House', 'Apartment', 'Condo', 'Townhome', 'Senior Community', 'Other'].map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="font-body text-xs text-charcoal/60 font-light block mb-1.5">People in Home</label>
            <select value={form.household_size || ''} onChange={e => f('household_size', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal focus:outline-none focus:border-coral/40">
              <option value="">Select...</option>
              {['1', '2', '3', '4', '5+'].map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="font-body text-xs text-charcoal/60 font-light block mb-1.5">Pets (names, type, behavior)</label>
          <input value={form.pets || ''} onChange={e => f('pets', e.target.value)}
            placeholder="e.g. Max — golden retriever, friendly but excited"
            className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40" />
        </div>

        <div>
          <label className="font-body text-xs text-charcoal/60 font-light block mb-1.5">Access Notes</label>
          <textarea value={form.access_notes || ''} onChange={e => f('access_notes', e.target.value)}
            placeholder="Gate code, door code, parking instructions, entry notes..."
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 resize-none" />
        </div>

        <div>
          <label className="font-body text-xs text-charcoal/60 font-light block mb-1.5">Supply Preferences</label>
          <input value={form.supply_preferences || ''} onChange={e => f('supply_preferences', e.target.value)}
            placeholder="e.g. fragrance-free only, no bleach, specific detergent..."
            className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40" />
        </div>

        <div>
          <label className="font-body text-xs text-charcoal/60 font-light block mb-1.5">
            Things I'd Love Help With (Wish List)
          </label>
          <textarea value={form.future_todo_list || ''} onChange={e => f('future_todo_list', e.target.value)}
            placeholder="Dream big — pantry overhaul, closet reset, garage, meal prep weekly..."
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 resize-none" />
        </div>

        {/* Shoe policy */}
        <label className="flex items-center gap-3 cursor-pointer" onClick={() => f('shoe_policy', !form.shoe_policy)}>
          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${form.shoe_policy ? 'bg-coral border-coral' : 'border-taupe/30'}`}>
            {form.shoe_policy && <span className="text-white text-xs font-bold">✓</span>}
          </div>
          <span className="font-body text-sm text-charcoal/70 font-light">Please remove shoes when entering my home</span>
        </label>

        <div className="flex items-center justify-between pt-2">
          {saved && <span className="font-body text-xs text-sage font-light">✓ Profile saved</span>}
          <button onClick={handleSave} disabled={saving}
            className="ml-auto px-8 py-3 rounded-full bg-coral text-white font-body text-sm tracking-wide disabled:opacity-40 hover:bg-coral/90 transition-all">
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}