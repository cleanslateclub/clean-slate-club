import React, { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { AlertTriangle, CheckCircle2, FileText, RefreshCw, ShieldCheck, UserCheck } from 'lucide-react';
import { getProviderComplianceChecklist } from '@/components/admin/ProviderComplianceOS';
import { PROVIDER_SERVICE_PERMISSIONS, PROVIDER_STATUSES } from '@/lib/backendOSConfig';
import { ACCESS_LEVELS } from '@/lib/providerAccessLevels';

const fieldForRequirement = (key) => `doc_${key}_complete`;
const noteForRequirement = (key) => `doc_${key}_notes`;
const expiresForRequirement = (key) => `doc_${key}_expires_at`;

function ProviderReadinessBadge({ provider }) {
  const checklist = getProviderComplianceChecklist(provider);
  const complete = checklist.filter(item => item.complete).length;
  const total = checklist.length;
  const ready = total > 0 && complete === total && provider.status === 'active';

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-body border ${ready ? 'bg-sage/10 border-sage/30 text-sage' : 'bg-butter/10 border-butter/30 text-charcoal/55'}`}>
      {ready ? 'Ready to assign' : `${complete}/${total} ready`}
    </span>
  );
}

function ProviderSelector({ providers, selectedId, onSelect }) {
  return (
    <div className="space-y-2">
      {providers.map(provider => (
        <button
          key={provider.id}
          type="button"
          onClick={() => onSelect(provider.id)}
          className={`w-full text-left rounded-2xl border p-4 transition-all ${selectedId === provider.id ? 'border-coral/40 bg-coral/5 shadow-sm' : 'border-taupe/15 bg-warm-white hover:border-coral/25'}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-heading text-sm font-semibold text-charcoal">{provider.full_name || 'Unnamed Provider'}</p>
              <p className="font-body text-xs text-charcoal/40 font-light mt-0.5">{provider.email}</p>
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 mt-2">{provider.status || 'draft'}</p>
            </div>
            <ProviderReadinessBadge provider={provider} />
          </div>
        </button>
      ))}
    </div>
  );
}

function ServicePermissionEditor({ provider, onChange }) {
  const selected = provider.services || provider.service_permissions || [];
  const toggle = (key) => {
    const next = selected.includes(key) ? selected.filter(item => item !== key) : [...selected, key];
    onChange({ services: next, service_permissions: next });
  };

  return (
    <div className="bg-warm-white rounded-3xl border border-taupe/15 p-5">
      <div className="flex items-center gap-2 mb-3">
        <UserCheck className="w-4 h-4 text-coral" />
        <p className="font-heading text-sm font-semibold text-charcoal">Approved service permissions</p>
      </div>
      <p className="font-body text-xs text-charcoal/40 font-light mb-4 leading-relaxed">
        These permissions control which document rules apply and which job types this provider should be eligible for.
      </p>
      <div className="flex flex-wrap gap-2">
        {PROVIDER_SERVICE_PERMISSIONS.map(permission => {
          const active = selected.includes(permission.key);
          return (
            <button
              key={permission.key}
              type="button"
              onClick={() => toggle(permission.key)}
              className={`px-3 py-1.5 rounded-full border text-xs font-body font-light transition-all ${active ? 'bg-coral border-coral text-white' : 'bg-cream border-taupe/20 text-charcoal/55 hover:border-coral/30'}`}
            >
              {permission.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AccessStatusEditor({ provider, onChange }) {
  return (
    <div className="bg-warm-white rounded-3xl border border-taupe/15 p-5">
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck className="w-4 h-4 text-coral" />
        <p className="font-heading text-sm font-semibold text-charcoal">Access & status</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label>
          <span className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 block mb-1">Provider status</span>
          <select
            value={provider.status || 'draft'}
            onChange={e => onChange({ status: e.target.value })}
            className="w-full rounded-2xl border border-taupe/15 bg-cream px-4 py-3 font-body text-sm text-charcoal/60 focus:outline-none focus:border-coral/30"
          >
            {PROVIDER_STATUSES.map(status => <option key={status.key} value={status.key}>{status.label}</option>)}
          </select>
        </label>
        <label>
          <span className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 block mb-1">Access level</span>
          <select
            value={provider.access_level || 'provider_basic'}
            onChange={e => onChange({ access_level: e.target.value })}
            className="w-full rounded-2xl border border-taupe/15 bg-cream px-4 py-3 font-body text-sm text-charcoal/60 focus:outline-none focus:border-coral/30"
          >
            {ACCESS_LEVELS.map(level => <option key={level.key} value={level.key}>{level.label}</option>)}
          </select>
        </label>
      </div>
    </div>
  );
}

function RequirementEditor({ item, provider, onChange }) {
  const completeField = fieldForRequirement(item.key);
  const noteField = noteForRequirement(item.key);
  const expiryField = expiresForRequirement(item.key);
  const complete = Boolean(item.complete || provider[completeField]);

  return (
    <div className="rounded-3xl border border-taupe/15 bg-warm-white p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${complete ? 'bg-sage/15 text-sage' : 'bg-butter/20 text-charcoal/45'}`}>
            {complete ? <CheckCircle2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
          </div>
          <div>
            <p className="font-heading text-sm font-semibold text-charcoal">{item.label}</p>
            <p className="font-body text-xs text-charcoal/40 font-light mt-1 leading-relaxed">{item.helper}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {item.required && <span className="px-2 py-0.5 rounded-full bg-coral/10 text-[10px] font-body text-coral">required</span>}
              {item.sensitive && <span className="px-2 py-0.5 rounded-full bg-cream border border-taupe/10 text-[10px] font-body text-charcoal/35">admin-only</span>}
              {item.expires && <span className="px-2 py-0.5 rounded-full bg-cream border border-taupe/10 text-[10px] font-body text-charcoal/35">expires</span>}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onChange({ [completeField]: !complete })}
          className={`px-3 py-1.5 rounded-full text-xs font-body border transition-all ${complete ? 'bg-sage/10 border-sage/30 text-sage' : 'bg-cream border-taupe/20 text-charcoal/45 hover:border-coral/30'}`}
        >
          {complete ? 'Approved' : 'Mark approved'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {item.expires && (
          <label>
            <span className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 block mb-1">Expiration date</span>
            <input
              type="date"
              value={provider[expiryField] || ''}
              onChange={e => onChange({ [expiryField]: e.target.value })}
              className="w-full rounded-2xl border border-taupe/15 bg-cream px-4 py-3 font-body text-sm text-charcoal/60 focus:outline-none focus:border-coral/30"
            />
          </label>
        )}
        <label className={item.expires ? '' : 'md:col-span-2'}>
          <span className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 block mb-1">Internal note</span>
          <input
            type="text"
            value={provider[noteField] || ''}
            onChange={e => onChange({ [noteField]: e.target.value })}
            placeholder="Review note, document location, exception, or follow-up needed"
            className="w-full rounded-2xl border border-taupe/15 bg-cream px-4 py-3 font-body text-sm text-charcoal/60 placeholder-charcoal/25 focus:outline-none focus:border-coral/30"
          />
        </label>
      </div>
    </div>
  );
}

export default function ProviderComplianceCenter() {
  const [providers, setProviders] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const loadProviders = async () => {
    setLoading(true);
    const data = await base44.entities.Provider.list('-created_date', 100);
    setProviders(data || []);
    setSelectedId(prev => prev || data?.[0]?.id || null);
    setLoading(false);
  };

  useEffect(() => { loadProviders(); }, []);

  const selectedProvider = providers.find(provider => provider.id === selectedId);
  const checklist = useMemo(() => selectedProvider ? getProviderComplianceChecklist(selectedProvider) : [], [selectedProvider]);
  const completeCount = checklist.filter(item => item.complete || selectedProvider?.[fieldForRequirement(item.key)]).length;
  const ready = selectedProvider && checklist.length > 0 && completeCount === checklist.length && selectedProvider.status === 'active';

  const updateProvider = async (updates) => {
    if (!selectedProvider) return;
    setSaving(true);
    setMessage('');
    try {
      const optimistic = { ...selectedProvider, ...updates };
      setProviders(prev => prev.map(provider => provider.id === selectedProvider.id ? optimistic : provider));
      await base44.entities.Provider.update(selectedProvider.id, updates);
      setMessage('Provider compliance updated.');
    } catch (error) {
      console.error('Provider compliance update failed:', error);
      setMessage('Could not save provider compliance update.');
      loadProviders();
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-taupe border-t-coral rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-warm-white rounded-3xl border border-taupe/15 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Provider OS</p>
            <h2 className="font-heading text-2xl font-semibold text-charcoal mt-1">Compliance Center</h2>
            <p className="font-body text-sm text-charcoal/45 font-light mt-2 max-w-3xl leading-relaxed">
              Manage provider readiness, service permissions, access levels, document approvals, expiration dates, and internal notes before providers see or accept work.
            </p>
          </div>
          <button type="button" onClick={loadProviders} className="flex items-center gap-2 px-4 py-2 rounded-full border border-taupe/20 bg-cream text-xs font-body text-charcoal/50 hover:border-coral/30 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {providers.length === 0 ? (
        <div className="bg-warm-white rounded-3xl border border-taupe/15 p-10 text-center">
          <p className="font-heading text-lg text-charcoal">No providers yet</p>
          <p className="font-body text-sm text-charcoal/40 font-light mt-2">Create providers in the current admin dashboard, then manage their compliance here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="space-y-3">
            <ProviderSelector providers={providers} selectedId={selectedId} onSelect={setSelectedId} />
          </div>

          <div className="xl:col-span-2 space-y-5">
            {selectedProvider && (
              <>
                <div className={`rounded-3xl border p-5 ${ready ? 'bg-sage/10 border-sage/30' : 'bg-butter/10 border-butter/30'}`}>
                  <div className="flex items-start gap-3">
                    {ready ? <CheckCircle2 className="w-5 h-5 text-sage mt-0.5" /> : <AlertTriangle className="w-5 h-5 text-charcoal/45 mt-0.5" />}
                    <div>
                      <p className="font-heading text-base font-semibold text-charcoal">{ready ? 'Ready to assign' : 'Not fully ready yet'}</p>
                      <p className="font-body text-sm text-charcoal/50 font-light mt-1">
                        {selectedProvider.full_name} has {completeCount} of {checklist.length} required readiness items complete.
                      </p>
                      {message && <p className="font-body text-xs text-charcoal/45 font-light mt-2">{message}</p>}
                      {saving && <p className="font-body text-xs text-coral font-light mt-2">Saving...</p>}
                    </div>
                  </div>
                </div>

                <AccessStatusEditor provider={selectedProvider} onChange={updateProvider} />
                <ServicePermissionEditor provider={selectedProvider} onChange={updateProvider} />

                <div className="space-y-3">
                  {checklist.map(item => (
                    <RequirementEditor key={item.key} item={item} provider={selectedProvider} onChange={updateProvider} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
