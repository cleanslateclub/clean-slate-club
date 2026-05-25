import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/shared/AnimatedSection';

const perks = [
  { label: 'Priority scheduling', detail: 'Book 48hrs before the calendar opens to the public', dot: '#CAE7B9' },
  { label: 'Early access hours', detail: 'Book visits starting at 9:00 AM (vs. 10:00 AM standard)', dot: '#EB9486' },
  { label: 'Reduced overtime rate', detail: '$65/hr for overtime vs. $85/hr standard', dot: '#EFB988' },
  { label: 'Preferred scheduling', detail: 'Hold recurring time slots on a consistent schedule — up to 3 sessions in a row', dot: '#B58A90' },
  { label: 'Monthly check-ins', detail: "Wellness check-in text from Masha every month", dot: '#CAE7B9' },
  { label: 'Flexible reschedules', detail: 'Easy reschedules with no penalty for members', dot: '#97A7B3' },
];

export default function Memberships() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="pt-28 pb-16 px-6" style={{ background: 'linear-gradient(135deg, #fdfcfb 0%, #eef8ea 50%, #fef0ee 100%)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-body text-xs tracking-[0.25em] uppercase text-coral/60 font-light mb-3"
          >
            Membership
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-logo text-5xl md:text-6xl text-coral mb-2"
          >
            Catch-Up Club™
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="font-heading text-xl md:text-2xl font-semibold text-charcoal mb-5"
          >
            Recurring support for homes that deserve to stay ahead.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-body text-lg text-charcoal/50 font-light leading-relaxed"
          >
            Priority booking, member pricing, and seasonal perks — for the home that's ready to stop playing catch-up.
          </motion.p>
        </div>
      </div>

      {/* Membership card */}
      <div className="max-w-xl mx-auto px-6 py-16">
        <AnimatedSection>
          <div className="rounded-3xl overflow-hidden border border-coral/20 shadow-xl shadow-coral/5">
            {/* Card header */}
            <div className="p-10 text-center" style={{ background: 'linear-gradient(135deg, #EB9486 0%, #fcd5ce 60%, #ece4db 100%)' }}>
              <p className="font-body text-xs tracking-[0.25em] uppercase font-light mb-2 text-white/80">MONTHLY MEMBERSHIP</p>
              <p className="font-heading text-6xl font-semibold text-white mb-1">$49</p>
              <p className="font-body text-sm font-light text-white/70">per month · cancel anytime</p>
            </div>

            {/* Perks */}
            <div className="p-8 lg:p-10" style={{ background: 'rgba(255,255,255,0.9)' }}>
              <p className="font-heading text-sm font-semibold text-charcoal mb-6">What's included</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {perks.map((perk, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style={{ background: perk.dot }} />
                    <div>
                      <p className="font-body text-sm text-charcoal font-light">{perk.label}</p>
                      <p className="font-body text-xs font-light" style={{ color: '#9a8880' }}>{perk.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/book"
                className="block w-full text-center bg-coral text-white font-body text-sm tracking-wide px-8 py-4 rounded-full hover:bg-coral/90 transition-all duration-300"
              >
                Join The Catch-Up Club™ →
              </Link>
              <p className="text-center font-body text-xs font-light mt-3" style={{ color: '#baa090' }}>
                Membership fee is separate from service costs. Services billed per visit.
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Comparison note */}
        <AnimatedSection delay={0.1}>
          <div className="mt-8 rounded-2xl p-6" style={{ background: '#fdf6f3', border: '1px solid #fcd5ce40' }}>
            <p className="font-heading text-sm font-semibold text-charcoal mb-3">Members vs. Standard</p>
            <div className="space-y-2">
              {[
                ['Booking window opens', 'Priority (48hr early)', 'Same as public'],
                ['Start time', 'From 9:00 AM', 'From 10:00 AM'],
                ['Overtime rate', '$65/hr', '$85/hr'],
                ['Recurring slot hold', '✓ Up to 3 sessions', 'Not available'],
              ].map(([feature, member, standard]) => (
                <div key={feature} className="grid grid-cols-3 gap-2 text-xs font-body">
                  <span className="text-charcoal/50 font-light">{feature}</span>
                  <span className="text-coral font-light">{member}</span>
                  <span className="text-charcoal/30 font-light">{standard}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <p className="text-center font-body text-xs text-charcoal/30 font-light mt-8">
            Questions? Text us at (215) 555-0100 or email hello@cleanslateclubpa.com
          </p>
        </AnimatedSection>
      </div>
    </div>
  );
}