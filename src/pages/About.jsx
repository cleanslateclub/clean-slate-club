import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartHandshake, Home, ShieldCheck, Sparkles } from 'lucide-react';
import AnimatedSection from '@/components/shared/AnimatedSection';
import PageHero from '@/components/shared/PageHero';
import WaveDivider from '@/components/shared/WaveDivider';

const ABOUT_BG = '#F7F9F3';
const STORY_BG = '#FDFCFB';
const STANDARD_BG = '#F1F1F1';
const GROWTH_BG = '#F8E8E2';
const FOOTER_COLOR = '#333333';

const VALUES = [
  { label: 'No shame spirals', color: '#CAE7B9' },
  { label: 'Clear priorities', color: '#DFE3A2' },
  { label: 'Calm communication', color: '#F3DE8A' },
  { label: 'Practical help', color: '#EFB988' },
  { label: 'Safe boundaries', color: '#EB9486' },
  { label: 'A real plan forward', color: '#B58A90' },
];

const STORY_BEATS = [
  {
    icon: Home,
    title: 'Built from real life',
    text: 'Clean Slate Club did not come from a fantasy version of home where everything is folded, labeled, stocked, and handled before anyone asks.',
    color: '#CAE7B9',
  },
  {
    icon: HeartHandshake,
    title: 'Made for invisible labor',
    text: 'It was built for the person holding the calendar, the meals, the laundry, the errands, the small details, and the emotional weight of keeping a household moving.',
    color: '#F3DE8A',
  },
  {
    icon: ShieldCheck,
    title: 'Warm, but boundaried',
    text: 'The work is personal because home is personal. That is why support has to be practical, respectful, safe, and honest about what can happen in one visit.',
    color: '#EB9486',
  },
];

const SUPPORT_EXAMPLES = [
  ['How we enter a home', 'Calmly, respectfully, and with the understanding that every household has its own rhythm, rules, supplies, pets, people, and pressure points.'],
  ['How we choose what comes first', 'The goal is not to do everything at once. The goal is to find the highest-impact starting point and make the next few hours actually matter.'],
  ['How we leave things behind', 'A little more order, a little more breathing room, and a clearer sense of what kind of support would help next time.'],
];

function ValuePill({ value }) {
  return (
    <span
      className="rounded-full border px-4 py-2 font-body text-xs font-light"
      style={{ background: `${value.color}40`, borderColor: `${value.color}80`, color: '#333333' }}
    >
      {value.label}
    </span>
  );
}

function Dots({ className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`} aria-hidden="true">
      {['#CAE7B9', '#DFE3A2', '#F3DE8A', '#EFB988', '#EB9486'].map(color => (
        <span key={color} className="h-2 w-2 rounded-full" style={{ background: color }} />
      ))}
    </div>
  );
}

export default function About() {
  return (
    <main className="min-h-screen" style={{ background: ABOUT_BG }}>
      <PageHero
        eyebrow="About Clean Slate Club"
        title="The human side of household support."
        script="Meet Masha."
        description="A modern support service for the homes carrying too much, built with warmth, boundaries, and a deep respect for real life."
        waveFill={ABOUT_BG}
        scriptColor="#EB9486"
      />

      <section className="px-5 sm:px-6 lg:px-12 pt-8 pb-14 lg:pt-12 lg:pb-20" style={{ background: ABOUT_BG }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-18 items-center">
          <AnimatedSection>
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -left-5 -top-5 h-28 w-28 rounded-full" style={{ background: '#F3DE8A55' }} />
              <div className="absolute -right-5 bottom-10 h-36 w-36 rounded-full" style={{ background: '#CAE7B955' }} />
              <div className="relative rounded-[2.25rem] border bg-white p-3 shadow-2xl" style={{ borderColor: '#B58A9028', boxShadow: '0 24px 70px #8B93A725' }}>
                <img
                  src="/images/mashaheadshot.jpg"
                  alt="Masha, founder of Clean Slate Club"
                  className="w-full rounded-[1.75rem] object-cover aspect-[4/5]"
                />
              </div>
              <motion.div
                className="absolute -bottom-6 left-5 right-5 rounded-[1.5rem] border bg-white p-5 text-center shadow-xl"
                style={{ borderColor: '#EB948640', boxShadow: '0 12px 35px #B58A9025' }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="font-logo text-2xl leading-tight" style={{ color: '#EB9486' }}>You do not need perfect.</p>
                <p className="font-heading text-lg font-semibold text-charcoal leading-snug">You need backup that understands the pileup.</p>
              </motion.div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.12}>
            <div className="rounded-[2.25rem] border bg-white/85 p-6 sm:p-8 lg:p-10" style={{ borderColor: '#33333318', boxShadow: '0 18px 50px #8B93A712' }}>
              <Dots className="mb-5" />
              <p className="font-body text-[11px] uppercase tracking-[0.24em] text-charcoal/45 font-light mb-3">The woman behind the brand</p>
              <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-charcoal mb-3 leading-tight">Meet Masha.</h2>
              <p className="font-logo text-2xl md:text-3xl leading-tight mb-7" style={{ color: '#EB9486' }}>She understands the pileup because she has lived it.</p>

              <div className="space-y-5 font-body text-base leading-relaxed font-light" style={{ color: '#333333cc' }}>
                <p>
                  Clean Slate Club grew from the kind of overwhelm that can look ordinary from the outside. A home that is not falling apart, but never feels fully caught up. A list that keeps regenerating. A nervous system that cannot relax because the next thing is always waiting.
                </p>
                <p>
                  As a stay-at-home mom and later a single mom, Masha understood how much invisible labor goes into keeping a household moving. She also understood how vulnerable it can feel to say, “I need help,” when what you really mean is, “I do not know where to begin.”
                </p>
                <p>
                  This service exists to meet people there with practical help, clear priorities, and no performance required.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="px-5 sm:px-6 lg:px-12 py-14 lg:py-20" style={{ background: STORY_BG }}>
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-10 lg:mb-14">
            <p className="font-body text-xs tracking-[0.28em] uppercase font-light mb-4" style={{ color: '#33333399' }}>Why it feels different</p>
            <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-charcoal mb-4 leading-tight">It is not just help. It is relief with a plan.</h2>
            <p className="font-body text-base font-light leading-relaxed" style={{ color: '#333333b3' }}>
              Clean Slate Club is not trying to make homes look perfect. It is designed to make real homes feel more manageable.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            {STORY_BEATS.map(({ icon: Icon, title, text, color }) => (
              <AnimatedSection key={title}>
                <div className="h-full rounded-[2rem] border bg-white p-6 lg:p-7" style={{ borderColor: '#33333318', borderTop: `8px solid ${color}`, boxShadow: '0 16px 45px #8B93A710' }}>
                  <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full" style={{ background: `${color}55`, color: '#333333' }}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-heading text-2xl font-semibold text-charcoal mb-3">{title}</h3>
                  <p className="font-body text-sm leading-relaxed font-light" style={{ color: '#333333b3' }}>{text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider fill={STANDARD_BG} />

      <section className="px-5 sm:px-6 lg:px-12 py-12 lg:py-18" style={{ background: STANDARD_BG }}>
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-10">
            <p className="font-body text-xs tracking-[0.28em] uppercase font-light mb-4" style={{ color: '#33333399' }}>The standard</p>
            <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-charcoal mb-4">Warm help still needs clear boundaries.</h2>
            <p className="font-body text-base font-light leading-relaxed" style={{ color: '#333333b3' }}>
              The work is personal because home is personal. That is why Clean Slate Club is designed around trust, communication, safety, and realistic expectations from the beginning.
            </p>
          </AnimatedSection>

          <div className="rounded-[2rem] border bg-white p-6 lg:p-9" style={{ borderColor: '#33333318', boxShadow: '0 18px 45px #8B93A712' }}>
            <div className="flex flex-wrap justify-center gap-2">
              {VALUES.map(value => <ValuePill key={value.label} value={value} />)}
            </div>
          </div>
        </div>
      </section>

      <WaveDivider fill={STORY_BG} flip />

      <section className="px-5 sm:px-6 lg:px-12 py-14 lg:py-20" style={{ background: STORY_BG }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12 items-start">
          <AnimatedSection>
            <div className="rounded-[2rem] border bg-white p-7 lg:p-10 lg:sticky lg:top-28" style={{ borderColor: '#33333318', boxShadow: '0 18px 45px #8B93A712' }}>
              <p className="font-body text-xs tracking-[0.28em] uppercase font-light mb-4" style={{ color: '#33333399' }}>The approach</p>
              <h2 className="font-heading text-3xl lg:text-4xl font-semibold text-charcoal mb-5">Not a one-size-fits-all checklist.</h2>
              <p className="font-body text-sm font-light leading-relaxed mb-6" style={{ color: '#333333b3' }}>
                The right support depends on the home, the people in it, the time available, the supplies on hand, and what would make the biggest difference that day.
              </p>
              <p className="font-body text-sm font-light leading-relaxed" style={{ color: '#333333b3' }}>
                That is why Clean Slate Club works best when the service is practical, flexible, and honest about what can realistically happen in one visit.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="space-y-5">
              {SUPPORT_EXAMPLES.map(([label, text], index) => (
                <div key={label} className="rounded-[2rem] border bg-white p-6 lg:p-7" style={{ borderColor: '#33333318', borderLeft: `7px solid ${['#CAE7B9', '#F3DE8A', '#EB9486'][index]}` }}>
                  <p className="font-body text-xs tracking-[0.25em] uppercase font-light mb-2" style={{ color: '#33333399' }}>{label}</p>
                  <p className="font-heading text-xl font-semibold text-charcoal leading-snug">{text}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <WaveDivider fill={GROWTH_BG} />

      <section className="px-5 sm:px-6 lg:px-12 py-14 lg:py-20" style={{ background: GROWTH_BG }}>
        <div className="max-w-5xl mx-auto text-center">
          <AnimatedSection>
            <Sparkles className="mx-auto mb-5 h-8 w-8" style={{ color: '#B58A90' }} />
            <p className="font-body text-xs tracking-[0.28em] uppercase font-light mb-4" style={{ color: '#33333399' }}>What comes next</p>
            <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-charcoal mb-5">Built personally. Designed to grow carefully.</h2>
            <p className="font-body text-base font-light leading-relaxed max-w-3xl mx-auto mb-8" style={{ color: '#333333b3' }}>
              Right now, Clean Slate Club is owned and led by Masha, with service delivered personally and thoughtfully. As the brand grows, the next step will be bringing on providers who share the same warmth, boundaries, reliability, and zero-judgment standard.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mb-10">
              {[
                ['Trust first', 'Future providers need to feel safe, steady, and respectful in the private space of someone’s home.'],
                ['Training matters', 'The standard includes communication, scope boundaries, safety, and how to prioritize without judgment.'],
                ['Growth with care', 'The goal is not to become the biggest. It is to become reliable enough to help more homes well.'],
              ].map(([title, text], index) => (
                <div key={title} className="rounded-3xl border bg-white p-6" style={{ borderColor: '#33333318', borderTop: `7px solid ${['#DFE3A2', '#EFB988', '#B58A90'][index]}` }}>
                  <p className="font-heading text-lg font-semibold text-charcoal mb-2">{title}</p>
                  <p className="font-body text-sm font-light leading-relaxed" style={{ color: '#333333b3' }}>{text}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/book" className="inline-block w-full sm:w-auto text-white font-body text-sm tracking-wide px-8 py-3 rounded-full transition-all duration-300 hover:opacity-90 hover:shadow-lg" style={{ background: '#333333' }}>
                Book Support →
              </Link>
              <Link to="/faq" className="inline-block w-full sm:w-auto font-body text-sm tracking-wide px-8 py-3 rounded-full border transition-all duration-300 hover:bg-white" style={{ color: '#333333', borderColor: '#33333330' }}>
                Read the FAQ
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <WaveDivider fill={FOOTER_COLOR} />
    </main>
  );
}
