import React from 'react';
import AnimatedSection from '../shared/AnimatedSection';

const credentials = [
  { label: 'Licensed & Insured', detail: 'Full business coverage', accent: '#EB9486' },
  { label: 'CPR Certified', detail: 'Safety trained', accent: '#EFB988' },
  { label: 'Background Checked', detail: 'Every time, no exception', accent: '#CAE7B9' },
  { label: 'Clearances Available', detail: 'Upon request', accent: '#97A7B3' },
  { label: 'Judgment-Free Support', detail: 'Always kind, always discreet', accent: '#B58A90' },
];

const withOpacity = (hex, opacity = '55') => `${hex}${opacity}`;

function CheckIcon() {
  return (
    <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
      <circle cx="14" cy="14" r="10" />
      <path d="M9 14l3.5 3.5L19 10" strokeWidth="1.4" />
    </svg>
  );
}

export default function TrustSectionLite() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden" style={{ background: '#F2E8EA' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full" style={{ background: '#CAE7B9' }} />
            <span className="w-2 h-2 rounded-full" style={{ background: '#DFE3A2' }} />
            <span className="w-2 h-2 rounded-full" style={{ background: '#EB9486' }} />
            <p className="font-body tracking-[0.25em] uppercase font-light text-lg ml-2" style={{ color: '#333333' }}>YOU'RE IN GOOD HANDS</p>
          </div>
          <h2 className="font-heading text-[2.45rem] lg:text-[3.35rem] font-semibold text-charcoal mb-4 leading-tight">
            Trust isn't given. It's earned.
          </h2>
          <p className="font-body text-base max-w-lg mx-auto leading-relaxed font-light" style={{ color: '#333333b3' }}>
            Household support should feel calm, respectful, and clear from the very first visit.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
            {credentials.map((c, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl px-6 py-4 border transition-all duration-300 hover:shadow-sm" style={{ background: withOpacity(c.accent), borderColor: c.accent }}>
                <span style={{ color: '#333333' }}><CheckIcon /></span>
                <div>
                  <p className="font-heading text-sm font-semibold" style={{ color: '#333333' }}>{c.label}</p>
                  <p className="font-body text-xs font-light" style={{ color: '#333333cc' }}>{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
