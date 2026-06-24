import { BOOKING_RULES_DEFAULTS, SERVICE_MENU_DEFAULTS } from '@/lib/backendOSConfig';

export const normalizeServiceMenu = (services = SERVICE_MENU_DEFAULTS) => {
  return (services || []).map(service => ({
    ...service,
    baseMinutes: Number(service.baseMinutes) || 0,
    minMinutes: Number(service.minMinutes) || 0,
    price: Number(service.price) || 0,
    memberHourlyRate: Number(service.memberHourlyRate) || 0,
    nonMemberHourlyRate: Number(service.nonMemberHourlyRate) || 0,
    addons: (service.addons || []).map(addon => ({
      ...addon,
      minutes: Number(addon.minutes) || 0,
      price: Number(addon.price) || 0,
    })),
  }));
};

export const findService = (services, serviceKey) => {
  return (services || []).find(service => service.key === serviceKey);
};

export const findAddon = (services, serviceKey, addonKey) => {
  const service = findService(services, serviceKey);
  return service?.addons?.find(addon => addon.key === addonKey || addon.id === addonKey);
};

export const calculateServiceEstimateFromMenu = ({
  services = SERVICE_MENU_DEFAULTS,
  serviceKey,
  addonKeys = [],
  isMember = false,
  extraMinutes = 0,
  bookingRules = BOOKING_RULES_DEFAULTS,
} = {}) => {
  const normalized = normalizeServiceMenu(services);
  const service = findService(normalized, serviceKey);
  if (!service) return null;

  const selectedAddons = addonKeys
    .map(addonKey => findAddon(normalized, serviceKey, addonKey))
    .filter(Boolean);

  const addonMinutes = selectedAddons.reduce((sum, addon) => sum + (Number(addon.minutes) || 0), 0);
  const addonPrice = selectedAddons.reduce((sum, addon) => sum + (Number(addon.price) || 0), 0);
  const durationMinutes = Math.max(service.minMinutes || 0, (service.baseMinutes || 0) + addonMinutes + (Number(extraMinutes) || 0));
  const hourlyRate = isMember ? service.memberHourlyRate : service.nonMemberHourlyRate;
  const hourlyBase = Math.ceil(durationMinutes / 60) * hourlyRate;
  const estimatedServiceTotal = Math.max(service.price || 0, hourlyBase) + addonPrice;

  return {
    serviceKey,
    serviceLabel: service.label,
    durationMinutes,
    addonMinutes,
    addonPrice,
    hourlyRate,
    low: estimatedServiceTotal,
    high: estimatedServiceTotal,
    depositDue: service.price > 0 ? bookingRules.depositAmount : 0,
    selectedAddons,
  };
};

export const updateServiceInMenu = (services, serviceKey, updates) => {
  return normalizeServiceMenu(services).map(service => (
    service.key === serviceKey ? { ...service, ...updates } : service
  ));
};

export const updateAddonInMenu = (services, serviceKey, addonKey, updates) => {
  return normalizeServiceMenu(services).map(service => {
    if (service.key !== serviceKey) return service;
    return {
      ...service,
      addons: (service.addons || []).map(addon => (
        addon.key === addonKey ? { ...addon, ...updates } : addon
      )),
    };
  });
};

export const buildServiceMenuPayload = (services) => ({
  version: 1,
  updatedAt: new Date().toISOString(),
  services: normalizeServiceMenu(services),
});
