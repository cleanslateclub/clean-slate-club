import React from 'react';
import AnimatedSection from '../shared/AnimatedSection';
export default function MashaSection() {
  return (
    <section id="about" className="py-16 lg:py-24 relative overflow-hidden scroll-mt-24 lg:scroll-mt-28" style={{ background: '#fdf5f3' }}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image */}
          <AnimatedSection>
            <div className="relative">
              <img
                src="https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/f14ea1641_generated_image.png"
                alt="Masha helping naturally in a warm home"
                className="relative w-full rounded-[2.5rem] object-cover aspect-[3/4] shadow-2xl shadow-mauve/10 border"
                style={{ borderColor: '#B58A9028' }} />
              
              {/* Floating quote card */}
              <div className="absolute -bottom-6 -right-4 lg:-right-8 p-5 rounded-2xl shadow-xl max-w-[200px] border" style={{ background: '#FFFFFF', borderColor: '#EB948640', boxShadow: '0 8px 30px #B58A9030' }}>
                <p className="font-logo text-coral text-lg leading-tight mb-1">"Finally."</p>
                <p className="font-body text-[11px] font-light" style={{ color: '#33333399' }}>— every client, first visit</p>
              </div>
            </div>
          </AnimatedSection>

          {/* Story copy */}
          <AnimatedSection delay={0.2}>
            <div className="flex items-center gap-2 mb-5">
              <span className="w-2 h-2 rounded-full" style={{ background: '#CAE7B9' }} />
              <span className="w-2 h-2 rounded-full" style={{ background: '#DFE3A2' }} />
              <span className="w-2 h-2 rounded-full" style={{ background: '#EB9486' }} />
              <p className="font-body tracking-[0.25em] uppercase font-light text-lg ml-2" style={{ color: '#333333' }}>MEET MASHA</p>
            </div>
            <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-charcoal mb-6 leading-tight">
              The calm in your household chaos.
            </h2>
            <div className="space-y-4 font-body text-base leading-relaxed font-light" style={{ color: '#333333b3' }}>
              <p>
                Clean Slate Club was built around the kind of support people actually need but rarely ask for — the laundry that became a mountain, the errands that keep getting moved to tomorrow, the meals that never quite happen, the aging parent who needs a little extra care.
              </p>
              <p>
                Masha brings a warm, grounded presence to every home she supports. She is background checked, CPR certified, ServeSafe trained, and deeply comfortable stepping into the real-life mess without judgment.
              </p>
              <p>
                This is not about perfection. It is about creating breathing room, restoring order, and making everyday life feel a little more manageable.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
