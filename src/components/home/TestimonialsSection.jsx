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
  color: '#B58A90'
}];

export default function TestimonialsSection() {
  const [googleReviews, setGoogleReviews] = useState([]);

  useEffect(() => {
    loadGoogleReviews();
  }, []);

  const loadGoogleReviews = async () => {
    try {
      const reviews = await base44.entities.GoogleReview.filter({ is_active: true }, '-review_date', 3);
      setGoogleReviews(reviews);
    } catch (error) {
      console.log('No Google reviews available yet');
    }
  };

  const allTestimonials = [
    ...googleReviews.map(r => ({
      quote: r.text,
      name: r.author_name,
      location: 'Google Review',
      detail: `${r.rating} stars`,
      rating: r.rating,
      color: '#F3DE8A',
      isLive: true
    })),
    ...STATIC_TESTIMONIALS,
  ].slice(0, 6);

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden" style={{ background: '#EEF3F5' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full" style={{ background: '#CAE7B9' }} />
            <span className="w-2 h-2 rounded-full" style={{ background: '#DFE3A2' }} />
            <span className="w-2 h-2 rounded-full" style={{ background: '#EB9486' }} />
            <p className="font-body tracking-[0.25em] uppercase font-light text-lg ml-2" style={{ color: '#333333' }}>KIND WORDS</p>
          </div>
          <h2 className="font-heading text-[2.45rem] lg:text-[3.35rem] font-semibold text-charcoal mb-4 leading-tight">
            "I can breathe again."
          </h2>
          <p className="font-logo text-2xl md:text-3xl leading-tight" style={{ color: '#EB9486' }}>Real houses. Real relief.</p>
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
                  <p className="font-body text-xs font-light mt-1" style={{ color: '#33333399' }}>{t.location} • {t.detail}</p>
                </div>
              </div>
            </AnimatedSection>
          )}
        </div>
      </div>
    </section>
  );
}