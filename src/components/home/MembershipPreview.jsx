import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../shared/AnimatedSection';
import WaveDivider from '../shared/WaveDivider';

const perks = [
{ label: 'Priority scheduling', detail: 'Book 48hrs before the calendar opens to the public', dot: '#CAE7B9' },
{ label: 'Early access hours', detail: 'Book visits starting at 9:00 AM (vs. 10:00 AM standard)', dot: '#EB9486' },
{ label: 'Reduced overtime rate', detail: '$65/hr for overtime vs. $85/hr standard', dot: '#EFB988' },
{ label: 'Preferred scheduling', detail: 'Hold recurring time slots on a consistent schedule', dot: '#B58A90' },
{ label: 'Monthly check-ins', detail: "Wellness check-in text from Masha every month", dot: '#CAE7B9' },
{ label: 'Flexible reschedules', detail: 'Easy reschedules with no penalty for members', dot: '#97A7B3' }];


export default function MembershipPreview() {
  return (
    <div>
    <WaveDivider fill="#fdf5f3" />
    <section className="py-24 lg:py-36 relative overflow-hidden" style={{ background: '#fdf5f3' }}>

      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, #f8b87840 0%, transparent 65%)', transform: 'translate(30%, 20%)' }} />
      <div className="absolute top-0 left-0 w-[350px] h-[350px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, #b8d8c838 0%, transparent 65%)', transform: 'translate(-20%, -20%)' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="text-center mb-14">
          <p className="font-body text-xs tracking-[0.25em] uppercase mb-4 font-light text-[hsl(var(--card-foreground))]">MEMBERSHIPS</p>
          <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-charcoal mb-3">
            Join the <span className="font-logo font-normal" style={{ color: '#EB9486' }}>Catch-Up Club™</span>
          </h2>
          <p className="font-body text-base text-charcoal/45 max-w-md mx-auto leading-relaxed font-light">
            Recurring support for homes that deserve to stay ahead. Priority booking, member pricing, and seasonal perks.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="max-w-2xl mx-auto rounded-3xl overflow-hidden border border-coral/20 shadow-xl shadow-coral/5">
            {/* Card header */}
            <div className="p-10 text-center" style={{ background: 'linear-gradient(135deg, #EB9486 0%, #fcd5ce 60%, #ece4db 100%)' }}>
              <p className="font-body text-xs tracking-[0.25em] uppercase font-light mb-2 text-[hsl(var(--foreground))]">MONTHLY MEMBERSHIP</p>
              <p className="font-heading text-6xl font-semibold text-white mb-1">$49</p>
              <p className="font-body text-sm font-light text-[hsl(var(--foreground))]">per month · cancel anytime</p>
            </div>
            {/* Perks */}
            <div className="p-8 lg:p-10" style={{ background: 'rgba(255,255,255,0.9)' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {perks.map((perk, i) =>
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style={{ background: perk.dot }} />
                    <div>
                      <p className="font-body text-sm text-charcoal font-light">{perk.label}</p>
                      <p className="font-body text-xs font-light" style={{ color: '#9a8880' }}>{perk.detail}</p>
                    </div>
                  </div>
                  )}
              </div>
              <Link
                  to="/memberships"
                  className="block w-full text-center bg-coral text-white font-body text-sm tracking-wide px-8 py-4 rounded-full hover:bg-coral/90 transition-all duration-300">
                  
                Join The Catch-Up Club™ →
              </Link>
              <p className="text-center font-body text-xs font-light mt-3" style={{ color: '#baa090' }}>
                Membership fee is separate from service costs. Services billed per visit.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
    <WaveDivider fill="#e5f4ec" flip />
    </div>);

}