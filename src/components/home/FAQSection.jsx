import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../shared/AnimatedSection';

const BRAND_COLORS = ['#DFE3A2', '#CAE7B9', '#F3DE8A', '#EFB988', '#EB9486', '#B58A90'];

const faqs = [
  {
    q: "Is this a cleaning service?",
    a: "Not exactly. Clean Slate Club is household support for the real-life pileup: light resets, laundry, dishes, errands, family logistics, and the things that help your home feel manageable again."
  },
  {
    q: "Do I need to clean before you come?",
    a: "No. Please do not panic-clean for us. This is judgment-free support for busy homes and overwhelmed seasons."
  },
  {
    q: "Do I need to be home for the first visit?",
    a: "Yes. For the first visit, someone must be home to let the provider in, walk through priorities, show where supplies are kept, and share any pet, parking, entry, or household notes."
  },
  {
    q: "Do I need to provide supplies?",
    a: "Providers may bring a small basic kit for normal touch-ups, but Clean Slate Club is not stocked like a traditional cleaning company. We prefer to use your household’s products, tools, laundry items, bins, hangers, containers, and instructions."
  },
  {
    q: "What is outside the scope of service?",
    a: "Clean Slate Club does not handle medical care, biohazards, mold, pests, unsafe conditions, heavy lifting, furniture moving, hauling, junk removal, ladders, exterior work, or deep cleaning projects that require specialized equipment."
  },
  {
    q: "What safety rules should I know?",
    a: "Providers must be treated with kindness and respect. Service may be refused, paused, or ended for harassment, unsafe driving conditions, unsafe home conditions, unsecured pets, active conflict, threats, discrimination, or requests outside the booked scope."
  }
];

function FAQItem({ faq, color }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-3xl overflow-hidden transition-all duration-300" style={{ background: '#FFFFFF', borderColor: '#33333312', borderLeft: `7px solid ${color}` }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-6 py-5 flex items-center justify-between gap-5"
      >
        <span className="font-body text-base font-medium" style={{ color: '#333333' }}>{faq.q}</span>
        <span className="shrink-0 font-logo text-2xl leading-none transition-transform duration-300" style={{ color: '#333333', transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
      </button>
      {open && (
        <div className="px-6 pb-6 pt-0">
          <p className="font-body text-sm leading-relaxed font-light" style={{ color: '#333333cc' }}>{faq.a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQSection() {
  return (
    <section id="faq" className="py-24 lg:py-32 relative overflow-hidden scroll-mt-24 lg:scroll-mt-28" style={{ background: '#DDE5EA' }}>
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full" style={{ background: '#CAE7B9' }} />
            <span className="w-2 h-2 rounded-full" style={{ background: '#DFE3A2' }} />
            <span className="w-2 h-2 rounded-full" style={{ background: '#EB9486' }} />
            <p className="font-body tracking-[0.25em] uppercase font-light text-lg ml-2" style={{ color: '#333333' }}>FAQ</p>
          </div>
          <h2 className="font-heading text-[2.45rem] lg:text-[3.35rem] font-semibold text-charcoal mb-4 leading-tight">
            Questions? We got you.
          </h2>
          <p className="font-logo text-2xl md:text-3xl leading-tight" style={{ color: '#EB9486' }}>A few quick answers before you book.</p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="space-y-3">
            {faqs.map((faq, i) =>
              <FAQItem key={i} faq={faq} color={BRAND_COLORS[i % BRAND_COLORS.length]} />
            )}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div className="mt-10 text-center">
            <Link to="/faq" className="inline-block text-white font-body text-sm tracking-wide px-8 py-3 rounded-full transition-all duration-300 hover:opacity-90 hover:shadow-lg" style={{ background: '#333333' }}>
              View Full FAQ →
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
