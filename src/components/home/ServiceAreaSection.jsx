import React, { useState } from 'react';
import AnimatedSection from '../shared/AnimatedSection';
import WaveDivider from '../shared/WaveDivider';

const areas = [
  'Flourtown', 'Wyndmoor', 'Erdenheim', 'Chestnut Hill',
  'Lafayette Hill', 'Blue Bell', 'Plymouth Meeting', 'Ambler',
  'Glenside', 'Oreland', 'Fort Washington'
];

export default function ServiceAreaSection() {
  const [neighborhoodInput, setNeighborhoodInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSuggest = (e) => {
    e.preventDefault();
    if (neighborhoodInput.trim()) setSubmitted(true);
  };

  return (
    <div>
    <WaveDivider fill="#e5f4ec" />
    <section className="py-20 lg:py-28 relative overflow-hidden" style={{ background: '#e5f4ec' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 100%, #b8d8c840 0%, transparent 70%)' }} />
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="text-center mb-12">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-coral/70 mb-4 font-light">Where We Show Up</p>
          <h2 className="font-heading text-3xl lg:text-4xl font-semibold text-charcoal mb-3">
            Currently Serving
          </h2>
          <p className="font-body text-base text-charcoal/45 font-light max-w-md mx-auto">
            Real support for real families, right here in our community.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="flex flex-wrap justify-center gap-3 mb-14">
            {areas.map((area) => (
              <span
                key={area}
                className="font-body text-sm font-light text-charcoal/55 hover:text-charcoal px-5 py-2.5 rounded-full border transition-all duration-300 cursor-default"
                style={{ background: 'rgba(255,255,255,0.75)', borderColor: '#c0ddd0' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#8bbfaa'; e.currentTarget.style.background = '#e8f4ee'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#c0ddd0'; e.currentTarget.style.background = 'rgba(255,255,255,0.75)'; }}
              >
                {area}
              </span>
            ))}
          </div>
        </AnimatedSection>

        {/* Expand callout */}
        <AnimatedSection delay={0.2}>
          <div className="max-w-xl mx-auto text-center p-8 lg:p-10 rounded-3xl border" style={{ background: 'rgba(255,255,255,0.7)', borderColor: '#c0ddd060' }}>
            <p className="font-logo text-2xl mb-2" style={{ color: '#6aaa8a' }}>We can't wait to grow.</p>
            <p className="font-body text-sm text-charcoal/50 font-light mb-6 leading-relaxed">
              We're a boutique service and expanding thoughtfully — neighborhood by neighborhood.<br />
              Tell us where you'd like to see Clean Slate Club™ pop up next.
            </p>
            {submitted ? (
              <p className="font-body text-sm text-charcoal/60 font-light py-2">
                💚 Thank you! We'll keep your area in mind as we grow.
              </p>
            ) : (
              <form onSubmit={handleSuggest} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                <input
                  type="text"
                  value={neighborhoodInput}
                  onChange={e => setNeighborhoodInput(e.target.value)}
                  placeholder="Your neighborhood or zip code..."
                  className="flex-1 font-body text-sm px-5 py-3 rounded-full border outline-none focus:border-sage transition-colors"
                  style={{ background: 'white', borderColor: '#c0ddd0' }}
                />
                <button
                  type="submit"
                  className="font-body text-sm px-6 py-3 rounded-full transition-all duration-300 text-white whitespace-nowrap"
                  style={{ background: '#8bbfaa' }}
                >
                  Let us know
                </button>
              </form>
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
    <WaveDivider fill="#eedbd5" flip />
    </div>
  );
}