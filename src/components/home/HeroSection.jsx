import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/e5df92e4d_generated_7837d9b6.png"
          alt="Serene sunlit laundry room with perfectly folded linens"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cream/90 via-cream/70 to-cream/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-20">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-xs tracking-[0.25em] uppercase text-olive mb-8"
          >
            Clean Slate Club™
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-heading text-5xl md:text-6xl lg:text-7xl font-light text-charcoal leading-[1.1] mb-8"
          >
            Helping homes<br />
            <span className="italic text-clay">catch up</span> with life.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="font-body text-lg text-charcoal/60 leading-relaxed mb-12 max-w-md"
          >
            Modern household support for busy women who need a reset. Not perfection. Relief.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            <Link
              to="/book"
              className="inline-block bg-clay text-warm-white font-body text-sm tracking-wide px-10 py-4 rounded-full hover:bg-clay/90 hover:shadow-lg hover:shadow-clay/20 transition-all duration-500"
            >
              Book Your Reset
            </Link>
            <Link
              to="/services"
              className="inline-block font-body text-sm tracking-wide text-charcoal/60 px-6 py-4 hover:text-clay transition-colors duration-300"
            >
              Explore Services →
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-px h-12 bg-charcoal/20 mx-auto mb-2" />
        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-charcoal/30">Scroll</p>
      </motion.div>
    </section>
  );
}