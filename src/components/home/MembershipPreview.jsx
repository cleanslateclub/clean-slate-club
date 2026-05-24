import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../shared/AnimatedSection';

const tiers = [
  {
    name: 'The Maintenance Mode',
    price: '$299–499/mo',
    description: '2 visits per month to keep your home in rhythm.',
    features: ['Bi-monthly resets', 'Priority scheduling', 'Member pricing'],
  },
  {
    name: 'The Weekly Wipeout',
    price: '$499–899/mo',
    description: 'Weekly reset service for families who need the consistency.',
    features: ['Weekly home resets', 'Priority scheduling', 'Member pricing', 'Seasonal perks'],
    featured: true,
  },
  {
    name: 'The Soft Life',
    price: '$899–1,500/mo',
    description: 'The premium membership — resets, errands, laundry, and full support.',
    features: ['Everything included', 'Errand support', 'Organization help', 'VIP scheduling'],
  },
];

export default function MembershipPreview() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-olive mb-4">Memberships</p>
          <h2 className="font-heading text-4xl lg:text-5xl font-light text-charcoal mb-4">
            Join the <span className="italic text-clay">Catch-Up Club™</span>
          </h2>
          <p className="font-body text-base text-charcoal/50 max-w-lg mx-auto leading-relaxed">
            Recurring support for homes that deserve to stay ahead. Priority booking, member pricing, and seasonal perks.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {tiers.map((tier, i) => (
            <AnimatedSection key={tier.name} delay={i * 0.12}>
              <div
                className={`relative p-8 lg:p-10 rounded-3xl border transition-all duration-500 h-full flex flex-col ${
                  tier.featured
                    ? 'bg-blush/40 border-clay/20 shadow-xl shadow-clay/5'
                    : 'bg-warm-white/60 border-taupe/20 hover:border-clay/20 hover:shadow-lg'
                }`}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-8 font-body text-[10px] tracking-[0.2em] uppercase bg-clay text-warm-white px-4 py-1.5 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="font-heading text-2xl font-normal text-charcoal mb-2">{tier.name}</h3>
                <p className="font-body text-lg text-clay font-medium mb-3">{tier.price}</p>
                <p className="font-body text-sm text-charcoal/50 leading-relaxed mb-8">{tier.description}</p>
                <ul className="space-y-3 mb-10 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-sage mt-1.5 shrink-0" />
                      <span className="font-body text-sm text-charcoal/60">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/memberships"
                  className={`block text-center font-body text-sm tracking-wide py-3.5 rounded-full transition-all duration-300 ${
                    tier.featured
                      ? 'bg-clay text-warm-white hover:bg-clay/90'
                      : 'border border-charcoal/15 text-charcoal/70 hover:border-clay hover:text-clay'
                  }`}
                >
                  Learn More
                </Link>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}