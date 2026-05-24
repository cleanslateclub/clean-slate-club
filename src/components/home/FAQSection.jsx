import React from 'react';
import AnimatedSection from '../shared/AnimatedSection';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is this a cleaning service?",
    a: "Not exactly. We're a household reset and support service. Think of us as executive function help for your home — we tackle the laundry mountains, kitchen chaos, and overwhelm so you can breathe again. We don't do deep cleaning or scrubbing baseboards."
  },
  {
    q: "I'm embarrassed about the state of my home. Is that okay?",
    a: "More than okay. There is absolutely zero judgment here. Our clients are busy, overwhelmed, brilliant women who are carrying way too much. Your mess doesn't define you — and we've seen it all."
  },
  {
    q: "How quickly can I book?",
    a: "We aim for 24–48 hour turnaround for most services. Members get priority scheduling and can often book same-day resets. Weekend slots fill fast, so we recommend booking early."
  },
  {
    q: "What areas do you serve?",
    a: "We serve Flourtown, Wyndmoor, Erdenheim, Chestnut Hill, Lafayette Hill, Blue Bell, Plymouth Meeting, Ambler, Glenside, Oreland, and Fort Washington."
  },
  {
    q: "What's included in a Sunday Scaries reset?",
    a: "Our signature package includes dishes, laundry (wash, dry, fold), light tidying, reset styling, bed refresh, trash out, and a full kitchen reset. You start Monday feeling human again."
  },
  {
    q: "Do you bring your own supplies?",
    a: "Yes! We arrive with everything needed. If you have preferred products or specific sensitivities, just let us know and we'll accommodate."
  },
];

export default function FAQSection() {
  return (
    <section className="py-24 lg:py-32 bg-warm-white/50">
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-olive mb-4">FAQ</p>
          <h2 className="font-heading text-4xl lg:text-5xl font-light text-charcoal">
            Questions? We got you.
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-warm-white rounded-2xl border border-taupe/15 px-6 data-[state=open]:shadow-md transition-shadow duration-300"
              >
                <AccordionTrigger className="font-heading text-lg font-normal text-charcoal hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="font-body text-sm text-charcoal/60 leading-relaxed pb-6">
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