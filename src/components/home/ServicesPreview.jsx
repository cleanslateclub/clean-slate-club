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

const IconQuestion = () =>
<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
    <circle cx="16" cy="16" r="11" />
    <path d="M13 12a3 3 0 116 0c0 3-3 3-3 6" />
    <path d="M16 23h.01" strokeWidth="2" />
  </svg>;

const CARD_TINT = '1F';
const SECTION_BACKGROUND = '#F9FCF7';

const categories = [{
  iconKey: 'home',
  name: 'Home Reset',
  tagline: 'For the house that got away from you.',
  desc: 'Laundry, dishes, toy pickup, clutter clearing, beds, surfaces — the reset that helps you breathe again.',
  color: '#EB9486',
  bg: `#EB9486${CARD_TINT}`,
  glow: '#EFB988',
  img: '/images/home-reset-dishes.png.png'
},
{
  iconKey: 'family',
  name: 'Family Logistics',
  tagline: 'The invisible load, handled.',
  desc: 'School prep, activity bags, household planning, organizing the chaos behind the calendar.',
  color: '#EFB988',
  bg: `#EFB988${CARD_TINT}`,
  glow: '#CAE7B9',
  img: '/images/errands.jpg'
},
{
  iconKey: 'bag',
  name: 'Errands & Appointments',
  tagline: 'For all the things you keep putting off.',
  desc: 'Returns, pickups, drop-offs, grocery runs, pharmacy stops, appointments, and little life logistics.',
  color: '#97A7B3',
  bg: `#97A7B3${CARD_TINT}`,
  glow: '#F3DE8A',
  img: '/images/errands2.jpg'
},
{
  iconKey: 'heart',
  name: 'Senior Support',
  tagline: 'Gentle, dignified home help.',
  desc: 'Caring household support for aging parents and seniors who want independence with a little backup.',
  color: '#B58A90',
  bg: `#B58A90${CARD_TINT}`,
  glow: '#DFE3A2',
  img: 'https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/11517496b_generated_image.png'
},
{
  iconKey: 'pot',
  name: 'Meal Prep & Kitchen Support',
  tagline: 'Nourishment made easier.',
  desc: "Simple meal prep, kitchen resets, grocery organization — so dinnertime isn't another source of stress.",
  color: '#7E7F9A',
  bg: `#7E7F9A${CARD_TINT}`,
  glow: '#F3DE8A',
  img: 'https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/40bbd83f8_generated_image.png'
}];

const customSupport = {
  iconKey: 'question',
  tagline: 'Not sure what you need?',
  desc: "Tell us what's going on and we'll build the right support for your home.",
  color: '#CAE7B9',
  bg: `#CAE7B9${CARD_TINT}`,
  img: '/images/laundry-mountain-reset.png',
  fit: ['Mixed household tasks', 'Oddball errands', 'Overwhelmed starts']
};

const iconMap = { home: IconHome, family: IconFamily, bag: IconBag, heart: IconHeart, pot: IconPot, question: IconQuestion };

export default function ServicesPreview() {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden" style={{ background: SECTION_BACKGROUND }}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="mb-14">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full" style={{ background: '#CAE7B9' }} />
            <span className="w-2 h-2 rounded-full" style={{ background: '#DFE3A2' }} />
            <span className="w-2 h-2 rounded-full" style={{ background: '#EB9486' }} />
            <p className="font-body tracking-[0.25em] uppercase font-light text-lg ml-2" style={{ color: '#333333' }}>WHAT WE OFFER</p>
          </div>
          <h2 className="font-heading text-[2.45rem] lg:text-[3.35rem] font-semibold text-charcoal mb-4 leading-tight">
            This isn't a cleaning menu.
          </h2>
          <p className="font-body text-base max-w-lg leading-relaxed font-light" style={{ color: '#333333b3' }}>
            It's practical support for the parts of home life that keep piling up.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.iconKey];
            return (
              <AnimatedSection key={cat.name} delay={i * 0.05}>
                <div className="group h-full rounded-[2rem] overflow-hidden border transition-all duration-500 hover:-translate-y-1 hover:shadow-xl" style={{ background: '#FFFFFF', borderColor: `${cat.color}35`, boxShadow: '0 14px 45px #8B93A712' }}>
                  <div className="relative h-48 overflow-hidden">
                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent, ${cat.color}55)` }} />
                  </div>
                  <div className="p-7" style={{ background: cat.bg }}>
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: '#FFFFFFCC', color: '#333333' }}><Icon /></span>
                      <span className="h-2 w-2 rounded-full" style={{ background: cat.color }} />
                    </div>
                    <h3 className="font-heading text-2xl font-semibold text-charcoal mb-1">{cat.name}</h3>
                    <p className="font-logo text-xl mb-4" style={{ color: cat.color }}>{cat.tagline}</p>
                    <p className="font-body text-sm leading-relaxed font-light" style={{ color: '#333333cc' }}>{cat.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}

          <AnimatedSection delay={0.3}>
            <div className="h-full rounded-[2rem] border p-7 flex flex-col justify-between" style={{ background: customSupport.bg, borderColor: '#CAE7B955', boxShadow: '0 14px 45px #8B93A712' }}>
              <div>
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full" style={{ background: '#FFFFFFCC', color: '#333333' }}>{React.createElement(iconMap[customSupport.iconKey])}</span>
                <p className="font-logo text-2xl mb-4" style={{ color: '#7E7F9A' }}>{customSupport.tagline}</p>
                <p className="font-body text-sm leading-relaxed font-light mb-5" style={{ color: '#333333cc' }}>{customSupport.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {customSupport.fit.map(item => <span key={item} className="rounded-full bg-white/70 px-3 py-1.5 font-body text-xs text-charcoal/70 font-light">{item}</span>)}
                </div>
              </div>
              <Link to="/services" className="mt-8 inline-block text-center text-white font-body text-sm tracking-wide px-6 py-3 rounded-full transition-all duration-300 hover:opacity-90" style={{ background: '#333333' }}>
                Explore Services →
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
