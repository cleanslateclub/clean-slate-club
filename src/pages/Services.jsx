import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/shared/AnimatedSection';
// FIX: Import SERVICE_CONFIG directly — no more duplicated/out-of-sync data
import { SERVICE_CONFIG } from '@/lib/bookingConfig';

// Display order for services page (excludes consult — shown separately as hero CTA)
const SERVICE_ORDER = [
  'home_reset',
  'mothers_helper',
  'senior_support',
  'errands',
  'meal_prep',
  'organization',
];

// FIX: senior_support was same color as consult (#B58A90) — give it a distinct color
const COLOR_OVERRIDES = {
  senior_support: '#D4A574', // warm amber — distinct from consult mauve
};

export default function Services() {
  const consult = SERVICE_CONFIG['consult'];

  return (
    <main className="min-h-screen bg-cream"> {/* FIX: <main> for accessibility + SEO */}
      {/* Hero */}
      <div
        className="pt-28 pb-16 px-6"
        style={{ background: 'linear-gradient(135deg, #fdfcfb 0%, #fef0ee 50%, #eef8ea 100%)' }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-body text-xs tracking-[0.25em] uppercase text-coral/60 font-light mb-3"
          >
            What We Do
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading text-4xl md:text-5xl font-semibold text-charcoal mb-4"
          >
            Services Built Around Your Life
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-body text-lg text-charcoal/70 font-light leading-relaxed max-w-xl mx-auto mb-8"
          >
            Practical, hands-on household support — no judgment, no pressure.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              to="/book"
              className="inline-block bg-coral text-white font-body text-sm tracking-wide px-10 py-4 rounded-full hover:bg-coral/90 transition-all duration-300"
            >
              Book Now →
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Free Consult Banner */}
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-4">
        <AnimatedSection>
          <div
            className="rounded-3xl border p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center gap-6"
            style={{ borderColor: consult.color + '40', background: '#f7edef' }}
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: consult.color }} />
                <h2 className="font-heading text-xl font-semibold text-charcoal">{consult.label}</h2>
              </div>
              <p className="font-logo text-base ml-6 mb-3" style={{ color: consult.color }}>
                A free 15-minute call to figure it out together.
              </p>
              <p className="font-body text-sm text-charcoal/70 font-light">{consult.description}</p>
              {/* FIX: Monday-only note prominently displayed */}
              <p className="font-body text-xs text-charcoal/50 font-light mt-2 italic">
                ⏰ {consult.scheduleNote}
              </p>
            </div>
            <div className="shrink-0 text-center sm:text-right">
              <p className="font-heading text-2xl font-semibold text-charcoal mb-1">Free</p>
              <p className="font-body text-xs text-charcoal/60 font-light mb-4">15 min call</p>
              <Link
                to="/book?service=consult"
                className="inline-block text-white font-body text-xs tracking-wide px-6 py-2.5 rounded-full transition-all duration-300 hover:opacity-90"
                style={{ background: consult.color }}
              >
                Book Free Consult →
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Service Cards — FIX: data comes directly from SERVICE_CONFIG, always accurate */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {SERVICE_ORDER.map((key, i) => {
          const service = SERVICE_CONFIG[key];
          if (!service) return null;
          const color = COLOR_OVERRIDES[key] || service.color;
          const bgColor = color + '15'; // soft background from color
          const [priceLow, priceHigh] = service.priceRange || [0, 0];
          const priceDisplay = priceLow === 0 ? 'Free' : `Starting at $${priceLow}`;
          const priceNote = priceLow > 0 ? `Range $${priceLow}–$${priceHigh}+` : null;
          const durationHrs = service.baseMinutes / 60;
          const minHrs = service.minHours || 2;

          return (
            <AnimatedSection key={key} delay={i * 0.05}>
              <div
                className="rounded-3xl border overflow-hidden"
                style={{ borderColor: color + '30', background: bgColor }}
              >
                <div className="p-7 sm:p-9">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ background: color }} />
                        <h2 className="font-heading text-2xl font-semibold text-charcoal">{service.label}</h2>
                      </div>
                      {service.sublabel && (
                        <p className="font-logo text-base ml-6" style={{ color }}>{service.sublabel}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-heading text-xl font-semibold text-charcoal">{priceDisplay}</p>
                      <p className="font-body text-xs text-charcoal/60 font-light">
                        {minHrs}–{Math.round(durationHrs) + 1} hrs typical
                      </p>
                      {priceNote && (
                        <p className="font-body text-[10px] text-charcoal/40 font-light mt-0.5">{priceNote}</p>
                      )}
                    </div>
                  </div>

                  <p className="font-body text-sm text-charcoal/75 font-light leading-relaxed mb-5">
                    {service.description}
                  </p>

                  {/* FIX: Use real task options from SERVICE_CONFIG as focus items */}
                  {service.taskOptions && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {service.taskOptions.slice(1, 7).map(task => ( // skip 'Help Me Choose', show first 6
                        <span
                          key={task}
                          className="px-3 py-1 rounded-full text-xs font-body font-light text-charcoal/75 border"
                          style={{ borderColor: color + '40', background: '#ffffff80' }}
                        >
                          {task}
                        </span>
                      ))}
                    </div>
                  )}

                  {service.disclaimer && (
                    <p className="font-body text-xs text-charcoal/40 font-light italic mb-4">
                      {service.disclaimer}
                    </p>
                  )}

                  <Link
                    to={`/book?service=${key}`}
                    className="inline-block text-white font-body text-xs tracking-wide px-6 py-2.5 rounded-full transition-all duration-300 hover:opacity-90"
                    style={{ background: color }}
                  >
                    Book {service.label} →
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          );
        })}
      </div>

      {/* Hours note */}
      <AnimatedSection>
        <div className="max-w-4xl mx-auto px-6 pb-16">
          <div
            className="rounded-2xl p-6 text-center"
            style={{ background: 'linear-gradient(135deg, #fef0ee, #eef8ea)', border: '1px solid #fcd5ce50' }}
          >
            <p className="font-body text-sm text-charcoal/75 font-light">
              <strong className="font-semibold text-charcoal">Service hours:</strong> 10:00 AM – 6:00 PM
              <span className="mx-3 text-charcoal/20">·</span>
              Members enjoy priority scheduling from 9:00 AM
              <span className="mx-3 text-charcoal/20">·</span>
              No Sundays
            </p>
          </div>
        </div>
      </AnimatedSection>
    </main>
  );
}
