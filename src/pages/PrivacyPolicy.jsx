import React from 'react';
import AnimatedSection from '@/components/shared/AnimatedSection';

const sections = [
  {
    color: '#EB9486',
    title: 'Information We Collect',
    body: 'When you book a service, submit a form, or contact us, we may collect:',
    list: [
      'Name, email address, phone number, and home address',
      'Service preferences, intake answers, and special instructions',
      'Payment information (processed securely via Stripe — we do not store card details)',
      'Photos you voluntarily upload during the booking process',
      'Emergency contact information for senior support or mother\'s helper services'
    ]
  },
  {
    color: '#CAE7B9',
    title: 'How We Use Your Information',
    body: 'We use the information you provide solely to deliver and improve our services:',
    list: [
      'To schedule, confirm, and manage your appointments',
      'To send appointment reminders, scheduling updates, and service-related communications',
      'To process payments and manage billing',
      'To follow up after visits and improve service quality',
      'To respond to questions or support requests'
    ]
  },
  {
    color: '#EFB988',
    title: 'Text Message Communications',
    body: 'By providing your phone number and submitting a form on our website, you agree to receive text messages from Clean Slate Club regarding appointment confirmations, reminders, scheduling changes, cancellations, and customer care.',
    list: [
      'Message frequency varies based on your booking activity',
      'Message and data rates may apply',
      'Reply STOP to unsubscribe at any time',
      'Reply HELP for assistance or contact us directly',
      'Consent to SMS is not required as a condition of purchase'
    ],
    note: 'Full SMS terms are available at cleanslateclub.co/sms-terms'
  },
  {
    color: '#B58A90',
    title: 'Information Sharing',
    body: 'We do not sell, rent, or trade your personal information. We may share limited information only in these circumstances:',
    list: [
      'With Stripe to process payment transactions securely',
      'With Google Calendar for internal scheduling purposes',
      'As required by law or to protect the safety of our clients and team'
    ],
    note: 'We do not share your phone number or email address with third parties for marketing purposes.'
  },
  {
    color: '#97A7B3',
    title: 'Data Storage & Security',
    body: 'Your information is stored securely using industry-standard practices. We use Stripe for payment processing (PCI-compliant) and do not store raw card numbers. Uploaded photos and service notes are stored securely and accessible only to authorized Clean Slate Club staff.',
    note: 'No method of transmission or storage is 100% secure. While we take reasonable precautions, we cannot guarantee absolute security.'
  },
  {
    color: '#EB9486',
    title: 'Cookies & Analytics',
    body: 'Our website may use basic analytics tools to understand how visitors interact with the site (e.g., pages visited, time on site). We do not use tracking cookies for advertising or retargeting purposes. No personal information is collected through analytics.'
  },
  {
    color: '#CAE7B9',
    title: 'Children\'s Privacy',
    body: 'Our website and services are intended for adults. We do not knowingly collect personal information from individuals under the age of 13. If you believe a child has submitted personal information to us, please contact us and we will remove it promptly.'
  },
  {
    color: '#EFB988',
    title: 'Your Rights',
    body: 'You have the right to:',
    list: [
      'Request a copy of the personal information we hold about you',
      'Request correction of inaccurate information',
      'Request deletion of your data (subject to legal and billing obligations)',
      'Opt out of text message communications at any time by replying STOP',
      'Contact us with any privacy-related questions or concerns'
    ]
  },
  {
    color: '#B58A90',
    title: 'Changes to This Policy',
    body: 'We may update this Privacy Policy from time to time. The current version will always be posted at cleanslateclub.co/privacy-policy. Continued use of our services following any changes constitutes your acceptance of the updated policy.'
  },
  {
    color: '#97A7B3',
    title: 'Contact Us',
    body: 'For questions about this Privacy Policy or how your data is handled, contact us at:',
    list: [
      'Email: cleanslateclubpa@gmail.com',
      'Phone/Text: (206) 825-4061',
      'Service area: Montgomery County, PA'
    ]
  }
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-cream pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <AnimatedSection>
          <p className="font-body text-xs tracking-[0.25em] uppercase font-light mb-3 text-coral/60">Legal</p>
          <h1 className="font-heading text-4xl font-semibold text-charcoal mb-2">Privacy Policy</h1>
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