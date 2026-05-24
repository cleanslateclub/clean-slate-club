import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from '../components/shared/AnimatedSection';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const serviceOptions = [
  'The Fold Rush — Laundry Reset',
  'The Sink or Swim — Kitchen Reset',
  'The Clean Getaway — Post-Vacation Recovery',
  'Mess to Impress — Company-Coming Reset',
  'The Load & Behold — Full Laundry Package',
  'The Sunday Scaries — Sunday Home Reset',
  'Pardon the Mess — Overwhelm Recovery',
  'The Clean Slate — Full-Home Reset',
  'Membership Inquiry',
  'Not sure — help me decide',
];

const areaOptions = [
  'Flourtown', 'Wyndmoor', 'Erdenheim', 'Chestnut Hill',
  'Lafayette Hill', 'Blue Bell', 'Plymouth Meeting', 'Ambler',
  'Glenside', 'Oreland', 'Fort Washington', 'Other',
];

export default function BookNow() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', service: '', area: '', message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.service) {
      toast.error('Please fill in your name, email, and select a service.');
      return;
    }
    setSubmitted(true);
    toast.success('We received your request! We\'ll be in touch within 24 hours.');
  };

  if (submitted) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">✓</span>
          </div>
          <h2 className="font-heading text-3xl font-light text-charcoal mb-4">
            You're one step closer to breathing again.
          </h2>
          <p className="font-body text-base text-charcoal/50 leading-relaxed">
            We received your request and will reach out within 24 hours to schedule your reset. In the meantime, go easy on yourself — help is on the way.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left: Copy */}
            <AnimatedSection>
              <p className="font-body text-xs tracking-[0.25em] uppercase text-olive mb-4">Book Your Reset</p>
              <h1 className="font-heading text-5xl lg:text-6xl font-light text-charcoal mb-6">
                Let's get you<br />
                <span className="italic text-clay">caught up.</span>
              </h1>
              <p className="font-body text-base text-charcoal/50 leading-relaxed mb-10">
                Tell us a little about what's going on and we'll put together the perfect reset for your home. No judgment, no sales pitch — just support.
              </p>

              <div className="space-y-8">
                <div>
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-sage mb-3">What to expect</p>
                  <ul className="space-y-2.5">
                    {[
                      'We respond within 24 hours',
                      'We\'ll customize your service',
                      'Flexible scheduling available',
                      'Zero judgment, always',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-clay shrink-0" />
                        <span className="font-body text-sm text-charcoal/50">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-blush/30 p-6 border border-clay/10">
                  <p className="font-heading text-lg text-charcoal mb-1">"Your home isn't failing."</p>
                  <p className="font-body text-sm text-charcoal/50">You're busy. That's all this is.</p>
                </div>
              </div>
            </AnimatedSection>

            {/* Right: Form */}
            <AnimatedSection delay={0.15}>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="rounded-3xl bg-warm-white border border-taupe/15 p-8 lg:p-10 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-body text-xs text-charcoal/50 mb-1.5 block">Your Name *</label>
                      <Input
                        value={form.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="First & last name"
                        className="bg-cream/50 border-taupe/20 rounded-xl font-body h-12 focus:border-clay focus:ring-clay/20"
                      />
                    </div>
                    <div>
                      <label className="font-body text-xs text-charcoal/50 mb-1.5 block">Email *</label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="you@email.com"
                        className="bg-cream/50 border-taupe/20 rounded-xl font-body h-12 focus:border-clay focus:ring-clay/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-body text-xs text-charcoal/50 mb-1.5 block">Phone (optional)</label>
                    <Input
                      value={form.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                      className="bg-cream/50 border-taupe/20 rounded-xl font-body h-12 focus:border-clay focus:ring-clay/20"
                    />
                  </div>

                  <div>
                    <label className="font-body text-xs text-charcoal/50 mb-1.5 block">What do you need? *</label>
                    <Select value={form.service} onValueChange={(v) => handleChange('service', v)}>
                      <SelectTrigger className="bg-cream/50 border-taupe/20 rounded-xl font-body h-12">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceOptions.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="font-body text-xs text-charcoal/50 mb-1.5 block">Your neighborhood</label>
                    <Select value={form.area} onValueChange={(v) => handleChange('area', v)}>
                      <SelectTrigger className="bg-cream/50 border-taupe/20 rounded-xl font-body h-12">
                        <SelectValue placeholder="Select your area" />
                      </SelectTrigger>
                      <SelectContent>
                        {areaOptions.map((a) => (
                          <SelectItem key={a} value={a}>{a}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="font-body text-xs text-charcoal/50 mb-1.5 block">Tell us more (optional)</label>
                    <Textarea
                      value={form.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="What's going on at home? What would help most?"
                      rows={4}
                      className="bg-cream/50 border-taupe/20 rounded-xl font-body focus:border-clay focus:ring-clay/20"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-clay text-warm-white font-body text-sm tracking-wide py-4 rounded-full hover:bg-clay/90 hover:shadow-lg hover:shadow-clay/20 transition-all duration-500"
                  >
                    Book Your Reset
                  </button>

                  <p className="font-body text-[11px] text-charcoal/30 text-center">
                    By submitting, you agree to be contacted regarding your inquiry.
                  </p>
                </div>
              </form>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}