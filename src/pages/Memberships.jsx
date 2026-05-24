import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/shared/AnimatedSection';
import { Check } from 'lucide-react';

const memberships = [
  {
    name: 'The Maintenance Mode',
    price: '$299–499',
    period: '/month',
    description: '2 visits per month to keep your home in rhythm. For the woman who just needs a little backup.',
    features: [
      '2 scheduled resets per month',
      'Priority booking windows',
      'Member pricing on add-ons',
      'Text-based scheduling',
    ],
  },
  {
    name: 'The Weekly Wipeout',
    price: '$499–899',
    period: '/month',
    description: 'Weekly reset service. Consistency that changes everything for families who need it.',
    features: [
      'Weekly home reset',
      'Priority scheduling',
      'Member pricing on all services',
      'Seasonal perks & surprises',
      'Referral rewards',
    ],
    featured: true,
  },
  {
    name: 'The Soft Life',
    price: '$899–1,500',
    period: '/month',
    description: 'The premium membership. Resets, errands, laundry, organization — the full support system.',
    features: [
      'Everything in Weekly Wipeout',
      'Errand & grocery support',
      'Organization projects included',
      'VIP same-day scheduling',
      'Seasonal deep resets',
      'Personal household concierge',
    ],
  },
];

const catchUpPerks = [
  'Priority booking — always',
  'Recurring visit scheduling',
  'Exclusive member pricing',
  'Seasonal perks & gifts',
  'Referral reward program',
  'First access to new services',
];

export default function Memberships() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <AnimatedSection>
            <p className="font-body text-xs tracking-[0.25em] uppercase text-olive mb-4">Memberships</p>
            <h1 className="font-heading text-5xl lg:text-6xl font-light text-charcoal mb-6">
              The <span className="italic text-clay">Catch-Up Club™</span>
            </h1>
            <p className="font-body text-lg text-charcoal/50 max-w-lg leading-relaxed">
              Recurring support for homes that deserve to stay ahead. Because one reset is great — but consistency? That's where the magic lives.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {memberships.map((tier, i) => (
              <AnimatedSection key={tier.name} delay={i * 0.12}>
                <div
                  className={`relative rounded-3xl border p-8 lg:p-10 h-full flex flex-col transition-all duration-500 ${
                    tier.featured
                      ? 'bg-blush/40 border-clay/25 shadow-xl shadow-clay/8'
                      : 'bg-warm-white/60 border-taupe/20 hover:shadow-lg'
                  }`}
                >
                  {tier.featured && (
                    <span className="absolute -top-3 left-8 font-body text-[10px] tracking-[0.2em] uppercase bg-clay text-warm-white px-4 py-1.5 rounded-full">
                      Most Popular
                    </span>
                  )}

                  <div className="mb-8">
                    <h3 className="font-heading text-2xl font-normal text-charcoal mb-3">{tier.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="font-heading text-3xl font-light text-clay">{tier.price}</span>
                      <span className="font-body text-sm text-charcoal/40">{tier.period}</span>
                    </div>
                    <p className="font-body text-sm text-charcoal/50 leading-relaxed mt-4">{tier.description}</p>
                  </div>

                  <ul className="space-y-3.5 flex-1 mb-10">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                        <span className="font-body text-sm text-charcoal/60">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/book"
                    className={`block text-center font-body text-sm tracking-wide py-4 rounded-full transition-all duration-300 ${
                      tier.featured
                        ? 'bg-clay text-warm-white hover:bg-clay/90'
                        : 'border border-charcoal/15 text-charcoal/70 hover:border-clay hover:text-clay'
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Catch-Up Club */}
      <section className="py-24 lg:py-32 bg-warm-white/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <p className="font-body text-xs tracking-[0.25em] uppercase text-olive mb-4">VIP Community</p>
              <h2 className="font-heading text-4xl lg:text-5xl font-light text-charcoal mb-6">
                The Catch-Up Club™
              </h2>
              <p className="font-body text-base text-charcoal/50 leading-relaxed mb-8">
                More than a membership — it's the emotional core of Clean Slate Club. A community of women who refuse to white-knuckle their way through the week anymore. Priority access, perks, and the peace of knowing your home is handled.
              </p>
              <ul className="space-y-3">
                {catchUpPerks.map((perk) => (
                  <li key={perk} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-clay shrink-0" />
                    <span className="font-body text-sm text-charcoal/60">{perk}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="rounded-3xl overflow-hidden">
                <img
                  src="https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/c405ea524_generated_0da9d4c9.png"
                  alt="Calming organized living room with sage green accents"
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32">
        <AnimatedSection className="text-center max-w-2xl mx-auto px-6">
          <h2 className="font-heading text-4xl font-light text-charcoal mb-4">
            Not sure which tier?
          </h2>
          <p className="font-body text-base text-charcoal/50 mb-8">
            Let's chat about what your home actually needs. No pressure, no sales pitch — just honest guidance.
          </p>
          <Link
            to="/book"
            className="inline-block bg-clay text-warm-white font-body text-sm tracking-wide px-10 py-4 rounded-full hover:bg-clay/90 transition-all duration-300"
          >
            Book a Consultation
          </Link>
        </AnimatedSection>
      </section>
    </div>
  );
}