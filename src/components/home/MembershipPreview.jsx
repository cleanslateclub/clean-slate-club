import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../shared/AnimatedSection';

const perks = [
  { label: 'Priority scheduling', detail: 'Book 48hrs before the calendar opens to the public', dot: '#CAE7B9', number: '01' },
  { label: 'Early access hours', detail: 'Book visits starting at 9:00 AM (vs. 10:00 AM standard)', dot: '#EB9486', number: '02' },
  { label: 'Reduced overtime rate', detail: '$65/hr for overtime vs. $85/hr standard', dot: '#EFB988', number: '03' },
  { label: 'Preferred scheduling', detail: 'Hold recurring time slots on a consistent schedule', dot: '#B58A90', number: '04' },
  { label: 'Monthly check-ins', detail: 'Wellness check-in text from Masha every month', dot: '#97A7B3', number: '05' },
  { label: 'Flexible reschedules', detail: 'Easy reschedules with no penalty for members', dot: '#F3DE8A', number: '06' }
];

const withOpacity = (hex, opacity = '66') => `${hex}${opacity}`;

export default function MembershipPreview() {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden" style={{ background: '#F1F1F1' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full" style={{ background: '#CAE7B9' }} />
            <span className="w-2 h-2 rounded-full" style={{ background: '#EFB988' }} />
            <span className="w-2 h-2 rounded-full" style={{ background: '#B58A90' }} />
            <p className="font-body tracking-[0.25em] uppercase font-light text-lg ml-2" style={{ color: '#333333' }}>MEMBERSHIPS</p>
          </div>
          <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-charcoal mb-3">
            Join the <span className="font-logo font-normal" style={{ color: '#EB9486' }}>Catch-Up Club™</span>
          </h2>
          <p className="font-body text-base text-charcoal/65 max-w-xl mx-auto leading-relaxed font-light">
            Recurring support for homes that deserve to stay ahead. Priority booking, member pricing, and seasonal perks.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto">
            <div className="rounded-[2rem] overflow-hidden border shadow-xl relative" style={{ background: '#FFFFFF', borderColor: '#EB948640', boxShadow: '0 18px 45px #B58A9018' }}>
              <div className="p-8 lg:p-10 h-full flex flex-col justify-center text-center" style={{ background: 'linear-gradient(135deg, #EB9486 0%, #EFB988 52%, #F3DE8A 100%)' }}>
                <div className="max-w-sm mx-auto">
                  <p className="font-body text-xs tracking-[0.25em] uppercase font-light mb-5" style={{ color: '#333333' }}>MONTHLY MEMBERSHIP</p>
                  <div className="mb-5">
                    <p className="font-heading text-7xl lg:text-8xl font-semibold leading-none" style={{ color: '#333333' }}>$49</p>
                    <p className="font-body text-sm font-light mt-2" style={{ color: '#333333' }}>per month</p>
                  </div>
                  <p className="font-logo text-2xl mb-5" style={{ color: '#333333' }}>Your shortcut to staying caught up.</p>
                  <p className="font-body text-sm leading-relaxed font-light mx-auto" style={{ color: '#333333cc' }}>
                    For the homes that need a little more predictability, a little more priority, and a lot less scrambling.
                  </p>
                </div>

                <div className="mt-8 rounded-3xl p-5 border max-w-sm mx-auto w-full" style={{ background: '#FFFFFFB3', borderColor: '#FFFFFF99' }}>
                  <p className="font-body text-xs tracking-[0.2em] uppercase mb-2" style={{ color: '#7E7F9A' }}>Member vibe</p>
                  <p className="font-heading text-xl font-semibold leading-tight" style={{ color: '#333333' }}>First dibs. Better windows. Less chaos.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border p-6 lg:p-8 shadow-xl" style={{ background: '#FFFFFF', borderColor: '#7E7F9A25', boxShadow: '0 18px 45px #7E7F9A12' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {perks.map((perk) => (
                  <div key={perk.label} className="rounded-3xl border p-5 relative overflow-hidden" style={{ background: withOpacity(perk.dot), borderColor: perk.dot }}>
                    <span className="absolute top-4 right-4 font-logo text-2xl leading-none" style={{ color: '#33333355' }}>{perk.number}</span>
                    <span className="block w-2 h-2 rounded-full mb-4" style={{ background: perk.dot }} />
                    <p className="font-heading text-base font-semibold mb-1 pr-8" style={{ color: '#333333' }}>{perk.label}</p>
                    <p className="font-body text-xs leading-relaxed font-light" style={{ color: '#333333cc' }}>{perk.detail}</p>
                  </div>
                ))}
              </div>

              <Link
                to="/memberships"
                className="block w-full text-center font-body text-sm tracking-wide px-8 py-4 rounded-full transition-all duration-300 hover:shadow-lg"
                style={{ background: '#333333', color: '#FFFFFF' }}>
                Join The Catch-Up Club™ →
              </Link>
              <p className="text-center font-body text-xs font-light mt-4" style={{ color: '#7a5e50' }}>
                Membership fee is separate from service costs. Services billed per visit. Cancel anytime.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
