import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedSection from '../shared/AnimatedSection';
export default function MashaSection() {
  return (
    <section id="about" className="py-16 lg:py-24 relative overflow-hidden scroll-mt-24 lg:scroll-mt-28" style={{ background: '#F8E8E2' }}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image */}
          <AnimatedSection>
            <div className="relative">
              <img
                src="/images/mashaheadshot.jpg"
                alt="Masha, founder of Clean Slate Club"
                className="relative w-full rounded-[2.5rem] object-cover aspect-[3/4] shadow-2xl shadow-mauve/10 border"
                style={{ borderColor: '#B58A9028' }} />
              
              {/* Floating quote card */}
              <div className="absolute -bottom-6 -right-4 lg:-right-8 p-5 rounded-2xl shadow-xl max-w-[200px] border" style={{ background: '#FFFFFF', borderColor: '#EB948640', boxShadow: '0 8px 30px #B58A9030' }}>
                <p className="font-logo text-coral text-lg leading-tight mb-1">"Finally."</p>
                <p className="font-body text-[11px] font-light" style={{ color: '#33333399' }}>— every client, first visit</p>
              </div>
            </div>
          </AnimatedSection>

          {/* Story copy */}
          <AnimatedSection delay={0.2}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full" style={{ background: '#CAE7B9' }} />
              <span className="w-2 h-2 rounded-full" style={{ background: '#DFE3A2' }} />
              <span className="w-2 h-2 rounded-full" style={{ background: '#EB9486' }} />
              <p className="font-body tracking-[0.25em] uppercase font-light text-lg ml-2" style={{ color: '#333333' }}>THE WOMAN BEHIND THE BRAND</p>
            </div>
            <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-charcoal mb-4 leading-tight">
              Meet Masha.
            </h2>
            <p className="font-body text-base max-w-lg leading-relaxed font-light mb-8" style={{ color: '#333333b3' }}>She gets it.</p>

            <div className="space-y-5 font-body text-base leading-relaxed font-light" style={{ color: '#333333cc' }}>
              <p>
                Masha built Clean Slate Club around a simple truth: most people do not need perfect homes. They need relief.
              </p>
              <p>
                She knows what it feels like to be the one holding the calendar, the meals, the laundry, the errands, the details, and the emotional weight of making sure nothing falls apart. She has lived the kind of overwhelm that does not always look dramatic from the outside, but quietly takes up every inch of your day.
              </p>
              <p>
                As a stay-at-home mom and later a single mom, Masha understood how much invisible labor goes into keeping a household moving. She also understood how hard it can be to ask for help when the thing you need help with is "everything."
              </p>
              <p>
                Clean Slate Club exists for that exact place. The half-finished lists. The messy transitions. The weeks that get away from you. The homes that need care, but so do the people living in them.
              </p>
              <p>
                What started with Masha's own understanding is becoming a new kind of household support: warm, practical, capable, and never judgmental.
              </p>
            </div>

            <motion.div
              className="mt-10 mx-auto max-w-sm rounded-full border px-8 py-5 text-center relative overflow-hidden"
              style={{ background: '#F1F1F1', borderColor: '#7E7F9A35', boxShadow: '0 10px 30px #B58A9018' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ duration: 0.9, delay: 0.15 }}>
              <p className="font-heading text-lg font-semibold text-charcoal leading-snug">
                You don't need perfect. You need backup.
              </p>
            </motion.div>

            <div className="mt-6 text-center">
              <Link to="/about" className="inline-block text-white font-body text-sm tracking-wide px-8 py-3 rounded-full transition-all duration-300 hover:opacity-90 hover:shadow-lg" style={{ background: '#333333' }}>
                Read More About Clean Slate Club →
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>);

}