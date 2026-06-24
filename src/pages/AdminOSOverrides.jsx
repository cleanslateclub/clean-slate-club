import React, { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import ComplianceOverridesPanel from '@/components/admin/ComplianceOverridesPanel';
import { getProviderComplianceChecklist } from '@/components/admin/ProviderComplianceOS';
import { getActiveComplianceOverrides } from '@/lib/complianceOverrideUtils';

export default function AdminOSOverrides() {
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
  const activeOverrides = selectedProvider ? getActiveComplianceOverrides(selectedProvider) : [];

  const updateProvider = async (updates) => {
    if (!selectedProvider) return;
    setSaving(true);
    setMessage('');
    try {
      const optimistic = { ...selectedProvider, ...updates };
      setProviders(prev => prev.map(provider => provider.id === selectedProvider.id ? optimistic : provider));
      await base44.entities.Provider.update(selectedProvider.id, updates);
      setMessage('Override record updated.');
    } catch (error) {
      console.error('Override update failed:', error);
      setMessage('Could not save override update.');
      loadProviders();
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream pt-20 pb-16">
      <div className="bg-warm-white border-b border-taupe/15 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-body text-[10px] tracking-[0.25em] uppercase text-coral/60 font-light">Clean Slate Club™</p>
            <h1 className="font-logo text-2xl text-coral leading-tight">Admin Overrides</h1>
          </div>
          <div className="flex items-center gap-2">
            <a href="/admin-os/compliance" className="px-4 py-2 rounded-full border border-taupe/20 bg-cream text-xs font-body text-charcoal/50 hover:border-coral/30 transition-colors">
              Compliance Center
            </a>
            <a href="/admin-os" className="px-4 py-2 rounded-full border border-taupe/20 bg-cream text-xs font-body text-charcoal/50 hover:border-coral/30 transition-colors">
              Admin OS Preview
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 space-y-6">
        <div className="bg-warm-white rounded-3xl border border-taupe/15 p-6">
          <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Fail-safe layer</p>
          <h2 className="font-heading text-2xl font-semibold text-charcoal mt-1">Compliance overrides</h2>
          <p className="font-body text-sm text-charcoal/45 font-light mt-2 max-w-3xl leading-relaxed">
            This page is for intentional admin bypasses only. Every override requires a missing requirement, a reason, an expiration date, and confirmation.
          </p>
          {message && <p className="font-body text-xs text-charcoal/45 font-light mt-3">{message}</p>}
          {saving && <p className="font-body text-xs text-coral font-light mt-3">Saving...</p>}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-taupe border-t-coral rounded-full animate-spin" /></div>
        ) : providers.length === 0 ? (
          <div className="bg-warm-white rounded-3xl border border-taupe/15 p-10 text-center">
            <p className="font-heading text-lg text-charcoal">No providers yet</p>
            <p className="font-body text-sm text-charcoal/40 font-light mt-2">Create providers first, then manage overrides here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="space-y-2">
              {providers.map(provider => {
                const overrides = getActiveComplianceOverrides(provider);
                return (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => setSelectedId(provider.id)}
                    className={`w-full text-left rounded-2xl border p-4 transition-all ${selectedId === provider.id ? 'border-coral/40 bg-coral/5 shadow-sm' : 'border-taupe/15 bg-warm-white hover:border-coral/25'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-heading text-sm font-semibold text-charcoal">{provider.full_name || 'Unnamed Provider'}</p>
                        <p className="font-body text-xs text-charcoal/40 font-light mt-0.5">{provider.email}</p>
                      </div>
                      {overrides.length > 0 && (
                        <span className="px-2 py-1 rounded-full bg-coral/10 text-[10px] font-body text-coral">
                          {overrides.length} active
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="xl:col-span-2 space-y-4">
              {selectedProvider && (
                <>
                  <div className="bg-warm-white rounded-3xl border border-taupe/15 p-5">
                    <p className="font-heading text-lg font-semibold text-charcoal">{selectedProvider.full_name}</p>
                    <p className="font-body text-sm text-charcoal/40 font-light mt-1">{activeOverrides.length} active override{activeOverrides.length === 1 ? '' : 's'} currently on file.</p>
                  </div>
                  <ComplianceOverridesPanel provider={selectedProvider} checklist={checklist} onChange={updateProvider} />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
