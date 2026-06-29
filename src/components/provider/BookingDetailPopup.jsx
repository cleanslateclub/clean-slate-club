import React, { useState } from 'react';
import { X, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';

export default function BookingDetailPopup({ booking, onClose, isAdmin = false }) {
  const [updatingStatus, setUpdatingStatus] = useState(false);

  if (!booking) return null;

  const cfg = SERVICE_CONFIG[booking.service_category];
  const displayDate = booking.scheduled_date
    ? new Date(booking.scheduled_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : 'TBD';

  const addonLabels = (booking.addons || [])
    .map(id => cfg?.addons?.find(a => a.id === id)?.label)
    .filter(Boolean);

  const handleStatusChange = async (newStatus) => {
    if (!isAdmin) return;
    setUpdatingStatus(true);
    await base44.entities.Booking.update(booking.id, { status: newStatus });
    setUpdatingStatus(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-warm-white rounded-3xl border border-taupe/15 shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-warm-white border-b border-taupe/10 px-6 py-4 flex items-start justify-between">
          <div>
            <h2 className="font-heading text-lg font-semibold text-charcoal">{booking.client_name}</h2>
            <p className="font-body text-xs text-charcoal/40 font-light">{cfg?.label || booking.service_category}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-taupe/10 rounded-lg transition-colors">
            <X className="w-5 h-5 text-charcoal/40" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="bg-cream rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-3.5 h-3.5 text-charcoal/30" />
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light">Schedule</p>
            </div>
            <p className="font-body text-sm text-charcoal font-light">{displayDate}</p>
            <p className="font-body text-xs text-charcoal/45 font-light">
              {booking.scheduled_start_time} – {booking.scheduled_end_time}
            </p>
            {booking.total_duration_minutes > 0 && (
              <p className="font-body text-xs text-charcoal/30 font-light">
                {(booking.total_duration_minutes / 60).toFixed(1)} hours
              </p>
            )}
          </div>

          <div className="space-y-2">
            {booking.client_phone && (
              <a href={`tel:${booking.client_phone}`} className="flex items-center gap-3 p-3 rounded-xl border border-taupe/15 hover:border-coral/30 hover:bg-cream transition-colors">
                <Phone className="w-4 h-4 text-charcoal/40" />
                <span className="font-body text-sm text-coral font-light">{booking.client_phone}</span>
              </a>
            )}
            {booking.client_email && (
              <a href={`mailto:${booking.client_email}`} className="flex items-center gap-3 p-3 rounded-xl border border-taupe/15 hover:border-coral/30 hover:bg-cream transition-colors">
                <Mail className="w-4 h-4 text-charcoal/40" />
                <span className="font-body text-sm text-coral font-light break-all">{booking.client_email}</span>
              </a>
            )}
            {booking.client_address && (
              <div className="flex items-start gap-3 p-3 rounded-xl border border-taupe/15 bg-cream">
                <MapPin className="w-4 h-4 text-charcoal/40 shrink-0 mt-0.5" />
                <p className="font-body text-sm text-charcoal/70 font-light">{booking.client_address}</p>
              </div>
            )}
          </div>

          {addonLabels.length > 0 && (
            <div className="bg-cream rounded-2xl p-4">
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-2">Add-ons</p>
              <div className="space-y-1">
                {addonLabels.map((label, i) => (
                  <p key={i} className="font-body text-sm text-charcoal/70 font-light">+ {label}</p>
                ))}
              </div>
            </div>
          )}

          <div className="bg-cream rounded-2xl p-4">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-2">Estimate</p>
            <p className="font-body text-xl font-semibold text-coral">
              ${booking.estimated_price_low}–${booking.estimated_price_high}
            </p>
          </div>

          <div className="bg-cream rounded-2xl p-4">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-2">Status</p>
            <span className="inline-flex px-3 py-1.5 rounded-full text-xs font-body font-light border capitalize bg-coral/10 border-coral/25 text-charcoal/70">
              {booking.status || 'pending'}
            </span>
          </div>

          {isAdmin && (
            <div className="bg-cream rounded-2xl p-4">
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-3">Admin Status Controls</p>
              <div className="flex gap-2 flex-wrap">
                {['pending', 'confirmed', 'completed', 'cancelled'].map(s => (
                  <button
                    key={s}
                    disabled={booking.status === s || updatingStatus}
                    onClick={() => handleStatusChange(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-body font-light border transition-all disabled:cursor-default capitalize ${
                      booking.status === s
                        ? 'bg-coral/20 border-coral/40 text-charcoal'
                        : 'border-taupe/20 bg-white text-charcoal/50 hover:border-coral/30'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {booking.special_notes && (
            <div className="px-4 py-3 rounded-2xl bg-butter/15 border border-butter/30">
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-1">Notes</p>
              <p className="font-body text-sm text-charcoal/70 font-light">{booking.special_notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
