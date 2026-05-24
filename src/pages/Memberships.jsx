import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/shared/AnimatedSection';
import WaveDivider from '../components/shared/WaveDivider';
import { Check } from 'lucide-react';

const memberships = [
  {
    name: 'Maintenance Mode',
    price: '$299–499',
    period: '/month',
    description: '2 visits per month to keep your home in rhythm. For the woman who just needs a little consistent backup.',
    features: ['2 scheduled resets per month', 'Priority booking windows', 'Member pricing on add-ons', 'Text-based scheduling'],
    color: '#CAE7B9',
  },
  {
    name: 'The Weekly Wipeout',
    price: '$499–899',
    period: '/month',
    description: 'Weekly reset service. Consistency that changes everything for families who need it.',
    features: ['Weekly home reset', 'Priority scheduling', 'Member pricing on all services', 'Seasonal perks & surprises', 'Referral rewards'],
    featured: true,
    color: '#EB9486',
  },
  {
    name: 'The Soft Life',
    price: '$899–1,500',
    period: '/month',
    description: 'The premium membership. Resets, errands, laundry, organization — the full support system.',
    features: ['Everything in Weekly Wipeout', 'Errand & grocery support', 'Organization projects', 'VIP same-day scheduling', 'Seasonal deep resets', 'Personal household concierge'],
    color: '#B58A90',
  },
];

const perks = [
  'Priority booking — always',
  'Recurring visit scheduling',
  'Exclusive member pricing',
  'Seasonal perks & gifts',
  'Referral reward program',
  'First access to new services',
];

export default function Memberships() {
  return (
    <div className="pt-20 bg-cream">
      {/* Hero */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #B58A90 0%, transparent 70%)', transform: 'translate(30%, -20%)' }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <AnimatedSection>
            <p className="font-body text-xs tracking-[0.25em] uppercase text-coral/70 mb-5 font-light">Memberships</p>
            <h1 className="font-heading text-5xl lg:text-6xl font-semibold text-charcoal mb-2 leading-tight">
              The
            </h1>
            <h1 className="font-logo text-5xl lg:text-6xl text-coral mb-6" style={{ lineHeight: 1.1 }}>
              Catch-Up Club™
            </h1>
            <p className="font-body text-lg text-charcoal/45 max-w-lg leading-relaxed font-light">
              Recurring support for homes that deserve to stay ahead. Because one reset is great — but consistency? That's where the magic lives.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <WaveDivider fill="#FDFBF8" />

      {/* Tiers */}
      <section className="py-24 bg-warm-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {memberships.map((tier, i) => (
              <AnimatedSection key={tier.name} delay={i * 0.12}>
                <div className={`relative rounded-3xl border p-8 lg:p-10 h-full flex flex-col transition-all duration-500 ${
                  tier.featured ? 'text-white shadow-2xl scale-105' : 'bg-cream border-taupe/20 hover:shadow-lg'
                }`}
                style={tier.featured ? { background: 'linear-gradient(135deg, #EB9486, #B58A90)', borderColor: '#EB9486' } : {}}
                >
                  {tier.featured && (
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 font-body text-[10px] tracking-[0.2em] uppercase bg-charcoal text-white px-5 py-1.5 rounded-full whitespace-nowrap">
                      Most Popular
                    </span>
                  )}

                  <h3 className={`font-heading text-2xl font-semibold mb-3 ${tier.featured ? 'text-white' : 'text-charcoal'}`}>{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className={`font-heading text-3xl font-semibold ${tier.featured ? 'text-white' : 'text-coral'}`}>{tier.price}</span>
                    <span className={`font-body text-sm font-light ${tier.featured ? 'text-white/60' : 'text-charcoal/35'}`}>{tier.period}</span>
                  </div>
                  <p className={`font-body text-sm leading-relaxed mb-8 font-light ${tier.featured ? 'text-white/75' : 'text-charcoal/50'}`}>{tier.description}</p>

                  <ul className="space-y-3 flex-1 mb-10">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${tier.featured ? 'text-white/60' : 'text-sage'}`} />
                        <span className={`font-body text-sm font-light ${tier.featured ? 'text-white/75' : 'text-charcoal/55'}`}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/book"
                    className={`block text-center font-body text-sm tracking-wide py-4 rounded-full transition-all duration-300 ${
                      tier.featured ? 'bg-white text-coral hover:bg-white/90' : 'border border-coral/25 text-coral hover:bg-coral hover:text-white'
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

      <WaveDivider fill="#FAF7F2" flip />

      {/* Catch-Up Club perks */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <p className="font-body text-xs tracking-[0.25em] uppercase text-coral/70 mb-5 font-light">VIP Community</p>
              <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-charcoal mb-2">The Catch-Up Club™</h2>
              <p className="font-logo text-2xl text-coral mb-6">More than a membership.</p>
              <p className="font-body text-base text-charcoal/50 leading-relaxed font-light mb-8">
                A community of women who refuse to white-knuckle their way through the week anymore. Priority access, perks, and the deep peace of knowing your home is handled.
              </p>
              <ul className="space-y-3">
                {perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-coral shrink-0" />
                    <span className="font-body text-sm text-charcoal/55 font-light">{perk}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="relative">
                <div className="absolute -top-8 -left-8 w-[110%] h-[110%] rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #CAE7B9 30%, transparent 75%)' }} />
                <img
                  src="https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/c405ea524_generated_0da9d4c9.png"
                  alt="Calming organized living room"
                  className="relative w-full rounded-[2.5rem] object-cover aspect-[4/3] shadow-2xl shadow-charcoal/8"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <WaveDivider fill="#FDFBF8" />

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-warm-white">
        <AnimatedSection className="text-center max-w-2xl mx-auto px-6">
          <h2 className="font-heading text-4xl font-semibold text-charcoal mb-3">Not sure which tier?</h2>
          <p className="font-logo text-xl text-coral mb-6">Let's talk it through.</p>
          <p className="font-body text-base text-charcoal/45 mb-8 font-light">
            Book a free 15-minute Reset Consult and we'll find the perfect fit for your home and your life.
          </p>
          <Link to="/book" className="inline-block bg-coral text-white font-body text-sm tracking-wide px-10 py-4 rounded-full hover:bg-coral/90 hover:shadow-lg hover:shadow-coral/25 transition-all duration-300">
            Book Your Free Consult
          </Link>
        </AnimatedSection>
      </section>
    </div>
  );
}