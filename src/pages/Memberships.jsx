import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '@/components/shared/AnimatedSection';
import PageHero from '@/components/shared/PageHero';
import { base44 } from '@/api/base44Client';

const perks = [
  { label: 'Priority scheduling', detail: 'Book 48hrs before the calendar opens to the public', dot: '#CAE7B9', number: '01' },
  { label: 'Early access hours', detail: 'Book visits starting at 9:00 AM (vs. 10:00 AM standard)', dot: '#DFE3A2', number: '02' },
  { label: 'Reduced overtime rate', detail: '$65/hr for overtime vs. $85/hr standard', dot: '#F3DE8A', number: '03' },
  { label: 'Preferred scheduling', detail: 'Hold recurring time slots on a consistent schedule, up to 3 sessions in a row', dot: '#EFB988', number: '04' },
  { label: 'Monthly check-ins', detail: 'Wellness check-in text from Masha every month', dot: '#EB9486', number: '05' },
  { label: 'Flexible reschedules', detail: 'Easy reschedules with no penalty for members', dot: '#B58A90', number: '06' },
];

const comparisonRows = [
  { feature: 'Booking window opens', member: 'Priority 48hr early', standard: 'Same as public' },
  { feature: 'Start time', member: 'From 9:00 AM', standard: 'From 10:00 AM' },
  { feature: 'Overtime rate', member: '$65/hr', standard: '$85/hr' },
  { feature: 'Recurring slot hold', member: 'Up to 3 sessions', standard: 'Not available' },
];

const STRIPE_CHECKOUT_ORIGIN = 'https://checkout.stripe.com';

export default function Memberships() {
  const [loading, setLoading] = useState(false);
  const [eligibilityMessage, setEligibilityMessage] = useState(null);

  const handleJoin = async () => {
    setLoading(true);
    setEligibilityMessage(null);

    try {
      const user = await base44.auth.me();
      const email = user?.email || '';
      const name = user?.full_name || '';

      if (!email) {
        setEligibilityMessage('Please log in first. Membership opens after your first completed service.');
        return;
      }

      const completedBookings = await base44.entities.Booking.filter({ client_email: email, status: 'completed' }, '-scheduled_date', 1);
      if (!completedBookings || completedBookings.length === 0) {
        setEligibilityMessage('Membership opens after your first completed service. Once you’re eligible, you’ll receive a private invitation to join.');
        return;
      }

      const res = await base44.functions.invoke('createMembershipCheckout', {
        customerEmail: email,
        customerName: name,
        successUrl: `${window.location.origin}/dashboard?membership=success`,
        cancelUrl: `${window.location.origin}/memberships`,
      });

      const checkoutUrl = res?.data?.url;

      if (checkoutUrl && checkoutUrl.startsWith(STRIPE_CHECKOUT_ORIGIN)) {
        window.location.href = checkoutUrl;
      } else {
        setEligibilityMessage('I could not open checkout from here. Please reach out and I’ll help you get set up.');
      }
    } catch (e) {
      console.error('Membership eligibility or checkout error:', e);
      setEligibilityMessage('Please log in first. Membership opens after your first completed service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#F1F1F1' }}>
      <PageHero
        eyebrow="Membership"
        title="Catch-Up Club™"
        script="Stay ahead of the pileup."
        description="Priority booking, preferred hours, and member-only perks."
        background="linear-gradient(135deg, #FDFCFB 0%, #DFE3A266 22%, #CAE7B966 42%, #F3DE8A55 60%, #EFB98855 76%, #EB948655 90%, #B58A9038 100%)"
        waveFill="#F1F1F1"
        scriptColor="#EB9486"
      />

      <section className="max-w-6xl mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-8 lg:gap-12 items-start">
          <AnimatedSection>
            <div className="rounded-[2rem] overflow-hidden border h-full" style={{ background: '#FFFFFFCC', borderColor: '#8B93A740', boxShadow: '0 18px 45px #8B93A715' }}>
              <div className="p-9 lg:p-10 text-center" style={{ background: '#DFE3A266' }}>
                <p className="font-body text-xs tracking-[0.28em] uppercase font-light mb-3" style={{ color: '#33333399' }}>Monthly Membership</p>
                <p className="font-heading text-6xl font-semibold mb-1" style={{ color: '#333333' }}>$49</p>
                <p className="font-body text-sm font-light" style={{ color: '#33333399' }}>per month · cancel anytime</p>
              </div>

              <div className="p-8 lg:p-10">
                <p className="font-heading text-xl font-semibold mb-3" style={{ color: '#333333' }}>For regular backup, not crisis-mode living.</p>
                <p className="font-body text-sm leading-relaxed font-light mb-5" style={{ color: '#333333b3' }}>
                  Membership fee is separate from service costs. Services billed per visit.
                </p>
                <div className="rounded-3xl border p-4 mb-8" style={{ background: '#F7FAF4', borderColor: '#CAE7B970' }}>
                  <p className="font-body text-xs tracking-[0.18em] uppercase font-light mb-2" style={{ color: '#33333399' }}>How access works</p>
                  <p className="font-body text-sm leading-relaxed font-light" style={{ color: '#333333cc' }}>
                    Membership becomes available after your first completed service. Once you’re eligible, you’ll receive a private invitation to join and manage everything from your dashboard.
                  </p>
                </div>

                <button
                  onClick={handleJoin}
                  disabled={loading}
                  className="block w-full text-center font-body text-sm tracking-wide px-8 py-4 rounded-full disabled:opacity-60 transition-all duration-300 hover:shadow-xl"
                  style={{ background: '#333333', color: '#FFFFFF' }}>
                  {loading ? 'Checking eligibility...' : 'Check Eligibility'}
                </button>
                {eligibilityMessage && <p className="text-center font-body text-xs text-red-500 mt-3">{eligibilityMessage}</p>}

                <div className="mt-5 text-center">
                  <Link to="/dashboard" className="font-body text-sm font-light underline underline-offset-4" style={{ color: '#333333' }}>
                    Go to your dashboard
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="rounded-[2rem] border p-7 lg:p-9" style={{ background: '#FFFFFFB8', borderColor: '#8B93A740' }}>
              <p className="font-body text-xs tracking-[0.25em] uppercase font-light mb-5" style={{ color: '#33333399' }}>What’s included</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {perks.map((perk) => (
                  <div key={perk.label} className="rounded-3xl border p-5" style={{ background: `${perk.dot}38`, borderColor: `${perk.dot}70` }}>
                    <div className="flex items-start gap-4">
                      <span className="font-logo text-3xl leading-none" style={{ color: '#33333380' }}>{perk.number}</span>
                      <div>
                        <p className="font-heading text-base font-semibold mb-1" style={{ color: '#333333' }}>{perk.label}</p>
                        <p className="font-body text-sm leading-relaxed font-light" style={{ color: '#333333b3' }}>{perk.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={0.15}>
          <div className="mt-10 rounded-[2rem] p-6 lg:p-8 border overflow-hidden" style={{ background: '#FFFFFFB8', borderColor: '#8B93A755' }}>
            <p className="font-heading text-lg font-semibold mb-2 text-center" style={{ color: '#333333' }}>Members vs. Standard</p>
            <p className="font-body text-sm font-light text-center mb-6" style={{ color: '#33333399' }}>
              A quick look at what changes when you join.
            </p>
            <div className="hidden md:block overflow-hidden rounded-3xl border" style={{ borderColor: '#CAE7B970' }}>
              <div className="grid grid-cols-[1.15fr_1fr_1fr] font-body text-xs tracking-[0.18em] uppercase" style={{ background: '#CAE7B966', color: '#333333' }}>
                <div className="px-5 py-4 font-light">Feature</div>
                <div className="px-5 py-4 font-semibold border-l" style={{ borderColor: '#8B93A733' }}>Member</div>
                <div className="px-5 py-4 font-light border-l" style={{ borderColor: '#8B93A733' }}>Standard</div>
              </div>
              {comparisonRows.map((row, index) => (
                <div key={row.feature} className="grid grid-cols-[1.15fr_1fr_1fr] border-t" style={{ borderColor: '#8B93A733', background: index % 2 === 0 ? '#FFFFFFCC' : '#F7FAF4' }}>
                  <div className="px-5 py-4 font-heading text-sm font-semibold" style={{ color: '#333333' }}>{row.feature}</div>
                  <div className="px-5 py-4 font-body text-sm font-semibold border-l" style={{ color: '#7E7F9A', borderColor: '#8B93A733' }}>{row.member}</div>
                  <div className="px-5 py-4 font-body text-sm font-light border-l" style={{ color: '#33333399', borderColor: '#8B93A733' }}>{row.standard}</div>
                </div>
              ))}
            </div>

            <div className="md:hidden space-y-3">
              {comparisonRows.map((row) => (
                <div key={row.feature} className="rounded-3xl border p-5" style={{ background: '#FFFFFFCC', borderColor: '#CAE7B970' }}>
                  <p className="font-heading text-sm font-semibold mb-4" style={{ color: '#333333' }}>{row.feature}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl p-3" style={{ background: '#CAE7B966' }}>
                      <p className="font-body text-[10px] tracking-[0.18em] uppercase font-light mb-1" style={{ color: '#33333399' }}>Member</p>
                      <p className="font-body text-sm font-semibold" style={{ color: '#7E7F9A' }}>{row.member}</p>
                    </div>
                    <div className="rounded-2xl p-3" style={{ background: '#F1F1F1' }}>
                      <p className="font-body text-[10px] tracking-[0.18em] uppercase font-light mb-1" style={{ color: '#33333399' }}>Standard</p>
                      <p className="font-body text-sm font-light" style={{ color: '#33333399' }}>{row.standard}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <p className="text-center font-body text-xs font-light mt-8" style={{ color: '#33333380' }}>
            Questions? Text us at (215) 500-3758 or email cleanslateclubpa@gmail.com
          </p>
        </AnimatedSection>
      </section>
    </div>
  );
}
