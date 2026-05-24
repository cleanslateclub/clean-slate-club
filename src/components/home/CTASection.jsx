import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../shared/AnimatedSection';

export default function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-warm-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <div className="relative rounded-[2.5rem] overflow-hidden">
            <img
              src="https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/3077b1b0f_generated_3c5e4e08.png"
              alt="Serene organized bedroom"
              className="w-full h-72 lg:h-96 object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(51,51,64,0.7) 0%, rgba(51,51,64,0.3) 100%)' }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <p className="font-body text-xs tracking-[0.25em] uppercase text-white/50 mb-4 font-light">Your next step</p>
              <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-white mb-2">
                Life gets messy.
              </h2>
              <p className="font-logo text-2xl text-coral/90 mb-4">We get it.</p>
              <p className="font-body text-base text-white/60 mb-8 max-w-sm font-light leading-relaxed">
                Start with a free 15-minute Reset Consult. No pressure, no judgment — just a conversation.
              </p>
              <Link
                to="/book"
                className="inline-block bg-coral text-white font-body text-sm tracking-wide px-10 py-4 rounded-full hover:bg-coral/90 hover:shadow-xl hover:shadow-coral/30 transition-all duration-500"
              >
                Book Your Free Consult
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}