import React from 'react';
import { motion } from 'framer-motion';
import WaveDivider from '@/components/shared/WaveDivider';

const RIBBON_COLORS = ['#CAE7B9', '#DFE3A2', '#F3DE8A', '#EFB988', '#EB9486', '#B58A90', '#97A7B3', '#8B93A7', '#7E7F9A'];

const PAGE_DOT_COLORS = {
  services: ['#CAE7B9', '#DFE3A2', '#EB9486'],
  'about clean slate club': ['#F3DE8A', '#EFB988', '#EB9486'],
  membership: ['#EFB988', '#B58A90', '#7E7F9A'],
  faq: ['#CAE7B9', '#F3DE8A', '#97A7B3'],
  'book your visit': ['#DFE3A2', '#EFB988', '#EB9486'],
};

function getDotColors(eyebrow, dotColors) {
  if (dotColors?.length >= 3) return dotColors.slice(0, 3);
  const key = String(eyebrow || '').toLowerCase();
  return PAGE_DOT_COLORS[key] || ['#CAE7B9', '#DFE3A2', '#EB9486'];
}

export default function PageHero({
  eyebrow,
  title,
  script,
  description,
  children,
  background = '#FDFCFB',
  waveFill = '#F7FAF4',
  scriptColor = '#7E7F9A',
  dotColors,
  className = '',
}) {
  const dots = getDotColors(eyebrow, dotColors);

  return (
    <>
      <section
        className={`pt-24 sm:pt-28 pb-20 sm:pb-24 px-5 sm:px-6 relative overflow-hidden ${className}`}
        style={{ background: '#FDFCFB' }}
      >
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          {eyebrow && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 mb-4 sm:mb-5"
            >
              {dots.map((color) => (
                <span key={color} className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
              ))}
              <p className="font-body text-[11px] md:text-sm tracking-[0.24em] md:tracking-[0.32em] uppercase font-light ml-1.5 sm:ml-2" style={{ color: '#333333' }}>
                {eyebrow}
              </p>
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-body text-[1.9rem] sm:text-4xl md:text-5xl font-light tracking-[0.06em] md:tracking-[0.08em] uppercase mb-4 leading-tight"
            style={{ color: '#333333' }}
          >
            {title}
          </motion.h1>

          {script && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="font-logo text-[2rem] sm:text-3xl md:text-4xl mb-5 leading-tight"
              style={{ color: scriptColor }}
            >
              {script}
            </motion.p>
          )}

          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-body text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto"
              style={{ color: '#333333cc' }}
            >
              {description}
            </motion.p>
          )}

          {children && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-7 sm:mt-8"
            >
              {children}
            </motion.div>
          )}
        </div>

        <motion.div
          className="absolute left-0 right-0 bottom-0 z-20 flex h-2.5 md:h-3 overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          aria-hidden="true"
        >
          {RIBBON_COLORS.map((color) => (
            <span key={color} className="h-full flex-1" style={{ background: color }} />
          ))}
        </motion.div>
      </section>
      <WaveDivider fill={waveFill} className="-mt-16" />
    </>
  );
}