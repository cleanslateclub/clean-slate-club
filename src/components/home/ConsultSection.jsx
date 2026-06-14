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
    desc: 'Start with a free 15-minute consult so we understand what actually feels heavy.'
  },
  {
    num: '02',
    icon: IconPlan,
    title: 'Choose the support',
    desc: 'We shape the visit around your home, routines, priorities, and timing.'
  },
  {
    num: '03',
    icon: IconHome,
    title: 'Get your reset',
    desc: 'Your provider arrives prepared and ready to help move the day forward.'
  }
];

export default function ConsultSection() {
  return (
    <section className="py-24 lg:py-36 relative overflow-hidden" style={{ background: '#fdf5ec' }}>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-25 pointer-events-none" style={{ background: 'radial-gradient(circle, #FFE5D9 0%, transparent 65%)', transform: 'translate(30%, -20%)' }} />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full opacity-25 pointer-events-none" style={{ background: 'radial-gradient(circle, #CAE7B9 0%, transparent 65%)', transform: 'translate(-20%, 20%)' }} />
      <div className="absolute top-1/2 left-1/3 w-[260px] h-[260px] rounded-full opacity-18 pointer-events-none" style={{ background: 'radial-gradient(circle, #F3DE8A 0%, transparent 68%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-14 lg:gap-20 items-center">
          <AnimatedSection>
            <div className="flex items-center gap-2 mb-5">
              <span className="w-2 h-2 rounded-full" style={{ background: '#CAE7B9' }} />
              <span className="w-2 h-2 rounded-full" style={{ background: '#DFE3A2' }} />
              <span className="w-2 h-2 rounded-full" style={{ background: '#EB9486' }} />
              <p className="font-body tracking-[0.25em] uppercase font-light text-lg ml-2" style={{ color: '#333333' }}>HOW IT WORKS</p>
            </div>
            <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-charcoal mb-4 leading-tight">
              Start with what feels heavy.
            </h2>
            <p className="font-logo text-2xl mb-8" style={{ color: '#EB9486' }}>Then we help you clear it.</p>
            <p className="font-body text-base leading-relaxed font-light mb-10 max-w-xl" style={{ color: '#333333b3' }}>
              You do not have to know exactly what to book. The consult helps us understand your home, your routines, and the kind of support that would actually feel useful.
            </p>
            <Link
              to="/book"
              className="inline-block font-body text-sm tracking-wide px-10 py-4 rounded-full hover:shadow-xl transition-all duration-500 border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{ background: '#EB9486', borderColor: '#EB9486', color: '#FFFFFF', outlineColor: '#F3DE8A' }}>
              Book Your Free Consult
            </Link>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="relative mb-8">
              <div className="absolute -top-6 -left-6 w-40 h-40 rounded-full opacity-45 pointer-events-none" style={{ background: '#DFE3A2' }} />
              <div className="absolute -bottom-6 -right-6 w-36 h-36 rounded-full opacity-45 pointer-events-none" style={{ background: '#FFE5D9' }} />
              <div className="relative rounded-[2rem] overflow-hidden h-[320px] lg:h-[420px] shadow-2xl border" style={{ borderColor: '#EFB98545' }}>
                <img
                  src="https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/0444b42e3_generated_image.png"
                  alt="Folded laundry in warm sunlight"
                  className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #33333375 0%, transparent 45%)' }} />
                <div className="absolute left-6 bottom-6 right-6 p-5 rounded-2xl border backdrop-blur-sm" style={{ background: '#FFFFFFD9', borderColor: '#FFFFFF80' }}>
                  <p className="font-heading text-lg font-semibold mb-1" style={{ color: '#333333' }}>No guessing required.</p>
                  <p className="font-body text-sm font-light leading-relaxed" style={{ color: '#333333b3' }}>Tell us what is going on. We turn it into a clear, bookable plan.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {steps.map((step) => {
                const StepIcon = step.icon;
                return (
                  <div key={step.num} className="rounded-3xl border p-5 relative overflow-hidden" style={{ background: '#FFFFFFCC', borderColor: '#EFB98545', boxShadow: '0 16px 35px #EFB98512' }}>
                    <span className="absolute top-4 right-4 font-logo text-2xl" style={{ color: '#EB948640' }}>{step.num}</span>
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 border" style={{ color: '#EB9486', background: '#FFE5D980', borderColor: '#EB948640' }}>
                      <StepIcon />
                    </div>
                    <h3 className="font-heading text-base font-semibold mb-2" style={{ color: '#333333' }}>{step.title}</h3>
                    <p className="font-body text-xs leading-relaxed font-light" style={{ color: '#333333b3' }}>{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}