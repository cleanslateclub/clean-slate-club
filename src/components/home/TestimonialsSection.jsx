import React from 'react';
import AnimatedSection from '../shared/AnimatedSection';
import WaveDivider from '../shared/WaveDivider';

const testimonials = [
{
  quote: "I cried happy tears when I walked into my house after my first visit. I could actually breathe. This isn't cleaning — it's emotional relief.",
  name: "Sarah M.",
  location: "Chestnut Hill",
  detail: "Working mom of 3",
  color: '#EFB988'
},
{
  quote: "As someone with ADHD, the overwhelm of my house was paralyzing. Masha showed up without judgment and gave me my home back. I can't explain how much that means.",
  name: "Jen T.",
  location: "Blue Bell",
  detail: "ADHD household",
  color: '#EB9486'
},
{
  quote: "This isn't a cleaning service. This is therapy for your house. Worth every single penny — and the peace of mind? Priceless.",
  name: "Michelle R.",
  location: "Lafayette Hill",
  detail: "Burned-out professional",
  color: '#CAE7B9'
}];


export default function TestimonialsSection() {
  return (
    <div>
    <WaveDivider fill="#e3d0c3" />
    <section className="py-24 lg:py-32 relative overflow-hidden" style={{ background: '#e3d0c3' }}>
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle, #f7b8ac 0%, transparent 65%)', transform: 'translateY(-50%) translateX(-40%)' }} />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full opacity-25 pointer-events-none" style={{ background: 'radial-gradient(circle, #b8d8c8 0%, transparent 65%)', transform: 'translate(20%, -20%)' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="text-center mb-16">
          <p className="font-body tracking-[0.25em] uppercase mb-4 font-light text-[hsl(var(--foreground))] text-lg">KIND WORDS</p>
          <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-charcoal mb-2">
            "I can breathe again."
          </h2>
          <p className="font-logo text-xl text-coral">Real women. Real relief.</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) =>
            <AnimatedSection key={i} delay={i * 0.12}>
              <div className="p-8 rounded-3xl h-full flex flex-col hover:shadow-sm transition-all duration-500 border" style={{ background: 'rgba(255,255,255,0.75)', borderColor: 'rgba(255,255,255,0.5)' }}>
                <div className="flex-1">
                  <span className="font-logo text-5xl leading-none mb-4 block" style={{ color: t.color }}>"</span>
                  <p className="font-body text-base leading-relaxed font-light -mt-2 mb-8" style={{ color: '#5a4e48' }}>
                    {t.quote}
                  </p>
                </div>
                <div>
                  <div className="h-px bg-taupe/25 mb-5" />
                  <p className="font-heading text-sm font-semibold" style={{ color: '#3a3330' }}>{t.name}</p>
                  <p className="font-body text-xs mt-0.5 font-light" style={{ color: '#9a8880' }}>{t.location} · {t.detail}</p>
                </div>
              </div>
            </AnimatedSection>
            )}
        </div>
      </div>
    </section>
    <WaveDivider fill="#e3d0c3" flip />
    </div>);

}