import { BUFFER_PREP, BUFFER_WRAP, SERVICE_CONFIG, getDynamicEstimate } from '@/lib/bookingConfig';
import { loadServiceMenuSettings } from '@/lib/serviceMenuSettings';
import { normalizeServiceMenu } from '@/lib/serviceMenuUtils';

const MENU_TO_BOOKING_KEY = {
  home_reset: 'home_reset',
  meal_prep: 'meal_prep',
  family_support: 'mothers_helper',
  senior_support: 'senior_support',
  errands: 'errands',
  organization: 'organization',
  consult: 'consult',
};

const BOOKING_TO_MENU_KEY = Object.entries(MENU_TO_BOOKING_KEY).reduce((acc, [menuKey, bookingKey]) => {
  acc[bookingKey] = menuKey;
  return acc;
}, {});

const mapAddonToBooking = (addon = {}) => ({
  ...addon,
  id: addon.id || addon.key,
  key: addon.key || addon.id,
  minutes: Number(addon.minutes) || 0,
  price: Number(addon.price) || 0,
});

const mapServiceToBookingConfig = (menuService = {}, existing = {}) => {
  const baseMinutes = Number(menuService.baseMinutes) || Number(existing.baseMinutes) || 0;
  const minHours = Math.max(1, Math.ceil((Number(menuService.minMinutes) || baseMinutes) / 60));
  const lowRate = Number(menuService.memberHourlyRate) || existing.hourlyRate?.[0] || 65;
  const highRate = Number(menuService.nonMemberHourlyRate) || existing.hourlyRate?.[1] || 75;
  const price = Number(menuService.price) || existing.priceRange?.[0] || 0;

  return {
    ...existing,
    label: menuService.label || existing.label,
    sublabel: menuService.category || existing.sublabel,
    baseMinutes,
    minHours,
    priceRange: [price, price],
    priceLabel: price > 0 ? `Starting at $${price}` : existing.priceLabel || 'Free',
    hourlyRate: [lowRate, highRate],
    description: menuService.description || existing.description,
    taskOptions: menuService.focusItems || existing.taskOptions || [],
    addons: (menuService.addons || existing.addons || []).map(mapAddonToBooking),
    requiresApproval: Boolean(menuService.requiresApproval),
    providerPermissions: menuService.providerPermissions || existing.providerPermissions || [],
  };
};

export const buildBookingConfigFromServiceMenu = (services = []) => {
  const normalized = normalizeServiceMenu(services);
  const merged = { ...SERVICE_CONFIG };

  normalized.forEach(menuService => {
    const bookingKey = MENU_TO_BOOKING_KEY[menuService.key] || menuService.key;
    const existing = SERVICE_CONFIG[bookingKey] || {};
    merged[bookingKey] = mapServiceToBookingConfig(menuService, existing);
  });

  return merged;
};

export const loadDynamicBookingConfig = async () => {
  const result = await loadServiceMenuSettings();
  return {
    ...result,
    bookingConfig: buildBookingConfigFromServiceMenu(result.services),
  };
};

const addonTotals = (config, selectedAddonIds = []) => {
  const addons = Array.isArray(config?.addons) ? config.addons : [];
  return selectedAddonIds.reduce((acc, id) => {
    const addon = addons.find(item => item.id === id || item.key === id);
    if (!addon) return acc;
    return {
      minutes: acc.minutes + (Number(addon.minutes) || 0),
      price: acc.price + (Number(addon.price) || 0),
    };
  }, { minutes: 0, price: 0 });
};

export const calculateTotalDurationFromConfig = (serviceKey, selectedAddonIds = [], serviceConfig = SERVICE_CONFIG) => {
  const config = serviceConfig?.[serviceKey];
  if (!config) return 0;

  const minimumMinutes = config.minHours ? config.minHours * 60 : config.baseMinutes;
  const baseMinutes = Math.max(config.baseMinutes || 0, minimumMinutes || 0);
  const totals = addonTotals(config, selectedAddonIds);

  return BUFFER_PREP + baseMinutes + totals.minutes + BUFFER_WRAP;
};

export const getDynamicEstimateFromConfig = (serviceKey, intakeAnswers = {}, selectedTasks = [], selectedAddonIds = [], serviceConfig = SERVICE_CONFIG) => {
  const staticEstimate = getDynamicEstimate(serviceKey, intakeAnswers, selectedTasks, []);
  const config = serviceConfig?.[serviceKey] || SERVICE_CONFIG[serviceKey];
  if (!config) return { low: 0, high: 0, durationMinutes: 0, flags: [] };

  const minimumMinutes = config.minHours ? config.minHours * 60 : config.baseMinutes;
  const baseMinutes = Math.max(config.baseMinutes || 0, minimumMinutes || 0);
  const staticConfig = SERVICE_CONFIG[serviceKey] || {};
  const staticMinimum = staticConfig.minHours ? staticConfig.minHours * 60 : staticConfig.baseMinutes;
  const staticBase = Math.max(staticConfig.baseMinutes || 0, staticMinimum || 0);
  const scopeExtraMinutes = Math.max(0, (staticEstimate?.durationMinutes || 0) - BUFFER_PREP - BUFFER_WRAP - staticBase);

  const totals = addonTotals(config, selectedAddonIds);
  const billableServiceMinutes = baseMinutes + scopeExtraMinutes;
  const durationMinutes = BUFFER_PREP + billableServiceMinutes + totals.minutes + BUFFER_WRAP;
  const hourlyLow = config.hourlyRate?.[0] || 65;
  const hourlyHigh = config.hourlyRate?.[1] || 75;
  const baseHours = billableServiceMinutes / 60;

  return {
    low: Math.round(baseHours * hourlyLow) + totals.price,
    high: Math.round(baseHours * hourlyHigh) + totals.price,
    durationMinutes,
    flags: staticEstimate?.flags || [],
  };
};

export const getMenuKeyForBookingService = (bookingServiceKey) => BOOKING_TO_MENU_KEY[bookingServiceKey] || bookingServiceKey;
export const getBookingKeyForMenuService = (menuServiceKey) => MENU_TO_BOOKING_KEY[menuServiceKey] || menuServiceKey;
