import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';
import { Phone, Mail, MapPin, FileText, Image, Trash2, CalendarCheck, MessageSquare, ExternalLink } from 'lucide-react';
import InvoiceModal from './InvoiceModal';
import PhotoViewer from './PhotoViewer';
import CancellationPolicyPanel from './CancellationPolicyPanel';

const STATUS_COLORS = {
  pending: 'bg-butter/40 text-charcoal border-butter',
  confirmed: 'bg-sage/30 text-charcoal border-sage',
  completed: 'bg-taupe/30 text-charcoal/60 border-taupe',
  cancelled: 'bg-red-50 text-red-400 border-red-100',
};

const STATUS_LIST = ['pending', 'confirmed', 'completed', 'cancelled', 'archived'];

export default function BookingDetail({ booking, onUpdateStatus, onDelete, updatingId }) {
  const cfg = SERVICE_CONFIG[booking.service_category];
  const [showInvoice, setShowInvoice] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);
  const [adminNote, setAdminNote] = useState(booking.admin_notes || '');
  const [savingNote, setSavingNote] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const intake = booking.intake_answers || {};
  const photos = intake.uploaded_photos || [];
  const tasks = intake._tasks || [];
  const addonItems = (booking.addons || []).map(id => cfg?.addons?.find(a => a.id === id)).filter(Boolean);

  const displayDate = booking.scheduled_date
    ? new Date(booking.scheduled_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : 'TBD';

  const saveNote = async () => {
    setSavingNote(true);
    await base44.entities.Booking.update(booking.id, { admin_notes: adminNote });
    setSavingNote(false);
  };

  const intakeClean = Object.entries(intake).filter(([k]) =>
    k !== '_tasks' && k !== 'uploaded_photos' && k !== 'special_notes' && k !== 'most_helpful'
  );

  return (
    <div className="bg-warm-white rounded-3xl border border-taupe/15 overflow-hidden">
      {/* Top bar */}
      <div className="px-6 pt-6 pb-4 border-b border-taupe/10 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h2 className="font-heading text-xl font-semibold text-charcoal">{booking.client_name}</h2>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-body font-light ${STATUS_COLORS[booking.status]}`}>
              {booking.status}
            </span>
          </div>
          <p className="font-body text-xs text-charcoal/40 font-light">
            {cfg?.label || booking.service_category}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick contact */}
          <a href={`tel:${booking.client_phone}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-sage/20 border border-sage/40 text-charcoal/60 text-xs font-body font-light hover:bg-sage/30 transition-colors">
            <Phone className="w-3 h-3" /> Call
          </a>
          <a href={`mailto:${booking.client_email}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-peach/20 border border-peach/40 text-charcoal/60 text-xs font-body font-light hover:bg-peach/30 transition-colors">
            <Mail className="w-3 h-3" /> Email
          </a>
          <a href={`sms:${booking.client_phone}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-butter/20 border border-butter/60 text-charcoal/60 text-xs font-body font-light hover:bg-butter/30 transition-colors">
            <MessageSquare className="w-3 h-3" /> Text
          </a>
          <button onClick={() => setShowInvoice(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-coral/10 border border-coral/30 text-coral text-xs font-body font-light hover:bg-coral/20 transition-colors">
            <FileText className="w-3 h-3" /> Invoice
          </button>
          {photos.length > 0 && (
            <button onClick={() => setShowPhotos(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-mauve/10 border border-mauve/30 text-mauve text-xs font-body font-light hover:bg-mauve/20 transition-colors">
              <Image className="w-3 h-3" /> Photos ({photos.length})
            </button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Status changer */}
        <div>
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-2">Update Status</p>
          <div className="flex gap-2 flex-wrap">
            {STATUS_LIST.map(s => (
              <button
                key={s}
                disabled={booking.status === s || updatingId === booking.id}
                onClick={() => onUpdateStatus(booking.id, s)}
                className={`px-3 py-1.5 rounded-full text-xs font-body font-light border transition-all disabled:cursor-default ${
                  booking.status === s ? STATUS_COLORS[s] : 'bg-cream border-taupe/20 text-charcoal/50 hover:border-coral/30'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-cream rounded-2xl p-4">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-1">Schedule</p>
            <p className="font-body text-sm text-charcoal font-light">{displayDate}</p>
            <p className="font-body text-xs text-charcoal/45 font-light">
              {booking.scheduled_start_time} – {booking.scheduled_end_time}
            </p>
            {booking.total_duration_minutes > 0 && (
              <p className="font-body text-xs text-charcoal/30 font-light">
                {(booking.total_duration_minutes / 60).toFixed(1)} hrs
              </p>
            )}
          </div>

          <div className="bg-cream rounded-2xl p-4">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-1">Estimate</p>
            <p className="font-body text-xl font-semibold text-coral">
              ${booking.estimated_price_low}–${booking.estimated_price_high}
            </p>
            {booking.admin_notes?.includes('Stripe ID:') && (
              <p className="font-body text-[10px] text-sage font-light mt-1">✓ Deposit paid</p>
            )}
          </div>

          <div className="bg-cream rounded-2xl p-4 col-span-2">
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin className="w-3 h-3 text-charcoal/30" />
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light">Address</p>
            </div>
            <p className="font-body text-sm text-charcoal font-light">{booking.client_address || 'Not provided'}</p>
            {booking.client_address && (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(booking.client_address)}`}
                target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1 text-coral text-xs font-body font-light mt-1.5 hover:underline"
              >
                <ExternalLink className="w-3 h-3" /> Open in Maps
              </a>
            )}
          </div>
        </div>

        {/* Contact info */}
        <div className="bg-cream rounded-2xl p-4">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-2">Contact</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-charcoal/30 shrink-0" />
              <a href={`mailto:${booking.client_email}`} className="font-body text-sm text-coral font-light hover:underline">
                {booking.client_email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-charcoal/30 shrink-0" />
              <a href={`tel:${booking.client_phone}`} className="font-body text-sm text-coral font-light hover:underline">
                {booking.client_phone}
              </a>
            </div>
          </div>
        </div>

        {/* Service + add-ons */}
        {(addonItems.length > 0 || tasks.length > 0) && (
          <div className="bg-cream rounded-2xl p-4">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-2">What They Want</p>
            {tasks.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tasks.map(t => (
                  <span key={t} className="px-2.5 py-1 rounded-full bg-sage/20 border border-sage/40 text-xs font-body font-light text-charcoal/60">
                    {t}
                  </span>
                ))}
              </div>
            )}
            {addonItems.map(a => (
              <p key={a.id} className="font-body text-xs text-charcoal/50 font-light">+ {a.label}</p>
            ))}
          </div>
        )}

        {/* Photos thumbnail row */}
        {photos.length > 0 && (
          <div>
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-2">Client Photos</p>
            <div className="flex gap-2 flex-wrap">
              {photos.slice(0, 6).map((url, i) => (
                <button
                  key={i}
                  onClick={() => setShowPhotos(true)}
                  className="w-16 h-16 rounded-xl overflow-hidden border border-taupe/20 hover:border-coral/40 transition-colors"
                >
                  <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
              {photos.length > 6 && (
                <button
                  onClick={() => setShowPhotos(true)}
                  className="w-16 h-16 rounded-xl border border-taupe/20 bg-cream flex items-center justify-center text-xs font-body text-charcoal/40 font-light hover:border-coral/40 transition-colors"
                >
                  +{photos.length - 6}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Intake answers */}
        {intakeClean.length > 0 && (
          <details className="group">
            <summary className="cursor-pointer font-body text-xs text-charcoal/40 font-light hover:text-charcoal/60 transition-colors list-none flex items-center gap-1.5">
              <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
              View intake answers ({intakeClean.length} fields)
            </summary>
            <div className="mt-3 space-y-1.5 pl-4 border-l-2 border-taupe/15">
              {intakeClean.map(([k, v]) => (
                <div key={k} className="flex gap-3 text-xs font-body">
                  <span className="text-charcoal/35 font-light capitalize min-w-[130px] shrink-0">{k.replace(/_/g, ' ')}:</span>
                  <span className="text-charcoal/60 font-light">{Array.isArray(v) ? v.join(', ') : String(v)}</span>
                </div>
              ))}
            </div>
          </details>
        )}

        {/* What would help most */}
        {intake.most_helpful && (
          <div className="px-4 py-3 rounded-2xl" style={{ background: '#fdf6f3', borderLeft: '3px solid #EB9486' }}>
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-1">What would make this most helpful</p>
            <p className="font-body text-sm text-charcoal/60 font-light leading-relaxed">{intake.most_helpful}</p>
          </div>
        )}

        {/* Special notes */}
        {booking.special_notes && (
          <div className="px-4 py-3 rounded-2xl bg-butter/15 border border-butter/30">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-1">Special Notes</p>
            <p className="font-body text-sm text-charcoal/60 font-light leading-relaxed">{booking.special_notes}</p>
          </div>
        )}

        {/* Admin notes */}
        <div>
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-2">Provider Notes (private)</p>
          <textarea
            value={adminNote}
            onChange={e => setAdminNote(e.target.value)}
            onBlur={saveNote}
            placeholder="Add private notes for yourself..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 transition-colors resize-none"
          />
          <div className="flex items-center justify-between mt-1">
            <p className="font-body text-[10px] text-charcoal/25 font-light">Auto-saves on blur</p>
            {savingNote && <p className="font-body text-[10px] text-sage font-light">Saving...</p>}
          </div>
        </div>

        {/* Cancellation policy reference */}
        {['pending', 'confirmed'].includes(booking.status) && (
          <CancellationPolicyPanel compact />
        )}

        {/* Delete */}
        <div className="pt-2 border-t border-taupe/10">
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 text-xs font-body font-light text-charcoal/30 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete booking
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <p className="font-body text-xs text-charcoal/50 font-light">Delete permanently?</p>
              <button
                onClick={() => onDelete(booking.id)}
                className="px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-400 text-xs font-body font-light hover:bg-red-100 transition-colors"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs font-body font-light text-charcoal/40 hover:text-charcoal transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {showInvoice && (
        <InvoiceModal booking={{ ...booking, _cfg: cfg }} onClose={() => setShowInvoice(false)} />
      )}
      {showPhotos && (
        <PhotoViewer photos={photos} onClose={() => setShowPhotos(false)} />
      )}
    </div>
  );
}