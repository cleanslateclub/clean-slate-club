import React from 'react';
import AnimatedSection from '../shared/AnimatedSection';

const testimonials = [
  {
    quote: "I cried happy tears when I walked into my house after my first Sunday Scaries reset. I could actually breathe.",
    name: "Sarah M.",
    location: "Chestnut Hill",
    detail: "Working mom of 3",
  },
  {
    quote: "As someone with ADHD, the overwhelm of my house was paralyzing. Clean Slate Club gave me my home back without a single ounce of judgment.",
    name: "Jen T.",
    location: "Blue Bell",
    detail: "ADHD household",
  },
  {
    quote: "This isn't cleaning. This is therapy for your house. Worth every single penny.",
    name: "Michelle R.",
    location: "Lafayette Hill",
    detail: "Dual-income family",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 lg:py-32 bg-charcoal/[0.03]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-olive mb-4">Kind Words</p>
          <h2 className="font-heading text-4xl lg:text-5xl font-light text-charcoal">
            "I can breathe again."
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <AnimatedSection key={i} delay={i * 0.12}>
              <div className="p-8 lg:p-10 rounded-3xl bg-warm-white border border-taupe/15 h-full flex flex-col">
                <div className="flex-1">
                  <span className="font-heading text-5xl text-clay/30 leading-none">"</span>
                  <p className="font-body text-base text-charcoal/70 leading-relaxed -mt-4 mb-8">
                    {t.quote}
                  </p>
                </div>
                <div>
                  <div className="h-px bg-taupe/30 mb-6" />
                  <p className="font-body text-sm font-medium text-charcoal">{t.name}</p>
                  <p className="font-body text-xs text-charcoal/40 mt-0.5">{t.location} · {t.detail}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}