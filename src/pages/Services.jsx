import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '@/components/shared/PageHero';
import AnimatedSection from '@/components/shared/AnimatedSection';
import WaveDivider from '@/components/shared/WaveDivider';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';

const SERVICE_ORDER = ['home_reset', 'meal_prep', 'mothers_helper', 'senior_support', 'errands', 'organization'];

const COLOR_OVERRIDES = {
  home_reset: '#EB9486',
  meal_prep: '#F3DE8A',
  mothers_helper: '#EFB988',
  senior_support: '#B58A90',
  errands: '#CAE7B9',
  organization: '#7E7F9A',
};

const ACCENT_COLOR_OVERRIDES = {
  home_reset: '#EB9486',
  meal_prep: '#8B93A7',
  mothers_helper: '#EFB988',
  senior_support: '#B58A90',
  errands: '#8B93A7',
  organization: '#7E7F9A',
};

const SOFT_GREEN_TINT = '#CAE7B91F';
const FOOTER_COLOR = '#333333';
const CARD_TINT = '1F';

const SERVICE_EXAMPLE_CHIPS = {
  errands: {
    preview: ['Grocery pickup', 'Pharmacy runs', 'Returns & shipping', 'Donation dropoff', 'Dry cleaning', 'Gift errands'],
    more: ['Household supply runs', 'Pet supply pickup', 'Appointment transportation', 'Activity pickup', 'Marketplace pickups', 'Personal shopping'],
  },
  senior_support: {
    preview: ['Friendly check-ins', 'Companionship', 'Grocery support', 'Prescription pickup', 'Laundry help', 'Meal portioning'],
    more: ['Appointment rides', 'Waiting room support', 'Mail assistance', 'Technology help', 'Light kitchen help', 'Pet feeding'],
  },
  mothers_helper: {
    preview: ['School pickup', 'Activity transportation', 'Baby & toddler support', 'Lunch packing', 'Children’s laundry', 'Playroom reset'],
    more: ['Snack prep', 'Child bedroom reset', 'Postpartum support', 'Recovery support', 'Errand assistance', 'Grocery help'],
  },
  organization: {
    preview: ['Pantry zones', 'Closet reset', 'Toy organization', 'Paper sorting', 'Donation prep', 'Laundry room reset'],
    more: ['Bathroom cabinets', 'Kitchen drawers', 'Linen closet', 'Office reset', 'Storage labeling', 'Household systems'],
  },
  home_reset: {
    preview: ['Kitchen reset', 'Laundry catch-up', 'Dish reset', 'Living room tidy', 'Bed linen change', 'Entryway reset'],
    more: ['Bathroom surface refresh', 'Toy pickup', 'Mail sorting', 'Trash & recycling', 'Supply restock', 'Guest room prep'],
  },
  meal_prep: {
    preview: ['Produce prep', 'Protein prep', 'School lunches', 'Smoothie packs', 'Freezer meals', 'Snack stations'],
    more: ['Breakfast prep', 'Family dinners', 'Pantry restock', 'Fridge refresh', 'Meal portioning', 'Labeling & storage'],
  },
};

const CTA_CLASS = 'inline-flex w-full items-center justify-center text-center text-white font-body text-sm tracking-wide px-5 py-3 rounded-full transition-all duration-300 hover:opacity-90 hover:shadow-lg sm:w-auto sm:px-7';
const CTA_STYLE = { background: '#333333' };

function ServiceHoursCard() {
  return (
    <AnimatedSection>
      <div className="max-w-5xl mx-auto px-5 sm:px-6 pt-6 sm:pt-8">
        <div
          className="rounded-[1.5rem] sm:rounded-[2rem] border px-5 py-4 sm:px-7 sm:py-5 text-center shadow-sm"
          style={{ background: '#FFFFFFCC', borderColor: '#B58A9035', boxShadow: '0 12px 30px #8B93A710' }}
        >
          <p className="font-body text-[11px] uppercase tracking-[0.2em] text-charcoal/45 font-light mb-2">
            Service hours
          </p>
          <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-3 font-body text-sm sm:text-base text-charcoal/75 font-light leading-relaxed">
            <span><strong className="font-semibold text-charcoal">10:00 AM – 6:00 PM</strong></span>
            <span className="hidden sm:inline text-charcoal/20">·</span>
            <span>Monday – Saturday</span>
            <span className="hidden sm:inline text-charcoal/20">·</span>
            <span>No Sundays</span>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

function ExampleChips({ serviceKey, accentColor }) {
  const [expanded, setExpanded] = useState(false);
  const chipData = SERVICE_EXAMPLE_CHIPS[serviceKey];
  if (!chipData) return null;

  const chips = expanded ? [...chipData.preview, ...chipData.more] : chipData.preview;

  return (
    <div className="mb-6">
      <p className="font-body text-[11px] uppercase tracking-[0.18em] text-charcoal/45 font-light mb-2">
        Examples
      </p>
      <div className="flex flex-wrap gap-2">
        {chips.map(chip => (
          <span
            key={chip}
            className="inline-flex items-center rounded-full border px-3 py-1.5 font-body text-xs font-light text-charcoal/75"
            style={{ background: '#FFFFFFB8', borderColor: `${accentColor}40` }}
          >
            {chip}
          </span>
        ))}
        <button
          type="button"
          onClick={() => setExpanded(prev => !prev)}
          className="inline-flex items-center rounded-full border px-3 py-1.5 font-body text-xs font-medium transition-all duration-200 hover:shadow-sm"
          style={{ background: `${accentColor}${CARD_TINT}`, borderColor: `${accentColor}66`, color: '#333333' }}
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : '+ More'}
        </button>
      </div>
    </div>
  );
}

export default function Services() {
  // Null guard — consult may be missing during dev or config refactor
  const consult = SERVICE_CONFIG['consult'] ?? null;

  return (
    <main className="min-h-screen overflow-hidden" style={{ background: SOFT_GREEN_TINT }}>
      <PageHero
        eyebrow="Services"
        title="Pick Your Backup."
        script="Start where it feels heaviest."
        description="Choose the support you need, build a visit around real life, and get an estimate before anything is finalized."
        waveFill={SOFT_GREEN_TINT}
        scriptColor="#EB9486"
      />

      <section style={{ background: SOFT_GREEN_TINT }}>
        <ServiceHoursCard />

        {/* Free Consult Banner — only renders if consult config exists */}
        {consult && (
          <div className="max-w-5xl mx-auto px-5 sm:px-6 pt-5 pb-2 sm:pt-6 sm:pb-4">
            <AnimatedSection>
              <div className="rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden border h-full" style={{ background: '#FFFFFFCC', borderColor: '#8B93A740', boxShadow: '0 18px 45px #8B93A715' }}>
                <div className="p-5 sm:p-9 text-center" style={{ background: '#F1F1F1' }}>
                  <p className="font-body text-[11px] sm:text-xs tracking-[0.24em] sm:tracking-[0.28em] uppercase font-light mb-2 sm:mb-3" style={{ color: '#33333399' }}>Not sure where to begin?</p>
                  <h2 className="font-heading text-2xl sm:text-4xl font-semibold text-charcoal mb-1 sm:mb-2">{consult.label}</h2>
                  <p className="font-logo text-lg sm:text-xl" style={{ color: '#7E7F9A' }}>
                    A quick call to figure it out together.
                  </p>
                </div>

                <div className="p-5 sm:p-9">
                  <p className="font-body text-sm sm:text-base text-charcoal font-light leading-relaxed mb-4 sm:mb-5">{consult.description}</p>
                  <p className="font-body text-sm text-charcoal/70 font-light mb-5 sm:mb-7 italic leading-relaxed">
                    Bring the messy version. We’ll talk through what feels heaviest, what your home actually needs, and whether a standard service or custom visit makes the most sense.
                  </p>
                  <Link
                    to="/book?service=consult"
                    className={CTA_CLASS}
                    style={CTA_STYLE}
                  >
                    <span className="sm:hidden">Free Consult →</span>
                    <span className="hidden sm:inline">Book Free Consult →</span>
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        )}
      </section>

      {/* Service Cards */}
      <section style={{ background: SOFT_GREEN_TINT }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-6 pt-5 pb-14 sm:pt-8 sm:pb-20 space-y-5 sm:space-y-6">
          {SERVICE_ORDER.map((key, i) => {
            const service = SERVICE_CONFIG[key];
            if (!service) return null;
            const color = COLOR_OVERRIDES[key] || service.color;
            const accentColor = ACCENT_COLOR_OVERRIDES[key] || service.color;
            const [priceLow] = service.priceRange || [0, 0];
            const priceDisplay = priceLow === 0 ? 'Free' : `Starting at $${priceLow}`;
            const durationHrs = service.baseMinutes / 60;
            const minHrs = service.minHours || 2;

            return (
              <AnimatedSection key={key} delay={i * 0.05}>
                <div
                  className="rounded-[1.75rem] sm:rounded-[2rem] border overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
                  style={{ borderColor: accentColor + '35', background: '#FFFFFF' }}
                >
                  <div className="h-2.5 sm:h-3" style={{ background: color }} />
                  <div className="p-5 sm:p-9" style={{ background: color + CARD_TINT }}>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-5 mb-5">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="w-3 h-3 rounded-full shrink-0" style={{ background: color }} />
                          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-charcoal">{service.label}</h2>
                        </div>
                        {service.sublabel && (
                          <p className="font-logo text-lg sm:text-xl ml-6" style={{ color: accentColor }}>{service.sublabel}</p>
                        )}
                      </div>
                      <div className="sm:text-right shrink-0 rounded-2xl px-4 py-3 border" style={{ background: '#FFFFFFCC', borderColor: accentColor + CARD_TINT }}>
                        <p className="font-heading text-lg sm:text-xl font-semibold text-charcoal">{priceDisplay}</p>
                        <p className="font-body text-sm text-charcoal/75 font-light">
                          {minHrs}–{Math.round(durationHrs) + 1} hrs typical
                        </p>
                      </div>
                    </div>

                    <p className="font-body text-sm sm:text-base text-charcoal font-light leading-relaxed mb-6 max-w-3xl">
                      {service.description}
                    </p>

                    <ExampleChips serviceKey={key} accentColor={accentColor} />

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
                      <span className="sm:hidden">Build My Quote →</span>
                      <span className="hidden sm:inline">Build a quote for {service.label} →</span>
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </section>

      <div className="relative" style={{ background: SOFT_GREEN_TINT }}>
        <WaveDivider fill={FOOTER_COLOR} className="!-mt-10 !h-10 sm:!-mt-12 sm:!h-12 lg:!-mt-14 lg:!h-14" />
        <div className="h-2" style={{ background: FOOTER_COLOR }} aria-hidden="true" />
      </div>
    </main>
  );
}
