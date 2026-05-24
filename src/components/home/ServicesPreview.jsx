import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../shared/AnimatedSection';

const categories = [
  {
    icon: '🏠',
    name: 'Home Resets',
    tagline: 'Your home, caught up.',
    desc: 'From the Sunday Scaries package to full-home resets — we bring your space back to baseline so you can breathe.',
    color: '#c0796b',
    bg: '#ffd7ba30',
    img: 'https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/da8d3ccb1_generated_image.png',
  },
  {
    icon: '👶',
    name: "Mother's Helper Support",
    tagline: 'An extra pair of trusted hands.',
    desc: 'Postpartum support, newborn household help, school-age routines. For the season when you need backup.',
    color: '#b06e61',
    bg: '#fce4df30',
    img: 'https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/989f1fb47_generated_image.png',
  },
  {
    icon: '🛍️',
    name: 'Errands & Life Logistics',
    tagline: 'Outsource the running around.',
    desc: 'Groceries, pharmacy pickups, returns, drop-offs — the errand list that eats your day, handled.',
    color: '#5a7a6a',
    bg: '#d8e2dc30',
    img: 'https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/eacb9a810_generated_image.png',
  },
  {
    icon: '💛',
    name: 'Senior Support',
    tagline: 'Gentle, dignified home help.',
    desc: 'Caring household support for aging parents and seniors who want independence with a little backup.',
    color: '#8c6068',
    bg: '#ece4db30',
    img: 'https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/c2b4431f2_generated_image.png',
  },
  {
    icon: '🍽️',
    name: 'Meal Prep & Kitchen Support',
    tagline: 'Nourishment made easier.',
    desc: "Simple meal prep, kitchen resets, grocery organization — so dinnertime isn't another source of stress.",
    color: '#a07830',
    bg: '#fec89a28',
    img: 'https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/40bbd83f8_generated_image.png',
  },
];

export default function ServicesPreview() {
  return (
    <section className="py-24 lg:py-36 relative overflow-hidden" style={{ background: '#fdfcfb' }}>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #d8e2dc 0%, transparent 65%)', transform: 'translate(-20%, 20%)' }} />
      <div className="absolute top-0 right-0 w-[350px] h-[350px] rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #ffe5d9 0%, transparent 65%)', transform: 'translate(20%, -20%)' }} />

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
                className="group rounded-3xl border overflow-hidden hover:shadow-lg transition-all duration-500 h-full flex flex-col"
                style={{ background: '#fdfcfb', borderColor: '#f0ebe8' }}
              >
                {cat.img && (
                  <div className="h-44 overflow-hidden">
                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                )}
                <div className="p-7 flex flex-col flex-1" style={{ background: cat.bg }}>
                  <h3 className="font-heading text-lg font-semibold mb-1" style={{ color: '#3a3330' }}>{cat.name}</h3>
                  <p className="font-body text-sm font-light mb-3" style={{ color: cat.color }}>{cat.tagline}</p>
                  <p className="font-body text-sm leading-relaxed font-light flex-1" style={{ color: '#6b5e58' }}>{cat.desc}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}

          {/* CTA card */}
          <AnimatedSection delay={0.5}>
            <div className="p-7 rounded-3xl text-white flex flex-col justify-between h-full min-h-[200px]" style={{ background: 'linear-gradient(135deg, #fec5bb 0%, #fcd5ce 50%, #ece4db 100%)', color: '#3a3330' }}>
              <div>
                <p className="font-body text-xs tracking-[0.2em] uppercase mb-3 font-light" style={{ color: '#9a7060' }}>Custom Support</p>
                <h3 className="font-heading text-xl font-semibold mb-3" style={{ color: '#3a3330' }}>Not sure what you need?</h3>
                <p className="font-body text-sm leading-relaxed font-light" style={{ color: '#7a6560' }}>Tell us what's going on and we'll build the right support for your home.</p>
              </div>
              <Link
                to="/services"
                className="inline-block mt-6 font-body text-sm tracking-wide px-6 py-3 rounded-full transition-all duration-300 text-center border"
                style={{ background: 'rgba(255,255,255,0.6)', borderColor: '#fcd5ce', color: '#9a5f55' }}
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