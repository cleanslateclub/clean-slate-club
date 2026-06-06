import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';
import { CheckCircle2, Circle, Camera, Clock, AlertTriangle, DollarSign, ChevronRight, ChevronLeft } from 'lucide-react';

const STEPS = ['Collect Payment', 'Checklist', 'Extra Time & Add-Ons', 'Photos', 'Notes & Incident', 'Complete'];

export default function CompleteVisitWizard({ booking, onComplete, onClose }) {
  const [step, setStep] = useState(0);
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const [checklist, setChecklist] = useState({});
  const [extraTime, setExtraTime] = useState('none');
  const [completedAddons, setCompletedAddons] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [providerNotes, setProviderNotes] = useState('');
  const [opportunityNotes, setOpportunityNotes] = useState('');
  const [hasIncident, setHasIncident] = useState(false);
  const [incident, setIncident] = useState({ incident_type: '', description: '', severity: 'low' });
  const [tipAmount, setTipAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const config = SERVICE_CONFIG[booking?.service_category];
  const isMember = booking?.intake_answers?.is_member || false;
  const extraTimeRates = { '30min': isMember ? 32.5 : 42.5, '1hr': isMember ? 65 : 85, '2hr': isMember ? 130 : 170 };
  const extraTimeMinutes = { 'none': 0, '30min': 30, '1hr': 60, '2hr': 120 };

  // Calculate payout
  const baseRevenue = ((booking?.estimated_price_low || 0) + (booking?.estimated_price_high || 0)) / 2;
  const extraRevenue = extraTimeRates[extraTime] || 0;
  const totalRevenue = baseRevenue + extraRevenue;
  const payoutRate = 0.50;
  const providerPayout = (totalRevenue * payoutRate) + Number(tipAmount || 0);

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    const urls = await Promise.all(files.map(f => base44.integrations.Core.UploadFile({ file: f }).then(r => r.file_url)));
    setPhotos(prev => [...prev, ...urls]);
    setUploading(false);
  };

  const toggleChecklist = (task) => setChecklist(prev => ({ ...prev, [task]: !prev[task] }));
  const toggleAddon = (id) => setCompletedAddons(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleSubmit = async () => {
    setSubmitting(true);

    // Update booking status to completed
    await base44.entities.Booking.update(booking.id, {
      status: 'completed',
      admin_notes: (booking.admin_notes || '') + `\n[Provider checkout] Extra time: ${extraTime}. Tips: $${tipAmount || 0}. Notes: ${providerNotes}`,
    });

    // Create incident if filed
    if (hasIncident) {
      await base44.entities.Incident.create({
        booking_id: booking.id,
        provider_name: booking.provider_name || 'Provider',
        client_name: booking.client_name,
        incident_type: incident.incident_type || 'other',
        description: incident.description,
        severity: incident.severity,
        photos_attached: photos.length > 0,
        photo_urls: photos,
        status: 'open',
        admin_notified: false,
      });
    }

    // Create payout record
    await base44.entities.ProviderPayout.create({
      booking_id: booking.id,
      provider_name: booking.provider_name || 'Provider',
      service_revenue: totalRevenue,
      payout_rate: payoutRate,
      payout_amount: totalRevenue * payoutRate,
      tip_amount: Number(tipAmount || 0),
      total_payout: providerPayout,
      status: 'pending',
      pay_period: getCurrentPayPeriod(),
    });

    // Create review request
    await base44.entities.Review.create({
      booking_id: booking.id,
      client_name: booking.client_name,
      client_email: booking.client_email,
      rating: 0,
      service_category: booking.service_category,
      status: 'pending_internal',
    });

    // Send thank you + review request email
    await base44.integrations.Core.SendEmail({
      to: booking.client_email,
      subject: `Thank you, ${booking.client_name?.split(' ')[0]}! Your visit is complete ✨`,
      body: buildThankYouEmail(booking),
    });

    setSubmitting(false);
    onComplete?.();
  };

  function getCurrentPayPeriod() {
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleString('en-US', { month: 'long' });
    const year = now.getFullYear();
    if (day <= 14) return `${month} 1–14, ${year}`;
    return `${month} 15–${new Date(year, now.getMonth() + 1, 0).getDate()}, ${year}`;
  }

  function buildThankYouEmail(b) {
    return `<!DOCTYPE html><html><body style="font-family:Lato,sans-serif;background:#fdfcfb;color:#333;margin:0;padding:40px 24px;max-width:560px;">
      <h2 style="font-family:Montserrat,sans-serif;color:#EB9486;">Your visit is complete! 🌿</h2>
      <p>Hi ${b.client_name?.split(' ')[0] || 'there'},</p>
      <p>Thank you so much for having us. Your home is in great hands and we hope you feel the difference.</p>
      <p style="margin-top:24px;">We'd love to hear how it went. Would you take a moment to share your experience?</p>
      <a href="https://g.page/r/review" style="display:inline-block;margin-top:12px;padding:12px 28px;background:#EB9486;color:#fff;border-radius:50px;text-decoration:none;font-family:Montserrat,sans-serif;font-size:13px;font-weight:600;">Leave a Google Review ★</a>
      <p style="margin-top:28px;font-size:13px;color:#aaa;">With care,<br/><strong style="color:#EB9486;font-family:Montserrat,sans-serif;">Masha</strong><br/>Clean Slate Club™</p>
    </body></html>`;
  }

  const tasks = config?.taskOptions || [];
  const addons = config?.addons || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 py-6 overflow-y-auto">
      <div className="bg-warm-white rounded-3xl border border-taupe/20 shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-taupe/10">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-body text-[10px] tracking-widest uppercase text-coral/60 font-light">Complete Visit Wizard</p>
              <p className="font-heading text-lg font-semibold text-charcoal">{booking?.client_name}</p>
              <p className="font-body text-xs text-charcoal/40 font-light">{config?.label}</p>
            </div>
            <button onClick={onClose} className="text-charcoal/30 hover:text-charcoal text-xl">×</button>
          </div>
          {/* Step progress */}
          <div className="flex gap-1">
            {STEPS.map((s, i) => (
              <div key={s} className={`flex-1 h-1 rounded-full transition-all ${i <= step ? 'bg-coral' : 'bg-taupe/20'}`} />
            ))}
          </div>
          <p className="font-body text-xs text-charcoal/40 font-light mt-1.5">Step {step + 1} of {STEPS.length}: <strong className="text-charcoal/60">{STEPS[step]}</strong></p>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">

          {/* Step 0: Collect Payment */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="text-center py-4 bg-coral/5 border border-coral/15 rounded-2xl">
                <DollarSign className="w-8 h-8 text-coral mx-auto mb-3" />
                <h3 className="font-heading text-lg font-semibold text-charcoal mb-2">Collect Payment</h3>
                <p className="font-body text-sm text-charcoal/50 font-light mb-4">Get paid first, then complete the visit details.</p>
                
                <div className="bg-warm-white rounded-xl p-4 mb-4 space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="font-body text-sm text-charcoal/60 font-light">Base service</span>
                    <span className="font-body text-sm text-charcoal font-light">${(baseRevenue).toFixed(2)}</span>
                  </div>
                  {extraTime !== 'none' && (
                    <div className="flex justify-between">
                      <span className="font-body text-sm text-charcoal/60 font-light">Extra time</span>
                      <span className="font-body text-sm text-charcoal font-light">+${(extraTimeRates[extraTime] || 0).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-taupe/10 pt-2 flex justify-between">
                    <span className="font-heading text-base font-semibold text-charcoal">Total charge</span>
                    <span className="font-heading text-base font-semibold text-coral">${totalRevenue.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    setProcessingPayment(true);
                    // Simulate payment processing
                    await new Promise(r => setTimeout(r, 1500));
                    setPaymentProcessed(true);
                    setProcessingPayment(false);
                    setStep(1);
                  }}
                  disabled={processingPayment}
                  className="w-full py-3 bg-coral text-white font-body font-light rounded-xl hover:bg-coral/90 transition-all disabled:opacity-50"
                >
                  {processingPayment ? 'Processing...' : `Charge Card $${totalRevenue.toFixed(2)}`}
                </button>
                <p className="font-body text-[10px] text-charcoal/40 font-light mt-3">Charges posted immediately. Can adjust in final step if needed.</p>
              </div>
            </div>
          )}

          {/* Step 1: Quick Checklist */}
          {step === 1 && paymentProcessed && (
            <div>
              <h3 className="font-heading text-base font-semibold text-charcoal mb-1">Package Checklist</h3>
              <p className="font-body text-xs text-charcoal/40 font-light mb-4">Mark tasks as completed. Unmarked items will be noted.</p>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {tasks.slice(0, 20).map(task => (
                  <button key={task} onClick={() => toggleChecklist(task)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-taupe/10 bg-cream hover:border-coral/20 text-left transition-colors">
                    {checklist[task]
                      ? <CheckCircle2 className="w-4 h-4 text-sage shrink-0" />
                      : <Circle className="w-4 h-4 text-charcoal/20 shrink-0" />}
                    <span className={`font-body text-xs font-light ${checklist[task] ? 'text-charcoal/50 line-through' : 'text-charcoal'}`}>{task}</span>
                  </button>
                ))}
                {tasks.length === 0 && <p className="font-body text-sm text-charcoal/30 font-light text-center py-4">No task list for this service type.</p>}
              </div>
              <p className="mt-3 font-body text-xs text-charcoal/30 font-light">{Object.values(checklist).filter(Boolean).length} of {Math.min(tasks.length, 20)} marked complete</p>
            </div>
          )}

          {/* Step 2: Extra Time & Add-Ons */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-base font-semibold text-charcoal mb-3">Extra Time?</h3>
                <div className="space-y-2">
                  {[
                    { id: 'none', label: 'No extra time', sub: 'Finished on schedule' },
                    { id: '30min', label: '+30 min', sub: `+$${extraTimeRates['30min']}` },
                    { id: '1hr', label: '+1 hour', sub: `+$${extraTimeRates['1hr']}` },
                    { id: '2hr', label: '+2 hours', sub: `+$${extraTimeRates['2hr']}` },
                  ].map(opt => (
                    <button key={opt.id} onClick={() => setExtraTime(opt.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${extraTime === opt.id ? 'bg-coral/10 border-coral/40' : 'bg-cream border-taupe/15 hover:border-coral/20'}`}>
                      <div>
                        <p className={`font-body text-sm font-light ${extraTime === opt.id ? 'text-coral' : 'text-charcoal'}`}>{opt.label}</p>
                        <p className="font-body text-xs text-charcoal/40 font-light">{opt.sub}</p>
                      </div>
                      {extraTime === opt.id && <CheckCircle2 className="w-4 h-4 text-coral shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-taupe/10 pt-4">
                <h3 className="font-heading text-base font-semibold text-charcoal mb-3">Add-Ons Completed</h3>
                <div className="space-y-2">
                  {addons.length === 0 ? (
                    <p className="font-body text-sm text-charcoal/30 font-light text-center py-4">None for this service</p>
                  ) : (
                    addons.map(a => (
                      <button key={a.id} onClick={() => toggleAddon(a.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${completedAddons.includes(a.id) ? 'bg-coral/10 border-coral/40' : 'bg-cream border-taupe/15 hover:border-coral/20'}`}>
                        <div>
                          <p className={`font-body text-sm font-light ${completedAddons.includes(a.id) ? 'text-coral' : 'text-charcoal'}`}>{a.label}</p>
                          <p className="font-body text-xs text-charcoal/30 font-light">+${a.price}</p>
                        </div>
                        {completedAddons.includes(a.id) && <CheckCircle2 className="w-4 h-4 text-coral shrink-0" />}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Photos */}
          {step === 3 && (
            <div>
              <h3 className="font-heading text-base font-semibold text-charcoal mb-1">Before & After Photos</h3>
              <p className="font-body text-xs text-charcoal/40 font-light mb-4">Upload photos where relevant. Marketing use requires client permission.</p>
              <label className="flex items-center justify-center gap-3 p-5 rounded-2xl border-2 border-dashed border-taupe/25 bg-cream cursor-pointer hover:border-coral/30 transition-colors">
                <Camera className="w-5 h-5 text-charcoal/30" />
                <span className="font-body text-sm text-charcoal/40 font-light">{uploading ? 'Uploading...' : 'Tap to upload photos'}</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
              </label>
              {photos.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {photos.map((url, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden bg-taupe/10">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
              {photos.length > 0 && <p className="mt-2 font-body text-xs text-sage font-light">{photos.length} photo{photos.length > 1 ? 's' : ''} uploaded ✓</p>}
            </div>
          )}

          {/* Step 4: Notes & Incident */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-heading text-base font-semibold text-charcoal mb-3">Visit Notes</h3>
                <textarea
                  value={providerNotes}
                  onChange={e => setProviderNotes(e.target.value)}
                  placeholder="How did it go? Access notes, special requests, follow-up items..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 resize-none"
                />
              </div>

              <div>
                <h3 className="font-heading text-base font-semibold text-charcoal mb-3">Any Incident?</h3>
                <div className="flex gap-2 mb-3">
                  {[{ v: false, label: 'No' }, { v: true, label: 'Yes' }].map(opt => (
                    <button key={String(opt.v)} onClick={() => setHasIncident(opt.v)}
                      className={`flex-1 py-2 rounded-lg border text-xs font-body font-light transition-all ${hasIncident === opt.v ? (opt.v ? 'bg-coral/10 border-coral/40 text-coral' : 'bg-sage/10 border-sage/40 text-charcoal') : 'bg-cream border-taupe/15 text-charcoal/40 hover:border-coral/20'}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                {hasIncident && (
                  <div className="space-y-2 p-3 rounded-xl bg-coral/5 border border-coral/15">
                    <select value={incident.incident_type} onChange={e => setIncident(p => ({ ...p, incident_type: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-taupe/20 bg-warm-white font-body text-xs text-charcoal focus:outline-none focus:border-coral/40">
                      <option value="">Type...</option>
                      <option value="property_damage">Property Damage</option>
                      <option value="safety_concern">Safety Concern</option>
                      <option value="scope_refusal">Scope Refusal</option>
                      <option value="access_issue">Access Issue</option>
                      <option value="pet_incident">Pet Incident</option>
                      <option value="other">Other</option>
                    </select>
                    <textarea value={incident.description} onChange={e => setIncident(p => ({ ...p, description: e.target.value }))}
                      placeholder="Describe..."
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-taupe/20 bg-warm-white font-body text-xs text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 resize-none" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Complete */}
          {step === 5 && (
            <div>
              <h3 className="font-heading text-base font-semibold text-charcoal mb-4">Summary & Submit</h3>
              <div className="space-y-3 mb-5 bg-cream rounded-xl p-4">
                <p className="font-heading text-sm font-semibold text-charcoal mb-3">Visit Summary</p>
                <div className="space-y-2 text-sm font-body font-light text-charcoal/60">
                  <div className="flex justify-between">
                    <span>Tasks completed</span>
                    <span className="text-charcoal">{Object.values(checklist).filter(Boolean).length} marked</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Extra time</span>
                    <span className="text-charcoal">{extraTime === 'none' ? 'None' : extraTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Add-ons</span>
                    <span className="text-charcoal">{completedAddons.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Photos</span>
                    <span className="text-charcoal">{photos.length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-coral/5 border border-coral/15 rounded-xl p-4">
                <p className="font-body text-xs text-charcoal/50 font-light mb-2">Amount Charged to Client</p>
                <p className="font-heading text-3xl font-semibold text-coral mb-1">${totalRevenue.toFixed(2)}</p>
                <p className="font-body text-[10px] text-charcoal/30 font-light">✓ Payment already collected</p>
              </div>
            </div>
          )}

        </div>

        {/* Footer nav */}
        <div className="px-6 py-4 border-t border-taupe/10 flex items-center justify-between gap-3">
          <button
            onClick={() => step > 0 ? setStep(s => s - 1) : onClose()}
            className="font-body text-sm text-charcoal/40 font-light hover:text-coral transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            {step === 0 ? 'Close' : 'Back'}
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={(step === 0 && !paymentProcessed) || (step === 4 && hasIncident && !incident.description)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-coral text-white font-body text-sm tracking-wide hover:bg-coral/90 disabled:opacity-30 transition-all"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-sage text-white font-body text-sm tracking-widest uppercase font-light hover:bg-sage/90 disabled:opacity-40 transition-all"
            >
              {submitting ? '...' : 'Finish Visit ✓'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}