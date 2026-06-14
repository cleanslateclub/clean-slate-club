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
  }, [settingsLoading]);

  const handleClose = () => {
    sessionStorage.setItem('wip_dismissed', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/45 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border-2 border-coral/30 bg-warm-white shadow-2xl text-center">
        <div
          className="h-2"
          style={{
            backgroundImage: 'linear-gradient(to right, #EF8F82, #B8A89A, #9CAF88)',
          }}
        />

        {/* Obvious exit #1 */}
        <button
          onClick={handleClose}
          aria-label="Close popup"
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-coral text-white shadow-lg transition-all hover:bg-coral/90 hover:scale-105"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="px-6 py-5">
          <div className="mb-3 pr-12 text-left">
            <p className="font-body text-[11px] font-bold uppercase tracking-[0.22em] text-taupe">
              Clean Slate Club™
            </p>

            <h2 className="font-logo text-2xl font-bold leading-tight text-coral">
              We're Just Getting Started!
            </h2>
          </div>

          <p className="mx-auto mb-4 max-w-sm font-body text-[15px] font-semibold leading-relaxed text-charcoal/75">
            This website is brand new and still a work in progress. We're so excited to be here!
          </p>

          <div className="mb-4 rounded-xl border border-taupe/20 bg-cream px-4 py-3">
            <p className="mb-1 font-body text-xs font-bold uppercase tracking-widest text-coral">
              Book a Consult
            </p>

            <p className="font-body text-[14px] font-semibold leading-snug text-charcoal/70">
              Online payments are still being set up. Please call us to schedule your free consultation.
            </p>

            <a
              href="tel:2068254061"
              className="mt-3 inline-flex items-center justify-center rounded-full bg-coral px-6 py-2.5 font-body text-sm font-bold tracking-wide text-white shadow-md transition-all hover:bg-coral/90 hover:scale-[1.02]"
            >
              📞 Call (206) 825-4061
            </a>
          </div>

          <div
            className="mb-4 rounded-full px-4 py-2"
            style={{ backgroundColor: 'rgba(156, 175, 136, 0.15)' }}
          >
            <p className="font-body text-sm font-bold text-charcoal/65">
              Stay tuned — exciting things are coming soon! ✨
            </p>
          </div>

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
