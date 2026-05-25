import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { calculateTotalDuration, getDynamicEstimate, timeToMinutes, minutesToTime, TRAVEL_BUFFER, SERVICE_CONFIG } from '@/lib/bookingConfig';
import StepIndicator from '@/components/booking/StepIndicator';
import Step1Service from '@/components/booking/Step1Service';
import Step2Intake from '@/components/booking/Step2Intake';
import Step3Addons from '@/components/booking/Step3Addons';
import Step4Schedule from '@/components/booking/Step4Schedule';
import Step5Confirm from '@/components/booking/Step5Confirm';

export default function BookNow() {
  const [step, setStep] = useState(1);
  const [serviceKey, setServiceKey] = useState(null);
  const [clientInfo, setClientInfo] = useState({ name: '', email: '', phone: '', address: '' });
  const [intakeAnswers, setIntakeAnswers] = useState({});
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const isConsult = serviceKey === 'consult';

  const selectedTasks = intakeAnswers._tasks || [];
  const dynamicEstimate = serviceKey && serviceKey !== 'consult'
    ? getDynamicEstimate(serviceKey, intakeAnswers, selectedTasks, selectedAddons)
    : null;
  const totalDuration = dynamicEstimate ? dynamicEstimate.durationMinutes : (serviceKey ? calculateTotalDuration(serviceKey, selectedAddons) : 0);
  const config = serviceKey ? SERVICE_CONFIG[serviceKey] : null;

  const toggleAddon = (id) => {
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const canProceed = () => {
    if (step === 1) return !!serviceKey;
    if (step === 2) {
      if (isConsult) return !!(clientInfo.name && clientInfo.email && clientInfo.phone);
      const basicInfo = clientInfo.name && clientInfo.email && clientInfo.phone && clientInfo.address;
      const needsEmergencyContact = serviceKey === 'senior_support' || serviceKey === 'mothers_helper';
      const hasEmergencyContact = !needsEmergencyContact || !!intakeAnswers.emergency_contact;
      return basicInfo && hasEmergencyContact;
    }
    if (step === 3) return true;
    if (step === 4) return !!selectedDate && !!selectedTime;
    return true;
  };

  // For consult: only 3 steps (select → intake → confirm), skip addons & schedule
  const totalSteps = isConsult ? 3 : 5;
  const displayStep = isConsult && step >= 3 ? step - 1 : step; // shift step display for consult

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const endTime = selectedTime ? minutesToTime(timeToMinutes(selectedTime) + totalDuration) : 'TBD';

      const addonPrice = selectedAddons.reduce((sum, id) => {
        const addon = config.addons.find(a => a.id === id);
        return sum + (addon ? addon.price : 0);
      }, 0);
      const estimateLow = dynamicEstimate ? dynamicEstimate.low : config.priceRange[0] + addonPrice;
      const estimateHigh = dynamicEstimate ? dynamicEstimate.high : config.priceRange[1] + addonPrice;

      const booking = await base44.entities.Booking.create({
        status: 'pending',
        client_name: clientInfo.name,
        client_email: clientInfo.email,
        client_phone: clientInfo.phone,
        client_address: clientInfo.address || '',
        service_category: isConsult ? 'home_reset' : serviceKey,
        scheduled_date: selectedDate || new Date().toISOString().split('T')[0],
        scheduled_start_time: selectedTime || 'TBD',
        scheduled_end_time: isConsult ? 'TBD' : endTime,
        base_duration_minutes: config.baseMinutes,
        total_duration_minutes: isConsult ? 15 : totalDuration,
        addons: selectedAddons,
        intake_answers: { ...intakeAnswers, uploaded_photos: uploadedPhotos },
        special_notes: intakeAnswers.situation || intakeAnswers.special_notes || '',
        estimated_price_low: estimateLow,
        estimated_price_high: estimateHigh,
        admin_notes: isConsult ? `CONSULT REQUEST — preferred contact: ${intakeAnswers.preferred_contact || 'N/A'}, availability: ${intakeAnswers.availability_notes || 'N/A'}` : '',
      });

      // Create time blocks (skip for consult — no date/time yet)
      if (!isConsult && selectedDate && selectedTime) {
        const blockEnd = minutesToTime(timeToMinutes(endTime) + TRAVEL_BUFFER);
        await base44.entities.TimeBlock.bulkCreate([
          { date: selectedDate, start_time: selectedTime, end_time: endTime, booking_id: booking.id, block_type: 'booking', label: `${config.label} — ${clientInfo.name}` },
          { date: selectedDate, start_time: endTime, end_time: blockEnd, booking_id: booking.id, block_type: 'travel', label: 'Travel buffer' },
        ]);
      }

      // Send confirmation email
      const addonLabels = selectedAddons.map(id => config.addons.find(a => a.id === id)?.label).filter(Boolean);
      const displayDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

      const emailWrapper = (innerHtml) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
<style>
  body{margin:0;padding:0;background:#fdfcfb;font-family:'Lato',sans-serif;color:#333333;}
  .wrapper{max-width:600px;margin:0 auto;background:#fdfcfb;}
  .header{background:linear-gradient(135deg,#EB9486 0%,#fcd5ce 60%,#ece4db 100%);padding:40px 40px 32px;text-align:center;}
  .brand-name{font-family:'Montserrat',sans-serif;font-size:13px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#fff;margin:0 0 2px;}
  .brand-sub{font-family:'Montserrat',sans-serif;font-size:26px;font-weight:300;color:#fff;margin:0;letter-spacing:0.04em;}
  .body{padding:36px 40px;}
  .greeting{font-family:'Montserrat',sans-serif;font-size:22px;font-weight:600;color:#333;margin:0 0 12px;}
  p{font-family:'Lato',sans-serif;font-size:15px;font-weight:300;color:#555;line-height:1.7;margin:0 0 16px;}
  .card{background:#fff;border:1px solid #f0e8e4;border-radius:16px;padding:22px 24px;margin:20px 0;}
  .card-label{font-family:'Montserrat',sans-serif;font-size:10px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#EB9486;margin:0 0 10px;}
  .card-value{font-family:'Lato',sans-serif;font-size:15px;font-weight:400;color:#333;margin:0 0 6px;line-height:1.6;}
  .card-value.light{color:#777;font-weight:300;}
  .price-card{background:linear-gradient(135deg,#fef0ee,#fdfcfb);border:1px solid #fcd5ce;border-radius:16px;padding:22px 24px;margin:20px 0;}
  .price-amount{font-family:'Montserrat',sans-serif;font-size:28px;font-weight:600;color:#EB9486;margin:4px 0 4px;}
  .price-note{font-size:12px;font-weight:300;color:#aaa;}
  .timeline-item{display:flex;align-items:flex-start;gap:12px;margin-bottom:10px;}
  .dot{width:8px;height:8px;border-radius:50%;margin-top:5px;flex-shrink:0;}
  .timeline-text{font-size:14px;font-weight:300;color:#666;line-height:1.5;}
  .cta{display:inline-block;background:#EB9486;color:#fff;font-family:'Montserrat',sans-serif;font-size:13px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;padding:14px 32px;border-radius:50px;text-decoration:none;margin:20px 0;}
  .footer{background:#f9f4f2;padding:28px 40px;text-align:center;border-top:1px solid #f0e8e4;}
  .footer p{font-size:12px;font-weight:300;color:#aaa;margin:0 0 4px;}
</style></head>
<body><div class="wrapper">
  <div class="header">
    <p class="brand-name">Clean Slate</p>
    <p class="brand-sub">Club™</p>
  </div>
  <div class="body">${innerHtml}</div>
  <div class="footer">
    <p>Questions? Reply to this email or text us at (215) 555-0100</p>
    <p>hello@cleanslateclubpa.com · cleanslateclubpa.com</p>
  </div>
</div></body></html>`;

      if (isConsult) {
        const clientBody = emailWrapper(`
          <p class="greeting">We got you, ${clientInfo.name}! 🌿</p>
          <p>Your free consult request is in. We can't wait to connect and figure out exactly how we can help.</p>
          <div class="card">
            <p class="card-label">What happens next</p>
            <p class="card-value">Masha will reach out via <strong>${intakeAnswers.preferred_contact || 'email'}</strong> within 24 hours to schedule your free 15-minute call.</p>
            ${intakeAnswers.availability_notes ? `<p class="card-value light">Your availability: ${intakeAnswers.availability_notes}</p>` : ''}
          </div>
          <p style="font-size:13px;color:#aaa;font-weight:300;">100% free. Zero commitment. Just a conversation.</p>
        `);

        await Promise.all([
          base44.integrations.Core.SendEmail({ to: clientInfo.email, subject: `We got your consult request — Clean Slate Club™`, body: clientBody }),
          base44.integrations.Core.SendEmail({
            to: 'masha@cleanslateclubpa.com',
            subject: `New Consult Request — ${clientInfo.name}`,
            body: `New free consult request!\n\nClient: ${clientInfo.name}\nEmail: ${clientInfo.email}\nPhone: ${clientInfo.phone}\nPreferred contact: ${intakeAnswers.preferred_contact || 'N/A'}\nAvailability: ${intakeAnswers.availability_notes || 'N/A'}\n\nSituation:\n${intakeAnswers.situation || 'N/A'}\n\nBiggest pain point: ${intakeAnswers.biggest_pain_point || 'N/A'}\nIdeal outcome: ${intakeAnswers.ideal_outcome || 'N/A'}\nWish list: ${intakeAnswers.wish_list_notes || 'N/A'}\n${uploadedPhotos.length > 0 ? `\nUploaded photos:\n${uploadedPhotos.join('\n')}` : ''}\n\nView in dashboard: https://cleanslateclubpa.com/admin`
          }),
        ]);
      } else {
        const selectedTasks = intakeAnswers._tasks || [];
        const addonSection = addonLabels.length > 0 ? `<div class="card"><p class="card-label">Add-ons Included</p>${addonLabels.map(a => `<p class="card-value">✓ ${a}</p>`).join('')}</div>` : '';
        const tasksSection = selectedTasks.length > 0 ? `<div class="card"><p class="card-label">Tasks Requested</p><p class="card-value light">${selectedTasks.join(' · ')}</p></div>` : '';

        const clientBody = emailWrapper(`
          <p class="greeting">You're booked, ${clientInfo.name}! ✨</p>
          <p>Consider it handled. Here's everything you need to know about your upcoming visit.</p>
          <div class="card">
            <p class="card-label">Service</p>
            <p class="card-value">${config.label}</p>
            <p class="card-value light">${displayDate} · ${selectedTime} – ${endTime}</p>
            <p class="card-value light">${clientInfo.address}</p>
          </div>
          <div class="card">
            <p class="card-label">Your Visit Timeline</p>
            <div class="timeline-item"><span class="dot" style="background:#CAE7B9"></span><span class="timeline-text"><strong>${selectedTime}</strong> — Meet & greet (15 min)</span></div>
            <div class="timeline-item"><span class="dot" style="background:#EB9486"></span><span class="timeline-text">Service begins — all tasks + add-ons</span></div>
            <div class="timeline-item"><span class="dot" style="background:#EFB988"></span><span class="timeline-text">Wrap-up & supply collection (15 min)</span></div>
            <div class="timeline-item"><span class="dot" style="background:#ddd"></span><span class="timeline-text"><strong>${endTime}</strong> — Estimated end</span></div>
          </div>
          ${addonSection}${tasksSection}
          <div class="price-card">
            <p class="card-label">Quoted Cost</p>
            <p class="price-amount">$${estimateLow}–$${estimateHigh}</p>
            <p class="price-note">Final pricing confirmed before any work begins. No surprises, ever.</p>
          </div>
          <p style="font-size:14px;color:#888;font-weight:300;">Questions? Just reply to this email — we're always happy to help.</p>
          <p style="font-size:13px;color:#aaa;margin-top:24px;font-weight:300;">With care,<br><strong style="color:#EB9486;font-family:'Montserrat',sans-serif;font-weight:600;">Masha</strong><br>Clean Slate Club™</p>
        `);

        await Promise.all([
          base44.integrations.Core.SendEmail({ to: clientInfo.email, subject: `Your Clean Slate Club™ booking is confirmed — ${displayDate}`, body: clientBody }),
          base44.integrations.Core.SendEmail({
            to: 'masha@cleanslateclubpa.com',
            subject: `New Booking: ${config.label} — ${clientInfo.name} on ${displayDate}`,
            body: `New booking submitted!\n\nClient: ${clientInfo.name}\nEmail: ${clientInfo.email}\nPhone: ${clientInfo.phone}\nAddress: ${clientInfo.address}\n\nService: ${config.label}\nDate: ${displayDate}\nTime: ${selectedTime} – ${endTime}\nTotal duration: ${(totalDuration / 60).toFixed(1)} hrs\n${addonLabels.length > 0 ? `Add-ons: ${addonLabels.join(', ')}\n` : ''}\nEstimated: $${estimateLow}–$${estimateHigh}\n\nIntake Notes:\n${JSON.stringify(intakeAnswers, null, 2)}\n\nView in dashboard: https://cleanslateclubpa.com/admin`
          }),
          // Add to Google Calendar
          base44.functions.invoke('addBookingToCalendar', {
            clientName: clientInfo.name,
            clientEmail: clientInfo.email,
            clientPhone: clientInfo.phone,
            clientAddress: clientInfo.address,
            serviceLabel: config.label,
            addonLabels,
            selectedDate,
            startTime: selectedTime,
            endTime,
            totalDuration,
            estimateLow,
            estimateHigh,
            specialNotes: intakeAnswers.situation || intakeAnswers.special_notes || '',
            tasks: selectedTasks,
          }),
        ]);
      }

      setSubmitted(true);
    } catch (e) {
      setError('Something went wrong. Please try again or call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-sage/40 flex items-center justify-center mx-auto mb-6 text-2xl">✓</div>
          {isConsult ? (
            <>
              <h1 className="font-heading text-3xl font-semibold text-charcoal mb-3">We'll be in touch!</h1>
              <p className="font-logo text-xl text-coral mb-4">Your consult request is in.</p>
              <p className="font-body text-sm text-charcoal/50 font-light leading-relaxed mb-8">
                Masha will reach out via <strong>{intakeAnswers.preferred_contact || 'email'}</strong> within 24 hours. A confirmation has been sent to <strong>{clientInfo.email}</strong>.
              </p>
            </>
          ) : (
            <>
              <h1 className="font-heading text-3xl font-semibold text-charcoal mb-3">You're booked!</h1>
              <p className="font-logo text-xl text-coral mb-4">Consider it handled.</p>
              <p className="font-body text-sm text-charcoal/50 font-light leading-relaxed mb-8">
                A confirmation email is on its way to <strong>{clientInfo.email}</strong>. Masha will see you on {selectedDate && new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}.
              </p>
            </>
          )}
          <a href="/" className="inline-block bg-coral text-white font-body text-sm tracking-wide px-10 py-4 rounded-full hover:bg-coral/90 transition-all duration-300">
            Back to home
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="font-body text-xs tracking-[0.25em] uppercase text-coral/60 font-light mb-3">Let's get started</p>
            <h1 className="font-heading text-3xl font-semibold text-charcoal mb-1">Book Your Visit</h1>
            <p className="font-logo text-xl text-coral">Personalized support, built around you.</p>
          </div>

          <StepIndicator currentStep={step} totalSteps={totalSteps} />

          <div className="bg-warm-white rounded-3xl border border-taupe/15 shadow-sm p-7 sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {step === 1 && <Step1Service selected={serviceKey} onSelect={k => { setServiceKey(k); setSelectedAddons([]); setIntakeAnswers({}); }} onPhotoUpload={setUploadedPhotos} uploadedPhotos={uploadedPhotos} />}
                {step === 2 && <Step2Intake serviceKey={serviceKey} answers={intakeAnswers} onChange={setIntakeAnswers} clientInfo={clientInfo} onClientChange={setClientInfo} />}
                {/* For consult: step 3 = confirm (skip addons + schedule) */}
                {!isConsult && step === 3 && <Step3Addons serviceKey={serviceKey} selectedAddons={selectedAddons} onToggle={toggleAddon} dynamicEstimate={dynamicEstimate} />}
                {!isConsult && step === 4 && <Step4Schedule totalDuration={totalDuration} selectedDate={selectedDate} selectedTime={selectedTime} onSelect={(d, t) => { setSelectedDate(d); setSelectedTime(t); }} />}
                {((!isConsult && step === 5) || (isConsult && step === 3)) && <Step5Confirm serviceKey={serviceKey} clientInfo={clientInfo} intakeAnswers={intakeAnswers} selectedAddons={selectedAddons} selectedDate={selectedDate} selectedTime={selectedTime} totalDuration={totalDuration} uploadedPhotos={uploadedPhotos} dynamicEstimate={dynamicEstimate} />}
              </motion.div>
            </AnimatePresence>

            {error && <p className="mt-4 text-sm text-red-500 font-body text-center">{error}</p>}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-taupe/10">
              {step > 1 ? (
                <button onClick={() => setStep(s => s - 1)} className="font-body text-sm text-charcoal/40 font-light hover:text-coral transition-colors">← Back</button>
              ) : <div />}

              {step < (isConsult ? 3 : 5) ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  disabled={!canProceed()}
                  className="bg-coral text-white font-body text-sm tracking-wide px-8 py-3 rounded-full hover:bg-coral/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-coral text-white font-body text-sm tracking-wide px-10 py-3.5 rounded-full hover:bg-coral/90 disabled:opacity-50 transition-all duration-300"
                >
                  {submitting ? (isConsult ? 'Sending...' : 'Booking...') : (isConsult ? 'Request My Free Consult →' : 'Confirm Booking')}
                </button>
              )}
            </div>
          </div>

          <p className="text-center font-body text-xs text-charcoal/25 font-light mt-6">
            Questions? Text us at (215) 555-0100 or email hello@cleanslateclubpa.com
          </p>
        </div>
      </div>
    </div>
  );
}