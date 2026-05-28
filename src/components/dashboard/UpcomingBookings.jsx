import React from 'react';
import { Calendar, Clock, MapPin, Tag } from 'lucide-react';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';

const STATUS_STYLES = {
  pending: { bg: 'bg-butter/30', text: 'text-charcoal/70', label: 'Pending Confirmation' },
  confirmed: { bg: 'bg-sage/30', text: 'text-charcoal/70', label: 'Confirmed' },
  completed: { bg: 'bg-mist/30', text: 'text-charcoal/50', label: 'Completed' },
  cancelled: { bg: 'bg-coral/20', text: 'text-coral/80', label: 'Cancelled' },
};

function BookingCard({ booking }) {
  const config = SERVICE_CONFIG[booking.service_category];
  const status = STATUS_STYLES[booking.status] || STATUS_STYLES.pending;
  const displayDate = booking.scheduled_date
    ? new Date(booking.scheduled_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : 'Date TBD';
  const addonLabels = (booking.addons || []).map(id => config?.addons?.find(a => a.id === id)?.label).filter(Boolean);

  return (
    <div
      className="rounded-2xl border border-taupe/15 bg-warm-white p-5 hover:shadow-sm transition-shadow"
      style={{ borderLeft: `3px solid ${config?.color || '#EB9486'}` }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-heading text-base font-semibold text-charcoal">{config?.label || booking.service_category}</p>
          {config?.sublabel && <p className="font-body text-xs text-charcoal/40 font-light">{config.sublabel}</p>}
        </div>
        <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-body font-light ${status.bg} ${status.text}`}>
          {status.label}
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-sm font-body font-light text-charcoal/60">
          <Calendar className="w-3.5 h-3.5 text-coral/60 shrink-0" />
          <span>{displayDate}</span>
        </div>
        {booking.scheduled_start_time && booking.scheduled_start_time !== 'TBD' && (
          <div className="flex items-center gap-2 text-sm font-body font-light text-charcoal/60">
            <Clock className="w-3.5 h-3.5 text-coral/60 shrink-0" />
            <span>{booking.scheduled_start_time}{booking.scheduled_end_time && booking.scheduled_end_time !== 'TBD' ? ` – ${booking.scheduled_end_time}` : ''}</span>
          </div>
        )}
        {booking.client_address && (
          <div className="flex items-center gap-2 text-sm font-body font-light text-charcoal/60">
            <MapPin className="w-3.5 h-3.5 text-coral/60 shrink-0" />
            <span className="truncate">{booking.client_address}</span>
          </div>
        )}
        {addonLabels.length > 0 && (
          <div className="flex items-start gap-2 text-sm font-body font-light text-charcoal/60">
            <Tag className="w-3.5 h-3.5 text-coral/60 shrink-0 mt-0.5" />
            <span>{addonLabels.join(', ')}</span>
          </div>
        )}
      </div>

      {booking.estimated_price_low && (
        <div className="mt-4 pt-3 border-t border-taupe/10">
          <p className="font-body text-xs text-charcoal/40 font-light">
            Estimated: <span className="font-semibold text-coral/80">${booking.estimated_price_low}–${booking.estimated_price_high}</span>
            <span className="ml-1">· $50 deposit paid</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default function UpcomingBookings({ bookings, loading }) {
  const today = new Date().toISOString().split('T')[0];
  const upcoming = bookings
    .filter(b => b.scheduled_date >= today && b.status !== 'cancelled')
    .sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date));
  const past = bookings
    .filter(b => b.scheduled_date < today || b.status === 'completed')
    .sort((a, b) => b.scheduled_date.localeCompare(a.scheduled_date))
    .slice(0, 3);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map(i => (
          <div key={i} className="h-32 rounded-2xl bg-taupe/10 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-sm font-semibold text-charcoal mb-3">Upcoming Visits</h3>
        {upcoming.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-taupe/30 p-8 text-center">
            <p className="font-body text-sm text-charcoal/40 font-light mb-3">No upcoming visits scheduled.</p>
            <a href="/book" className="inline-block bg-coral text-white font-body text-xs tracking-wide px-6 py-2.5 rounded-full hover:bg-coral/90 transition-colors">
              Book a Visit →
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map(b => <BookingCard key={b.id} booking={b} />)}
          </div>
        )}
      </div>

      {past.length > 0 && (
        <div>
          <h3 className="font-heading text-sm font-semibold text-charcoal/50 mb-3">Recent Visits</h3>
          <div className="space-y-3 opacity-70">
            {past.map(b => <BookingCard key={b.id} booking={b} />)}
          </div>
        </div>
      )}
    </div>
  );
}