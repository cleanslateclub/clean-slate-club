import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../shared/AnimatedSection';

export default function CTASection() {
  return (
    <section className="py-20 lg:py-28 hidden" style={{ background: '#fdfcfb' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <div className="relative rounded-[2.5rem] overflow-hidden">
            <img
              src="https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/165bbf84d_generated_image.png"
              alt="A warm modern home with the everyday mess of real family life"
              className="w-full h-72 lg:h-96 object-cover" />
            
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(254,197,187,0.75) 0%, rgba(252,213,206,0.5) 50%, rgba(236,228,219,0.3) 100%)' }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <p className="font-body text-xs tracking-[0.25em] uppercase mb-4 font-light" style={{ color: '#7a4f45' }}>Your next step</p>
              <h2 className="font-heading text-4xl lg:text-5xl font-semibold mb-2" style={{ color: '#3a2820' }}>
                Life gets messy.
              </h2>
              <p className="font-logo text-2xl mb-4" style={{ color: '#c07060' }}>We get it.</p>
              <p className="font-body text-base mb-8 max-w-sm font-light leading-relaxed" style={{ color: '#5a3e38' }}>
                Start with a free 15-minute Reset Consult. No pressure, no judgment — just a conversation.
              </p>
              <Link
                to="/book"
                className="inline-block font-body text-sm tracking-wide px-10 py-4 rounded-full hover:shadow-xl transition-all duration-500"
                style={{ background: 'linear-gradient(to right, #EB9486, #fcd5ce)', color: 'white' }}>
                
                Book Now — It's Free
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>);

}