import React from 'react';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';
import { motion, AnimatePresence } from 'framer-motion';

// Consult first, then services from least expensive to most expensive.
const SERVICE_ORDER = ['consult', 'errands', 'senior_support', 'mothers_helper', 'organization', 'home_reset', 'meal_prep'];

// Matches the Services page color assignments, moving lightest to darkest.
const SERVICE_COLORS = {
  consult: '#333333',
  errands: '#DFE3A2',
  senior_support: '#CAE7B9',
  mothers_helper: '#F3DE8A',
  organization: '#EFB988',
  home_reset: '#EB9486',
  meal_prep: '#B58A90',
};

const SERVICE_ACCENTS = {
  consult: '#333333',
  errands: '#8B93A7',
  senior_support: '#7E7F9A',
  mothers_helper: '#B58A90',
  organization: '#B58A90',
  home_reset: '#7E7F9A',
  meal_prep: '#7E7F9A',
};

export default function Step1Service({ selected, serviceKey, onSelect, setServiceKey, onContinue, onNext }) {
  const selectedService = selected ?? serviceKey;
  const handleSelect = onSelect || setServiceKey || (() => {});
  const handleContinue = onContinue || onNext || (() => {});

  const continueWithService = (key) => {
    handleSelect(key);
    handleContinue(key);
  };

  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold text-charcoal mb-2">What kind of support do you need?</h2>
      <p className="font-body text-sm text-charcoal font-light mb-6">Choose the service that fits best — we'll customize from there.</p>

      <div className="space-y-3">
        {SERVICE_ORDER.map(key => {
          const config = SERVICE_CONFIG[key];
          if (!config) return null;
          const isSelected = selectedService === key;
          const isConsult = key === 'consult';
          const cardColor = SERVICE_COLORS[key] || config.color;
          const accentColor = SERVICE_ACCENTS[key] || config.color;

          return (
            <div key={key}>
              <button
                type="button"
                onClick={() => handleSelect(key)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                  isSelected
                    ? 'shadow-sm'
                    : 'bg-warm-white border-taupe/15 hover:border-taupe/40'
                }`}
                style={isSelected ? { background: cardColor + '18', borderColor: accentColor + '55' } : {}}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 mt-1"
                    style={{ background: cardColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-heading text-sm font-semibold text-charcoal">{config.label}</p>
                      {config.sublabel && (
                        <p className="font-body text-xs text-charcoal/60 font-light">{config.sublabel}</p>
                      )}
                    </div>
                    <p className="font-body text-xs text-charcoal font-light mt-0.5 leading-relaxed">{config.description}</p>
                    {isConsult && (
                      <p className="font-body text-xs mt-1 font-light" style={{ color: accentColor }}>Free · 15 min call</p>
                    )}
                    {isConsult && config.scheduleNote && (
                      <p className="font-body text-xs mt-1 font-light" style={{ color: '#33333399' }}>
                        {config.scheduleNote}
                      </p>
                    )}
                    {!isConsult && config.priceRange && (
                      <p className="font-body text-xs mt-1 font-light text-charcoal">
                        starting around ${config.priceRange[0]} · {config.baseMinutes / 60}hr base
                      </p>
                    )}
                  </div>
                  <span className={`w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                    isSelected ? 'border-transparent' : 'border-taupe/30'
                  }`} style={isSelected ? { background: '#333333' } : {}}>
                    {isSelected && <span className="text-white text-[8px] font-bold">✓</span>}
                  </span>
                </div>

                {/* Examples on selected */}
                {isSelected && config.examples && (
                  <div className="mt-3 ml-6 flex flex-wrap gap-1.5">
                    {config.examples.slice(0, 3).map(ex => (
                      <span
                        key={ex}
                        className="px-2.5 py-1 rounded-full text-[10px] font-body font-light text-charcoal border"
                        style={{ background: cardColor + '18', borderColor: accentColor + '30' }}
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                )}
              </button>

              {/* Continue button appears inside/below the selected card */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="px-1 pt-2"
                  >
                    <button
                      type="button"
                      onClick={() => continueWithService(key)}
                      className="w-full py-3.5 rounded-2xl font-body text-sm tracking-wide text-white transition-all duration-300 hover:opacity-90 hover:shadow-lg"
                      style={{ background: '#333333' }}
                    >
                      {isConsult ? 'Book My Free Consult →' : `Continue with ${config.label} →`}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
