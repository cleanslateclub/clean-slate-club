import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { X, AlertCircle } from 'lucide-react';
import { SERVICE_CONFIG, calculateTotalDuration, timeToMinutes, minutesToTime, TRAVEL_BUFFER } from '@/lib/bookingConfig';

export default function QuickBookingModal({ onClose, onSuccess, selectedDate, selectedTime, timeBlocks }) {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [serviceKey, setServiceKey] = useState('home_reset');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [sendEmail, setSendEmail] = useState(true);
  const [sendSMS, setSendSMS] = useState(true);
  const [includePayLink, setIncludePayLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cfg = SERVICE_CONFIG[serviceKey];
  const totalDuration = calculateTotalDuration(serviceKey, selectedAddons);
  const endTime = selectedTime ? minutesToTime(timeToMinutes(selectedTime) + totalDuration) : 'TBD';

  const toggleAddon = (id) => {
    setSelectedAddons(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!clientName || !clientEmail || !clientPhone || !clientAddress) {
        setError('Please fill in all client details');
        setLoading(false);
        return;
      }

      // Calculate pricing
      const addonPrice = selectedAddons.reduce((sum, id) => {
        const addon = cfg.addons.find(a => a.id === id);
        return sum + (addon ? addon.price : 0);
      }, 0);
      const estimateLow = cfg.priceRange[0] + addonPrice;
      const estimateHigh = cfg.priceRange[1] + addonPrice;

      // Create booking
      const booking = await base44.entities.Booking.create({
        status: 'confirmed',
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        client_address: clientAddress,
        service_category: serviceKey,
        scheduled_date: selectedDate,
        scheduled_start_time: selectedTime || 'TBD',
        scheduled_end_time: selectedTime ? endTime : 'TBD',
        base_duration_minutes: cfg.baseMinutes,
        total_duration_minutes: totalDuration,
        addons: selectedAddons,
        estimated_price_low: estimateLow,
        estimated_price_high: estimateHigh,
        admin_notes: 'Booked from admin calendar — skip deposit'
      });

      // Create time blocks
      if (selectedDate && selectedTime) {
        const blockEnd = minutesToTime(timeToMinutes(selectedTime) + totalDuration);
        const travelEnd = minutesToTime(timeToMinutes(blockEnd) + TRAVEL_BUFFER);
        await base44.entities.TimeBlock.bulkCreate([
          {
            date: selectedDate,
            start_time: selectedTime,
            end_time: blockEnd,
            booking_id: booking.id,
            block_type: 'booking',
            label: `${cfg.label} — ${clientName}`
          },
          {
            date: selectedDate,
            start_time: blockEnd,
            end_time: travelEnd,
            block_type: 'travel',
            label: 'Travel buffer'
          }
        ]);
      }

      // Generate payment link if requested
      let paymentLink = null;
      if (includePayLink) {
        try {
          const payRes = await base44.functions.invoke('createDepositPaymentIntent', {
            amount: estimateLow * 100,
            customerEmail: clientEmail,
            customerPhone: clientPhone,
            serviceLabel: cfg.label,
            bookingId: booking.id,
          });
          paymentLink = payRes.data?.checkoutUrl || payRes.data?.url;
        } catch (err) {
          console.error('Payment link error:', err);
        }
      }

      const addonLabels = selectedAddons.map(id => cfg.addons.find(a => a.id === id)?.label).filter(Boolean);
      const displayDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

      // Send client confirmation via backend (bypasses external email restriction)
      if (sendEmail) {
        await base44.functions.invoke('sendQuickBookingEmail', {
          clientEmail,
          clientName,
          clientAddress,
          serviceLabel: cfg.label,
          displayDate,
          selectedTime,
          endTime,
          estimateLow,
          estimateHigh,
          addonLabels,
          paymentLink,
        });
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-warm-white rounded-3xl border border-taupe/15 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-warm-white border-b border-taupe/10 px-6 py-4 flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold text-charcoal">Quick Book Appointment</h2>
          <button onClick={onClose} className="p-1 hover:bg-taupe/10 rounded-lg transition-colors">
            <X className="w-5 h-5 text-charcoal/40" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="font-body text-sm text-red-600 font-light">{error}</p>
            </div>
          )}

          {/* Client Info */}
          <div>
            <p className="font-heading text-sm font-semibold text-charcoal mb-3">Client Details</p>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Full name" required
                className="px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40" />
              <input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="Email" required
                className="px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40" />
              <input type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="Phone" required
                className="px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40" />
              <input type="text" value={clientAddress} onChange={e => setClientAddress(e.target.value)} placeholder="Address" required
                className="px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40" />
            </div>
          </div>

          {/* Service & Addons */}
          <div>
            <p className="font-heading text-sm font-semibold text-charcoal mb-3">Service</p>
            <select value={serviceKey} onChange={e => { setServiceKey(e.target.value); setSelectedAddons([]); }}
              className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal focus:outline-none focus:border-coral/40">
              {Object.entries(SERVICE_CONFIG).filter(([k]) => k !== 'consult').map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>

            {cfg.addons.length > 0 && (
              <div className="mt-3">
                <p className="font-body text-xs text-charcoal/50 font-light mb-2">Add-ons</p>
                <div className="flex flex-wrap gap-2">
                  {cfg.addons.map(addon => (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-body font-light border transition-all ${
                        selectedAddons.includes(addon.id)
                          ? 'bg-coral border-coral text-white'
                          : 'bg-cream border-taupe/20 text-charcoal/60 hover:border-coral/30'
                      }`}
                    >
                      {addon.label} (+${addon.price})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Schedule (display only) */}
          <div className="bg-cream rounded-2xl p-4">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-2">Scheduled</p>
            <p className="font-body text-sm text-charcoal font-light">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <p className="font-body text-xs text-charcoal/45 font-light">
              {selectedTime} – {endTime}
            </p>
          </div>

          {/* Notifications */}
          <div>
            <p className="font-heading text-sm font-semibold text-charcoal mb-3">Send Notifications</p>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-cream rounded-lg transition-colors">
                <input type="checkbox" checked={sendEmail} onChange={e => setSendEmail(e.target.checked)} className="w-4 h-4" />
                <span className="font-body text-sm text-charcoal/70 font-light">Email confirmation to client</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-cream rounded-lg transition-colors">
                <input type="checkbox" checked={sendSMS} onChange={e => setSendSMS(e.target.checked)} className="w-4 h-4" disabled />
                <span className="font-body text-sm text-charcoal/50 font-light">SMS to client (coming soon)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-2 hover:bg-cream rounded-lg transition-colors">
                <input type="checkbox" checked={includePayLink} onChange={e => setIncludePayLink(e.target.checked)} className="w-4 h-4" />
                <span className="font-body text-sm text-charcoal/70 font-light">Include payment link in email</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-taupe/10">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-2xl border border-taupe/20 text-charcoal/50 font-body text-sm font-light hover:border-coral/30 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-2xl bg-coral text-white font-body text-sm tracking-wide disabled:opacity-50 hover:bg-coral/90 transition-all">
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}