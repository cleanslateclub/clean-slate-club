import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { SERVICE_CONFIG, minutesToTime, timeToMinutes } from '@/lib/bookingConfig';
import { useAuth } from '@/lib/AuthContext';

const STATUS_COLORS = {
  pending: 'bg-butter/40 text-charcoal border-butter',
  confirmed: 'bg-sage/30 text-charcoal border-sage',
  completed: 'bg-taupe/30 text-charcoal/60 border-taupe',
  cancelled: 'bg-red-50 text-red-400 border-red-100',
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selected, setSelected] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    base44.entities.Booking.list('-scheduled_date', 100).then(data => {
      setBookings(data || []);
      setLoading(false);
    });
  }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    await base44.entities.Booking.update(id, { status });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    setUpdatingId(null);
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="font-body text-charcoal/40">Access restricted to admins.</p>
      </div>
    );
  }

  const filtered = bookings.filter(b => filter === 'all' || b.status === filter);
  const selectedBooking = selected ? bookings.find(b => b.id === selected) : null;

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-coral/60 font-light mb-1">Admin</p>
          <h1 className="font-heading text-3xl font-semibold text-charcoal">Booking Dashboard</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {['pending', 'confirmed', 'completed', 'cancelled'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 ${filter === s ? 'border-coral bg-coral/5' : 'bg-warm-white border-taupe/15 hover:border-coral/25'}`}
            >
              <p className="font-body text-2xl font-semibold text-charcoal">{bookings.filter(b => b.status === s).length}</p>
              <p className="font-body text-xs text-charcoal/40 font-light capitalize">{s}</p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-1 space-y-3">
            <div className="flex gap-2 mb-4">
              {['pending', 'confirmed', 'all'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-body font-light border transition-all ${filter === f ? 'bg-coral border-coral text-white' : 'bg-warm-white border-taupe/20 text-charcoal/50 hover:border-coral/30'}`}
                >
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            {loading && <p className="font-body text-sm text-charcoal/35 font-light">Loading...</p>}
            {filtered.map(b => {
              const cfg = SERVICE_CONFIG[b.service_category];
              const displayDate = b.scheduled_date ? new Date(b.scheduled_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—';
              return (
                <button
                  key={b.id}
                  onClick={() => setSelected(b.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${selected === b.id ? 'border-coral bg-coral/5' : 'bg-warm-white border-taupe/15 hover:border-coral/25'}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-heading text-sm font-semibold text-charcoal">{b.client_name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-body font-light ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                  </div>
                  <p className="font-body text-xs text-charcoal/45 font-light">{cfg?.label || b.service_category}</p>
                  <p className="font-body text-xs text-charcoal/30 font-light">{displayDate} · {b.scheduled_start_time}</p>
                </button>
              );
            })}
            {!loading && filtered.length === 0 && (
              <p className="font-body text-sm text-charcoal/30 font-light text-center py-8">No bookings found.</p>
            )}
          </div>

          {/* Detail */}
          <div className="lg:col-span-2">
            {selectedBooking ? (
              <BookingDetail booking={selectedBooking} onUpdateStatus={updateStatus} updatingId={updatingId} />
            ) : (
              <div className="bg-warm-white rounded-3xl border border-taupe/15 p-10 flex items-center justify-center h-64">
                <p className="font-body text-sm text-charcoal/30 font-light">Select a booking to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingDetail({ booking, onUpdateStatus, updatingId }) {
  const cfg = SERVICE_CONFIG[booking.service_category];
  const displayDate = booking.scheduled_date
    ? new Date(booking.scheduled_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : '—';

  const addonItems = (booking.addons || []).map(id => cfg?.addons?.find(a => a.id === id)).filter(Boolean);
  const intake = booking.intake_answers || {};

  return (
    <div className="bg-warm-white rounded-3xl border border-taupe/15 p-6 sm:p-8 space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-heading text-xl font-semibold text-charcoal">{booking.client_name}</h2>
          <p className="font-body text-sm text-charcoal/45 font-light">{booking.client_email} · {booking.client_phone}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['pending', 'confirmed', 'completed', 'cancelled'].map(s => (
            <button
              key={s}
              disabled={booking.status === s || updatingId === booking.id}
              onClick={() => onUpdateStatus(booking.id, s)}
              className={`px-3 py-1.5 rounded-full text-xs font-body font-light border transition-all disabled:opacity-40 ${booking.status === s ? STATUS_COLORS[s] : 'bg-cream border-taupe/20 text-charcoal/50 hover:border-coral/30'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-cream rounded-2xl p-4">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-1">Service</p>
          <p className="font-body text-sm text-charcoal font-light">{cfg?.label || booking.service_category}</p>
          {addonItems.length > 0 && addonItems.map(a => (
            <p key={a.id} className="font-body text-xs text-charcoal/40 font-light">+ {a.label}</p>
          ))}
        </div>
        <div className="bg-cream rounded-2xl p-4">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-1">Schedule</p>
          <p className="font-body text-sm text-charcoal font-light">{displayDate}</p>
          <p className="font-body text-xs text-charcoal/45 font-light">{booking.scheduled_start_time} – {booking.scheduled_end_time}</p>
          <p className="font-body text-xs text-charcoal/30 font-light">{booking.total_duration_minutes ? (booking.total_duration_minutes / 60).toFixed(1) + ' hrs total' : ''}</p>
        </div>
        <div className="bg-cream rounded-2xl p-4">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-1">Address</p>
          <p className="font-body text-sm text-charcoal font-light">{booking.client_address}</p>
        </div>
        <div className="bg-cream rounded-2xl p-4">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-1">Estimate</p>
          <p className="font-body text-sm text-coral font-light">${booking.estimated_price_low}–${booking.estimated_price_high}</p>
        </div>
      </div>

      {Object.keys(intake).length > 0 && (
        <div>
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-3">Intake Answers</p>
          <div className="space-y-2">
            {Object.entries(intake).filter(([k]) => k !== 'special_notes').map(([k, v]) => (
              <div key={k} className="flex gap-3 text-xs font-body">
                <span className="text-charcoal/35 font-light capitalize min-w-[140px] shrink-0">{k.replace(/_/g, ' ')}:</span>
                <span className="text-charcoal/60 font-light">{Array.isArray(v) ? v.join(', ') : v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {booking.special_notes && (
        <div>
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-1">Special Notes</p>
          <p className="font-body text-sm text-charcoal/55 font-light">{booking.special_notes}</p>
        </div>
      )}
    </div>
  );
}