import React from 'react';
import { Link } from 'react-router-dom';

const serviceAreas = [
  'Flourtown', 'Wyndmoor', 'Erdenheim', 'Chestnut Hill',
  'Lafayette Hill', 'Blue Bell', 'Plymouth Meeting', 'Ambler',
  'Glenside', 'Oreland', 'Fort Washington'
];

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-3xl font-light mb-4">Clean Slate Club™</h3>
            <p className="font-body text-cream/60 text-sm leading-relaxed max-w-xs">
              Helping homes catch up with life. Modern household support for busy women who need a reset.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body text-xs tracking-[0.2em] uppercase text-cream/40 mb-6">Navigate</h4>
            <div className="space-y-3">
              <Link to="/" className="block font-body text-sm text-cream/70 hover:text-clay transition-colors">Home</Link>
              <Link to="/services" className="block font-body text-sm text-cream/70 hover:text-clay transition-colors">Services</Link>
              <Link to="/memberships" className="block font-body text-sm text-cream/70 hover:text-clay transition-colors">Memberships</Link>
              <Link to="/book" className="block font-body text-sm text-cream/70 hover:text-clay transition-colors">Book Your Reset</Link>
            </div>
          </div>

          {/* Service Area */}
          <div>
            <h4 className="font-body text-xs tracking-[0.2em] uppercase text-cream/40 mb-6">We Serve</h4>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              {serviceAreas.map((area) => (
                <span key={area} className="font-body text-sm text-cream/50">{area}</span>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="border-t border-cream/10 pt-16 text-center">
          <h2 className="font-heading text-4xl lg:text-5xl font-light text-cream/90 mb-6">
            Ready to breathe again?
          </h2>
          <Link
            to="/book"
            className="inline-block bg-clay text-warm-white font-body text-sm tracking-wide px-10 py-4 rounded-full hover:bg-clay/90 transition-all duration-300"
          >
            Book Your Reset
          </Link>
        </div>

        {/* Bottom */}
        <div className="mt-20 pt-8 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-cream/30">
            © {new Date().getFullYear()} Clean Slate Club™ · All rights reserved
          </p>
          <p className="font-body text-xs text-cream/30">
            Boutique household support for the Main Line & Montco woman
          </p>
        </div>
      </div>
    </footer>
  );
}