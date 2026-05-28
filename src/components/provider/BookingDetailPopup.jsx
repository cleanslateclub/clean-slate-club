import React from 'react';
import { X, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';

export default function BookingDetailPopup({ booking, onClose }) {
  if (!booking) return null;

  const cfg = SERVICE_CONFIG[booking.service_category];
  const displayDate = booking.scheduled_date
    ? new Date(booking.scheduled_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : 'TBD';

  const addonLabels = (booking.addons || [])
    .map(id => cfg?.addons?.find(a => a.id === id)?.label)
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-warm-white rounded-3xl border border-taupe/15 shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
        {/* Header */}
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
          {/* Schedule */}
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

          {/* Contact */}
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

          {/* Service & Add-ons */}
          {(addonLabels.length > 0) && (
            <div className="bg-cream rounded-2xl p-4">
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-2">Add-ons</p>
              <div className="space-y-1">
                {addonLabels.map((label, i) => (
                  <p key={i} className="font-body text-sm text-charcoal/70 font-light">+ {label}</p>
                ))}
              </div>
            </div>
          )}

          {/* Pricing */}
          <div className="bg-cream rounded-2xl p-4">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-2">Estimate</p>
            <p className="font-body text-xl font-semibold text-coral">
              ${booking.estimated_price_low}–${booking.estimated_price_high}
            </p>
          </div>

          {/* Status */}
          <div className="bg-cream rounded-2xl p-4">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-2">Status</p>
            <span className={`inline-block text-[10px] px-2.5 py-0.5 rounded-full border font-body font-light capitalize ${
              booking.status === 'confirmed' ? 'bg-sage/20 border-sage/40 text-charcoal/60' :
              booking.status === 'pending' ? 'bg-butter/20 border-butter/40 text-charcoal/60' :
              booking.status === 'completed' ? 'bg-taupe/20 border-taupe/40 text-charcoal/60' :
              'bg-red-50 border-red-100 text-red-600'
            }`}>
              {booking.status}
            </span>
          </div>

          {/* Special notes */}
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