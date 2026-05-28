import React from 'react';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';

const STATUS_COLORS = {
  pending: 'bg-butter/40 text-charcoal border-butter',
  confirmed: 'bg-sage/30 text-charcoal border-sage',
  completed: 'bg-taupe/30 text-charcoal/60 border-taupe',
  cancelled: 'bg-red-50 text-red-400 border-red-100',
};

export default function BookingListItem({ booking, isSelected, onClick }) {
  const cfg = SERVICE_CONFIG[booking.service_category];
  const displayDate = booking.scheduled_date
    ? new Date(booking.scheduled_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '—';

  const photos = booking.intake_answers?.uploaded_photos || [];

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
        isSelected ? 'border-coral bg-coral/5 shadow-sm' : 'bg-warm-white border-taupe/15 hover:border-coral/25'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="font-heading text-sm font-semibold text-charcoal leading-tight">{booking.client_name}</span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-body font-light shrink-0 ${STATUS_COLORS[booking.status]}`}>
          {booking.status}
        </span>
      </div>
      <p className="font-body text-xs text-charcoal/45 font-light">{cfg?.label || booking.service_category}</p>
      <div className="flex items-center justify-between mt-1">
        <p className="font-body text-xs text-charcoal/30 font-light">{displayDate} · {booking.scheduled_start_time || 'TBD'}</p>
        {photos.length > 0 && (
          <span className="text-[10px] text-mauve font-body font-light">📷 {photos.length}</span>
        )}
      </div>
    </button>
  );
}