import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/shared/AnimatedSection';
import PageHero from '@/components/shared/PageHero';
import WaveDivider from '@/components/shared/WaveDivider';

const VALUES = [
  'No shame spirals',
  'Clear priorities',
  'Calm communication',
  'Practical help',
  'Safe boundaries',
  'A real plan forward',
];

const SUPPORT_EXAMPLES = [
  ['How we enter a home', 'Calmly, respectfully, and with the understanding that every household has its own rhythm, rules, supplies, pets, people, and pressure points.'],
  ['How we choose what comes first', 'The goal is not to do everything at once. The goal is to find the highest-impact starting point and make the next few hours actually matter.'],
  ['How we leave things behind', 'A little more order, a little more breathing room, and a clearer sense of what kind of support would help next time.'],
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
  return (
    <main className="min-h-screen" style={{ background: '#FDFCFB' }}>
      <PageHero
        eyebrow="About Clean Slate Club"
        title="When home feels heavy"
        script="That’s where we come in."
        description="Practical support for real homes, real routines, and the seasons when keeping up starts to feel like too much."
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
                <p className="font-body text-[11px] font-light" style={{ color: '#33333399' }}>the feeling this was built for</p>
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
              <p className="font-logo text-2xl mb-8" style={{ color: '#EB9486' }}>She understands the pileup.</p>

              <div className="space-y-5 font-body text-base leading-relaxed font-light" style={{ color: '#333333cc' }}>
                <p>
                  Clean Slate Club did not come from a fantasy version of home where everything is labeled, folded, stocked, and handled before anyone asks.
                </p>
                <p>
                  It came from real life. The kind where one person often becomes the calendar keeper, snack manager, laundry tracker, errand runner, emotional support system, and backup plan for everyone else.
                </p>
                <p>
                  Masha has lived the kind of overwhelm that can look ordinary from the outside. A house that is not falling apart, but never feels fully caught up. A list that keeps regenerating. A nervous system that cannot relax because the next thing is always waiting.
                </p>
                <p>
                  As a stay-at-home mom and later a single mom, she understood how much invisible labor goes into keeping a household moving. She also understood how vulnerable it can feel to say, “I need help,” when what you really mean is, “I do not know where to begin.”
                </p>
                <p>
                  Clean Slate Club exists to meet people there with practical help, clear priorities, and no performance required.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <WaveDivider fill="#F1F1F1" />

      <section className="px-6 lg:px-12 py-10 lg:py-16" style={{ background: '#F1F1F1' }}>
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
            <p className="font-body text-xs tracking-[0.28em] uppercase font-light mb-4" style={{ color: '#33333399' }}>The standard</p>
            <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-charcoal mb-4">Warm help still needs clear boundaries.</h2>
            <p className="font-body text-base font-light leading-relaxed" style={{ color: '#333333b3' }}>
              The work is personal because home is personal. That is why Clean Slate Club is designed around trust, communication, safety, and realistic expectations from the beginning.
            </p>
          </AnimatedSection>

          <div className="rounded-[2rem] border bg-white p-7 lg:p-9" style={{ borderColor: '#33333318', boxShadow: '0 18px 45px #8B93A712' }}>
            <div className="flex flex-wrap justify-center gap-2">
              {VALUES.map((value, index) => <ValuePill key={value} label={value} index={index} />)}
            </div>
          </div>
        </div>
      </section>

      <WaveDivider fill="#FDFCFB" flip />

      <section className="max-w-6xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12 items-start">
          <AnimatedSection>
            <div className="rounded-[2rem] border bg-white p-8 lg:p-10 sticky top-28" style={{ borderColor: '#33333318', boxShadow: '0 18px 45px #8B93A712' }}>
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
                <div key={label} className="rounded-[2rem] border bg-white p-7" style={{ borderColor: '#33333318', borderLeft: `7px solid ${['#CAE7B9', '#F3DE8A', '#EB9486'][index]}` }}>
                  <p className="font-body text-xs tracking-[0.25em] uppercase font-light mb-2" style={{ color: '#33333399' }}>{label}</p>
                  <p className="font-heading text-xl font-semibold text-charcoal leading-snug">{text}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <WaveDivider fill="#F8E8E2" />

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
                ['Trust first', 'Future providers will need to feel safe, steady, and respectful in the private space of someone’s home.'],
                ['Training matters', 'The standard will include communication, scope boundaries, safety, and how to prioritize without judgment.'],
                ['Growth with care', 'The goal is not to become the biggest. It is to become reliable enough to help more homes well.'],
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