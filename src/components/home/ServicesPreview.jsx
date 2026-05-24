import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../shared/AnimatedSection';

const categories = [
  {
    icon: '🏠',
    name: 'Home Resets',
    tagline: 'Your home, caught up.',
    desc: 'From the Sunday Scaries package to full-home resets — we bring your space back to baseline so you can breathe.',
    color: '#EFB988',
    bg: '#EFB98815',
  },
  {
    icon: '👶',
    name: "Mother's Helper Support",
    tagline: 'An extra pair of trusted hands.',
    desc: 'Postpartum support, newborn household help, school-age routines. For the season when you need backup.',
    color: '#EB9486',
    bg: '#EB948615',
  },
  {
    icon: '🛍️',
    name: 'Errands & Life Logistics',
    tagline: 'Outsource the running around.',
    desc: 'Groceries, pharmacy pickups, returns, drop-offs — the errand list that eats your day, handled.',
    color: '#CAE7B9',
    bg: '#CAE7B920',
  },
  {
    icon: '💛',
    name: 'Senior Support',
    tagline: 'Gentle, dignified home help.',
    desc: 'Caring household support for aging parents and seniors who want independence with a little backup.',
    color: '#B58A90',
    bg: '#B58A9015',
  },
  {
    icon: '🍽️',
    name: 'Meal Prep & Kitchen Support',
    tagline: 'Nourishment made easier.',
    desc: "Simple meal prep, kitchen resets, grocery organization — so dinnertime isn't another source of stress.",
    color: '#F3DE8A',
    bg: '#F3DE8A20',
  },
];

export default function ServicesPreview() {
  return (
    <section className="py-24 lg:py-36 relative overflow-hidden" style={{ background: '#CAE7B908' }}>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #DFE3A2 0%, transparent 70%)', transform: 'translate(-20%, 20%)' }} />
      <div className="absolute top-0 right-0 w-[350px] h-[350px] rounded-full opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle, #97A7B3 0%, transparent 70%)', transform: 'translate(20%, -20%)' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="mb-16">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-coral/70 mb-4 font-light">What We Offer</p>
          <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-charcoal mb-4 leading-tight">
            This isn't a cleaning menu.
          </h2>
          <p className="font-body text-base text-charcoal/50 max-w-lg leading-relaxed font-light">
            It's household support — organized around your life, your family, and what actually needs to happen.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <AnimatedSection key={cat.name} delay={i * 0.1}>
              <div
                className="group p-7 rounded-3xl border border-taupe/20 hover:shadow-xl transition-all duration-500 h-full flex flex-col"
                style={{ backgroundColor: cat.bg }}
              >
                <div className="text-3xl mb-4">{cat.icon}</div>
                <h3 className="font-heading text-xl font-semibold text-charcoal mb-1">{cat.name}</h3>
                <p className="font-body text-sm font-light mb-3" style={{ color: cat.color }}>{cat.tagline}</p>
                <p className="font-body text-sm text-charcoal/50 leading-relaxed font-light flex-1">{cat.desc}</p>
              </div>
            </AnimatedSection>
          ))}

          {/* CTA card */}
          <AnimatedSection delay={0.5}>
            <div className="p-7 rounded-3xl text-white flex flex-col justify-between h-full min-h-[200px]" style={{ background: 'linear-gradient(135deg, #EB9486 0%, #B58A90 100%)' }}>
              <div>
                <p className="font-body text-xs tracking-[0.2em] uppercase text-white/60 mb-3 font-light">Custom Support</p>
                <h3 className="font-heading text-xl font-semibold mb-3">Not sure what you need?</h3>
                <p className="font-body text-sm text-white/70 leading-relaxed font-light">Tell us what's going on and we'll build the right support for your home.</p>
              </div>
              <Link
                to="/services"
                className="inline-block mt-6 bg-white/20 hover:bg-white/30 text-white font-body text-sm tracking-wide px-6 py-3 rounded-full transition-all duration-300 text-center"
              >
                See All Services →
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}