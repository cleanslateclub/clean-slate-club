import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TaskScrollPanel from './TaskScrollPanel';

export default function HeroSection() {
  return (
    <section className="relative flex items-start overflow-hidden" style={{ background: '#fdfcfb' }}>
      {/* Organic background blobs */}
      <div className="absolute top-10 right-0 w-[700px] h-[700px] rounded-full opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle, #ffd7ba 0%, transparent 65%)', transform: 'translate(20%, -10%)' }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-25 pointer-events-none" style={{ background: 'radial-gradient(circle, #d8e2dc 0%, transparent 65%)', transform: 'translate(-20%, 20%)' }} />
      <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #ffe5d9 0%, transparent 65%)' }} />
      <div className="absolute top-1/3 left-1/3 w-[200px] h-[200px] rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #e8e8e4 0%, transparent 65%)' }} />

      {/* Task scroll panel — desktop right column */}
      <div className="absolute right-0 top-0 bottom-0 w-[46%] hidden lg:flex flex-col justify-center overflow-hidden">
        {/* Soft left fade so it bleeds into the content */}
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #fdfcfb 0%, transparent 100%)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #fdfcfb 0%, transparent 100%)' }} />
        <div className="h-full py-20">
          <TaskScrollPanel />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-10 md:pt-24 md:pb-12 lg:pt-28 lg:pb-20 w-full">
        <div className="max-w-xl lg:text-left text-center mx-auto lg:mx-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 border hidden" style={{ background: '#ffe5d940', borderColor: '#fcd5ce80' }}>
            
            <span className="w-1.5 h-1.5 rounded-full bg-coral animate-pulse" />
            <span className="font-body text-xs tracking-[0.2em] uppercase text-charcoal/60 font-light">Practical Support For Busy Homes</span>
          </motion.div>

          {/* Mobile task scroll strip — above heading for visual impact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 lg:hidden overflow-hidden"
            style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}>
            
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
              className="flex gap-2.5 w-max">
              
              {[...Array(2)].flatMap(() =>
              [
              { label: 'Grocery Shopping', color: '#EB9486', bg: '#fef0ee', emoji: '🛒' },
              { label: 'Meal Prep', color: '#CAE7B9', bg: '#eef8ea', emoji: '🍳' },
              { label: 'Pharmacy Pickup', color: '#EB9486', bg: '#fef0ee', emoji: '💊' },
              { label: 'Pantry Restock', color: '#B58A90', bg: '#f7edef', emoji: '🧺' },
              { label: 'Pet Supply Run', color: '#97A7B3', bg: '#eef1f4', emoji: '🦴' },
              { label: 'Freezer Meals', color: '#CAE7B9', bg: '#eef8ea', emoji: '🫙' },
              { label: 'Donation Dropoff', color: '#EFB988', bg: '#fef5ec', emoji: '💛' },
              { label: 'Returns', color: '#EFB988', bg: '#fef5ec', emoji: '📦' },
              { label: 'Dry Cleaning', color: '#97A7B3', bg: '#eef1f4', emoji: '👗' }].
              map((t, i) =>
              <span
                key={`m-top-${t.label}-${i}`}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 border text-xs font-body font-light text-charcoal/70 shrink-0"
                style={{ background: t.bg, borderColor: t.color + '35' }}>
                    <span
                  className="w-4 h-4 rounded flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                  style={{ background: t.color }}>
                  ✓</span>
                    {t.emoji} {t.label}
                  </span>
              )
              )}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35 }}>
            
            <h1 className="font-body font-light md:text-5xl lg:text-[3.5rem] leading-[1.1] mb-2 uppercase tracking-widest text-sm text-[hsl(var(--foreground))]">PRACTICAL SUPPORT

            </h1>
            <h1 className="font-logo md:text-6xl lg:text-7xl text-coral leading-[1.1] mb-2 text-4xl">for busy homes

            </h1>
            <h1 className="font-heading font-light text-2xl md:text-3xl lg:text-4xl leading-[1.2] mb-8 text-[hsl(var(--primary))] normal-case">Because no one is actually all caught up.

            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="font-body text-xl leading-relaxed mb-10 max-w-md font-light" style={{ color: '#333333' }}>
            
            Support for busy households, mental overload, family logistics, and the never-ending little things that keep life moving.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="flex flex-col sm:flex-row items-center lg:items-start gap-4 justify-center lg:justify-start">
            
            <Link
              to="/book"
              className="inline-block bg-coral text-white font-body text-sm tracking-wide px-10 py-4 rounded-full hover:bg-coral/90 hover:shadow-xl hover:shadow-coral/25 transition-all duration-500">
              
              Start Your Reset
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 font-body text-sm font-light text-charcoal/50 py-4 hover:text-coral transition-colors duration-300">
              
              See what we do <span className="text-coral">→</span>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start">
            
            {['Licensed & Insured', 'CPR Certified', 'Background Checked', 'Clearances Available Upon Request'].map((badge) =>
            <span key={badge} className="font-body text-[11px] tracking-wide text-charcoal/40 font-light flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-sage" />
                {badge}
              </span>
            )}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        
        <div className="w-px h-10 bg-gradient-to-b from-charcoal/20 to-transparent" />
        <p className="font-body text-[9px] tracking-[0.3em] uppercase text-charcoal/25 font-light">Scroll</p>
      </motion.div>
    </section>);

}