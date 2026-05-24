import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '../components/shared/AnimatedSection';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const serviceOptions = [
  'The Sunday Scaries — Sunday Home Reset',
  'The Clean Slate — Full-Home Reset',
  "Mother's Helper / Newborn Support",
  'Pardon the Mess — Overwhelm Recovery',
  'Meal Prep & Kitchen Support',
  'Senior / Caregiving Support',
  'Errand & Life Logistics Support',
  'Mess to Impress — Guest-Ready Reset',
  'The Clean Getaway — Post-Vacation',
  'Laundry Reset (Fold Rush / Load & Behold)',
  'Membership Inquiry — Catch-Up Club™',
  'Not sure — help me figure it out',
];

const areaOptions = [
  'Flourtown', 'Wyndmoor', 'Erdenheim', 'Chestnut Hill',
  'Lafayette Hill', 'Blue Bell', 'Plymouth Meeting', 'Ambler',
  'Glenside', 'Oreland', 'Fort Washington', 'Other nearby area',
];

export default function BookNow() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', area: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.service) {
      toast.error('Please fill in your name, email, and what you need.');
      return;
    }
    setSubmitted(true);
    toast.success("We received your request! We'll be in touch within 24 hours.");
  };

  if (submitted) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center px-6 bg-cream">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-sage/30 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✓</span>
          </div>
          <h2 className="font-heading text-3xl font-semibold text-charcoal mb-3">
            You're one step closer.
          </h2>
          <p className="font-logo text-xl text-coral mb-4">Help is on the way.</p>
          <p className="font-body text-base text-charcoal/45 leading-relaxed font-light">
            We received your Reset Consult request and will reach out within 24 hours to schedule your conversation. In the meantime — go easy on yourself.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-cream">
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

            {/* Left */}
            <AnimatedSection>
              <p className="font-body text-xs tracking-[0.25em] uppercase text-coral/70 mb-5 font-light">Book Your Consult</p>
              <h1 className="font-heading text-5xl lg:text-6xl font-semibold text-charcoal mb-2 leading-tight">
                Let's get you
              </h1>
              <h1 className="font-logo text-4xl lg:text-5xl text-coral mb-6" style={{ lineHeight: 1.1 }}>caught up.</h1>
              <p className="font-body text-base text-charcoal/50 leading-relaxed font-light mb-10">
                Every new client starts with a free 15-minute Reset Consult. Not a quote call — a real conversation. We'll figure out exactly what your home needs and how we can best support you.
              </p>

              <div className="space-y-8">
                <div>
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-coral/60 mb-3 font-light">Your consult will cover</p>
                  <ul className="space-y-2.5">
                    {[
                      'Your routines, priorities & scheduling needs',
                      'Any sensitivities or household preferences',
                      'Which services fit your life best',
                      'Transparent, honest pricing',
                      'Zero judgment, always',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-coral shrink-0 mt-1.5" />
                        <span className="font-body text-sm text-charcoal/50 font-light">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl p-6 border border-sage/30" style={{ background: '#CAE7B915' }}>
                  <p className="font-heading text-base font-semibold text-charcoal mb-1">
                    "Your home isn't failing."
                  </p>
                  <p className="font-body text-sm text-charcoal/45 font-light">You're carrying more than any one person should. That's all this is. — Masha</p>
                </div>

                <div className="flex flex-wrap gap-4">
                  {['Licensed & Insured', 'CPR Certified', 'Background Checked'].map((b) => (
                    <span key={b} className="font-body text-xs text-charcoal/40 font-light flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-sage" />{b}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Right: Form */}
            <AnimatedSection delay={0.15}>
              <div className="rounded-3xl bg-warm-white border border-taupe/15 p-8 lg:p-10 shadow-xl shadow-charcoal/4">
                <h3 className="font-heading text-xl font-semibold text-charcoal mb-1">Request Your Reset Consult</h3>
                <p className="font-body text-sm text-charcoal/40 font-light mb-7">Free · 15 minutes · No pressure</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-body text-xs text-charcoal/45 mb-1.5 block font-light">Your Name *</label>
                      <Input value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="First & last name" className="bg-cream/60 border-taupe/25 rounded-xl font-body h-12 focus:border-coral" />
                    </div>
                    <div>
                      <label className="font-body text-xs text-charcoal/45 mb-1.5 block font-light">Email *</label>
                      <Input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="you@email.com" className="bg-cream/60 border-taupe/25 rounded-xl font-body h-12 focus:border-coral" />
                    </div>
                  </div>

                  <div>
                    <label className="font-body text-xs text-charcoal/45 mb-1.5 block font-light">Phone (optional — for quick scheduling)</label>
                    <Input value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="(555) 123-4567" className="bg-cream/60 border-taupe/25 rounded-xl font-body h-12 focus:border-coral" />
                  </div>

                  <div>
                    <label className="font-body text-xs text-charcoal/45 mb-1.5 block font-light">What do you need most? *</label>
                    <Select value={form.service} onValueChange={(v) => handleChange('service', v)}>
                      <SelectTrigger className="bg-cream/60 border-taupe/25 rounded-xl font-body h-12">
                        <SelectValue placeholder="Select a service area" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="font-body text-xs text-charcoal/45 mb-1.5 block font-light">Your neighborhood</label>
                    <Select value={form.area} onValueChange={(v) => handleChange('area', v)}>
                      <SelectTrigger className="bg-cream/60 border-taupe/25 rounded-xl font-body h-12">
                        <SelectValue placeholder="Select your area" />
                      </SelectTrigger>
                      <SelectContent>
                        {areaOptions.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="font-body text-xs text-charcoal/45 mb-1.5 block font-light">Tell me what's going on (optional)</label>
                    <Textarea value={form.message} onChange={(e) => handleChange('message', e.target.value)} placeholder="What would help most right now? What's been piling up? I'm all ears — no judgment." rows={4} className="bg-cream/60 border-taupe/25 rounded-xl font-body focus:border-coral" />
                  </div>

                  <button type="submit" className="w-full bg-coral text-white font-body text-sm tracking-wide py-4 rounded-full hover:bg-coral/90 hover:shadow-lg hover:shadow-coral/25 transition-all duration-500">
                    Request My Free Consult →
                  </button>

                  <p className="font-body text-[11px] text-charcoal/25 text-center font-light">
                    We respond within 24 hours. You'll hear from Masha directly.
                  </p>
                </form>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}