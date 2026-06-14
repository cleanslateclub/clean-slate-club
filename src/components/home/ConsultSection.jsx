import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../shared/AnimatedSection';

const IconChat = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M6 8h20v12H12l-6 5V8z" />
    <path d="M12 13h8M12 17h5" />
  </svg>
);

const IconPlan = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M9 5h14v22H9z" />
    <path d="M13 11h6M13 16h6M13 21h4" />
    <path d="M21 5v4H11V5" />
  </svg>
);

const IconHome = () => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M5 14L16 5l11 9v13H5V14z" />
    <path d="M12 27v-8h8v8" />
  </svg>
);

const steps = [
  {
    num: '01',
    icon: IconChat,
    title: 'Talk it through',
    desc: 'Start with a free 15-minute consult so we understand what actually feels heavy.',
    color: '#EB9486'
  },
  {
    num: '02',
    icon: IconPlan,
    title: 'Choose the support',
    desc: 'We shape the visit around your home, routines, priorities, and timing.',
    color: '#EFB988'
  },
  {
    num: '03',
    icon: IconHome,
    title: 'Get your reset',
    desc: 'Your provider arrives prepared and ready to help move the day forward.',
    color: '#CAE7B9'
  }
];

const withOpacity = (hex, opacity = '66') => `${hex}${opacity}`;

export default function ConsultSection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden" style={{ background: '#FCECE6' }}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="mb-12 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="w-2 h-2 rounded-full" style={{ background: '#CAE7B9' }} />
            <span className="w-2 h-2 rounded-full" style={{ background: '#DFE3A2' }} />
            <span className="w-2 h-2 rounded-full" style={{ background: '#EB9486' }} />
            <p className="font-body tracking-[0.25em] uppercase font-light text-lg ml-2" style={{ color: '#333333' }}>HOW IT WORKS</p>
          </div>
          <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-charcoal mb-3 leading-tight">
            Start with what feels heavy.
          </h2>
          <p className="font-logo text-2xl" style={{ color: '#EB9486' }}>Then we help you clear it.</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-16 items-stretch">
          <AnimatedSection delay={0.1}>
            <div className="h-full flex flex-col justify-between">
              <p className="font-body text-base leading-relaxed font-light mb-8" style={{ color: '#333333b3' }}>
                You do not have to know exactly what to book. The consult helps us understand your home, your routines, and the kind of support that would actually feel useful.
              </p>

              <div className="space-y-4">
                {steps.map((step) => {
                  const StepIcon = step.icon;
                  return (
                    <div key={step.num} className="rounded-3xl border p-5 flex gap-4 items-start transition-all duration-300 hover:shadow-sm" style={{ background: withOpacity(step.color), borderColor: step.color }}>
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border" style={{ background: '#FFFFFFB3', borderColor: step.color, color: '#333333' }}>
                        <StepIcon />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-logo text-2xl leading-none" style={{ color: '#33333399' }}>{step.num}</span>
                          <h3 className="font-heading text-lg font-semibold" style={{ color: '#333333' }}>{step.title}</h3>
                        </div>
                        <p className="font-body text-sm leading-relaxed font-light" style={{ color: '#333333cc' }}>{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link
                to="/book"
                className="inline-block font-body text-sm tracking-wide px-10 py-4 rounded-full hover:shadow-xl transition-all duration-500 border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 mt-8 text-center self-start"
                style={{ background: '#EB9486', borderColor: '#EB9486', color: '#FFFFFF', outlineColor: '#F3DE8A' }}>
                Book Your Free Consult
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="relative rounded-[2rem] overflow-hidden h-full min-h-[420px] lg:min-h-[560px] shadow-2xl border" style={{ borderColor: '#EFB98545' }}>
              <img
                src="https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/0444b42e3_generated_image.png"
                alt="Folded laundry in warm sunlight"
                className="w-full h-full object-cover" />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
