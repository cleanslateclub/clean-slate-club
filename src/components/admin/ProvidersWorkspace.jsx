import React, { useEffect, useMemo, useState } from 'react';
import { Briefcase, CheckCircle2, Clock, Search, ShieldCheck, UserCog } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const FILTERS = [
  { key: 'all', label: 'All Providers', icon: Briefcase },
  { key: 'active', label: 'Active', icon: CheckCircle2 },
  { key: 'review', label: 'Needs Review', icon: Clock },
  { key: 'restricted', label: 'Restricted', icon: ShieldCheck },
];

const getFilteredProviders = (providers = [], filter = 'all') => {
  if (filter === 'active') return providers.filter(item => item.status === 'active');
  if (filter === 'review') return providers.filter(item => ['draft', 'invited', 'onboarding', 'pending_review'].includes(item.status));
  if (filter === 'restricted') return providers.filter(item => ['restricted', 'suspended', 'inactive'].includes(item.status));
  return providers;
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

function ProviderDetailPanel({ provider }) {
  if (!provider) {
    return (
      <div className="rounded-3xl bg-warm-white border border-taupe/15 p-6 text-center">
        <UserCog className="w-6 h-6 text-sage mx-auto mb-3" />
        <p className="font-heading text-lg text-charcoal">Select a provider</p>
        <p className="font-body text-sm text-charcoal/40 font-light mt-1">Choose a provider to review status, permissions, and notes.</p>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <DetailTile label="Status" value={(provider.status || 'draft').replace(/_/g, ' ')} />
        <DetailTile label="Access" value={provider.access_level} />
        <DetailTile label="Phone" value={provider.phone} />
        <DetailTile label="Service areas" value={(provider.service_areas || []).join(', ')} />
        <DetailTile label="Service permissions" value={(provider.service_permissions || provider.services || []).join(', ')} />
        <DetailTile label="Availability note" value={provider.availability_notes} />
      </div>

      <DetailTile label="Admin notes" value={provider.admin_notes} />
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
      (provider.service_permissions || provider.services || []).join(' '),
    ].some(value => String(value || '').toLowerCase().includes(q)));
  }, [providers, filter, search]);

  const selectedProvider = selected ? providers.find(item => item.id === selected.id) || selected : null;

  return (
    <div className="space-y-6">
      <div className="bg-warm-white rounded-3xl border border-taupe/15 p-6">
        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Providers workspace</p>
        <h2 className="font-heading text-2xl font-semibold text-charcoal mt-1">Provider readiness and access</h2>
        <p className="font-body text-sm text-charcoal/45 font-light mt-2 max-w-3xl leading-relaxed">
          Replaces scattered provider tools with one place to review provider status, service permissions, and notes.
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
