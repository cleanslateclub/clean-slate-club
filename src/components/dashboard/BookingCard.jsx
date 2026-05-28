import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Tag, ChevronDown, ChevronUp, X, RefreshCw, CheckCircle } from 'lucide-react';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';
import { base44 } from '@/api/base44Client';

const STATUS_STYLES = {
  pending: { bg: 'bg-butter/30', text: 'text-charcoal/70', label: 'Pending Confirmation' },
  confirmed: { bg: 'bg-sage/30', text: 'text-charcoal/70', label: 'Confirmed' },
  completed: { bg: 'bg-mist/30', text: 'text-charcoal/50', label: 'Completed' },
  cancelled: { bg: 'bg-coral/20', text: 'text-coral/80', label: 'Cancelled' },
};

export default function BookingCard({ booking, onCancelled, isPast = false }) {
  const [expanded, setExpanded] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelResult, setCancelResult] = useState(null);

  const config = SERVICE_CONFIG[booking.service_category];
  const status = STATUS_STYLES[booking.status] || STATUS_STYLES.pending;

  const displayDate = booking.scheduled_date
    ? new Date(booking.scheduled_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : 'Date TBD';

  const addonLabels = (booking.addons || [])
    .map(id => config?.addons?.find(a => a.id === id)?.label)
    .filter(Boolean);

  const selectedTasks = booking.intake_answers?._tasks || [];

  const isWithin24Hours = () => {
    if (!booking.scheduled_date || !booking.scheduled_start_time || booking.scheduled_start_time === 'TBD') return false;
    const [time, period] = booking.scheduled_start_time.split(' ');
    let [h, m] = time.split(':').map(Number);
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    const [y, mo, d] = booking.scheduled_date.split('-').map(Number);
    const serviceTime = new Date(y, mo - 1, d, h, m, 0);
    return (serviceTime.getTime() - Date.now()) / (1000 * 60 * 60) <= 24;
  };

  const within24 = isWithin24Hours();
  const canCancel = !isPast && booking.status !== 'cancelled' && booking.status !== 'completed';

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await base44.functions.invoke('cancelBooking', { bookingId: booking.id });
      setCancelResult({ success: true, message: res.data.message });
      setShowConfirm(false);
      if (onCancelled) onCancelled(booking.id);
    } catch (e) {
      setCancelResult({ success: false, message: 'Something went wrong. Please contact us directly.' });
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div
      className={`rounded-2xl bg-warm-white transition-all ${isPast ? 'opacity-75' : 'hover:shadow-sm'}`}
      style={{ border: '1px solid #e8e8e4', borderLeft: `3px solid ${config?.color || '#EB9486'}` }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="font-heading text-base font-semibold text-charcoal">{config?.label || booking.service_category}</p>
            {config?.sublabel && <p className="font-body text-xs text-charcoal/50 font-light">{config.sublabel}</p>}
          </div>
          <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-body font-light ${status.bg} ${status.text}`}>
            {status.label}
          </span>
        </div>

        {/* Key info */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-sm font-body font-light text-charcoal/70">
            <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: config?.color || '#EB9486' }} />
            <span>{displayDate}</span>
          </div>
          {booking.scheduled_start_time && booking.scheduled_start_time !== 'TBD' && (
            <div className="flex items-center gap-2 text-sm font-body font-light text-charcoal/70">
              <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: config?.color || '#EB9486' }} />
              <span>{booking.scheduled_start_time}{booking.scheduled_end_time && booking.scheduled_end_time !== 'TBD' ? ` – ${booking.scheduled_end_time}` : ''}</span>
            </div>
          )}
          {booking.client_address && (
            <div className="flex items-center gap-2 text-sm font-body font-light text-charcoal/70">
              <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: config?.color || '#EB9486' }} />
              <span className="truncate">{booking.client_address}</span>
            </div>
          )}
          {addonLabels.length > 0 && (
            <div className="flex items-start gap-2 text-sm font-body font-light text-charcoal/70">
              <Tag className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: config?.color || '#EB9486' }} />
              <span>{addonLabels.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-3 border-t border-taupe/10">
          {booking.estimated_price_low ? (
            <p className="font-body text-xs text-charcoal/60 font-light">
              Est. <span className="font-semibold" style={{ color: config?.color || '#EB9486' }}>${booking.estimated_price_low}–${booking.estimated_price_high}</span>
              {booking.status !== 'cancelled' && <span className="ml-1 text-charcoal/40">· $50 deposit paid</span>}
            </p>
          ) : <div />}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 font-body text-xs text-charcoal/40 hover:text-charcoal transition-colors"
          >
            {expanded ? 'Less' : 'View details'}
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Expanded section */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-taupe/10 pt-4">

          {/* Tasks selected */}
          {selectedTasks.length > 0 && (
            <div>
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/40 font-light mb-2">Tasks Requested</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedTasks.map(task => (
                  <span
                    key={task}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-body font-light text-white"
                    style={{ background: config?.color || '#EB9486' }}
                  >
                    <CheckCircle className="w-2.5 h-2.5" />{task}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Add-ons detail */}
          {addonLabels.length > 0 && (
            <div>
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/40 font-light mb-2">Add-Ons</p>
              <div className="space-y-1">
                {addonLabels.map(label => (
                  <p key={label} className="font-body text-xs text-charcoal/70 font-light flex items-center gap-1.5">
                    <span className="text-coral">+</span>{label}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Intake answers */}
          {booking.intake_answers && Object.entries(booking.intake_answers)
            .filter(([k, v]) => k !== '_tasks' && k !== 'uploaded_photos' && v && typeof v === 'string' && v.length > 0)
            .length > 0 && (
            <div>
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/40 font-light mb-2">Your Intake Details</p>
              <div className="space-y-1">
                {Object.entries(booking.intake_answers)
                  .filter(([k, v]) => k !== '_tasks' && k !== 'uploaded_photos' && v && typeof v === 'string' && v.length > 0)
                  .slice(0, 6)
                  .map(([key, value]) => (
                    <p key={key} className="font-body text-xs text-charcoal/70 font-light">
                      <span className="text-charcoal/40 capitalize">{key.replace(/_/g, ' ')}: </span>{value}
                    </p>
                  ))}
              </div>
            </div>
          )}

          {/* Special notes */}
          {booking.special_notes && (
            <div>
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/40 font-light mb-1">Special Notes</p>
              <p className="font-body text-xs text-charcoal/70 font-light leading-relaxed">{booking.special_notes}</p>
            </div>
          )}

          {/* Photos */}
          {booking.intake_answers?.uploaded_photos?.length > 0 && (
            <div>
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/40 font-light mb-2">Photos Submitted</p>
              <div className="flex flex-wrap gap-2">
                {booking.intake_answers.uploaded_photos.slice(0, 4).map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                    <img src={url} alt="Upload" className="w-16 h-16 object-cover rounded-xl border border-taupe/20" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Cancel / Reschedule actions */}
          {canCancel && !cancelResult && (
            <div className="pt-2 border-t border-taupe/10 space-y-2">
              {within24 && (
                <p className="font-body text-xs text-charcoal/60 font-light bg-butter/20 border border-butter/40 rounded-xl px-3 py-2">
                  ⚠️ Your service is within 24 hours — cancellations now will forfeit the $50 deposit per our policy.
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                <a
                  href={`mailto:cleanslateclubpa@gmail.com?subject=Reschedule Request — ${config?.label || ''}&body=Hi Masha,%0A%0AI'd like to reschedule my booking on ${displayDate} at ${booking.scheduled_start_time || 'TBD'}.%0A%0AMy preferred new date/time:%0A%0AThanks!`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-taupe/20 font-body text-xs text-charcoal/70 hover:border-coral/30 hover:text-charcoal transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Request Reschedule
                </a>
                {!showConfirm ? (
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-coral/20 font-body text-xs text-coral/70 hover:bg-coral/5 hover:border-coral/40 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Cancel Booking
                  </button>
                ) : (
                  <div className="flex flex-col gap-2 p-3 rounded-xl bg-coral/5 border border-coral/15 w-full">
                    <p className="font-body text-xs text-charcoal font-light">
                      {within24
                        ? 'Are you sure? Your $50 deposit will NOT be refunded (within 24hr window).'
                        : 'Cancel this booking? Your $50 deposit will be automatically refunded.'}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancel}
                        disabled={cancelling}
                        className="px-4 py-1.5 rounded-full bg-coral text-white font-body text-xs hover:bg-coral/90 disabled:opacity-50 transition-colors"
                      >
                        {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
                      </button>
                      <button
                        onClick={() => setShowConfirm(false)}
                        className="px-4 py-1.5 rounded-full border border-taupe/20 font-body text-xs text-charcoal/60 hover:border-charcoal/30 transition-colors"
                      >
                        Keep It
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cancel result message */}
          {cancelResult && (
            <div className={`p-3 rounded-xl text-xs font-body font-light ${cancelResult.success ? 'bg-sage/20 text-charcoal' : 'bg-coral/10 text-coral'}`}>
              {cancelResult.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}