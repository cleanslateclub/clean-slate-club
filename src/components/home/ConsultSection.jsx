import React from 'react';
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
    num: '01',
    icon: IconTabs,
    title: 'Mental tabs everywhere',
    desc: 'The appointments, lunches, returns, laundry, groceries, medications, school notes, pet food, and tiny invisible tasks no one else seems to track.',
    color: '#DFE3A2'
  },
  {
    num: '02',
    icon: IconHome,
    title: 'ADHD homes & stuck spaces',
    desc: 'The room you keep avoiding because every pile requires a decision. The reset you want, but cannot start because your brain is already over capacity.',
    color: '#CAE7B9'
  },
  {
    num: '03',
    icon: IconCare,
    title: 'Recovery, grief & heavy seasons',
    desc: 'New baby, surgery, burnout, divorce, loss, aging parents, work stress, or a stretch of life where basic household support would change the whole day.',
    color: '#F3DE8A'
  }
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

const withOpacity = (hex, opacity = '66') => `${hex}${opacity}`;

export default function ConsultSection() {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden" style={{ background: '#FDF5E6' }}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="mb-12 text-center max-w-3xl mx-auto">
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

        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-start">
          <AnimatedSection delay={0.1}>
            <div className="rounded-[2rem] border bg-white p-7 lg:p-9 h-full" style={{ borderColor: '#33333318', boxShadow: '0 18px 45px #8B93A712' }}>
              <p className="font-heading text-2xl lg:text-3xl font-semibold text-charcoal leading-tight mb-5">
                Clean Slate Club was built for the households carrying more than a to-do list.
              </p>
              <div className="space-y-4 font-body text-base leading-relaxed font-light" style={{ color: '#333333b3' }}>
                <p>
                  For the default parent. The ADHD household. The caregiver. The person recovering from surgery. The home moving through grief, burnout, school chaos, postpartum life, aging-parent stress, or a season that simply got too full.
                </p>
                <p>
                  This is practical household support for the moments when the dishes are not just dishes, the laundry is not just laundry, and the errand is not just an errand. It is the mental load behind all of it.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-7">
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

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
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

          <AnimatedSection delay={0.2}>
            <div className="space-y-4">
              {painPoints.map((point) => {
                const PointIcon = point.icon;
                return (
                  <div key={point.num} className="rounded-3xl border p-5 flex gap-4 items-start transition-all duration-300 hover:shadow-sm" style={{ background: withOpacity(point.color), borderColor: point.color }}>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border" style={{ background: '#FFFFFFB3', borderColor: point.color, color: '#333333' }}>
                      <PointIcon />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-logo text-2xl leading-none" style={{ color: '#33333399' }}>{point.num}</span>
                        <h3 className="font-heading text-lg font-semibold" style={{ color: '#333333' }}>{point.title}</h3>
                      </div>
                      <p className="font-body text-sm leading-relaxed font-light" style={{ color: '#333333cc' }}>{point.desc}</p>
                    </div>
                  </div>
                );
              })}

              <div className="rounded-3xl border bg-white p-6" style={{ borderColor: '#33333318' }}>
                <p className="font-logo text-2xl mb-2" style={{ color: '#EB9486' }}>You do not have to know what to ask for.</p>
                <p className="font-body text-sm leading-relaxed font-light" style={{ color: '#333333b3' }}>
                  That is part of the service. We help turn “everything feels like too much” into a realistic home reset, errand plan, family support visit, meal prep day, or custom household support session that actually fits your life.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}