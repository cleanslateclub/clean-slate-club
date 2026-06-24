import React, { useMemo, useState } from 'react';
import { Clock, DollarSign, Plus, Save, ShieldCheck, Sparkles } from 'lucide-react';
import { BOOKING_RULES_DEFAULTS, SERVICE_MENU_DEFAULTS } from '@/lib/backendOSConfig';
import {
  buildServiceMenuPayload,
  calculateServiceEstimateFromMenu,
  normalizeServiceMenu,
  updateAddonInMenu,
  updateServiceInMenu,
} from '@/lib/serviceMenuUtils';

const formatMinutes = (minutes = 0) => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs && mins) return `${hrs}h ${mins}m`;
  if (hrs) return `${hrs}h`;
  return `${mins}m`;
};

function NumberField({ label, value, onChange, prefix = '', suffix = '' }) {
  return (
    <label className="block">
      <span className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 block mb-1">{label}</span>
      <div className="flex items-center rounded-xl border border-taupe/20 bg-cream px-2 focus-within:border-coral/40">
        {prefix && <span className="font-body text-xs text-charcoal/35 pr-1">{prefix}</span>}
        <input
          type="number"
          min="0"
          value={value ?? 0}
          onChange={e => onChange(Number(e.target.value) || 0)}
          className="w-full bg-transparent py-2 text-sm font-body text-charcoal focus:outline-none"
        />
        {suffix && <span className="font-body text-xs text-charcoal/35 pl-1">{suffix}</span>}
      </div>
    </label>
  );
}

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

function EstimatePreview({ services, service, addonKeys, isMember }) {
  const estimate = useMemo(
    () => calculateServiceEstimateFromMenu({ services, serviceKey: service?.key, addonKeys, isMember }),
    [services, service?.key, addonKeys, isMember]
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
        This estimate is calculated from the currently loaded service menu. Change any selected add-on time or price above and this preview recalculates immediately for that service.
      </p>
    </div>
  );
}

export default function ServicesOSTab() {
  const [services, setServices] = useState(() => normalizeServiceMenu(SERVICE_MENU_DEFAULTS));
  const publicServices = services.filter(service => service.key !== 'consult');
  const [selectedKey, setSelectedKey] = useState(publicServices[0]?.key || 'home_reset');
  const [selectedAddonKeys, setSelectedAddonKeys] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [payloadOpen, setPayloadOpen] = useState(false);

  const selectedService = services.find(service => service.key === selectedKey) || publicServices[0];
  const payload = useMemo(() => buildServiceMenuPayload(services), [services]);

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

  const updateSelectedService = (updates) => {
    setServices(prev => updateServiceInMenu(prev, selectedService.key, updates));
    setDirty(true);
  };

  const updateAddon = (addonKey, updates) => {
    setServices(prev => updateAddonInMenu(prev, selectedService.key, addonKey, updates));
    setDirty(true);
  };

  const resetDefaults = () => {
    setServices(normalizeServiceMenu(SERVICE_MENU_DEFAULTS));
    setSelectedAddonKeys([]);
    setDirty(false);
    setPayloadOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-warm-white rounded-3xl border border-taupe/15 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Backend OS</p>
            <h2 className="font-heading text-2xl font-semibold text-charcoal mt-1">Services, packages & add-ons</h2>
            <p className="font-body text-sm text-charcoal/45 font-light mt-2 max-w-3xl leading-relaxed">
              Clean Slate Club services are preloaded with starting prices, durations, focus items, add-ons, approval flags, provider permissions, and estimator logic. Edits on this screen update the live estimator immediately across the same service menu data.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {dirty && <span className="px-3 py-1 rounded-full bg-butter/20 text-[10px] font-body text-charcoal/60">unsaved preview edits</span>}
            <button type="button" onClick={() => setPayloadOpen(prev => !prev)} className="flex items-center gap-2 px-4 py-2 rounded-full border border-taupe/20 bg-cream text-xs font-body text-charcoal/50 hover:border-coral/30 transition-colors">
              <Save className="w-3.5 h-3.5" /> {payloadOpen ? 'Hide payload' : 'View save payload'}
            </button>
            <button type="button" onClick={resetDefaults} className="px-4 py-2 rounded-full border border-taupe/20 bg-cream text-xs font-body text-charcoal/50 hover:border-coral/30 transition-colors">
              Reset defaults
            </button>
          </div>
        </div>
        {payloadOpen && (
          <pre className="mt-5 max-h-80 overflow-auto rounded-2xl bg-charcoal text-cream p-4 text-[11px] leading-relaxed">
            {JSON.stringify(payload, null, 2)}
          </pre>
        )}
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
              <div className="rounded-2xl bg-cream border border-taupe/10 px-4 py-3 min-w-[180px]">
                <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Booking rules</p>
                <p className="font-body text-xs text-charcoal/55 mt-1">{BOOKING_RULES_DEFAULTS.minimumLeadTimeHours}h lead time</p>
                <p className="font-body text-xs text-charcoal/55">${BOOKING_RULES_DEFAULTS.depositAmount} deposit</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <div className="rounded-2xl bg-cream border border-taupe/10 p-4">
                <Clock className="w-4 h-4 text-coral mb-2" />
                <NumberField label="Base minutes" value={selectedService.baseMinutes} onChange={value => updateSelectedService({ baseMinutes: value })} suffix="min" />
              </div>
              <div className="rounded-2xl bg-cream border border-taupe/10 p-4">
                <Clock className="w-4 h-4 text-coral mb-2" />
                <NumberField label="Minimum" value={selectedService.minMinutes} onChange={value => updateSelectedService({ minMinutes: value })} suffix="min" />
              </div>
              <div className="rounded-2xl bg-cream border border-taupe/10 p-4">
                <DollarSign className="w-4 h-4 text-coral mb-2" />
                <NumberField label="Base price" value={selectedService.price} onChange={value => updateSelectedService({ price: value })} prefix="$" />
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
                <p className="font-heading text-sm font-semibold text-charcoal">Editable add-ons</p>
                <label className="flex items-center gap-2 font-body text-xs text-charcoal/45 font-light cursor-pointer">
                  <input type="checkbox" checked={isMember} onChange={e => setIsMember(e.target.checked)} />
                  Member estimate
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedService.addons.map(addon => {
                  const selected = selectedAddonKeys.includes(addon.key);
                  return (
                    <div
                      key={addon.key}
                      className={`rounded-2xl border p-4 transition-all ${
                        selected ? 'border-coral/40 bg-coral/5' : 'border-taupe/15 bg-cream'
                      }`}
                    >
                      <button type="button" onClick={() => toggleAddon(addon.key)} className="w-full text-left">
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-body text-sm text-charcoal font-light">{addon.label}</p>
                          <span className="font-body text-[10px] text-charcoal/35">{selected ? 'included in preview' : 'tap to include'}</span>
                        </div>
                      </button>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <NumberField label="Time" value={addon.minutes} onChange={value => updateAddon(addon.key, { minutes: value })} suffix="min" />
                        <NumberField label="Price" value={addon.price} onChange={value => updateAddon(addon.key, { price: value })} prefix="$" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <EstimatePreview services={services} service={selectedService} addonKeys={selectedAddonKeys} isMember={isMember} />
        </div>
      </div>
    </div>
  );
}
