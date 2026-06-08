import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import { SERVICE_CONFIG, minutesToTime, timeToMinutes, BUFFER_PREP, BUFFER_WRAP } from '@/lib/bookingConfig';

function extractPhone(str) {
  if (!str) return null;
  const match = str.match(/\(?\d{3}\)?[\s\-\.]?\d{3}[\s\-\.]?\d{4}/);
  return match ? match[0].replace(/\D/g, '') : null;
}

function AckCard({ ack, checked, onToggle }) {
  return (
    <div className="rounded-2xl border border-taupe/15 overflow-hidden">
      <div className="p-4" style={{ borderLeft: `3px solid ${ack.color}`, background: '#fdfcfb' }}>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: ack.color }} />
          <p className="font-heading text-sm font-semibold text-charcoal">{ack.title}</p>
        </div>
        <p className="font-body text-xs text-charcoal/55 font-light leading-relaxed">{ack.body}</p>
      </div>
      <div
        className="flex items-center gap-3 px-4 py-3 bg-warm-white border-t border-taupe/10 cursor-pointer hover:bg-cream transition-colors"
        onClick={onToggle}
      >
        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
          checked ? 'bg-coral border-coral' : 'border-taupe/40 hover:border-coral/40'
        }`}>
          {checked && <span className="text-white text-xs font-bold">✓</span>}
        </div>
        <span className="font-body text-xs text-charcoal/60 font-light select-none">I understand and agree</span>
      </div>
    </div>
  );
}

export default function Step5Confirm({
  serviceKey, clientInfo, intakeAnswers, selectedAddons,
  selectedDate, selectedTime, totalDuration, uploadedPhotos = [],
  dynamicEstimate, onExtraTimeChange, smsOptIn, onAllAcknowledged
}) {
  const [extraTimeAuth, setExtraTimeAuth] = useState(intakeAnswers._extra_time_auth || '');
  const [checks, setChecks] = useState({});

  const config = SERVICE_CONFIG[serviceKey];
  if (!config) return null;
  const isConsult = serviceKey === 'consult';
  const intake = intakeAnswers || {};

  const toggleCheck = (id) => setChecks(prev => ({ ...prev, [id]: !prev[id] }));

  // Build required acknowledgements
  const requiredAcks = [];

  if (isConsult) {
    requiredAcks.push({
      id: 'consult_free',
      color: '#B58A90',
      title: 'Free Consultation Agreement',
      body: 'I understand this is a free 15-minute phone call with no commitment required. Clean Slate Club will call me at the scheduled time to discuss my needs and provide a custom quote. There is no cost for this consultation.'
    });
  } else {
    requiredAcks.push({
      id: 'deposits',
      color: '#EB9486',
      title: 'Deposit & Cancellation Policy',
      body: 'A $50 deposit is required to reserve my appointment. Cancellations within 24 hours of service are non-refundable. Rescheduling with 48+ hours notice applies the deposit to the next booking. Cancellations with more than 48 hours notice receive a refund within 24-48 hours per my bank schedule.'
    });
    requiredAcks.push({
      id: 'time_scope',
      color: '#CAE7B9',
      title: 'Service Time & Scope',
      body: 'My booking includes a set amount of time. If all tasks cannot be completed within the booked time, I may either book an additional visit or approve extra time at $65/hr (members) or $85/hr (non-members) if the provider is available. Tasks outside my booked service category may not be completed unless approved in advance.'
    });
    requiredAcks.push({
      id: 'supplies',
      color: '#F3DE8A',
      title: 'Supplies & Materials',
      body: 'I am responsible for having all necessary supplies ready before my appointment. If supplies are missing and the provider must source them, that time counts toward my booked service. Clean Slate Club does not advance personal funds for client purchases.'
    });
    requiredAcks.push({
      id: 'payment',
      color: '#EFB988',
      title: 'Payment Authorization',
      body: 'A valid card must be kept on file for all appointments. It may be charged for my remaining service balance, approved additional time, late cancellation fees, applicable mileage, and any unpaid add-ons.'
    });
    requiredAcks.push({
      id: 'nonmedical',
      color: '#B58A90',
      title: 'Non-Medical Support',
      body: 'I understand Clean Slate Club provides non-medical household, family, senior, errand, and lifestyle support only. Clean Slate Club does not provide medical care, medication administration, bathing, lifting/transfers, wound care, or skilled nursing services.'
    });
    requiredAcks.push({
      id: 'access_safety',
      color: '#7E7F9A',
      title: 'Access & Safety',
      body: 'For my initial visit, someone will be home to grant access and provide a walkthrough. If the provider cannot access the home at the scheduled start time, service time begins regardless. Clean Slate Club may refuse or stop service if conditions are unsafe, outside the agreed scope, or require licensed care.'
    });

    // Service-specific acknowledgements
    if (intake.transportation_needed && intake.transportation_needed !== 'No') {
      requiredAcks.push({
        id: 'transportation',
        color: '#EB9486',
        title: 'Transportation Waiver',
        body: 'Transportation services require a verified destination address. A car seat or booster seat must be installed if transporting minors. The provider may decline service in unsafe driving conditions.'
      });
    }
    if (intake.num_children && intake.num_children !== 'None' && intake.num_children !== '0') {
      requiredAcks.push({
        id: 'child_safety',
        color: '#EFB988',
        title: 'Child Safety Acknowledgement',
        body: 'Emergency contact, allergies, pickup/drop-off details, and behavioral needs must be provided before the visit. The provider is not a licensed childcare worker or medical professional.'
      });
    }
    if (serviceKey === 'senior_support') {
      requiredAcks.push({
        id: 'senior_nonmedical',
        color: '#B58A90',
        title: 'Senior Non-Medical Acknowledgement',
        body: 'Clean Slate Club provides companion-style, non-medical senior support only. This does not include medication administration, bathing, toileting, transfers, wound care, or skilled nursing of any kind.'
      });
    }
    if (intake.has_pets && intake.has_pets !== 'No') {
      requiredAcks.push({
        id: 'pets',
        color: '#CAE7B9',
        title: 'Pet Disclosure & Safety',
        body: 'All pets in the home must be disclosed. Anxious, aggressive, or escape-prone pets must be secured during the visit. The provider may stop service if a pet creates an unsafe situation.'
      });
    }
    if (intake.parent_present === 'No - full solo support needed') {
      requiredAcks.push({
        id: 'property_access',
        color: '#7E7F9A',
        title: 'Property Access Authorization',
        body: 'I authorize Clean Slate Club to access my property without me present to complete the booked service.'
      });
    }
    if (selectedAddons.some(id => config.addons.find(a => a.id === id)?.requiresFunds)) {
      requiredAcks.push({
        id: 'purchasing',
        color: '#EB9486',
        title: 'Purchasing & Funds Acknowledgement',
        body: 'This service includes shopping or purchases on my behalf. I will provide a prepaid order, Zelle transfer, or cash before any purchases are made. Clean Slate Club does not advance personal funds.'
      });
    }
  }

  // SMS consent - both consult and non-consult
  if (smsOptIn) {
    requiredAcks.push({
      id: 'sms',
      color: '#CAE7B9',
      title: 'Text Message Consent',
      body: 'By providing my phone number, I agree to receive text messages from Clean Slate Club for appointment confirmations, reminders, schedule changes, and customer care. Message frequency varies. Msg & data rates may apply. Reply STOP to unsubscribe at any time. Consent is not required as a condition of purchase.'
    });
  }

  const allChecked = requiredAcks.length === 0 || requiredAcks.every(a => checks[a.id]);

  useEffect(() => {
    onAllAcknowledged?.(allChecked);
  }, [allChecked]); // eslint-disable-line react-hooks/exhaustive-deps

  // Emergency contact display (mothers_helper + senior_support)
  const showEmergency = (serviceKey === 'mothers_helper' || serviceKey === 'senior_support') && intake.emergency_contact;
  const emergencyPhone = showEmergency ? extractPhone(intake.emergency_contact) : null;

  // ── CONSULT VIEW ──────────────────────────────────────────────────────────
  if (isConsult) {
    const consultDisplayDate = selectedDate
      ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
      : null;

    return (
      <div>
        <h2 className="font-heading text-2xl font-semibold text-charcoal mb-2">Review & confirm</h2>
        <p className="font-body text-sm text-charcoal font-light mb-8">Your free 15-minute consult has been automatically scheduled on the next available Monday slot.</p>
        <div className="space-y-4">
          {consultDisplayDate && (
            <div className="bg-coral/5 border border-coral/20 rounded-2xl p-5">
              <p className="font-body text-[10px] uppercase tracking-widest text-coral/60 font-light mb-2">Your Scheduled Consult</p>
              <p className="font-heading text-lg font-semibold text-charcoal">{consultDisplayDate}</p>
              <p className="font-body text-sm text-charcoal/60 font-light">{selectedTime} · 15-minute call</p>
              <p className="font-body text-xs text-charcoal/40 font-light mt-1">We'll call you at {clientInfo.phone} at the time above.</p>
            </div>
          )}
          <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal font-light mb-2">Your Info</p>
            <p className="font-body text-sm text-charcoal font-light">{clientInfo.name}</p>
            <p className="font-body text-sm text-charcoal font-light">{clientInfo.email} · {clientInfo.phone}</p>
          </div>
          {intake.situation && (
            <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal font-light mb-2">Your Situation</p>
              <p className="font-body text-sm text-charcoal font-light leading-relaxed">{intake.situation}</p>
            </div>
          )}
          {(intake.preferred_contact || intake.availability_notes) && (
            <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal font-light mb-2">How to Reach You</p>
              {intake.preferred_contact && <p className="font-body text-sm text-charcoal font-light">Preferred: {intake.preferred_contact}</p>}
              {intake.availability_notes && <p className="font-body text-sm text-charcoal font-light">Availability: {intake.availability_notes}</p>}
            </div>
          )}
          {uploadedPhotos.length > 0 && (
            <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal font-light mb-2">Photos / Files Attached</p>
              <p className="font-body text-sm text-charcoal font-light">{uploadedPhotos.length} file{uploadedPhotos.length > 1 ? 's' : ''} attached - we'll review before the call.</p>
            </div>
          )}
          <div className="bg-sage/10 border border-sage/20 rounded-2xl p-5">
            <p className="font-body text-sm text-charcoal font-light leading-relaxed">
              <strong className="font-normal text-charcoal/90">100% free. Zero commitment.</strong> This is just a conversation - we'll listen, figure out what you need, and give you a custom quote. No pressure, ever.
            </p>
          </div>
          {requiredAcks.length > 0 && (
            <div className="space-y-3">
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light">Please Acknowledge</p>
              {requiredAcks.map(ack => (
                <AckCard key={ack.id} ack={ack} checked={!!checks[ack.id]} onToggle={() => toggleCheck(ack.id)} />
              ))}
              {!allChecked && (
                <p className="font-body text-xs text-coral/70 font-light text-center">Please confirm all acknowledgements above to proceed.</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── NON-CONSULT VIEW ─────────────────────────────────────────────────────
  const endTime = minutesToTime(timeToMinutes(selectedTime) + totalDuration);
  const meetTime = selectedTime;
  const serviceStart = minutesToTime(timeToMinutes(selectedTime) + BUFFER_PREP);
  const wrapStart = minutesToTime(timeToMinutes(selectedTime) + BUFFER_PREP + (totalDuration - BUFFER_PREP - BUFFER_WRAP));
  const addonItems = selectedAddons.map(id => config.addons.find(a => a.id === id)).filter(Boolean);
  const addonPrice = addonItems.reduce((s, a) => s + a.price, 0);
  const totalLow = dynamicEstimate ? dynamicEstimate.low : config.priceRange[0] + addonPrice;
  const totalHigh = dynamicEstimate ? dynamicEstimate.high : config.priceRange[1] + addonPrice;
  const selectedTasks = intakeAnswers._tasks || [];
  const estimateFlags = dynamicEstimate ? dynamicEstimate.flags : [];
  const displayDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold text-charcoal mb-2">Review & confirm</h2>
      <p className="font-body text-sm text-charcoal font-light mb-8">Review your booking details and confirm each acknowledgement below to proceed.</p>

      <div className="space-y-4">

        {/* Service */}
        <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal font-light mb-2">Service</p>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: config.color }} />
            <span className="font-heading text-base font-semibold text-charcoal">{config.label}</span>
          </div>
          {addonItems.length > 0 && (
            <div className="mt-2 space-y-1">
              {addonItems.map(a => (
                <p key={a.id} className="font-body text-xs text-charcoal font-light flex items-center gap-1.5">
                  <span className="text-coral">+</span> {a.label}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Schedule */}
        <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal font-light mb-2">Schedule</p>
          <p className="font-heading text-base font-semibold text-charcoal mb-3">{displayDate}</p>
          <div className="space-y-2">
            <div className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-sage shrink-0" /><span className="font-body text-xs text-charcoal font-light">{meetTime} - Meet & greet (15 min)</span></div>
            <div className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-coral shrink-0" /><span className="font-body text-xs text-charcoal font-light">{serviceStart} - Service begins</span></div>
            <div className="flex items-center gap-3"><span className="w-2 h-2 rounded-full" style={{ background: '#EFB988' }} /><span className="font-body text-xs text-charcoal font-light">{wrapStart} - Wrap-up & supply collection (15 min)</span></div>
            <div className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-taupe shrink-0" /><span className="font-body text-xs text-charcoal font-light">{endTime} - Estimated end</span></div>
          </div>
          <p className="font-body text-[11px] text-charcoal font-light mt-2">Total: {(totalDuration / 60).toFixed(1)} hours</p>
        </div>

        {/* Client info */}
        <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal font-light mb-2">Your Info</p>
          <p className="font-body text-sm text-charcoal font-light">{clientInfo.name}</p>
          <p className="font-body text-sm text-charcoal font-light">{clientInfo.email} · {clientInfo.phone}</p>
          <p className="font-body text-sm text-charcoal font-light">{clientInfo.address}</p>
        </div>

        {/* Emergency contact - prominent tap-to-call card */}
        {showEmergency && (
          <div className="rounded-2xl border-2 border-coral/25 overflow-hidden" style={{ background: '#fff8f7' }}>
            <div className="px-5 pt-4 pb-2">
              <p className="font-body text-[10px] uppercase tracking-widest text-coral/60 font-light mb-1">Emergency Contact</p>
              <p className="font-body text-sm text-charcoal font-light">{intake.emergency_contact}</p>
              <p className="font-body text-[11px] text-charcoal/40 font-light mt-1">Accessible to your provider during the visit.</p>
            </div>
            {emergencyPhone && (
              <a
                href={`tel:${emergencyPhone}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-coral text-white font-body text-sm tracking-wide hover:bg-coral/90 transition-all"
              >
                <Phone className="w-4 h-4" />
                Tap to Call Emergency Contact
              </a>
            )}
          </div>
        )}

        {/* Tasks */}
        {selectedTasks.length > 0 && (
          <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-3">Tasks Requested</p>
            <div className="flex flex-wrap gap-2">
              {selectedTasks.map(task => (
                <span key={task} className="px-3 py-1 rounded-full text-xs font-body font-light text-white" style={{ background: config.color }}>{task}</span>
              ))}
            </div>
          </div>
        )}

        {/* Additional time authorization */}
        <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-2">Additional Time Authorization</p>
          <p className="font-body text-xs text-charcoal/60 font-light mb-3 leading-relaxed">If more time is needed to complete your requested tasks, may we extend the appointment?</p>
          <div className="flex flex-col gap-2">
            {['Yes, up to 1 additional hour', 'Yes, up to 2 additional hours', 'Yes, up to 4 additional hours', 'Contact me first', 'No, remain within original booking'].map(opt => (
              <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => { setExtraTimeAuth(opt); onExtraTimeChange && onExtraTimeChange(opt); }}
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    extraTimeAuth === opt ? 'bg-coral border-coral' : 'border-taupe/40 group-hover:border-coral/40'
                  }`}
                >
                  {extraTimeAuth === opt && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className="font-body text-sm text-charcoal/70 font-light">{opt}</span>
              </label>
            ))}
          </div>
          {extraTimeAuth && extraTimeAuth !== 'No, remain within original booking' && (
            <p className="mt-3 font-body text-xs text-charcoal/40 font-light">
              Additional time billed at <span className="text-coral">$65/hr (members)</span> or <span className="text-coral">$85/hr (non-members)</span>. We will always notify you before extending.
            </p>
          )}
        </div>

        {/* Pricing */}
        <div className="bg-coral/5 border border-coral/15 rounded-2xl p-5">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-1">Estimated Total</p>
          <p className="font-heading text-2xl font-semibold text-coral">${totalLow}-${totalHigh}</p>
          {estimateFlags.length > 0 && (
            <div className="mt-2 space-y-1">
              {estimateFlags.map((flag, i) => (
                <p key={i} className="font-body text-[11px] text-charcoal font-light flex items-start gap-1.5">
                  <span className="text-coral shrink-0">+</span>{flag}
                </p>
              ))}
            </div>
          )}
          <p className="font-body text-xs text-charcoal font-light mt-2">Final pricing confirmed before any work begins. No surprises.</p>
        </div>

        {/* Required Acknowledgements */}
        {requiredAcks.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light">Required Acknowledgements</p>
              <span className="font-body text-[10px] font-light" style={{ color: allChecked ? '#CAE7B9' : '#EB9486' }}>
                {requiredAcks.filter(a => checks[a.id]).length}/{requiredAcks.length} confirmed
              </span>
            </div>
            {requiredAcks.map(ack => (
              <AckCard key={ack.id} ack={ack} checked={!!checks[ack.id]} onToggle={() => toggleCheck(ack.id)} />
            ))}
            {!allChecked && (
              <p className="font-body text-xs text-coral/70 font-light text-center pt-1">
                Please confirm all acknowledgements above to enable the booking button.
              </p>
            )}
            {allChecked && (
              <div className="flex items-center justify-center gap-2 py-2">
                <span className="w-5 h-5 rounded-full bg-sage/40 flex items-center justify-center text-xs text-charcoal/70">✓</span>
                <p className="font-body text-xs text-charcoal/50 font-light">All acknowledgements confirmed. You're ready to proceed.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
