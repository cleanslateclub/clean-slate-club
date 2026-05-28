import React from 'react';
import { SERVICE_CONFIG, BUFFER_PREP, BUFFER_WRAP } from '@/lib/bookingConfig';

export default function Step3Addons({ serviceKey, selectedAddons, onToggle, dynamicEstimate, selectedTasks = [] }) {
  const config = SERVICE_CONFIG[serviceKey];
  if (!config) return null;

  // Map of add-on IDs to task keywords they correspond to
  const addonToTaskMap = {
    fridge_refresh: ['Refrigerator Cleanout'],
    pantry_party: ['Pantry Straightening'],
    closet_comeback: ['Closet Reset'],
    bed_reset: ['Bed Linen Change'],
    toy_story: ['Toy Pickup'],
    pet_check: ['Pet Feeding'],
    donation_station: ['Donation Bag Prep'],
  };

  // Check if an add-on should be hidden (already selected as a task)
  const isAddOnDisabledByTask = (addonId) => {
    const relatedTasks = addonToTaskMap[addonId] || [];
    return relatedTasks.some(task => selectedTasks.includes(task));
  };

  // Filter addons: hide ones that match selected tasks
  const availableAddons = config.addons.filter(addon => !isAddOnDisabledByTask(addon.id));

  const addonMinutes = selectedAddons.reduce((sum, id) => {
    const addon = config.addons.find(a => a.id === id);
    return sum + (addon ? addon.minutes : 0);
  }, 0);

  const addonPrice = selectedAddons.reduce((sum, id) => {
    const addon = config.addons.find(a => a.id === id);
    return sum + (addon ? addon.price : 0);
  }, 0);

  const totalMinutes = dynamicEstimate ? dynamicEstimate.durationMinutes : (BUFFER_PREP + config.baseMinutes + addonMinutes + BUFFER_WRAP);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const estimateLow = dynamicEstimate ? dynamicEstimate.low : config.priceRange[0] + addonPrice;
  const estimateHigh = dynamicEstimate ? dynamicEstimate.high : config.priceRange[1] + addonPrice;
  const flags = dynamicEstimate ? dynamicEstimate.flags : [];

  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold text-charcoal mb-2">Customize your visit</h2>
      <p className="font-body text-sm text-charcoal font-light mb-6">Stack on extras — each one is added to your estimated visit time.</p>

      {/* Live estimate summary */}
      <div className="rounded-2xl p-4 mb-5" style={{ background: 'linear-gradient(135deg, #fec5bb30 0%, #f3de8a25 50%, #cae7b930 100%)', border: '1px solid #fcd5ce60' }}>
        <div className="flex flex-wrap gap-6 items-center mb-3">
          <div>
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal font-light mb-0.5">Est. visit time</p>
            <p className="font-heading text-xl font-semibold text-charcoal">{totalHours} hrs</p>
          </div>
          <div>
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal font-light mb-0.5">Add-ons</p>
            <p className="font-heading text-sm font-semibold text-coral">+{addonMinutes} min · +${addonPrice}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal font-light mb-0.5">Estimated total</p>
            <p className="font-heading text-xl font-semibold text-charcoal">${estimateLow}–${estimateHigh}</p>
          </div>
        </div>

        {/* Dynamic flags */}
        {flags.length > 0 && (
          <div className="space-y-1 pt-2 border-t border-taupe/15">
            {flags.map((flag, i) => (
              <p key={i} className="font-body text-[11px] text-charcoal font-light flex items-start gap-1.5">
                <span className="text-coral shrink-0 mt-0.5">↑</span>{flag}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Add-on grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ background: 'linear-gradient(160deg, #fdf6f4 0%, #f5fbf3 100%)', borderRadius: '1rem', padding: '1rem' }}>
        {availableAddons.map(addon => {
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
                    <p className="font-body text-xs text-charcoal font-light">+{addon.minutes} min</p>
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
          <span className="font-body text-sm text-charcoal font-light">{selectedAddons.length} add-on{selectedAddons.length > 1 ? 's' : ''} selected</span>
          <span className="font-heading text-sm font-semibold text-coral">+${addonPrice} est.</span>
        </div>
      )}
    </div>
  );
}