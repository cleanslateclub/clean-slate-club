import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';
import { CheckCircle2, Circle, Camera, Clock, AlertTriangle, DollarSign, ChevronRight, ChevronLeft } from 'lucide-react';

const STEPS = ['Clock In', 'Checklist', 'Extra Time', 'Add-Ons', 'Photos', 'Notes', 'Incident', 'Submit'];

export default function CompleteVisitWizard({ booking, onComplete, onClose }) {
  const [step, setStep] = useState(0);
  const [clockInTime] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
  const [checklist, setChecklist] = useState({});
  const [extraTime, setExtraTime] = useState('none');
  const [completedAddons, setCompletedAddons] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [providerNotes, setProviderNotes] = useState('');
  const [opportunityNotes, setOpportunityNotes] = useState('');
  const [hasIncident, setHasIncident] = useState(null);
  const [incident, setIncident] = useState({ incident_type: '', description: '', severity: 'low' });
  const [tipAmount, setTipAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
              <p className="font-body text-xs text-charcoal/40 font-light">{config?.label} · Clocked in at {clockInTime}</p>
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

          {/* Step 0: Clock In */}
          {step === 0 && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-sage" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-charcoal mb-2">You're clocked in!</h3>
              <p className="font-body text-sm text-charcoal/50 font-light mb-2">Arrival time: <strong className="text-charcoal">{clockInTime}</strong></p>
              <p className="font-body text-xs text-charcoal/40 font-light leading-relaxed">
                Complete the walkthrough with the client, note any concerns, and begin service. Use this wizard when you finish.
              </p>
            </div>
          )}

          {/* Step 1: Checklist */}
          {step === 1 && (
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

          {/* Step 2: Extra Time */}
          {step === 2 && (
            <div>
              <h3 className="font-heading text-base font-semibold text-charcoal mb-1">Extra Time Needed?</h3>
              <p className="font-body text-xs text-charcoal/40 font-light mb-4">
                Only add if client authorized additional time. Billed at <strong>{isMember ? '$65/hr (member)' : '$85/hr (non-member)'}</strong>.
              </p>
              <div className="space-y-2">
                {[
                  { id: 'none', label: 'No extra time needed', sub: 'Complete within original booking' },
                  { id: '30min', label: '+30 Minutes', sub: `+$${extraTimeRates['30min']}` },
                  { id: '1hr', label: '+1 Hour', sub: `+$${extraTimeRates['1hr']}` },
                  { id: '2hr', label: '+2 Hours', sub: `+$${extraTimeRates['2hr']}` },
                ].map(opt => (
                  <button key={opt.id} onClick={() => setExtraTime(opt.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${extraTime === opt.id ? 'bg-coral/10 border-coral/40' : 'bg-cream border-taupe/15 hover:border-coral/20'}`}>
                    <div>
                      <p className={`font-body text-sm font-light ${extraTime === opt.id ? 'text-coral' : 'text-charcoal'}`}>{opt.label}</p>
                      <p className="font-body text-xs text-charcoal/40 font-light">{opt.sub}</p>
                    </div>
                    {extraTime === opt.id && <CheckCircle2 className="w-4 h-4 text-coral shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Completed Add-Ons */}
          {step === 3 && (
            <div>
              <h3 className="font-heading text-base font-semibold text-charcoal mb-1">Add-Ons Completed</h3>
              <p className="font-body text-xs text-charcoal/40 font-light mb-4">Select any add-ons that were completed or approved during this visit.</p>
              <div className="space-y-2">
                {addons.map(a => (
                  <button key={a.id} onClick={() => toggleAddon(a.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${completedAddons.includes(a.id) ? 'bg-coral/10 border-coral/40' : 'bg-cream border-taupe/15 hover:border-coral/20'}`}>
                    <div>
                      <p className={`font-body text-sm font-light ${completedAddons.includes(a.id) ? 'text-coral' : 'text-charcoal'}`}>{a.label}</p>
                      <p className="font-body text-xs text-charcoal/30 font-light">+${a.price}</p>
                    </div>
                    {completedAddons.includes(a.id) && <CheckCircle2 className="w-4 h-4 text-coral shrink-0" />}
                  </button>
                ))}
                {addons.length === 0 && <p className="font-body text-sm text-charcoal/30 font-light text-center py-4">No add-ons for this service.</p>}
              </div>
            </div>
          )}

          {/* Step 4: Photos */}
          {step === 4 && (
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

          {/* Step 5: Notes */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-heading text-base font-semibold text-charcoal mb-1">Provider Notes</h3>
                <p className="font-body text-xs text-charcoal/40 font-light mb-3">Notes visible to admin and future assigned providers.</p>
                <textarea
                  value={providerNotes}
                  onChange={e => setProviderNotes(e.target.value)}
                  placeholder="How did the visit go? Any access notes, client preferences, things to remember..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 resize-none"
                />
              </div>
              <div>
                <label className="font-body text-xs text-charcoal/60 font-light block mb-1.5">Opportunity Tracker (optional)</label>
                <textarea
                  value={opportunityNotes}
                  onChange={e => setOpportunityNotes(e.target.value)}
                  placeholder="Spaces that could use help in the future, services the client mentioned needing..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 6: Incident */}
          {step === 6 && (
            <div>
              <h3 className="font-heading text-base font-semibold text-charcoal mb-1">Incident Report</h3>
              <p className="font-body text-xs text-charcoal/40 font-light mb-4">Did anything happen during this visit that should be reported?</p>
              <div className="flex gap-3 mb-4">
                {[{ v: false, label: 'No incident to report' }, { v: true, label: 'Yes, file an incident' }].map(opt => (
                  <button key={String(opt.v)} onClick={() => setHasIncident(opt.v)}
                    className={`flex-1 py-3 rounded-xl border text-xs font-body font-light transition-all ${hasIncident === opt.v ? (opt.v ? 'bg-coral/10 border-coral/40 text-coral' : 'bg-sage/10 border-sage/40 text-charcoal/70') : 'bg-cream border-taupe/15 text-charcoal/40 hover:border-coral/20'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
              {hasIncident && (
                <div className="space-y-3 p-4 rounded-xl bg-coral/5 border border-coral/15">
                  <div>
                    <label className="font-body text-xs text-charcoal/50 font-light block mb-1.5">Incident Type</label>
                    <select value={incident.incident_type} onChange={e => setIncident(p => ({ ...p, incident_type: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-taupe/20 bg-warm-white font-body text-sm text-charcoal focus:outline-none focus:border-coral/40">
                      <option value="">Select type...</option>
                      <option value="property_damage">Property Damage</option>
                      <option value="safety_concern">Safety Concern</option>
                      <option value="scope_refusal">Scope Refusal</option>
                      <option value="access_issue">Access Issue</option>
                      <option value="pet_incident">Pet Incident</option>
                      <option value="client_behavior">Client Behavior</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-body text-xs text-charcoal/50 font-light block mb-1.5">Severity</label>
                    <div className="flex gap-2">
                      {['low', 'medium', 'high', 'critical'].map(s => (
                        <button key={s} onClick={() => setIncident(p => ({ ...p, severity: s }))}
                          className={`flex-1 py-1.5 rounded-lg border text-[10px] font-body font-light capitalize transition-colors ${incident.severity === s ? 'bg-coral border-coral text-white' : 'border-taupe/20 text-charcoal/40 hover:border-coral/30'}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                  <textarea value={incident.description} onChange={e => setIncident(p => ({ ...p, description: e.target.value }))}
                    placeholder="Describe what happened in detail..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl border border-taupe/20 bg-warm-white font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 resize-none" />
                </div>
              )}
            </div>
          )}

          {/* Step 7: Submit */}
          {step === 7 && (
            <div>
              <h3 className="font-heading text-base font-semibold text-charcoal mb-4">Summary & Submit</h3>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between py-2 border-b border-taupe/10">
                  <span className="font-body text-xs text-charcoal/50 font-light">Clocked In</span>
                  <span className="font-body text-xs text-charcoal font-light">{clockInTime}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-taupe/10">
                  <span className="font-body text-xs text-charcoal/50 font-light">Tasks Completed</span>
                  <span className="font-body text-xs text-charcoal font-light">{Object.values(checklist).filter(Boolean).length} marked</span>
                </div>
                <div className="flex justify-between py-2 border-b border-taupe/10">
                  <span className="font-body text-xs text-charcoal/50 font-light">Extra Time</span>
                  <span className="font-body text-xs text-charcoal font-light">{extraTime === 'none' ? 'None' : extraTime}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-taupe/10">
                  <span className="font-body text-xs text-charcoal/50 font-light">Add-Ons Completed</span>
                  <span className="font-body text-xs text-charcoal font-light">{completedAddons.length} add-on{completedAddons.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-taupe/10">
                  <span className="font-body text-xs text-charcoal/50 font-light">Photos</span>
                  <span className="font-body text-xs text-charcoal font-light">{photos.length} uploaded</span>
                </div>
                <div className="flex justify-between py-2 border-b border-taupe/10">
                  <span className="font-body text-xs text-charcoal/50 font-light">Incident Filed</span>
                  <span className={`font-body text-xs font-light ${hasIncident ? 'text-coral' : 'text-charcoal'}`}>{hasIncident ? 'Yes — admin will be notified' : 'No'}</span>
                </div>
              </div>

              {/* Tip line */}
              <div className="bg-butter/20 border border-butter/40 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-charcoal/40" />
                  <div className="flex-1">
                    <p className="font-body text-sm text-charcoal font-light">Tip Amount (100% yours)</p>
                    <p className="font-body text-[10px] text-charcoal/40 font-light">Cash tip received, or added via Stripe invoice</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-body text-sm text-charcoal/40">$</span>
                    <input type="number" min="0" value={tipAmount} onChange={e => setTipAmount(e.target.value)} placeholder="0"
                      className="w-16 px-2 py-1.5 rounded-lg border border-taupe/20 bg-warm-white font-body text-sm text-charcoal text-center focus:outline-none focus:border-coral/40" />
                  </div>
                </div>
              </div>

              <div className="bg-coral/5 border border-coral/15 rounded-xl p-4">
                <p className="font-body text-xs text-charcoal/50 font-light mb-1">Estimated Payout This Visit</p>
                <p className="font-heading text-2xl font-semibold text-coral">${providerPayout.toFixed(2)}</p>
                <p className="font-body text-[10px] text-charcoal/30 font-light">50% service + 100% tips · Bi-weekly payout</p>
              </div>
            </div>
          )}

        </div>

        {/* Footer nav */}
        <div className="px-6 py-4 border-t border-taupe/10 flex items-center justify-between">
          <button
            onClick={() => step > 0 ? setStep(s => s - 1) : onClose()}
            className="font-body text-sm text-charcoal/40 font-light hover:text-coral transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            {step === 0 ? 'Cancel' : 'Back'}
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={step === 6 && hasIncident === null}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-coral text-white font-body text-sm tracking-wide hover:bg-coral/90 disabled:opacity-30 transition-all"
            >
              {step === 0 ? 'Start Checklist' : 'Continue'}
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || (hasIncident && !incident.description)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-coral text-white font-body text-sm tracking-wide hover:bg-coral/90 disabled:opacity-40 transition-all"
            >
              {submitting ? 'Submitting...' : 'Complete Visit ✓'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}