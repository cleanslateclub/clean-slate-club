import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: '#fdfcfb' }}>
      {/* Organic background blobs */}
      <div className="absolute top-10 right-0 w-[700px] h-[700px] rounded-full opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle, #ffd7ba 0%, transparent 65%)', transform: 'translate(20%, -10%)' }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-25 pointer-events-none" style={{ background: 'radial-gradient(circle, #d8e2dc 0%, transparent 65%)', transform: 'translate(-20%, 20%)' }} />
      <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #ffe5d9 0%, transparent 65%)' }} />
      <div className="absolute top-1/3 left-1/3 w-[200px] h-[200px] rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #e8e8e4 0%, transparent 65%)' }} />

      {/* Image - right side */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
        <div className="absolute inset-0" style={{ clipPath: 'ellipse(85% 100% at 85% 50%)' }}>
          <img
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80"
            alt="Beautiful organized home"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #fdfcfb 0%, transparent 40%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 60%, #fdfcfb11 100%)' }} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-16 w-full">
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 border" style={{ background: '#ffe5d940', borderColor: '#fcd5ce80' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-coral animate-pulse" />
            <span className="font-body text-xs tracking-[0.2em] uppercase text-charcoal/60 font-light">Boutique Household Support</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35 }}
          >
            <h1 className="font-heading font-light text-4xl md:text-5xl lg:text-[3.5rem] text-charcoal/60 leading-[1.1] mb-2">
              You deserve a home
            </h1>
            <h1 className="font-logo text-5xl md:text-6xl lg:text-7xl text-coral leading-[1.1] mb-2">
              that feels like you.
            </h1>
            <h1 className="font-heading font-light text-2xl md:text-3xl lg:text-4xl text-charcoal/40 leading-[1.2] mb-8">
              Let's get you there.
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="font-body text-lg text-charcoal/55 leading-relaxed mb-10 max-w-md font-light"
          >
            Thoughtful household support for busy women, overwhelmed moms, and anyone who needs a trusted extra pair of hands — without the guilt of asking.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            <Link
              to="/book"
              className="inline-block bg-coral text-white font-body text-sm tracking-wide px-10 py-4 rounded-full hover:bg-coral/90 hover:shadow-xl hover:shadow-coral/25 transition-all duration-500"
            >
              Book Now — It's Free
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 font-body text-sm font-light text-charcoal/50 py-4 hover:text-coral transition-colors duration-300"
            >
              See what we do <span className="text-coral">→</span>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-12 flex flex-wrap gap-4"
          >
            {['Licensed & Insured', 'CPR Certified', 'Background Checked'].map((badge) => (
              <span key={badge} className="font-body text-[11px] tracking-wide text-charcoal/40 font-light flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-sage" />
                {badge}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-px h-10 bg-gradient-to-b from-charcoal/20 to-transparent" />
        <p className="font-body text-[9px] tracking-[0.3em] uppercase text-charcoal/25 font-light">Scroll</p>
      </motion.div>
    </section>
  );
}