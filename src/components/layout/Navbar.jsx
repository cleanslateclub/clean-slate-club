import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ width: 22, height: 22 }}>
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ width: 22, height: 22 }}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const navLinks = [
  { label: 'Services', path: '/services' },
  { label: 'Memberships', path: '/memberships' },
  { label: 'FAQ', path: '/#faq' },
  { label: 'About', path: '/#about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'all 0.5s',
        background: scrolled ? 'rgba(253,252,251,0.93)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        boxShadow: scrolled ? '0 1px 20px rgba(254,197,187,0.15)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-baseline gap-1.5 leading-none">
            <span className="font-heading text-sm font-semibold tracking-[0.18em] uppercase text-charcoal">
              Clean Slate
            </span>
            <span className="font-logo text-lg text-coral" style={{ lineHeight: 1 }}>
              Club
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                style={{ color: location.pathname === link.path ? '#EB9486' : undefined }}
                className="font-body text-sm font-light tracking-wide transition-colors duration-300 text-charcoal/60 hover:text-coral"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/book"
              className="text-white font-body text-sm tracking-wide px-6 py-2.5 rounded-full hover:opacity-90 transition-all duration-300"
              style={{ background: 'linear-gradient(to right, #EB9486, #fcd5ce)' }}
            >
              Book Now
            </Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-charcoal">
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden border-t"
          style={{ background: 'rgba(253,252,251,0.97)', borderColor: '#fcd5ce40', backdropFilter: 'blur(20px)' }}
        >
          <div className="px-6 py-8 space-y-6">
            <Link to="/" className="block font-heading text-xl font-semibold text-charcoal/70">Home</Link>
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                className="block font-heading text-xl font-semibold text-charcoal/70"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/book"
              className="inline-block text-white font-body text-sm tracking-wide px-7 py-3 rounded-full mt-2"
              style={{ background: 'linear-gradient(to right, #EB9486, #fcd5ce)' }}
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}