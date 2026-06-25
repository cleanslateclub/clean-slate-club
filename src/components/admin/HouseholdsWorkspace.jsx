import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Home, Search, Star, Users, XCircle } from 'lucide-react';
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

const getHouseholdReadinessRows = (household = {}) => [
  {
    key: 'contact',
    label: 'Guest contact',
    ready: Boolean(household.guest_email || household.guest_phone),
    value: household.guest_email || household.guest_phone || 'Missing',
    helper: 'Needed for booking follow-up, member records, and message testing.',
  },
  {
    key: 'address',
    label: 'Service address',
    ready: Boolean(household.primary_service_address),
    value: household.primary_service_address || 'Missing',
    helper: 'Needed for map links, provider job cards, service area review, and travel rules.',
  },
  {
    key: 'service_area',
    label: 'Service area status',
    ready: Boolean(household.service_area_status && household.service_area_status !== 'unknown'),
    warning: household.service_area_status === 'outside_area',
    value: household.service_area_status || 'Unknown',
    helper: 'Outside-area and unknown-area households should stay in manual review.',
  },
  {
    key: 'membership',
    label: 'Membership status',
    ready: Boolean(household.membership_status),
    value: household.membership_status || 'None shown',
    helper: 'Needed for priority booking, member rules, and reporting.',
  },
  {
    key: 'booking_history',
    label: 'Booking history',
    ready: Number(household.booking_count || 0) > 0 || Boolean(household.last_booking_date),
    value: `${household.booking_count || 0} bookings${household.last_booking_date ? ` · last ${household.last_booking_date}` : ''}`,
    helper: 'Helpful for support context and retargeting logic.',
  },
  {
    key: 'provider_notes',
    label: 'Provider-safe notes',
    ready: Boolean(household.provider_safe_notes || household.parking_notes || household.access_notes),
    value: household.provider_safe_notes || household.parking_notes || household.access_notes || 'None shown',
    helper: 'Helpful for provider job cards without exposing sensitive admin-only notes.',
  },
  {
    key: 'review_flags',
    label: 'Review flags',
    ready: !household.no_show_count && !household.manual_review_required,
    warning: Number(household.no_show_count || 0) > 0 || Boolean(household.manual_review_required),
    value: household.manual_review_required ? 'Manual review required' : Number(household.no_show_count || 0) > 0 ? `${household.no_show_count} no-show flag(s)` : 'No flags shown',
    helper: 'Manual review keeps sensitive household decisions out of automation.',
  },
];

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
      <p className="font-body text-sm text-charcoal/60 font-light mt-1 break-words whitespace-pre-wrap">{value || 'Not set'}</p>
    </div>
  );
}

function ReadinessItem({ item }) {
  const Icon = item.ready ? CheckCircle2 : item.warning ? AlertTriangle : XCircle;
  const tone = item.ready
    ? 'text-sage bg-sage/10 border-sage/20'
    : item.warning
      ? 'text-coral bg-coral/10 border-coral/20'
      : 'text-charcoal/55 bg-cream border-taupe/15';

  return (
    <div className="rounded-2xl bg-cream border border-taupe/10 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-body text-sm text-charcoal/65 font-light">{item.label}</p>
          <p className="font-body text-xs text-charcoal/35 font-light mt-1 break-words">{item.value || 'Not set'}</p>
          <p className="font-body text-[11px] text-charcoal/30 font-light mt-2 leading-relaxed">{item.helper}</p>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-body uppercase tracking-widest shrink-0 ${tone}`}>
          <Icon className="w-3 h-3" />
          {item.ready ? 'Ready' : item.warning ? 'Review' : 'Missing'}
        </span>
      </div>
    </div>
  );
}

function HouseholdReadinessPanel({ household }) {
  const rows = getHouseholdReadinessRows(household);
  const reviewCount = rows.filter(row => !row.ready).length;

  return (
    <div className="rounded-3xl bg-warm-white border border-taupe/15 p-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Household readiness</p>
          <h3 className="font-heading text-xl text-charcoal mt-1">Record quality checklist</h3>
          <p className="font-body text-sm text-charcoal/40 font-light mt-2 max-w-2xl leading-relaxed">
            Read-only checklist for contact, address, service area, membership, notes, and review flags before live testing.
          </p>
        </div>
        <div className="rounded-2xl bg-cream border border-taupe/10 px-4 py-3 text-right">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Review items</p>
          <p className="font-heading text-2xl text-charcoal mt-1">{reviewCount}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 mt-4">
        {rows.map(item => <ReadinessItem key={item.key} item={item} />)}
      </div>
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

      <HouseholdReadinessPanel household={household} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <DetailTile label="Email" value={household.guest_email} />
        <DetailTile label="Phone" value={household.guest_phone} />
        <DetailTile label="Membership" value={household.membership_status || 'none'} />
        <DetailTile label="Service area" value={household.service_area_status || 'Unknown'} />
        <DetailTile label="Booking count" value={household.booking_count} />
        <DetailTile label="Last booking" value={household.last_booking_date} />
        <DetailTile label="Preferred provider" value={household.preferred_provider_name || household.preferred_provider_email} />
        <DetailTile label="No-show count" value={household.no_show_count} />
      </div>

      <DetailTile label="Provider-safe notes" value={household.provider_safe_notes} />
      <DetailTile label="Parking notes" value={household.parking_notes} />
      <DetailTile label="Access notes" value={household.access_notes} />
      <DetailTile label="Admin notes" value={household.admin_notes || household.internal_notes} />
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
          One place to view guest household records, service address, Google Maps directions, and record readiness.
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
