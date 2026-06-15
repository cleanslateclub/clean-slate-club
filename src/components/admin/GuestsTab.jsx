import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Search, User, Home, Plus, ChevronDown, ChevronUp } from 'lucide-react';

export default function GuestsTab({ bookings = [] }) {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    base44.entities.HouseholdProfile.list().then(p => { setProfiles(p || []); setLoading(false); });
  }, []);

  // Build guest list from bookings + profiles
  const guestMap = {};
  bookings.forEach(b => {
    if (!guestMap[b.client_email]) {
      guestMap[b.client_email] = { name: b.client_name, email: b.client_email, phone: b.client_phone, bookingCount: 0 };
    }
    guestMap[b.client_email].bookingCount++;
  });
  const allGuests = Object.values(guestMap);

  const filtered = allGuests.filter(g => {
    const q = search.toLowerCase();
    return !q || g.name?.toLowerCase().includes(q) || g.email?.toLowerCase().includes(q);
  });

  const getProfile = (email) => profiles.find(p => p.guest_email === email);

  const startEdit = (guest) => {
    const existing = getProfile(guest.email) || {};
    setEditing(guest.email);
    setForm({ guest_email: guest.email, guest_name: guest.name, ...existing });
  };

  const saveProfile = async () => {
    const existing = getProfile(form.guest_email);
    if (existing) {
      await base44.entities.HouseholdProfile.update(existing.id, form);
      setProfiles(prev => prev.map(p => p.id === existing.id ? { ...p, ...form } : p));
    } else {
      const created = await base44.entities.HouseholdProfile.create(form);
      setProfiles(prev => [...prev, created]);
    }
    setEditing(null);
    setForm({});
  };

  if (loading) return <div className="flex items-center justify-center py-16"><div className="w-6 h-6 border-2 border-taupe border-t-coral rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search guests..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-taupe/20 bg-warm-white font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40" />
        </div>
        <span className="font-body text-xs text-charcoal/30 font-light shrink-0">{filtered.length} guests</span>
      </div>

      <div className="space-y-2">
        {filtered.map(guest => {
          const profile = getProfile(guest.email);
          const isOpen = expanded === guest.email;
          const isEditing = editing === guest.email;
          const guestBookings = bookings.filter(b => b.client_email === guest.email);
          const lastVisit = guestBookings.filter(b => b.status === 'completed').sort((a, b) => b.scheduled_date?.localeCompare(a.scheduled_date))[0];

          return (
            <div key={guest.email} className="bg-warm-white rounded-2xl border border-taupe/15 overflow-hidden">
              {/* Guest row */}
              <button onClick={() => setExpanded(isOpen ? null : guest.email)} className="w-full flex items-center gap-4 p-4 text-left hover:bg-cream/50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-coral/15 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-coral" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm text-charcoal font-light">{guest.name}</p>
                  <p className="font-body text-xs text-charcoal/40 font-light">{guest.email} · {guest.bookingCount} booking{guest.bookingCount !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {profile && <span className="text-[10px] px-2 py-0.5 rounded-full bg-sage/20 border border-sage/30 text-charcoal/50 font-body font-light">Profile ✓</span>}
                  {lastVisit && <span className="font-body text-[10px] text-charcoal/30 font-light hidden sm:block">Last: {lastVisit.scheduled_date}</span>}
                  {isOpen ? <ChevronUp className="w-4 h-4 text-charcoal/30" /> : <ChevronDown className="w-4 h-4 text-charcoal/30" />}
                </div>
              </button>

              {/* Expanded detail */}
              {isOpen && (
                <div className="border-t border-taupe/10 p-4">
                  {!isEditing ? (
                    <div className="space-y-4">
                      {/* Booking history */}
                      <div>
                        <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-2">Booking History</p>
                        <div className="space-y-1">
                          {guestBookings.slice(0, 5).map(b => (
                            <div key={b.id} className="flex items-center justify-between text-xs font-body font-light">
                              <span className="text-charcoal/60">{b.scheduled_date} · {b.service_category}</span>
                              <span className={`px-2 py-0.5 rounded-full ${b.status === 'completed' ? 'bg-sage/20 text-charcoal/50' : b.status === 'cancelled' ? 'bg-coral/10 text-coral/60' : 'bg-butter/30 text-charcoal/50'}`}>{b.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Household Profile */}
                      {profile ? (
                        <div>
                          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-2">Household Profile</p>
                          <div className="grid grid-cols-2 gap-2 text-xs font-body font-light">
                            {profile.property_type && <div><span className="text-charcoal/40">Property: </span><span className="text-charcoal">{profile.property_type}</span></div>}
                            {profile.household_size && <div><span className="text-charcoal/40">Size: </span><span className="text-charcoal">{profile.household_size} people</span></div>}
                            {profile.pets && <div className="col-span-2"><span className="text-charcoal/40">Pets: </span><span className="text-charcoal">{profile.pets}</span></div>}
                            {profile.access_notes && <div className="col-span-2"><span className="text-charcoal/40">Access: </span><span className="text-charcoal">{profile.access_notes}</span></div>}
                            {profile.future_todo_list && <div className="col-span-2"><span className="text-charcoal/40">Wish list: </span><span className="text-charcoal">{profile.future_todo_list}</span></div>}
                          </div>
                        </div>
                      ) : (
                        <p className="font-body text-xs text-charcoal/30 font-light">No household profile yet.</p>
                      )}

                      <button onClick={() => startEdit(guest)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-taupe/20 bg-cream text-xs font-body font-light text-charcoal/50 hover:border-coral/30 hover:text-coral transition-colors">
                        <Home className="w-3.5 h-3.5" />
                        {profile ? 'Edit Household Profile' : 'Add Household Profile'}
                      </button>
                    </div>
                  ) : (
                    <HouseholdProfileForm form={form} setForm={setForm} onSave={saveProfile} onCancel={() => setEditing(null)} />
                  )}
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && <div className="text-center py-12"><p className="font-body text-sm text-charcoal/30 font-light">No guests found.</p></div>}
      </div>
    </div>
  );
}

function HouseholdProfileForm({ form, setForm, onSave, onCancel }) {
  const f = (key, val) => setForm(p => ({ ...p, [key]: val }));

  return (
    <div className="space-y-4">
      <p className="font-body text-xs font-semibold text-charcoal">Household Profile</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-body text-[10px] text-charcoal/40 font-light block mb-1">Property Type</label>
          <select value={form.property_type || ''} onChange={e => f('property_type', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-taupe/20 bg-cream font-body text-xs text-charcoal focus:outline-none focus:border-coral/40">
            <option value="">Select...</option>
            {['House', 'Apartment', 'Condo', 'Townhome', 'Senior Community', 'Other'].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="font-body text-[10px] text-charcoal/40 font-light block mb-1">Household Size</label>
          <select value={form.household_size || ''} onChange={e => f('household_size', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-taupe/20 bg-cream font-body text-xs text-charcoal focus:outline-none focus:border-coral/40">
            <option value="">Select...</option>
            {['1', '2', '3', '4', '5+'].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="font-body text-[10px] text-charcoal/40 font-light block mb-1">Children Present</label>
          <select value={form.children_present || ''} onChange={e => f('children_present', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-taupe/20 bg-cream font-body text-xs text-charcoal focus:outline-none focus:border-coral/40">
            <option value="">Select...</option>
            {['None', 'Infant', 'Toddler', 'School Age', 'Teen', 'Multiple ages'].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="font-body text-[10px] text-charcoal/40 font-light block mb-1">Lead Source</label>
          <select value={form.lead_source || ''} onChange={e => f('lead_source', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-taupe/20 bg-cream font-body text-xs text-charcoal focus:outline-none focus:border-coral/40">
            <option value="">Select...</option>
            {['Google', 'Instagram', 'Facebook', 'Referral', 'Event', 'Flyer', 'School', 'Other'].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
      </div>
      {[
        { key: 'pets', label: 'Pets (names, type, behavior)', placeholder: 'e.g. Max the golden retriever, friendly' },
        { key: 'access_notes', label: 'Access Notes', placeholder: 'Gate code, parking, entry...' },
        { key: 'supply_preferences', label: 'Supply Preferences', placeholder: 'Fragrance-free, no bleach...' },
        { key: 'future_todo_list', label: "Wish List / Things I'd Love Help With", placeholder: 'Pantry, closets, office...' },
        { key: 'internal_notes', label: 'Internal CEO Notes (admin only)', placeholder: 'Private notes...' },
      ].map(({ key, label, placeholder }) => (
        <div key={key}>
          <label className="font-body text-[10px] text-charcoal/40 font-light block mb-1">{label}</label>
          <textarea value={form[key] || ''} onChange={e => f(key, e.target.value)} placeholder={placeholder} rows={2}
            className="w-full px-3 py-2 rounded-xl border border-taupe/20 bg-cream font-body text-xs text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 resize-none" />
        </div>
      ))}
      <div className="flex gap-2 pt-2">
        <button onClick={onSave} className="flex-1 py-2.5 rounded-full bg-coral text-white font-body text-xs tracking-wide hover:bg-coral/90 transition-all">Save Profile</button>
        <button onClick={onCancel} className="px-5 py-2.5 rounded-full border border-taupe/20 font-body text-xs text-charcoal/40 font-light hover:border-coral/30 transition-colors">Cancel</button>
      </div>
    </div>
  );
}