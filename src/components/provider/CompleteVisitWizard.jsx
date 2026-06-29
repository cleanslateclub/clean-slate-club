import React, { useMemo, useState } from 'react';
import { X, AlertTriangle, CheckCircle2, DollarSign, FileText } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const money = (value) => `$${toNumber(value).toFixed(2)}`;

export default function CompleteVisitWizard({ booking, providerData = null, onComplete, onClose }) {
  const depositPaid = toNumber(booking?.deposit_amount, 50);
  const estimatedLow = toNumber(booking?.estimated_price_low, 0);
  const estimatedHigh = toNumber(booking?.estimated_price_high, estimatedLow);
  const startingFinalPrice = toNumber(booking?.final_price, estimatedHigh || estimatedLow || depositPaid);

  const [finalPrice, setFinalPrice] = useState(String(startingFinalPrice || ''));
  const [providerNotes, setProviderNotes] = useState(booking?.provider_notes || '');
  const [incidentOccurred, setIncidentOccurred] = useState(Boolean(booking?.incident_occurred));
  const [incidentNotes, setIncidentNotes] = useState(booking?.incident_notes || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const finalPriceNumber = toNumber(finalPrice, 0);
  const balanceDue = useMemo(() => Math.max(0, finalPriceNumber - depositPaid), [finalPriceNumber, depositPaid]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!booking?.id) {
      setError('Missing booking record. Close this window and reopen the visit.');
      return;
    }

    if (!finalPriceNumber || finalPriceNumber < 0) {
      setError('Enter a valid final price before completing the visit.');
      return;
    }

    if (incidentOccurred && !incidentNotes.trim()) {
      setError('Please add a short incident note before completing the visit.');
      return;
    }

    setSaving(true);
    try {
      const completedAt = new Date().toISOString();
      const updates = {
        status: 'completed',
        completed_at: completedAt,
        completed_by_provider_id: providerData?.id || booking.provider_id || '',
        completed_by_provider_email: providerData?.email || booking.provider_email || '',
        completed_by_provider_name: providerData?.full_name || booking.provider_name || '',
        final_price: finalPriceNumber,
        final_balance_due: balanceDue,
        provider_notes: providerNotes.trim(),
        incident_occurred: incidentOccurred,
        incident_notes: incidentOccurred ? incidentNotes.trim() : '',
        payment_status: balanceDue > 0 ? 'partially_paid' : 'paid',
        checkout_status: balanceDue > 0 ? 'ready_for_admin_checkout' : 'not_required',
        admin_notes: [
          booking.admin_notes || '',
          `VISIT_COMPLETED: Provider marked visit completed at ${completedAt}. Final price ${money(finalPriceNumber)}. Deposit credit ${money(depositPaid)}. Final balance due ${money(balanceDue)}. Payment collection still requires admin checkout action.`,
        ].filter(Boolean).join('\n\n'),
      };

      await base44.entities.Booking.update(booking.id, updates);

      base44.functions.invoke('notifyScheduleChange', {
        data: {
          eventType: 'visit_completed',
          source: 'provider_complete_visit',
          actor: providerData?.full_name || providerData?.email || 'Provider',
          booking: { ...booking, ...updates },
          updates,
          note: 'Provider completed the visit. Admin should review final balance and send checkout if needed.',
        }
      }).catch(err => console.error('Completion notification failed:', err));

      onComplete?.();
    } catch (err) {
      console.error('Complete visit failed:', err);
      setError(err?.message || 'Could not complete this visit.');
    } finally {
      setSaving(false);
    }
  };

  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 px-4 py-8">
      <form onSubmit={handleSubmit} className="w-full max-w-xl bg-white rounded-3xl border border-taupe/20 shadow-2xl overflow-hidden">
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-taupe/10 bg-cream/70">
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Complete Visit</p>
            <h2 className="font-heading text-2xl text-charcoal mt-1">{booking.client_name || 'Guest Visit'}</h2>
            <p className="font-body text-sm text-charcoal/45 font-light mt-1">
              {booking.service_label || booking.service_category || 'Clean Slate Club Visit'} · {booking.scheduled_date || 'Date TBD'}
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-taupe/10 text-charcoal/40 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {error && (
            <div className="flex gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 font-body">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl bg-cream border border-taupe/10 p-4">
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Original Quote</p>
              <p className="font-heading text-xl text-charcoal mt-2">{money(estimatedLow)}–{money(estimatedHigh)}</p>
            </div>
            <div className="rounded-2xl bg-cream border border-taupe/10 p-4">
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Deposit Credit</p>
              <p className="font-heading text-xl text-charcoal mt-2">-{money(depositPaid)}</p>
            </div>
            <div className="rounded-2xl bg-coral/5 border border-coral/15 p-4">
              <p className="font-body text-[10px] uppercase tracking-widest text-coral/60">Balance Due</p>
              <p className="font-heading text-xl text-charcoal mt-2">{money(balanceDue)}</p>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 font-body text-xs text-charcoal/50 font-light mb-2">
              <DollarSign className="w-3.5 h-3.5" />
              Final service price
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={finalPrice}
              onChange={event => setFinalPrice(event.target.value)}
              className="w-full rounded-2xl border border-taupe/20 bg-cream px-4 py-3 font-body text-sm text-charcoal focus:outline-none focus:border-coral/50"
              placeholder="Enter final price"
              required
            />
            <p className="font-body text-xs text-charcoal/35 font-light mt-2">
              This records the final price only. It does not charge the guest automatically.
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2 font-body text-xs text-charcoal/50 font-light mb-2">
              <FileText className="w-3.5 h-3.5" />
              Provider visit notes
            </label>
            <textarea
              value={providerNotes}
              onChange={event => setProviderNotes(event.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-taupe/20 bg-cream px-4 py-3 font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/50 resize-none"
              placeholder="What was completed, what still needs attention, and anything admin should know before checkout."
            />
          </div>

          <div className="rounded-2xl border border-taupe/15 bg-cream/50 p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={incidentOccurred}
                onChange={event => setIncidentOccurred(event.target.checked)}
                className="mt-1"
              />
              <span>
                <span className="block font-body text-sm text-charcoal font-light">Incident or concern occurred</span>
                <span className="block font-body text-xs text-charcoal/40 font-light mt-1">Use this for access issues, damage concerns, unsafe conditions, guest conflict, pet concerns, or anything admin must review.</span>
              </span>
            </label>
            {incidentOccurred && (
              <textarea
                value={incidentNotes}
                onChange={event => setIncidentNotes(event.target.value)}
                rows={3}
                className="mt-3 w-full rounded-2xl border border-coral/25 bg-white px-4 py-3 font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/50 resize-none"
                placeholder="Describe what happened."
              />
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-taupe/10 bg-cream/40">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full border border-taupe/20 text-charcoal/50 font-body text-sm hover:border-charcoal/30 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-coral text-white font-body text-sm tracking-wide hover:bg-coral/90 disabled:opacity-50 transition-colors">
            <CheckCircle2 className="w-4 h-4" />
            {saving ? 'Saving...' : 'Complete Visit'}
          </button>
        </div>
      </form>
    </div>
  );
}
