import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../shared/AnimatedSection';

const services = [
  {
    name: 'The Sunday Scaries',
    tagline: 'Start Monday feeling human again.',
    description: 'Our signature Sunday home reset — dishes, laundry, folding, light tidying, bed refresh, and kitchen reset.',
    price: '$225–450',
  },
  {
    name: 'The Fold Rush',
    tagline: 'Laundry mountain? I got you.',
    description: 'Complete laundry reset service — wash, dry, fold, and basket organization.',
    price: '$95–145',
  },
  {
    name: 'Pardon the Mess',
    tagline: 'No judgment. Just relief.',
    description: 'Overwhelm recovery for burnout, ADHD paralysis, postpartum, and life transitions.',
    price: '$300–650',
  },
  {
    name: 'Caregiving',
    tagline: 'Support for the ones who support everyone.',
    description: 'Household help for caregivers, aging parents, and families navigating health transitions.',
    price: 'Custom',
  },
];

export default function WhatWeDoSection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <p className="font-body text-xs tracking-[0.25em] uppercase text-olive mb-4">What We Do</p>
          <h2 className="font-heading text-4xl lg:text-5xl font-light text-charcoal mb-6">
            Resets, not cleaning.
          </h2>
          <p className="font-body text-base text-charcoal/50 max-w-lg mb-16 leading-relaxed">
            We don't scrub baseboards. We rescue homes — and the humans inside them — from the weight of life's beautiful chaos.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {services.map((service, i) => (
            <AnimatedSection key={service.name} delay={i * 0.15}>
              <div className="group p-8 rounded-3xl bg-warm-white/60 border border-taupe/20 hover:border-clay/30 hover:shadow-xl hover:shadow-clay/5 transition-all duration-500">
                <p className="font-body text-xs tracking-[0.2em] uppercase text-sage mb-4">{service.price}</p>
                <h3 className="font-heading text-2xl font-normal text-charcoal mb-2">
                  {service.name}
                </h3>
                <p className="font-heading text-base italic text-clay mb-4">{service.tagline}</p>
                <p className="font-body text-sm text-charcoal/50 leading-relaxed">{service.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="mt-12 text-center" delay={0.4}>
          <Link
            to="/services"
            className="inline-block font-body text-sm tracking-wide text-clay border-b border-clay/30 pb-1 hover:border-clay transition-colors duration-300"
          >
            View All Services →
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}