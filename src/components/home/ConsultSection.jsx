import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../shared/AnimatedSection';

const steps = [
  {
    num: '01',
    title: 'Book Your Reset Consult',
    desc: "A free 15-minute conversation — no sales pitch, just a genuine check-in about what your home and life need right now.",
  },
  {
    num: '02',
    title: 'We Customize Your Support',
    desc: 'We discuss your routines, priorities, sensitivities, and scheduling needs to build the perfect plan for your household.',
  },
  {
    num: '03',
    title: 'Your First Visit',
    desc: "Masha arrives ready to work. You get to exhale. Your home gets the reset it's been waiting for.",
  },
];

export default function ConsultSection() {
  return (
    <section className="py-24 lg:py-36 relative overflow-hidden" style={{ background: '#fdf8f2' }}>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle, #f8bb80 0%, transparent 65%)', transform: 'translate(30%, -20%)' }} />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full opacity-25 pointer-events-none" style={{ background: 'radial-gradient(circle, #ffc898 0%, transparent 65%)', transform: 'translate(-20%, 20%)' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection>
            <p className="font-body text-xs tracking-[0.25em] uppercase text-coral/70 mb-5 font-light">How It Works</p>
            <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-charcoal mb-4 leading-tight">
              Your Reset Consult
            </h2>
            <p className="font-logo text-2xl text-coral mb-8">A concierge onboarding experience.</p>
            <p className="font-body text-base text-charcoal/50 leading-relaxed font-light mb-10">
              Every new client starts with a 15-minute Reset Consult. Not a quote call — a real conversation so we can show up prepared and personalized, not generic.
            </p>
            <Link
              to="/book"
              className="inline-block bg-coral text-white font-body text-sm tracking-wide px-10 py-4 rounded-full hover:bg-coral/90 hover:shadow-xl hover:shadow-coral/25 transition-all duration-500"
            >
              Book Your Free Consult
            </Link>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="mb-6 rounded-2xl overflow-hidden h-48">
              <img
                src="https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/0444b42e3_generated_image.png"
                alt="Folded laundry in warm sunlight"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6">
              {steps.map((step) => (
                <div key={step.num} className="flex gap-5 p-6 rounded-2xl border transition-all duration-300 hover:shadow-sm" style={{ background: 'rgba(255,255,255,0.7)', borderColor: '#fcd5ce50' }}>
                  <span className="font-logo text-coral text-2xl shrink-0" style={{ lineHeight: 1 }}>{step.num}</span>
                  <div>
                    <h3 className="font-heading text-base font-semibold mb-1" style={{ color: '#3a3330' }}>{step.title}</h3>
                    <p className="font-body text-sm leading-relaxed font-light" style={{ color: '#7a6560' }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}