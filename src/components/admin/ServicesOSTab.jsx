import React, { useMemo, useState } from 'react';
import { Clock, DollarSign, Plus, ShieldCheck, Sparkles } from 'lucide-react';
import { BOOKING_RULES_DEFAULTS, SERVICE_MENU_DEFAULTS, calculateBackendEstimate } from '@/lib/backendOSConfig';

const formatMinutes = (minutes = 0) => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs && mins) return `${hrs}h ${mins}m`;
  if (hrs) return `${hrs}h`;
  return `${mins}m`;
};

function ServiceCard({ service, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-2xl border p-4 transition-all ${
        active
          ? 'bg-coral/5 border-coral/35 shadow-sm'
          : 'bg-warm-white border-taupe/15 hover:border-coral/25'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-heading text-sm font-semibold text-charcoal">{service.label}</p>
          <p className="font-body text-[11px] text-charcoal/40 font-light mt-0.5">{service.category}</p>
        </div>
        {service.requiresApproval && (
          <span className="px-2 py-0.5 rounded-full bg-butter/20 text-[10px] font-body text-charcoal/60">approval</span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="rounded-xl bg-cream px-3 py-2">
          <p className="font-body text-[10px] text-charcoal/35">Base time</p>
          <p className="font-body text-xs text-charcoal/70">{formatMinutes(service.baseMinutes)}</p>
        </div>
        <div className="rounded-xl bg-cream px-3 py-2">
          <p className="font-body text-[10px] text-charcoal/35">Base price</p>
          <p className="font-body text-xs text-charcoal/70">${service.price}</p>
        </div>
      </div>
    </button>
  );
}

function EstimatePreview({ service, addonKeys, isMember }) {
  const estimate = useMemo(
    () => calculateBackendEstimate({ serviceKey: service?.key, addonKeys, isMember }),
    [service?.key, addonKeys, isMember]
  );

  if (!estimate) return null;

  return (
    <div className="rounded-3xl border border-coral/20 bg-coral/5 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-coral" />
        <p className="font-heading text-sm font-semibold text-charcoal">Live estimator preview</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl bg-warm-white border border-taupe/10 px-4 py-3">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Duration</p>
          <p className="font-heading text-lg text-charcoal mt-1">{formatMinutes(estimate.durationMinutes)}</p>
        </div>
        <div className="rounded-2xl bg-warm-white border border-taupe/10 px-4 py-3">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Add-ons</p>
          <p className="font-heading text-lg text-charcoal mt-1">${estimate.addonPrice}</p>
        </div>
        <div className="rounded-2xl bg-warm-white border border-taupe/10 px-4 py-3">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Estimate</p>
          <p className="font-heading text-lg text-charcoal mt-1">${estimate.low}</p>
        </div>
        <div className="rounded-2xl bg-warm-white border border-taupe/10 px-4 py-3">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Deposit</p>
          <p className="font-heading text-lg text-charcoal mt-1">${estimate.depositDue}</p>
        </div>
      </div>
      <p className="font-body text-xs text-charcoal/45 font-light mt-4 leading-relaxed">
        This preview is powered by the same config used for package defaults and add-on pricing. When the editable service records are connected, changing an add-on's time or cost should automatically change this estimate.
      </p>
    </div>
  );
}

export default function ServicesOSTab() {
  const publicServices = SERVICE_MENU_DEFAULTS.filter(service => service.key !== 'consult');
  const [selectedKey, setSelectedKey] = useState(publicServices[0]?.key || 'home_reset');
  const [selectedAddonKeys, setSelectedAddonKeys] = useState([]);
  const [isMember, setIsMember] = useState(false);

  const selectedService = SERVICE_MENU_DEFAULTS.find(service => service.key === selectedKey) || publicServices[0];

  const toggleAddon = (addonKey) => {
    setSelectedAddonKeys(prev => prev.includes(addonKey)
      ? prev.filter(key => key !== addonKey)
      : [...prev, addonKey]
    );
  };

  const selectService = (key) => {
    setSelectedKey(key);
    setSelectedAddonKeys([]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-warm-white rounded-3xl border border-taupe/15 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Backend OS</p>
            <h2 className="font-heading text-2xl font-semibold text-charcoal mt-1">Services, packages & add-ons</h2>
            <p className="font-body text-sm text-charcoal/45 font-light mt-2 max-w-3xl leading-relaxed">
              Clean Slate Club services are preloaded here with sensible starting prices, durations, focus items, add-ons, approval flags, provider permissions, and estimator logic. This is the admin-side structure that should eventually replace scattered hard-coded package data.
            </p>
          </div>
          <div className="rounded-2xl bg-cream border border-taupe/10 px-4 py-3 min-w-[180px]">
            <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Booking rules</p>
            <p className="font-body text-xs text-charcoal/55 mt-1">{BOOKING_RULES_DEFAULTS.minimumLeadTimeHours}h lead time</p>
            <p className="font-body text-xs text-charcoal/55">${BOOKING_RULES_DEFAULTS.depositAmount} deposit</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="space-y-3">
          {publicServices.map(service => (
            <ServiceCard
              key={service.key}
              service={service}
              active={selectedService?.key === service.key}
              onClick={() => selectService(service.key)}
            />
          ))}
        </div>

        <div className="xl:col-span-2 space-y-5">
          <div className="bg-warm-white rounded-3xl border border-taupe/15 p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h3 className="font-heading text-xl font-semibold text-charcoal">{selectedService.label}</h3>
                <p className="font-body text-sm text-charcoal/45 font-light mt-1 leading-relaxed">{selectedService.description}</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-taupe/20 text-xs font-body text-charcoal/45 hover:border-coral/30 transition-colors" type="button">
                <Plus className="w-3.5 h-3.5" /> Edit coming next
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <div className="rounded-2xl bg-cream border border-taupe/10 p-4">
                <Clock className="w-4 h-4 text-coral mb-2" />
                <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Base</p>
                <p className="font-heading text-base text-charcoal mt-1">{formatMinutes(selectedService.baseMinutes)}</p>
              </div>
              <div className="rounded-2xl bg-cream border border-taupe/10 p-4">
                <Clock className="w-4 h-4 text-coral mb-2" />
                <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Minimum</p>
                <p className="font-heading text-base text-charcoal mt-1">{formatMinutes(selectedService.minMinutes)}</p>
              </div>
              <div className="rounded-2xl bg-cream border border-taupe/10 p-4">
                <DollarSign className="w-4 h-4 text-coral mb-2" />
                <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Price</p>
                <p className="font-heading text-base text-charcoal mt-1">${selectedService.price}</p>
              </div>
              <div className="rounded-2xl bg-cream border border-taupe/10 p-4">
                <ShieldCheck className="w-4 h-4 text-coral mb-2" />
                <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Approval</p>
                <p className="font-heading text-base text-charcoal mt-1">{selectedService.requiresApproval ? 'Yes' : 'No'}</p>
              </div>
            </div>

            <div className="mb-5">
              <p className="font-heading text-sm font-semibold text-charcoal mb-3">Focus items</p>
              <div className="flex flex-wrap gap-2">
                {selectedService.focusItems.map(item => (
                  <span key={item} className="px-3 py-1 rounded-full bg-cream border border-taupe/10 text-xs font-body font-light text-charcoal/55">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <p className="font-heading text-sm font-semibold text-charcoal">Add-ons</p>
                <label className="flex items-center gap-2 font-body text-xs text-charcoal/45 font-light cursor-pointer">
                  <input type="checkbox" checked={isMember} onChange={e => setIsMember(e.target.checked)} />
                  Member estimate
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedService.addons.map(addon => {
                  const selected = selectedAddonKeys.includes(addon.key);
                  return (
                    <button
                      key={addon.key}
                      type="button"
                      onClick={() => toggleAddon(addon.key)}
                      className={`text-left rounded-2xl border p-4 transition-all ${
                        selected ? 'border-coral/40 bg-coral/5' : 'border-taupe/15 bg-cream hover:border-coral/25'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-body text-sm text-charcoal font-light">{addon.label}</p>
                        <span className="font-body text-xs text-charcoal/45">${addon.price}</span>
                      </div>
                      <p className="font-body text-xs text-charcoal/35 font-light mt-1">+{formatMinutes(addon.minutes)}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <EstimatePreview service={selectedService} addonKeys={selectedAddonKeys} isMember={isMember} />
        </div>
      </div>
    </div>
  );
}
