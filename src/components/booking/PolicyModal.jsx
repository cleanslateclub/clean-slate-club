import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const sections = [
  {
    title: 'First Visit Access',
    color: '#EB9486',
    body: 'For the initial visit, someone must be home to let the service provider in, give a quick walkthrough, and explain any important household details.',
    list: ['Where supplies are kept', 'What rooms or areas are priority', 'Pet instructions', "Children's or senior care instructions", 'Parking/access details', 'Any special preferences or restrictions'],
    note: 'After the first visit, future access arrangements may be discussed.',
  },
  {
    title: 'Supplies & Materials',
    color: '#EFB988',
    body: 'Clients are responsible for having any household-specific supplies or materials ready before the appointment.',
    list: ['Cleaning supplies', 'Laundry detergent', 'Trash bags', 'Organization bins, labels, hangers', 'Meal prep containers', 'Grocery bags, specialty products', 'Pet food', 'Plant care instructions'],
    note: 'If supplies are not available and the provider needs to shop for them, that travel and shopping time will count toward your booked service time.',
  },
  {
    title: 'Grocery Runs & Shopping',
    color: '#CAE7B9',
    body: 'For grocery runs, we strongly prefer that clients place grocery pickup orders ahead of time based on their preferences.',
    list: ['A prepaid grocery order', 'Zelle transfer at checkout'],
    listLabel: 'Acceptable payment options:',
    note: 'If adequate funds are not provided for requested purchases, the shopping portion of the service may not be completed and the booked time is still billable. Clean Slate Club does not advance personal funds for client purchases.',
  },
  {
    title: 'Service Time & Scope',
    color: '#B58A90',
    body: 'Each package includes a set amount of time. If everything cannot be completed within the booked time due to household condition, added requests, missing supplies, access delays, or other unforeseen circumstances, you will have two options:',
    list: ['Book an additional package for another day', 'Approve additional time at $65/hr (members) or $85/hr (non-members), charged to the card on file'],
    note: 'Additional time is not guaranteed and depends on provider availability.',
  },
  {
    title: 'Staying Within the Service',
    color: '#EB9486',
    body: 'Please choose the service that best matches what you need. Tasks outside the booked category may not be completed unless approved ahead of time.',
    list: ['A home reset does not automatically include transportation', 'A grocery run does not include a full pantry overhaul unless added', "Mother's helper support does not include deep cleaning", 'Senior support is companion-style and non-medical'],
  },
  {
    title: 'Non-Medical Support',
    color: '#97A7B3',
    body: 'Clean Slate Club provides the kind of help you might ask a trusted friend or family member for.',
    list: ['Companionship', 'Light household help', 'Meal support & errands', 'Transportation', 'Help getting settled comfortably', 'Help with shoes, socks, jackets, or simple daily comfort needs'],
    note: 'Clean Slate Club does not provide medical care, medication administration, bathing, lifting/transfers, wound care, or skilled nursing services.',
  },
  {
    title: 'Cancellations & Deposits',
    color: '#EFB988',
    body: 'All services require a $50 deposit to reserve your appointment.',
    list: ['The $50 deposit is non-refundable if cancelled within 24 hours of service', 'Rescheduling with at least 48 hours notice is strongly preferred', 'Repeated last-minute cancellations may require full prepayment for future bookings'],
  },
  {
    title: 'Access Delays',
    color: '#EB9486',
    body: 'If the provider arrives and cannot access the home, the appointment time begins at the scheduled start time.',
    note: 'If access cannot be provided within a reasonable window, the service may be forfeited and the deposit will not be refunded.',
  },
  {
    title: 'Pets',
    color: '#CAE7B9',
    body: 'Please let us know ahead of time if pets will be in the home. Pets should be secured if they are anxious, aggressive, prone to escaping, or may interfere with the service.',
    list: ['Pet feeding', 'Water refresh', 'Litter refresh', 'Short walks (as add-ons when discussed in advance)'],
    listLabel: 'May be available:',
  },
  {
    title: 'Children & Senior Care',
    color: '#B58A90',
    body: 'For child, family, or senior support services, all relevant information must be provided before the appointment.',
    list: ['Emergency contacts', 'Allergies & mobility concerns', 'Behavioral needs', 'Pickup/drop-off details', 'Approved transportation instructions', 'Access to car seats/booster seats', 'Medications present in the home', 'Routines and preferences'],
    note: 'Clean Slate Club reserves the right to decline or stop service if the situation is unsafe, outside the agreed scope, or requires medical/licensed care.',
  },
  {
    title: 'Safety & Service Refusal',
    color: '#EB9486',
    body: 'Clean Slate Club may refuse or end a service if the home or request presents unsafe conditions.',
    list: ['Biohazards, pest infestation, or mold concerns', 'Aggressive pets', 'Unsafe driving conditions or harassment', 'Heavy lifting beyond reasonable limits', 'Requests outside the agreed scope', 'Lack of payment for required purchases'],
  },
  {
    title: 'Payment',
    color: '#EFB988',
    body: 'A valid card must be kept on file for all appointments. The card on file may be charged for:',
    list: ['Remaining service balance', 'Approved additional time', 'Late cancellation fees', 'Mileage', 'Unpaid add-ons'],
    note: 'Buy Now, Pay Later options may be available through Affirm, Klarna, or similar providers when available.',
  },
];

const agreementText = 'I understand that all services require a $50 deposit. I understand that cancellations within 24 hours may forfeit the deposit. I understand that supplies and materials specific to my service must be available before the appointment, and that time spent sourcing missing items counts toward my booked service time. I understand that if my requested tasks exceed the booked time, I may either book an additional visit or approve extra time at $65/hr (members) or $85/hr (non-members) if available. I understand that Clean Slate Club provides non-medical household, family, senior, errand, and lifestyle support only.';

export default function PolicyModal({ onAgree, onClose }) {
  const [agreed, setAgreed] = useState(false);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
        style={{ background: 'rgba(51,51,51,0.55)', backdropFilter: 'blur(6px)' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl"
          style={{ background: '#fdfcfb' }}
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-6 shrink-0 text-center relative" style={{ background: 'linear-gradient(135deg, #EB9486 0%, #fcd5ce 60%, #ece4db 100%)' }}>
            {onClose && (
              <button onClick={onClose} className="absolute top-5 right-5 p-1.5 rounded-full transition-colors" style={{ color: '#33333380' }}>
                <X size={18} />
              </button>
            )}
            <p className="font-body text-[10px] tracking-[0.25em] uppercase font-light mb-1" style={{ color: '#33333360' }}>Required reading</p>
            <h2 className="font-logo text-3xl mb-2" style={{ color: '#333333' }}>Before You Book</h2>
            <p className="font-body text-sm font-light leading-relaxed mx-auto max-w-lg" style={{ color: '#333333cc' }}>
              Clean Slate Club is designed to make life feel lighter, calmer, and more manageable. Please review our booking policies before proceeding to your deposit.
            </p>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1 px-8 py-7 space-y-6">
            {sections.map((section) => (
              <div key={section.title} className="rounded-2xl border border-taupe/20 p-5" style={{ background: '#fff' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: section.color }} />
                  <h3 className="font-heading text-sm font-semibold text-charcoal tracking-wide">{section.title}</h3>
                </div>
                {section.body && <p className="font-body text-sm font-light leading-relaxed mb-2" style={{ color: '#333333' }}>{section.body}</p>}
                {section.listLabel && <p className="font-body text-xs font-light mb-1.5 uppercase tracking-widest" style={{ color: '#666' }}>{section.listLabel}</p>}
                {section.list && (
                  <ul className="space-y-1 mb-2">
                    {section.list.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style={{ background: section.color }} />
                        <span className="font-body text-sm font-light leading-relaxed" style={{ color: '#333333' }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.note && (
                  <p className="font-body text-xs font-light leading-relaxed mt-2 italic px-3 py-2 rounded-xl" style={{ color: '#555', background: section.color + '12', borderLeft: `3px solid ${section.color}50` }}>{section.note}</p>
                )}
              </div>
            ))}

            {/* Agreement box */}
            <div className="rounded-2xl border-2 border-coral/30 p-5" style={{ background: 'linear-gradient(135deg, #fef0ee 0%, #fdfcfb 100%)' }}>
              <p className="font-body text-[10px] tracking-[0.2em] uppercase font-light mb-3" style={{ color: '#EB9486' }}>Final Agreement</p>
              <p className="font-body text-sm font-light leading-relaxed mb-5" style={{ color: '#333333' }}>{agreementText}</p>
              <label className="flex items-start gap-3 cursor-pointer group">
                <div
                  onClick={() => setAgreed(!agreed)}
                  className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${agreed ? 'bg-coral border-coral' : 'border-taupe bg-white group-hover:border-coral/40'}`}
                >
                  {agreed && <span className="text-white text-xs font-bold">✓</span>}
                </div>
                <span className="font-body text-sm font-light leading-relaxed select-none" style={{ color: '#333333' }}>
                  I have read and agree to the <strong className="font-semibold" style={{ color: '#333333' }}>Clean Slate Club booking policies</strong>.
                </span>
              </label>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="px-8 py-5 border-t border-taupe/10 shrink-0 flex justify-between items-center" style={{ background: '#fdfcfb' }}>
            {onClose ? (
              <button onClick={onClose} className="font-body text-sm font-light hover:text-coral transition-colors px-4 py-3" style={{ color: '#666' }}>
                Cancel
              </button>
            ) : <div />}
            <button
              onClick={() => agreed && onAgree()}
              disabled={!agreed}
              className="text-white font-body text-sm tracking-wide px-10 py-3.5 rounded-full transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: agreed ? 'linear-gradient(to right, #EB9486, #fcd5ce)' : '#ccc' }}
            >
              Proceed to Deposit →
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}