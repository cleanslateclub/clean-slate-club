import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../shared/AnimatedSection';

const perks = [
  { label: 'Priority scheduling', detail: 'Book 48hrs before the calendar opens to the public', dot: '#CAE7B9', number: '01' },
  { label: 'Early access hours', detail: 'Book visits starting at 9:00 AM (vs. 10:00 AM standard)', dot: '#EB9486', number: '02' },
  { label: 'Reduced overtime rate', detail: '$65/hr for overtime vs. $85/hr standard', dot: '#EFB988', number: '03' },
  { label: 'Recurring scheduling', detail: 'Hold recurring time slots on a consistent schedule', dot: '#B58A90', number: '04' },
  { label: 'Monthly check-ins', detail: 'A quick monthly touchpoint to plan what support would help most', dot: '#97A7B3', number: '05' },
  { label: 'Flexible reschedules', detail: 'Easy reschedules with no penalty for members', dot: '#F3DE8A', number: '06' }
];

const withOpacity = (hex, opacity = '66') => `${hex}${opacity}`;

function MembershipLogoTitle() {
  return (
    <div className="mb-4 flex flex-wrap items-baseline gap-2">
      <span className="font-heading text-sm md:text-base font-semibold tracking-[0.22em] uppercase text-charcoal">Clean Slate</span>
      <span className="font-logo text-3xl md:text-4xl" style={{ color: '#EB9486', lineHeight: 1 }}>Club</span>
      <span className="font-heading text-2xl font-semibold" style={{ color: '#333333' }}>Membership</span>
    </div>
  );
}

export default function MembershipPreview() {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden" style={{ background: '#EAF1EC' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full" style={{ background: '#CAE7B9' }} />
            <span className="w-2 h-2 rounded-full" style={{ background: '#EFB988' }} />
            <span className="w-2 h-2 rounded-full" style={{ background: '#B58A90' }} />
            <p className="font-body tracking-[0.25em] uppercase font-light text-lg ml-2" style={{ color: '#333333' }}>MEMBERSHIPS</p>
          </div>
          <h2 className="font-heading text-[2.45rem] lg:text-[3.35rem] font-semibold text-charcoal mb-4 leading-tight">
            For homes that need regular backup.
          </h2>
          <p className="font-body text-base max-w-lg mx-auto leading-relaxed font-light" style={{ color: '#333333b3' }}>$49/month for priority access, easier planning, and a little more breathing room.</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12 items-stretch">
          <AnimatedSection delay={0.1}>
            <div className="h-full rounded-[2rem] border p-8 lg:p-10 flex flex-col justify-between" style={{ background: '#FFFFFFCC', borderColor: '#B58A9040', boxShadow: '0 18px 45px #B58A9015' }}>
              <div>
                <MembershipLogoTitle />
                <p className="font-body text-base leading-relaxed font-light mb-8" style={{ color: '#333333b3' }}>
                  Membership is for the households that know support shouldn't be saved for a crisis. It's a simple way to keep your home, schedule, and mental load from reaching the breaking point.
                </p>
                <div className="flex items-end gap-2 mb-8">
                  <span className="font-heading text-5xl font-semibold" style={{ color: '#333333' }}>$49</span>
                  <span className="font-body text-sm font-light mb-2" style={{ color: '#33333399' }}>/month</span>
                </div>
              </div>
              <Link
                to="/memberships"
                className="inline-block font-body text-sm tracking-wide px-10 py-4 rounded-full hover:shadow-xl transition-all duration-500 text-center"
                style={{ background: '#333333', color: '#FFFFFF' }}>
                Explore Membership
              </Link>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {perks.map((perk, i) =>
            <AnimatedSection key={perk.label} delay={0.15 + i * 0.05}>
                <div className="h-full rounded-3xl border p-5" style={{ background: withOpacity(perk.dot, '40'), borderColor: perk.dot + '70' }}>
                  <div className="flex items-start gap-4">
                    <span className="font-logo text-3xl leading-none" style={{ color: '#33333380' }}>{perk.number}</span>
                    <div>
                      <h3 className="font-heading text-base font-semibold mb-1" style={{ color: '#333333' }}>{perk.label}</h3>
                      <p className="font-body text-sm leading-relaxed font-light" style={{ color: '#333333b3' }}>{perk.detail}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}