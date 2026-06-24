import React from 'react';
import { History } from 'lucide-react';

const formatEventLabel = (type = '') => String(type || 'event').replace(/_/g, ' ');

const formatDateTime = (value = '') => {
  if (!value) return 'No timestamp';
  try {
    return new Date(value).toLocaleString();
  } catch (_error) {
    return value;
  }
};

export default function BookingAuditTrail({ booking = {} }) {
  const events = Array.isArray(booking.audit_log) ? booking.audit_log : [];

  return (
    <div className="rounded-2xl bg-cream border border-taupe/10 p-4">
      <div className="flex items-center gap-2">
        <History className="w-4 h-4 text-coral/70" />
        <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Booking history</p>
      </div>

      {events.length === 0 ? (
        <p className="font-body text-sm text-charcoal/40 font-light mt-3">No booking history has been logged yet.</p>
      ) : (
        <div className="space-y-3 mt-4">
          {events.slice().reverse().map((event, index) => (
            <div key={`${event.type || 'event'}-${event.created_at || index}`} className="rounded-2xl bg-warm-white border border-taupe/15 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-heading text-base text-charcoal capitalize">{formatEventLabel(event.type)}</p>
                  <p className="font-body text-xs text-charcoal/35 font-light mt-1">{formatDateTime(event.created_at || event.timestamp)}</p>
                </div>
                <span className="px-2 py-1 rounded-full bg-cream border border-taupe/10 text-[10px] font-body text-charcoal/40">
                  {event.actor || 'System'}
                </span>
              </div>
              {event.provider_name && <p className="font-body text-xs text-charcoal/45 font-light mt-2">Provider: {event.provider_name}</p>}
              {event.note && <p className="font-body text-xs text-charcoal/45 font-light mt-2">{event.note}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
