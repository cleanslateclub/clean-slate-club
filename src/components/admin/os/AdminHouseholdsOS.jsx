import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Search, Plus, User, MapPin, ChevronRight, X, History } from 'lucide-react';

const MEMBERSHIP_BADGE = {
  active:    'bg-sage/20 border-sage/60 text-green-700',
  none:      'bg-taupe/10 border-taupe/30 text-charcoal/40',
  past_due:  'bg-coral/10 border-coral/40 text-coral',
  cancelled: 'bg-taupe/10 border-taupe/30 text-charcoal/30',
  paused:    'bg-butter/15 border-butter/50 text-amber-700',
};

function HouseholdCard({ profile, bookings, onClick, isSelected }) {
  const bookingCount = bookings.filter(b => b.client_email === profile.guest_email).length;
  return (
    <div
      onClick={() => onClick(profile)}
      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-coral/5 border-coral/40' : 'bg-white border-taupe/15 hover:border-coral/25 hover:shadow-sm'}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-cream-pink flex items-center justify-center shrink-0">
          <span className="font-heading text-sm font-semibold text-coral">{profile.guest_name?.[0]?.toUpperCase() || '?'}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-body text-sm font-semibold text-gray-900 truncate">{profile.guest_name || profile.guest_email}</p>
            <span className={`px-1.5 py-0.5 rounded-full border text-[9px] uppercase tracking-wider font-body font-bold ${MEMBERSHIP_BADGE[profile.membership_status || 'none']}`}>
              {profile.membership_status === 'active' ? '✦ Member' : profile.membership_status || 'No membership'}
            </span>
          </div>
          <p className="font-body text-xs text-gray-600 font-medium mt-0.5">{profile.guest_email}</p>
          <div className="flex items-center gap-3 mt-1.5 text-xs font-body font-medium text-gray-500">
            {profile.primary_service_address && (
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{profile.primary_service_address.split(',')[0]}</span>
            )}
            {bookingCount > 0 && (
              <span className="flex items-center gap-1"><History className="w-3 h-3" />{bookingCount} booking{bookingCount !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-charcoal/20 shrink-0 mt-1" />
      </div>
    </div>
  );
}

function HouseholdDetail({ profile, bookings, onClose, onUpdate }) {
  const [tab, setTab] = useState('overview');
  const [editNotes, setEditNotes] = useState(false);
  const [notes, setNotes] = useState(profile.internal_notes || '');
  const [saving, setSaving] = useState(false);

  const hbookings = bookings.filter(b => b.client_email === profile.guest_email);

  const saveNotes = async () => {
    setSaving(true);
    await base44.entities.HouseholdProfile.update(profile.id, { internal_notes: notes });
    onUpdate(profile.id, { internal_notes: notes });
    setSaving(false);
    setEditNotes(false);
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-taupe/15">
      <div className="px-5 py-4 border-b border-taupe/10 bg-cream/50">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-heading text-lg font-semibold text-charcoal">{profile.guest_name || 'Household'}</h3>
            <p className="font-body text-xs text-charcoal/50 font-light">{profile.guest_email}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-taupe/10 rounded-lg text-charcoal/40">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-1 mt-3">
          {['overview', 'bookings', 'notes', 'intake'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-body capitalize transition-colors ${tab === t ? 'bg-coral text-white' : 'text-charcoal/50 hover:bg-cream'}`}
            >{t}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {tab === 'overview' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {[
                ['Phone', profile.guest_phone],
                ['Membership', profile.membership_status?.replace(/_/g, ' ') || 'None'],
                ['Address', profile.primary_service_address],
                ['Preferred Contact', profile.preferred_contact_method],
                ['Pets', profile.pets],
                ['Household Size', profile.household_size],
                ['Property Type', profile.property_type],
                ['Lead Source', profile.lead_source],
              ].map(([label, value]) => value ? (
                <div key={label} className="bg-cream rounded-xl p-3 border border-taupe/10">
                  <p className="font-body text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">{label}</p>
                  <p className="font-body text-sm text-gray-800 font-medium">{value}</p>
                </div>
              ) : null)}
            </div>
            {profile.access_notes && (
              <div className="bg-butter/10 border border-butter/30 rounded-xl p-3">
                <p className="font-body text-[10px] uppercase tracking-widest text-amber-700 mb-1">🔑 Access Instructions</p>
                <p className="font-body text-xs text-charcoal/70 font-light">{profile.access_notes}</p>
              </div>
            )}
            {profile.provider_safe_notes && (
              <div className="bg-sage/10 border border-sage/30 rounded-xl p-3">
                <p className="font-body text-[10px] uppercase tracking-widest text-green-700 mb-1">📋 Provider Notes</p>
                <p className="font-body text-xs text-charcoal/70 font-light">{profile.provider_safe_notes}</p>
              </div>
            )}
          </div>
        )}

        {tab === 'bookings' && (
          <div className="space-y-2">
            {hbookings.length === 0 ? (
              <p className="text-sm text-charcoal/30 font-body font-light text-center py-8">No bookings yet.</p>
            ) : hbookings.sort((a, b) => b.scheduled_date?.localeCompare(a.scheduled_date)).map(b => (
              <div key={b.id} className="bg-cream rounded-xl p-3 border border-taupe/10">
                <p className="font-body text-sm text-charcoal">{b.service_label || b.service_category?.replace(/_/g, ' ')}</p>
                <p className="font-body text-xs text-gray-600 font-medium">{b.scheduled_date} · {b.status?.replace(/_/g, ' ')}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'notes' && (
          <div>
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 mb-2">Internal Admin Notes</p>
            {editNotes ? (
              <div>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={5}
                  className="w-full border border-taupe/20 rounded-xl p-3 text-xs font-body text-charcoal/70 focus:outline-none focus:border-coral/40 resize-none" />
                <div className="flex gap-2 mt-2">
                  <button onClick={saveNotes} disabled={saving} className="px-3 py-1.5 bg-coral text-white rounded-lg text-xs font-body hover:bg-coral/90">Save</button>
                  <button onClick={() => setEditNotes(false)} className="px-3 py-1.5 border border-taupe/20 rounded-lg text-xs font-body text-charcoal/50">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="min-h-16 cursor-pointer rounded-xl border border-taupe/15 p-3 hover:bg-cream transition-colors" onClick={() => setEditNotes(true)}>
                <p className="font-body text-xs text-charcoal/50 font-light">
                  {profile.internal_notes || <span className="italic text-charcoal/25">Click to add internal notes...</span>}
                </p>
              </div>
            )}
          </div>
        )}

        {tab === 'intake' && (
          <div className="space-y-2 text-xs font-body text-charcoal/60">
            {[
              ['Supply Preferences', profile.supply_preferences],
              ['Laundry Preferences', profile.laundry_preferences],
              ['Children', profile.children_present],
              ['Seniors', profile.seniors_present ? 'Yes' : null],
              ['Emergency Contact', profile.emergency_contact_name],
              ['Emergency Phone', profile.emergency_contact_phone],
            ].map(([label, val]) => val ? (
              <div key={label} className="bg-cream rounded-xl p-3 border border-taupe/10">
                <p className="text-[10px] uppercase tracking-widest text-charcoal/30">{label}</p>
                <p className="mt-0.5 font-light">{val}</p>
              </div>
            ) : null)}
          </div>
        )}
      </div>
    </div>
  );
}

function NewHouseholdModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ guest_name: '', guest_email: '', guest_phone: '' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = async () => {
    if (!form.guest_email) return;
    setSaving(true);
    const created = await base44.entities.HouseholdProfile.create(form);
    onCreate(created);
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-taupe/15 shadow-2xl w-full max-w-sm p-6">
        <h3 className="font-heading text-base font-semibold text-charcoal mb-4">New Household</h3>
        <div className="space-y-3">
          <input placeholder="Full name" value={form.guest_name} onChange={e => set('guest_name', e.target.value)}
            className="w-full border border-taupe/20 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-coral/40" />
          <input placeholder="Email *" value={form.guest_email} onChange={e => set('guest_email', e.target.value)}
            className="w-full border border-taupe/20 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-coral/40" />
          <input placeholder="Phone" value={form.guest_phone} onChange={e => set('guest_phone', e.target.value)}
            className="w-full border border-taupe/20 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-coral/40" />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={submit} disabled={saving || !form.guest_email} className="flex-1 py-2.5 bg-coral text-white rounded-xl text-sm font-body hover:bg-coral/90 disabled:opacity-50">
            {saving ? 'Creating...' : 'Create Household'}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 border border-taupe/20 rounded-xl text-sm font-body text-charcoal/50 hover:bg-cream">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminHouseholdsOS({ sidebarItem }) {
  const [profiles, setProfiles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [filterMember, setFilterMember] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    Promise.all([
      base44.entities.HouseholdProfile.list('-created_date', 200),
      base44.entities.Booking.list('-scheduled_date', 300),
    ]).then(([p, b]) => {
      setProfiles(p || []);
      setBookings(b || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = profiles.filter(p => {
    const q = search.toLowerCase();
    const match = !q || p.guest_name?.toLowerCase().includes(q) || p.guest_email?.toLowerCase().includes(q);
    const memberMatch = !filterMember || p.membership_status === 'active';
    return match && memberMatch;
  });

  return (
    <div className="flex h-full">
      {/* List */}
      <div className="w-80 shrink-0 border-r border-taupe/15 flex flex-col bg-cream/30">
        <div className="p-3 border-b border-taupe/10 space-y-2 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-base font-semibold text-charcoal">Households</h2>
            <button onClick={() => setShowNew(true)} className="flex items-center gap-1 bg-coral text-white px-2.5 py-1.5 rounded-lg text-xs font-body hover:bg-coral/90">
              <Plus className="w-3.5 h-3.5" /> New
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-charcoal/30" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search households..."
              className="w-full bg-cream border border-taupe/20 rounded-lg pl-8 pr-3 py-1.5 text-xs font-body text-charcoal/70 focus:outline-none focus:border-coral/40" />
          </div>
          <div className="flex gap-1.5">
            <button onClick={() => setFilterMember(false)}
              className={`px-2.5 py-1 rounded-lg text-xs font-body transition-colors ${!filterMember ? 'bg-coral text-white' : 'text-charcoal/50 hover:bg-cream'}`}>
              All ({profiles.length})
            </button>
            <button onClick={() => setFilterMember(true)}
              className={`px-2.5 py-1 rounded-lg text-xs font-body transition-colors ${filterMember ? 'bg-coral text-white' : 'text-charcoal/50 hover:bg-cream'}`}>
              Members ({profiles.filter(p => p.membership_status === 'active').length})
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {loading ? (
            <div className="flex justify-center py-12"><div className="w-5 h-5 border-2 border-coral border-t-transparent rounded-full animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <p className="text-xs text-charcoal/30 font-body font-light text-center py-8">No households found.</p>
          ) : filtered.map(p => (
            <HouseholdCard key={p.id} profile={p} bookings={bookings} onClick={setSelected} isSelected={selected?.id === p.id} />
          ))}
        </div>
      </div>

      {showNew && (
        <NewHouseholdModal
          onClose={() => setShowNew(false)}
          onCreate={p => setProfiles(prev => [p, ...prev])}
        />
      )}

      {/* Detail */}
      {selected ? (
        <div className="flex-1 overflow-hidden">
          <HouseholdDetail
            profile={selected}
            bookings={bookings}
            onClose={() => setSelected(null)}
            onUpdate={(id, updates) => setProfiles(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-charcoal/20">
          <div className="text-center">
            <User className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-body text-sm font-light">Select a household to view details</p>
          </div>
        </div>
      )}
    </div>
  );
}