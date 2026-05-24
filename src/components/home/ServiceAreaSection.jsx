import React from 'react';
import AnimatedSection from '../shared/AnimatedSection';

const areas = [
  'Flourtown', 'Wyndmoor', 'Erdenheim', 'Chestnut Hill',
  'Lafayette Hill', 'Blue Bell', 'Plymouth Meeting', 'Ambler',
  'Glenside', 'Oreland', 'Fort Washington'
];

export default function ServiceAreaSection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-olive mb-4">Service Area</p>
          <h2 className="font-heading text-4xl lg:text-5xl font-light text-charcoal mb-4">
            Proudly local.
          </h2>
          <p className="font-body text-base text-charcoal/50 max-w-lg mx-auto leading-relaxed">
            Boutique household support for the Main Line & Montgomery County woman.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-3 max-w-3xl mx-auto">
            {areas.map((area) => (
              <span
                key={area}
                className="font-heading text-lg lg:text-xl font-light text-charcoal/50 hover:text-clay px-4 py-2 rounded-full border border-taupe/20 hover:border-clay/30 transition-all duration-300 cursor-default"
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