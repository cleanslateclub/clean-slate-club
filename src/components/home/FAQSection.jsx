import React, { useState } from 'react';
import AnimatedSection from '../shared/AnimatedSection';

const BRAND_COLORS = ['#EB9486', '#CAE7B9', '#F3DE8A', '#EFB988', '#B58A90', '#EB9486', '#97A7B3', '#CAE7B9', '#EFB988', '#B58A90'];

const faqs = [
{
  q: "Is this a cleaning service?",
  a: "Not exactly. We're a household support and lifestyle assistance brand. Think of us as executive function help for your home — we tackle the overwhelm, laundry mountains, kitchen chaos, and everything that's been piling up. We show up, handle what needs handling, and leave your home — and your nervous system — in a better place."
},
{
  q: "Do I have to be embarrassed about the state of my house?",
  a: "Absolutely not. There is zero judgment here — ever. Our clients are brilliant, busy families and individuals carrying way too much. The state of your home doesn't define you, and we've seen it all. You don't need to clean before we arrive. Seriously."
},
{
  q: "What is the Reset Consult and why do I need one?",
  a: "Every new client starts with a free 15-minute Reset Consult. This isn't a quote call — it's a real conversation. We use it to understand your routines, priorities, household preferences, scheduling needs, and to make sure we show up fully prepared for your home. It makes the first visit so much better. And it's completely free."
},
{
  q: "How quickly can I get scheduled?",
  a: "We aim for 24–48 hour turnaround after your consult for most services. Members of the Catch-Up Club™ get priority scheduling and can often book same-day resets. Saturday slots fill fast — we recommend booking early in the week to secure your preferred time."
},
{
  q: "What areas do you serve?",
  a: "We serve Flourtown, Wyndmoor, Erdenheim, Chestnut Hill, Lafayette Hill, Blue Bell, Plymouth Meeting, Ambler, Glenside, Oreland, and Fort Washington — proudly local to Montgomery County."
},
{
  q: "Can you help with kids or aging parents?",
  a: "Yes, within our scope. We provide household support, companion-style help, errands, light meal prep, organization, and day-to-day assistance. We do not provide medical care, bathing, or hands-on clinical support."
},
{
  q: "Do I need to provide supplies?",
  a: "Yes. We use your household's preferred supplies, tools, containers, grocery funds, and instructions. If shopping is part of your service, funds must be provided before the errand begins."
},
{
  q: "How does payment work?",
  a: "Bookings require a card on file and a $50 deposit for service time. Shopping funds are separate and must be provided directly. Memberships, add-ons, and final balances are handled through the booking system."
},
{
  q: "What if I need more time than I booked?",
  a: "If your provider has availability, extra time may be added at the hourly rate. If not, we will prioritize the most important tasks and help you choose what to book next."
},
{
  q: "Can I book without a consult?",
  a: "Yes. If you already know what you need, you can book directly. The consult is there for anyone who wants help choosing the right support or explaining a more layered household situation."
}];

function FAQItem({ faq, color }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-3xl overflow-hidden transition-all duration-300" style={{ background: '#FFFFFF', borderColor: '#33333312', borderLeft: `7px solid ${color}` }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-6 py-5 flex items-center justify-between gap-5"
      >
        <span className="font-body text-base font-medium" style={{ color: '#333333' }}>{faq.q}</span>
        <span className="shrink-0 font-logo text-2xl leading-none transition-transform duration-300" style={{ color, transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
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
    <section id="faq" className="py-24 lg:py-32 relative overflow-hidden scroll-mt-24 lg:scroll-mt-28" style={{ background: '#F1F1F1' }}>
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        <AnimatedSection className="text-center mb-14">
          <p className="font-body tracking-[0.25em] uppercase mb-4 font-light text-lg text-[hsl(var(--foreground))]">FAQ</p>
          <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-charcoal mb-2">
            Questions? We got you.
          </h2>
          <p className="font-logo text-xl text-coral">No judgment, not even here.</p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="space-y-3">
            {faqs.map((faq, i) =>
            <FAQItem key={i} faq={faq} color={BRAND_COLORS[i % BRAND_COLORS.length]} />
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>);

}
