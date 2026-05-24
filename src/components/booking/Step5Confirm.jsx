import React from 'react';
import { SERVICE_CONFIG, minutesToTime, timeToMinutes, BUFFER_PREP, BUFFER_WRAP } from '@/lib/bookingConfig';

export default function Step5Confirm({ serviceKey, clientInfo, intakeAnswers, selectedAddons, selectedDate, selectedTime, totalDuration, uploadedPhotos = [] }) {
  const config = SERVICE_CONFIG[serviceKey];
  if (!config) return null;

  const isConsult = serviceKey === 'consult';

  if (isConsult) {
    return (
      <div>
        <h2 className="font-heading text-2xl font-semibold text-charcoal mb-2">Review & send</h2>
        <p className="font-body text-sm text-charcoal/45 font-light mb-8">We'll reach out within 24 hours to set up your free 15-minute consult call.</p>
        <div className="space-y-4">
          <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-2">Your Info</p>
            <p className="font-body text-sm text-charcoal font-light">{clientInfo.name}</p>
            <p className="font-body text-sm text-charcoal/55 font-light">{clientInfo.email} · {clientInfo.phone}</p>
          </div>
          {intakeAnswers.situation && (
            <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-2">Your Situation</p>
              <p className="font-body text-sm text-charcoal/65 font-light leading-relaxed">{intakeAnswers.situation}</p>
            </div>
          )}
          {(intakeAnswers.preferred_contact || intakeAnswers.availability_notes) && (
            <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-2">How to Reach You</p>
              {intakeAnswers.preferred_contact && <p className="font-body text-sm text-charcoal/55 font-light">Preferred: {intakeAnswers.preferred_contact}</p>}
              {intakeAnswers.availability_notes && <p className="font-body text-sm text-charcoal/55 font-light">Availability: {intakeAnswers.availability_notes}</p>}
            </div>
          )}
          {uploadedPhotos.length > 0 && (
            <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-2">Photos / Files Attached</p>
              <p className="font-body text-sm text-charcoal/55 font-light">{uploadedPhotos.length} file{uploadedPhotos.length > 1 ? 's' : ''} attached — we'll review before the call.</p>
            </div>
          )}
          <div className="bg-sage/10 border border-sage/20 rounded-2xl p-5">
            <p className="font-body text-sm text-charcoal/70 font-light leading-relaxed">
              <strong className="font-normal text-charcoal/90">100% free. Zero commitment.</strong> This is just a conversation — we'll listen, figure out what you need, and give you a custom quote. No pressure, ever.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const endTime = minutesToTime(timeToMinutes(selectedTime) + totalDuration);
  const meetTime = selectedTime;
  const serviceStart = minutesToTime(timeToMinutes(selectedTime) + BUFFER_PREP);
  const wrapStart = minutesToTime(timeToMinutes(selectedTime) + BUFFER_PREP + (totalDuration - BUFFER_PREP - BUFFER_WRAP));

  const addonItems = selectedAddons.map(id => config.addons.find(a => a.id === id)).filter(Boolean);
  const addonPrice = addonItems.reduce((s, a) => s + a.price, 0);
  const totalLow = config.priceRange[0] + addonPrice;
  const totalHigh = config.priceRange[1] + addonPrice;

  const displayDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });

  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold text-charcoal mb-2">Review & confirm</h2>
      <p className="font-body text-sm text-charcoal/45 font-light mb-8">Double-check everything looks right. You'll receive a confirmation email right away.</p>

      <div className="space-y-4">
        {/* Service */}
        <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-2">Service</p>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: config.color }} />
            <span className="font-heading text-base font-semibold text-charcoal">{config.label}</span>
          </div>
          {addonItems.length > 0 && (
            <div className="mt-2 space-y-1">
              {addonItems.map(a => (
                <p key={a.id} className="font-body text-xs text-charcoal/45 font-light flex items-center gap-1.5">
                  <span className="text-coral">+</span> {a.label}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Schedule */}
        <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-2">Schedule</p>
          <p className="font-heading text-base font-semibold text-charcoal mb-3">{displayDate}</p>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-sage shrink-0" />
              <span className="font-body text-xs text-charcoal/55 font-light">{meetTime} — Meet & greet (15 min)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-coral shrink-0" />
              <span className="font-body text-xs text-charcoal/55 font-light">{serviceStart} — Service begins</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-peach shrink-0" />
              <span className="font-body text-xs text-charcoal/55 font-light">{wrapStart} — Wrap-up & supply collection (15 min)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-taupe shrink-0" />
              <span className="font-body text-xs text-charcoal/55 font-light">{endTime} — Estimated end</span>
            </div>
          </div>
          <p className="font-body text-[11px] text-charcoal/30 font-light mt-2">Total: {(totalDuration / 60).toFixed(1)} hours</p>
        </div>

        {/* Client info */}
        <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-2">Your Info</p>
          <p className="font-body text-sm text-charcoal font-light">{clientInfo.name}</p>
          <p className="font-body text-sm text-charcoal/55 font-light">{clientInfo.email} · {clientInfo.phone}</p>
          <p className="font-body text-sm text-charcoal/55 font-light">{clientInfo.address}</p>
        </div>

        {/* Pricing */}
        <div className="bg-coral/5 border border-coral/15 rounded-2xl p-5">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-1">Estimated Total</p>
          <p className="font-heading text-2xl font-semibold text-coral">${totalLow}–${totalHigh}</p>
          <p className="font-body text-xs text-charcoal/35 font-light mt-1">Final pricing confirmed before any work begins. No surprises.</p>
        </div>
      </div>
    </div>
  );
}