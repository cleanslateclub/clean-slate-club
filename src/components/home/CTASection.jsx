import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../shared/AnimatedSection';

export default function CTASection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <div className="relative rounded-[2rem] overflow-hidden">
            <img
              src="https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/3077b1b0f_generated_3c5e4e08.png"
              alt="Serene organized bedroom with crisp white linens"
              className="w-full h-80 lg:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-charcoal/50" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <h2 className="font-heading text-4xl lg:text-5xl font-light text-cream mb-4">
                Life gets messy.
              </h2>
              <p className="font-body text-base text-cream/70 mb-8 max-w-md">
                A reset for real life. Book your first session and start your Monday feeling human again.
              </p>
              <Link
                to="/book"
                className="inline-block bg-clay text-warm-white font-body text-sm tracking-wide px-10 py-4 rounded-full hover:bg-clay/90 hover:shadow-lg transition-all duration-500"
              >
                Book Your Reset
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}