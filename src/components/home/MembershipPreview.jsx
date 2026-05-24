import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../shared/AnimatedSection';

const tiers = [
  {
    name: 'Maintenance Mode',
    price: '$299–499',
    period: '/mo',
    desc: '2 visits per month. For the woman who just needs a little consistent backup.',
    features: ['Bi-monthly resets', 'Priority scheduling', 'Member pricing'],
    dotColor: '#CAE7B9',
  },
  {
    name: 'Weekly Wipeout',
    price: '$499–899',
    period: '/mo',
    desc: 'Weekly reset service. Consistency that changes everything.',
    features: ['Weekly home resets', 'Priority scheduling', 'Member pricing', 'Seasonal perks'],
    featured: true,
    dotColor: '#EB9486',
  },
  {
    name: 'The Soft Life',
    price: '$899–1,500',
    period: '/mo',
    desc: 'Resets, errands, laundry, organization — the full support system.',
    features: ['Everything included', 'Errand support', 'Organization help', 'VIP scheduling'],
    dotColor: '#B58A90',
  },
];

export default function MembershipPreview() {
  return (
    <section className="py-24 lg:py-36 relative overflow-hidden" style={{ background: '#8B93A708' }}>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, #8B93A730 0%, transparent 70%)', transform: 'translate(30%, 20%)' }} />
      <div className="absolute top-0 left-0 w-[350px] h-[350px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, #7E7F9A20 0%, transparent 70%)', transform: 'translate(-20%, -20%)' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="text-center mb-14">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-coral/70 mb-4 font-light">Memberships</p>
          <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-charcoal mb-3">
            Join the <span className="font-logo font-normal" style={{ color: '#EB9486' }}>Catch-Up Club™</span>
          </h2>
          <p className="font-body text-base text-charcoal/45 max-w-md mx-auto leading-relaxed font-light">
            Recurring support for homes that deserve to stay ahead. Priority booking, member pricing, and seasonal perks.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {tiers.map((tier, i) => (
            <AnimatedSection key={tier.name} delay={i * 0.12}>
              <div
                className="relative p-8 lg:p-10 rounded-3xl border h-full flex flex-col transition-all duration-500"
                style={tier.featured
                  ? { background: 'linear-gradient(135deg, #EB9486 0%, #B58A90 100%)', borderColor: 'transparent', transform: 'scale(1.04)', boxShadow: '0 20px 60px #EB948630' }
                  : { background: '#f1f1f1', borderColor: '#DCDCDC' }
                }
              >
                {tier.featured && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 font-body text-[10px] tracking-[0.2em] uppercase bg-charcoal text-white px-5 py-1.5 rounded-full whitespace-nowrap">
                    Most Popular
                  </span>
                )}
                <h3 className={`font-heading text-xl font-semibold mb-2 ${tier.featured ? 'text-white' : 'text-charcoal'}`}>{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className={`font-heading text-3xl font-semibold ${tier.featured ? 'text-white' : 'text-coral'}`}>{tier.price}</span>
                  <span className={`font-body text-sm font-light ${tier.featured ? 'text-white/60' : 'text-charcoal/35'}`}>{tier.period}</span>
                </div>
                <p className={`font-body text-sm leading-relaxed mb-8 font-light flex-1 ${tier.featured ? 'text-white/75' : 'text-charcoal/50'}`}>{tier.desc}</p>
                <ul className="space-y-2.5 mb-8">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: tier.featured ? 'rgba(255,255,255,0.6)' : tier.dotColor }} />
                      <span className={`font-body text-sm font-light ${tier.featured ? 'text-white/75' : 'text-charcoal/55'}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/memberships"
                  className={`block text-center font-body text-sm tracking-wide py-3.5 rounded-full transition-all duration-300 ${
                    tier.featured ? 'bg-white text-coral hover:bg-white/90' : 'border text-coral hover:bg-coral hover:text-white'
                  }`}
                  style={!tier.featured ? { borderColor: '#EB948640' } : {}}
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