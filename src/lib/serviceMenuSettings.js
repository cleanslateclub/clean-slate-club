import { base44 } from '@/api/base44Client';
import { SERVICE_MENU_DEFAULTS } from '@/lib/backendOSConfig';
import { buildServiceMenuPayload, normalizeServiceMenu } from '@/lib/serviceMenuUtils';

export const SERVICE_MENU_SETTING_KEY = 'service_menu_v1';

const parseMenuValue = (value) => {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return normalizeServiceMenu(parsed);
    if (Array.isArray(parsed?.services)) return normalizeServiceMenu(parsed.services);
    return null;
  } catch {
    return null;
  }
};

export const loadServiceMenuSettings = async () => {
  try {
    const records = await base44.entities.AppSettings.filter({ key: SERVICE_MENU_SETTING_KEY });
    const record = records?.[0];
    const savedServices = parseMenuValue(record?.value);

    return {
      services: savedServices || normalizeServiceMenu(SERVICE_MENU_DEFAULTS),
      source: savedServices ? 'saved' : 'defaults',
      recordId: record?.id || null,
      updatedAt: record?.updated_date || null,
    };
  } catch (error) {
    console.error('Failed to load service menu settings:', error);
    return {
      services: normalizeServiceMenu(SERVICE_MENU_DEFAULTS),
      source: 'defaults',
      recordId: null,
      updatedAt: null,
      error,
    };
  }
};

export const saveServiceMenuSettings = async ({ services, recordId = null } = {}) => {
  const payload = buildServiceMenuPayload(services || SERVICE_MENU_DEFAULTS);
  const value = JSON.stringify(payload);

  if (recordId) {
    const updated = await base44.entities.AppSettings.update(recordId, { value });
    return { record: updated, payload };
  }

  const existing = await base44.entities.AppSettings.filter({ key: SERVICE_MENU_SETTING_KEY });
  const existingRecord = existing?.[0];

  if (existingRecord?.id) {
    const updated = await base44.entities.AppSettings.update(existingRecord.id, { value });
    return { record: updated, payload };
  }

  const created = await base44.entities.AppSettings.create({
    key: SERVICE_MENU_SETTING_KEY,
    value,
    label: 'Service Menu',
    description: 'Editable Clean Slate Club services, packages, add-ons, times, prices, and estimator inputs.',
    category: 'services',
    value_type: 'json',
  });

  return { record: created, payload };
};
