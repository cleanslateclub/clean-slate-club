import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '@/components/shared/AnimatedSection';
import PageHero from '@/components/shared/PageHero';

const FAQ_GROUPS = [
  {
    title: 'Getting Started',
    color: '#DFE3A2',
    items: [
      {
        q: 'Is this a cleaning service?',
        a: 'Not exactly. Clean Slate Club is household support and lifestyle help for the real-life pileup. Home resets can include light tidying, laundry, dishes, surfaces, toy pickup, room resets, errands, family logistics, and the things that make your home feel manageable again.',
      },
      {
        q: 'Do I need to clean before you come?',
        a: 'No. Please do not panic-clean for us. This is judgment-free support for busy homes, overwhelmed seasons, recovery periods, and households that need backup.',
      },
      {
        q: 'Can I book without a consult?',
        a: 'Yes. If you know what you need, you can book directly. The free consult is there if you want help choosing the best service or explaining a layered situation before booking.',
      },
    ],
  },
  {
    title: 'Booking & Consults',
    color: '#CAE7B9',
    items: [
      {
        q: 'What happens during the free consult?',
        a: 'We talk through what feels heaviest, what your home actually needs, and whether a standard service or custom visit makes the most sense. It is a quick way to make sure your first booking is realistic and useful.',
      },
      {
        q: 'How far ahead do I need to book?',
        a: 'Bookings require at least 24 hours notice. Availability is limited, so booking earlier gives you the best chance of getting your preferred day and time.',
      },
      {
        q: 'What are your service hours?',
        a: 'Standard service hours are 10:00 AM to 6:00 PM, Monday through Saturday. Sundays are not available for client-facing appointments.',
      },
    ],
  },
  {
    title: 'Pricing & Payment',
    color: '#F3DE8A',
    items: [
      {
        q: 'How does pricing work?',
        a: 'Services are priced by package, time, add-ons, and final scope. You will see an estimate before anything is finalized, and final pricing may adjust based on the actual time and approved add-ons.',
      },
      {
        q: 'Is there a deposit?',
        a: 'Yes. Service bookings require a $50 deposit. Shopping funds are separate and must be provided directly before errands or grocery runs begin.',
      },
      {
        q: 'What if I need more time than I booked?',
        a: 'If there is availability, extra time may be added at the hourly rate. If not, the most important tasks will be prioritized and you can book another visit for the rest.',
      },
    ],
  },
  {
    title: 'Service Area',
    color: '#EFB988',
    items: [
      {
        q: 'What areas do you serve?',
        a: 'Clean Slate Club currently serves Flourtown, Wyndmoor, Erdenheim, Chestnut Hill, Lafayette Hill, Blue Bell, Conshohocken, Plymouth Meeting, Ambler, Glenside, Oreland, Fort Washington, and Willow Grove.',
      },
      {
        q: 'What if I am outside the service area?',
        a: 'You can still reach out, but out-of-area bookings may not be available at launch. If it is close by, we can review it manually.',
      },
    ],
  },
  {
    title: 'Scope & Safety',
    color: '#EB9486',
    items: [
      {
        q: 'Can you help with children or aging parents?',
        a: 'Yes, within scope. Support may include supervision, companion-style help, errands, family logistics, light meal prep, school pickup, and household support. Medical care, bathing, medication administration, transfers, and clinical support are not included.',
      },
      {
        q: 'What do you not do?',
        a: 'Clean Slate Club does not handle medical care, biohazards, mold, pests, unsafe conditions, heavy lifting, furniture moving, or deep cleaning projects that require specialized equipment.',
      },
      {
        q: 'Do I need to provide supplies?',
        a: 'Yes. Please have the household supplies available for the tasks you want completed. That may include cleaners, laundry products, bins, hangers, containers, pet supplies, grocery funds, or any specific instructions.',
      },
    ],
  },
  {
    title: 'Membership',
    color: '#B58A90',
    items: [
      {
        q: 'What is Catch-Up Club?',
        a: 'Catch-Up Club is the monthly membership for homes that want regular backup. Members receive priority booking, preferred hours, reduced overtime rates, and member-only perks.',
      },
      {
        q: 'When can I join?',
        a: 'Membership becomes available after your first completed service. Once eligible, you will receive a private invitation to join and manage your membership from your dashboard.',
      },
    ],
  },
];

function FAQItem({ item, color }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-3xl border overflow-hidden bg-white" style={{ borderColor: '#33333316', borderLeft: `7px solid ${color}` }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-5 text-left flex items-center justify-between gap-5"
      >
        <span className="font-heading text-base font-semibold text-charcoal">{item.q}</span>
        <span className="font-logo text-2xl leading-none transition-transform duration-300" style={{ color: '#333333', transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
      </button>
      {open && (
        <div className="px-6 pb-6 pt-0">
          <p className="font-body text-sm leading-relaxed font-light" style={{ color: '#333333cc' }}>{item.a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <main className="min-h-screen" style={{ background: '#FDFCFB' }}>
      <PageHero
        eyebrow="FAQ"
        title="Questions? We got you."
        script="No judgment, not even here."
        description="A quick guide to booking, pricing, service area, scope, and what kind of help Clean Slate Club can actually provide."
        background="linear-gradient(135deg, #FDFCFB 0%, #DFE3A266 22%, #CAE7B966 42%, #F3DE8A55 60%, #EFB98855 76%, #EB948655 90%, #B58A9038 100%)"
        waveFill="#FDFCFB"
        scriptColor="#EB9486"
      />

      <section className="max-w-5xl mx-auto px-6 py-12 lg:py-16">
        <div className="space-y-8">
          {FAQ_GROUPS.map((group, groupIndex) => (
            <AnimatedSection key={group.title} delay={groupIndex * 0.05}>
              <div className="rounded-[2rem] border bg-white p-6 md:p-8" style={{ borderColor: '#33333318', boxShadow: '0 18px 45px #8B93A712' }}>
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-3 h-3 rounded-full" style={{ background: group.color }} />
                  <h2 className="font-heading text-2xl font-semibold text-charcoal">{group.title}</h2>
                </div>
                <div className="space-y-3">
                  {group.items.map(item => (
                    <FAQItem key={item.q} item={item} color={group.color} />
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.2}>
          <div className="mt-12 rounded-[2rem] border bg-white p-7 text-center" style={{ borderColor: '#33333318' }}>
            <p className="font-heading text-xl font-semibold text-charcoal mb-2">Still not sure where to start?</p>
            <p className="font-body text-sm font-light text-charcoal/70 mb-5">Book the free consult and bring the messy version. We’ll help you sort out what makes the most sense.</p>
            <Link to="/book?service=consult" className="inline-block text-white font-body text-sm tracking-wide px-8 py-3 rounded-full transition-all duration-300 hover:opacity-90 hover:shadow-lg" style={{ background: '#333333' }}>
              Book Free Consult →
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </main>
  );
}
