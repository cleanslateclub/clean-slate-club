import React from 'react';
import { SERVICE_CONFIG, BUFFER_PREP, BUFFER_WRAP } from '@/lib/bookingConfig';

export default function Step3Addons({ serviceKey, selectedAddons, onToggle }) {
  const config = SERVICE_CONFIG[serviceKey];
  if (!config) return null;

  const addonMinutes = selectedAddons.reduce((sum, id) => {
    const addon = config.addons.find(a => a.id === id);
    return sum + (addon ? addon.minutes : 0);
  }, 0);

  const totalMinutes = BUFFER_PREP + config.baseMinutes + addonMinutes + BUFFER_WRAP;
  const totalHours = (totalMinutes / 60).toFixed(1);

  const addonPrice = selectedAddons.reduce((sum, id) => {
    const addon = config.addons.find(a => a.id === id);
    return sum + (addon ? addon.price : 0);
  }, 0);

  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold text-charcoal mb-2">Customize your visit</h2>
      <p className="font-body text-sm text-charcoal/45 font-light mb-6">Stack on extras — each one is added to your estimated visit time.</p>

      {/* Time summary */}
      <div className="bg-coral/5 border border-coral/15 rounded-2xl p-4 mb-6 flex flex-wrap gap-6 items-center">
        <div>
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/35 font-light mb-0.5">Base service</p>
          <p className="font-heading text-sm font-semibold text-charcoal">{config.baseMinutes} min</p>
        </div>
        <div>
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/35 font-light mb-0.5">Setup + wrap-up</p>
          <p className="font-heading text-sm font-semibold text-charcoal">{BUFFER_PREP + BUFFER_WRAP} min</p>
        </div>
        <div>
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/35 font-light mb-0.5">Add-ons</p>
          <p className="font-heading text-sm font-semibold text-coral">+{addonMinutes} min</p>
        </div>
        <div className="ml-auto text-right">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/35 font-light mb-0.5">Total visit time</p>
          <p className="font-heading text-xl font-semibold text-charcoal">{totalHours} hrs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {config.addons.map(addon => {
          const isSelected = selectedAddons.includes(addon.id);
          return (
            <button
              key={addon.id}
              type="button"
              onClick={() => onToggle(addon.id)}
              className={`text-left p-4 rounded-2xl border transition-all duration-200 ${
                isSelected
                  ? 'bg-coral/5 border-coral shadow-sm shadow-coral/10'
                  : 'bg-warm-white border-taupe/15 hover:border-coral/25'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <span className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                    isSelected ? 'bg-coral border-coral' : 'border-taupe/40'
                  }`}>
                    {isSelected && <span className="text-white text-[8px]">✓</span>}
                  </span>
                  <div>
                    <p className="font-body text-sm text-charcoal font-light">{addon.label}</p>
                    <p className="font-body text-xs text-charcoal/35 font-light">+{addon.minutes} min</p>
                  </div>
                </div>
                <span className="font-body text-sm text-coral font-light shrink-0">+${addon.price}</span>
              </div>
            </button>
          );
        })}
      </div>

      {selectedAddons.length > 0 && (
        <div className="mt-4 p-4 bg-warm-white rounded-2xl border border-taupe/15 flex justify-between items-center">
          <span className="font-body text-sm text-charcoal/50 font-light">{selectedAddons.length} add-on{selectedAddons.length > 1 ? 's' : ''} selected</span>
          <span className="font-heading text-sm font-semibold text-coral">+${addonPrice} est.</span>
        </div>
      )}
    </div>
  );
}