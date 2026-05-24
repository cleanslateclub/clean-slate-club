import React from 'react';
import AnimatedSection from '../shared/AnimatedSection';

export default function AboutSection() {
  return (
    <section className="py-24 lg:py-32 bg-warm-white/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image */}
          <AnimatedSection>
            <div className="relative">
              <img
                src="https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/44493aea1_generated_01184082.png"
                alt="Organized serene home entryway with woven baskets"
                className="w-full rounded-3xl object-cover aspect-[3/4]"
              />
              <div className="absolute -bottom-6 -right-6 bg-cream p-6 rounded-2xl shadow-lg">
                <p className="font-heading text-3xl font-light text-clay">I can</p>
                <p className="font-heading text-3xl font-light text-charcoal italic">breathe again.</p>
              </div>
            </div>
          </AnimatedSection>

          {/* Copy */}
          <AnimatedSection delay={0.2}>
            <p className="font-body text-xs tracking-[0.25em] uppercase text-olive mb-6">Meet Clean Slate Club</p>
            <h2 className="font-heading text-4xl lg:text-5xl font-light text-charcoal mb-8 leading-tight">
              This isn't a <span className="italic text-clay">maid service.</span>
            </h2>
            <div className="space-y-5 font-body text-base text-charcoal/60 leading-relaxed">
              <p>
                Clean Slate Club was born from a simple truth: you're not failing at home — you're just carrying too much. Between the school pickups, the deadlines, the decisions, and the mental load that never clocks out, something has to give.
              </p>
              <p>
                We're the soft landing. The reset button. The support system that helps your home catch up with your life so you can stop white-knuckling your way through the week.
              </p>
              <p>
                Think of us as emotional relief, disguised as household support. Executive function help for the woman who has everything on her plate — except time for herself.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {['Emotional Relief', 'Household Support', 'Life Maintenance', 'No Judgment'].map((tag) => (
                <span key={tag} className="font-body text-xs tracking-wide px-4 py-2 rounded-full bg-sage/10 text-olive border border-sage/20">
                  {tag}
                </span>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}