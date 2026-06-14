import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../shared/AnimatedSection';
// Line-art SVG icons
const IconHome = () =>
<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
    <path d="M4 14L16 4l12 10v14a1 1 0 01-1 1H5a1 1 0 01-1-1V14z" />
    <path d="M12 29V19h8v10" />
  </svg>;

const IconFamily = () =>
<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
    <circle cx="11" cy="8" r="3.5" />
    <path d="M4 24c0-3.866 3.134-7 7-7h0c3.866 0 7 3.134 7 7" />
    <circle cx="22" cy="10" r="2.5" />
    <path d="M18 24c0-2.761 1.791-5 4-5s4 2.239 4 5" />
    <path d="M9 17.5c1-.4 2.5-.5 3.5 0" strokeWidth="1.2" />
    <circle cx="11" cy="19.5" r="1" fill="currentColor" stroke="none" />
  </svg>;

const IconBag = () =>
<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
    <path d="M7 10h18l-2 16H9L7 10z" />
    <path d="M12 10V8a4 4 0 018 0v2" />
    <path d="M12 16h8M12 20h5" />
  </svg>;

const IconHeart = () =>
<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
    <path d="M16 27S4 20 4 11.5A6.5 6.5 0 0116 8a6.5 6.5 0 0112 3.5C28 20 16 27 16 27z" />
    <path d="M16 8v4M12 12h8" strokeWidth="1.2" />
  </svg>;

const IconPot = () =>
<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
    <path d="M8 14h16v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-8z" />
    <path d="M6 14h20" />
    <path d="M12 14v-3a4 4 0 018 0v3" />
    <path d="M5 16H3M27 16h2" />
    <path d="M13 19v4M19 19v4" />
  </svg>;


const categories = [
{
  iconKey: 'home',
  name: 'Home Resets',
  tagline: 'Your home, caught up.',
  desc: 'Full home resets for when things have piled up — clutter, surfaces, kitchens, bathrooms. We bring your space back to baseline so you can breathe.',
  color: '#EB9486',
  bg: '#EB94861F',
  glow: '#FFE5D9',
  img: 'https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/da8d3ccb1_generated_image.png'
},
{
  iconKey: 'family',
  name: "Mother's Helper Support",
  tagline: 'An extra pair of trusted hands.',
  desc: 'Postpartum support, newborn household help, school-age routines. For the season when you need backup.',
  color: '#EFB985',
  bg: '#EFB98524',
  glow: '#F3DE8A',
  img: 'https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/a7a6109ac_generated_image.png'
},
{
  iconKey: 'bag',
  name: 'Errands & Life Logistics',
  tagline: 'Outsource the running around.',
  desc: 'Groceries, pharmacy pickups, returns, drop-offs — the errand list that eats your day, handled.',
  color: '#8B93A7',
  bg: '#8B93A71F',
  glow: '#CAE7B9',
  img: 'https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/ebc467ce8_generated_image.png'
},
{
  iconKey: 'heart',
  name: 'Senior Support',
  tagline: 'Gentle, dignified home help.',
  desc: 'Caring household support for aging parents and seniors who want independence with a little backup.',
  color: '#B58A90',
  bg: '#B58A9024',
  glow: '#DFE3A2',
  img: 'https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/11517496b_generated_image.png'
},
{
  iconKey: 'pot',
  name: 'Meal Prep & Kitchen Support',
  tagline: 'Nourishment made easier.',
  desc: "Simple meal prep, kitchen resets, grocery organization — so dinnertime isn't another source of stress.",
  color: '#7E7F9A',
  bg: '#7E7F9A1F',
  glow: '#F3DE8A',
  img: 'https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/40bbd83f8_generated_image.png'
}];


const iconMap = { home: IconHome, family: IconFamily, bag: IconBag, heart: IconHeart, pot: IconPot };

export default function ServicesPreview() {
  return (
    <section className="py-24 lg:py-36 relative overflow-hidden" style={{ background: '#F1F1F1' }}>
      <div className="absolute bottom-0 left-0 w-[520px] h-[520px] rounded-full opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle, #CAE7B9 0%, transparent 65%)', transform: 'translate(-20%, 20%)' }} />
      <div className="absolute top-0 right-0 w-[380px] h-[380px] rounded-full opacity-28 pointer-events-none" style={{ background: 'radial-gradient(circle, #FFE5D9 0%, transparent 65%)', transform: 'translate(20%, -20%)' }} />
      <div className="absolute top-1/2 right-1/4 w-[260px] h-[260px] rounded-full opacity-18 pointer-events-none" style={{ background: 'radial-gradient(circle, #DFE3A2 0%, transparent 68%)' }} />
      <div className="absolute bottom-24 right-8 w-[220px] h-[220px] rounded-full opacity-16 pointer-events-none" style={{ background: 'radial-gradient(circle, #97A7B3 0%, transparent 68%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="mb-16">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full" style={{ background: '#CAE7B9' }} />
            <span className="w-2 h-2 rounded-full" style={{ background: '#DFE3A2' }} />
            <span className="w-2 h-2 rounded-full" style={{ background: '#EB9486' }} />
            <p className="font-body tracking-[0.25em] uppercase font-light text-lg ml-2" style={{ color: '#333333' }}>WHAT WE OFFER</p>
          </div>
          <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-charcoal mb-4 leading-tight">
            This isn't a cleaning menu.
          </h2>
          <p className="font-body text-base max-w-lg leading-relaxed font-light" style={{ color: '#333333b3' }}>
            It's household support — organized around your life, your family, and what actually needs to happen.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) =>
          <AnimatedSection key={cat.name} delay={i * 0.1}>
              <div
              className="group rounded-3xl border overflow-hidden hover:shadow-xl transition-all duration-500 h-full flex flex-col relative"
              style={{ background: '#FFFFFF', borderColor: cat.color + '35', boxShadow: `0 18px 45px ${cat.color}12` }}>
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: cat.color }} />
                <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-30 pointer-events-none" style={{ background: cat.glow }} />
              
                {cat.img &&
              <div className="h-44 overflow-hidden relative">
                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 opacity-20" style={{ background: cat.color }} />
                  </div>
              }
                <div className="p-7 flex flex-col flex-1 relative" style={{ background: cat.bg }}>
                  <div className="mb-3 w-12 h-12 rounded-2xl flex items-center justify-center border" style={{ color: cat.color, background: '#FFFFFFB3', borderColor: cat.color + '35' }}>{React.createElement(iconMap[cat.iconKey])}</div>
                  <h3 className="font-heading text-lg font-semibold mb-1" style={{ color: '#333333' }}>{cat.name}</h3>
                  <p className="font-body text-sm font-medium mb-3" style={{ color: cat.color }}>{cat.tagline}</p>
                  <p className="font-body text-sm leading-relaxed font-light flex-1" style={{ color: '#333333cc' }}>{cat.desc}</p>
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* CTA card */}
          <AnimatedSection delay={0.5}>
            <div className="p-7 rounded-3xl flex flex-col justify-between h-full min-h-[200px] border relative overflow-hidden hover:shadow-xl transition-all duration-500" style={{ background: '#FFFFFF', color: '#333333', borderColor: '#EFB98555', boxShadow: '0 18px 45px #EFB98514' }}>
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: '#EFB985' }} />
              <div className="absolute -top-14 -right-10 w-36 h-36 rounded-full opacity-35" style={{ background: '#FFE5D9' }} />
              <div className="absolute -bottom-14 -left-8 w-36 h-36 rounded-full opacity-35" style={{ background: '#CAE7B9' }} />
              <div className="relative z-10">
                <div className="mb-3 w-12 h-12 rounded-2xl flex items-center justify-center border font-logo text-2xl" style={{ color: '#EFB985', background: '#FFE5D980', borderColor: '#EFB98545' }}>?</div>
                <p className="font-body text-xs tracking-[0.2em] uppercase mb-3 font-light" style={{ color: '#8B93A7' }}>Custom Support</p>
                <h3 className="font-heading text-xl font-semibold mb-3" style={{ color: '#333333' }}>Not sure what you need?</h3>
                <p className="font-body text-sm leading-relaxed font-light" style={{ color: '#333333cc' }}>Tell us what's going on and we'll build the right support for your home.</p>
              </div>
              <Link
                to="/services"
                className="relative z-10 inline-block mt-6 font-body text-sm tracking-wide px-6 py-3 rounded-full transition-all duration-300 text-center border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 hover:shadow-sm"
                style={{ background: '#F3DE8A55', borderColor: '#EFB98555', color: '#333333', outlineColor: '#EFB985' }}>
                
                See All Services →
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
    );

}