import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../shared/AnimatedSection';

const perks = [
  { label: 'Priority scheduling', detail: 'Easier access to preferred visit windows.', dot: '#CAE7B9', number: '01' },
  { label: 'Early access hours', detail: 'More flexibility for homes that need an earlier start.', dot: '#EB9486', number: '02' },
  { label: 'Recurring planning', detail: 'A simpler way to keep regular support on the calendar.', dot: '#EFB988', number: '03' },
  { label: 'Monthly check-ins', detail: 'A quick touchpoint to decide what help would matter most.', dot: '#97A7B3', number: '04' },
];

const withOpacity = (hex, opacity = '1F') => `${hex}${opacity}`;

export default function MembershipPreviewLite() {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden" style={{ background: '#EEE7EA' }}>
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
          <p className="font-body text-base max-w-lg mx-auto leading-relaxed font-light" style={{ color: '#333333b3' }}>
            Monthly support for priority access, easier planning, and a little more breathing room.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12 items-stretch">
          <AnimatedSection delay={0.1}>
            <div className="h-full rounded-[2rem] border p-8 lg:p-10 flex flex-col justify-between" style={{ background: '#FFFFFFCC', borderColor: '#B58A9040', boxShadow: '0 18px 45px #B58A9015' }}>
              <div>
                <div className="mb-4 flex flex-wrap items-baseline gap-2">
                  <span className="font-heading text-sm md:text-base font-semibold tracking-[0.22em] uppercase text-charcoal">Clean Slate</span>
                  <span className="font-logo text-3xl md:text-4xl" style={{ color: '#EB9486', lineHeight: 1 }}>Club</span>
                  <span className="font-heading text-2xl font-semibold" style={{ color: '#333333' }}>Membership</span>
                </div>
                <p className="font-body text-sm leading-relaxed font-light mb-8" style={{ color: '#333333b3' }}>
                  Built for homes that want support to feel easier to book, plan, and repeat.
                </p>
                <div className="rounded-[1.5rem] p-6 text-center" style={{ background: '#F1F1F1' }}>
                  <p className="font-heading text-4xl font-semibold text-charcoal mb-1">Member access</p>
                  <p className="font-body text-xs uppercase tracking-[0.22em] text-charcoal/50 font-light">priority planning</p>
                </div>
              </div>
              <Link to="/memberships" className="mt-8 inline-block text-center text-white font-body text-sm tracking-wide px-8 py-3 rounded-full transition-all duration-300 hover:opacity-90 hover:shadow-lg" style={{ background: '#333333' }}>
                View Membership →
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
              {perks.map(perk => (
                <div key={perk.label} className="rounded-[1.5rem] border p-5" style={{ background: withOpacity(perk.dot), borderColor: `${perk.dot}55` }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: perk.dot }} />
                    <span className="font-body text-xs text-charcoal/35 font-light">{perk.number}</span>
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-charcoal mb-2">{perk.label}</h3>
                  <p className="font-body text-sm leading-relaxed font-light" style={{ color: '#333333b3' }}>{perk.detail}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
