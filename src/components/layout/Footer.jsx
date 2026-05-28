import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const serviceAreas = [
  'Flourtown', 'Wyndmoor', 'Erdenheim', 'Chestnut Hill',
  'Lafayette Hill', 'Blue Bell', 'Plymouth Meeting', 'Ambler',
  'Glenside', 'Oreland', 'Fort Washington'
];

export default function Footer() {
  const [suggestInput, setSuggestInput] = useState('');
  const [suggestSent, setSuggestSent] = useState(false);

  return (
    <footer className="bg-charcoal text-cream relative overflow-hidden">
      {/* Blob accents */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5" style={{ background: '#EB9486', filter: 'blur(80px)', transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-5" style={{ background: '#CAE7B9', filter: 'blur(80px)', transform: 'translate(-30%, 30%)' }} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        {/* CTA */}
        <div className="text-center mb-20 pb-20 border-b border-white/10">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-coral/70 mb-4 font-light">Ready when you are</p>
          <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-white/90 mb-3 leading-tight">
            Ready to breathe again?
          </h2>
          <p className="font-body text-base text-white/40 font-light mb-8">Your first step is a 15-minute free consult. No pressure. Just a conversation.</p>
          <Link
            to="/book"
            className="inline-block bg-coral text-white font-body text-sm tracking-wide px-10 py-4 rounded-full hover:bg-coral/90 hover:shadow-lg hover:shadow-coral/30 transition-all duration-300"
          >
            Book Now — It's Free
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="mb-5 flex items-baseline gap-1.5">
              <span className="font-heading text-sm font-semibold tracking-[0.18em] uppercase text-white/60">Clean Slate</span>
              <span className="font-logo text-lg text-coral" style={{ lineHeight: 1 }}>Club</span>
            </div>
            <p className="font-body text-white/40 text-sm leading-relaxed font-light max-w-xs">
              Thoughtful household support for busy women, overwhelmed moms, and families who deserve a little backup.
            </p>
          </div>

          <div>
            <h4 className="font-body text-xs tracking-[0.2em] uppercase text-white/30 mb-6 font-light">Navigate</h4>
            <div className="space-y-3">
              <Link to="/" className="block font-body text-sm text-white/50 hover:text-coral transition-colors font-light">Home</Link>
              <Link to="/services" className="block font-body text-sm text-white/50 hover:text-coral transition-colors font-light">Services</Link>
              <Link to="/memberships" className="block font-body text-sm text-white/50 hover:text-coral transition-colors font-light">Memberships</Link>
              <Link to="/book" className="block font-body text-sm text-white/50 hover:text-coral transition-colors font-light">Book Now</Link>
            </div>
          </div>

          <div>
            <h4 className="font-body text-xs tracking-[0.2em] uppercase text-white/30 mb-6 font-light">We Serve</h4>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5">
              {serviceAreas.map((area) => (
                <span key={area} className="font-body text-sm text-white/35 font-light">{area}</span>
              ))}
            </div>
            <p className="font-body text-xs text-white/20 font-light mt-4">Montgomery County, PA</p>
          </div>

          {/* Expansion suggestion */}
          <div>
            <h4 className="font-body text-xs tracking-[0.2em] uppercase text-white/30 mb-6 font-light">Coming Soon to You?</h4>
            <p className="font-body text-xs text-white/35 font-light leading-relaxed mb-4">
              We can't wait to expand to your area. Tell us where you'd like to see us pop up next.
            </p>
            {suggestSent ? (
              <p className="font-body text-xs text-coral/70 font-light">💚 Thank you! We'll keep it in mind.</p>
            ) : (
              <form onSubmit={e => { e.preventDefault(); if (suggestInput.trim()) setSuggestSent(true); }} className="flex flex-col gap-2">
                <input
                  type="text"
                  value={suggestInput}
                  onChange={e => setSuggestInput(e.target.value)}
                  placeholder="Your neighborhood or zip..."
                  className="font-body text-xs px-4 py-2.5 rounded-full border outline-none transition-colors w-full"
                  style={{ background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}
                />
                <button type="submit" className="font-body text-xs px-4 py-2.5 rounded-full transition-all duration-300 text-white/70 hover:text-white border border-white/20 hover:border-coral/50 text-left">
                  Suggest my area →
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-white/25 font-light">
            © {new Date().getFullYear()} Clean Slate Club™ · All rights reserved
          </p>
          <div className="flex items-center gap-6">
            <p className="font-body text-xs text-white/25 font-light">
              cleanslateclubpa@gmail.com · (206) 825-4061
            </p>
            <Link
              to="/admin"
              className="font-body text-[10px] text-white/15 hover:text-white/40 transition-colors font-light tracking-wide"
            >
              Provider Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}