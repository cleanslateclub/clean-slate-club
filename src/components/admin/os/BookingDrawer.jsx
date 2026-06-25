import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { X, MapPin, Phone, Mail, User, Clock, DollarSign, CheckSquare, AlertTriangle, ExternalLink, ChevronDown, ChevronUp, Lock, Eye, Printer, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUSES = [
  { key: 'pending', label: 'New Request' },
  { key: 'needs_review', label: 'Needs Review' },
  { key: 'approved', label: 'Approved' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'provider_assigned', label: 'Assigned' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'no_show', label: 'No Show' },
  { key: 'archived', label: 'Archived' },
];

const STATUS_BADGE = {
  pending:          'bg-coral/15 border-coral/40 text-coral',
  needs_review:     'bg-coral/10 border-coral text-coral',
  approved:         'bg-sage/20 border-sage/60 text-green-700',
  confirmed:        'bg-sage/25 border-sage text-green-800',
  provider_assigned:'bg-blue-gray/15 border-blue-gray/40 text-blue-gray',
  in_progress:      'bg-peach/20 border-peach/60 text-amber-800',
  completed:        'bg-sage/15 border-sage/40 text-green-600',
  cancelled:        'bg-taupe/15 border-taupe/40 text-charcoal/40',
  no_show:          'bg-red-50 border-red-200 text-red-600',
  archived:         'bg-taupe/10 border-taupe/30 text-charcoal/30',
};

const LOCKED_ACTIONS = new Set(['send_sms', 'charge_final', 'auto_assign', 'issue_refund']);

function InfoRow({ icon: Icon, label, value, link }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2.5 py-1.5 border-b border-taupe/8">
      <Icon className="w-3.5 h-3.5 text-charcoal/30 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">{label}</p>
        {link ? (
          <a href={link} target="_blank" rel="noreferrer" className="font-body text-xs text-coral hover:underline flex items-center gap-1">
            {value} <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <p className="font-body text-xs text-charcoal/80 font-light">{value}</p>
        )}
      </div>
    </div>
  );
}

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-taupe/10">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-cream/50 transition-colors"
      >
        <span className="font-body text-[10px] font-semibold uppercase tracking-[0.15em] text-charcoal/40">{title}</span>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-charcoal/25" /> : <ChevronDown className="w-3.5 h-3.5 text-charcoal/25" />}
      </button>
      {open && <div className="px-4 pb-3">{children}</div>}
    </div>
  );
}

function ActionButton({ label, icon: Icon, onClick, variant = 'default', locked = false }) {
  const base = 'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-body font-light border transition-all w-full text-left';
  const styles = {
    default: 'border-taupe/20 text-charcoal/60 hover:border-coral/30 hover:text-coral hover:bg-coral/5',
    primary: 'border-coral bg-coral text-white hover:bg-coral/90',
    success: 'border-sage bg-sage/20 text-green-700 hover:bg-sage/30',
    danger: 'border-red-200 text-red-500 hover:bg-red-50',
  };
  if (locked) {
    return (
      <div className={`${base} border-taupe/10 text-charcoal/25 cursor-not-allowed opacity-50`}>
        <Lock className="w-3.5 h-3.5" />
        {label}
        <span className="ml-auto font-body text-[9px] uppercase tracking-wider text-charcoal/20">Locked</span>
      </div>
    );
  }
  return (
    <button className={`${base} ${styles[variant]}`} onClick={onClick}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </button>
  );
}

export default function BookingDrawer({ booking, onClose, onUpdate, statusColors }) {
  const [saving, setSaving] = useState(false);
  const [adminNotes, setAdminNotes] = useState(booking.admin_notes || '');
  const [editingNotes, setEditingNotes] = useState(false);
  const [toast, setToast] = useState(null);
  const [assignProvider, setAssignProvider] = useState(booking.provider_name || '');
  const [editingProvider, setEditingProvider] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatusChange = async (newStatus) => {
    setSaving(true);
    try {
      await base44.entities.Booking.update(booking.id, { status: newStatus });
      onUpdate(booking.id, { status: newStatus });
      showToast(`Status updated to ${newStatus}`);
    } catch (e) {
      showToast('Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      await base44.entities.Booking.update(booking.id, { admin_notes: adminNotes });
      onUpdate(booking.id, { admin_notes: adminNotes });
      setEditingNotes(false);
      showToast('Notes saved');
    } catch (e) {
      showToast('Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSendSms = async () => {
    if (!booking.client_phone) { showToast('No phone number on file', 'error'); return; }
    setSaving(true);
    try {
      const dateStr = booking.scheduled_date
        ? new Date(booking.scheduled_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
        : 'TBD';
      await base44.functions.invoke('sendClientSmsConfirmation', {
        clientPhone: booking.client_phone,
        clientName: booking.client_name,
        message: `Hi ${booking.client_name?.split(' ')[0]}! ✨ This is a reminder from Clean Slate Club — your ${booking.service_label || booking.service_category?.replace(/_/g, ' ')} is confirmed for ${dateStr} at ${booking.scheduled_start_time || 'TBD'}. Questions? Text us at (215) 500-3758. Reply STOP to opt out.`,
      });
      showToast('SMS sent!');
    } catch (e) {
      showToast('SMS failed: ' + e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAssignProvider = async () => {
    if (!assignProvider.trim()) return;
    setSaving(true);
    try {
      await base44.entities.Booking.update(booking.id, { provider_name: assignProvider, status: 'provider_assigned' });
      onUpdate(booking.id, { provider_name: assignProvider, status: 'provider_assigned' });
      setEditingProvider(false);
      showToast('Provider assigned');
    } catch (e) {
      showToast('Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const ia = booking.intake_answers || {};
  const mapsUrl = booking.client_address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.client_address)}`
    : null;

  const displayDate = booking.scheduled_date
    ? new Date(booking.scheduled_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    : 'TBD';

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-[420px] shrink-0 bg-white border-l border-taupe/15 flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`absolute top-3 left-4 right-4 z-10 rounded-xl px-4 py-2.5 text-xs font-body text-white shadow-lg ${toast.type === 'error' ? 'bg-red-500' : 'bg-sage'}`}
            >
              {toast.msg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="px-4 py-4 border-b border-taupe/10 bg-cream/50">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-heading text-lg font-semibold text-charcoal">{booking.client_name}</h2>
              <p className="font-body text-xs text-charcoal/50 font-light mt-0.5">
                {booking.service_label || booking.service_category?.replace(/_/g, ' ')}
              </p>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-taupe/10 rounded-lg transition-colors text-charcoal/40">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Status badge + selector */}
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className={`inline-block px-2.5 py-1 rounded-full border text-[10px] font-body uppercase tracking-wider ${STATUS_BADGE[booking.status] || 'bg-taupe/10 border-taupe text-charcoal/40'}`}>
              {booking.status?.replace(/_/g, ' ')}
            </span>
            <select
              value={booking.status}
              onChange={e => handleStatusChange(e.target.value)}
              disabled={saving}
              className="border border-taupe/20 rounded-lg px-2 py-1 text-xs font-body text-charcoal/60 bg-white focus:outline-none focus:border-coral/40"
            >
              {STATUSES.map(s => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
            {saving && <div className="w-4 h-4 border-2 border-coral border-t-transparent rounded-full animate-spin" />}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">

          {/* Client info */}
          <Section title="Guest & Contact">
            <InfoRow icon={Phone} label="Phone" value={booking.client_phone} link={booking.client_phone ? `tel:${booking.client_phone}` : null} />
            <InfoRow icon={Mail} label="Email" value={booking.client_email} link={booking.client_email ? `mailto:${booking.client_email}` : null} />
            <InfoRow icon={MapPin} label="Address" value={booking.client_address} link={mapsUrl} />
          </Section>

          {/* Appointment details */}
          <Section title="Appointment">
            <InfoRow icon={Clock} label="Date" value={displayDate} />
            <InfoRow icon={Clock} label="Time" value={`${booking.scheduled_start_time || 'TBD'}${booking.scheduled_end_time ? ` – ${booking.scheduled_end_time}` : ''}`} />
            <InfoRow icon={Clock} label="Duration" value={booking.total_duration_minutes ? `${booking.total_duration_minutes} min` : null} />
            <InfoRow icon={User} label="Provider" value={booking.provider_name || booking.provider_email || 'Unassigned'} />
            {booking.addons?.length > 0 && (
              <InfoRow icon={CheckSquare} label="Add-ons" value={booking.addons.join(', ')} />
            )}
          </Section>

          {/* Payment */}
          <Section title="Payment">
            <InfoRow icon={DollarSign} label="Estimate" value={booking.estimated_price_low ? `$${booking.estimated_price_low} – $${booking.estimated_price_high}` : null} />
            <InfoRow icon={DollarSign} label="Deposit" value={booking.deposit_status ? booking.deposit_status.replace(/_/g, ' ') : null} />
            <InfoRow icon={DollarSign} label="Payment" value={booking.payment_status ? booking.payment_status.replace(/_/g, ' ') : null} />
            {booking.member_at_booking && (
              <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-coral/8 border border-coral/20 text-xs font-body text-coral">
                ✦ Member booking
              </div>
            )}
          </Section>

          {/* Intake notes */}
          {(ia.special_notes || booking.special_notes || ia.situation) && (
            <Section title="Intake Notes">
              <p className="font-body text-xs text-charcoal/60 font-light leading-relaxed">
                {ia.situation || booking.special_notes || ia.special_notes}
              </p>
              {ia.has_pets && (
                <div className="mt-2 flex items-center gap-1.5 text-xs font-body text-amber-700">
                  🐾 Pets: {ia.pet_details || 'Yes'}
                </div>
              )}
              {ia.has_allergies && (
                <div className="mt-1 flex items-center gap-1.5 text-xs font-body text-red-600">
                  ⚠️ Allergies: {ia.allergy_details || 'Yes'}
                </div>
              )}
            </Section>
          )}

          {/* Admin notes */}
          <Section title="Internal Admin Notes">
            {editingNotes ? (
              <div>
                <textarea
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-taupe/20 rounded-lg px-3 py-2 text-xs font-body text-charcoal/70 focus:outline-none focus:border-coral/40 resize-none"
                  placeholder="Internal notes (not visible to guest)..."
                />
                <div className="flex gap-2 mt-2">
                  <button onClick={handleSaveNotes} className="px-3 py-1.5 bg-coral text-white rounded-lg text-xs font-body hover:bg-coral/90">Save</button>
                  <button onClick={() => setEditingNotes(false)} className="px-3 py-1.5 border border-taupe/20 rounded-lg text-xs font-body text-charcoal/50 hover:bg-cream">Cancel</button>
                </div>
              </div>
            ) : (
              <div
                className="min-h-10 cursor-pointer rounded-lg px-2 py-1.5 hover:bg-cream transition-colors"
                onClick={() => setEditingNotes(true)}
              >
                <p className="font-body text-xs text-charcoal/50 font-light">
                  {booking.admin_notes || <span className="italic text-charcoal/25">Click to add internal note...</span>}
                </p>
              </div>
            )}
          </Section>

          {/* Assign Provider */}
          <Section title="Provider Assignment">
            {editingProvider ? (
              <div className="space-y-2">
                <input value={assignProvider} onChange={e => setAssignProvider(e.target.value)}
                  placeholder="Provider name..."
                  className="w-full border border-taupe/20 rounded-lg px-3 py-2 text-xs font-body focus:outline-none focus:border-coral/40" />
                <div className="flex gap-2">
                  <button onClick={handleAssignProvider} className="px-3 py-1.5 bg-coral text-white rounded-lg text-xs font-body hover:bg-coral/90">Assign</button>
                  <button onClick={() => setEditingProvider(false)} className="px-3 py-1.5 border border-taupe/20 rounded-lg text-xs font-body text-charcoal/50">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="font-body text-xs text-charcoal/60">{booking.provider_name || 'Unassigned'}</span>
                <button onClick={() => setEditingProvider(true)} className="px-2.5 py-1 rounded-lg border border-taupe/20 text-xs font-body text-charcoal/50 hover:bg-cream hover:border-coral/30 hover:text-coral transition-colors">
                  {booking.provider_name ? 'Change' : 'Assign'}
                </button>
              </div>
            )}
          </Section>

          {/* Actions */}
          <Section title="Actions">
            <div className="space-y-1.5">
              <ActionButton label="Approve Booking" icon={CheckSquare} onClick={() => handleStatusChange('approved')} variant="success" />
              <ActionButton label="Hold for Review" icon={AlertTriangle} onClick={() => handleStatusChange('needs_review')} />
              <ActionButton label="Mark Confirmed" icon={CheckSquare} onClick={() => handleStatusChange('confirmed')} />
              <ActionButton label="Mark In Progress" icon={Clock} onClick={() => handleStatusChange('in_progress')} />
              <ActionButton label="Mark Completed" icon={CheckSquare} onClick={() => handleStatusChange('completed')} variant="success" />
              <ActionButton label="Mark Cancelled" icon={X} onClick={() => handleStatusChange('cancelled')} variant="danger" />
              <ActionButton label="Mark No Show" icon={AlertTriangle} onClick={() => handleStatusChange('no_show')} variant="danger" />
              <div className="border-t border-taupe/10 pt-2 mt-2">
                <ActionButton label="Send SMS Reminder" icon={MessageSquare} onClick={handleSendSms} variant="default" />
              </div>
              <div className="border-t border-taupe/10 pt-2 mt-2">
                <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/25 mb-1.5">Requires Backend Integration</p>
                <ActionButton label="Charge Final Balance" icon={DollarSign} locked />
                <ActionButton label="Issue Refund" icon={DollarSign} locked />
              </div>
            </div>
          </Section>

          {/* Audit */}
          <Section title="Booking Info" defaultOpen={false}>
            <div className="space-y-1 text-xs font-body text-charcoal/40 font-light">
              <p>ID: <span className="font-mono text-charcoal/60">{booking.id}</span></p>
              <p>Source: {booking.booking_source?.replace(/_/g, ' ') || 'unknown'}</p>
              <p>Created: {booking.created_date ? new Date(booking.created_date).toLocaleString() : '—'}</p>
              <p>Service area: {booking.intake_answers?.service_area?.status?.replace(/_/g, ' ') || '—'}</p>
            </div>
          </Section>

          <div className="h-6" />
        </div>
      </motion.div>
    </div>
  );
}