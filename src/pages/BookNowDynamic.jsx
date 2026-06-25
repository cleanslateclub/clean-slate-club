import React, { useEffect, useState } from 'react';
import BookNow from './BookNow';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';
import { loadDynamicBookingConfig } from '@/lib/dynamicBookingMenu';

let hydratedOnce = false;

const hydrateServiceConfig = (bookingConfig = {}) => {
  Object.keys(bookingConfig).forEach(key => {
    SERVICE_CONFIG[key] = bookingConfig[key];
  });
  hydratedOnce = true;
};

export default function BookNowDynamic() {
  const [ready, setReady] = useState(hydratedOnce);
  const [source, setSource] = useState(hydratedOnce ? 'cached' : 'loading');

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const result = await loadDynamicBookingConfig();
        hydrateServiceConfig(result.bookingConfig);
        if (active) {
          setSource(result.source || 'defaults');
          setReady(true);
        }
      } catch (error) {
        console.error('Dynamic booking config failed; using static fallback:', error);
        if (active) {
          setSource('static-fallback');
          setReady(true);
        }
      }
    };

    load();
    return () => { active = false; };
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-6">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-taupe border-t-coral rounded-full animate-spin mx-auto mb-4" />
          <p className="font-body text-sm text-charcoal/40 font-light">Loading booking menu...</p>
        </div>
      </div>
    );
  }

  return <BookNow serviceMenuSource={source} />;
}
