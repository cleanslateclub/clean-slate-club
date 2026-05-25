import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'backdrop-blur-xl' : 'bg-transparent'}`}
      style={scrolled ? { background: 'rgba(253,252,251,0.93)', boxShadow: '0 1px 20px rgba(254,197,187,0.15)' } : {}}
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
                className={`font-body text-sm font-light tracking-wide transition-colors duration-300 ${
                  location.pathname === link.path ? 'text-coral' : 'text-charcoal/60 hover:text-coral'
                }`}
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/book"
              className="bg-gradient-to-r from-[#EB9486] to-[#fcd5ce] text-white font-body text-sm tracking-wide px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-[#EB9486]/25 hover:opacity-90 transition-all duration-300"
            >
              Book Now
            </Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-charcoal">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden backdrop-blur-xl border-t"
          style={{ background: 'rgba(253,252,251,0.97)', borderColor: '#fcd5ce40' }}
          >
            <div className="px-6 py-8 space-y-6">
              <Link to="/" className="block font-heading text-xl font-semibold text-charcoal/70">Home</Link>
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  className={`block font-heading text-xl font-semibold ${
                    location.pathname === link.path ? 'text-coral' : 'text-charcoal/70'
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <Link to="/book" className="inline-block bg-gradient-to-r from-[#EB9486] to-[#fcd5ce] text-white font-body text-sm tracking-wide px-7 py-3 rounded-full mt-2">
                Book Now
                </Link>
                </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}