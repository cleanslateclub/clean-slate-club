import { getProviderComplianceChecklist } from '@/components/admin/ProviderComplianceOS';
import { getActiveComplianceOverrides } from '@/lib/complianceOverrideUtils';

const normalize = (value = '') => String(value || '').trim().toLowerCase();

export const normalizeServiceKeyForProvider = (serviceKey) => {
  if (serviceKey === 'mothers_helper') return 'family_support';
  return normalize(serviceKey);
};

export const providerHasServicePermission = (provider = {}, serviceKey) => {
  const normalizedServiceKey = normalizeServiceKeyForProvider(serviceKey);
  const services = (provider.services || provider.service_permissions || []).map(normalize);
  return services.includes(normalizedServiceKey);
};

export const getProviderReadinessSummary = (provider = {}) => {
  const checklist = getProviderComplianceChecklist(provider);
  const activeOverrides = getActiveComplianceOverrides(provider);
  const overrideKeys = new Set(activeOverrides.map(item => item.requirement_key));
  const completeCount = checklist.filter(item => item.complete || overrideKeys.has(item.key)).length;
  const totalCount = checklist.length;
  const ready = totalCount > 0 && completeCount === totalCount && normalize(provider.status) === 'active';

  return {
    ready,
    completeCount,
    totalCount,
    activeOverrides,
    missing: checklist.filter(item => !item.complete && !overrideKeys.has(item.key)),
  };
};

export const canProviderTakeBooking = ({ provider = {}, booking = {} } = {}) => {
  const readiness = getProviderReadinessSummary(provider);
  const hasService = providerHasServicePermission(provider, booking.service_category);
  const isActive = normalize(provider.status) === 'active';

  return {
    canAssign: Boolean(isActive && hasService && readiness.ready),
    isActive,
    hasService,
    readiness,
  };
};

export const scoreProviderForBooking = ({ provider = {}, booking = {}, availability = [] } = {}) => {
  const eligibility = canProviderTakeBooking({ provider, booking });
  if (!eligibility.canAssign) return { score: -1, eligibility };

  const providerEmail = normalize(provider.email);
  const providerAvailability = availability.filter(item => normalize(item.provider_email) === providerEmail && normalize(item.status) !== 'paused');
  const hasDayAvailability = providerAvailability.some(item => {
    if (!booking.scheduled_date) return false;
    const day = new Date(`${booking.scheduled_date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return normalize(item.day_of_week) === day;
  });

  let score = 50;
  if (hasDayAvailability) score += 25;
  if (providerEmail && providerEmail === normalize(booking.preferred_provider_email)) score += 20;
  if (provider.territory && booking.client_address?.toLowerCase().includes(provider.territory.toLowerCase())) score += 10;

  return { score, eligibility, hasDayAvailability };
};

export const rankProvidersForBooking = ({ providers = [], booking = {}, availability = [] } = {}) => {
  return providers
    .map(provider => ({ provider, ...scoreProviderForBooking({ provider, booking, availability }) }))
    .filter(item => item.score >= 0)
    .sort((a, b) => b.score - a.score);
};
