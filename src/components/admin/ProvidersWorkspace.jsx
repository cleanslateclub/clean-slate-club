import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Briefcase, CheckCircle2, Clock, Search, ShieldCheck, UserCog, XCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const FILTERS = [
  { key: 'all', label: 'All Providers', icon: Briefcase },
  { key: 'active', label: 'Active', icon: CheckCircle2 },
  { key: 'review', label: 'Needs Review', icon: Clock },
  { key: 'restricted', label: 'Restricted', icon: ShieldCheck },
];

const getFilteredProviders = (providers = [], filter = 'all') => {
  if (filter === 'active') return providers.filter(item => item.status === 'active');
  if (filter === 'review') return providers.filter(item => ['applicant', 'pending_documents', 'draft', 'invited', 'onboarding', 'pending_review'].includes(item.status));
  if (filter === 'restricted') return providers.filter(item => ['restricted', 'suspended', 'inactive', 'terminated', 'archived', 'on_leave'].includes(item.status));
  return providers;
};

const isDateExpired = (value = '') => {
  if (!value) return false;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return false;
  return parsed < new Date();
};

const getProviderReadinessRows = (provider = {}) => {
  const permissions = provider.service_permissions || provider.services || [];
  const transportationApproved = permissions.includes('transportation') || permissions.includes('errands') || provider.tags?.includes('driver_approved');
  const familyOrSeniorApproved = permissions.includes('family_support') || permissions.includes('senior_support');

  return [
    {
      key: 'status',
      label: 'Active provider status',
      ready: provider.status === 'active',
      warning: ['restricted', 'suspended', 'inactive', 'terminated', 'archived', 'on_leave'].includes(provider.status),
      value: (provider.status || 'draft').replace(/_/g, ' '),
      helper: 'Provider should be active before normal assignment.',
    },
    {
      key: 'background_check',
      label: 'Background check',
      ready: Boolean(provider.background_check_cleared) && !isDateExpired(provider.background_check_expiry),
      warning: isDateExpired(provider.background_check_expiry),
      value: provider.background_check_cleared ? `Cleared${provider.background_check_expiry ? ` · expires ${provider.background_check_expiry}` : ''}` : 'Not cleared',
      helper: 'Required before in-home visits.',
    },
    {
      key: 'w9',
      label: 'W-9 on file',
      ready: Boolean(provider.w9_on_file),
      value: provider.w9_on_file ? 'On file' : 'Missing',
      helper: 'Required for contractor payout setup.',
    },
    {
      key: 'contractor_agreement',
      label: 'Contractor agreement',
      ready: Boolean(provider.contractor_agreement_signed),
      value: provider.contractor_agreement_signed ? `Signed${provider.contract_signed_date ? ` · ${provider.contract_signed_date}` : ''}` : 'Missing',
      helper: 'Required before provider is activated.',
    },
    {
      key: 'service_permissions',
      label: 'Service permissions',
      ready: permissions.length > 0,
      value: permissions.join(', ') || 'Missing',
      helper: 'Needed for provider matching and manual assignment recommendations.',
    },
    {
      key: 'cpr',
      label: 'CPR certification',
      ready: !familyOrSeniorApproved || (Boolean(provider.cpr_certification_on_file) && !isDateExpired(provider.cpr_expiry)),
      warning: familyOrSeniorApproved && isDateExpired(provider.cpr_expiry),
      value: provider.cpr_certification_on_file ? `On file${provider.cpr_expiry ? ` · expires ${provider.cpr_expiry}` : ''}` : familyOrSeniorApproved ? 'Required for assigned services' : 'Not required for current permissions',
      helper: 'Required for family, child, senior, and companion support.',
    },
    {
      key: 'driver_docs',
      label: 'Driver documents',
      ready: !transportationApproved || (Boolean(provider.drivers_license_on_file) && Boolean(provider.vehicle_insurance_on_file)),
      value: transportationApproved
        ? `License: ${provider.drivers_license_on_file ? 'yes' : 'missing'} · Insurance: ${provider.vehicle_insurance_on_file ? 'yes' : 'missing'}`
        : 'Not required for current permissions',
      helper: 'Required for transportation, driving errands, pickup, and dropoff work.',
    },
    {
      key: 'notifications',
      label: 'Notifications',
      ready: provider.sms_notifications_enabled !== false || provider.email_notifications_enabled !== false,
      warning: provider.sms_notifications_enabled === false || provider.email_notifications_enabled === false,
      value: `SMS: ${provider.sms_notifications_enabled === false ? 'off' : 'on'} · Email: ${provider.email_notifications_enabled === false ? 'off' : 'on'}`,
      helper: 'At least one provider notification channel should be available for live operations.',
    },
    {
      key: 'auto_assign',
      label: 'Auto-assign flag',
      ready: provider.auto_assign_enabled !== true,
      warning: provider.auto_assign_enabled === true,
      value: provider.auto_assign_enabled ? 'On' : 'Off',
      helper: 'Auto-assignment should stay off until Base44 testing and compliance behavior are verified.',
    },
  ];
};

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

function ProviderCard({ provider, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(provider)}
      className={`w-full text-left rounded-3xl border p-4 transition-all ${selected ? 'bg-coral/10 border-coral/25' : 'bg-warm-white border-taupe/15 hover:border-coral/20'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-heading text-lg text-charcoal">{provider.full_name || provider.name || provider.email || 'Provider'}</p>
          <p className="font-body text-xs text-charcoal/40 font-light mt-1">{provider.email || provider.phone || 'No contact shown'}</p>
        </div>
        <span className="px-2 py-1 rounded-full bg-cream border border-taupe/10 text-[10px] font-body text-charcoal/45">
          {(provider.status || 'draft').replace(/_/g, ' ')}
        </span>
      </div>
      <p className="font-body text-xs text-charcoal/35 font-light mt-3">
        {(provider.service_permissions || provider.services || []).join(', ') || 'No service permissions set'}
      </p>
    </button>
  );
}

function DetailTile({ label, value }) {
  return (
    <div className="rounded-2xl bg-cream border border-taupe/10 p-4">
      <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">{label}</p>
      <p className="font-body text-sm text-charcoal/60 font-light mt-1 break-words">{value || 'Not set'}</p>
    </div>
  );
}

function ReadinessItem({ item }) {
  const Icon = item.ready ? CheckCircle2 : item.warning ? AlertTriangle : XCircle;
  const tone = item.ready
    ? 'text-sage bg-sage/10 border-sage/20'
    : item.warning
      ? 'text-coral bg-coral/10 border-coral/20'
      : 'text-charcoal/55 bg-cream border-taupe/15';

  return (
    <div className="rounded-2xl bg-cream border border-taupe/10 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-body text-sm text-charcoal/65 font-light">{item.label}</p>
          <p className="font-body text-xs text-charcoal/35 font-light mt-1">{item.value || 'Not set'}</p>
          <p className="font-body text-[11px] text-charcoal/30 font-light mt-2 leading-relaxed">{item.helper}</p>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-body uppercase tracking-widest ${tone}`}>
          <Icon className="w-3 h-3" />
          {item.ready ? 'Ready' : item.warning ? 'Review' : 'Missing'}
        </span>
      </div>
    </div>
  );
}

function ProviderReadinessPanel({ provider }) {
  const rows = getProviderReadinessRows(provider);
  const reviewCount = rows.filter(row => !row.ready).length;

  return (
    <div className="rounded-3xl bg-warm-white border border-taupe/15 p-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Provider readiness</p>
          <h3 className="font-heading text-xl text-charcoal mt-1">Compliance and assignment checks</h3>
          <p className="font-body text-sm text-charcoal/40 font-light mt-2 max-w-2xl leading-relaxed">
            Read-only checklist for activation, compliance, permissions, notifications, and assignment safety.
          </p>
        </div>
        <div className="rounded-2xl bg-cream border border-taupe/10 px-4 py-3 text-right">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Review items</p>
          <p className="font-heading text-2xl text-charcoal mt-1">{reviewCount}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 mt-4">
        {rows.map(item => <ReadinessItem key={item.key} item={item} />)}
      </div>
    </div>
  );
}

function ProviderDetailPanel({ provider }) {
  if (!provider) {
    return (
      <div className="rounded-3xl bg-warm-white border border-taupe/15 p-6 text-center">
        <UserCog className="w-6 h-6 text-sage mx-auto mb-3" />
        <p className="font-heading text-lg text-charcoal">Select a provider</p>
        <p className="font-body text-sm text-charcoal/40 font-light mt-1">Choose a provider to review status, permissions, compliance, and notes.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-warm-white border border-taupe/15 p-6 space-y-5">
      <div>
        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Provider record</p>
        <h2 className="font-heading text-2xl text-charcoal mt-1">{provider.full_name || provider.name || provider.email || 'Provider'}</h2>
        <p className="font-body text-sm text-charcoal/40 font-light mt-1">{provider.email || 'No email shown'}</p>
      </div>

      <ProviderReadinessPanel provider={provider} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <DetailTile label="Status" value={(provider.status || 'draft').replace(/_/g, ' ')} />
        <DetailTile label="Access" value={provider.access_level} />
        <DetailTile label="Phone" value={provider.phone} />
        <DetailTile label="Territory" value={provider.territory} />
        <DetailTile label="Service areas" value={(provider.service_areas || []).join(', ')} />
        <DetailTile label="Service permissions" value={(provider.service_permissions || provider.services || []).join(', ')} />
        <DetailTile label="Payout rate" value={provider.payout_rate ? `${Math.round(Number(provider.payout_rate) * 100)}%` : 'Not set'} />
        <DetailTile label="Hours available/week" value={provider.hours_available_per_week} />
        <DetailTile label="Hours assigned/week" value={provider.hours_assigned_this_week} />
        <DetailTile label="Availability note" value={provider.availability_notes} />
      </div>

      <DetailTile label="Admin notes" value={provider.admin_notes || provider.notes} />
    </div>
  );
}

export default function ProvidersWorkspace() {
  const [providers, setProviders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setLoadError('');
      try {
        const records = await base44.entities.Provider.list('-created_date', 300);
        if (!active) return;
        setProviders(records || []);
      } catch (error) {
        console.error('Providers workspace load failed:', error);
        if (active) setLoadError('Could not load provider records from Base44.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const counts = useMemo(() => Object.fromEntries(FILTERS.map(item => [item.key, getFilteredProviders(providers, item.key).length])), [providers]);

  const filteredProviders = useMemo(() => {
    const pool = getFilteredProviders(providers, filter);
    const q = search.trim().toLowerCase();
    if (!q) return pool;
    return pool.filter(provider => [
      provider.full_name,
      provider.name,
      provider.email,
      provider.phone,
      provider.status,
      provider.territory,
      (provider.service_permissions || provider.services || []).join(' '),
      (provider.tags || []).join(' '),
    ].some(value => String(value || '').toLowerCase().includes(q)));
  }, [providers, filter, search]);

  const selectedProvider = selected ? providers.find(item => item.id === selected.id) || selected : null;

  return (
    <div className="space-y-6">
      <div className="bg-warm-white rounded-3xl border border-taupe/15 p-6">
        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Providers workspace</p>
        <h2 className="font-heading text-2xl font-semibold text-charcoal mt-1">Provider readiness and access</h2>
        <p className="font-body text-sm text-charcoal/45 font-light mt-2 max-w-3xl leading-relaxed">
          Replaces scattered provider tools with one place to review provider status, compliance, service permissions, notification readiness, and notes.
        </p>
        {loading && <p className="font-body text-xs text-charcoal/35 font-light mt-3">Loading providers...</p>}
        {loadError && <p className="font-body text-xs text-coral font-light mt-3">{loadError}</p>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {FILTERS.map(item => (
          <FilterButton key={item.key} item={item} active={filter === item.key} count={counts[item.key] || 0} onClick={() => { setFilter(item.key); setSelected(null); }} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 space-y-3">
          <div className="rounded-3xl bg-warm-white border border-taupe/15 p-4 flex items-center gap-3">
            <Search className="w-4 h-4 text-charcoal/30" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search providers..."
              className="w-full bg-transparent outline-none font-body text-sm text-charcoal/60 placeholder:text-charcoal/25"
            />
          </div>

          {filteredProviders.length === 0 ? (
            <div className="rounded-3xl bg-warm-white border border-taupe/15 p-6 text-center">
              <Briefcase className="w-5 h-5 text-sage mx-auto mb-2" />
              <p className="font-body text-sm text-charcoal/40 font-light">No providers in this view.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProviders.map(provider => (
                <ProviderCard key={provider.id} provider={provider} selected={selected?.id === provider.id} onSelect={setSelected} />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
          <ProviderDetailPanel provider={selectedProvider} />
        </div>
      </div>
    </div>
  );
}
