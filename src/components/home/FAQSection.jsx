import React from 'react';
import AnimatedSection from '../shared/AnimatedSection';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is this a cleaning service?",
    a: "Not exactly. We're a household support and lifestyle assistance brand. Think of us as executive function help for your home — we tackle the overwhelm, laundry mountains, kitchen chaos, and everything that's piling up. We don't scrub baseboards or wear aprons. We show up, handle what needs handling, and leave your home — and nervous system — in a better place."
  },
  {
    q: "Do I have to be embarrassed about the state of my house?",
    a: "Absolutely not. There is zero judgment here — ever. Our clients are brilliant, busy, overwhelmed women carrying way too much. The state of your home doesn't define you, and we've seen it all. You don't need to clean before we arrive."
  },
  {
    q: "What is the Reset Consult and why do I need one?",
    a: "Every new client starts with a free 15-minute Reset Consult. This isn't a quote call — it's a real conversation. We use it to understand your routines, priorities, household preferences, scheduling needs, and to make sure we show up fully prepared for your home. It makes the first visit so much better."
  },
  {
    q: "How quickly can I get scheduled?",
    a: "We aim for 24–48 hour turnaround after your consult for most services. Members get priority scheduling and can often book same-day resets. Weekend slots fill fast — we recommend booking early in the week."
  },
  {
    q: "What areas do you serve?",
    a: "We serve Flourtown, Wyndmoor, Erdenheim, Chestnut Hill, Lafayette Hill, Blue Bell, Plymouth Meeting, Ambler, Glenside, Oreland, and Fort Washington — proudly local to the Main Line & Montgomery County."
  },
  {
    q: "What's included in The Sunday Scaries package?",
    a: "Our signature Sunday reset includes dishes, laundry (wash, dry, fold), light tidying, reset styling, bed refresh, trash out, and a full kitchen reset. You go to bed Sunday night actually rested, and start Monday feeling like a human."
  },
  {
    q: "Do you bring your own supplies?",
    a: "Yes — we arrive with everything needed. If you have preferred products, sensitivities, or specific requests, just let us know during your consult and we'll accommodate."
  },
  {
    q: "Can you help with senior family members or caregiving situations?",
    a: "Yes. We offer gentle, dignified household support for seniors and families navigating health transitions. All support is customized, patient, and handled with deep respect and care."
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-24 lg:py-32 relative overflow-hidden" style={{ background: '#f2e4e0' }}>
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, #f7b8ac35 0%, transparent 65%)', transform: 'translate(-30%, -30%)' }} />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, #b8d8c830 0%, transparent 65%)', transform: 'translate(20%, 20%)' }} />
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="text-center mb-14">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-coral/70 mb-4 font-light">FAQ</p>
          <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-charcoal mb-2">
            Questions? We got you.
          </h2>
          <p className="font-logo text-xl text-coral">No judgment, not even here.</p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-2xl px-6 data-[state=open]:shadow-sm transition-all duration-300" style={{ background: 'rgba(255,255,255,0.75)', border: '1px solid #fcd5ce50' }}
              >
                <AccordionTrigger className="font-heading text-base font-semibold hover:no-underline py-5 text-left" style={{ color: '#3a3330' }}>
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="font-body text-sm leading-relaxed pb-6 font-light" style={{ color: '#7a6560' }}>
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimatedSection>
      </div>
    </section>
  );
}