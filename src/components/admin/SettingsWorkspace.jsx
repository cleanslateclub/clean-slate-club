import React, { useEffect, useMemo, useState } from 'react';
import { ClipboardCheck, Search, Settings, ShieldAlert, ShieldCheck, SlidersHorizontal, ToggleLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import LaunchGuardsPanel from '@/components/admin/LaunchGuardsPanel';
import { BOOKING_RULES_DEFAULTS } from '@/lib/backendOSConfig';

const FILTERS = [
  { key: 'rules', label: 'Booking Rules', icon: ClipboardCheck },
  { key: 'settings', label: 'Saved Settings', icon: Settings },
  { key: 'features', label: 'Feature Flags', icon: ToggleLeft },
  { key: 'guards', label: 'Launch Guards', icon: ShieldAlert },
];

function FilterButton({ item, active, count, onClick }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-3xl border p-4 text-left transition-all ${active ? 'bg-coral/10 border-coral/25' : 'bg-warm-white border-taupe/15 hover:border-coral/20'}`}
    >
      <div className="flex items-center justify-between gap-3">
        <Icon className={`w-4 h-4 ${active ? 'text-coral' : 'text-charcoal/35'}`} />
        <span className="font-heading text-2xl text-charcoal">{count}</span>
      </div>
      <p className="font-body text-xs uppercase tracking-widest text-charcoal/35 mt-3">{item.label}</p>
    </button>
  );
}

function DetailTile({ label, value, helper }) {
  return (
    <div className="rounded-2xl bg-cream border border-taupe/10 p-4">
      <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">{label}</p>
      <p className="font-body text-sm text-charcoal/60 font-light mt-1 break-words">{value || 'Not set'}</p>
      {helper && <p className="font-body text-xs text-charcoal/35 font-light mt-2">{helper}</p>}
    </div>
  );
}

function SettingsScopeNotice({ activeFilter }) {
  return (
    <div className="rounded-3xl bg-cream border border-taupe/15 p-4 flex items-start gap-3">
      <div className="w-9 h-9 rounded-2xl bg-warm-white border border-taupe/10 flex items-center justify-center shrink-0">
        <ShieldCheck className="w-4 h-4 text-coral" />
      </div>
      <div>
        <p className="font-heading text-base text-charcoal">Read-only settings review</p>
        <p className="font-body text-sm text-charcoal/45 font-light mt-1 leading-relaxed">
          This view is for checking default rules, saved AppSettings, feature flags, and launch guardrails. It does not update business rules, enable features, unlock automations, or publish launch settings.
        </p>
        <p className="font-body text-[11px] uppercase tracking-widest text-charcoal/30 mt-2">Current view: {activeFilter.replace(/_/g, ' ')}</p>
      </div>
    </div>
  );
}

const getRuleRows = () => Object.entries(BOOKING_RULES_DEFAULTS).map(([key, value]) => ({
  id: key,
  label: key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' '),
  value: typeof value === 'object' ? JSON.stringify(value) : String(value),
  helper: 'Default backend rule',
}));

const getSettingRows = (settings = []) => settings.map(setting => ({
  id: setting.id || setting.key,
  label: setting.key || setting.name || 'Setting',
  value: setting.value_type === 'json' ? 'JSON setting' : String(setting.value ?? setting.enabled ?? ''),
  helper: [setting.category, setting.value_type].filter(Boolean).join(' · '),
}));

const getFeatureRows = (settings = []) => settings
  .filter(setting => setting.category === 'feature' || setting.category === 'features')
  .map(setting => ({
    id: setting.id || setting.key,
    label: setting.key || setting.name || 'Feature',
    value: setting.enabled === false ? 'Off' : 'On',
    helper: setting.description || 'Feature setting',
  }));

export default function SettingsWorkspace() {
  const [settings, setSettings] = useState([]);
  const [filter, setFilter] = useState('rules');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setLoadError('');
      try {
        const records = await base44.entities.AppSettings.list('-updated_date', 300);
        if (!active) return;
        setSettings(records || []);
      } catch (error) {
        console.error('Settings workspace load failed:', error);
        if (active) setLoadError('Could not load saved settings from Base44. Showing default rules only.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const rows = useMemo(() => {
    if (filter === 'settings') return getSettingRows(settings);
    if (filter === 'features') return getFeatureRows(settings);
    if (filter === 'guards') return [];
    return getRuleRows();
  }, [filter, settings]);

  const counts = useMemo(() => ({
    rules: getRuleRows().length,
    settings: getSettingRows(settings).length,
    features: getFeatureRows(settings).length,
    guards: 8,
  }), [settings]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(row => [row.label, row.value, row.helper].some(value => String(value || '').toLowerCase().includes(q)));
  }, [rows, search]);

  return (
    <div className="space-y-6">
      <div className="bg-warm-white rounded-3xl border border-taupe/15 p-6">
        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Settings workspace</p>
        <h2 className="font-heading text-2xl font-semibold text-charcoal mt-1">Business rules and settings</h2>
        <p className="font-body text-sm text-charcoal/45 font-light mt-2 max-w-3xl leading-relaxed">
          Centralizes default rules, saved settings, feature flags, and launch guardrails so the backend OS is not hidden across random files.
        </p>
        {loading && <p className="font-body text-xs text-charcoal/35 font-light mt-3">Loading settings...</p>}
        {loadError && <p className="font-body text-xs text-coral font-light mt-3">{loadError}</p>}
      </div>

      <SettingsScopeNotice activeFilter={filter} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {FILTERS.map(item => (
          <FilterButton key={item.key} item={item} active={filter === item.key} count={counts[item.key] || 0} onClick={() => setFilter(item.key)} />
        ))}
      </div>

      {filter === 'guards' ? (
        <LaunchGuardsPanel />
      ) : (
        <>
          <div className="rounded-3xl bg-warm-white border border-taupe/15 p-4 flex items-center gap-3">
            <Search className="w-4 h-4 text-charcoal/30" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search settings..."
              className="w-full bg-transparent outline-none font-body text-sm text-charcoal/60 placeholder:text-charcoal/25"
            />
          </div>

          {filteredRows.length === 0 ? (
            <div className="rounded-3xl bg-warm-white border border-taupe/15 p-6 text-center">
              <SlidersHorizontal className="w-5 h-5 text-sage mx-auto mb-2" />
              <p className="font-body text-sm text-charcoal/40 font-light">No settings in this view.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredRows.map(row => (
                <DetailTile key={row.id} label={row.label} value={row.value} helper={row.helper} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
