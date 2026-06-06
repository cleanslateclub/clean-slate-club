import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { MapPin, X } from 'lucide-react';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';

export default function OutOfAreaModal({ city, serviceKey, onClose }) {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', city: city || '', zip_code: '', marketing_opt_in: true });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const serviceLabel = serviceKey && SERVICE_CONFIG[serviceKey] ? SERVICE_CONFIG[serviceKey].label : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await base44.entities.ExpansionInterest.create({
      ...form,
      state: 'PA',
      desired_service: serviceLabel,
      status: 'waiting'
    });
    // Send confirmation email
    await base44.integrations.Core.SendEmail({
      to: form.email,
      subject: `Clean Slate Club™ — We can't wait to grow!`,
      body: `<!DOCTYPE html><html><body style="font-family:Lato,sans-serif;background:#fdfcfb;color:#333;margin:0;padding:0;">
        <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
          <h2 style="font-family:Montserrat,sans-serif;color:#EB9486;">We can't wait to grow. 🌿</h2>
          <p>Hi ${form.full_name || 'there'},</p>
          <p>Thank you for letting us know where you'd like to see Clean Slate Club next.</p>
          <p>Clean Slate Club is expanding thoughtfully, neighborhood by neighborhood. While we don't serve <strong>${form.city}</strong> just yet, you're on our expansion interest list and we'll let you know as soon as services become available nearby.</p>
          <p>Stay tuned — exciting things are coming!</p>
          <p style="color:#EB9486;font-family:Montserrat,sans-serif;font-weight:600;">Warmly,<br/>Masha<br/>Clean Slate Club™</p>
        </div>
      </body></html>`
    });
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="relative bg-warm-white rounded-3xl border border-taupe/20 shadow-2xl w-full max-w-md p-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-charcoal/30 hover:text-charcoal/60 transition-colors">
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-sage/30 flex items-center justify-center mx-auto mb-4 text-xl">🌿</div>
            <h3 className="font-heading text-xl font-semibold text-charcoal mb-2">You're on the list!</h3>
            <p className="font-body text-sm text-charcoal/60 font-light leading-relaxed mb-6">
              We'll reach out as soon as services come to <strong>{form.city}</strong>. We're so glad you found us.
            </p>
            <button onClick={onClose} className="px-8 py-3 rounded-full bg-coral text-white font-body text-sm tracking-wide hover:bg-coral/90 transition-all">
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-peach/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-coral" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-charcoal">Not in our area yet</h3>
                <p className="font-body text-xs text-charcoal/40 font-light">But we're growing!</p>
              </div>
            </div>

            <p className="font-body text-sm text-charcoal/60 font-light leading-relaxed mb-5">
              Clean Slate Club is expanding thoughtfully, neighborhood by neighborhood. While I don't serve <strong>{city}</strong> just yet, I'd love to know where you'd like to see us next.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                placeholder="Your name"
                value={form.full_name}
                onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/30 focus:outline-none focus:border-coral/40"
              />
              <input
                placeholder="Email address *"
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/30 focus:outline-none focus:border-coral/40"
              />
              <input
                placeholder="Phone number"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/30 focus:outline-none focus:border-coral/40"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="City / Town"
                  value={form.city}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/30 focus:outline-none focus:border-coral/40"
                />
                <input
                  placeholder="ZIP code"
                  value={form.zip_code}
                  onChange={e => setForm(f => ({ ...f, zip_code: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/30 focus:outline-none focus:border-coral/40"
                />
              </div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.marketing_opt_in}
                  onChange={e => setForm(f => ({ ...f, marketing_opt_in: e.target.checked }))}
                  className="mt-0.5 accent-coral"
                />
                <span className="font-body text-xs text-charcoal/50 font-light">
                  Notify me when services expand to my area
                </span>
              </label>
              <button
                type="submit"
                disabled={!form.email || loading}
                className="w-full py-3 rounded-full bg-coral text-white font-body text-sm tracking-wide disabled:opacity-40 hover:bg-coral/90 transition-all"
              >
                {loading ? 'Joining...' : 'Join the Neighborhood Waitlist →'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}