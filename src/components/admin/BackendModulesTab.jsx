import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Circle, ListChecks, Search, ShieldAlert } from 'lucide-react';
import {
  BACKEND_OS_MODULES,
  BACKEND_OS_PRIORITY_LABELS,
  BACKEND_OS_STATUS_LABELS,
  getBackendModuleStats,
} from '@/lib/backendOSFeatureMap';

const statusTone = {
  planned: 'bg-cream text-charcoal/45 border-taupe/15',
  foundation: 'bg-butter/15 text-charcoal/60 border-butter/30',
  in_progress: 'bg-coral/10 text-coral border-coral/25',
  wired: 'bg-sage/10 text-sage border-sage/30',
  needs_testing: 'bg-peach/20 text-charcoal/60 border-peach/30',
  done: 'bg-sage/15 text-sage border-sage/40',
};

function ModuleCard({ module }) {
  return (
    <div className="rounded-3xl bg-warm-white border border-taupe/15 p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-heading text-lg font-semibold text-charcoal">{module.label}</h3>
            {module.priority === 'critical' && <ShieldAlert className="w-4 h-4 text-coral" />}
          </div>
          <p className="font-body text-xs text-charcoal/40 font-light mt-1 leading-relaxed">{module.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full border text-[10px] font-body whitespace-nowrap ${statusTone[module.status] || statusTone.planned}`}>
          {BACKEND_OS_STATUS_LABELS[module.status] || module.status}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 rounded-full bg-cream border border-taupe/10 text-[10px] font-body text-charcoal/40">
          {BACKEND_OS_PRIORITY_LABELS[module.priority] || module.priority}
        </span>
        <span className="px-3 py-1 rounded-full bg-cream border border-taupe/10 text-[10px] font-body text-charcoal/40">
          {module.features.length} features
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {module.features.map(feature => (
          <div key={feature} className="flex items-start gap-2 rounded-xl bg-cream/70 border border-taupe/10 px-3 py-2">
            {['wired', 'done'].includes(module.status) ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-sage mt-0.5 shrink-0" />
            ) : module.status === 'in_progress' || module.status === 'foundation' ? (
              <ListChecks className="w-3.5 h-3.5 text-coral mt-0.5 shrink-0" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-charcoal/25 mt-0.5 shrink-0" />
            )}
            <span className="font-body text-xs text-charcoal/50 font-light leading-relaxed">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BackendModulesTab() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const stats = getBackendModuleStats();

  const filteredModules = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return BACKEND_OS_MODULES.filter(module => {
      const matchesStatus = statusFilter === 'all' || module.status === statusFilter;
      const searchable = [module.label, module.description, module.priority, module.status, ...module.features]
        .join(' ')
        .toLowerCase();
      return matchesStatus && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [query, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="bg-warm-white rounded-3xl border border-taupe/15 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.22em] text-coral/60 font-light">Backend OS Scope</p>
            <h2 className="font-heading text-2xl font-semibold text-charcoal mt-1">Vagaro-style feature map</h2>
            <p className="font-body text-sm text-charcoal/45 font-light mt-2 max-w-3xl leading-relaxed">
              This is the full build checklist for the Clean Slate Club service-business backend. It is intentionally broader than what has been coded so far so we do not lose any of the features you asked for.
            </p>
          </div>
          <div className="rounded-2xl bg-coral/5 border border-coral/15 px-4 py-3 max-w-xs">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-coral mt-0.5 shrink-0" />
              <p className="font-body text-xs text-charcoal/50 font-light leading-relaxed">
                Items marked planned are not built yet. This screen is the launch-safety checklist.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-3xl bg-warm-white border border-taupe/15 p-5">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Modules</p>
          <p className="font-heading text-3xl text-charcoal mt-2">{stats.total}</p>
        </div>
        <div className="rounded-3xl bg-warm-white border border-taupe/15 p-5">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Features</p>
          <p className="font-heading text-3xl text-charcoal mt-2">{stats.features}</p>
        </div>
        <div className="rounded-3xl bg-warm-white border border-taupe/15 p-5">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Critical</p>
          <p className="font-heading text-3xl text-charcoal mt-2">{stats.critical}</p>
        </div>
        <div className="rounded-3xl bg-warm-white border border-taupe/15 p-5">
          <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30">Started</p>
          <p className="font-heading text-3xl text-charcoal mt-2">{(stats.byStatus.foundation || 0) + (stats.byStatus.in_progress || 0)}</p>
        </div>
      </div>

      <div className="bg-warm-white rounded-3xl border border-taupe/15 p-4 flex flex-col md:flex-row gap-3">
        <label className="relative flex-1">
          <Search className="w-4 h-4 text-charcoal/25 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search modules, features, payments, campaigns, providers..."
            className="w-full rounded-2xl border border-taupe/15 bg-cream py-3 pl-10 pr-4 font-body text-sm text-charcoal focus:outline-none focus:border-coral/30"
          />
        </label>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="rounded-2xl border border-taupe/15 bg-cream py-3 px-4 font-body text-sm text-charcoal/60 focus:outline-none focus:border-coral/30"
        >
          <option value="all">All statuses</option>
          {Object.entries(BACKEND_OS_STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {filteredModules.map(module => <ModuleCard key={module.key} module={module} />)}
      </div>
    </div>
  );
}
