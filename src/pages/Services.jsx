import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '@/components/shared/AnimatedSection';
import PageHero from '@/components/shared/PageHero';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';

// Display order for services page (excludes consult — shown separately as hero CTA)
const SERVICE_ORDER = [
  'errands',
  'senior_support',
  'mothers_helper',
  'meal_prep',
  'home_reset',
  'organization',
];

// Color story moves from light to deeper warmth while keeping services ordered by starting price.
// Consult keeps its original color from bookingConfig.
const COLOR_OVERRIDES = {
  errands: '#DDE8D5',
  senior_support: '#E8E3C2',
  mothers_helper: '#F1D4B5',
  meal_prep: '#EFB988',
  home_reset: '#EB9486',
  organization: '#B58A90',
};

const ACCENT_COLOR_OVERRIDES = {
  errands: '#6F8065',
  senior_support: '#7E7A55',
  mothers_helper: '#9A6F45',
  meal_prep: '#B9784B',
  home_reset: '#B9655D',
  organization: '#8F6870',
};

const SERVICE_IMAGES = {
  errands: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=80',
  mothers_helper: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1400&q=80',
  home_reset: '/images/home-reset-dishes.png',
};

function getRandomTaskChips(taskOptions, limit = 6) {
  return [...taskOptions]
    .filter(task => task !== 'Help Me Choose' && task !== "Help Me Choose - I'm Overwhelmed")
    .sort(() => Math.random() - 0.5)
    .slice(0, limit);
}

export default function Services() {
  // Null guard — consult may be missing during dev or config refactor
  const consult = SERVICE_CONFIG['consult'] ?? null;

  const taskChipsByService = useMemo(() => {
    return SERVICE_ORDER.reduce((acc, key) => {
      const taskOptions = SERVICE_CONFIG[key]?.taskOptions;
      acc[key] = taskOptions ? getRandomTaskChips(taskOptions) : [];
      return acc;
    }, {});
  }, []);

  return (
    <main className="min-h-screen" style={{ background: '#F7FAF4' }}>
      <PageHero
        eyebrow="Household Support Services"
        title="Services Built Around Your Life"
        script="Start with the thing that feels heaviest."
        description="Pick the kind of support you need, answer a few simple questions, and get a custom visit estimate before anything is finalized. No judgment, no pressure, just practical backup."
        background="#F8E8E2"
        waveFill="#F7FAF4"
        scriptColor="#8F6870"
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/book"
            className="inline-block text-white font-body text-sm tracking-wide px-10 py-4 rounded-full transition-all duration-300 hover:shadow-xl"
            style={{ background: '#333333' }}
          >
            Start Your Custom Quote →
          </Link>
          <Link
            to="/book?service=consult"
            className="inline-block font-body text-sm tracking-wide px-10 py-4 rounded-full border transition-all duration-300 hover:bg-white/60"
            style={{ color: '#333333', borderColor: '#33333333' }}
          >
            Book Free Consult
          </Link>
        </div>
      </PageHero>

      <section className="max-w-5xl mx-auto px-6 pt-10 pb-2">
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              ['Choose your support', 'Start with errands, resets, meals, family help, companion support, or organizing.'],
              ['Build your visit', 'Select focus areas and add-ons so the quote reflects real life, not a generic package.'],
              ['Get breathing room', 'You’ll know the estimated time, starting price, and next step before you book.'],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-3xl border p-5" style={{ background: '#FFFFFF', borderColor: '#DDE8D5' }}>
                <p className="font-body text-xs tracking-[0.22em] uppercase font-light mb-2" style={{ color: '#33333399' }}>{title}</p>
                <p className="font-body text-sm leading-relaxed font-light" style={{ color: '#333333' }}>{copy}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* Free Consult Banner — only renders if consult config exists */}
      {consult && (
        <div className="max-w-5xl mx-auto px-6 pt-8 pb-4">
          <AnimatedSection>
            <div
              className="rounded-[2rem] border p-7 sm:p-9 flex flex-col sm:flex-row sm:items-center gap-6 shadow-sm"
              style={{ borderColor: consult.color + '35', background: '#FFFFFF' }}
            >
              <div className="flex-1">
                <p className="font-body text-xs tracking-[0.22em] uppercase font-light mb-2" style={{ color: '#33333399' }}>Not sure where to begin?</p>
                <div className="flex items-center gap-3 mb-1">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: consult.color }} />
                  <h2 className="font-heading text-2xl font-semibold text-charcoal">{consult.label}</h2>
                </div>
                <p className="font-logo text-xl ml-6 mb-3" style={{ color: consult.color }}>
                  A free 15-minute call to figure it out together.
                </p>
                <p className="font-body text-base text-charcoal font-light leading-relaxed">{consult.description}</p>
                {consult.scheduleNote && (
                  <p className="font-body text-sm text-charcoal/70 font-light mt-3 italic">
                    ⏰ {consult.scheduleNote}
                  </p>
                )}
              </div>
              <div className="shrink-0 text-center sm:text-right">
                <p className="font-heading text-3xl font-semibold text-charcoal mb-1">Free</p>
                <p className="font-body text-sm text-charcoal/70 font-light mb-4">15 min call</p>
                <Link
                  to="/book?service=consult"
                  className="inline-block text-white font-body text-sm tracking-wide px-7 py-3 rounded-full transition-all duration-300 hover:opacity-90"
                  style={{ background: consult.color }}
                >
                  Book Free Consult →
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      )}

      {/* Service Cards */}
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {SERVICE_ORDER.map((key, i) => {
          const service = SERVICE_CONFIG[key];
          if (!service) return null;
          const color = COLOR_OVERRIDES[key] || service.color;
          const accentColor = ACCENT_COLOR_OVERRIDES[key] || service.color;
          const serviceImage = SERVICE_IMAGES[key];
          const [priceLow] = service.priceRange || [0, 0];
          const priceDisplay = priceLow === 0 ? 'Free' : `Starting at $${priceLow}`;
          const durationHrs = service.baseMinutes / 60;
          const minHrs = service.minHours || 2;
          const taskChips = taskChipsByService[key] || [];

          return (
            <AnimatedSection key={key} delay={i * 0.05}>
              <div
                className="rounded-[2rem] border overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
                style={{ borderColor: accentColor + '35', background: '#FFFFFF' }}
              >
                <div className="h-3" style={{ background: color }} />
                {serviceImage && (
                  <div className="h-56 sm:h-64 overflow-hidden relative" style={{ background: `linear-gradient(135deg, ${color}66, ${accentColor}33)` }}>
                    <img
                      src={serviceImage}
                      alt={`${service.label} service preview`}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      onError={(event) => { event.currentTarget.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 opacity-20" style={{ background: accentColor }} />
                  </div>
                )}
                <div className="p-7 sm:p-9">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-5">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ background: accentColor }} />
                        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal">{service.label}</h2>
                      </div>
                      {service.sublabel && (
                        <p className="font-logo text-xl ml-6" style={{ color: accentColor }}>{service.sublabel}</p>
                      )}
                    </div>
                    <div className="sm:text-right shrink-0 rounded-2xl px-4 py-3" style={{ background: color + '55' }}>
                      <p className="font-heading text-xl font-semibold text-charcoal">{priceDisplay}</p>
                      <p className="font-body text-sm text-charcoal/75 font-light">
                        {minHrs}–{Math.round(durationHrs) + 1} hrs typical
                      </p>
                    </div>
                  </div>

                  <p className="font-body text-base text-charcoal font-light leading-relaxed mb-6 max-w-3xl">
                    {service.description}
                  </p>

                  {taskChips.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-7">
                      {taskChips.map(task => (
                        <span
                          key={task}
                          className="px-3 py-1.5 rounded-full text-sm font-body font-light text-charcoal border"
                          style={{ borderColor: accentColor + '30', background: color + '30' }}
                        >
                          {task}
                        </span>
                      ))}
                    </div>
                  )}

                  {service.disclaimer && (
                    <p className="font-body text-sm text-charcoal/70 font-light italic mb-5 leading-relaxed">
                      {service.disclaimer}
                    </p>
                  )}

                  <Link
                    to={`/book?service=${key}`}
                    className="inline-block text-white font-body text-sm tracking-wide px-7 py-3 rounded-full transition-all duration-300 hover:opacity-90"
                    style={{ background: accentColor }}
                  >
                    Build a quote for {service.label} →
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          );
        })}
      </div>

      <AnimatedSection>
        <div className="max-w-5xl mx-auto px-6 pb-16">
          <div
            className="rounded-[2rem] p-6 text-center border"
            style={{ background: '#FFFFFF', borderColor: '#DDE8D5' }}
          >
            <p className="font-body text-base text-charcoal font-light leading-relaxed">
              <strong className="font-semibold text-charcoal">Service hours:</strong> 10:00 AM – 6:00 PM
              <span className="mx-3 text-charcoal/20">·</span>
              Monday – Saturday
              <span className="mx-3 text-charcoal/20">·</span>
              No Sundays
            </p>
          </div>
        </div>
      </AnimatedSection>
    </main>
  );
}
