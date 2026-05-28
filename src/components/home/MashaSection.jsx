import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../shared/AnimatedSection';
export default function MashaSection() {
  return (
    <section id="about" className="py-24 lg:py-36 relative overflow-hidden" style={{ background: '#fdf5f3' }}>
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle, #ffc8a0 0%, transparent 65%)', transform: 'translate(30%, -20%)' }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #b8d8c8 0%, transparent 65%)', transform: 'translate(-20%, 20%)' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image with blob */}
          <AnimatedSection>
            <div className="relative">
              {/* Blob behind image */}
              <div className="absolute -top-8 -left-8 w-[110%] h-[110%] rounded-full opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle, #ffe5d9 30%, transparent 75%)' }} />
              <img
                src="https://media.base44.com/images/public/6a128bd55db6131a3e057ca8/f14ea1641_generated_image.png"
                alt="Masha helping naturally in a warm home"
                className="relative w-full rounded-[2.5rem] object-cover aspect-[3/4] shadow-2xl shadow-mauve/10" />
              
              {/* Floating quote card */}
              <div className="absolute -bottom-6 -right-4 lg:-right-8 p-5 rounded-2xl shadow-xl max-w-[200px]" style={{ background: '#fdfcfb', boxShadow: '0 8px 30px #fcd5ce40' }}>
                <p className="font-logo text-coral text-lg leading-tight mb-1">"Finally."</p>
                <p className="font-body text-[11px] text-charcoal/40 font-light">— every client, first visit</p>
              </div>
            </div>
          </AnimatedSection>

          {/* Story copy */}
          <AnimatedSection delay={0.2}>
            <p className="font-body tracking-[0.25em] uppercase mb-5 font-light text-[hsl(var(--card-foreground))] text-lg">THE WOMAN BEHIND THE BRAND</p>
            <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-charcoal mb-2 leading-tight">
              Meet Masha.
            </h2>
            <p className="font-logo text-2xl text-coral mb-8">She gets it.</p>

            <div className="space-y-5 font-body text-base text-charcoal/70 leading-relaxed font-light">
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

            <div className="mt-10 p-6 rounded-2xl border" style={{ background: '#ffe5d930', borderColor: '#fcd5ce60' }}>
              <p className="font-heading text-lg font-semibold text-charcoal mb-1">
                "You're not failing at home."
              </p>
              <p className="font-body text-sm text-charcoal/65 font-light">You're carrying more than any one person should. That's all this is.</p>
            </div>

            <div className="mt-8">
              <Link
                to="/book"
                className="inline-block font-body text-sm tracking-wide text-coral border-b border-coral/30 pb-1 hover:border-coral transition-colors duration-300 font-light">
                
                Book your consult with Masha →
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>);

}