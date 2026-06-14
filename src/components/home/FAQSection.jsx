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
  q: "Do you bring your own supplies?",
  a: "We arrive prepared — but we actually love using your preferred products when possible. If you have specific cleaners, sensitivities, or brands you trust in your home, just let us know and we'll use what you have. We encourage it! If you'd rather we bring everything, we've got that covered too."
},
{
  q: "Can you help with senior family members or caregiving situations?",
  a: "Yes. We offer gentle, dignified household support for seniors and families navigating health transitions, new babies, recovery, or simply the chaos of a full house. All support is customized, patient, and handled with deep respect and care. Every family's situation is different — we meet you where you are."
},
{
  q: "What is the Catch-Up Club™ membership?",
  a: "The Catch-Up Club™ is our monthly membership for $49/month. Members get priority scheduling, early access booking hours (starting 9 AM vs. 10 AM standard), reduced overtime rates ($65/hr vs. $85/hr), preferred recurring time slots, and 2 free reschedules per month (non-members get 1). After your free reschedules, adjustments are $25, charged to your card on file. Membership renews monthly and can be cancelled anytime."
},
{
  q: "What's your cancellation and rescheduling policy?",
  a: "All bookings (except free consults) require a $50 deposit to hold your time. Cancellations or reschedules made with less than 24 hours notice will forfeit the deposit — no exceptions. We hold time specifically for you, and last-minute changes affect our whole day. Non-members receive 1 free reschedule; Catch-Up Club™ members receive 2 per month. After that, a $25 fee applies and is collected from your card on file."
},
{
  q: "What if my situation doesn't fit neatly into your services?",
  a: "That happens more than you'd think — and it's totally okay. Life is complicated, and sometimes what you need doesn't fit a tidy category. The best thing to do is book a free consultation call and just tell us what's going on. We'll figure out together whether we can help, how, and what it would look like. No pressure, no commitment."
}];


function FAQItem({ faq, color }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-2xl px-6 transition-all duration-300 overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.90)',
        border: `1px solid ${open ? color + '55' : '#fcd5ce30'}`,
        borderLeft: `7px solid ${color}`,
        boxShadow: open ? `0 2px 16px ${color}18` : 'none'
      }}>
      
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left">
        
        <span className="font-heading text-base font-semibold" style={{ color: '#333333' }}>{faq.q}</span>
        <span
          className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300"
          style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)', background: color + '20', color }}>
          
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ width: 12, height: 12 }}>
            <line x1="8" y1="2" x2="8" y2="14" /><line x1="2" y1="8" x2="14" y2="8" />
          </svg>
        </span>
      </button>
      {open &&
      <p className="font-body text-sm leading-relaxed pb-6 font-light" style={{ color: '#333' }}>{faq.a}</p>
      }
    </div>);

}

export default function FAQSection() {
  return (
    <section id="faq" className="py-24 lg:py-32 relative overflow-hidden" style={{ background: '#F1F1F1' }}>
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