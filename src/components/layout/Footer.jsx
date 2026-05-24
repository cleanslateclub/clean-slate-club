import React from 'react';
import { Link } from 'react-router-dom';

const serviceAreas = [
  'Flourtown', 'Wyndmoor', 'Erdenheim', 'Chestnut Hill',
  'Lafayette Hill', 'Blue Bell', 'Plymouth Meeting', 'Ambler',
  'Glenside', 'Oreland', 'Fort Washington'
];

export default function Footer() {
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
          <p className="font-body text-base text-white/40 font-light mb-8">Your first step is a 15-minute Reset Consult. No pressure. Just a conversation.</p>
          <Link
            to="/book"
            className="inline-block bg-coral text-white font-body text-sm tracking-wide px-10 py-4 rounded-full hover:bg-coral/90 hover:shadow-lg hover:shadow-coral/30 transition-all duration-300"
          >
            Book Your Free Consult
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div>
            <div className="mb-5">
              <div className="font-heading text-sm font-semibold tracking-[0.18em] uppercase text-white/60">Clean Slate</div>
              <div className="font-logo text-2xl text-coral" style={{ lineHeight: 1.2 }}>Club™</div>
            </div>
            <p className="font-body text-white/40 text-sm leading-relaxed font-light max-w-xs">
              Modern household support for busy women, overwhelmed moms, and families who need an extra trusted hand.
            </p>
          </div>

          <div>
            <h4 className="font-body text-xs tracking-[0.2em] uppercase text-white/30 mb-6 font-light">Navigate</h4>
            <div className="space-y-3">
              <Link to="/" className="block font-body text-sm text-white/50 hover:text-coral transition-colors font-light">Home</Link>
              <Link to="/services" className="block font-body text-sm text-white/50 hover:text-coral transition-colors font-light">Services</Link>
              <Link to="/memberships" className="block font-body text-sm text-white/50 hover:text-coral transition-colors font-light">Memberships</Link>
              <Link to="/book" className="block font-body text-sm text-white/50 hover:text-coral transition-colors font-light">Book a Consult</Link>
            </div>
          </div>

          <div>
            <h4 className="font-body text-xs tracking-[0.2em] uppercase text-white/30 mb-6 font-light">We Serve</h4>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5">
              {serviceAreas.map((area) => (
                <span key={area} className="font-body text-sm text-white/35 font-light">{area}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-white/25 font-light">
            © {new Date().getFullYear()} Clean Slate Club™ · All rights reserved
          </p>
          <p className="font-body text-xs text-white/25 font-light">
            Boutique household support · Montgomery County, PA
          </p>
        </div>
      </div>
    </footer>
  );
}