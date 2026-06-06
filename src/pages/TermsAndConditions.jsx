import React from 'react';
import AnimatedSection from '@/components/shared/AnimatedSection';

const sections = [
  {
    color: '#EB9486',
    title: 'Agreement to Terms',
    body: 'By accessing the Clean Slate Club™ website, submitting a booking request, intake form, contact form, or membership inquiry, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.'
  },
  {
    color: '#CAE7B9',
    title: 'Services Provided',
    body: 'Clean Slate Club™ provides non-medical household support services including home resets, errands, mother\'s helper support, senior companion care, and meal prep services in Montgomery County, PA. Services are rendered by appointment only and are subject to availability.',
    list: [
      'Service scope, tasks, and timing are agreed upon prior to each visit',
      'Clean Slate Club reserves the right to modify or decline service requests outside the agreed scope',
      'All services are non-medical in nature. We do not provide skilled nursing, medication administration, bathing, lifting/transfers, or wound care'
    ]
  },
  {
    color: '#EFB988',
    title: 'Booking & Deposits',
    body: 'All appointments require a $50 non-refundable deposit to secure your booking.',
    list: [
      'Deposits are non-refundable for cancellations made within 24 hours of the scheduled appointment',
      'Rescheduling with at least 48 hours notice is preferred and honored at no penalty',
      'Repeated last-minute cancellations may require full prepayment for future bookings',
      'The remaining service balance is due at or after the completion of each visit'
    ]
  },
  {
    color: '#B58A90',
    title: 'Payment',
    body: 'A valid payment method must be kept on file. By booking, you authorize Clean Slate Club™ to charge the card on file for:',
    list: [
      'Remaining service balance after deposit',
      'Approved additional service time',
      'Late cancellation fees (within 24 hours)',
      'Mileage or travel costs when applicable',
      'Unpaid add-ons or approved purchases made on your behalf'
    ],
    note: 'Clean Slate Club does not advance personal funds for client purchases. Clients must provide prepaid orders or funds for any shopping-related services.'
  },
  {
    color: '#97A7B3',
    title: 'Service Time & Overtime',
    body: 'Each booking includes a set amount of service time. If tasks cannot be completed within the booked time due to household conditions, added requests, access delays, or missing supplies, you will be offered the option to:',
    list: [
      'Book an additional appointment for another day',
      'Approve additional time at $65/hr (members) or $85/hr (non-members), charged to the card on file'
    ],
    note: 'Additional time is not guaranteed and is subject to provider availability.'
  },
  {
    color: '#EB9486',
    title: 'Client Responsibilities',
    body: 'To ensure a successful visit, clients are responsible for:',
    list: [
      'Being present or providing access for the first visit',
      'Having required supplies, products, and materials ready before the appointment',
      'Providing accurate information about the home, household needs, and any special circumstances',
      'Securing pets that may interfere with service',
      'Providing emergency contacts for senior support or mother\'s helper services'
    ]
  },
  {
    color: '#CAE7B9',
    title: 'Service Refusal',
    body: 'Clean Slate Club™ reserves the right to refuse, pause, or terminate service at any time if:',
    list: [
      'The home presents unsafe conditions (biohazards, pests, mold, aggressive animals)',
      'The requested tasks fall outside the agreed service scope',
      'The client engages in harassment or inappropriate behavior',
      'Payment is not provided for required purchases or services',
      'The situation requires licensed medical or professional care'
    ]
  },
  {
    color: '#EFB988',
    title: 'Limitation of Liability',
    body: 'Clean Slate Club™ provides household support services in good faith. To the maximum extent permitted by law:',
    list: [
      'We are not liable for pre-existing damage, wear, or conditions in the home',
      'We are not responsible for outcomes resulting from inaccurate information provided by the client',
      'Our total liability for any claim is limited to the amount paid for the specific service in question'
    ]
  },
  {
    color: '#B58A90',
    title: 'Text Message Communications',
    body: 'By providing a phone number and submitting a booking, contact, intake, or membership form, you agree to receive text communications from Clean Slate Club regarding appointment confirmations, reminders, scheduling updates, cancellations, and customer care. Message frequency varies. Message and data rates may apply. Reply STOP to unsubscribe. View our SMS Terms at cleanslateclub.co/sms-terms.'
  },
  {
    color: '#97A7B3',
    title: 'Changes to Terms',
    body: 'Clean Slate Club™ reserves the right to update these Terms and Conditions at any time. Continued use of our services following any changes constitutes your acceptance of the revised terms. The current version is always available at cleanslateclub.co.'
  },
  {
    color: '#EB9486',
    title: 'Contact',
    body: 'Questions about these terms? Reach us at:',
    list: [
      'Email: cleanslateclubpa@gmail.com',
      'Phone/Text: (206) 825-4061',
      'Service area: Montgomery County, PA'
    ]
  }
];

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-cream pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <AnimatedSection>
          <p className="font-body text-xs tracking-[0.25em] uppercase font-light mb-3 text-coral/60">Legal</p>
          <h1 className="font-heading text-4xl font-semibold text-charcoal mb-2">Terms & Conditions</h1>
          <p className="font-logo text-xl text-coral mb-3">Clean Slate Club™</p>
          <p className="font-body text-sm text-charcoal/50 font-light mb-10">Effective date: May 2026</p>
        </AnimatedSection>

        <div className="space-y-5">
          {sections.map((s, i) => (
            <AnimatedSection key={s.title} delay={i * 0.03}>
              <div className="rounded-2xl bg-warm-white border border-taupe/15 p-6" style={{ borderLeft: `3px solid ${s.color}` }}>
                <h2 className="font-heading text-base font-semibold text-charcoal mb-3">{s.title}</h2>
                <p className="font-body text-sm text-charcoal font-light leading-relaxed">{s.body}</p>
                {s.list && (
                  <ul className="mt-3 space-y-1.5">
                    {s.list.map(item => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style={{ background: s.color }} />
                        <span className="font-body text-sm text-charcoal font-light">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {s.note && (
                  <p className="font-body text-xs font-light leading-relaxed mt-3 italic px-3 py-2 rounded-xl"
                    style={{ color: '#555', background: s.color + '12', borderLeft: `3px solid ${s.color}50` }}>
                    {s.note}
                  </p>
                )}
              </div>
            </AnimatedSection>
          ))}

          <AnimatedSection delay={0.35}>
            <div className="rounded-2xl p-5 text-center" style={{ background: '#fdf6f3', border: '1px solid #fcd5ce40' }}>
              <p className="font-body text-xs text-charcoal/50 font-light">
                Last updated: May 2026 · Clean Slate Club™ · cleanslateclub.co
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}