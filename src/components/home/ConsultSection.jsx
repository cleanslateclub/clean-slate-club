import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../shared/AnimatedSection';

const IconTabs = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M8 7h16v18H8z" />
    <path d="M12 12h8M12 16h8M12 20h5" />
    <path d="M22 7l2 3M10 7l-2 3" />
  </svg>
);

const IconHome = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M5 14L16 5l11 9v13H5V14z" />
    <path d="M11 21h10M11 25h7" />
  </svg>
);

const IconCare = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M16 27s-9-5.5-9-13a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 7.5-9 13-9 13z" />
    <path d="M12 16h8" />
  </svg>
);

const painPoints = [
  {
    title: 'Mental tabs everywhere',
    prompt: 'Click if your brain is carrying the household tabs.',
    intro: 'The appointments, lunches, returns, laundry, groceries, medications, school notes, pet food, and tiny invisible tasks no one else seems to track.',
    color: '#DFE3A2',
    icon: IconTabs,
    helps: ['Create a priority list for the visit', 'Move laundry, dishes, counters, and visible reset tasks forward', 'Handle pickup orders, returns, errands, and small household loose ends', 'Turn the mental pile into a practical plan for the day'],
  },
  {
    title: 'ADHD homes & stuck spaces',
    prompt: 'Click if the task is simple, but starting is not.',
    intro: 'The room you keep avoiding because every pile requires a decision. The reset you want, but cannot start because your brain is already over capacity.',
    color: '#CAE7B9',
    icon: IconHome,
    helps: ['Break the space into small, doable zones', 'Sort obvious categories without overcomplicating the project', 'Reset the highest-impact areas first', 'Help choose what to keep moving now and what can wait'],
  },
  {
    title: 'Recovery, grief & heavy seasons',
    prompt: 'Click if life is taking more than usual right now.',
    intro: 'New baby, surgery, burnout, divorce, loss, work stress, or a stretch of life where basic household support would change the whole day.',
    color: '#F3DE8A',
    icon: IconCare,
    helps: ['Keep dishes, laundry, and kitchen basics from piling up', 'Prepare simple food support or reset the fridge/pantry', 'Run errands or pick up essentials', 'Lighten the home load while your energy is needed elsewhere'],
  },
  {
    title: 'Aging parents & caregiving',
    prompt: 'Click if you are supporting another household too.',
    intro: 'When your own home needs care, but so does a parent, grandparent, neighbor, or loved one who needs check-ins, errands, meals, or practical help.',
    color: '#EFB988',
    icon: IconCare,
    helps: ['Companion-style check-ins within non-medical scope', 'Errands, grocery pickup, appointment support, and household resets', 'Light meal prep and kitchen support', 'Help with the practical tasks that make caregiving feel less scattered'],
  },
  {
    title: 'Postpartum or new baby season',
    prompt: 'Click if the house did not pause when the baby arrived.',
    intro: 'Bottles, laundry, snacks, dishes, older kids, recovery, sleep deprivation, and the strange pressure to keep the home moving while you are still healing.',
    color: '#EB9486',
    icon: IconHome,
    helps: ['Baby and toddler support within scope', 'Children’s laundry, lunch packing, and playroom resets', 'Kitchen reset, snack prep, and simple meal support', 'Recovery-focused household help without judgment'],
  },
  {
    title: 'Undone errands',
    prompt: 'Click if the running-around is eating the whole week.',
    intro: 'The returns, pickups, drop-offs, grocery order, post office, pharmacy, school item, and appointment logistics that seem small until they own your day.',
    color: '#B58A90',
    icon: IconTabs,
    helps: ['Pickup orders and returns', 'Grocery support and supply runs with provided funds', 'Appointment and activity transportation when approved', 'A cleaner plan for what has to happen first'],
  },
  {
    title: 'The room you keep avoiding',
    prompt: 'Click if one space is quietly stressing you out.',
    intro: 'The bedroom corner, playroom, laundry area, kitchen counter, closet floor, or spare room that has become a holding zone for everything unfinished.',
    color: '#97A7B3',
    icon: IconHome,
    helps: ['Room reset and light organizing', 'Sort obvious piles into simple categories', 'Clear surfaces and make the space usable again', 'Identify what needs bins, labels, hangers, or a future deeper project'],
  },
  {
    title: 'Meals, lunches & kitchen',
    prompt: 'Click if food decisions are draining you.',
    intro: 'The lunch packing, snacks, fridge chaos, dinner ingredients, grocery list, and kitchen reset that decide whether the rest of the day feels manageable.',
    color: '#8B93A7',
    icon: IconCare,
    helps: ['Lunch packing and snack prep', 'Simple meal prep and ingredient organization', 'Fridge refresh and kitchen reset', 'Grocery pickup or ingredient run with provided funds'],
  },
];

const supportTags = [
  'home reset help',
  'household support',
  'family logistics',
  'errand support',
  'meal prep help',
  'recovery support',
  'busy moms',
  'Montgomery County homes'
];

function PainPointCard({ point, open, onToggle }) {
  const PointIcon = point.icon;
  return (
    <div className="rounded-3xl border overflow-hidden transition-all duration-300" style={{ background: open ? '#FFFFFF' : `${point.color}38`, borderColor: open ? '#33333322' : `${point.color}90`, boxShadow: open ? '0 16px 38px #8B93A714' : 'none' }}>
      <button type="button" onClick={onToggle} className="w-full text-left p-5 flex gap-4 items-start">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border" style={{ background: '#FFFFFFB3', borderColor: point.color, color: '#333333' }}>
          <PointIcon />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-heading text-lg font-semibold" style={{ color: '#333333' }}>{point.title}</h3>
              <p className="font-body text-xs font-light mt-1" style={{ color: '#33333399' }}>{point.prompt}</p>
            </div>
            <span className="font-logo text-3xl leading-none transition-transform duration-300" style={{ color: '#33333399', transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
          </div>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 ml-16 -mt-2">
          <p className="font-body text-sm leading-relaxed font-light mb-4" style={{ color: '#333333cc' }}>{point.intro}</p>
          <div className="rounded-2xl p-4" style={{ background: `${point.color}30` }}>
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
        </div>
      )}
    </div>
  );
}

export default function ConsultSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden" style={{ background: '#FDF5E6' }}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="mb-10 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="w-2 h-2 rounded-full" style={{ background: '#CAE7B9' }} />
            <span className="w-2 h-2 rounded-full" style={{ background: '#DFE3A2' }} />
            <span className="w-2 h-2 rounded-full" style={{ background: '#EB9486' }} />
            <p className="font-body tracking-[0.25em] uppercase font-light text-lg ml-2" style={{ color: '#333333' }}>WHEN HOME FEELS HEAVY</p>
          </div>
          <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-charcoal mb-3 leading-tight">
            It is rarely just the mess.
          </h2>
          <p className="font-logo text-2xl" style={{ color: '#EB9486' }}>It is everything the mess represents.</p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="max-w-5xl mx-auto rounded-[2.5rem] border bg-white p-7 md:p-10 lg:p-12 text-center relative overflow-hidden" style={{ borderColor: '#33333318', boxShadow: '0 22px 55px #8B93A716' }}>
            <div className="absolute inset-x-0 top-0 h-2" style={{ background: 'linear-gradient(90deg, #DFE3A2, #CAE7B9, #F3DE8A, #EFB988, #EB9486, #B58A90)' }} />
            <p className="font-heading text-3xl lg:text-4xl font-semibold text-charcoal leading-tight mb-6">
              Clean Slate Club was built for the households carrying more than a to-do list.
            </p>
            <div className="space-y-4 font-body text-base lg:text-lg leading-relaxed font-light max-w-3xl mx-auto" style={{ color: '#333333b3' }}>
              <p>
                For the default parent. The ADHD household. The caregiver. The person recovering from surgery. The home moving through grief, burnout, school chaos, postpartum life, aging-parent stress, or a season that simply got too full.
              </p>
              <p>
                This is practical household support for the moments when the dishes are not just dishes, the laundry is not just laundry, and the errand is not just an errand. It is the mental load behind all of it.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-7">
              {supportTags.map((tag, index) => {
                const colors = ['#DFE3A2', '#CAE7B9', '#F3DE8A', '#EFB988', '#EB9486', '#B58A90'];
                const color = colors[index % colors.length];
                return (
                  <span key={tag} className="rounded-full border px-4 py-2 font-body text-xs font-light" style={{ background: `${color}40`, borderColor: `${color}80`, color: '#333333' }}>
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="max-w-5xl mx-auto mt-10">
            <div className="text-center mb-6">
              <p className="font-body text-xs tracking-[0.25em] uppercase font-light mb-2" style={{ color: '#33333399' }}>Does this sound like your house?</p>
              <p className="font-logo text-2xl" style={{ color: '#EB9486' }}>Open the one that feels most true.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {painPoints.map((point, index) => (
                <PainPointCard
                  key={point.title}
                  point={point}
                  open={openIndex === index}
                  onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
                />
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.25}>
          <div className="max-w-3xl mx-auto mt-10 rounded-3xl border bg-white p-6 text-center" style={{ borderColor: '#33333318' }}>
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