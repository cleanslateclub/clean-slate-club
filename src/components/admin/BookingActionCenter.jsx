import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ClipboardCheck, Search, ShieldCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import BookingActionsPanel from '@/components/admin/BookingActionsPanel';
import BookingAuditTrail from '@/components/admin/BookingAuditTrail';
import ProviderAssignmentPreview from '@/components/admin/ProviderAssignmentPreview';
import SchedulePreviewPanel from '@/components/admin/SchedulePreviewPanel';
import { buildGoogleMapsDirectionsUrl, hasMapAddress } from '@/lib/mapLinks';

const ACTION_FILTERS = [
  { key: 'review', label: 'Needs Review' },
  { key: 'unassigned', label: 'Unassigned' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'all', label: 'All Active' },
];

const isActive = (booking = {}) => !['cancelled', 'archived'].includes(booking.status);

const filterBookings = (bookings = [], filter = 'review') => {
  const active = bookings.filter(isActive);
  if (filter === 'review') return active.filter(item => item.requires_admin_approval || item.approval_status === 'pending' || item.status === 'needs_review');
  if (filter === 'unassigned') return active.filter(item => !item.provider_email && !['draft', 'completed'].includes(item.status));
  if (filter === 'upcoming') {
    const today = new Date().toISOString().split('T')[0];
    return active.filter(item => item.scheduled_date >= today && item.status !== 'completed');
  }
  return active;
};

function ActionSafetyNotice() {
  return (
    <div className="rounded-3xl bg-butter/15 border border-butter/30 p-4 flex items-start gap-3">
      <div className="w-9 h-9 rounded-2xl bg-warm-white border border-taupe/10 flex items-center justify-center shrink-0">
        <ShieldCheck className="w-4 h-4 text-coral" />
      </div>
      <div>
        <p className="font-heading text-base text-charcoal">Controlled actions only</p>
        <p className="font-body text-sm text-charcoal/45 font-light mt-1 leading-relaxed">
          Use this screen for manual review, controlled status updates, assignment preview, assignment save, and schedule preview. Fees, refunds, checkout sends, schedule-save automation, and message sending stay locked.
        </p>
      </div>
    </div>
  );
}

function ActionFilterButton({ item, active, count, onClick }) {
  return (
    <button type="button" onClick={onClick} className={`rounded-2xl border px-4 py-3 text-left transition-all ${active ? 'bg-coral/10 border-coral/25' : 'bg-warm-white border-taupe/15 hover:border-coral/20'}`}>
      <p className="font-body text-xs uppercase tracking-widest text-charcoal/35">{item.label}</p>
      <p className="font-heading text-2xl text-charcoal mt-1">{count}</p>
    </button>
  );
}

function BookingActionCard({ booking, selected, onSelect }) {
  return (
    <button type="button" onClick={() => onSelect(booking)} className={`w-full text-left rounded-3xl border p-4 transition-all ${selected ? 'bg-coral/10 border-coral/25' : 'bg-warm-white border-taupe/15 hover:border-coral/20'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-heading text-lg text-charcoal">{booking.client_name || 'Guest'}</p>
          <p className="font-body text-xs text-charcoal/40 font-light mt-1">{booking.client_email || booking.client_phone || 'No contact shown'}</p>
        </div>
        <span className="px-2 py-1 rounded-full bg-cream border border-taupe/10 text-[10px] font-body text-charcoal/45">
          {(booking.status || 'unknown').replace(/_/g, ' ')}
        </span>
      </div>
      <p className="font-body text-sm text-charcoal/55 font-light mt-3">{booking.service_label || booking.service_category || 'Service'}</p>
      <p className="font-body text-xs text-charcoal/35 font-light mt-1">{booking.scheduled_date || 'No date'} {booking.scheduled_start_time || ''}</p>
    </button>
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

function BookingActionDetail({ booking, onUpdated }) {
  if (!booking) {
    return (
      <div className="rounded-3xl bg-warm-white border border-taupe/15 p-6 text-center">
        <ClipboardCheck className="w-6 h-6 text-sage mx-auto mb-3" />
        <p className="font-heading text-lg text-charcoal">Select a booking</p>
        <p className="font-body text-sm text-charcoal/40 font-light mt-1">Choose a booking to run controlled admin actions.</p>
      </div>
    );
  }

  const intake = booking.intake_answers || {};
  const address = booking.client_address || intake.service_address?.formatted || '';

  return (
    <div className="rounded-3xl bg-warm-white border border-taupe/15 p-6 space-y-5">
      <div>
        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Booking actions</p>
        <h2 className="font-heading text-2xl text-charcoal mt-1">{booking.client_name || 'Guest'}</h2>
        <p className="font-body text-sm text-charcoal/40 font-light mt-1">{booking.service_label || booking.service_category || 'Service'}</p>
      </div>

      <BookingActionsPanel booking={booking} onUpdated={onUpdated} />
      <ProviderAssignmentPreview booking={booking} onAssigned={onUpdated} />
      <SchedulePreviewPanel booking={booking} />
      <BookingAuditTrail booking={booking} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <DetailTile label="Status" value={booking.status} />
        <DetailTile label="Approval" value={booking.approval_status || (booking.requires_admin_approval ? 'pending' : 'not required')} />
        <DetailTile label="Date" value={booking.scheduled_date} />
        <DetailTile label="Time" value={`${booking.scheduled_start_time || ''}${booking.scheduled_end_time ? ` - ${booking.scheduled_end_time}` : ''}`} />
        <DetailTile label="Provider" value={booking.provider_name || booking.provider_email || 'Unassigned'} />
        <DetailTile label="Payment" value={booking.payment_status || booking.deposit_status || 'Unknown'} />
      </div>

      <div className="rounded-2xl bg-cream border border-taupe/10 p-4">
        <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Address</p>
        <p className="font-body text-sm text-charcoal/60 font-light mt-1">{address || 'Not set'}</p>
        {hasMapAddress(address) && (
          <a href={buildGoogleMapsDirectionsUrl(address)} target="_blank" rel="noreferrer" className="inline-flex mt-3 text-xs font-body text-coral hover:text-coral/80 transition-colors">
            Open directions in Google Maps
          </a>
        )}
      </div>
    </div>
  );
}

export default function BookingActionCenter() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('review');
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
        const records = await base44.entities.Booking.list('-created_date', 300);
        if (!active) return;
        setBookings(records || []);
      } catch (error) {
        console.error('Booking action center load failed:', error);
        if (active) setLoadError('Could not load bookings from Base44.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const counts = useMemo(() => Object.fromEntries(ACTION_FILTERS.map(item => [item.key, filterBookings(bookings, item.key).length])), [bookings]);

  const visibleBookings = useMemo(() => {
    const pool = filterBookings(bookings, filter);
    const q = search.trim().toLowerCase();
    if (!q) return pool;
    return pool.filter(booking => [booking.client_name, booking.client_email, booking.client_phone, booking.client_address, booking.service_label, booking.service_category, booking.status]
      .some(value => String(value || '').toLowerCase().includes(q)));
  }, [bookings, filter, search]);

  const selectedBooking = selected ? bookings.find(booking => booking.id === selected.id) || selected : null;

  const handleUpdated = (updatedBooking) => {
    if (!updatedBooking?.id) return;
    setBookings(prev => prev.map(booking => booking.id === updatedBooking.id ? { ...booking, ...updatedBooking } : booking));
    setSelected(updatedBooking);
  };

  return (
    <div className="space-y-6">
      <div className="bg-warm-white rounded-3xl border border-taupe/15 p-6">
        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Booking Action Center</p>
        <h2 className="font-heading text-2xl font-semibold text-charcoal mt-1">Controlled booking actions</h2>
        <p className="font-body text-sm text-charcoal/45 font-light mt-2 max-w-3xl leading-relaxed">
          Approve, hold, complete, or archive booking records without enabling automatic policy actions yet.
        </p>
        {loading && <p className="font-body text-xs text-charcoal/35 font-light mt-3">Loading bookings...</p>}
        {loadError && <p className="font-body text-xs text-coral font-light mt-3">{loadError}</p>}
      </div>

      <ActionSafetyNotice />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {ACTION_FILTERS.map(item => (
          <ActionFilterButton key={item.key} item={item} active={filter === item.key} count={counts[item.key] || 0} onClick={() => { setFilter(item.key); setSelected(null); }} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 space-y-3">
          <div className="rounded-3xl bg-warm-white border border-taupe/15 p-4 flex items-center gap-3">
            <Search className="w-4 h-4 text-charcoal/30" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search action queue..." className="w-full bg-transparent outline-none font-body text-sm text-charcoal/60 placeholder:text-charcoal/25" />
          </div>

          {visibleBookings.length === 0 ? (
            <div className="rounded-3xl bg-warm-white border border-taupe/15 p-6 text-center">
              <p className="font-body text-sm text-charcoal/40 font-light">No bookings in this action queue.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {visibleBookings.map(booking => (
                <BookingActionCard key={booking.id} booking={booking} selected={selected?.id === booking.id} onSelect={setSelected} />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
          <BookingActionDetail booking={selectedBooking} onUpdated={handleUpdated} />
        </div>
      </div>
    </div>
  );
}
