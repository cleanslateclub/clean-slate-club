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
        {ack.bullets && ack.bullets.length > 0 && (
          <ul className="mt-2 space-y-1">
            {ack.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="shrink-0 mt-0.5 text-xs" style={{ color: ack.color }}>-</span>
                <span className="font-body text-xs text-charcoal/50 font-light">{bullet}</span>
              </li>
            ))}
          </ul>
        )}
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

  const requiredAcks = [];

  if (isConsult) {
    requiredAcks.push({
      id: 'consult_free',
      color: '#B58A90',
      title: 'Free Consultation Agreement',
      body: 'This is a free 15-minute phone call with no commitment required. A Clean Slate Club team member will call at the scheduled time to discuss needs and provide a custom quote. There is no cost for this consultation.',
      bullets: null
    });
  } else {
    requiredAcks.push({
      id: 'deposits',
      color: '#EB9486',
      title: 'Deposit & Cancellation Policy',
      body: 'A $50 deposit is required to reserve each appointment. Please review the cancellation terms below:',
      bullets: [
        'The deposit is non-refundable if the appointment is cancelled within 24 hours of the scheduled service',
        'Rescheduling with 48+ hours notice will apply the deposit to the next booking',
        'Cancellations with more than 48 hours notice receive a refund within 24-48 hours per the bank schedule',
        'Repeated last-minute cancellations may require full prepayment for all future bookings',
      ]
    });
    requiredAcks.push({
      id: 'time_scope',
      color: '#CAE7B9',
      title: 'Service Time & Scope',
      body: 'Each booking includes a set amount of time. If all tasks cannot be completed within the booked time, there are two options:',
      bullets: [
        'Book an additional visit for another day',
        'Approve extra time at $65/hr (members) or $85/hr (non-members) if the team member is available',
        'Additional time is not guaranteed and depends on team member availability',
        'Delays caused by access issues, missing supplies, or scope changes count toward booked time',
      ]
    });
    requiredAcks.push({
      id: 'scope',
      color: '#7E7F9A',
      title: 'Staying Within the Booked Service',
      body: 'Tasks outside the booked service category may not be completed unless approved in advance. Each service has a defined scope - here are common examples of what falls outside:',
      bullets: [
        'A home reset does not include transportation, a full deep clean, or laundry-only sessions',
        'A grocery run does not include a full pantry overhaul or organization project unless added',
        "Mother's Helper support does not include solo deep cleaning of the home or overnight care",
        'Senior support is companion-style only - not medical, physical, or licensed professional care',
        'Errands do not include furniture moving, home repairs, or heavy lifting',
        'Organization sessions do not include junk hauling, trash removal, or cleaning services',
        'Meal prep does not include grocery shopping unless the grocery run add-on is selected',
        'Child support does not include overnight stays, medical decisions, or emergency care',
        'No service includes work requiring a licensed contractor, plumber, electrician, or medical professional',
      ]
    });
    requiredAcks.push({
      id: 'supplies',
      color: '#F3DE8A',
      title: 'Supplies & Products',
      // FIX: Reworded to reflect that team arrives prepared with their own supplies.
      // Clients choose whether to use team supplies, their own, or a mix - just communicate preference.
      body: 'Clean Slate Club team members arrive equipped with professional supplies and are ready to get to work. Clients are also welcome to have preferred household products available - just let the team know in advance whether to use the team\'s supplies, the client\'s own preferred items, or a mix of both. If specialty items must be sourced during the visit, that travel time counts toward the booked service.',
      bullets: [
        'If specific brands or preferred products should be used, note this in the booking or ahead of the visit',
        'Organization bins, labels, dividers, hangers, and baskets should be on hand for all sort & organize services',
        'Laundry detergent, fabric softener, or dryer sheet brand preferences should be noted if applicable',
        'Meal prep containers, reusable grocery bags, and specialty cooking items if preferred',
        'Pet food, litter, and feeding supplies specific to each pet\'s needs',
        'Plant care instructions and any specialty watering tools or fertilizers',
        'Specialty or hard-to-find grocery items that require a specific store',
        'If no preference is noted, the team will use their own standard professional supplies',
      ]
    });
    requiredAcks.push({
      id: 'payment',
      color: '#EFB988',
      title: 'Payment Authorization',
      body: 'A valid card must be kept on file for all appointments. The card on file may be charged for:',
      bullets: [
        'Remaining service balance after the visit',
        'Approved additional time at the applicable hourly rate',
        'Late cancellation fees when applicable',
        'Mileage for qualifying services (errands, transportation, senior support)',
        'Any unpaid add-ons selected during booking',
        'Buy Now, Pay Later options may be available through Affirm, Klarna, or similar providers',
      ]
    });
    requiredAcks.push({
      id: 'nonmedical',
      color: '#B58A90',
      title: 'Non-Medical Support',
      body: 'Clean Slate Club provides non-medical household, family, senior, errand, and lifestyle support only - the kind of help a trusted friend might offer. The following are never included under any service:',
      bullets: [
        'Medical care, diagnosis, assessment, or treatment of any kind',
        'Medication administration, management, or reminders',
        'Bathing, toileting, or personal hygiene assistance',
        'Lifting, transferring, or physically repositioning a person',
        'Wound care, catheter care, injections, or skilled nursing',
        'Emergency medical response or crisis intervention',
        'Any task requiring a licensed medical or healthcare professional',
      ]
    });
    requiredAcks.push({
      id: 'access_safety',
      color: '#CAE7B9',
      title: 'First Visit Access',
      body: 'For the initial visit, someone must be home to grant access and provide a walkthrough. If a team member cannot access the property at the scheduled start time, service time begins regardless. Please be prepared to share:',
      bullets: [
        'Where supplies are kept and which areas are priority',
        'Pet instructions and where pets will be during the visit',
        "Children's or senior care preferences, routines, and restrictions",
        'Parking location, building entry, alarm codes, and lock details',
        'Any off-limits areas, special preferences, or important household notes',
        'After the first visit, future access arrangements may be discussed with the team',
      ]
    });
    requiredAcks.push({
      id: 'unsafe_conditions',
      color: '#EB9486',
      title: 'Safety & Service Refusal',
      body: 'Clean Slate Club reserves the right to refuse or immediately stop service if unsafe or out-of-scope conditions are present. Situations that may result in service refusal or stoppage include:',
      bullets: [
        'Biohazards, active pest infestation, mold, or hazardous waste',
        'Aggressive pets that cannot be secured away from team members',
        'Harassment of any kind toward a team member',
        'Heavy lifting or physical demands beyond safe and reasonable limits',
        'Requests that fall outside the agreed scope of the booked service',
        'Lack of payment or funds required for approved purchases',
        'Unsafe driving conditions during transportation services',
        'Situations requiring medical licenses, emergency professionals, or licensed contractors',
      ]
    });

    if (intake.transportation_needed && intake.transportation_needed !== 'No') {
      requiredAcks.push({
        id: 'transportation',
        color: '#EB9486',
        title: 'Transportation Waiver',
        body: 'Transportation services require advance arrangement and verified destination details.',
        bullets: [
          'A verified destination address is required before transport begins',
          'A car seat or booster seat must be installed when transporting minors',
          'The team member may decline service in unsafe or hazardous driving conditions',
          'Transportation does not include moving household furniture or large items',
          'Any detours or unplanned stops must be approved before departure',
        ]
      });
    }
    if (intake.num_children && intake.num_children !== 'None' && intake.num_children !== '0') {
      requiredAcks.push({
        id: 'child_safety',
        color: '#EFB988',
        title: 'Child Safety Acknowledgement',
        body: 'For child, family, or senior support services, all relevant information must be provided before the visit. Team members are not licensed childcare workers or medical professionals.',
        bullets: [
          'Emergency contact name, relationship, and phone number are required',
          'Known allergies, medications present in the home, and medical considerations must be disclosed',
          'Behavioral needs, sensitivities, and comfort preferences should be noted',
          'Pickup/drop-off instructions and approved contacts must be confirmed in advance',
          'Car seat or booster seat access and installation must be arranged if transportation is involved',
          'Approved daily routines, meal preferences, and schedules should be shared',
        ]
      });
    }
    if (serviceKey === 'senior_support') {
      requiredAcks.push({
        id: 'senior_nonmedical',
        color: '#B58A90',
        title: 'Senior Non-Medical Acknowledgement',
        body: 'Clean Slate Club provides companion-style senior support only. The following are not available under any senior support service:',
        bullets: [
          'Medication administration, management, or reminders of any kind',
          'Bathing, toileting, or personal hygiene assistance',
          'Lifting, transferring, or physically repositioning the client',
          'Wound care, catheter care, injections, or skilled nursing',
          'Emergency medical response or overnight stays',
          'Professional medical monitoring or health assessments',
        ]
      });
    }
    if (intake.has_pets && intake.has_pets !== 'No') {
      requiredAcks.push({
        id: 'pets',
        color: '#CAE7B9',
        title: 'Pet Disclosure & Safety',
        body: 'All pets in the home must be disclosed prior to the visit. Team members may stop service if a pet creates an unsafe situation.',
        bullets: [
          'Aggressive or unpredictable pets must be secured in a separate room or crate before arrival',
          'Escape-prone pets should be confined before the team member arrives',
          'All pets must be disclosed even if they are typically calm or friendly',
          'Pet feeding, water refresh, litter refresh, and short walks may be available as add-ons when arranged in advance',
          'Team members are not responsible for pets that escape when doors are opened during service',
        ]
      });
    }
    if (intake.parent_present === 'No - full solo support needed') {
      requiredAcks.push({
        id: 'property_access',
        color: '#7E7F9A',
        title: 'Property Access Authorization',
        body: 'Clean Slate Club is authorized to access the property without the client present to complete the booked service.',
        bullets: [
          'Alarm codes, key locations, or lockbox details must be provided in advance',
          'Team members will only access areas needed for the booked service',
          'No third parties will be granted access to the property by the team member',
          'Clean Slate Club is not responsible for damage caused by pre-existing conditions in the home',
        ]
      });
    }
    if (selectedAddons.some(id => config.addons.find(a => a.id === id)?.requiresFunds)) {
      requiredAcks.push({
        id: 'purchasing',
        color: '#EB9486',
        title: 'Purchasing & Funds Acknowledgement',
        body: 'This service includes shopping or purchases. Prepaid funds must be provided before any purchases are made. Clean Slate Club does not advance personal funds under any circumstances.',
        bullets: [
          'Preferred method: a prepaid grocery pickup order placed by the client',
          'Acceptable alternatives: Zelle transfer or cash provided before shopping begins',
          'If adequate funds are not provided, the shopping portion may not be completed',
          'Booked service time is still billable even if purchases cannot be made',
          'Any leftover funds will be returned at the end of the visit with a receipt',
        ]
      });
    }
  }

  if (smsOptIn) {
    requiredAcks.push({
      id: 'sms',
      color: '#CAE7B9',
      title: 'Text Message Consent',
      body: 'By providing a phone number, the client agrees to receive text messages from Clean Slate Club for:',
      bullets: [
        'Appointment confirmations and upcoming visit reminders',
        'Schedule changes, rescheduling notices, or cancellations',
        'Customer care and follow-up communications',
        'Message frequency varies - msg & data rates may apply',
        'Reply STOP at any time to unsubscribe - consent is not required as a condition of purchase',
      ]
    });
  }

  const allChecked = requiredAcks.length === 0 || requiredAcks.every(a => checks[a.id]);

  useEffect(() => {
    onAllAcknowledged?.(allChecked);
  }, [allChecked]); // eslint-disable-line react-hooks/exhaustive-deps

  const showEmergency = (serviceKey === 'mothers_helper' || serviceKey === 'senior_support') && intake.emergency_contact;
  const emergencyPhone = showEmergency ? extractPhone(intake.emergency_contact) : null;

  // CONSULT VIEW
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
              <p className="font-body text-sm text-charcoal/60 font-light">{selectedTime} - 15-minute call</p>
              <p className="font-body text-xs text-charcoal/40 font-light mt-1">A team member will call at {clientInfo.phone} at the time above.</p>
            </div>
          )}
          <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal font-light mb-2">Your Info</p>
            <p className="font-body text-sm text-charcoal font-light">{clientInfo.name}</p>
            <p className="font-body text-sm text-charcoal font-light">{clientInfo.email} - {clientInfo.phone}</p>
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
              <p className="font-body text-sm text-charcoal font-light">{uploadedPhotos.length} file{uploadedPhotos.length > 1 ? 's' : ''} attached - the team will review before the call.</p>
            </div>
          )}
          <div className="bg-sage/10 border border-sage/20 rounded-2xl p-5">
            <p className="font-body text-sm text-charcoal font-light leading-relaxed">
              <strong className="font-normal text-charcoal/90">100% free. Zero commitment.</strong> This is just a conversation - the team will listen, figure out what is needed, and provide a custom quote. No pressure, ever.
            </p>
          </div>
          {requiredAcks.length > 0 && (
            <div className="space-y-3">
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light">Please Acknowledge</p>
              {requiredAcks.map(ack => (
                <AckCard key={ack.id} ack={ack} checked={!!checks[ack.id]} onToggle={() => toggleCheck(ack.id)} />
              ))}
              {!allChecked && <p className="font-body text-xs text-coral/70 font-light text-center">Please confirm all acknowledgements above to proceed.</p>}
            </div>
          )}
        </div>
      </div>
    );
  }

  // NON-CONSULT VIEW
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
      <p className="font-body text-sm text-charcoal font-light mb-8">Review the booking details and confirm each acknowledgement below to proceed.</p>
      <div className="space-y-4">

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

        <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal font-light mb-2">Schedule</p>
          <p className="font-heading text-base font-semibold text-charcoal mb-3">{displayDate}</p>
          <div className="space-y-2">
            <div className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-sage shrink-0" /><span className="font-body text-xs text-charcoal font-light">{meetTime} - Meet & greet (15 min)</span></div>
            <div className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-coral shrink-0" /><span className="font-body text-xs text-charcoal font-light">{serviceStart} - Service begins</span></div>
            <div className="flex items-center gap-3"><span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#EFB988' }} /><span className="font-body text-xs text-charcoal font-light">{wrapStart} - Wrap-up & supply collection (15 min)</span></div>
            <div className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-taupe shrink-0" /><span className="font-body text-xs text-charcoal font-light">{endTime} - Estimated end</span></div>
          </div>
          <p className="font-body text-[11px] text-charcoal font-light mt-2">Total: {(totalDuration / 60).toFixed(1)} hours</p>
        </div>

        <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal font-light mb-2">Your Info</p>
          <p className="font-body text-sm text-charcoal font-light">{clientInfo.name}</p>
          <p className="font-body text-sm text-charcoal font-light">{clientInfo.email} - {clientInfo.phone}</p>
          <p className="font-body text-sm text-charcoal font-light">{clientInfo.address}</p>
        </div>

        {showEmergency && (
          <div className="rounded-2xl border-2 border-coral/25 overflow-hidden" style={{ background: '#fff8f7' }}>
            <div className="px-5 pt-4 pb-2">
              <p className="font-body text-[10px] uppercase tracking-widest text-coral/60 font-light mb-1">Emergency Contact</p>
              <p className="font-body text-sm text-charcoal font-light">{intake.emergency_contact}</p>
              <p className="font-body text-[11px] text-charcoal/40 font-light mt-1">Accessible to the team member during the visit.</p>
            </div>
            {emergencyPhone && (
              <a href={`tel:${emergencyPhone}`} className="flex items-center justify-center gap-2 w-full py-3 bg-coral text-white font-body text-sm tracking-wide hover:bg-coral/90 transition-all">
                <Phone className="w-4 h-4" />
                Tap to Call Emergency Contact
              </a>
            )}
          </div>
        )}

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

        <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 font-light mb-2">Additional Time Authorization</p>
          <p className="font-body text-xs text-charcoal/60 font-light mb-3 leading-relaxed">If more time is needed to complete all requested tasks, may the team extend the appointment?</p>
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
              Additional time billed at <span className="text-coral">$65/hr (members)</span> or <span className="text-coral">$85/hr (non-members)</span>. The team will always notify before extending.
            </p>
          )}
        </div>

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
                <p className="font-body text-xs text-charcoal/50 font-light">All acknowledgements confirmed. Ready to proceed.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
