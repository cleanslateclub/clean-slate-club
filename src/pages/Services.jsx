import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/shared/AnimatedSection';

const services = [
  {
    name: 'The Fold Rush',
    tagline: 'Laundry mountain? I got you.',
    price: '$95–145',
    description: 'Complete laundry reset service.',
    includes: ['Wash', 'Dry', 'Fold', 'Basket organization'],
    addon: 'Optional: put-away service',
  },
  {
    name: 'The Sink or Swim',
    tagline: 'Kitchen rescue, no judgment.',
    price: '$85–150',
    description: 'Full kitchen reset service.',
    includes: ['Dishes', 'Counters', 'Wipe-down', 'Trash', 'Kitchen refresh'],
  },
  {
    name: 'The Clean Getaway',
    tagline: 'Post-vacation recovery.',
    price: '$175–325',
    description: 'Come home and actually relax.',
    includes: ['Unpacking', 'Laundry', 'Fridge reset', 'Kitchen recovery', 'Linen refresh'],
  },
  {
    name: 'Mess to Impress',
    tagline: 'Company-coming reset.',
    price: '$175–350',
    description: 'Fast turnaround home refresh before guests arrive.',
    includes: ['Rapid declutter', 'Surface refresh', 'Bathroom touch-up', 'Kitchen reset', 'Fresh styling'],
  },
  {
    name: 'The Load & Behold',
    tagline: 'Full laundry package.',
    price: '$150–250',
    description: 'Everything laundry — handled.',
    includes: ['All household laundry', 'Linens', 'Towels', 'Folding', 'Organization'],
  },
  {
    name: 'The Sunday Scaries',
    tagline: 'Start Monday feeling human again.',
    price: '$225–450',
    description: 'The signature package.',
    includes: ['Dishes', 'Laundry', 'Folding', 'Light tidying', 'Reset styling', 'Bed refresh', 'Trash out', 'Kitchen reset'],
    signature: true,
  },
  {
    name: 'Pardon the Mess',
    tagline: 'No judgment. Just relief.',
    price: '$300–650',
    description: 'Overwhelm recovery session.',
    includes: ['Burnout support', 'ADHD paralysis help', 'Postpartum recovery', 'Life transitions', 'Full home rescue'],
  },
  {
    name: 'The Clean Slate',
    tagline: 'The full-home reset.',
    price: '$450–950',
    description: 'The premium signature experience. A deep reset for your entire home.',
    includes: ['Every room addressed', 'Deep laundry reset', 'Kitchen overhaul', 'Organization', 'Bed & linen refresh', 'Styling & finishing touches'],
    signature: true,
  },
];

const addons = [
  { name: 'Extra Load', price: '$20–35' },
  { name: 'Put It Away', price: '$35–75', desc: 'Laundry put-away service' },
  { name: 'Fridge Refresh', price: '$45–85' },
  { name: 'Pantry Party', price: '$75–250', desc: 'Pantry organization' },
  { name: 'Closet Comeback', price: '$150–400', desc: 'Closet swap/reset' },
  { name: 'Toy Story', price: '$65–150', desc: 'Toy organization' },
  { name: 'The Paper Trail', price: '$45–125', desc: 'Mail/paper sorting' },
  { name: 'Errand Era', price: '$25–75', desc: 'Errands/grocery pickup' },
  { name: 'Bedtime Reset', price: '$35–65', desc: 'Bed styling + linen refresh' },
  { name: 'The Drop Off', price: '$35–75', desc: 'Donation dropoff' },
];

export default function Services() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <AnimatedSection>
            <p className="font-body text-xs tracking-[0.25em] uppercase text-olive mb-4">Our Services</p>
            <h1 className="font-heading text-5xl lg:text-6xl font-light text-charcoal mb-6">
              Experiences, not <span className="italic text-clay">chores.</span>
            </h1>
            <p className="font-body text-lg text-charcoal/50 max-w-lg leading-relaxed">
              Every service is designed to give you something back — time, peace, a clear counter, or just the ability to sit down without seeing something that needs doing.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Service List */}
      <section className="pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="space-y-6">
            {services.map((service, i) => (
              <AnimatedSection key={service.name} delay={i * 0.06}>
                <div
                  className={`group rounded-3xl border p-8 lg:p-10 transition-all duration-500 hover:shadow-xl hover:shadow-clay/5 ${
                    service.signature
                      ? 'bg-blush/30 border-clay/20'
                      : 'bg-warm-white/60 border-taupe/20 hover:border-clay/20'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-heading text-2xl lg:text-3xl font-normal text-charcoal">
                          {service.name}
                        </h3>
                        {service.signature && (
                          <span className="font-body text-[10px] tracking-[0.15em] uppercase bg-clay/10 text-clay px-3 py-1 rounded-full">
                            Signature
                          </span>
                        )}
                      </div>
                      <p className="font-heading text-base italic text-clay mb-3">{service.tagline}</p>
                      <p className="font-body text-sm text-charcoal/50 mb-5">{service.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {service.includes.map((item) => (
                          <span key={item} className="font-body text-xs text-charcoal/40 px-3 py-1.5 rounded-full bg-cream border border-taupe/15">
                            {item}
                          </span>
                        ))}
                      </div>
                      {service.addon && (
                        <p className="font-body text-xs text-sage mt-3 italic">{service.addon}</p>
                      )}
                    </div>
                    <div className="lg:text-right shrink-0">
                      <p className="font-heading text-2xl font-light text-clay">{service.price}</p>
                      <Link
                        to="/book"
                        className="inline-block mt-4 font-body text-sm text-charcoal/50 hover:text-clay border-b border-transparent hover:border-clay transition-all duration-300"
                      >
                        Book This →
                      </Link>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-24 lg:py-32 bg-warm-white/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <AnimatedSection className="text-center mb-16">
            <p className="font-body text-xs tracking-[0.25em] uppercase text-olive mb-4">Add-Ons</p>
            <h2 className="font-heading text-4xl lg:text-5xl font-light text-charcoal">
              Make it yours.
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {addons.map((addon, i) => (
              <AnimatedSection key={addon.name} delay={i * 0.04}>
                <div className="p-5 rounded-2xl bg-warm-white border border-taupe/15 hover:border-clay/20 hover:shadow-md transition-all duration-300 h-full">
                  <h4 className="font-heading text-base font-normal text-charcoal mb-1">{addon.name}</h4>
                  <p className="font-body text-sm text-clay mb-1">{addon.price}</p>
                  {addon.desc && (
                    <p className="font-body text-[11px] text-charcoal/40">{addon.desc}</p>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32">
        <AnimatedSection className="text-center max-w-2xl mx-auto px-6">
          <h2 className="font-heading text-4xl font-light text-charcoal mb-4">
            Not sure what you need?
          </h2>
          <p className="font-body text-base text-charcoal/50 mb-8">
            Tell us what's going on and we'll build the perfect reset for your home.
          </p>
          <Link
            to="/book"
            className="inline-block bg-clay text-warm-white font-body text-sm tracking-wide px-10 py-4 rounded-full hover:bg-clay/90 transition-all duration-300"
          >
            Book a Custom Reset
          </Link>
        </AnimatedSection>
      </section>
    </div>
  );
}