import React, { useState, useEffect } from 'react';
import AnimatedSection from '../shared/AnimatedSection';
import { base44 } from '@/api/base44Client';
import { Star } from 'lucide-react';

const STATIC_TESTIMONIALS = [
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

const STAR_COLORS = ['#EB9486', '#EFB988', '#CAE7B9', '#B58A90', '#97A7B3'];


export default function TestimonialsSection() {
  const [liveReviews, setLiveReviews] = useState([]);

  useEffect(() => {
    base44.entities.Review.filter({ status: 'published' }, '-created_date', 6).then(results => {
      setLiveReviews((results || []).filter(r => r.comment && r.rating >= 4));
    });
  }, []);

  const allTestimonials = [
    ...liveReviews.map((r, i) => ({
      quote: r.comment,
      name: r.client_name || 'Happy Client',
      location: '',
      detail: '★'.repeat(r.rating),
      color: STAR_COLORS[i % STAR_COLORS.length],
      isLive: true,
      rating: r.rating,
    })),
    ...STATIC_TESTIMONIALS,
  ].slice(0, 6);

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden" style={{ background: '#FFE5D9' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full" style={{ background: '#CAE7B9' }} />
            <span className="w-2 h-2 rounded-full" style={{ background: '#DFE3A2' }} />
            <span className="w-2 h-2 rounded-full" style={{ background: '#EB9486' }} />
          </div>
          <p className="font-body tracking-[0.25em] uppercase mb-4 font-light text-lg" style={{ color: '#333333' }}>KIND WORDS</p>
          <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-charcoal mb-2">
            "I can breathe again."
          </h2>
          <p className="font-logo text-xl" style={{ color: '#EB9486' }}>Real houses. Real relief.</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {allTestimonials.map((t, i) =>
            <AnimatedSection key={i} delay={i * 0.12}>
              <div className="p-8 rounded-3xl h-full flex flex-col hover:shadow-sm transition-all duration-500 border" style={{ background: '#FFFFFFCC', borderColor: t.color + '45', boxShadow: `0 18px 45px ${t.color}14` }}>
                <div className="flex-1">
                  {t.isLive ? (
                    <div className="flex gap-0.5 mb-4">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className="w-4 h-4" fill={s <= t.rating ? t.color : 'none'} stroke={s <= t.rating ? t.color : '#ddd'} strokeWidth={1.5} />
                      ))}
                    </div>
                  ) : (
                    <span className="font-logo text-5xl leading-none mb-4 block" style={{ color: t.color }}>"</span>
                  )}
                  <p className="font-body text-base leading-relaxed font-light -mt-2 mb-8" style={{ color: '#333333' }}>
                    {t.isLive ? `"${t.quote}"` : t.quote}
                  </p>
                </div>
                <div>
                  <div className="h-px mb-5" style={{ background: t.color + '35' }} />
                  <p className="font-heading text-sm font-semibold" style={{ color: '#333333' }}>{t.name}</p>
                  {(t.location || t.detail) && (
                    <p className="font-body text-xs mt-0.5 font-light" style={{ color: '#7E7F9A' }}>
                      {[t.location, !t.isLive && t.detail].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
              </div>
            </AnimatedSection>
          )}
        </div>
      </div>
    </section>
    );


}