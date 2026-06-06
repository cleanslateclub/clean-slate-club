import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '@/components/shared/AnimatedSection';

// ── Keep in sync with PrivacyPolicy.jsx ──────────────────────────────────────
const POLICY_DATE = 'May 2026';
// ─────────────────────────────────────────────────────────────────────────────

export default function SmsTerms() {
  return (
    // FIX 2: <main> wrapper for semantic HTML + accessibility
    <main className="min-h-screen bg-cream pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        <AnimatedSection>
          <p className="font-body text-xs tracking-[0.25em] uppercase font-light mb-3 text-coral/60">Legal</p>
          <h1 className="font-heading text-4xl font-semibold text-charcoal mb-2">SMS & Text Message Terms</h1>
          <p className="font-logo text-xl text-coral mb-10">Clean Slate Club™ Messaging Policy</p>
        </AnimatedSection>

        <div className="space-y-6">

          <AnimatedSection>
            <div className="rounded-2xl bg-warm-white border border-taupe/15 p-6" style={{ borderLeft: '3px solid #EB9486' }}>
              <h2 className="font-heading text-base font-semibold text-charcoal mb-3">Program Description</h2>
              <p className="font-body text-sm text-charcoal font-light leading-relaxed mb-3">
                Clean Slate Club uses SMS messaging to communicate appointment reminders, scheduling updates, cancellations, and customer care information.
              </p>
              <p className="font-body text-sm text-charcoal font-light leading-relaxed mb-3">
                Clients opt in to receive text messages by submitting a booking request, contact form, intake form, or membership inquiry through the Clean Slate Club website.
              </p>
              <p className="font-body text-sm text-charcoal font-light leading-relaxed mb-4">
                By providing a phone number and submitting a form, clients agree to receive text communications from Clean Slate Club. Message frequency varies. Message and data rates may apply. Reply <strong>STOP</strong> to unsubscribe at any time.
              </p>
              <p className="font-body text-xs uppercase tracking-widest text-charcoal/40 font-light mb-2">Types of messages may include:</p>
              <ul className="space-y-1.5">
                {[
                  'Appointment confirmations',
                  'Appointment reminders',
                  'Schedule changes or cancellations',
                  'Customer support communication',
                  'Service-related updates',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-coral shrink-0 mt-2" />
                    <span className="font-body text-sm text-charcoal font-light">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.05}>
            <div className="rounded-2xl bg-warm-white border border-taupe/15 p-6" style={{ borderLeft: '3px solid #CAE7B9' }}>
              <h2 className="font-heading text-base font-semibold text-charcoal mb-3">Message Frequency</h2>
              <p className="font-body text-sm text-charcoal font-light leading-relaxed">
                Message frequency varies based on your booking activity. You will typically receive 1–3 messages per booked appointment (confirmation, reminder, and follow-up). You may receive additional messages if scheduling changes occur.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.07}>
            <div className="rounded-2xl bg-warm-white border border-taupe/15 p-6" style={{ borderLeft: '3px solid #EFB988' }}>
              <h2 className="font-heading text-base font-semibold text-charcoal mb-3">Message & Data Rates</h2>
              <p className="font-body text-sm text-charcoal font-light leading-relaxed">
                <strong>Message and data rates may apply.</strong> You are responsible for any charges your mobile carrier applies for receiving text messages. Clean Slate Club™ does not charge a fee for text messages.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.09}>
            <div className="rounded-2xl bg-warm-white border border-taupe/15 p-6" style={{ borderLeft: '3px solid #B58A90' }}>
              <h2 className="font-heading text-base font-semibold text-charcoal mb-3">How to Opt Out</h2>
              <p className="font-body text-sm text-charcoal font-light leading-relaxed mb-3">
                You may opt out of receiving text messages at any time by replying <strong>STOP</strong> to any message you receive from us. After opting out, you will receive one final confirmation message. No further messages will be sent unless you re-opt-in.
              </p>
              <p className="font-body text-sm text-charcoal font-light">
                To re-subscribe, reply <strong>START</strong> or <strong>YES</strong> to our number at any time.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.11}>
            <div className="rounded-2xl bg-warm-white border border-taupe/15 p-6" style={{ borderLeft: '3px solid #97A7B3' }}>
              <h2 className="font-heading text-base font-semibold text-charcoal mb-3">How to Get Help</h2>
              <p className="font-body text-sm text-charcoal font-light leading-relaxed">
                Reply <strong>HELP</strong> to any message for assistance, or contact us directly:
              </p>
              <ul className="mt-3 space-y-1.5">
                {/* FIX 1: Replaced corrupted ?? emoji with explicit unicode */}
                <li className="font-body text-sm text-charcoal font-light">📱 Text or call: <strong>(206) 825-4061</strong></li>
                <li className="font-body text-sm text-charcoal font-light">✉️ Email: <strong>cleanslateclubpa@gmail.com</strong></li>
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.13}>
            <div className="rounded-2xl bg-warm-white border border-taupe/15 p-6" style={{ borderLeft: '3px solid #F3DE8A' }}>
              <h2 className="font-heading text-base font-semibold text-charcoal mb-3">Privacy & Data Use</h2>
              <p className="font-body text-sm text-charcoal font-light leading-relaxed">
                Your mobile phone number and messaging consent are used solely for the purpose of sending you service-related notifications from Clean Slate Club™. We do not sell, rent, or share your phone number or opt-in data with third parties for marketing purposes. Your information is stored securely and used only in connection with your bookings and membership.
              </p>
              <p className="font-body text-sm text-charcoal font-light leading-relaxed mt-3">
                Carriers are not liable for delayed or undelivered messages.
              </p>
              {/* FIX 4: Cross-link to Privacy Policy (TCPA best practice) */}
              <p className="font-body text-sm text-charcoal font-light leading-relaxed mt-3">
                For full details on how we handle your personal information, please review our{' '}
                <Link to="/privacy-policy" className="text-coral underline underline-offset-2 hover:text-coral/70 transition-colors">
                  Privacy Policy
                </Link>.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="rounded-2xl bg-warm-white border border-taupe/15 p-6" style={{ borderLeft: '3px solid #EB9486' }}>
              <h2 className="font-heading text-base font-semibold text-charcoal mb-3">Consent is Not Required for Purchase</h2>
              <p className="font-body text-sm text-charcoal font-light leading-relaxed">
                Consent to receive text messages is <strong>not</strong> a condition of purchasing any service. You may book and receive services from Clean Slate Club™ without opting in to SMS communications.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.17}>
            <div className="rounded-2xl p-5 text-center" style={{ background: '#fdf6f3', border: '1px solid #fcd5ce40' }}>
              {/* FIX 3: POLICY_DATE constant instead of hardcoded string */}
              <p className="font-body text-xs text-charcoal/50 font-light">
                Last updated: {POLICY_DATE} · Clean Slate Club™ · cleanslateclub.co
              </p>
              {/* FIX 5: Removed "Sprint" — merged into T-Mobile in 2020 */}
              <p className="font-body text-xs text-charcoal/40 font-light mt-1">
                Supported carriers include AT&T, T-Mobile, Verizon, and most US carriers. SMS delivery via Twilio.
              </p>
            </div>
          </AnimatedSection>

        </div>
