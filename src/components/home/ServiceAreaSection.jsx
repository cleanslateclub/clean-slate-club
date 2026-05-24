import React from 'react';
import AnimatedSection from '../shared/AnimatedSection';

const areas = [
  'Flourtown', 'Wyndmoor', 'Erdenheim', 'Chestnut Hill',
  'Lafayette Hill', 'Blue Bell', 'Plymouth Meeting', 'Ambler',
  'Glenside', 'Oreland', 'Fort Washington'
];

export default function ServiceAreaSection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden" style={{ background: '#DFE3A208' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 100%, #DFE3A220 0%, transparent 70%)' }} />
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="text-center mb-12">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-coral/70 mb-4 font-light">Proudly Local</p>
          <h2 className="font-heading text-3xl lg:text-4xl font-semibold text-charcoal mb-3">
            Serving Montgomery County
          </h2>
          <p className="font-body text-base text-charcoal/45 font-light max-w-md mx-auto">
            Boutique household support for the Main Line & Montco community.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div className="flex flex-wrap justify-center gap-3">
            {areas.map((area) => (
              <span
                key={area}
                className="font-body text-sm font-light text-charcoal/55 hover:text-charcoal px-5 py-2.5 rounded-full border transition-all duration-300 cursor-default"
                style={{ background: '#f1f1f1', borderColor: '#DCDCDC' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#DFE3A2'; e.currentTarget.style.background = '#DFE3A220'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#DCDCDC'; e.currentTarget.style.background = '#f1f1f1'; }}
              >
                {area}
              </span>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}