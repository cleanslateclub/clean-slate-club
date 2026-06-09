import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import {
  X, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft,
  MessageSquare, Calendar, Clock, MapPin, User, Phone, Mail, Zap
} from 'lucide-react';
import {
  SERVICE_CONFIG,
  calculateTotalDuration,
  timeToMinutes,
  minutesToTime,
  TRAVEL_BUFFER
} from '@/lib/bookingConfig';

// ─── Constants ────────────────────────────────────────────────────────────────

const DEPOSIT_AMOUNT = 50; // flat deposit for all bookings

const TIME_SLOTS = (() => {
  const slots = [];
  for (let h = 8; h <= 20; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (h === 20 && m > 0) break;
      const period  = h < 12 ? 'AM' : 'PM';
      const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
      slots.push(`${display}:${m.toString().padStart(2, '0')} ${period}`);
    }
  }
  return slots;
})();

const CHECKLIST = [
  { id: 'access_confirmed',    label: 'Access method confirmed (key, code, or client home)', required: true  },
  { id: 'price_informed',      label: 'Client is aware of the estimated price range',        required: true  },
  { id: 'cancellation_policy', label: 'Client acknowledged 24-hour cancellation policy',     required: true  },
  { id: 'terms_accepted',      label: 'Client verbally accepted Clean Slate Club terms',     required: true  },
  { id: 'pets_in_home',        label: 'Pets in home? (check if yes)',                        required: false },
  { id: 'allergies',           label: 'Allergies or sensitivities? (check if yes)',          required: false },
  { id: 'parking_confirmed',   label: 'Parking situation confirmed',                         required: false },
  { id: 'special_captured',    label: 'Special instructions captured in notes',              required: false },
  { id: 'identity_confirmed',  label: 'Client identity confirmed (known in person)',         required: false },
];

const SERVICE_TERMS = [
  '24-hour cancellation policy — the $50 deposit is non-refundable within 24 hours of the appointment.',
  'Payment is due at the time of service. The $50 deposit will be applied toward the total.',
  'We are not responsible for pre-existing damage or normal wear and tear.',
  'Please ensure safe, accessible conditions for our team on arrival.',
  'Satisfaction guarantee — report any concerns within 24 hours of service completion.',
  'We use professional-grade, eco-friendly products. Inform us of any sensitivities.',
  'Clean Slate Club reserves the right to decline service in unsafe or hazardous conditions.',
];

const STEPS = ['Client', 'Service', 'Checklist', 'Deposit', 'Confirm'];

const inp = 'w-full px-4 py-3 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40';

// ─── Component ────────────────────────────────────────────────────────────────

export default function QuickBookingModal({
  onClose,
  onSuccess,
  onBookingCreated,
  selectedDate,
  selectedTime,
  initialDate,
  initialTime,
  timeBlocks = [],
}) {
  const resolvedDate = initialDate || selectedDate || '';
  const resolvedTime = initialTime || selectedTime || '';

  const [step,    setStep]    = useState(1);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  // Step 1 — Client
  const [clientName,  setClientName]  = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  // Step 2 — Service & Schedule
  const [serviceKey,     setServiceKey]     = useState('home_reset');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [date,           setDate]           = useState(resolvedDate);
  const [time,           setTime]           = useState(resolvedTime);
  const [clientAddress,  setClientAddress]  = useState('');
  const [numBedrooms,    setNumBedrooms]    = useState('');
  const [numBathrooms,   setNumBathrooms]   = useState('');
  const [specialNotes,   setSpecialNotes]   = useState('');

  // Step 3 — Checklist
  const [checks,        setChecks]        = useState(
    Object.fromEntries(CHECKLIST.map(i => [i.id, false]))
  );
  const [accessMethod,  setAccessMethod]  = useState('');
  const [accessCode,    setAccessCode]    = useState('');
  const [petDetails,    setPetDetails]    = useState('');
  const [allergyDetail, setAllergyDetail] = useState('');
  const [termsExpanded, setTermsExpanded] = useState(false);
  const [termsSent,     setTermsSent]     = useState(false);
  const [sendingTerms,  setSendingTerms]  = useState(false);

  // Step 4 — Deposit
  const [requireDeposit, setRequireDeposit] = useState(true);
  const [depositSent,    setDepositSent]    = useState(false);
  const [depositUrl,     setDepositUrl]     = useState(null);
  const [sendingDep,     setSendingDep]     = useState(false);

  // Derived
  const cfg           = SERVICE_CONFIG[serviceKey] || {};
  const totalDuration = calculateTotalDuration
    ? calculateTotalDuration(serviceKey, selectedAddons)
    : (cfg.baseMinutes || 120);
  const endTime = time
    ? minutesToTime(timeToMinutes(time) + totalDuration)
    : 'TBD';
  const addonPrice   = selectedAddons.reduce((sum, id) =>
    sum + (cfg.addons?.find(a => a.id === id)?.price || 0), 0);
  const estimateLow  = (cfg.priceRange?.[0] || 0) + addonPrice;
  const estimateHigh = (cfg.priceRange?.[1] || 0) + addonPrice;
  const displayDate  = date
    ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric'
      })
    : 'TBD';

  const requiredDone = CHECKLIST.filter(i => i.required).every(i => checks[i.id]);

  const canNext = (s) => {
    if (s === 1) return clientName.trim() && clientPhone.trim();
    if (s === 2) return serviceKey && date && time && clientAddress.trim();
    if (s === 3) return requiredDone;
    return true;
  };

  const toggleCheck = (id) => setChecks(p => ({ ...p, [id]: !p[id] }));
  const toggleAddon = (id) => setSelectedAddons(p =>
    p.includes(id) ? p.filter(x => x !== id) : [...p, id]
  );

  const sendTermsLink = async () => {
    setSendingTerms(true);
    try {
      await base44.functions.invoke('sendClientSmsConfirmation', {
        clientPhone,
        clientName,
        message: `Hi ${clientName.split(' ')[0]}! Please review Clean Slate Club's service terms before your appointment: https://cleanslateclub.co/terms ✨`,
      });
      setTermsSent(true);
    } catch {
      // silent — provider can still proceed verbally
    } finally {
      setSendingTerms(false);
    }
  };

  const sendDepositLink = async () => {
    setSendingDep(true);
    setError(null);
    try {
      const res = await base44.functions.invoke('createDepositPaymentIntent', {
        amount:        DEPOSIT_AMOUNT * 100,
        customerEmail: clientEmail || undefined,
        customerPhone: clientPhone,
        serviceLabel:  cfg.label,
        bookingId:     'manual-' + Date.now(),
      });
      const url = res.data?.checkoutUrl || res.data?.url;
      setDepositUrl(url);
      if (clientPhone && url) {
        await base44.functions.invoke('sendClientSmsConfirmation', {
          clientPhone,
          clientName,
          message: `Hi ${clientName.split(' ')[0]}! Your $${DEPOSIT_AMOUNT} deposit link for your Clean Slate Club appointment on ${displayDate}: ${url} 🧹`,
        }).catch(() => {});
      }
      setDepositSent(true);
    } catch {
      setError('Could not generate deposit link — you can proceed and collect later.');
    } finally {
      setSendingDep(false);
    }
  };

  const handleBook = async () => {
    setLoading(true);
    setError(null);
    try {
      const addonLabels = selectedAddons
        .map(id => cfg.addons?.find(a => a.id === id)?.label)
        .filter(Boolean);

      const booking = await base44.entities.Booking.create({
        status:                 'confirmed',
        client_name:            clientName,
        client_email:           clientEmail || '',
        client_phone:           clientPhone,
        client_address:         clientAddress,
        service_category:       serviceKey,
        scheduled_date:         date,
        scheduled_start_time:   time,
        scheduled_end_time:     endTime,
        base_duration_minutes:  cfg.baseMinutes || 120,
        total_duration_minutes: totalDuration,
        addons:                 selectedAddons,
        estimated_price_low:    estimateLow,
        estimated_price_high:   estimateHigh,
        payment_intent_id:      depositUrl ? 'manual-deposit-sent' : undefined,
        intake_answers: {
          access_method:              accessMethod,
          access_code:                accessCode,
          num_bedrooms:               numBedrooms,
          num_bathrooms:              numBathrooms,
          has_pets:                   checks.pets_in_home,
          pet_details:                petDetails,
          has_allergies:              checks.allergies,
          allergy_details:            allergyDetail,
          special_notes:              specialNotes,
          verbal_checklist_completed: true,
          terms_link_sent:            termsSent,
          checklist_items:            { ...checks },
        },
        admin_notes: [
          'Manually booked by provider on-site.',
          requireDeposit && depositSent
            ? `$${DEPOSIT_AMOUNT} deposit link sent to ${clientPhone}.`
            : 'No deposit collected at time of booking.',
          termsSent ? 'Terms link sent to client via SMS.' : 'Terms acknowledged verbally.',
          depositUrl ? `Deposit URL: ${depositUrl}` : '',
        ].filter(Boolean).join(' '),
      });

      // Time blocks
      if (date && time) {
        const blockEnd  = minutesToTime(timeToMinutes(time) + totalDuration);
        const travelEnd = minutesToTime(timeToMinutes(blockEnd) + (TRAVEL_BUFFER || 30));
        await base44.entities.TimeBlock.bulkCreate([
          { date, start_time: time,     end_time: blockEnd,  booking_id: booking.id, block_type: 'booking', label: `${cfg.label} — ${clientName}` },
          { date, start_time: blockEnd, end_time: travelEnd, block_type: 'travel',   label: 'Travel buffer' },
        ]);
      }

      // Confirmation SMS
      await base44.functions.invoke('sendClientSmsConfirmation', {
        clientPhone, clientName, clientAddress,
        serviceLabel: cfg.label, displayDate,
        scheduledStartTime: time, scheduledEndTime: endTime,
        bookingId: booking.id, addonLabels,
      }).catch(() => {});

      // Confirmation email
      if (clientEmail) {
        await base44.functions.invoke('sendQuickBookingEmail', {
          clientEmail, clientName, clientAddress,
          serviceLabel: cfg.label, displayDate,
          selectedTime: time, endTime,
          estimateLow, estimateHigh, addonLabels,
          paymentLink: depositUrl || null,
        }).catch(() => {});
      }

      setStep(6);
    } catch (err) {
      setError(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Sub-component ────────────────────────────────────────────────────────

  const CheckRow = ({ id, label, required: req }) => (
    <button type="button" onClick={() => toggleCheck(id)}
      className="flex items-start gap-3 w-full text-left bg-cream rounded-xl p-3 hover:bg-taupe/10 transition-colors">
      <div className={`w-5 h-5 rounded-md border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${
        checks[id]
          ? (req ? 'bg-coral border-coral' : 'bg-taupe border-taupe')
          : 'border-taupe/40'
      }`}>
        {checks[id] && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
      </div>
      <span className="font-body text-sm text-charcoal font-light">
        {label}{req && <span className="text-coral ml-1">*</span>}
      </span>
    </button>
  );

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-warm-white rounded-3xl border border-taupe/15 shadow-2xl w-full max-w-lg max-h-[92vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="bg-warm-white border-b border-taupe/10 px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-heading text-lg font-semibold text-charcoal">Quick Book Appointment</h2>
            {step < 6 && (
              <p className="font-body text-xs text-charcoal/40 font-light mt-0.5">
                Step {step} of 5 — {STEPS[step - 1]}
              </p>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-taupe/10 rounded-xl transition-colors">
            <X className="w-5 h-5 text-charcoal/40" />
          </button>
        </div>

        {/* Progress bar */}
        {step < 6 && (
          <div className="flex gap-1 px-6 pt-4 shrink-0">
            {STEPS.map((_, i) => (
              <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${
                i + 1 < step ? 'bg-coral' : i + 1 === step ? 'bg-coral/50' : 'bg-taupe/20'
              }`} />
            ))}
          </div>
        )}

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

          {error && (
            <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-xl">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="font-body text-sm text-red-600 font-light">{error}</p>
            </div>
          )}

          {/* ── Step 1: Client ── */}
          {step === 1 && (
            <div className="space-y-3">
              <div className="text-center pb-2">
                <p className="font-heading text-base font-semibold text-charcoal">Who are you booking?</p>
                <p className="font-body text-xs text-charcoal/40 font-light mt-1">
                  Name + phone required. Email sends them a confirmation too.
                </p>
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
                <input type="text" value={clientName} onChange={e => setClientName(e.target.value)}
                  placeholder="Full name *" autoFocus className={`${inp} pl-10`} />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
                <input type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)}
                  placeholder="Phone number * — SMS confirmation sent here" className={`${inp} pl-10`} />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
                <input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)}
                  placeholder="Email (optional)" className={`${inp} pl-10`} />
              </div>
              {clientName && clientPhone && (
                <div className="bg-coral/5 border border-coral/20 rounded-xl p-3 text-center">
                  <p className="font-body text-sm text-charcoal font-light">Booking for <strong>{clientName}</strong></p>
                  <p className="font-body text-xs text-charcoal/50 font-light">{clientPhone}</p>
                </div>
              )}
            </div>
          )}

          {/* ── Step 2: Service & Schedule ── */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center pb-1">
                <p className="font-heading text-base font-semibold text-charcoal">Service & Schedule</p>
              </div>

              <div>
                <label className="font-body text-xs text-charcoal/50 font-light block mb-1.5">Service Type *</label>
                <select value={serviceKey}
                  onChange={e => { setServiceKey(e.target.value); setSelectedAddons([]); }}
                  className={inp}>
                  {Object.entries(SERVICE_CONFIG).filter(([k]) => k !== 'consult').map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>

              {cfg.addons?.length > 0 && (
                <div>
                  <label className="font-body text-xs text-charcoal/50 font-light block mb-2">Add-ons</label>
                  <div className="flex flex-wrap gap-2">
                    {cfg.addons.map(addon => (
                      <button key={addon.id} type="button" onClick={() => toggleAddon(addon.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-body font-light border transition-all ${
                          selectedAddons.includes(addon.id)
                            ? 'bg-coral border-coral text-white'
                            : 'bg-cream border-taupe/20 text-charcoal/60 hover:border-coral/30'
                        }`}>
                        {addon.label} (+${addon.price})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="font-body text-xs text-charcoal/50 font-light block mb-1.5">
                  <Calendar className="inline w-3.5 h-3.5 mr-1 mb-0.5" />Date *
                </label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]} className={inp} />
              </div>

              <div>
                <label className="font-body text-xs text-charcoal/50 font-light block mb-1.5">
                  <Clock className="inline w-3.5 h-3.5 mr-1 mb-0.5" />Start Time *
                </label>
                <select value={time} onChange={e => setTime(e.target.value)} className={inp}>
                  <option value="">Select a time...</option>
                  {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="font-body text-xs text-charcoal/50 font-light block mb-1.5">
                  <MapPin className="inline w-3.5 h-3.5 mr-1 mb-0.5" />Service Address *
                </label>
                <input type="text" value={clientAddress} onChange={e => setClientAddress(e.target.value)}
                  placeholder="Full address where cleaning will take place" className={inp} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-body text-xs text-charcoal/50 font-light block mb-1.5">Bedrooms</label>
                  <select value={numBedrooms} onChange={e => setNumBedrooms(e.target.value)} className={inp}>
                    <option value="">—</option>
                    {['Studio','1','2','3','4','5+'].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-body text-xs text-charcoal/50 font-light block mb-1.5">Bathrooms</label>
                  <select value={numBathrooms} onChange={e => setNumBathrooms(e.target.value)} className={inp}>
                    <option value="">—</option>
                    {['1','1.5','2','2.5','3','3.5','4+'].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-body text-xs text-charcoal/50 font-light block mb-1.5">Special Notes</label>
                <textarea value={specialNotes} onChange={e => setSpecialNotes(e.target.value)}
                  placeholder="Anything the team should know..." rows={2}
                  className={`${inp} resize-none`} />
              </div>

              {date && time && (
                <div className="bg-coral/5 border border-coral/15 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="font-body text-xs text-charcoal/40 font-light">Scheduled</p>
                    <p className="font-body text-sm text-charcoal font-light">{displayDate}</p>
                    <p className="font-body text-xs text-charcoal/50 font-light">{time} – {endTime}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-body text-xs text-charcoal/40 font-light">Estimate</p>
                    <p className="font-body text-base text-coral font-semibold">${estimateLow}–${estimateHigh}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Step 3: Checklist ── */}
          {step === 3 && (
            <div className="space-y-3">
              <div className="text-center pb-1">
                <p className="font-heading text-base font-semibold text-charcoal">Provider Checklist</p>
                <p className="font-body text-xs text-charcoal/40 font-light mt-1">
                  Confirm starred items verbally with the client before continuing.
                </p>
              </div>

              {/* Access — required + sub-fields */}
              <div className="bg-cream rounded-xl p-3 space-y-2">
                <button type="button" onClick={() => toggleCheck('access_confirmed')}
                  className="flex items-start gap-3 w-full text-left">
                  <div className={`w-5 h-5 rounded-md border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                    checks.access_confirmed ? 'bg-coral border-coral' : 'border-taupe/40'
                  }`}>
                    {checks.access_confirmed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className="font-body text-sm text-charcoal font-light">
                    Access method confirmed <span className="text-coral">*</span>
                  </span>
                </button>
                {checks.access_confirmed && (
                  <div className="ml-8 space-y-2">
                    <select value={accessMethod} onChange={e => setAccessMethod(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-taupe/20 bg-white font-body text-sm text-charcoal focus:outline-none focus:border-coral/40">
                      <option value="">Select access type...</option>
                      <option value="client_home">Client will be home</option>
                      <option value="lockbox">Lockbox / spare key</option>
                      <option value="door_code">Door code</option>
                      <option value="garage">Garage code</option>
                      <option value="building_front">Building / front desk</option>
                      <option value="other">Other</option>
                    </select>
                    {['door_code','garage','lockbox','other'].includes(accessMethod) && (
                      <input type="text" value={accessCode} onChange={e => setAccessCode(e.target.value)}
                        placeholder="Code or location details..."
                        className="w-full px-3 py-2 rounded-lg border border-taupe/20 bg-white font-body text-sm text-charcoal focus:outline-none focus:border-coral/40" />
                    )}
                  </div>
                )}
              </div>

              {/* Required items — terms gets special expansion */}
              {CHECKLIST.filter(i => i.required && i.id !== 'access_confirmed').map(item => (
                <div key={item.id} className="space-y-2">
                  <CheckRow {...item} />

                  {/* Terms expansion — verbal script + SMS option */}
                  {item.id === 'terms_accepted' && (
                    <div className="ml-8 space-y-2">
                      <button type="button" onClick={() => setTermsExpanded(p => !p)}
                        className="font-body text-xs text-coral hover:underline font-light">
                        {termsExpanded ? '↑ Hide terms' : '↓ View key terms to read aloud'}
                      </button>

                      {termsExpanded && (
                        <div className="bg-white border border-taupe/15 rounded-xl p-3 space-y-2">
                          <p className="font-body text-[10px] text-charcoal/35 font-light uppercase tracking-widest mb-1">
                            Read to client:
                          </p>
                          {SERVICE_TERMS.map((term, i) => (
                            <p key={i} className="font-body text-xs text-charcoal/65 font-light flex gap-2 leading-snug">
                              <span className="text-coral shrink-0 mt-0.5">•</span>
                              <span>{term}</span>
                            </p>
                          ))}
                        </div>
                      )}

                      {!termsSent ? (
                        <button type="button" onClick={sendTermsLink}
                          disabled={!clientPhone || sendingTerms}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-coral/30 bg-coral/5 text-coral font-body text-xs font-light hover:bg-coral/10 transition-colors disabled:opacity-40">
                          <MessageSquare className="w-3 h-3" />
                          {sendingTerms ? 'Sending...' : 'Or text terms link to client instead'}
                        </button>
                      ) : (
                        <p className="font-body text-xs text-sage font-light flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Terms link sent to {clientPhone}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}

              <p className="font-body text-[10px] text-charcoal/25 font-light text-center tracking-widest uppercase">— Optional —</p>

              {/* Pets */}
              <div className="bg-cream rounded-xl p-3 space-y-2">
                <CheckRow id="pets_in_home" label="Pets in home? (check if yes)" required={false} />
                {checks.pets_in_home && (
                  <input type="text" value={petDetails} onChange={e => setPetDetails(e.target.value)}
                    placeholder="Type, number, where they'll be secured..."
                    className="ml-8 w-[calc(100%-2rem)] px-3 py-2 rounded-lg border border-taupe/20 bg-white font-body text-sm text-charcoal focus:outline-none focus:border-coral/40" />
                )}
              </div>

              {/* Allergies */}
              <div className="bg-cream rounded-xl p-3 space-y-2">
                <CheckRow id="allergies" label="Allergies or product sensitivities? (check if yes)" required={false} />
                {checks.allergies && (
                  <input type="text" value={allergyDetail} onChange={e => setAllergyDetail(e.target.value)}
                    placeholder="Describe restrictions or sensitivities..."
                    className="ml-8 w-[calc(100%-2rem)] px-3 py-2 rounded-lg border border-taupe/20 bg-white font-body text-sm text-charcoal focus:outline-none focus:border-coral/40" />
                )}
              </div>

              {/* Remaining optional */}
              {CHECKLIST.filter(i =>
                !i.required && i.id !== 'pets_in_home' && i.id !== 'allergies'
              ).map(item => (
                <CheckRow key={item.id} {...item} />
              ))}

              {!requiredDone && (
                <p className="font-body text-xs text-red-400/80 font-light text-center pt-1">
                  Please confirm all required items (marked *) to continue.
                </p>
              )}
            </div>
          )}

          {/* ── Step 4: Deposit ── */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center pb-1">
                <p className="font-heading text-base font-semibold text-charcoal">Deposit</p>
                <p className="font-body text-xs text-charcoal/40 font-light mt-1">
                  Collect $50 now or skip and collect later.
                </p>
              </div>

              {/* Toggle */}
              <div className="bg-cream rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-charcoal font-light">Require $50 deposit</p>
                  <p className="font-body text-xs text-charcoal/40 font-light">Recommended for new clients</p>
                </div>
                <button type="button"
                  onClick={() => { setRequireDeposit(p => !p); setDepositSent(false); setDepositUrl(null); }}
                  className={`w-12 h-6 rounded-full transition-all relative ${requireDeposit ? 'bg-coral' : 'bg-taupe/30'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${requireDeposit ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              {requireDeposit && !depositSent && (
                <>
                  <div className="bg-coral/5 border border-coral/15 rounded-2xl p-4">
                    <p className="font-body text-xs text-charcoal/50 font-light mb-1">Deposit amount</p>
                    <p className="font-heading text-3xl font-semibold text-coral">${DEPOSIT_AMOUNT}</p>
                    <p className="font-body text-xs text-charcoal/40 font-light mt-1">
                      Flat deposit — applied toward {cfg.label} total (${estimateLow}–${estimateHigh})
                    </p>
                  </div>
                  <button type="button" onClick={sendDepositLink} disabled={sendingDep}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-coral text-white font-body text-sm font-semibold shadow-lg hover:bg-coral/85 active:scale-[0.98] transition-all disabled:opacity-50">
                    {sendingDep
                      ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : <MessageSquare className="w-4 h-4" />}
                    {sendingDep ? 'Sending...' : `Text $${DEPOSIT_AMOUNT} payment link to ${clientPhone}`}
                  </button>
                </>
              )}

              {requireDeposit && depositSent && (
                <div className="bg-sage/10 border border-sage/30 rounded-2xl p-4 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-sage mx-auto" />
                  <p className="font-body text-sm text-charcoal font-light">
                    $50 payment link sent to {clientPhone}
                  </p>
                  {depositUrl && (
                    <a href={depositUrl} target="_blank" rel="noreferrer"
                      className="font-body text-xs text-coral hover:underline font-light">
                      View payment link →
                    </a>
                  )}
                </div>
              )}

              {!requireDeposit && (
                <div className="bg-butter/20 border border-butter/40 rounded-xl p-4 text-center">
                  <p className="font-body text-sm text-charcoal/60 font-light">
                    No deposit — booking will be confirmed immediately.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Step 5: Review ── */}
          {step === 5 && (
            <div className="space-y-3">
              <div className="text-center pb-1">
                <p className="font-heading text-base font-semibold text-charcoal">Review & Confirm</p>
                <p className="font-body text-xs text-charcoal/40 font-light mt-1">Everything look right?</p>
              </div>

              <div className="bg-cream rounded-2xl p-4 space-y-2.5">
                {[
                  ['Client',    clientName],
                  ['Phone',     clientPhone],
                  clientEmail   && ['Email',    clientEmail],
                  ['Service',   cfg.label],
                  ['Date',      displayDate],
                  ['Time',      `${time} – ${endTime}`],
                  ['Address',   clientAddress],
                  numBedrooms   && ['Beds',     numBedrooms],
                  numBathrooms  && ['Baths',    numBathrooms],
                  selectedAddons.length > 0 && [
                    'Add-ons',
                    selectedAddons.map(id => cfg.addons?.find(a => a.id === id)?.label).filter(Boolean).join(', ')
                  ],
                  ['Estimate',  `$${estimateLow}–${estimateHigh}`],
                  ['Deposit',   requireDeposit ? (depositSent ? `Sent — $${DEPOSIT_AMOUNT}` : 'Not sent yet') : 'Skipped'],
                  ['Terms',     termsSent ? 'Link sent via SMS' : 'Acknowledged verbally'],
                  accessMethod  && ['Access',   accessMethod.replace(/_/g, ' ')],
                  accessCode    && ['Code',     accessCode],
                  checks.pets_in_home  && ['Pets',      petDetails    || 'Yes'],
                  checks.allergies     && ['Allergies', allergyDetail || 'Yes'],
                  specialNotes         && ['Notes',     specialNotes],
                ].filter(Boolean).map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-3">
                    <span className="font-body text-xs text-charcoal/40 font-light shrink-0 w-16">{label}</span>
                    <span className="font-body text-xs text-charcoal font-light text-right flex-1">{value}</span>
                  </div>
                ))}
              </div>

              <div className="bg-sage/10 border border-sage/20 rounded-xl p-3 text-center">
                <p className="font-body text-xs text-charcoal/60 font-light">
                  ✓ Confirmation SMS will be sent to {clientPhone}{clientEmail ? ` + email to ${clientEmail}` : ''} immediately.
                </p>
              </div>
            </div>
          )}

          {/* ── Step 6: Success ── */}
          {step === 6 && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9 text-sage" />
              </div>
              <div>
                <p className="font-heading text-xl font-semibold text-charcoal">Booking Confirmed! 🎉</p>
                <p className="font-body text-sm text-charcoal/50 font-light mt-2">
                  {clientName}'s appointment is set for {displayDate} at {time}.
                </p>
              </div>
              <div className="bg-cream rounded-2xl p-4 space-y-1.5 text-left">
                <p className="font-body text-xs text-charcoal/50 font-light">✓ Added to calendar & database</p>
                <p className="font-body text-xs text-charcoal/50 font-light">✓ Confirmation SMS sent to {clientPhone}</p>
                {clientEmail && <p className="font-body text-xs text-charcoal/50 font-light">✓ Confirmation email sent to {clientEmail}</p>}
                {depositSent && <p className="font-body text-xs text-charcoal/50 font-light">✓ ${DEPOSIT_AMOUNT} deposit link sent</p>}
                {termsSent   && <p className="font-body text-xs text-charcoal/50 font-light">✓ Terms link sent to client</p>}
              </div>
            </div>
          )}

        </div>{/* end scroll body */}

        {/* Footer nav */}
        <div className="shrink-0 border-t border-taupe/10 px-6 py-4 flex gap-3">

          {step > 1 && step < 6 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border border-taupe/20 text-charcoal/50 font-body text-sm font-light hover:border-coral/30 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}

          {step === 1 && (
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-2xl border border-taupe/20 text-charcoal/50 font-body text-sm font-light hover:border-coral/30 transition-colors">
              Cancel
            </button>
          )}

          {step >= 1 && step <= 3 && (
            <button onClick={() => { setError(null); setStep(s => s + 1); }}
              disabled={!canNext(step)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-coral text-white font-body text-sm font-semibold disabled:opacity-40 hover:bg-coral/85 active:scale-[0.98] transition-all">
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {step === 4 && (
            <button onClick={() => setStep(5)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-coral text-white font-body text-sm font-semibold hover:bg-coral/85 active:scale-[0.98] transition-all">
              {requireDeposit && !depositSent ? 'Continue Without Deposit' : 'Continue'} <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {step === 5 && (
            <button onClick={handleBook} disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-coral text-white font-body text-base font-bold shadow-2xl ring-2 ring-coral/30 hover:bg-coral/85 active:scale-[0.98] transition-all disabled:opacity-50">
              {loading
                ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Zap className="w-5 h-5" />}
              {loading ? 'Booking...' : '⚡ Book & Notify Client'}
            </button>
          )}

          {step === 6 && (
            <button onClick={() => { (onSuccess || onBookingCreated)?.(); onClose(); }}
              className="flex-1 py-3 rounded-2xl bg-coral text-white font-body text-sm font-semibold hover:bg-coral/85 transition-all">
              Done ✓
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
