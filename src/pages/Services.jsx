import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/shared/AnimatedSection';

const services = [
  {
    key: 'hot_mess_express',
    label: 'Hot Mess Express',
    tagline: 'When it all caught up with you.',
    description: 'Full home reset for when things have piled up. We tackle clutter, surfaces, kitchen, bathrooms, and general overwhelm so you can breathe again.',
    focus: ['Kitchen reset', 'Living spaces', 'Bathroom wipe-down', 'Laundry fold & put away', 'Trash & recycling', 'Surface clearing'],
    price: '$150–$300',
    duration: '3–5 hrs',
    color: '#EB9486',
    bg: '#fef0ee',
  },
  {
    key: 'chaos_coordinator',
    label: 'Chaos Coordinator',
    tagline: "Family support for the season you're in.",
    description: 'Hands-on support for busy households — helping with kids, light meals, errands, and general household management while you focus on what matters most.',
    focus: ['School pickup support', 'Light meal prep', 'Activity coordination', 'Household errands', 'Baby & toddler support', 'After-school routines'],
    price: '$120–$250',
    duration: '2–4 hrs',
    color: '#CAE7B9',
    bg: '#eef8ea',
  },
  {
    key: 'the_check_in',
    label: 'The Check-In',
    tagline: 'Compassionate support for seniors.',
    description: 'Warm, reliable support for older adults — whether it's companionship, errands, light housekeeping, or just someone to check in and make sure everything's okay.',
    focus: ['Companionship visits', 'Grocery & pharmacy runs', 'Light housekeeping', 'Appointment reminders', 'Meal preparation', 'Safety check-ins'],
    price: '$100–$200',
    duration: '2–3 hrs',
    color: '#EFB988',
    bg: '#fef5ec',
  },
  {
    key: 'the_runaround',
    label: 'The Runaround',
    tagline: 'Your to-do list, handled.',
    description: 'Errands, pickups, returns, dry cleaning, post office runs — all the things eating your afternoon that you can hand off to us.',
    focus: ['Grocery shopping', 'Pharmacy pickups', 'Returns & exchanges', 'Dry cleaning dropoff/pickup', 'Post office runs', 'Donation dropoffs'],
    price: '$80–$160',
    duration: '1.5–3 hrs',
    color: '#97A7B3',
    bg: '#eef1f4',
  },
  {
    key: 'clean_plate_club',
    label: 'Clean Plate Club',
    tagline: 'Real food, ready when you need it.',
    description: 'Meal prep, batch cooking, freezer meals, and pantry organization. Come home to a stocked fridge and a week's worth of meals that actually taste good.',
    focus: ['Batch cooking', 'Freezer meal prep', 'Weekly meal prep', 'Pantry organization', 'Grocery shopping', 'Recipe-based cooking'],
    price: '$120–$240',
    duration: '2–4 hrs',
    color: '#F3DE8A',
    bg: '#fdfbec',
  },
  {
    key: 'room_service',
    label: 'Room Service',
    tagline: 'Systems that actually stick.',
    description: 'Thoughtful organization for any space — closets, pantries, playrooms, home offices. We build systems that work for real life, not just for Instagram.',
    focus: ['Closet organization', 'Pantry systems', 'Playroom setup', 'Home office', 'Garage sorting', 'Paper & mail systems'],
    price: '$140–$280',
    duration: '3–5 hrs',
    color: '#B58A90',
    bg: '#f7edef',
  },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="pt-28 pb-16 px-6" style={{ background: 'linear-gradient(135deg, #fdfcfb 0%, #fef0ee 50%, #eef8ea 100%)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-body text-xs tracking-[0.25em] uppercase text-coral/60 font-light mb-3"
          >
            What We Do
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading text-4xl md:text-5xl font-semibold text-charcoal mb-4"
          >
            Services Built Around Your Life
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-body text-lg text-charcoal/50 font-light leading-relaxed max-w-xl mx-auto mb-8"
          >
            Every visit is personalized to exactly what you need. No packages, no pressure — just practical support that actually helps.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              to="/book"
              className="inline-block bg-coral text-white font-body text-sm tracking-wide px-10 py-4 rounded-full hover:bg-coral/90 transition-all duration-300"
            >
              Book a Visit
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Service Cards */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-6">
        {services.map((service, i) => (
          <AnimatedSection key={service.key} delay={i * 0.05}>
            <div className="rounded-3xl border overflow-hidden" style={{ borderColor: service.color + '30', background: service.bg }}>
              <div className="p-7 sm:p-9">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ background: service.color }} />
                      <h2 className="font-heading text-2xl font-semibold text-charcoal">{service.label}</h2>
                    </div>
                    <p className="font-logo text-base ml-6" style={{ color: service.color }}>{service.tagline}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-heading text-xl font-semibold text-charcoal">{service.price}</p>
                    <p className="font-body text-xs text-charcoal/40 font-light">{service.duration}</p>
                  </div>
                </div>

                <p className="font-body text-sm text-charcoal/60 font-light leading-relaxed mb-5">{service.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {service.focus.map(f => (
                    <span
                      key={f}
                      className="px-3 py-1 rounded-full text-xs font-body font-light text-charcoal/65 border"
                      style={{ borderColor: service.color + '40', background: '#ffffff80' }}
                    >
                      {f}
                    </span>
                  ))}
                </div>

                <Link
                  to="/book"
                  className="inline-block text-white font-body text-xs tracking-wide px-6 py-2.5 rounded-full transition-all duration-300 hover:opacity-90"
                  style={{ background: service.color }}
                >
                  Book {service.label} →
                </Link>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>

      {/* Hours note */}
      <AnimatedSection>
        <div className="max-w-4xl mx-auto px-6 pb-16">
          <div className="rounded-2xl p-6 text-center" style={{ background: 'linear-gradient(135deg, #fef0ee, #eef8ea)', border: '1px solid #fcd5ce50' }}>
            <p className="font-body text-sm text-charcoal/60 font-light">
              <strong className="font-semibold text-charcoal/80">Service hours:</strong> Monday – Saturday, 10:00 AM – 6:00 PM
              <span className="mx-3 text-charcoal/20">·</span>
              Members enjoy priority scheduling from 9:00 AM
            </p>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}