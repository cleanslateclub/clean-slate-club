import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';

export default function WorkInProgressBanner() {
  const [visible, setVisible] = useState(false);
  const { getBool, loading: settingsLoading } = useAppSettings();

  useEffect(() => {
    if (settingsLoading) return;
    const wipEnabled = getBool('wip_banner_enabled');
    if (!wipEnabled) return; // Admin toggled it off
    const dismissed = sessionStorage.getItem('wip_dismissed');
    if (!dismissed) setVisible(true);
  }, [settingsLoading]);

  const handleClose = () => {
    sessionStorage.setItem('wip_dismissed', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm px-4 py-6">
      <div className="relative bg-warm-white rounded-2xl border border-taupe/20 shadow-2xl w-full max-w-sm p-5 sm:p-6 text-center">
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close work in progress notice"
          className="absolute top-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-charcoal text-white shadow-lg transition-colors hover:bg-charcoal/85 focus:outline-none focus:ring-2 focus:ring-charcoal focus:ring-offset-2"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Icon */}
        <div className="w-11 h-11 rounded-full bg-cream-linen flex items-center justify-center mx-auto mb-4 text-xl">
          🌿
        </div>

        {/* Heading */}
        <p className="font-body text-[10px] tracking-[0.25em] uppercase text-coral/60 font-light mb-1">Clean Slate Club™</p>
        <h2 className="font-logo text-xl sm:text-2xl text-coral mb-2">We're Just Getting Started!</h2>

        {/* Message */}
        <p className="font-body text-sm text-charcoal/65 font-light leading-relaxed mb-3">
          This website is a brand new adventure and is still a work in progress. We're so excited to be here!
        </p>

        {/* Divider line */}
        <div className="border-t border-taupe/15 my-3" />

        {/* Call to action */}
        <div className="bg-cream rounded-xl p-3.5 mb-3">
          <p className="font-body text-xs text-charcoal/50 font-light uppercase tracking-widest mb-1">Book a Consult</p>
          <p className="font-body text-sm text-charcoal/70 font-light leading-relaxed">
            Our online payment system is not yet fully up and running. In the meantime, please give us a call to schedule your free consultation!
          </p>
          <a
            href="tel:2068254061"
            className="inline-block mt-3 px-6 py-2.5 rounded-full bg-coral text-white font-body text-sm tracking-wide hover:bg-coral/90 transition-all"
          >
            📞 Call (206) 825-4061
          </a>
        </div>

        <p className="font-body text-xs text-charcoal/40 font-light">
          Stay tuned — exciting things are coming soon! ✨
        </p>

        <button
          type="button"
          onClick={handleClose}
          className="mt-4 w-full rounded-full bg-charcoal px-6 py-3.5 font-body text-sm font-semibold tracking-wide text-white shadow-lg transition-colors hover:bg-charcoal/85 focus:outline-none focus:ring-2 focus:ring-charcoal focus:ring-offset-2"
        >
          Continue to site
        </button>
      </div>
    </div>
  );
}
