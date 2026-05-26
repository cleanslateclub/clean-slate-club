import React from 'react';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';
import { motion, AnimatePresence } from 'framer-motion';

// Consult first, then the rest
const SERVICE_ORDER = ['consult', 'home_reset', 'mothers_helper', 'errands', 'senior_support', 'meal_prep', 'organization'];

export default function Step1Service({ selected, onSelect, onContinue }) {
  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold text-charcoal mb-2">What kind of support do you need?</h2>
      <p className="font-body text-sm text-charcoal/45 font-light mb-6">Choose the service that fits best — we'll customize from there.</p>

      <div className="space-y-3">
        {SERVICE_ORDER.map(key => {
          const config = SERVICE_CONFIG[key];
          if (!config) return null;
          const isSelected = selected === key;
          const isConsult = key === 'consult';

          return (
            <div key={key}>
              <button
                type="button"
                onClick={() => onSelect(key)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                  isSelected
                    ? 'shadow-sm'
                    : 'bg-warm-white border-taupe/15 hover:border-taupe/40'
                }`}
                style={isSelected ? { background: config.color + '12', borderColor: config.color + '60' } : {}}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 mt-1"
                    style={{ background: config.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-heading text-sm font-semibold text-charcoal">{config.label}</p>
                      {config.sublabel && (
                        <p className="font-body text-xs text-charcoal/35 font-light">{config.sublabel}</p>
                      )}
                    </div>
                    <p className="font-body text-xs text-charcoal/50 font-light mt-0.5 leading-relaxed">{config.description}</p>
                    {isConsult && (
                      <p className="font-body text-xs mt-1 font-light" style={{ color: config.color }}>Free · 15 min call</p>
                    )}
                    {!isConsult && config.priceRange && (
                      <p className="font-body text-xs mt-1 font-light text-charcoal/40">
                        from ${config.priceRange[0]} · {config.baseMinutes / 60}hr base
                      </p>
                    )}
                  </div>
                  <span className={`w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                    isSelected ? 'border-transparent' : 'border-taupe/30'
                  }`} style={isSelected ? { background: config.color } : {}}>
                    {isSelected && <span className="text-white text-[8px] font-bold">✓</span>}
                  </span>
                </div>

                {/* Examples on selected */}
                {isSelected && config.examples && (
                  <div className="mt-3 ml-6 flex flex-wrap gap-1.5">
                    {config.examples.slice(0, 3).map(ex => (
                      <span
                        key={ex}
                        className="px-2.5 py-1 rounded-full text-[10px] font-body font-light text-charcoal/55 border"
                        style={{ background: config.color + '18', borderColor: config.color + '30' }}
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
                      onClick={onContinue}
                      className="w-full py-3.5 rounded-2xl font-body text-sm tracking-wide text-white transition-all duration-300 hover:opacity-90 hover:shadow-lg"
                      style={{ background: config.color }}
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