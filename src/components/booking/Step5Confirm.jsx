import React, { useState } from 'react';
import { SERVICE_CONFIG, minutesToTime, timeToMinutes, BUFFER_PREP, BUFFER_WRAP } from '@/lib/bookingConfig';

export default function Step5Confirm({ serviceKey, clientInfo, intakeAnswers, selectedAddons, selectedDate, selectedTime, totalDuration, uploadedPhotos = [], dynamicEstimate, onExtraTimeChange }) {
  const [extraTimeAuth, setExtraTimeAuth] = useState(intakeAnswers._extra_time_auth || '');
  const config = SERVICE_CONFIG[serviceKey];
  if (!config) return null;

  const isConsult = serviceKey === 'consult';

  if (isConsult) {
    return (
      <div>
        <h2 className="font-heading text-2xl font-semibold text-charcoal mb-2">Review & send</h2>
        <p className="font-body text-sm text-charcoal font-light mb-8">We'll reach out within 24 hours to set up your free 15-minute consult call.</p>
        <div className="space-y-4">
          <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal font-light mb-2">Your Info</p>
            <p className="font-body text-sm text-charcoal font-light">{clientInfo.name}</p>
            <p className="font-body text-sm text-charcoal font-light">{clientInfo.email} · {clientInfo.phone}</p>
          </div>
          {intakeAnswers.situation && (
            <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal font-light mb-2">Your Situation</p>
              <p className="font-body text-sm text-charcoal font-light leading-relaxed">{intakeAnswers.situation}</p>
            </div>
          )}
          {(intakeAnswers.preferred_contact || intakeAnswers.availability_notes) && (
            <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal font-light mb-2">How to Reach You</p>
              {intakeAnswers.preferred_contact && <p className="font-body text-sm text-charcoal font-light">Preferred: {intakeAnswers.preferred_contact}</p>}
              {intakeAnswers.availability_notes && <p className="font-body text-sm text-charcoal font-light">Availability: {intakeAnswers.availability_notes}</p>}
            </div>
          )}
          {uploadedPhotos.length > 0 && (
            <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal font-light mb-2">Photos / Files Attached</p>
              <p className="font-body text-sm text-charcoal font-light">{uploadedPhotos.length} file{uploadedPhotos.length > 1 ? 's' : ''} attached — we'll review before the call.</p>
            </div>
          )}
          <div className="bg-sage/10 border border-sage/20 rounded-2xl p-5">
            <p className="font-body text-sm text-charcoal font-light leading-relaxed">
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
  const totalLow = dynamicEstimate ? dynamicEstimate.low : config.priceRange[0] + addonPrice;
  const totalHigh = dynamicEstimate ? dynamicEstimate.high : config.priceRange[1] + addonPrice;
  const selectedTasks = intakeAnswers._tasks || [];
  const estimateFlags = dynamicEstimate ? dynamicEstimate.flags : [];

  const displayDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });

  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold text-charcoal mb-2">Review & confirm</h2>
      <p className="font-body text-sm text-charcoal font-light mb-8">Double-check everything looks right. You'll receive a confirmation email right away.</p>

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
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-sage shrink-0" />
              <span className="font-body text-xs text-charcoal font-light">{meetTime} — Meet & greet (15 min)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-coral shrink-0" />
              <span className="font-body text-xs text-charcoal font-light">{serviceStart} — Service begins</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-peach shrink-0" />
              <span className="font-body text-xs text-charcoal font-light">{wrapStart} — Wrap-up & supply collection (15 min)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-taupe shrink-0" />
              <span className="font-body text-xs text-charcoal font-light">{endTime} — Estimated end</span>
            </div>
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

        {/* Tasks selected */}
        {selectedTasks.length > 0 && (
          <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-3">Tasks Requested</p>
            <div className="flex flex-wrap gap-2">
              {selectedTasks.map(task => (
                <span key={task} className="px-3 py-1 rounded-full text-xs font-body font-light text-white" style={{ background: config.color }}>
                  {task}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Additional time authorization */}
        <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-2">Additional Time Authorization</p>
          <p className="font-body text-xs text-charcoal/60 font-light mb-3 leading-relaxed">
            If more time is needed to complete your requested tasks, may we extend the appointment?
          </p>
          <div className="flex flex-col gap-2">
            {[
              'Yes, up to 1 additional hour',
              'Yes, up to 2 additional hours',
              'Yes, up to 4 additional hours',
              'Contact me first',
              'No, remain within original booking'
            ].map(opt => (
              <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => { setExtraTimeAuth(opt); onExtraTimeChange && onExtraTimeChange(opt); }}
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${extraTimeAuth === opt ? 'bg-coral border-coral' : 'border-taupe/40 group-hover:border-coral/40'}`}
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
          <p className="font-heading text-2xl font-semibold text-coral">${totalLow}–${totalHigh}</p>
          {estimateFlags.length > 0 && (
            <div className="mt-2 space-y-1">
              {estimateFlags.map((flag, i) => (
                <p key={i} className="font-body text-[11px] text-charcoal font-light flex items-start gap-1.5">
                  <span className="text-coral shrink-0">↑</span>{flag}
                </p>
              ))}
            </div>
          )}
          <p className="font-body text-xs text-charcoal font-light mt-2">Final pricing confirmed before any work begins. No surprises.</p>
        </div>
      </div>
    </div>
  );
}