import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../shared/AnimatedSection';

const IconMentalTabs = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M8 7h12l4 4v14H8z" />
    <path d="M20 7v5h5" />
    <path d="M12 14h8M12 18h8M12 22h4" />
    <path d="M6 11H4M6 17H4M6 23H4" />
  </svg>
);

const IconADHD = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M9 20c-2-1.5-3-3.7-3-6.2A7.8 7.8 0 0 1 14 6h4a7.8 7.8 0 0 1 8 7.8c0 2.5-1 4.7-3 6.2" />
    <path d="M12 21h8" />
    <path d="M13 25h6" />
    <path d="M12 12l3 3-3 3M20 12l-3 3 3 3" />
  </svg>
);

const IconRecovery = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M16 27s-9-5.5-9-13a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 7.5-9 13-9 13z" />
    <path d="M16 12v7M12.5 15.5h7" />
  </svg>
);

const IconCaregiving = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <circle cx="12" cy="10" r="3" />
    <circle cx="21" cy="12" r="3" />
    <path d="M6 25c.8-4 3-7 6-7s5.2 3 6 7" />
    <path d="M17 25c.5-3 2-5 4-5 2.3 0 4.2 2.4 5 5" />
    <path d="M15 17l3 3" />
  </svg>
);

const IconBaby = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M8 15a8 8 0 0 1 16 0v4a8 8 0 0 1-16 0z" />
    <path d="M12 15h.01M20 15h.01" />
    <path d="M13 21c2 1.4 4 1.4 6 0" />
    <path d="M16 7c0-2 1-3 3-3" />
  </svg>
);

const IconErrands = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M9 9h14v17H9z" />
    <path d="M12 9a4 4 0 0 1 8 0" />
    <path d="M13 15h6M13 19h5" />
    <path d="M6 17l3-3M6 17l3 3" />
  </svg>
);

const IconRoom = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M6 26V8h20v18" />
    <path d="M10 26v-7h12v7" />
    <path d="M10 12h12" />
    <path d="M12 16h4M19 16h1" />
  </svg>
);

const IconMeals = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M9 5v10M13 5v10M11 15v12" />
    <path d="M23 5v22" />
    <path d="M20 5c0 5 6 5 6 0" />
    <path d="M7 22h8" />
  </svg>
);

function LogoLockup() {
  return (
    <div className="mb-5 flex items-baseline justify-center gap-2 leading-none">
      <span className="font-heading text-sm md:text-base font-semibold tracking-[0.22em] uppercase text-charcoal">Clean Slate</span>
      <span className="font-logo text-3xl md:text-4xl" style={{ color: '#EB9486', lineHeight: 1 }}>Club</span>
    </div>
  );
}

const painPoints = [
  {
    title: 'Mental tabs everywhere',
    prompt: 'Click if your brain is carrying the household tabs.',
    intro: 'The appointments, lunches, returns, laundry, groceries, medications, school notes, pet food, and tiny invisible tasks no one else seems to track.',
    color: '#DFE3A2',
    icon: IconMentalTabs,
    services: ['Hot Mess Express', 'The Runaround', 'Chaos Coordinator'],
    helps: ['Create a priority list for the visit', 'Move laundry, dishes, counters, and visible reset tasks forward', 'Handle pickup orders, returns, errands, and small household loose ends', 'Turn the mental pile into a practical plan for the day'],
  },
  {
    title: 'ADHD homes & stuck spaces',
    prompt: 'Click if the task is simple, but starting is not.',
    intro: 'The room you keep avoiding because every pile requires a decision. The reset you want, but cannot start because your brain is already over capacity.',
    color: '#CAE7B9',
    icon: IconADHD,
    services: ['Room Service', 'Hot Mess Express', 'Help Me Choose'],
    helps: ['Break the space into small, doable zones', 'Sort obvious categories without overcomplicating the project', 'Reset the highest-impact areas first', 'Help choose what to keep moving now and what can wait'],
  },
  {
    title: 'Recovery, grief & heavy seasons',
    prompt: 'Click if life is taking more than usual right now.',
    intro: 'New baby, surgery, burnout, divorce, loss, work stress, or a stretch of life where basic household support would change the whole day.',
    color: '#F3DE8A',
    icon: IconRecovery,
    services: ['Hot Mess Express', 'Clean Plate Club', 'The Runaround'],
    helps: ['Keep dishes, laundry, and kitchen basics from piling up', 'Prepare simple food support or reset the fridge/pantry', 'Run errands or pick up essentials', 'Lighten the home load while your energy is needed elsewhere'],
  },
  {
    title: 'Aging parents & caregiving',
    prompt: 'Click if you are supporting another household too.',
    intro: 'When your own home needs care, but so does a parent, grandparent, neighbor, or loved one who needs check-ins, errands, meals, or practical help.',
    color: '#EFB988',
    icon: IconCaregiving,
    services: ['The Check-In', 'The Runaround', 'Clean Plate Club'],
    helps: ['Companion-style check-ins within non-medical scope', 'Errands, grocery pickup, appointment support, and household resets', 'Light meal prep and kitchen support', 'Help with the practical tasks that make caregiving feel less scattered'],
  },
  {
    title: 'Postpartum or new baby season',
    prompt: 'Click if the house did not pause when the baby arrived.',
    intro: 'Bottles, laundry, snacks, dishes, older kids, recovery, sleep deprivation, and the strange pressure to keep the home moving while you are still healing.',
    color: '#EB9486',
    icon: IconBaby,
    services: ['Chaos Coordinator', 'Clean Plate Club', 'Hot Mess Express'],
    helps: ['Baby and toddler support within scope', 'Children’s laundry, lunch packing, and playroom resets', 'Kitchen reset, snack prep, and simple meal support', 'Recovery-focused household help without judgment'],
  },
  {
    title: 'Undone errands',
    prompt: 'Click if the running-around is eating the whole week.',
    intro: 'The returns, pickups, drop-offs, grocery order, post office, pharmacy, school item, and appointment logistics that seem small until they own your day.',
    color: '#B58A90',
    icon: IconErrands,
    services: ['The Runaround', 'Chaos Coordinator', 'Custom Support'],
    helps: ['Pickup orders and returns', 'Grocery support and supply runs with provided funds', 'Appointment and activity transportation when approved', 'A cleaner plan for what has to happen first'],
  },
  {
    title: 'The room you keep avoiding',
    prompt: 'Click if one space is quietly stressing you out.',
    intro: 'The bedroom corner, playroom, laundry area, kitchen counter, closet floor, or spare room that has become a holding zone for everything unfinished.',
    color: '#97A7B3',
    icon: IconRoom,
    services: ['Room Service', 'Hot Mess Express', 'Help Me Choose'],
    helps: ['Room reset and light organizing', 'Sort obvious piles into simple categories', 'Clear surfaces and make the space usable again', 'Identify what needs bins, labels, hangers, or a future deeper project'],
  },
  {
    title: 'Meals, lunches & kitchen',
    prompt: 'Click if food decisions are draining you.',
    intro: 'The lunch packing, snacks, fridge chaos, dinner ingredients, grocery list, and kitchen reset that decide whether the rest of the day feels manageable.',
    color: '#8B93A7',
    icon: IconMeals,
    services: ['Clean Plate Club', 'The Runaround', 'Chaos Coordinator'],
    helps: ['Lunch packing and snack prep', 'Simple meal prep and ingredient organization', 'Fridge refresh and kitchen reset', 'Grocery pickup or ingredient run with provided funds'],
  },
];

function SectionLabel({ label, center = true }) {
  return (
    <div className={`${center ? 'flex justify-center' : ''} mb-4`}>
      <div className="inline-flex items-center gap-2 max-w-full">
        <span className="w-2 h-2 rounded-full shrink-0 transition-transform duration-700 hover:scale-150" style={{ background: '#CAE7B9' }} />
        <span className="w-2 h-2 rounded-full shrink-0 transition-transform duration-700 hover:scale-150" style={{ background: '#DFE3A2' }} />
        <span className="w-2 h-2 rounded-full shrink-0 transition-transform duration-700 hover:scale-150" style={{ background: '#EB9486' }} />
        <p className="font-body tracking-[0.25em] uppercase font-light text-lg ml-2 leading-tight" style={{ color: '#333333' }}>{label}</p>
      </div>
    </div>
  );
}

function PainPointCard({ point, open, onToggle }) {
  const PointIcon = point.icon;
  return (
    <div
      className="rounded-[1.75rem] border overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
      style={{
        background: open ? '#FFFFFF' : `${point.color}2E`,
        borderColor: open ? `${point.color}AA` : '#33333314',
        boxShadow: open ? '0 18px 45px #8B93A71A' : '0 8px 24px #8B93A70D',
      }}
    >
      <button type="button" onClick={onToggle} className="group w-full text-left p-5 flex gap-4 items-start">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500 group-hover:scale-105" style={{ background: '#FFFFFFB8', borderColor: `${point.color}BB`, color: '#333333' }}>
          <PointIcon />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-heading text-lg font-semibold mb-1" style={{ color: '#333333' }}>{point.title}</h3>
              <p className="font-body text-xs font-light" style={{ color: '#33333399' }}>{point.prompt}</p>
            </div>
            <span className="font-logo text-3xl leading-none transition-transform duration-300" style={{ color: '#33333399', transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
          </div>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 md:ml-16 -mt-1 animate-in fade-in slide-in-from-top-2 duration-500">
          <p className="font-body text-sm leading-relaxed font-light mb-4" style={{ color: '#333333cc' }}>{point.intro}</p>
          <div className="rounded-2xl p-4 mb-4" style={{ background: `${point.color}25`, border: `1px solid ${point.color}70` }}>
            <p className="font-body text-[11px] tracking-[0.2em] uppercase font-light mb-3" style={{ color: '#33333399' }}>Ways we can help</p>
            <ul className="space-y-2">
              {point.helps.map(item => (
                <li key={item} className="flex gap-2 font-body text-sm font-light leading-relaxed" style={{ color: '#333333cc' }}>
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: point.color }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl p-4" style={{ background: '#FFFFFF', border: `1px solid ${point.color}70` }}>
            <p className="font-body text-[11px] tracking-[0.2em] uppercase font-light mb-3" style={{ color: '#33333399' }}>Suggested services</p>
            <div className="flex flex-wrap gap-2">
              {point.services.map(service => (
                <span key={service} className="rounded-full px-3 py-1.5 font-body text-xs font-light" style={{ background: `${point.color}35`, color: '#333333' }}>
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ConsultSection() {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden" style={{ background: '#FDF5E6' }}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="text-center max-w-3xl mx-auto">
          <SectionLabel label="WHEN HOME FEELS HEAVY" />
          <h2 className="font-heading text-[2.7rem] lg:text-[3.6rem] font-semibold text-charcoal mb-4 leading-tight">
            It is rarely just the mess.
          </h2>
          <p className="font-logo text-3xl md:text-4xl leading-tight" style={{ color: '#EB9486' }}>It is everything the mess represents.</p>
        </AnimatedSection>
      </div>
    </section>
  );
}

export function HeavyManifestoSection() {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden" style={{ background: '#F8E8E2' }}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <div className="max-w-5xl mx-auto rounded-[2.75rem] border bg-white p-7 md:p-10 lg:p-16 text-center relative overflow-hidden transition-all duration-700 hover:-translate-y-1" style={{ borderColor: '#33333318', boxShadow: '0 28px 80px #B58A901C' }}>
            <div className="absolute inset-x-10 top-0 h-px" style={{ background: '#EB948640' }} />
            <LogoLockup />
            <p className="font-heading text-3xl lg:text-4xl font-semibold text-charcoal leading-tight mb-7">
              Was built for the households carrying more than a to-do list.
            </p>
            <div className="mx-auto mb-7 h-px w-28" style={{ background: '#33333322' }} />
            <div className="space-y-5 font-body text-base lg:text-lg leading-relaxed font-light max-w-3xl mx-auto" style={{ color: '#333333b3' }}>
              <p>
                For the default parent. The ADHD household. The caregiver. The person recovering from surgery. The home moving through grief, burnout, school chaos, postpartum life, aging-parent stress, or a season that simply got too full.
              </p>
              <p>
                This is practical household support for the moments when the dishes are not just dishes, the laundry is not just laundry, and the errand is not just an errand. It is the mental load behind all of it.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

export function HeavySituationsSection() {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden" style={{ background: '#F5E6E9' }}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="text-center mb-10 max-w-3xl mx-auto">
          <div className="hidden sm:block">
            <SectionLabel label="DOES THIS SOUND LIKE YOUR HOUSE?" />
            <h2 className="font-heading text-[2.45rem] lg:text-[3.35rem] font-semibold text-charcoal mb-4 leading-tight">
              Find the support that fits your season.
            </h2>
            <p className="font-logo text-3xl md:text-4xl leading-tight" style={{ color: '#EB9486' }}>Open the one that feels most true.</p>
          </div>
          <div className="sm:hidden">
            <SectionLabel label="DOES THIS SOUND LIKE YOUR HOUSE?" />
            <h2 className="font-heading text-[2.05rem] font-semibold text-charcoal mb-4 leading-tight">
              Need help, but not sure where to start?
            </h2>
            <p className="font-body text-base leading-relaxed font-light max-w-md mx-auto" style={{ color: '#333333b3' }}>
              Choose the card that sounds most like your home right now. Each one connects the overwhelm to the services that can actually help.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.12}>
          <div className="max-w-5xl mx-auto rounded-[2.25rem] border bg-white/70 p-5 md:p-7 lg:p-8" style={{ borderColor: '#33333314', boxShadow: '0 18px 50px #8B93A711' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {painPoints.map((point, index) => (
                <AnimatedSection key={point.title} delay={0.04 * index}>
                  <PainPointCard
                    point={point}
                    open={openIndex === index}
                    onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
                  />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.22}>
          <div className="max-w-3xl mx-auto mt-12 rounded-[2rem] border bg-white p-7 text-center transition-all duration-700 hover:-translate-y-1" style={{ borderColor: '#33333318', boxShadow: '0 14px 40px #8B93A710' }}>
            <p className="font-logo text-2xl mb-2" style={{ color: '#EB9486' }}>You do not have to know what to ask for.</p>
            <p className="font-body text-sm leading-relaxed font-light mb-5" style={{ color: '#333333b3' }}>
              That is part of the service. We help turn “everything feels like too much” into a realistic home reset, errand plan, family support visit, meal prep day, or custom household support session that actually fits your life.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/services"
                className="inline-block font-body text-sm tracking-wide px-8 py-3 rounded-full transition-all duration-300 hover:opacity-90 hover:shadow-lg text-center"
                style={{ background: '#333333', color: '#FFFFFF' }}>
                Explore Services
              </Link>
              <Link
                to="/about"
                className="inline-block font-body text-sm tracking-wide px-8 py-3 rounded-full border transition-all duration-300 hover:bg-white text-center"
                style={{ color: '#333333', borderColor: '#33333330' }}>
                Why We Built This
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
