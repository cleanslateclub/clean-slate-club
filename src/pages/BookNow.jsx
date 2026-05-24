import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { calculateTotalDuration, timeToMinutes, minutesToTime, TRAVEL_BUFFER, SERVICE_CONFIG } from '@/lib/bookingConfig';
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
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const totalDuration = serviceKey ? calculateTotalDuration(serviceKey, selectedAddons) : 0;
  const config = serviceKey ? SERVICE_CONFIG[serviceKey] : null;

  const toggleAddon = (id) => {
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const canProceed = () => {
    if (step === 1) return !!serviceKey;
    if (step === 2) return clientInfo.name && clientInfo.email && clientInfo.phone && clientInfo.address;
    if (step === 3) return true;
    if (step === 4) return !!selectedDate && !!selectedTime;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const endTime = minutesToTime(timeToMinutes(selectedTime) + totalDuration);
      const addonPrice = selectedAddons.reduce((sum, id) => {
        const addon = config.addons.find(a => a.id === id);
        return sum + (addon ? addon.price : 0);
      }, 0);

      const booking = await base44.entities.Booking.create({
        status: 'pending',
        client_name: clientInfo.name,
        client_email: clientInfo.email,
        client_phone: clientInfo.phone,
        client_address: clientInfo.address,
        service_category: serviceKey,
        scheduled_date: selectedDate,
        scheduled_start_time: selectedTime,
        scheduled_end_time: endTime,
        base_duration_minutes: config.baseMinutes,
        total_duration_minutes: totalDuration,
        addons: selectedAddons,
        intake_answers: intakeAnswers,
        special_notes: intakeAnswers.special_notes || '',
        estimated_price_low: config.priceRange[0] + addonPrice,
        estimated_price_high: config.priceRange[1] + addonPrice,
      });

      // Create time blocks
      const blockEnd = minutesToTime(timeToMinutes(endTime) + TRAVEL_BUFFER);
      await base44.entities.TimeBlock.bulkCreate([
        { date: selectedDate, start_time: selectedTime, end_time: endTime, booking_id: booking.id, block_type: 'booking', label: `${config.label} — ${clientInfo.name}` },
        { date: selectedDate, start_time: endTime, end_time: blockEnd, booking_id: booking.id, block_type: 'travel', label: 'Travel buffer' },
      ]);

      // Send confirmation email
      const addonLabels = selectedAddons.map(id => config.addons.find(a => a.id === id)?.label).filter(Boolean);
      const displayDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

      await base44.integrations.Core.SendEmail({
        to: clientInfo.email,
        subject: `Your Clean Slate Club™ booking is confirmed — ${displayDate}`,
        body: `Hi ${clientInfo.name},\n\nYour booking is confirmed! Here are your details:\n\nService: ${config.label}\nDate: ${displayDate}\nTime: ${selectedTime} – ${endTime}\n${addonLabels.length > 0 ? `Add-ons: ${addonLabels.join(', ')}\n` : ''}\nAddress: ${clientInfo.address}\n\nYour visit includes:\n• ${selectedTime} — Meet & greet (15 min)\n• Service + all selected add-ons\n• Wrap-up & supply collection (15 min)\n\nEstimated total: $${config.priceRange[0] + addonPrice}–$${config.priceRange[1] + addonPrice}\n\nQuestions? Reply to this email anytime. We can't wait to help.\n\nWith care,\nMasha\nClean Slate Club™`
      });

      // Notify Masha
      await base44.integrations.Core.SendEmail({
        to: 'masha@cleanslateclubpa.com',
        subject: `New Booking: ${config.label} — ${clientInfo.name} on ${displayDate}`,
        body: `New booking submitted!\n\nClient: ${clientInfo.name}\nEmail: ${clientInfo.email}\nPhone: ${clientInfo.phone}\nAddress: ${clientInfo.address}\n\nService: ${config.label}\nDate: ${displayDate}\nTime: ${selectedTime} – ${endTime}\nTotal duration: ${(totalDuration / 60).toFixed(1)} hrs\n${addonLabels.length > 0 ? `Add-ons: ${addonLabels.join(', ')}\n` : ''}\nEstimated: $${config.priceRange[0] + addonPrice}–$${config.priceRange[1] + addonPrice}\n\nIntake Notes:\n${JSON.stringify(intakeAnswers, null, 2)}\n\nView in dashboard: https://cleanslateclubpa.com/admin`
      });

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
          <h1 className="font-heading text-3xl font-semibold text-charcoal mb-3">You're booked!</h1>
          <p className="font-logo text-xl text-coral mb-4">Consider it handled.</p>
          <p className="font-body text-sm text-charcoal/50 font-light leading-relaxed mb-8">
            A confirmation email is on its way to <strong>{clientInfo.email}</strong>. Masha will see you on {selectedDate && new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}.
          </p>
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

          <StepIndicator currentStep={step} />

          <div className="bg-warm-white rounded-3xl border border-taupe/15 shadow-sm p-7 sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {step === 1 && <Step1Service selected={serviceKey} onSelect={k => { setServiceKey(k); setSelectedAddons([]); setIntakeAnswers({}); }} />}
                {step === 2 && <Step2Intake serviceKey={serviceKey} answers={intakeAnswers} onChange={setIntakeAnswers} clientInfo={clientInfo} onClientChange={setClientInfo} />}
                {step === 3 && <Step3Addons serviceKey={serviceKey} selectedAddons={selectedAddons} onToggle={toggleAddon} />}
                {step === 4 && <Step4Schedule totalDuration={totalDuration} selectedDate={selectedDate} selectedTime={selectedTime} onSelect={(d, t) => { setSelectedDate(d); setSelectedTime(t); }} />}
                {step === 5 && <Step5Confirm serviceKey={serviceKey} clientInfo={clientInfo} intakeAnswers={intakeAnswers} selectedAddons={selectedAddons} selectedDate={selectedDate} selectedTime={selectedTime} totalDuration={totalDuration} />}
              </motion.div>
            </AnimatePresence>

            {error && <p className="mt-4 text-sm text-red-500 font-body text-center">{error}</p>}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-taupe/10">
              {step > 1 ? (
                <button onClick={() => setStep(s => s - 1)} className="font-body text-sm text-charcoal/40 font-light hover:text-coral transition-colors">← Back</button>
              ) : <div />}

              {step < 5 ? (
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
                  {submitting ? 'Booking...' : 'Confirm Booking'}
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