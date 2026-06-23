import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { calculateTotalDuration, getDynamicEstimate, timeToMinutes, minutesToTime, TRAVEL_BUFFER, SERVICE_CONFIG } from '@/lib/bookingConfig';
import StepIndicator from '@/components/booking/StepIndicator';
import PageHero from '@/components/shared/PageHero';
import { useAppSettings } from '@/hooks/useAppSettings';
import Step1Service from '@/components/booking/Step1Service.jsx';
import Step2Intake from '@/components/booking/Step2Intake';
import Step3Addons from '@/components/booking/Step3Addons';
import Step4Schedule from '@/components/booking/Step4Schedule';
import Step5Confirm from '@/components/booking/Step5Confirm';
import Step6Payment from '@/components/booking/Step6Payment';

const buildServiceAddress = (info = {}) => {
  const street = info.service_street?.trim();
  const unit = info.service_unit?.trim();
  const city = info.service_city?.trim();
  const state = (info.service_state || 'PA').trim();
  const zip = info.service_zip?.trim();
  return [street, unit, [city, state, zip].filter(Boolean).join(' ')].filter(Boolean).join(', ');
};

export default function BookNow() {
  const { getBool, loading: settingsLoading } = useAppSettings();
  const [searchParams] = useSearchParams();

  const preselectedService = searchParams.get('service');
  const validatedPreselected = preselectedService && SERVICE_CONFIG[preselectedService] ? preselectedService : null;

  const [step, setStep] = useState(validatedPreselected ? 2 : 1);
  const [serviceKey, setServiceKey] = useState(validatedPreselected || null);
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    service_street: '',
    service_unit: '',
    service_city: '',
    service_state: 'PA',
    service_zip: '',
  });
  const [intakeAnswers, setIntakeAnswers] = useState({});
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [smsOptIn, setSmsOptIn] = useState(true);
  const [skipDeposit, setSkipDeposit] = useState(false);
  // FIX: Replaced PolicyModal popup with inline acknowledgements on Step 5.
  // allAcknowledged is set true by Step5Confirm once every checkbox is checked.
  const [allAcknowledged, setAllAcknowledged] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('skip_deposit') === 'true') setSkipDeposit(true);
  }, []);

  const isConsult = serviceKey === 'consult';

  useEffect(() => {
    if (!isConsult) return;
    base44.functions.invoke('scheduleConsultSlot', {}).then(res => {
      if (res.data?.success) {
        setSelectedDate(res.data.date);
        setSelectedTime(res.data.time);
      } else {
        setError('Could not auto-schedule your consult slot. Please call us at (215) 500-3758.');
      }
    }).catch(err => {
      console.error('scheduleConsultSlot failed:', err);
      setError('Could not auto-schedule your consult slot. Please call us at (215) 500-3758.');
    });
  }, [isConsult]);

  const selectedTasks = intakeAnswers._tasks || [];

  const dynamicEstimate = serviceKey && serviceKey !== 'consult'
    ? getDynamicEstimate(serviceKey, intakeAnswers, selectedTasks, selectedAddons)
    : null;
  const totalDuration = dynamicEstimate
    ? dynamicEstimate.durationMinutes
    : serviceKey ? calculateTotalDuration(serviceKey, selectedAddons) : 0;

  const config = serviceKey && SERVICE_CONFIG[serviceKey] ? SERVICE_CONFIG[serviceKey] : null;

  const toggleAddon = (id) => {
    setSelectedAddons(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const canProceed = () => {
    if (step === 1) return !!serviceKey;
    if (step === 2) {
      if (isConsult) return !!(clientInfo.name && clientInfo.email && clientInfo.phone);
      const hasContact = !!(clientInfo.name && clientInfo.email && clientInfo.phone);
      const hasServiceAddress = !!(
        clientInfo.service_street &&
        clientInfo.service_city &&
        clientInfo.service_state &&
        clientInfo.service_zip
      );
      const needsEmergencyContact = serviceKey === 'senior_support' || serviceKey === 'mothers_helper';
      const hasEmergencyContact = !needsEmergencyContact || !!(
        intakeAnswers.emergency_first_name &&
        intakeAnswers.emergency_last_name &&
        intakeAnswers.emergency_phone
      );
      const hasErrandLocations = serviceKey !== 'errands' || !!intakeAnswers.errand_locations;
      return !!(hasContact && hasServiceAddress && hasEmergencyContact && hasErrandLocations);
    }
    if (step === 3) return true;
    if (step === 4) return !!selectedDate && !!selectedTime;
    return true;
  };

  const totalSteps = isConsult ? 2 : (skipDeposit ? 5 : 6);
  const displayStep = step;

  const handleSubmit = useCallback(async (stripePaymentIntentId = null) => {
    setSubmitting(true);
    setError(null);
    try {
      const normalizedClientAddress = clientInfo.address || buildServiceAddress(clientInfo);
      const serviceAddressParts = {
        street: clientInfo.service_street || '',
        unit: clientInfo.service_unit || '',
        city: clientInfo.service_city || '',
        state: clientInfo.service_state || 'PA',
        zip: clientInfo.service_zip || '',
        formatted: normalizedClientAddress,
      };
      const emergencyContact = {
        first_name: intakeAnswers.emergency_first_name || '',
        last_name: intakeAnswers.emergency_last_name || '',
        phone: intakeAnswers.emergency_phone || '',
        formatted: intakeAnswers.emergency_contact || '',
      };
      const endTime = selectedTime ? minutesToTime(timeToMinutes(selectedTime) + totalDuration) : 'TBD';

      const displayDate = selectedDate
        ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
        : 'TBD';

      const addonPrice = selectedAddons.reduce((sum, id) => {
        const addon = config?.addons?.find(a => a.id === id);
        return sum + (addon ? addon.price : 0);
      }, 0);
      const estimateLow = dynamicEstimate ? dynamicEstimate.low : (config?.priceRange?.[0] || 0) + addonPrice;
      const estimateHigh = dynamicEstimate ? dynamicEstimate.high : (config?.priceRange?.[1] || 0) + addonPrice;

      const booking = await base44.entities.Booking.create({
        status: 'pending',
        client_name: clientInfo.name,
        client_email: clientInfo.email,
        client_phone: clientInfo.phone,
        client_address: normalizedClientAddress || '',
        service_category: isConsult ? 'consult' : serviceKey,
        scheduled_date: selectedDate || new Date().toISOString().split('T')[0],
        scheduled_start_time: selectedTime || 'TBD',
        scheduled_end_time: isConsult ? 'TBD' : endTime,
        base_duration_minutes: config?.baseMinutes || 0,
        total_duration_minutes: isConsult ? 15 : totalDuration,
        addons: selectedAddons,
        intake_answers: { ...intakeAnswers, service_address: serviceAddressParts, emergency_contact_details: emergencyContact, uploaded_photos: uploadedPhotos, sms_opt_in: smsOptIn },
        special_notes: intakeAnswers.situation || intakeAnswers.special_notes || '',
        estimated_price_low: estimateLow,
        estimated_price_high: estimateHigh,
        admin_notes: isConsult
          ? `CONSULT REQUEST - scheduled: ${selectedDate || 'TBD'} at ${selectedTime || 'TBD'} - preferred contact: ${intakeAnswers.preferred_contact || 'N/A'}, availability: ${intakeAnswers.availability_notes || 'N/A'}`
          : `Deposit paid - Stripe ID: ${stripePaymentIntentId || 'N/A'}`
      });

      // Referral code (non-blocking)
      const referralCode = intakeAnswers.referral_code?.trim().toUpperCase();
      if (referralCode && !isConsult) {
        try {
          const profiles = await base44.entities.HouseholdProfile.list({ referral_code: referralCode }, 1);
          const referrerProfile = profiles?.[0];
          if (referrerProfile && referrerProfile.guest_email !== clientInfo.email) {
            await base44.entities.Referral.create({
              referrer_name: referrerProfile.guest_name || '',
              referrer_email: referrerProfile.guest_email,
              referred_name: clientInfo.name,
              referred_email: clientInfo.email,
              referred_phone: clientInfo.phone,
              referral_code: referralCode,
              status: 'booked',
              booking_id: booking.id,
            });
          }
        } catch (refErr) {
          console.error('Referral creation failed (non-blocking):', refErr);
        }
      }

      // Time blocks (non-consult only)
      if (!isConsult && selectedDate && selectedTime) {
        const blockEnd = minutesToTime(timeToMinutes(endTime) + TRAVEL_BUFFER);
        await base44.entities.TimeBlock.bulkCreate([
          { date: selectedDate, start_time: selectedTime, end_time: endTime, booking_id: booking.id, block_type: 'booking', label: `${config?.label} - ${clientInfo.name}` },
          { date: selectedDate, start_time: endTime, end_time: blockEnd, booking_id: booking.id, block_type: 'travel', label: 'Travel buffer' }
        ]);
      }

      const emailWrapper = (innerHtml) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600&family=Lato:wght@300;400;700&family=Sarina&display=swap" rel="stylesheet">
<style>
  body{margin:0;padding:0;background:#fdfcfb;font-family:'Lato',sans-serif;color:#333333;}
  .wrapper{max-width:600px;margin:0 auto;background:#fdfcfb;}
  .header{background:linear-gradient(135deg,#EB9486 0%,#EFB988 35%,#CAE7B9 70%,#ece4db 100%);padding:44px 40px 36px;text-align:center;}
  .brand-name{font-family:'Montserrat',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.9);margin:0;display:inline;}
  .brand-sub{font-family:'Sarina',cursive;font-size:26px;font-weight:400;color:#fff;margin:0 0 0 8px;letter-spacing:0.02em;display:inline;}
  .body{padding:36px 40px;}
  .greeting{font-family:'Montserrat',sans-serif;font-size:22px;font-weight:600;color:#333;margin:0 0 12px;}
  p{font-family:'Lato',sans-serif;font-size:15px;font-weight:300;color:#555;line-height:1.7;margin:0 0 16px;}
  .card{background:#fff;border:1px solid #f0e8e4;border-radius:16px;padding:22px 24px;margin:20px 0;}
  .card-label{font-family:'Montserrat',sans-serif;font-size:10px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#EB9486;margin:0 0 10px;}
  .card-value{font-family:'Lato',sans-serif;font-size:15px;font-weight:400;color:#333;margin:0 0 6px;line-height:1.6;}
  .card-value.light{color:#777;font-weight:300;}
  .price-card{background:linear-gradient(135deg,#fef0ee,#fdfcfb);border:1px solid #fcd5ce;border-radius:16px;padding:22px 24px;margin:20px 0;}
  .price-amount{font-family:'Montserrat',sans-serif;font-size:28px;font-weight:600;color:#EB9486;margin:4px 0;}
  .price-note{font-size:12px;font-weight:300;color:#aaa;}
  .timeline-item{display:flex;align-items:flex-start;gap:12px;margin-bottom:10px;}
  .dot{width:8px;height:8px;border-radius:50%;margin-top:5px;flex-shrink:0;}
  .timeline-text{font-size:14px;font-weight:300;color:#666;line-height:1.5;}
  .footer{background:#f9f4f2;padding:28px 40px;text-align:center;border-top:1px solid #f0e8e4;}
  .footer p{font-size:12px;font-weight:300;color:#aaa;margin:0 0 4px;}
</style></head>
<body><div class="wrapper">
  <div class="header">
    <div style="margin-bottom:14px;"><span class="brand-name">CLEAN SLATE</span><span class="brand-sub">Club</span></div>
    <div style="height:1px;background:rgba(255,255,255,0.3);margin:0 auto 16px;max-width:160px;"></div>
  </div>
  <div class="body">${innerHtml}</div>
  <div class="footer">
    <p>Questions? Reply to this email or text us at (215) 500-3758</p>
    <p>cleanslateclubpa@gmail.com &middot; cleanslateclub.co</p>
  </div>
</div></body></html>`;

      const addonLabels = selectedAddons.map(id => config?.addons?.find(a => a.id === id)?.label).filter(Boolean);

      if (isConsult && selectedDate && selectedTime) {
        const consultEnd = minutesToTime(timeToMinutes(selectedTime) + 15);
        const clientBody = emailWrapper(`
          <p class="greeting">You're on the calendar, ${clientInfo.name}!</p>
          <p>Your free 15-minute consult is officially scheduled. We can't wait to connect.</p>
          <div class="card">
            <p class="card-label">Your Consult</p>
            <p class="card-value"><strong>${displayDate}</strong> at <strong>${selectedTime || 'TBD'}</strong></p>
            <p class="card-value light">We'll call you at ${clientInfo.phone} at the time above.</p>
            ${intakeAnswers.availability_notes ? `<p class="card-value light">Your availability notes: ${intakeAnswers.availability_notes}</p>` : ''}
          </div>
          <p style="font-size:13px;color:#aaa;font-weight:300;">100% free. Zero commitment. Just a conversation. You'll get a reminder 24 hours before.</p>
        `);
        Promise.all([
          base44.integrations.Core.SendEmail({ to: clientInfo.email, subject: 'We got your consult request - Clean Slate Club', body: clientBody }),
          base44.integrations.Core.SendEmail({
            to: 'cleanslateclubpa@gmail.com',
            subject: `New Consult Request - ${clientInfo.name}`,
            body: `New free consult request!\n\nClient: ${clientInfo.name}\nEmail: ${clientInfo.email}\nPhone: ${clientInfo.phone}\nPreferred contact: ${intakeAnswers.preferred_contact || 'N/A'}\nAvailability: ${intakeAnswers.availability_notes || 'N/A'}\n\nSituation:\n${intakeAnswers.situation || 'N/A'}\n\nBiggest pain point: ${intakeAnswers.biggest_pain_point || 'N/A'}\nIdeal outcome: ${intakeAnswers.ideal_outcome || 'N/A'}\nWish list: ${intakeAnswers.wish_list_notes || 'N/A'}\n${uploadedPhotos.length > 0 ? `\nUploaded photos:\n${uploadedPhotos.join('\n')}` : ''}\n\nView in dashboard: https://cleanslateclub.co/admin`
          })
        ]).catch(err => console.error('Consult email send failed (non-blocking):', err));

        base44.functions.invoke('addBookingToCalendar', {
          data: {
            clientName: clientInfo.name, clientEmail: clientInfo.email, clientPhone: clientInfo.phone,
            clientAddress: '', serviceLabel: 'Free Consult Call', addonLabels: [],
            selectedDate, startTime: selectedTime, endTime: consultEnd, totalDuration: 15,
            estimateLow: 0, estimateHigh: 0,
            specialNotes: `Preferred contact: ${intakeAnswers.preferred_contact || 'N/A'} | Availability: ${intakeAnswers.availability_notes || 'N/A'}`,
            tasks: [], sendInviteToClient: true, isConsult: true
          }
        }).catch(err => console.error('Calendar sync failed (non-blocking):', err));

        await base44.functions.invoke('sendClientSmsConfirmation', { data: { bookingId: booking.id } }).catch(err => console.error('Client SMS failed:', err));
        await base44.functions.invoke('notifyTeamNewBooking', { data: { bookingId: booking.id } }).catch(err => console.error('Team notification failed:', err));
        setSubmitted(true);
        return;
      }

      // Normal booking emails
      const clientBody = emailWrapper(`
        <p class="greeting">Thank you, ${clientInfo.name}!</p>
        <p>Your Clean Slate Club request has been received. We'll review the details and confirm availability shortly.</p>
        <div class="card">
          <p class="card-label">Requested Service</p>
          <p class="card-value"><strong>${config?.label}</strong></p>
          <p class="card-value light">${displayDate} from ${selectedTime || 'TBD'} to ${endTime}</p>
          ${addonLabels.length ? `<p class="card-value light">Add-ons: ${addonLabels.join(', ')}</p>` : ''}
        </div>
        <div class="price-card">
          <p class="card-label">Estimated Range</p>
          <p class="price-amount">$${estimateLow} - $${estimateHigh}</p>
          <p class="price-note">Final amount is based on actual time and approved add-ons. Your deposit will be applied.</p>
        </div>
        <p>Next, we'll review your request, confirm details, and reach out if anything needs clarification.</p>
      `);
      const errandDetails = serviceKey === 'errands'
        ? `\nErrand locations/stops: ${intakeAnswers.errand_locations || 'N/A'}\nStart point: ${intakeAnswers.errand_start_point || 'N/A'}\nPickup/dropoff notes: ${intakeAnswers.pickup_dropoff_notes || 'N/A'}\n`
        : '';
      const emergencyDetails = emergencyContact.formatted
        ? `\nEmergency contact: ${emergencyContact.formatted}\n`
        : '';
      const adminBody = `New booking request!\n\nClient: ${clientInfo.name}\nEmail: ${clientInfo.email}\nPhone: ${clientInfo.phone}\nAddress: ${normalizedClientAddress}\nCity: ${serviceAddressParts.city}\nZIP: ${serviceAddressParts.zip}\n\nService: ${config?.label}\nDate: ${displayDate}\nTime: ${selectedTime} - ${endTime}\nDuration: ${totalDuration} minutes\nEstimate: $${estimateLow} - $${estimateHigh}\n\nTasks: ${selectedTasks.join(', ') || 'None selected'}\nAdd-ons: ${addonLabels.join(', ') || 'None'}\n${errandDetails}${emergencyDetails}\nSpecial notes: ${intakeAnswers.special_notes || intakeAnswers.situation || 'N/A'}\n\nSMS opt-in: ${smsOptIn ? 'Yes' : 'No'}\nStripe Payment Intent: ${stripePaymentIntentId || 'N/A'}\n${uploadedPhotos.length > 0 ? `\nUploaded photos:\n${uploadedPhotos.join('\n')}` : ''}\n\nView in dashboard: https://cleanslateclub.co/admin`;
      Promise.all([
        base44.integrations.Core.SendEmail({ to: clientInfo.email, subject: 'We got your request - Clean Slate Club', body: clientBody }),
        base44.integrations.Core.SendEmail({ to: 'cleanslateclubpa@gmail.com', subject: `New Booking Request - ${clientInfo.name}`, body: adminBody }),
      ]).catch(err => console.error('Email send failed (non-blocking):', err));

      base44.functions.invoke('addBookingToCalendar', {
        data: {
          clientName: clientInfo.name, clientEmail: clientInfo.email, clientPhone: clientInfo.phone,
          clientAddress: normalizedClientAddress, serviceLabel: config?.label, addonLabels,
          selectedDate, startTime: selectedTime, endTime, totalDuration,
          estimateLow, estimateHigh, specialNotes: intakeAnswers.special_notes || intakeAnswers.situation || '',
          tasks: selectedTasks, sendInviteToClient: true, isConsult: false
        }
      }).catch(err => console.error('Calendar sync failed (non-blocking):', err));

      await base44.functions.invoke('sendClientSmsConfirmation', { data: { bookingId: booking.id } }).catch(err => console.error('Client SMS failed:', err));
      await base44.functions.invoke('notifyTeamNewBooking', { data: { bookingId: booking.id } }).catch(err => console.error('Team notification failed:', err));

      setSubmitted(true);
    } catch (err) {
      console.error('Booking submit failed:', err);
      setError('Something went wrong. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  }, [clientInfo, selectedDate, selectedTime, totalDuration, config, dynamicEstimate, selectedAddons, intakeAnswers, uploadedPhotos, smsOptIn, isConsult, serviceKey]);

  if (submitted) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex items-center justify-center px-6" style={{ background: '#FDFCFB' }}>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="max-w-md text-center rounded-[2rem] border p-8 bg-white" style={{ borderColor: '#33333322', boxShadow: '0 18px 45px #8B93A715' }}>
          <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: '#CAE7B9' }}>
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="font-logo text-4xl mb-4" style={{ color: '#EB9486' }}>You're on our list</h1>
          <p className="font-body text-charcoal/60 font-light leading-relaxed mb-8">
            We've received your request and will be in touch soon to confirm details.
          </p>
          <button onClick={() => window.location.href = '/'} className="text-white px-8 py-3 rounded-full font-body text-sm tracking-wide transition-all duration-300 hover:opacity-90 hover:shadow-lg" style={{ background: '#333333' }}>
            Back Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#FDFCFB' }}>
      <PageHero
        eyebrow="Book Your Visit"
        title="Let's clear some space"
        description="Tell us what you need. We'll help you choose the right support and get you on the calendar."
        background="linear-gradient(135deg, #FDFCFB 0%, #DFE3A266 22%, #CAE7B966 42%, #F3DE8A55 60%, #EFB98855 76%, #EB948655 90%, #B58A9038 100%)"
        waveFill="#FDFCFB"
        scriptColor="#EB9486"
      />

      <div className="max-w-4xl mx-auto px-6 pb-20 mt-8 relative z-10">
        {settingsLoading ? (
          <div className="text-center py-16 text-charcoal/40 font-body font-light">Loading booking settings...</div>
        ) : !getBool('booking_enabled') ? (
          <div className="max-w-xl mx-auto bg-white rounded-[2rem] border p-10 text-center" style={{ borderColor: '#33333322', boxShadow: '0 18px 45px #8B93A715' }}>
            <h2 className="font-logo text-4xl mb-4" style={{ color: '#EB9486' }}>Booking is temporarily paused</h2>
            <p className="font-body text-charcoal/60 font-light leading-relaxed">We're making a few updates behind the scenes. Please check back soon or email us directly at cleanslateclubpa@gmail.com.</p>
          </div>
        ) : (
          <div>
            <div className="rounded-[2rem] border bg-white p-5 md:p-7 mb-5" style={{ borderColor: '#33333322', boxShadow: '0 18px 45px #8B93A715' }}>
              <StepIndicator currentStep={displayStep} totalSteps={totalSteps} />
            </div>

            <div className="bg-white rounded-[2rem] border p-6 md:p-10" style={{ borderColor: '#33333322', boxShadow: '0 18px 45px #8B93A715' }}>
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  {step === 1 && (
                    <Step1Service
                      selected={serviceKey}
                      onSelect={setServiceKey}
                      onContinue={() => setStep(2)}
                    />
                  )}
                  {step === 2 && <Step2Intake serviceKey={serviceKey} clientInfo={clientInfo} onClientChange={setClientInfo} answers={intakeAnswers} onChange={setIntakeAnswers} uploadedPhotos={uploadedPhotos} onPhotoUpload={setUploadedPhotos} smsOptIn={smsOptIn} onSmsOptInChange={setSmsOptIn} />}
                  {step === 3 && !isConsult && <Step3Addons serviceKey={serviceKey} selectedAddons={selectedAddons} toggleAddon={toggleAddon} dynamicEstimate={dynamicEstimate} />}
                  {step === 4 && !isConsult && <Step4Schedule serviceKey={serviceKey} selectedDate={selectedDate} setSelectedDate={setSelectedDate} selectedTime={selectedTime} setSelectedTime={setSelectedTime} totalDuration={totalDuration} />}
                  {step === 5 && !isConsult && (
                    <Step5Confirm
                      serviceKey={serviceKey}
                      clientInfo={clientInfo}
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      totalDuration={totalDuration}
                      dynamicEstimate={dynamicEstimate}
                      smsOptIn={smsOptIn}
                      setSmsOptIn={setSmsOptIn}
                      onAllAcknowledged={setAllAcknowledged}
                    />
                  )}
                  {step === 6 && !isConsult && !skipDeposit && (
                    <Step6Payment
                      amount={50}
                      bookingData={{ clientInfo, serviceKey, selectedDate, selectedTime, totalDuration }}
                      onSuccess={paymentIntentId => handleSubmit(paymentIntentId)}
                      onCancel={() => setStep(5)}
                      submitting={submitting}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {error && <p className="mt-4 text-sm text-red-500 font-body text-center">{error}</p>}

              {step !== 6 && (
                <div className="flex items-center justify-between mt-10 pt-6 border-t" style={{ borderColor: '#33333314' }}>
                  {step > 1
                    ? <button onClick={() => setStep(s => s - 1)} className="font-body text-sm text-charcoal/40 font-light hover:text-charcoal transition-colors">← Back</button>
                    : <div />}

                  {step === 1 ? <div /> : step < (isConsult ? 2 : 5) ? (
                    <button
                      onClick={() => setStep(s => s + 1)}
                      disabled={!canProceed()}
                      className="text-white font-body text-sm tracking-wide px-8 py-3 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:opacity-90 hover:shadow-lg"
                      style={{ background: '#333333' }}
                    >
                      Continue →
                    </button>
                  ) : (
                    <button
                      onClick={() => isConsult ? handleSubmit() : (skipDeposit ? handleSubmit() : setStep(6))}
                      disabled={submitting || !canProceed() || (!isConsult && !allAcknowledged)}
                      className="text-white font-body text-sm tracking-wide px-10 py-3.5 rounded-full disabled:opacity-50 transition-all duration-300 hover:opacity-90 hover:shadow-lg"
                      style={{ background: '#333333' }}
                    >
                      {submitting
                        ? (isConsult ? 'Sending...' : 'Booking...')
                        : (isConsult ? 'Request My Free Consult →' : (skipDeposit ? 'Complete Booking →' : 'Review & Book →'))}
                    </button>
                  )}
                </div>
              )}
            </div>

            <p className="text-center font-body text-xs text-charcoal/25 font-light mt-6">
              Questions? Text us at (215) 500-3758 or email cleanslateclubpa@gmail.com
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
