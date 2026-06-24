import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, ClipboardList, Clock, Search, UserPlus } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const QUEUES = [
  { key: 'needs_review', label: 'Needs Review', icon: AlertTriangle },
  { key: 'unassigned', label: 'Unassigned', icon: UserPlus },
  { key: 'upcoming', label: 'Upcoming', icon: Clock },
  { key: 'completed', label: 'Completed', icon: CheckCircle2 },
  { key: 'all', label: 'All Active', icon: ClipboardList },
];

const isActiveBooking = (booking = {}) => !['cancelled', 'archived'].includes(booking.status);

const getQueueBookings = (bookings = [], queue = 'needs_review') => {
  const active = bookings.filter(isActiveBooking);

  if (queue === 'needs_review') {
    return active.filter(booking => booking.status === 'needs_review' || booking.approval_status === 'pending' || booking.requires_admin_approval);
  }

  if (queue === 'unassigned') {
    return active.filter(booking => !booking.provider_email && !['draft', 'completed'].includes(booking.status));
  }

  if (queue === 'upcoming') {
    const today = new Date().toISOString().split('T')[0];
    return active
      .filter(booking => booking.scheduled_date >= today && !['completed'].includes(booking.status))
      .sort((a, b) => `${a.scheduled_date || ''} ${a.scheduled_start_time || ''}`.localeCompare(`${b.scheduled_date || ''} ${b.scheduled_start_time || ''}`));
  }

  if (queue === 'completed') {
    return bookings.filter(booking => booking.status === 'completed');
  }

  return active;
};

function QueueButton({ item, active, count, onClick }) {
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

function BookingCard({ booking, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(booking)}
      className={`w-full text-left rounded-3xl border p-4 transition-all ${selected ? 'bg-coral/10 border-coral/25' : 'bg-warm-white border-taupe/15 hover:border-coral/20'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-heading text-lg text-charcoal">{booking.client_name || 'Guest'}</p>
          <p className="font-body text-xs text-charcoal/40 font-light mt-1">{booking.client_email || booking.client_phone || 'No contact shown'}</p>
        </div>
        <span className="px-2 py-1 rounded-full bg-cream border border-taupe/10 text-[10px] font-body text-charcoal/45">
          {(booking.status || 'unknown').replace(/_/g, ' ')}
        </span>
      </div>
      <p className="font-body text-sm text-charcoal/55 font-light mt-3">
        {booking.service_label || booking.service_category || 'Service'}
      </p>
      <p className="font-body text-xs text-charcoal/35 font-light mt-1">
        {booking.scheduled_date || 'No date'} {booking.scheduled_start_time || ''}
      </p>
      {booking.requires_admin_approval && (
        <p className="font-body text-xs text-coral font-light mt-3">Manual review required</p>
      )}
    </button>
  );
}

function BookingDetailPanel({ booking }) {
  if (!booking) {
    return (
      <div className="rounded-3xl bg-warm-white border border-taupe/15 p-6 text-center">
        <ClipboardList className="w-6 h-6 text-sage mx-auto mb-3" />
        <p className="font-heading text-lg text-charcoal">Select a booking</p>
        <p className="font-body text-sm text-charcoal/40 font-light mt-1">Choose a booking from the queue to review the operational details.</p>
      </div>
    );
  }

  const intake = booking.intake_answers || {};

  return (
    <div className="rounded-3xl bg-warm-white border border-taupe/15 p-6 space-y-5">
      <div>
        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Booking detail</p>
        <h2 className="font-heading text-2xl text-charcoal mt-1">{booking.client_name || 'Guest'}</h2>
        <p className="font-body text-sm text-charcoal/40 font-light mt-1">{booking.service_label || booking.service_category || 'Service'}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          ['Status', booking.status],
          ['Approval', booking.approval_status || (booking.requires_admin_approval ? 'pending' : 'not required')],
          ['Date', booking.scheduled_date],
          ['Time', `${booking.scheduled_start_time || ''}${booking.scheduled_end_time ? ` - ${booking.scheduled_end_time}` : ''}`],
          ['Provider', booking.provider_name || booking.provider_email || 'Unassigned'],
          ['Service area', intake.service_area?.status || booking.service_area_status || 'Unknown'],
          ['Deposit', booking.deposit_status || 'Unknown'],
          ['Payment', booking.payment_status || 'Unknown'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-cream border border-taupe/10 p-4">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">{label}</p>
            <p className="font-body text-sm text-charcoal/60 font-light mt-1 break-words">{value || 'Not set'}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-cream border border-taupe/10 p-4">
        <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Address</p>
        <p className="font-body text-sm text-charcoal/60 font-light mt-1">{booking.client_address || intake.service_address?.formatted || 'Not set'}</p>
      </div>

      <div className="rounded-2xl bg-cream border border-taupe/10 p-4">
        <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Provider-safe notes</p>
        <p className="font-body text-sm text-charcoal/60 font-light mt-1 whitespace-pre-wrap">{booking.provider_notes || booking.special_notes || 'No notes yet.'}</p>
      </div>
    </div>
  );
}

export default function BookingsWorkspace() {
  const [bookings, setBookings] = useState([]);
  const [queue, setQueue] = useState('needs_review');
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
        console.error('Bookings workspace load failed:', error);
        if (active) setLoadError('Could not load bookings from Base44.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const queueCounts = useMemo(() => Object.fromEntries(QUEUES.map(item => [item.key, getQueueBookings(bookings, item.key).length])), [bookings]);

  const filteredBookings = useMemo(() => {
    const pool = getQueueBookings(bookings, queue);
    const q = search.trim().toLowerCase();
    if (!q) return pool;
    return pool.filter(booking => [booking.client_name, booking.client_email, booking.client_phone, booking.client_address, booking.service_label, booking.service_category, booking.status]
      .some(value => String(value || '').toLowerCase().includes(q)));
  }, [bookings, queue, search]);

  const selectedBooking = selected ? bookings.find(booking => booking.id === selected.id) || selected : null;

  return (
    <div className="space-y-6">
      <div className="bg-warm-white rounded-3xl border border-taupe/15 p-6">
        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Bookings workspace</p>
        <h2 className="font-heading text-2xl font-semibold text-charcoal mt-1">Operational booking queues</h2>
        <p className="font-body text-sm text-charcoal/45 font-light mt-2 max-w-3xl leading-relaxed">
          A replacement for the legacy booking tab, organized around the work that actually needs attention.
        </p>
        {loading && <p className="font-body text-xs text-charcoal/35 font-light mt-3">Loading bookings...</p>}
        {loadError && <p className="font-body text-xs text-coral font-light mt-3">{loadError}</p>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {QUEUES.map(item => (
          <QueueButton key={item.key} item={item} active={queue === item.key} count={queueCounts[item.key] || 0} onClick={() => { setQueue(item.key); setSelected(null); }} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 space-y-3">
          <div className="rounded-3xl bg-warm-white border border-taupe/15 p-4 flex items-center gap-3">
            <Search className="w-4 h-4 text-charcoal/30" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search bookings..."
              className="w-full bg-transparent outline-none font-body text-sm text-charcoal/60 placeholder:text-charcoal/25"
            />
          </div>

          {filteredBookings.length === 0 ? (
            <div className="rounded-3xl bg-warm-white border border-taupe/15 p-6 text-center">
              <p className="font-body text-sm text-charcoal/40 font-light">No bookings in this queue.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} selected={selected?.id === booking.id} onSelect={setSelected} />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
          <BookingDetailPanel booking={selectedBooking} />
        </div>
      </div>
    </div>
  );
}
