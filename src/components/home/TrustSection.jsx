import React from 'react';
import AnimatedSection from '../shared/AnimatedSection';

const credentials = [
  { icon: '🛡️', label: 'Licensed & Insured', detail: 'Full business coverage' },
  { icon: '❤️', label: 'CPR Certified', detail: 'Safety trained' },
  { icon: '✅', label: 'Background Checked', detail: 'Every time, no exception' },
  { icon: '📋', label: 'Clearances Available', detail: 'Upon request' },
  { icon: '🍽️', label: 'ServSafe Certified', detail: 'Food safety trained' },
];

export default function TrustSection() {
  return (
    <section className="py-20 lg:py-28 bg-warm-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="text-center mb-14">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-coral/70 mb-4 font-light">You're in Good Hands</p>
          <h2 className="font-heading text-3xl lg:text-4xl font-semibold text-charcoal mb-3">
            Trust isn't given. It's earned.
          </h2>
          <p className="font-body text-base text-charcoal/45 font-light max-w-md mx-auto leading-relaxed">
            When someone comes into your home, you deserve to feel completely safe. Here's what we bring to every visit.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
            {credentials.map((c, i) => (
              <div key={i} className="flex items-center gap-3 bg-cream rounded-2xl px-6 py-4 border border-taupe/20 hover:border-coral/20 hover:shadow-md transition-all duration-300">
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <p className="font-heading text-sm font-semibold text-charcoal">{c.label}</p>
                  <p className="font-body text-xs text-charcoal/40 font-light">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}