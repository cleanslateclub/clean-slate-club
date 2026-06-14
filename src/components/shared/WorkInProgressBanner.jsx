import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAppSettings';

export default function WorkInProgressBanner() {
  const [visible, setVisible] = useState(false);
  const { getBool, loading: settingsLoading } = useAppSettings();

  useEffect(() => {
    if (settingsLoading) return;

    const wipEnabled = getBool('wip_banner_enabled');
    if (!wipEnabled) return;

    const dismissed = sessionStorage.getItem('wip_dismissed');
    if (!dismissed) setVisible(true);
  }, [settingsLoading, getBool]);

  const handleClose = () => {
    sessionStorage.setItem('wip_dismissed', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/45 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-sm rounded-2xl border-2 border-coral/25 bg-warm-white shadow-2xl overflow-hidden text-center">
        {/* Brand color bar */}
        <div className="h-2 bg-gradient-to-r from-coral via-taupe to-coral" />

        {/* Obvious exit #1 */}
        <button
          onClick={handleClose}
          aria-label="Close popup"
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-coral text-white shadow-md transition-all hover:bg-coral/90 hover:scale-105"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-5 pt-6 pb-5">
          {/* Icon */}
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cream-linen border border-coral/20 text-2xl">
            🌿
          </div>

          {/* Heading */}
          <p className="mb-1 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-coral">
            Clean Slate Club™
          </p>

          <h2 className="mb-3 font-logo text-2xl font-bold text-coral">
            We're Just Getting Started!
          </h2>

          {/* Message */}
          <p className="mb-4 font-body text-[15px] font-medium leading-relaxed text-charcoal/75">
            This website is a brand new adventure and is still a work in progress.
            We're so excited to be here!
          </p>

          {/* Call to action */}
          <div className="mb-4 rounded-xl border border-taupe/20 bg-cream p-4">
            <p className="mb-2 font-body text-xs font-bold uppercase tracking-widest text-coral">
              Book a Consult
            </p>

            <p className="font-body text-[14px] font-medium leading-relaxed text-charcoal/75">
              Our online payment system is not yet fully up and running. In the meantime,
              please give us a call to schedule your free consultation.
            </p>

            <a
              href="tel:2068254061"
              className="mt-3 inline-flex items-center justify-center rounded-full bg-coral px-6 py-3 font-body text-sm font-bold tracking-wide text-white shadow-md transition-all hover:bg-coral/90 hover:scale-[1.02]"
            >
              📞 Call (206) 825-4061
            </a>
          </div>

          <p className="mb-4 font-body text-sm font-semibold text-taupe">
            Stay tuned — exciting things are coming soon! ✨
          </p>

          {/* Obvious exit #2 */}
          <button
            onClick={handleClose}
            className="w-full rounded-full border-2 border-coral bg-white px-5 py-3 font-body text-sm font-bold uppercase tracking-wide text-coral shadow-sm transition-all hover:bg-coral hover:text-white"
          >
            Continue to Site
          </button>
        </div>
      </div>
    </div>
  );
}
