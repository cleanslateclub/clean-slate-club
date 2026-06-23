import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/shared/AnimatedSection';
import PageHero from '@/components/shared/PageHero';

const FEELING_CARDS = [
  {
    number: '01',
    title: 'Relief before perfection',
    text: 'The goal is not to impress anyone. The goal is to walk back into a home that feels lighter, calmer, and easier to breathe in.',
    color: '#DFE3A2',
  },
  {
    number: '02',
    title: 'Support without shame',
    text: 'No raised eyebrows. No lectures. No silent judgment. Just capable help for the parts of home life that quietly get heavy.',
    color: '#CAE7B9',
  },
  {
    number: '03',
    title: 'A real person who gets it',
    text: 'Clean Slate Club was built from lived experience, not a polished fantasy of domestic life. That is why the support feels human.',
    color: '#F3DE8A',
  },
  {
    number: '04',
    title: 'The exhale moment',
    text: 'That small second when the dishes are handled, the laundry is moving, the errand is done, and your brain finally has room again.',
    color: '#EFB988',
  },
];

const VALUES = [
  'Judgment-free support',
  'Practical over performative',
  'Clear boundaries',
  'Reliable communication',
  'Warm, capable presence',
  'Care for the home and the human',
];

function ValuePill({ label, index }) {
  const colors = ['#DFE3A2', '#CAE7B9', '#F3DE8A', '#EFB988', '#EB9486', '#B58A90'];
  return (
    <span className="rounded-full border px-4 py-2 font-body text-xs font-light" style={{ background: `${colors[index % colors.length]}40`, borderColor: `${colors[index % colors.length]}80`, color: '#333333' }}>
      {label}
    </span>
  );
}

export default function About() {
  const [activeCard, setActiveCard] = useState(0);

  return (
    <main className="min-h-screen" style={{ background: '#FDFCFB' }}>
      <PageHero
        eyebrow="About Clean Slate Club"
        title="A softer way to ask for help"
        script="You do not need perfect. You need backup."
        description="Household support for the invisible load, the half-finished lists, and the weeks that get away from you."
        background="linear-gradient(135deg, #FDFCFB 0%, #DFE3A266 22%, #CAE7B966 42%, #F3DE8A55 60%, #EFB98855 76%, #EB948655 90%, #B58A9038 100%)"
        waveFill="#FDFCFB"
        scriptColor="#EB9486"
      />

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-20 items-center">
          <AnimatedSection>
            <div className="relative">
              <div className="absolute -inset-4 rounded-[3rem]" style={{ background: 'linear-gradient(135deg, #DFE3A255, #CAE7B955, #EB948633)' }} />
              <img
                src="/images/mashaheadshot.jpg"
                alt="Masha, founder of Clean Slate Club"
                className="relative w-full rounded-[2.5rem] object-cover aspect-[3/4] shadow-2xl border"
                style={{ borderColor: '#B58A9028', boxShadow: '0 24px 60px #8B93A725' }}
              />
              <motion.div
                className="absolute -bottom-6 -right-2 lg:-right-8 p-5 rounded-2xl shadow-xl max-w-[220px] border bg-white"
                style={{ borderColor: '#EB948640', boxShadow: '0 8px 30px #B58A9030' }}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="font-logo text-coral text-lg leading-tight mb-1">"Finally."</p>
                <p className="font-body text-[11px] font-light" style={{ color: '#33333399' }}>— every client, first visit</p>
              </motion.div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="rounded-[2rem] border bg-white p-7 lg:p-10" style={{ borderColor: '#33333318', boxShadow: '0 18px 45px #8B93A712' }}>
              <div className="flex items-center gap-2 mb-5">
                <span className="w-2 h-2 rounded-full" style={{ background: '#CAE7B9' }} />
                <span className="w-2 h-2 rounded-full" style={{ background: '#DFE3A2' }} />
                <span className="w-2 h-2 rounded-full" style={{ background: '#EB9486' }} />
                <p className="font-body tracking-[0.25em] uppercase font-light text-sm ml-2" style={{ color: '#333333' }}>THE WOMAN BEHIND THE BRAND</p>
              </div>
              <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-charcoal mb-2 leading-tight">
                Meet Masha.
              </h2>
              <p className="font-logo text-2xl mb-8" style={{ color: '#EB9486' }}>She gets it.</p>

              <div className="space-y-5 font-body text-base leading-relaxed font-light" style={{ color: '#333333cc' }}>
                <p>
                  Masha built Clean Slate Club around a simple truth: most people do not need perfect homes. They need relief.
                </p>
                <p>
                  She knows what it feels like to be the one holding the calendar, the meals, the laundry, the errands, the details, and the emotional weight of making sure nothing falls apart. She has lived the kind of overwhelm that does not always look dramatic from the outside, but quietly takes up every inch of your day.
                </p>
                <p>
                  As a stay-at-home mom and later a single mom, Masha understood how much invisible labor goes into keeping a household moving. She also understood how hard it can be to ask for help when the thing you need help with is "everything."
                </p>
                <p>
                  Clean Slate Club exists for that exact place. The half-finished lists. The messy transitions. The weeks that get away from you. The homes that need care, but so do the people living in them.
                </p>
                <p>
                  What started with Masha's own understanding is becoming a new kind of household support: warm, practical, capable, and never judgmental.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="px-6 lg:px-12 py-10 lg:py-16" style={{ background: '#F1F1F1' }}>
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
            <p className="font-body text-xs tracking-[0.28em] uppercase font-light mb-4" style={{ color: '#33333399' }}>The why</p>
            <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-charcoal mb-4">Because home should not feel like another job.</h2>
            <p className="font-body text-base font-light leading-relaxed" style={{ color: '#333333b3' }}>
              Clean Slate Club is for the moment when you are not looking for luxury. You are looking for capacity. Someone steady. Someone practical. Someone who can walk into the chaos and know where to begin.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEELING_CARDS.map((card, index) => (
              <AnimatedSection key={card.title} delay={index * 0.05}>
                <button
                  type="button"
                  onClick={() => setActiveCard(index)}
                  className="h-full w-full text-left rounded-[2rem] border p-6 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: activeCard === index ? '#FFFFFF' : `${card.color}38`,
                    borderColor: activeCard === index ? '#33333322' : `${card.color}80`,
                    boxShadow: activeCard === index ? '0 18px 45px #8B93A718' : 'none',
                  }}
                >
                  <p className="font-logo text-4xl leading-none mb-5" style={{ color: '#33333380' }}>{card.number}</p>
                  <p className="font-heading text-xl font-semibold text-charcoal mb-3">{card.title}</p>
                  <p className="font-body text-sm font-light leading-relaxed" style={{ color: '#333333b3' }}>{card.text}</p>
                </button>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12 items-start">
          <AnimatedSection>
            <div className="rounded-[2rem] border bg-white p-8 lg:p-10 sticky top-28" style={{ borderColor: '#33333318', boxShadow: '0 18px 45px #8B93A712' }}>
              <p className="font-body text-xs tracking-[0.28em] uppercase font-light mb-4" style={{ color: '#33333399' }}>What it feels like</p>
              <h2 className="font-heading text-3xl lg:text-4xl font-semibold text-charcoal mb-5">The service is practical. The feeling is emotional.</h2>
              <p className="font-body text-sm font-light leading-relaxed mb-6" style={{ color: '#333333b3' }}>
                A reset is not only about the dishes, the laundry, the errands, or the room that has been silently bothering you for three weeks. It is about getting a little bit of your bandwidth back.
              </p>
              <div className="flex flex-wrap gap-2">
                {VALUES.map((value, index) => <ValuePill key={value} label={value} index={index} />)}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="space-y-5">
              {[
                ['Before', 'You are running the house from memory, juggling five unfinished tasks, and trying to decide which fire matters most.'],
                ['During', 'A capable person arrives, listens without judgment, gets oriented, and starts making visible progress.'],
                ['After', 'The home feels more breathable. The list is shorter. The mental noise is quieter. You have proof that help can actually help.'],
              ].map(([label, text], index) => (
                <div key={label} className="rounded-[2rem] border bg-white p-7" style={{ borderColor: '#33333318', borderLeft: `7px solid ${['#CAE7B9', '#F3DE8A', '#EB9486'][index]}` }}>
                  <p className="font-body text-xs tracking-[0.25em] uppercase font-light mb-2" style={{ color: '#33333399' }}>{label}</p>
                  <p className="font-heading text-xl font-semibold text-charcoal leading-snug">{text}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="px-6 lg:px-12 py-16 lg:py-20" style={{ background: '#F8E8E2' }}>
        <div className="max-w-5xl mx-auto text-center">
          <AnimatedSection>
            <p className="font-body text-xs tracking-[0.28em] uppercase font-light mb-4" style={{ color: '#33333399' }}>What comes next</p>
            <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-charcoal mb-5">Built solo. Designed to grow carefully.</h2>
            <p className="font-body text-base font-light leading-relaxed max-w-3xl mx-auto mb-8" style={{ color: '#333333b3' }}>
              Right now, Clean Slate Club is owned and led by Masha, with service delivered personally and thoughtfully. As the brand grows, the next step will be bringing on providers who share the same warmth, boundaries, reliability, and zero-judgment standard.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mb-10">
              {[
                ['Careful hiring', 'Future providers will be chosen for trust, communication, safety, and emotional intelligence.'],
                ['Clear standards', 'The service should feel consistent whether it is Masha or a trained provider at the door.'],
                ['Human support', 'Growth will not mean losing the warmth that made the brand worth building.'],
              ].map(([title, text], index) => (
                <div key={title} className="rounded-3xl border bg-white p-6" style={{ borderColor: '#33333318', borderTop: `7px solid ${['#DFE3A2', '#EFB988', '#B58A90'][index]}` }}>
                  <p className="font-heading text-lg font-semibold text-charcoal mb-2">{title}</p>
                  <p className="font-body text-sm font-light leading-relaxed" style={{ color: '#333333b3' }}>{text}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/book" className="inline-block text-white font-body text-sm tracking-wide px-8 py-3 rounded-full transition-all duration-300 hover:opacity-90 hover:shadow-lg" style={{ background: '#333333' }}>
                Book Support →
              </Link>
              <Link to="/faq" className="inline-block font-body text-sm tracking-wide px-8 py-3 rounded-full border transition-all duration-300 hover:bg-white" style={{ color: '#333333', borderColor: '#33333330' }}>
                Read the FAQ
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
