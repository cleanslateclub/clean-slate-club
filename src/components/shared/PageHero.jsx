import React from 'react';
import { motion } from 'framer-motion';
import WaveDivider from '@/components/shared/WaveDivider';

export default function PageHero({
  eyebrow,
  title,
  script,
  description,
  children,
  background = '#F3DE8A66',
  waveFill = '#F7FAF4',
  scriptColor = '#7E7F9A',
  className = '',
}) {
  return (
    <>
      <section
        className={`pt-28 pb-24 px-6 relative overflow-hidden ${className}`}
        style={{ background }}
      >
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          {eyebrow && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 mb-5"
            >
              <span className="w-2 h-2 rounded-full" style={{ background: '#CAE7B9' }} />
              <span className="w-2 h-2 rounded-full" style={{ background: '#EFB988' }} />
              <span className="w-2 h-2 rounded-full" style={{ background: '#EB9486' }} />
              <p className="font-body text-xs md:text-sm tracking-[0.32em] uppercase font-light ml-2" style={{ color: '#333333' }}>
                {eyebrow}
              </p>
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-body text-3xl md:text-5xl font-light tracking-[0.08em] uppercase mb-4 leading-tight"
            style={{ color: '#333333' }}
          >
            {title}
          </motion.h1>

          {script && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="font-logo text-3xl md:text-4xl mb-5 leading-tight"
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
              className="mt-8"
            >
              {children}
            </motion.div>
          )}
        </div>
      </section>
      <WaveDivider fill={waveFill} className="-mt-16" />
    </>
  );
}
