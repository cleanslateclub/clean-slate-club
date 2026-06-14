import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TaskScrollPanel from './TaskScrollPanel';

const mobileTasks = [
  { label: 'Grocery Shopping', color: '#EB9486', emoji: '🛒' },
  { label: 'Meal Prep', color: '#CAE7B9', emoji: '🍳' },
  { label: 'Pharmacy Pickup', color: '#B58A90', emoji: '💊' },
  { label: 'Pantry Restock', color: '#7E7F9A', emoji: '🧺' },
  { label: 'Pet Supply Run', color: '#97A7B3', emoji: '🦴' },
  { label: 'Freezer Meals', color: '#DFE3A2', emoji: '🫙' },
  { label: 'Donation Dropoff', color: '#F3DE8A', emoji: '💛' },
  { label: 'Returns', color: '#EFB985', emoji: '📦' },
  { label: 'Dry Cleaning', color: '#FFE5D9', emoji: '👗' },
];

export default function HeroSection() {
  return (
    <section className="relative flex items-start overflow-hidden" style={{ background: '#F1F1F1' }}>
      {/* Organic background blobs */}
      <div className="absolute top-8 right-0 w-[720px] h-[720px] rounded-full opacity-35 pointer-events-none" style={{ background: 'radial-gradient(circle, #CAE7B9 0%, transparent 65%)', transform: 'translate(22%, -14%)' }} />
      <div className="absolute bottom-0 left-0 w-[560px] h-[560px] rounded-full opacity-40 pointer-events-none" style={{ background: 'radial-gradient(circle, #FFE5D9 0%, transparent 66%)', transform: 'translate(-22%, 22%)' }} />
      <div className="absolute top-1/2 right-1/4 w-[360px] h-[360px] rounded-full opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle, #DFE3A2 0%, transparent 65%)' }} />
      <div className="absolute top-1/3 left-1/3 w-[240px] h-[240px] rounded-full opacity-25 pointer-events-none" style={{ background: 'radial-gradient(circle, #97A7B3 0%, transparent 65%)' }} />
      <div className="absolute bottom-24 right-1/3 w-[220px] h-[220px] rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #B58A90 0%, transparent 66%)' }} />

      {/* Task scroll panel — desktop right column */}
      <div className="absolute right-0 top-0 bottom-0 w-[46%] hidden lg:flex flex-col justify-center overflow-hidden">
        {/* Soft left fade so it bleeds into the content */}
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #F1F1F1 0%, transparent 100%)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #F1F1F1 0%, transparent 100%)' }} />
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
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 border hidden"
            style={{ background: '#FFE5D9', borderColor: '#B58A9040' }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#7E7F9A' }} />
            <span className="font-body text-xs tracking-[0.2em] uppercase font-light" style={{ color: '#333333' }}>Practical Support For Busy Homes</span>
          </motion.div>

          {/* Mobile task scroll strip — above heading for visual impact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 lg:hidden overflow-hidden"
            style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}
          >
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
              className="flex gap-2.5 w-max"
            >
              {[...Array(2)].flatMap(() => mobileTasks).map((t, i) => (
                <span
                  key={`m-top-${t.label}-${i}`}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 border text-xs font-body font-medium shrink-0"
                  style={{ background: t.color, borderColor: '#33333322', color: '#333333' }}
                >
                  <span
                    className="w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold shrink-0"
                    style={{ background: '#333333', color: '#FFFFFF' }}
                  >
                    ✓
                  </span>
                  {t.emoji} {t.label}
                </span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35 }}
          >
            <p className="font-body text-xs md:text-sm tracking-[0.34em] uppercase font-semibold mb-4" style={{ color: '#7E7F9A' }}>
              Household support for modern life
            </p>
            <h1 className="mb-5 leading-none" aria-label="Busy homes, handled">
              <span className="block font-body text-[3.25rem] md:text-[5rem] lg:text-[6.75rem] uppercase tracking-[-0.06em] font-black" style={{ color: '#333333' }}>
                BUSY
              </span>
              <span className="block font-body text-[3.25rem] md:text-[5rem] lg:text-[6.75rem] uppercase tracking-[-0.06em] font-black -mt-2" style={{ color: '#333333' }}>
                HOMES,
              </span>
              <span className="block font-logo text-[3.75rem] md:text-[5.75rem] lg:text-[7.5rem] leading-[0.95] font-normal -mt-1" style={{ color: '#7E7F9A' }}>
                handled
              </span>
            </h1>
            <p className="font-heading font-light text-xl md:text-2xl lg:text-3xl leading-[1.25] mb-8 max-w-lg" style={{ color: '#333333' }}>
              Because no one is actually all caught up.
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="font-body text-lg md:text-xl leading-relaxed mb-10 max-w-md font-light"
            style={{ color: '#333333' }}
          >
            Support for busy households, mental overload, family logistics, and the never-ending little things that keep life moving.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="flex flex-col sm:flex-row items-center lg:items-start gap-4 justify-center lg:justify-start"
          >
            <Link
              to="/book"
              className="inline-block font-body text-sm tracking-wide px-10 py-4 rounded-full transition-all duration-500 shadow-sm hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{ background: '#333333', color: '#FFFFFF', outlineColor: '#7E7F9A' }}
            >
              Start Your Reset
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 font-body text-sm font-light py-4 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 rounded-full px-2"
              style={{ color: '#333333', outlineColor: '#7E7F9A' }}
            >
              See what we do <span style={{ color: '#7E7F9A' }}>→</span>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start"
          >
            {['Licensed & Insured', 'CPR Certified', 'Background Checked', 'Clearances Available Upon Request'].map((badge, index) => {
              const badgeColors = ['#CAE7B9', '#DFE3A2', '#F3DE8A', '#B58A90'];
              return (
                <span key={badge} className="font-body text-[11px] tracking-wide font-light flex items-center gap-1.5" style={{ color: '#333333' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: badgeColors[index] }} />
                  {badge}
                </span>
              );
            })}
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
        <div className="w-px h-10" style={{ background: 'linear-gradient(to bottom, #33333340, transparent)' }} />
        <p className="font-body text-[9px] tracking-[0.3em] uppercase font-light" style={{ color: '#33333380' }}>Scroll</p>
      </motion.div>
    </section>
  );
}
