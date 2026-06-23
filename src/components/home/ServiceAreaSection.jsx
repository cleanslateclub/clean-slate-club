import React, { useState } from 'react';
import AnimatedSection from '../shared/AnimatedSection';
const areas = [
  'Ambler',
  'Blue Bell',
  'Chestnut Hill',
  'Conshohocken',
  'Erdenheim',
  'Flourtown',
  'Fort Washington',
  'Glenside',
  'Lafayette Hill',
  'Oreland',
  'Plymouth Meeting',
  'Wyndmoor'
];


export default function ServiceAreaSection() {
  const [neighborhoodInput, setNeighborhoodInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSuggest = (e) => {
    e.preventDefault();
    if (neighborhoodInput.trim()) setSubmitted(true);
  };

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden" style={{ background: '#EAF1EC' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full" style={{ background: '#CAE7B9' }} />
            <span className="w-2 h-2 rounded-full" style={{ background: '#DFE3A2' }} />
            <span className="w-2 h-2 rounded-full" style={{ background: '#EB9486' }} />
            <p className="font-body tracking-[0.25em] uppercase font-light text-lg ml-2" style={{ color: '#333333' }}>SERVICE AREA</p>
          </div>
          <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-charcoal mb-4 leading-tight">
            Montgomery County, PA
          </h2>
          <p className="font-body text-base max-w-lg mx-auto leading-relaxed font-light" style={{ color: '#333333b3' }}>
            Thoughtful household support for local homes, busy families, and the neighborhoods we know best.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="flex flex-wrap justify-center gap-3 mb-14">
            {areas.map((area) =>
            <span
              key={area}
              className="font-body text-sm font-light text-charcoal/70 hover:text-charcoal px-5 py-2.5 rounded-full border transition-all duration-300 cursor-default"
              style={{ background: 'rgba(255,255,255,0.72)', borderColor: '#8B93A755' }}
              onMouseEnter={(e) => {e.currentTarget.style.borderColor = '#8B93A7';e.currentTarget.style.background = '#FFFFFF';}}
              onMouseLeave={(e) => {e.currentTarget.style.borderColor = '#8B93A755';e.currentTarget.style.background = 'rgba(255,255,255,0.72)';}}>
              
                {area}
              </span>
            )}
          </div>
        </AnimatedSection>

        {/* Expand callout */}
        <AnimatedSection delay={0.2}>
          <div className="max-w-xl mx-auto text-center p-8 lg:p-10 rounded-3xl border" style={{ background: 'rgba(255,255,255,0.76)', borderColor: '#8B93A755' }}>
            <p className="font-logo text-2xl mb-2" style={{ color: '#7E7F9A' }}>Want us in your neighborhood?</p>
            <p className="font-body text-sm text-charcoal/70 font-light mb-6 leading-relaxed">
              If you're nearby but don't see your town listed, send it our way.<br />
              We're adding new Montgomery County neighborhoods as availability allows.
            </p>
            {submitted ?
            <p className="font-body text-sm text-charcoal/75 font-light py-2">
                💚 Thank you! We'll keep your area in mind as we grow.
              </p> :

            <form onSubmit={handleSuggest} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                <input
                type="text"
                value={neighborhoodInput}
                onChange={(e) => setNeighborhoodInput(e.target.value)}
                placeholder="Your neighborhood or zip code..."
                className="flex-1 font-body text-sm px-5 py-3 rounded-full border outline-none focus:border-sage transition-colors"
                style={{ background: 'white', borderColor: '#8B93A755' }} />
              
                <button
                type="submit"
                className="font-body text-sm px-6 py-3 rounded-full transition-all duration-300 text-white whitespace-nowrap"
                style={{ background: '#8B93A7' }}>
                
                  Let us know
                </button>
              </form>
            }
          </div>
        </AnimatedSection>
      </div>
    </section>);

}