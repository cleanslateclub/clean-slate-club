import React from 'react';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';

export default function Step1Service({ selected, onSelect }) {
  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold text-charcoal mb-2">What do you need help with?</h2>
      <p className="font-body text-sm text-charcoal/45 font-light mb-8">Choose the category that fits best — we'll customize from there.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(SERVICE_CONFIG).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`text-left p-5 rounded-2xl border transition-all duration-300 ${
              selected === key
                ? 'border-coral bg-coral/5 shadow-md shadow-coral/10'
                : 'border-taupe/20 bg-warm-white hover:border-coral/30 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ background: cfg.color }} />
              <span className="font-heading text-sm font-semibold text-charcoal">{cfg.label}</span>
              <span className="ml-auto font-body text-xs text-charcoal/35 font-light">${cfg.priceRange[0]}–${cfg.priceRange[1]}</span>
            </div>
            <p className="font-body text-xs text-charcoal/50 font-light leading-relaxed mb-3">{cfg.description}</p>
            <div className="space-y-1">
              {cfg.examples.slice(0, 3).map((ex, i) => (
                <p key={i} className="font-body text-[11px] text-charcoal/35 font-light flex items-start gap-1.5">
                  <span className="shrink-0 mt-0.5">→</span>{ex}
                </p>
              ))}
            </div>
            <p className="font-body text-[10px] text-charcoal/25 mt-2 font-light">Base time: {cfg.baseMinutes} min + 30 min setup/wrap</p>
          </button>
        ))}
      </div>
    </div>
  );
}