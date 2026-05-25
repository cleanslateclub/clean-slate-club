import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../shared/AnimatedSection';
import WaveDivider from '../shared/WaveDivider';

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
  color: '#c0796b',
  bg: '#ffd7ba55',
  img: 'https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/da8d3ccb1_generated_image.png'
},
{
  iconKey: 'family',
  name: "Mother's Helper Support",
  tagline: 'An extra pair of trusted hands.',
  desc: 'Postpartum support, newborn household help, school-age routines. For the season when you need backup.',
  color: '#b06e61',
  bg: '#fce4df55',
  img: 'https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/989f1fb47_generated_image.png'
},
{
  iconKey: 'bag',
  name: 'Errands & Life Logistics',
  tagline: 'Outsource the running around.',
  desc: 'Groceries, pharmacy pickups, returns, drop-offs — the errand list that eats your day, handled.',
  color: '#4a7a62',
  bg: '#cae8d855',
  img: 'https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/eacb9a810_generated_image.png'
},
{
  iconKey: 'heart',
  name: 'Senior Support',
  tagline: 'Gentle, dignified home help.',
  desc: 'Caring household support for aging parents and seniors who want independence with a little backup.',
  color: '#8c6068',
  bg: '#e8d8d855',
  img: 'https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/11517496b_generated_image.png'
},
{
  iconKey: 'pot',
  name: 'Meal Prep & Kitchen Support',
  tagline: 'Nourishment made easier.',
  desc: "Simple meal prep, kitchen resets, grocery organization — so dinnertime isn't another source of stress.",
  color: '#a07830',
  bg: '#fec89a48',
  img: 'https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/40bbd83f8_generated_image.png'
}];


const iconMap = { home: IconHome, family: IconFamily, bag: IconBag, heart: IconHeart, pot: IconPot };

export default function ServicesPreview() {
  return (
    <div>
    <WaveDivider fill="#fdf3f0" />
    <section className="py-24 lg:py-36 relative overflow-hidden" style={{ background: '#fdf3f0' }}>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle, #cae8d8 0%, transparent 65%)', transform: 'translate(-20%, 20%)' }} />
      <div className="absolute top-0 right-0 w-[350px] h-[350px] rounded-full opacity-25 pointer-events-none" style={{ background: 'radial-gradient(circle, #ffd7ba 0%, transparent 65%)', transform: 'translate(20%, -20%)' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="mb-16">
          <p className="font-body tracking-[0.25em] uppercase mb-4 font-light text-[hsl(var(--foreground))] text-lg">WHAT WE OFFER</p>
          <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-charcoal mb-4 leading-tight">
            This isn't a cleaning menu.
          </h2>
          <p className="font-body text-base text-charcoal/50 max-w-lg leading-relaxed font-light">
            It's household support — organized around your life, your family, and what actually needs to happen.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) =>
          <AnimatedSection key={cat.name} delay={i * 0.1}>
              <div
              className="group rounded-3xl border overflow-hidden hover:shadow-lg transition-all duration-500 h-full flex flex-col"
              style={{ background: '#fdfcfb', borderColor: '#f0ebe8' }}>
              
                {cat.img &&
              <div className="h-44 overflow-hidden">
                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
              }
                <div className="p-7 flex flex-col flex-1" style={{ background: cat.bg }}>
                  <div className="mb-3" style={{ color: cat.color }}>{React.createElement(iconMap[cat.iconKey])}</div>
                  <h3 className="font-heading text-lg font-semibold mb-1" style={{ color: '#3a3330' }}>{cat.name}</h3>
                  <p className="font-body text-sm font-light mb-3" style={{ color: cat.color }}>{cat.tagline}</p>
                  <p className="font-body text-sm leading-relaxed font-light flex-1" style={{ color: '#6b5e58' }}>{cat.desc}</p>
                </div>
              </div>
            </AnimatedSection>
          )}

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
                style={{ background: 'rgba(255,255,255,0.6)', borderColor: '#fcd5ce', color: '#9a5f55' }}>
                
                See All Services →
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
    <WaveDivider fill="#fdf3f0" flip />
    </div>);

}