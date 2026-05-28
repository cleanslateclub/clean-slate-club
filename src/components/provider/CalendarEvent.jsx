import React, { useState } from 'react';
import { Clock, MapPin, User, Eye } from 'lucide-react';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';

export default function CalendarEvent({ block, booking, onUpdate, onClick }) {
  const [expanded, setExpanded] = useState(false);

  if (!booking) {
    return (
      <div
        className={`rounded-lg p-3 border-l-4 text-xs font-body cursor-pointer hover:shadow-md transition-all ${
          block.block_type === 'booking'
            ? 'bg-coral/10 border-coral text-charcoal'
            : block.block_type === 'travel'
            ? 'bg-slate/10 border-slate text-charcoal/50'
            : 'bg-cream border-taupe text-charcoal/40'
        }`}
      >
        <p className="font-light">{block.label || block.block_type}</p>
        <p className="text-[10px] opacity-70">{block.start_time} – {block.end_time}</p>
      </div>
    );
  }

  const service = SERVICE_CONFIG[booking.service_category];
  const color = service?.color || '#EB9486';

  return (
    <div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onClick={onClick}
      className={`rounded-lg p-3 border-l-4 text-xs font-body cursor-pointer hover:shadow-md transition-all ${
        expanded ? 'ring-2 ring-coral/30' : ''
      }`}
      style={{ borderLeftColor: color, backgroundColor: color + '15' }}
    >
      {/* Collapsed view */}
      {!expanded && (
        <>
          <p className="font-semibold text-charcoal truncate">{booking.client_name}</p>
          <p className="text-[10px] text-charcoal/60 font-light">{block.start_time} – {block.end_time}</p>
          <p className="text-[10px] text-charcoal/50 font-light mt-1">{service?.label}</p>
        </>
      )}

      {/* Expanded view (tooltip) */}
      {expanded && (
        <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 bg-white rounded-lg shadow-lg border border-taupe/20 p-4 pointer-events-none">
          <p className="font-heading font-semibold text-charcoal mb-3">{booking.client_name}</p>

          <div className="space-y-2 text-xs font-body text-charcoal/60 font-light">
            <div className="flex items-center gap-2">
              <Clock size={14} />
              {block.start_time} – {block.end_time}
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              {booking.client_address}
            </div>
            <div className="flex items-center gap-2">
              <User size={14} />
              {booking.client_phone}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-taupe/10">
            <p className="text-[10px] text-charcoal/50 font-light">{service?.label}</p>
            <p className="text-[10px] text-coral font-semibold mt-1">${booking.estimated_price_low}–${booking.estimated_price_high}</p>
          </div>

          {booking.special_notes && (
            <div className="mt-3 pt-3 border-t border-taupe/10">
              <p className="text-[10px] text-charcoal/60 italic">{booking.special_notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}