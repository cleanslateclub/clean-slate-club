import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '@/components/shared/AnimatedSection';
import PageHero from '@/components/shared/PageHero';
import WaveDivider from '@/components/shared/WaveDivider';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';

// Display order: least expensive services to most expensive.
const SERVICE_ORDER = [
  'errands',
  'senior_support',
  'mothers_helper',
  'organization',
  'home_reset',
  'meal_prep',
];

// Service card colors move lightest to darkest down the page.
const COLOR_OVERRIDES = {
  errands: '#DFE3A2',
  senior_support: '#CAE7B9',
  mothers_helper: '#F3DE8A',
  organization: '#EFB988',
  home_reset: '#EB9486',
  meal_prep: '#B58A90',
};

const ACCENT_COLOR_OVERRIDES = {
  errands: '#8B93A7',
  senior_support: '#7E7F9A',
  mothers_helper: '#B58A90',
  organization: '#B58A90',
  home_reset: '#7E7F9A',
  meal_prep: '#7E7F9A',
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
    <main className="min-h-screen" style={{ background: '#FDFCFB' }}>
      <PageHero
        eyebrow="Services"
        title="Pick Your Backup."
        script="Start where it feels heaviest."
        description="Choose the support you need, build a visit around real life, and get an estimate before anything is finalized."
        waveFill="#F7FAF4"
        scriptColor="#EB9486"
      />

      <section style={{ background: '#F7FAF4' }}>
        {/* Free Consult Banner — only renders if consult config exists */}
        {consult && (
          <div className="max-w-5xl mx-auto px-6 pt-10 pb-4">
            <AnimatedSection>
              <div className="rounded-[2rem] overflow-hidden border h-full" style={{ background: '#FFFFFFCC', borderColor: '#8B93A740', boxShadow: '0 18px 45px #8B93A715' }}>
                <div className="p-7 sm:p-9 text-center" style={{ background: '#F1F1F1' }}>
                  <p className="font-body text-xs tracking-[0.28em] uppercase font-light mb-3" style={{ color: '#33333399' }}>Not sure where to begin?</p>
                  <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-charcoal mb-2">{consult.label}</h2>
                  <p className="font-logo text-xl" style={{ color: '#7E7F9A' }}>
                    A quick call to figure it out together.
                  </p>
                </div>

                <div className="p-7 sm:p-9">
                  <p className="font-body text-base text-charcoal font-light leading-relaxed mb-5">{consult.description}</p>
                  <p className="font-body text-sm text-charcoal/70 font-light mb-7 italic">
                    Bring the messy version. We’ll talk through what feels heaviest, what your home actually needs, and whether a standard service or custom visit makes the most sense.
                  </p>
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
      </section>

      <WaveDivider fill="#FDFCFB" flip />

      {/* Service Cards */}
      <section style={{ background: '#FDFCFB' }}>
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
                  style={{ borderColor: accentColor + '35', background: '#FFFFFF' }}
                >
                  <div className="h-3" style={{ background: color }} />
                  <div className="p-7 sm:p-9" style={{ background: color + '24' }}>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-5">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="w-3 h-3 rounded-full shrink-0" style={{ background: color }} />
                          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal">{service.label}</h2>
                        </div>
                        {service.sublabel && (
                          <p className="font-logo text-xl ml-6" style={{ color: accentColor }}>{service.sublabel}</p>
                        )}
                      </div>
                      <div className="sm:text-right shrink-0 rounded-2xl px-4 py-3 border" style={{ background: '#FFFFFFCC', borderColor: accentColor + '24' }}>
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
                            style={{ borderColor: accentColor + '30', background: '#FFFFFFCC' }}
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
      </section>

      <WaveDivider fill="#F1F1F1" />

      <section style={{ background: '#F1F1F1' }}>
        <AnimatedSection>
          <div className="max-w-5xl mx-auto px-6 pb-16 pt-8">
            <div
              className="rounded-[2rem] p-6 text-center border"
              style={{ background: '#FFFFFF', borderColor: '#B58A9035' }}
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
      </section>
    </main>
  );
}