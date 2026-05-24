import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/shared/AnimatedSection';
import WaveDivider from '../components/shared/WaveDivider';

const sectionBgs = ['#fdf8f2', '#fdf6f4', '#f0f6f2', '#f5f0f4', '#fffdf0'];
const waveFills = ['#fdf6f4', '#f0f6f2', '#f5f0f4', '#fffdf0', '#fdfcfb'];

const categories = [
  {
    name: 'Home Resets',
    color: '#EFB988',
    bg: '#EFB98818',
    services: [
      { name: 'The Monday Miracle', tagline: 'Start the week feeling human again.', price: '$225–450', desc: 'Our signature weekday-ready home reset — tackle the chaos before the week begins.', includes: ['Dishes', 'Laundry', 'Folding', 'Light tidying', 'Bed refresh', 'Kitchen reset', 'Trash out'], signature: true },
      { name: 'The Clean Slate', tagline: 'The full-home reset.', price: '$450–950', desc: 'A deep reset for your entire home — every room addressed.', includes: ['Every room', 'Deep laundry', 'Kitchen overhaul', 'Organization', 'Linen refresh', 'Styling touches'], signature: true },
      { name: 'Mess to Impress', tagline: 'Company-coming reset.', price: '$175–350', desc: 'Fast turnaround before guests arrive.', includes: ['Rapid declutter', 'Surface refresh', 'Bathroom touch-up', 'Kitchen reset', 'Fresh styling'] },
      { name: 'The Clean Getaway', tagline: 'Post-vacation recovery.', price: '$175–325', desc: 'Come home and actually relax.', includes: ['Unpacking', 'Laundry', 'Fridge reset', 'Kitchen recovery', 'Linen refresh'] },
    ],
  },
  {
    name: "Mother's Helper Support",
    color: '#EB9486',
    bg: '#EB948818',
    services: [
      { name: 'Pardon the Mess', tagline: 'No judgment. Just relief.', price: '$300–650', desc: 'Overwhelm recovery — postpartum, burnout, ADHD paralysis, life transitions.', includes: ['Full home support', 'Burnout recovery', 'ADHD help', 'Postpartum care', 'Life transitions'], signature: true },
      { name: 'The Newborn Reset', tagline: 'You just had a baby. Rest.', price: '$150–350', desc: 'Postpartum household support so you can focus on your baby and yourself.', includes: ['Laundry', 'Dishes', 'Light tidying', 'Meal prep support', 'Nursery reset'] },
    ],
  },
  {
    name: 'Errands & Life Logistics',
    color: '#CAE7B9',
    bg: '#CAE7B922',
    services: [
      { name: 'Errand Era', tagline: 'The running around, done.', price: '$35–125', desc: 'Groceries, pharmacy, returns, drop-offs — your list, handled.', includes: ['Grocery pickup', 'Pharmacy runs', 'Returns & drop-offs', 'Dry cleaning'] },
      { name: 'The Drop Off', tagline: 'Declutter without the hassle.', price: '$35–75', desc: 'Donation dropoff service — we handle the logistics.', includes: ['Donation drop-off', 'Pickup coordination'] },
    ],
  },
  {
    name: 'Senior Support',
    color: '#B58A90',
    bg: '#B58A9018',
    services: [
      { name: 'Gentle Home Support', tagline: 'Dignified, caring household help.', price: 'Custom', desc: 'Respectful, patient household assistance for seniors and aging parents who want independence with backup.', includes: ['Light housekeeping', 'Laundry', 'Grocery support', 'Kitchen help', 'Errand assistance'] },
      { name: 'Caregiver Relief', tagline: 'For the ones who support everyone.', price: 'Custom', desc: 'Household support for caregivers and families navigating health transitions.', includes: ['Household tasks', 'Meal prep', 'Laundry', 'Errands', 'Flexible scheduling'] },
    ],
  },
  {
    name: 'Meal Prep & Kitchen Support',
    color: '#F3DE8A',
    bg: '#F3DE8A28',
    services: [
      { name: 'The Sink or Swim', tagline: 'Kitchen rescue, no judgment.', price: '$85–150', desc: 'Full kitchen reset — dishes, counters, wipe-down, trash, refresh.', includes: ['Dishes', 'Counters', 'Wipe-down', 'Trash', 'Kitchen refresh'] },
      { name: 'Meal Prep Session', tagline: 'Nourishment made simple.', price: '$75–200', desc: 'Basic meal prep so weeknights aren\'t a source of stress.', includes: ['Ingredient prep', 'Simple meals', 'Kitchen cleanup', 'Portioning & storage'] },
    ],
  },
];

const addons = [
  { name: 'The Fold Rush', price: '$95–145', desc: 'Laundry mountain? I got you — wash, dry, fold.' },
  { name: 'The Load & Behold', price: '$150–250', desc: 'Full household laundry, linens, towels, folding.' },
  { name: 'Extra Load', price: '$20–35', desc: 'Additional laundry load' },
  { name: 'Put It Away', price: '$35–75', desc: 'Laundry put-away service' },
  { name: 'Fridge Refresh', price: '$45–85', desc: 'Clear out and reset your fridge' },
  { name: 'Pantry Party', price: '$75–250', desc: 'Pantry organization' },
  { name: 'Closet Comeback', price: '$150–400', desc: 'Closet swap/reset' },
  { name: 'Toy Story', price: '$65–150', desc: 'Toy organization' },
  { name: 'The Paper Trail', price: '$45–125', desc: 'Mail/paper sorting' },
  { name: 'Bedtime Reset', price: '$35–65', desc: 'Bed styling + linen refresh' },
];

export default function Services() {
  return (
    <div className="pt-20 bg-cream">
      {/* Hero */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #EFB988 0%, transparent 70%)', transform: 'translate(30%, -20%)' }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <AnimatedSection>
            <p className="font-body text-xs tracking-[0.25em] uppercase text-coral/70 mb-5 font-light">Our Services</p>
            <h1 className="font-heading text-5xl lg:text-6xl font-semibold text-charcoal mb-3 leading-tight">
              Support, not a service menu.
            </h1>
            <p className="font-logo text-2xl text-coral mb-6">Real help for real life.</p>
            <p className="font-body text-lg text-charcoal/45 max-w-lg leading-relaxed font-light">
              Every offering is designed to give you something back — time, peace, a clear counter, or just the ability to sit down without seeing something that needs doing.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <WaveDivider fill="#FDFBF8" />

      {/* Service Categories */}
      {categories.map((cat, ci) => (
        <section key={cat.name} className="py-16 lg:py-24" style={{ background: sectionBgs[ci] }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <AnimatedSection className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-px flex-1 max-w-[40px]" style={{ background: cat.color }} />
                <p className="font-body text-xs tracking-[0.25em] uppercase font-light" style={{ color: cat.color }}>{cat.name}</p>
              </div>
            </AnimatedSection>
            <div className="space-y-4">
              {cat.services.map((service, i) => (
                <AnimatedSection key={service.name} delay={i * 0.08}>
                  <div
                    className="group rounded-3xl border p-7 lg:p-9 transition-all duration-500 hover:shadow-xl"
                    style={{ backgroundColor: service.signature ? cat.bg : 'rgba(255,255,255,0.75)', borderColor: service.signature ? cat.color + '50' : cat.color + '25' }}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="font-heading text-2xl lg:text-3xl font-semibold text-charcoal">{service.name}</h3>
                          {service.signature && (
                            <span className="font-body text-[10px] tracking-[0.15em] uppercase px-3 py-1 rounded-full font-light" style={{ background: cat.color + '30', color: cat.color }}>
                              Signature
                            </span>
                          )}
                        </div>
                        <p className="font-logo text-base mb-3" style={{ color: cat.color }}>{service.tagline}</p>
                        <p className="font-body text-sm text-charcoal/45 mb-5 font-light">{service.desc}</p>
                        <div className="flex flex-wrap gap-2">
                          {service.includes.map((item) => (
                            <span key={item} className="font-body text-xs px-3 py-1.5 rounded-full border font-light" style={{ background: 'rgba(255,255,255,0.8)', borderColor: cat.color + '40', color: '#5a4e48' }}>
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="lg:text-right shrink-0">
                        <p className="font-heading text-2xl font-semibold" style={{ color: cat.color }}>{service.price}</p>
                        <p className="font-body text-xs text-charcoal/35 font-light mt-1 mb-3">Final price confirmed before we begin</p>
                        <Link to="/book" className="inline-block font-body text-sm tracking-wide px-6 py-2.5 rounded-full transition-all duration-300" style={{ background: cat.color + '18', color: cat.color, border: `1px solid ${cat.color}40` }}
                          onMouseEnter={e => { e.currentTarget.style.background = cat.color; e.currentTarget.style.color = 'white'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = cat.color + '18'; e.currentTarget.style.color = cat.color; }}
                        >
                          Book Now →
                        </Link>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
          {ci < categories.length - 1 && <WaveDivider fill={waveFills[ci + 1]} />}
        </section>
      ))}

      {/* Add-ons */}
      <section className="py-24 lg:py-32 bg-warm-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <AnimatedSection className="text-center mb-14">
            <p className="font-body text-xs tracking-[0.25em] uppercase text-coral/70 mb-4 font-light">Add-Ons</p>
            <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-charcoal mb-3">Make it yours.</h2>
            <p className="font-body text-base text-charcoal/45 font-light max-w-md mx-auto">Stack add-ons onto any service to build exactly the support you need.</p>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {addons.map((addon, i) => (
              <AnimatedSection key={addon.name} delay={i * 0.04}>
                <div className="p-5 rounded-2xl bg-cream border border-taupe/15 hover:border-coral/20 hover:shadow-md transition-all duration-300 h-full">
                  <h4 className="font-heading text-sm font-semibold text-charcoal mb-1">{addon.name}</h4>
                  <p className="font-body text-sm text-coral mb-1">{addon.price}</p>
                  <p className="font-body text-[11px] text-charcoal/35 font-light">{addon.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28" style={{ background: '#fdf6f4' }}>
        <AnimatedSection className="text-center max-w-2xl mx-auto px-6">
          <h2 className="font-heading text-4xl font-semibold text-charcoal mb-3">Not sure what you need?</h2>
          <p className="font-logo text-xl text-coral mb-3">That's exactly what the free consult is for.</p>
          <p className="font-body text-base text-charcoal/45 mb-2 font-light">Tell us what's going on and we'll figure it out together — no pressure, no judgment.</p>
          <p className="font-body text-sm text-charcoal/30 font-light mb-8">15 minutes. Free. No commitment.</p>
          <Link to="/book" className="inline-block bg-coral text-white font-body text-sm tracking-wide px-10 py-4 rounded-full hover:bg-coral/90 hover:shadow-lg hover:shadow-coral/25 transition-all duration-300">
            Book Now — It's Free
          </Link>
        </AnimatedSection>
      </section>
    </div>
  );
}