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

// Clean Slate Club brand palette: soft sage, linen, blush, peach, and coral.
const COLOR_OVERRIDES = {
  errands: '#D8E2DC',
  senior_support: '#ECE4DB',
  mothers_helper: '#FFE5D9',
  meal_prep: '#FFD7BA',
  home_reset: '#FEC5BB',
  organization: '#FCD5CE',
};

const ACCENT_COLOR_OVERRIDES = {
  errands: '#7F8F86',
  senior_support: '#9A877A',
  mothers_helper: '#C9896A',
  meal_prep: '#C77F5D',
  home_reset: '#B9655D',
  organization: '#B58A90',
};

const CTA_CLASS = 'inline-block text-white font-body text-sm tracking-wide px-7 py-3 rounded-full transition-all duration-300 hover:opacity-90 hover:shadow-lg';
const CTA_STYLE = { background: '#333333' };

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
    <main className="min-h-screen" style={{ background: '#F8EDEB' }}>
      <PageHero
        eyebrow="Services"
        title="Pick Your Backup."
        script="Start where it feels heaviest."
        description="Choose the support you need, build a visit around real life, and get an estimate before anything is finalized."
        background="#FAE1DD"
        waveFill="#F8EDEB"
        scriptColor="#B58A90"
      />

      {/* Free Consult Banner — only renders if consult config exists */}
      {consult && (
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-4">
          <AnimatedSection>
            <div
              className="rounded-[2rem] border p-7 sm:p-9 flex flex-col gap-6 shadow-sm"
              style={{ borderColor: '#FEC5BB', background: '#FFFFFF' }}
            >
              <div className="flex-1">
                <p className="font-body text-xs tracking-[0.22em] uppercase font-light mb-2" style={{ color: '#33333399' }}>Not sure where to begin?</p>
                <div className="flex items-center gap-3 mb-1">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ background: '#B58A90' }} />
                  <h2 className="font-heading text-2xl font-semibold text-charcoal">{consult.label}</h2>
                </div>
                <p className="font-logo text-xl ml-6 mb-3" style={{ color: '#B58A90' }}>
                  A free 15-minute call to figure it out together.
                </p>
                <p className="font-body text-base text-charcoal font-light leading-relaxed">{consult.description}</p>
                {consult.scheduleNote && (
                  <p className="font-body text-sm text-charcoal/70 font-light mt-3 italic">
                    ⏰ {consult.scheduleNote}
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="rounded-2xl px-4 py-3 border" style={{ background: '#F8EDEB', borderColor: '#FEC5BB' }}>
                  <p className="font-heading text-xl font-semibold text-charcoal">Free</p>
                  <p className="font-body text-sm text-charcoal/75 font-light">15 min call</p>
                </div>
                <Link
                  to="/book?service=consult"
                  className={CTA_CLASS}
                  style={CTA_STYLE}
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
          const [priceLow] = service.priceRange || [0, 0];
          const priceDisplay = priceLow === 0 ? 'Free' : `Starting at $${priceLow}`;
          const durationHrs = service.baseMinutes / 60;
          const minHrs = service.minHours || 2;
          const taskChips = taskChipsByService[key] || [];

          return (
            <AnimatedSection key={key} delay={i * 0.05}>
              <div
                className="rounded-[2rem] border overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
                style={{ borderColor: accentColor + '30', background: '#FFFFFF' }}
              >
                <div className="h-3" style={{ background: color }} />
                <div className="p-7 sm:p-9" style={{ background: color + '55' }}>
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
                    <div className="sm:text-right shrink-0 rounded-2xl px-4 py-3 border" style={{ background: '#FFFFFF99', borderColor: accentColor + '22' }}>
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
                          style={{ borderColor: accentColor + '30', background: '#FFFFFF99' }}
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
                    className={CTA_CLASS}
                    style={CTA_STYLE}
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
            style={{ background: '#FFFFFF', borderColor: '#FEC5BB' }}
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
