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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#333333]/40 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-[440px] overflow-hidden rounded-[2rem] border shadow-2xl" style={{ background: '#F8EDEB', borderColor: '#EB948640', boxShadow: '0 24px 70px #33333333' }}>
        <button
          onClick={handleClose}
          aria-label="Close popup"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border transition-all hover:scale-105"
          style={{ background: '#FFFFFFCC', borderColor: '#EB948640', color: '#333333' }}>
          <X className="h-5 w-5" />
        </button>

        <div className="px-7 pb-7 pt-8 text-center">
          <div className="mb-5 flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: '#CAE7B9' }} />
            <span className="h-2 w-2 rounded-full" style={{ background: '#EFB988' }} />
            <span className="h-2 w-2 rounded-full" style={{ background: '#B58A90' }} />
          </div>

          <p className="mb-2 font-body text-[11px] font-light uppercase tracking-[0.28em]" style={{ color: '#7E7F9A' }}>
            Clean Slate Club™
          </p>

          <h2 className="mb-4 font-logo text-4xl font-normal leading-none" style={{ color: '#EB9486' }}>
            Soft launch mode
          </h2>

          <p className="mx-auto mb-5 max-w-sm font-body text-[15px] font-light leading-relaxed" style={{ color: '#333333cc' }}>
            This site is still getting its final polish, but you can absolutely reach out about support in the meantime.
          </p>

          <div className="mb-5 rounded-3xl border px-5 py-4 text-left" style={{ background: '#FFFFFFB3', borderColor: '#D8E2DC' }}>
            <p className="mb-1 font-body text-[11px] font-light uppercase tracking-[0.22em]" style={{ color: '#8B93A7' }}>
              Booking note
            </p>
            <p className="font-body text-sm font-light leading-relaxed" style={{ color: '#333333cc' }}>
              Online payments are still being connected. For now, call to schedule a free consultation.
            </p>
            <a
              href="tel:2068254061"
              className="mt-4 inline-flex w-full items-center justify-center rounded-full px-5 py-3 font-body text-sm tracking-wide transition-all hover:shadow-md"
              style={{ background: '#333333', color: '#FFFFFF' }}>
              Call (206) 825-4061
            </a>
          </div>

          <button
            onClick={handleClose}
            className="w-full rounded-full border px-5 py-3 font-body text-sm tracking-wide transition-all hover:shadow-sm"
            style={{ background: '#FFFFFF99', borderColor: '#EB948655', color: '#333333' }}>
            Continue to Site
          </button>
        </div>
      </div>
    </div>
  );
}
