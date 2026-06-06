import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

// Default fallback values (same as SettingsTab defaults)
const DEFAULTS = {
  booking_enabled: 'true',
  deposit_required: 'true',
  memberships_enabled: 'true',
  consult_enabled: 'true',
  wip_banner_enabled: 'false',
  sms_enabled: 'true',
  min_notice_hours: '24',
  max_days_ahead: '30',
  sunday_blackout: 'true',
  service_hours_start: '10:00',
  service_hours_end: '18:00',
  deposit_amount: '50',
  notify_email: 'cleanslateclubpa@gmail.com',
  notify_new_booking: 'true',
  notify_cancellation: 'true',
  client_reminder_hours: '24',
};

let _cache = null;
let _fetchPromise = null;

export function useAppSettings() {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (_cache) {
      setSettings(_cache);
      setLoading(false);
      return;
    }
    if (!_fetchPromise) {
      _fetchPromise = base44.entities.AppSettings.list().then(records => {
        const map = { ...DEFAULTS };
        (records || []).forEach(r => { map[r.key] = r.value; });
        _cache = map;
        return map;
      });
    }
    _fetchPromise.then(map => {
      setSettings(map);
      setLoading(false);
    });
  }, []);

  const getSetting = (key) => settings[key] ?? DEFAULTS[key] ?? null;
  const getBool = (key) => getSetting(key) === 'true';
  const getNum = (key) => Number(getSetting(key));
  const getStr = (key) => getSetting(key);

  // Invalidate cache so next mount re-fetches (call after saving settings)
  const invalidate = () => { _cache = null; _fetchPromise = null; };

  return { settings, loading, getSetting, getBool, getNum, getStr, invalidate };
}