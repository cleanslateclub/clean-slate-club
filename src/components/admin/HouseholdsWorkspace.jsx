import React, { useEffect, useMemo, useState } from 'react';
import { Home, Search, Star, Users } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import HouseholdMapLink from '@/components/admin/HouseholdMapLink';

const FILTERS = [
  { key: 'all', label: 'All', icon: Home },
  { key: 'members', label: 'Members', icon: Star },
  { key: 'outside_area', label: 'Outside Area', icon: Users },
];

const getFilteredHouseholds = (records = [], filter = 'all') => {
  if (filter === 'members') return records.filter(item => item.membership_status === 'active');
  if (filter === 'outside_area') return records.filter(item => item.service_area_status === 'outside_area');
  return records;
};

function FilterButton({ item, active, count, onClick }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-3xl border p-4 text-left transition-all ${active ? 'bg-coral/10 border-coral/25' : 'bg-warm-white border-taupe/15 hover:border-coral/20'}`}
    >
      <div className="flex items-center justify-between gap-3">
        <Icon className={`w-4 h-4 ${active ? 'text-coral' : 'text-charcoal/35'}`} />
        <span className="font-heading text-2xl text-charcoal">{count}</span>
      </div>
      <p className="font-body text-xs uppercase tracking-widest text-charcoal/35 mt-3">{item.label}</p>
    </button>
  );
}

function HouseholdCard({ household, selected, onSelect }) {
  return (
    <div className={`w-full text-left rounded-3xl border p-4 transition-all ${selected ? 'bg-coral/10 border-coral/25' : 'bg-warm-white border-taupe/15 hover:border-coral/20'}`}>
      <button type="button" onClick={() => onSelect(household)} className="w-full text-left">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-heading text-lg text-charcoal">{household.guest_name || household.guest_email || 'Household'}</p>
            <p className="font-body text-xs text-charcoal/40 font-light mt-1">{household.guest_phone || household.guest_email || 'No contact shown'}</p>
          </div>
          <span className="px-2 py-1 rounded-full bg-cream border border-taupe/10 text-[10px] font-body text-charcoal/45">
            {household.membership_status || 'none'}
          </span>
        </div>
        <p className="font-body text-sm text-charcoal/55 font-light mt-3">{household.primary_service_address || 'No address on file'}</p>
      </button>
      <div className="mt-3">
        <HouseholdMapLink record={household} />
      </div>
    </div>
  );
}

function DetailTile({ label, value }) {
  return (
    <div className="rounded-2xl bg-cream border border-taupe/10 p-4">
      <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">{label}</p>
      <p className="font-body text-sm text-charcoal/60 font-light mt-1 break-words">{value || 'Not set'}</p>
    </div>
  );
}

function HouseholdDetail({ household }) {
  if (!household) {
    return (
      <div className="rounded-3xl bg-warm-white border border-taupe/15 p-6 text-center">
        <Users className="w-6 h-6 text-sage mx-auto mb-3" />
        <p className="font-heading text-lg text-charcoal">Select a household</p>
        <p className="font-body text-sm text-charcoal/40 font-light mt-1">Choose a household to view location, contact, and service history.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-warm-white border border-taupe/15 p-6 space-y-5">
      <div>
        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Household detail</p>
        <h2 className="font-heading text-2xl text-charcoal mt-1">{household.guest_name || household.guest_email || 'Household'}</h2>
        <p className="font-body text-sm text-charcoal/40 font-light mt-1">{household.primary_service_address || 'No address on file'}</p>
        <div className="mt-3"><HouseholdMapLink record={household} /></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <DetailTile label="Email" value={household.guest_email} />
        <DetailTile label="Phone" value={household.guest_phone} />
        <DetailTile label="Membership" value={household.membership_status || 'none'} />
        <DetailTile label="Service area" value={household.service_area_status || 'Unknown'} />
        <DetailTile label="Booking count" value={household.booking_count} />
        <DetailTile label="Last booking" value={household.last_booking_date} />
      </div>

      <DetailTile label="Provider-safe notes" value={household.provider_safe_notes} />
      <DetailTile label="Parking notes" value={household.parking_notes} />
    </div>
  );
}

export default function HouseholdsWorkspace() {
  const [households, setHouseholds] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setLoadError('');
      try {
        const records = await base44.entities.HouseholdProfile.list('-last_booking_date', 300);
        if (!active) return;
        setHouseholds(records || []);
      } catch (error) {
        console.error('Households workspace load failed:', error);
        if (active) setLoadError('Could not load households from Base44.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const counts = useMemo(() => Object.fromEntries(FILTERS.map(item => [item.key, getFilteredHouseholds(households, item.key).length])), [households]);

  const filteredHouseholds = useMemo(() => {
    const pool = getFilteredHouseholds(households, filter);
    const q = search.trim().toLowerCase();
    if (!q) return pool;
    return pool.filter(household => [household.guest_name, household.guest_email, household.guest_phone, household.primary_service_address, household.service_area_status]
      .some(value => String(value || '').toLowerCase().includes(q)));
  }, [households, filter, search]);

  const selectedHousehold = selected ? households.find(item => item.id === selected.id) || selected : null;

  return (
    <div className="space-y-6">
      <div className="bg-warm-white rounded-3xl border border-taupe/15 p-6">
        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Households workspace</p>
        <h2 className="font-heading text-2xl font-semibold text-charcoal mt-1">Household records and directions</h2>
        <p className="font-body text-sm text-charcoal/45 font-light mt-2 max-w-3xl leading-relaxed">
          One place to view guest household records, service address, and Google Maps directions.
        </p>
        {loading && <p className="font-body text-xs text-charcoal/35 font-light mt-3">Loading households...</p>}
        {loadError && <p className="font-body text-xs text-coral font-light mt-3">{loadError}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {FILTERS.map(item => (
          <FilterButton key={item.key} item={item} active={filter === item.key} count={counts[item.key] || 0} onClick={() => { setFilter(item.key); setSelected(null); }} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 space-y-3">
          <div className="rounded-3xl bg-warm-white border border-taupe/15 p-4 flex items-center gap-3">
            <Search className="w-4 h-4 text-charcoal/30" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search households..."
              className="w-full bg-transparent outline-none font-body text-sm text-charcoal/60 placeholder:text-charcoal/25"
            />
          </div>

          {filteredHouseholds.length === 0 ? (
            <div className="rounded-3xl bg-warm-white border border-taupe/15 p-6 text-center">
              <p className="font-body text-sm text-charcoal/40 font-light">No households in this view.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredHouseholds.map(household => (
                <HouseholdCard key={household.id} household={household} selected={selected?.id === household.id} onSelect={setSelected} />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
          <HouseholdDetail household={selectedHousehold} />
        </div>
      </div>
    </div>
  );
}
