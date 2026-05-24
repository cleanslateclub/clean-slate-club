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
            src="https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/989f1fb47_generated_image.png"
            alt="Warm sunlit home"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #fdfcfb 0%, transparent 35%)' }} />
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
            <span className="font-body text-xs tracking-[0.2em] uppercase text-charcoal/60 font-light">Montgomery County, PA</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35 }}
          >
            <h1 className="font-heading font-semibold text-5xl md:text-6xl lg:text-7xl text-charcoal leading-[1.08] mb-3">
              Life gets
            </h1>
            <h1 className="font-logo text-5xl md:text-6xl lg:text-7xl text-coral leading-[1.1] mb-3">
              heavy.
            </h1>
            <h1 className="font-heading font-light text-4xl md:text-5xl lg:text-6xl text-charcoal/60 leading-[1.1] mb-8">
              Let me help.
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="font-body text-lg text-charcoal/55 leading-relaxed mb-10 max-w-md font-light"
          >
            Modern household support for busy moms, overwhelmed households, and high-functioning women who need an extra trusted pair of hands.
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
              Book Your Free Consult
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 font-body text-sm font-light text-charcoal/50 py-4 hover:text-coral transition-colors duration-300"
            >
              See our services <span className="text-coral">→</span>
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