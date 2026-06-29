import React from 'react';
import { X, LockKeyhole } from 'lucide-react';

export default function QuickBookingModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-warm-white rounded-3xl border border-taupe/15 shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-warm-white border-b border-taupe/10 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg font-semibold text-charcoal">Quick Booking Locked</h2>
            <p className="font-body text-xs text-charcoal/40 font-light mt-0.5">Preview-safe mode</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-taupe/10 rounded-xl transition-colors">
            <X className="w-5 h-5 text-charcoal/40" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-2xl bg-coral/10 border border-coral/20 p-4 flex items-start gap-3">
            <LockKeyhole className="w-5 h-5 text-coral mt-0.5 shrink-0" />
            <div>
              <p className="font-body text-[10px] uppercase tracking-widest text-coral font-light">Launch-sensitive workflow locked</p>
              <p className="font-body text-sm text-charcoal/45 font-light mt-2 leading-relaxed">
                The legacy quick-booking workflow can create bookings, create TimeBlocks, generate deposit links, and send guest SMS/email confirmations. It is intentionally disabled until Base44 booking, calendar, payment, and notification behavior are verified.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-cream border border-taupe/10 px-4 py-3">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Next safe step</p>
            <p className="font-body text-xs text-charcoal/50 font-light mt-1 leading-relaxed">
              Use the public booking flow or a controlled test record while launch locks are active. Re-enable this modal only after smoke testing confirms Booking, TimeBlock, Stripe, SMS, and email contracts are safe.
            </p>
          </div>

          <button onClick={onClose} className="w-full py-3 rounded-2xl bg-coral text-white font-body text-sm tracking-wide hover:opacity-90 transition-all">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
