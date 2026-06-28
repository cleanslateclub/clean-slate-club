import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { calculateTotalDuration, getDynamicEstimate, timeToMinutes, minutesToTime, TRAVEL_BUFFER, SERVICE_CONFIG } from '@/lib/bookingConfig';
import { validateBookingRequest } from '@/lib/bookingRulesEngine';
import { detectServiceArea, getOutsideAreaMessage } from '@/lib/serviceAreaRules';
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

const getAddonId = (addon = {}) => addon.id || addon.key;
const getFunctionPayload = (result) => result?.data ?? result ?? {};

const sendNonBlockingEmail = (payload, label) => {
  base44.integrations.Core.SendEmail(payload).catch(err => console.error(`${label} email failed:`, err));
};

const notifyTeamNonBlocking = (payload) => {
  base44.functions.invoke('notifyTeamNewBooking', { data: payload }).catch(err => console.error('Team notification failed:', err));
};

const invokeNonBlocking = (functionName, payload, label) => {
  base44.functions.invoke(functionName, { data: payload }).catch(err => console.error(`${label || functionName} failed:`, err));
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
  const [allAcknowledged, setAllAcknowledged] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('skip_deposit') === 'true') setSkipDeposit(true);
  }, []);

  const isConsult = serviceKey === 'consult';

  useEffect(() => {
    if (!isConsult) return;
    base44.functions.invoke('scheduleConsultSlot', {}).then(res => {
      const payload = getFunctionPayload(res);
      if (payload.success) {
        setSelectedDate(payload.date);
        setSelectedTime(payload.time);
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
  const normalizedClientAddress = clientInfo.address || buildServiceAddress(clientInfo);
  const serviceAreaResult = detectServiceArea(normalizedClientAddress);

  const handleServiceSelect = (key) => {
    setServiceKey(key);
    setSelectedAddons([]);
    setSelectedDate(null);
    setSelectedTime(null);
    setAllAcknowledged(false);
    setError(null);
  };

  const toggleAddon = (id) => {
    setSelectedAddons(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const validateBeforePaymentOrSubmit = () => {
    setError(null);
    if (!isConsult && !serviceAreaResult.status.includes('inside_area')) {
      setError(getOutsideAreaMessage());
      return false;
    }

    const endTime = selectedTime ? minutesToTime(timeToMinutes(selectedTime) + totalDuration) : null;
    const result = validateBookingRequest({
      date: selectedDate,
      startTime: selectedTime,
      endTime,
      serviceKey,
      durationMinutes: isConsult ? 15 : totalDuration,
      packageCount: 1,
    });

    if (!result.valid) {
      setError(result.errors[0] || 'This booking needs manual review before it can be submitted.');
      return false;
    }

    return true;
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
      const needsEmergencyContact = serviceKey === 'senior_support' || serviceKey === 'mothers_helper' || serviceKey === 'family_support';
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

  const handleContinue = () => {
    if (step === 2 && !isConsult && serviceAreaResult.status === 'outside_area') {
      setError(getOutsideAreaMessage());
      return;
    }
    setError(null);
    setStep(s => s + 1);
  };

  const handleFinalAction = () => {
    if (!validateBeforePaymentOrSubmit()) return;
    if (isConsult || skipDeposit) {
      handleSubmit();
    } else {
      setStep(6);
    }
  };

  const totalSteps = isConsult ? 2 : (skipDeposit ? 5 : 6);
  const displayStep = step;

  const createBookingTimeBlocks = async ({ booking, endTime, normalizedAddress }) => {
    if (isConsult || !selectedDate || !selectedTime) return true;

    try {
      const blockEnd = minutesToTime(timeToMinutes(endTime) + TRAVEL_BUFFER);
      await base44.entities.TimeBlock.bulkCreate([
        {
          date: selectedDate,
          start_time: selectedTime,
          end_time: endTime,
          booking_id: booking.id,
          block_type: 'booking',
          status: 'active',
          label: `${config?.label} - ${clientInfo.name}`,
          location_address: normalizedAddress,
          is_publicly_bookable: false,
        },
        {
          date: selectedDate,
          start_time: endTime,
          end_time: blockEnd,
          booking_id: booking.id,
          block_type: 'travel',
          status: 'active',
          label: 'Travel buffer',
          travel_minutes: TRAVEL_BUFFER,
        },
      ]);
      return true;
    } catch (timeBlockError) {
      console.error('TimeBlock creation failed after booking was created:', timeBlockError);

      const adminNote = [
        booking.admin_notes || '',
        `BACKEND_REPAIR_NEEDED: timeblock_creation_failed for booking ${booking.id}. Guest may have paid deposit. Error: ${timeBlockError?.message || 'Unknown TimeBlock error'}`,
      ].filter(Boolean).join('\n\n');

      base44.entities.Booking.update(booking.id, {
        admin_notes: adminNote,
        backend_repair_needed: true,
        backend_repair_reason: 'timeblock_creation_failed',
      }).catch(err => console.error('Could not flag booking for TimeBlock repair:', err));

      notifyTeamNonBlocking({
        bookingId: booking.id,
        source: 'public_booking_timeblock_failure',
        note: 'Booking was created, but TimeBlock creation failed. Review and manually repair schedule blocks before launch/confirmation.',
      });

      return false;
    }
  };

  const sendBookingEmails = ({ booking, displayDate, endTime, estimateLow, estimateHigh, addonLabels, normalizedAddress, serviceAddressParts, currentServiceArea, emergencyContact, stripePaymentIntentId }) => {
    const subject = isConsult ? 'We got your consult request - Clean Slate Club' : 'We got your request - Clean Slate Club';
    const serviceLabel = isConsult ? 'Free Consult Call' : config?.label;
    const clientBody = `Hi ${clientInfo.name},<br><br>Thank you for reaching out to Clean Slate Club. ${isConsult ? 'Your free consult request has been received.' : 'Your booking request has been received and your details are being reviewed.'}<br><br><strong>${serviceLabel}</strong><br>${displayDate} at ${selectedTime || 'TBD'}${!isConsult ? ` to ${endTime}` : ''}<br><br>${!isConsult ? `Estimated range: $${estimateLow} - $${estimateHigh}<br>Your deposit will be applied to your final balance.<br><br>` : ''}Questions? Reply to this email or text us at (215) 500-3758.`;

    const adminBody = `New ${isConsult ? 'consult' : 'booking'} request!\n\nClient: ${clientInfo.name}\nEmail: ${clientInfo.email}\nPhone: ${clientInfo.phone}\nAddress: ${normalizedAddress || 'N/A'}\nCity: ${serviceAddressParts.city || 'N/A'}\nZIP: ${serviceAddressParts.zip || 'N/A'}\nService area status: ${currentServiceArea.status}${currentServiceArea.matchedTown ? ` (${currentServiceArea.matchedTown})` : ''}\n\nService: ${serviceLabel}\nDate: ${displayDate}\nTime: ${selectedTime || 'TBD'} - ${isConsult ? 'TBD' : endTime}\nDuration: ${isConsult ? 15 : totalDuration} minutes\nEstimate: $${estimateLow} - $${estimateHigh}\n\nTasks: ${selectedTasks.join(', ') || 'None selected'}\nAdd-ons: ${addonLabels.join(', ') || 'None'}\nEmergency contact: ${emergencyContact.formatted || 'N/A'}\nSpecial notes: ${intakeAnswers.special_notes || intakeAnswers.situation || 'N/A'}\n\nSMS opt-in: ${smsOptIn ? 'Yes' : 'No'}\nStripe Payment Intent: ${stripePaymentIntentId || 'N/A'}\nBooking ID: ${booking.id}\n${uploadedPhotos.length > 0 ? `\nUploaded photos:\n${uploadedPhotos.join('\n')}` : ''}\n\nView in dashboard: https://cleanslateclub.co/admin`;

    sendNonBlockingEmail({ to: clientInfo.email, subject, body: clientBody }, 'Client booking');
    sendNonBlockingEmail({ to: 'cleanslateclubpa@gmail.com', subject: `New ${isConsult ? 'Consult' : 'Booking'} Request - ${clientInfo.name}`, body: adminBody }, 'Admin booking');
  };

  const handleSubmit = useCallback(async (stripePaymentIntentId = null) => {
    setSubmitting(true);
    setError(null);

    try {
      const normalizedAddress = clientInfo.address || buildServiceAddress(clientInfo);
      const currentServiceArea = detectServiceArea(normalizedAddress);
      const serviceAddressParts = {
        street: clientInfo.service_street || '',
        unit: clientInfo.service_unit || '',
        city: clientInfo.service_city || '',
        state: clientInfo.service_state || 'PA',
        zip: clientInfo.service_zip || '',
        formatted: normalizedAddress,
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
        const addon = config?.addons?.find(a => getAddonId(a) === id);
        return sum + (Number(addon?.price) || 0);
      }, 0);
      const estimateLow = dynamicEstimate ? dynamicEstimate.low : (config?.priceRange?.[0] || 0) + addonPrice;
      const estimateHigh = dynamicEstimate ? dynamicEstimate.high : (config?.priceRange?.[1] || 0) + addonPrice;
      const requiresApproval = Boolean(config?.requiresApproval || currentServiceArea.requiresManualReview);
      const addonLabels = selectedAddons
        .map(id => config?.addons?.find(a => getAddonId(a) === id)?.label)
        .filter(Boolean);

      const booking = await base44.entities.Booking.create({
        status: requiresApproval ? 'needs_review' : 'pending',
        booking_source: 'public_booking',
        client_name: clientInfo.name,
        client_email: clientInfo.email,
        client_phone: clientInfo.phone,
        client_address: normalizedAddress || '',
        service_category: isConsult ? 'consult' : serviceKey,
        service_label: isConsult ? 'Free Consult Call' : config?.label,
        scheduled_date: selectedDate || new Date().toISOString().split('T')[0],
        scheduled_start_time: selectedTime || 'TBD',
        scheduled_end_time: isConsult ? 'TBD' : endTime,
        base_duration_minutes: config?.baseMinutes || 0,
        total_duration_minutes: isConsult ? 15 : totalDuration,
        travel_buffer_minutes: isConsult ? 0 : TRAVEL_BUFFER,
        addons: selectedAddons,
        intake_answers: {
          ...intakeAnswers,
          service_address: serviceAddressParts,
          service_area: currentServiceArea,
          emergency_contact_details: emergencyContact,
          uploaded_photos: uploadedPhotos,
          sms_opt_in: smsOptIn,
        },
        special_notes: intakeAnswers.situation || intakeAnswers.special_notes || '',
        estimated_price_low: estimateLow,
        estimated_price_high: estimateHigh,
        deposit_amount: isConsult ? 0 : 50,
        deposit_status: isConsult ? 'not_required' : (stripePaymentIntentId ? 'paid' : 'pending'),
        payment_status: isConsult ? 'unpaid' : (stripePaymentIntentId ? 'deposit_paid' : 'unpaid'),
        payment_intent_id: stripePaymentIntentId || '',
        deposit_payment_intent_id: stripePaymentIntentId || '',
        requires_admin_approval: requiresApproval,
        approval_status: requiresApproval ? 'pending' : 'not_required',
        admin_notes: isConsult
          ? `CONSULT REQUEST - scheduled: ${selectedDate || 'TBD'} at ${selectedTime || 'TBD'} - preferred contact: ${intakeAnswers.preferred_contact || 'N/A'}, availability: ${intakeAnswers.availability_notes || 'N/A'}`
          : `Deposit paid - Stripe ID: ${stripePaymentIntentId || 'N/A'}`,
      });

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

      await createBookingTimeBlocks({ booking, endTime, normalizedAddress });

      sendBookingEmails({
        booking,
        displayDate,
        endTime,
        estimateLow,
        estimateHigh,
        addonLabels,
        normalizedAddress,
        serviceAddressParts,
        currentServiceArea,
        emergencyContact,
        stripePaymentIntentId,
      });

      if (selectedDate && selectedTime) {
        invokeNonBlocking('addBookingToCalendar', {
          clientName: clientInfo.name,
          clientEmail: clientInfo.email,
          clientPhone: clientInfo.phone,
          clientAddress: isConsult ? '' : normalizedAddress,
          serviceLabel: isConsult ? 'Free Consult Call' : config?.label,
          addonLabels,
          selectedDate,
          startTime: selectedTime,
          endTime: isConsult ? minutesToTime(timeToMinutes(selectedTime) + 15) : endTime,
          totalDuration: isConsult ? 15 : totalDuration,
          estimateLow: isConsult ? 0 : estimateLow,
          estimateHigh: isConsult ? 0 : estimateHigh,
          specialNotes: intakeAnswers.special_notes || intakeAnswers.situation || '',
          tasks: selectedTasks,
          sendInviteToClient: true,
          isConsult,
        }, 'Calendar sync');
      }

      invokeNonBlocking('sendClientSmsConfirmation', { bookingId: booking.id }, 'Client SMS');
      notifyTeamNonBlocking({ bookingId: booking.id, source: 'public_booking_submit' });

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
                      onSelect={handleServiceSelect}
                      onContinue={() => setStep(2)}
                    />
                  )}
                  {step === 2 && <Step2Intake serviceKey={serviceKey} clientInfo={clientInfo} onClientChange={setClientInfo} answers={intakeAnswers} onChange={setIntakeAnswers} uploadedPhotos={uploadedPhotos} onPhotoUpload={setUploadedPhotos} smsOptIn={smsOptIn} onSmsOptInChange={setSmsOptIn} />}
                  {step === 3 && !isConsult && <Step3Addons serviceKey={serviceKey} selectedAddons={selectedAddons} toggleAddon={toggleAddon} dynamicEstimate={dynamicEstimate} selectedTasks={selectedTasks} />}
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
                      onClick={handleContinue}
                      disabled={!canProceed()}
                      className="text-white font-body text-sm tracking-wide px-8 py-3 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:opacity-90 hover:shadow-lg"
                      style={{ background: '#333333' }}
                    >
                      Continue →
                    </button>
                  ) : (
                    <button
                      onClick={handleFinalAction}
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
