import React from 'react';
import AnimatedSection from '../shared/AnimatedSection';
export default function MashaSection() {
  return (
    <section id="about" className="py-24 lg:py-36 relative overflow-hidden" style={{ background: '#fdf5f3' }}>
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #EB9486 0%, transparent 65%)', transform: 'translate(30%, -20%)' }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #CAE7B9 0%, transparent 65%)', transform: 'translate(-20%, 20%)' }} />
      <div className="absolute top-1/2 left-1/2 w-[260px] h-[260px] rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #DFE3A2 0%, transparent 68%)', transform: 'translate(-40%, -20%)' }} />
      <div className="absolute bottom-20 right-24 w-[220px] h-[220px] rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle, #97A7B3 0%, transparent 68%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image with blob */}
          <AnimatedSection>
            <div className="relative">
              {/* Blob behind image */}
              <div className="absolute -top-8 -left-8 w-[110%] h-[110%] rounded-full opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle, #DFE3A2 0%, #FFE5D9 42%, transparent 75%)' }} />
              <div className="absolute -bottom-5 -right-5 w-32 h-32 rounded-full opacity-40 pointer-events-none" style={{ background: '#CAE7B9' }} />
              <img
                src="https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/f14ea1641_generated_image.png"
                alt="Masha helping naturally in a warm home"
                className="relative w-full rounded-[2.5rem] object-cover aspect-[3/4] shadow-2xl shadow-mauve/10 border"
                style={{ borderColor: '#B58A9028' }} />
              
              {/* Floating quote card */}
              <div className="absolute -bottom-6 -right-4 lg:-right-8 p-5 rounded-2xl shadow-xl max-w-[200px] border" style={{ background: '#FFE5D9', borderColor: '#EB948640', boxShadow: '0 8px 30px #B58A9030' }}>
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
              <p className="font-body tracking-[0.25em] uppercase font-light text-lg ml-2" style={{ color: '#333333' }}>THE WOMAN BEHIND THE BRAND</p>
            </div>
            <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-charcoal mb-2 leading-tight">
              Meet Masha.
            </h2>
            <p className="font-logo text-2xl mb-8" style={{ color: '#EB9486' }}>She gets it.</p>

            <div className="space-y-5 font-body text-base leading-relaxed font-light" style={{ color: '#333333cc' }}>
              <p>
                For years, Masha was the woman holding everything together — the home, the kids, the routines, the invisible mental load that never clocked out. She was a stay-at-home mom who knew the weight of running a household like a full-time job that nobody notices.
              </p>
              <p>
                Then life shifted. As a single mom, she understood overwhelm not as a buzzword, but as a Wednesday afternoon when the laundry was piling, the kids needed dinner, and there was no one to call.
              </p>
              <p>
                She built Clean Slate Club because she wished something like it had existed for her. Not a maid. Not a judgmental stranger. A trusted, capable woman who walks in, gets to work, and leaves your home — and your nervous system — in a better place.
              </p>
            </div>

            <div className="mt-10 p-6 rounded-2xl border relative overflow-hidden" style={{ background: '#F1F1F1', borderColor: '#7E7F9A35' }}>
              <div className="absolute inset-y-0 left-0 w-2" style={{ background: '#EB9486' }} />
              <div className="absolute top-4 right-4 flex gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: '#B58A90' }} />
                <span className="w-2 h-2 rounded-full" style={{ background: '#97A7B3' }} />
                <span className="w-2 h-2 rounded-full" style={{ background: '#F3DE8A' }} />
              </div>
              <p className="font-heading text-lg font-semibold text-charcoal pl-4 pr-14">
                You don't need perfect. You need backup.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>);

}