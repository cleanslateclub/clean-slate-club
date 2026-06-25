import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Search, Plus, User, Phone, Mail, CheckCircle, AlertTriangle, X, ChevronRight, Shield, Eye, EyeOff } from 'lucide-react';

const STATUS_COLORS = {
  active:      'bg-sage/20 border-sage/60 text-green-700',
  draft:       'bg-taupe/10 border-taupe/30 text-charcoal/40',
  onboarding:  'bg-butter/15 border-butter/50 text-amber-700',
  on_leave:    'bg-blue-gray/15 border-blue-gray/40 text-blue-gray',
  suspended:   'bg-coral/10 border-coral/30 text-coral',
  inactive:    'bg-taupe/10 border-taupe/30 text-charcoal/30',
  terminated:  'bg-red-50 border-red-200 text-red-500',
};

const COMPLIANCE_FIELDS = [
  { key: 'background_check_cleared', label: 'Background Check' },
  { key: 'drivers_license_on_file', label: "Driver's License" },
  { key: 'vehicle_insurance_on_file', label: 'Vehicle Insurance' },
  { key: 'cpr_certification_on_file', label: 'CPR Certification' },
  { key: 'w9_on_file', label: 'W-9 on File' },
  { key: 'contractor_agreement_signed', label: 'Contractor Agreement' },
];

function ComplianceDot({ value }) {
  return (
    <div className={`w-3.5 h-3.5 rounded-full border-2 ${value ? 'bg-sage border-sage' : 'border-taupe/30 bg-transparent'}`} />
  );
}

function ProviderCard({ provider, isSelected, onClick }) {
  const score = COMPLIANCE_FIELDS.filter(f => provider[f.key]).length;
  return (
    <div
      onClick={() => onClick(provider)}
      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-coral/5 border-coral/40' : 'bg-white border-taupe/15 hover:border-coral/25'}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white font-heading font-semibold text-sm"
          style={{ background: provider.calendar_color || '#EB9486' }}>
          {provider.full_name?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-body text-sm text-charcoal font-light">{provider.full_name}</p>
            <span className={`px-1.5 py-0.5 rounded-full border text-[9px] uppercase tracking-wider font-body ${STATUS_COLORS[provider.status] || STATUS_COLORS.draft}`}>
              {provider.status || 'draft'}
            </span>
          </div>
          <p className="font-body text-xs text-charcoal/40 font-light">{provider.role}</p>
          <div className="flex items-center gap-1 mt-1.5">
            {COMPLIANCE_FIELDS.map(f => (
              <ComplianceDot key={f.key} value={provider[f.key]} />
            ))}
            <span className="font-body text-[10px] text-charcoal/30 ml-1">{score}/6</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProviderDetail({ provider, onClose, onUpdate }) {
  const [tab, setTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(provider);

  const save = async () => {
    setSaving(true);
    await base44.entities.Provider.update(provider.id, form);
    onUpdate(provider.id, form);
    setSaving(false);
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-taupe/15">
      <div className="px-5 py-4 border-b border-taupe/10 bg-cream/50">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-heading font-bold text-lg"
              style={{ background: provider.calendar_color || '#EB9486' }}>
              {provider.full_name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-charcoal">{provider.full_name}</h3>
              <p className="font-body text-xs text-charcoal/50">{provider.role} · {provider.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-taupe/10 rounded-lg text-charcoal/40">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-1 mt-3">
          {['profile', 'compliance', 'access', 'settings'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-body capitalize transition-colors ${tab === t ? 'bg-coral text-white' : 'text-charcoal/50 hover:bg-cream'}`}
            >{t}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {tab === 'profile' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {[
                ['Phone', provider.phone],
                ['Email', provider.email],
                ['Territory', provider.territory],
                ['Payout Rate', provider.payout_rate ? `${(provider.payout_rate * 100).toFixed(0)}%` : null],
                ['Jobs Completed', provider.jobs_completed],
                ['Rating', provider.rating_average?.toFixed(1)],
              ].map(([label, val]) => val != null ? (
                <div key={label} className="bg-cream rounded-xl p-3 border border-taupe/10">
                  <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 mb-1">{label}</p>
                  <p className="font-body text-xs text-charcoal/70 font-light">{val}</p>
                </div>
              ) : null)}
            </div>
            {provider.notes && (
              <div className="bg-cream rounded-xl p-3 border border-taupe/10">
                <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 mb-1">Notes</p>
                <p className="font-body text-xs text-charcoal/70 font-light">{provider.notes}</p>
              </div>
            )}
          </div>
        )}

        {tab === 'compliance' && (
          <div className="space-y-2">
            {COMPLIANCE_FIELDS.map(f => (
              <div key={f.key} className="flex items-center justify-between p-3 rounded-xl border border-taupe/10 bg-cream">
                <div className="flex items-center gap-3">
                  {form[f.key]
                    ? <CheckCircle className="w-4 h-4 text-sage" />
                    : <AlertTriangle className="w-4 h-4 text-butter" />}
                  <p className="font-body text-xs text-charcoal/70 font-light">{f.label}</p>
                </div>
                <button
                  onClick={async () => {
                    const updates = { [f.key]: !form[f.key] };
                    await base44.entities.Provider.update(provider.id, updates);
                    setForm(prev => ({ ...prev, ...updates }));
                    onUpdate(provider.id, updates);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-body transition-colors ${
                    form[f.key] ? 'bg-sage/15 text-green-700 hover:bg-sage/25' : 'bg-cream border border-taupe/20 text-charcoal/50 hover:bg-taupe/10'
                  }`}
                >
                  {form[f.key] ? 'On file ✓' : 'Mark on file'}
                </button>
              </div>
            ))}
            <div className="pt-2">
              <label className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 mb-1 block">Provider Status</label>
              <select value={form.status || 'draft'} onChange={async e => {
                const updates = { status: e.target.value };
                await base44.entities.Provider.update(provider.id, updates);
                setForm(prev => ({ ...prev, ...updates }));
                onUpdate(provider.id, updates);
              }} className="w-full border border-taupe/20 rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:border-coral/40">
                {['draft','onboarding','active','on_leave','suspended','inactive','terminated'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {tab === 'access' && (
          <div className="space-y-3">
            <div className="bg-cream rounded-xl p-3 border border-taupe/10">
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 mb-2">Portal Username</p>
              <code className="font-mono text-sm text-charcoal">{provider.login_username || '—'}</code>
            </div>
            <div className="bg-cream rounded-xl p-3 border border-taupe/10">
              <p className="font-body text-[10px] uppercase tracking-widest text-charcoal/30 mb-2">Portal Password</p>
              <div className="flex items-center gap-2">
                <code className="font-mono text-sm text-charcoal flex-1">
                  {showPassword ? (provider.login_password || '—') : '••••••••'}
                </code>
                <button onClick={() => setShowPassword(s => !s)} className="text-charcoal/30 hover:text-charcoal/60">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div className="space-y-3">
            {[
              { key: 'auto_assign_enabled', label: 'Auto-assign matching bookings' },
              { key: 'calendar_sync_enabled', label: 'Calendar sync enabled' },
              { key: 'sms_notifications_enabled', label: 'SMS notifications' },
              { key: 'email_notifications_enabled', label: 'Email notifications' },
            ].map(setting => (
              <label key={setting.key} className="flex items-center justify-between p-3 rounded-xl border border-taupe/10 bg-cream cursor-pointer">
                <p className="font-body text-xs text-charcoal/70 font-light">{setting.label}</p>
                <div
                  onClick={() => setForm(f => ({ ...f, [setting.key]: !f[setting.key] }))}
                  className={`w-9 h-5 rounded-full transition-all relative cursor-pointer ${form[setting.key] !== false ? 'bg-sage' : 'bg-taupe/30'}`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all ${form[setting.key] !== false ? 'left-[18px]' : 'left-0.5'}`} />
                </div>
              </label>
            ))}
            <button onClick={save} disabled={saving}
              className="w-full py-2.5 bg-coral text-white rounded-xl text-sm font-body hover:bg-coral/90 disabled:opacity-50 transition-colors">
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function NewProviderModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', role: 'provider' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = async () => {
    if (!form.full_name || !form.email) return;
    setSaving(true);
    const created = await base44.entities.Provider.create({ ...form, status: 'draft' });
    onCreate(created);
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-taupe/15 shadow-2xl w-full max-w-sm p-6">
        <h3 className="font-heading text-base font-semibold text-charcoal mb-4">New Provider</h3>
        <div className="space-y-3">
          <input placeholder="Full name *" value={form.full_name} onChange={e => set('full_name', e.target.value)}
            className="w-full border border-taupe/20 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-coral/40" />
          <input placeholder="Email *" value={form.email} onChange={e => set('email', e.target.value)}
            className="w-full border border-taupe/20 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-coral/40" />
          <input placeholder="Phone" value={form.phone} onChange={e => set('phone', e.target.value)}
            className="w-full border border-taupe/20 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-coral/40" />
          <select value={form.role} onChange={e => set('role', e.target.value)}
            className="w-full border border-taupe/20 rounded-xl px-3 py-2.5 text-sm font-body focus:outline-none focus:border-coral/40">
            <option value="provider">Provider</option>
            <option value="assistant">Assistant</option>
            <option value="owner">Owner</option>
          </select>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={submit} disabled={saving || !form.full_name || !form.email} className="flex-1 py-2.5 bg-coral text-white rounded-xl text-sm font-body hover:bg-coral/90 disabled:opacity-50">
            {saving ? 'Creating...' : 'Create Provider'}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 border border-taupe/20 rounded-xl text-sm font-body text-charcoal/50 hover:bg-cream">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProvidersOS({ sidebarItem }) {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    base44.entities.Provider.list('-created_date', 100)
      .then(p => { setProviders(p || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = providers.filter(p => {
    const q = search.toLowerCase();
    const match = !q || p.full_name?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q);
    const statusMatch = filterStatus === 'all' || p.status === filterStatus;
    return match && statusMatch;
  });

  return (
    <div className="flex h-full">
      <div className="w-80 shrink-0 border-r border-taupe/15 flex flex-col bg-cream/30">
        <div className="p-3 border-b border-taupe/10 space-y-2 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-base font-semibold text-charcoal">Providers</h2>
            <button onClick={() => setShowNew(true)} className="flex items-center gap-1 bg-coral text-white px-2.5 py-1.5 rounded-lg text-xs font-body hover:bg-coral/90">
              <Plus className="w-3.5 h-3.5" /> New
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-charcoal/30" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search providers..."
              className="w-full bg-cream border border-taupe/20 rounded-lg pl-8 pr-3 py-1.5 text-xs font-body text-charcoal/70 focus:outline-none focus:border-coral/40" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="w-full bg-cream border border-taupe/20 rounded-lg px-2 py-1.5 text-xs font-body text-charcoal/60 focus:outline-none">
            <option value="all">All Statuses</option>
            {Object.keys(STATUS_COLORS).map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {loading ? (
            <div className="flex justify-center py-12"><div className="w-5 h-5 border-2 border-coral border-t-transparent rounded-full animate-spin" /></div>
          ) : filtered.map(p => (
            <ProviderCard key={p.id} provider={p} isSelected={selected?.id === p.id} onClick={setSelected} />
          ))}
        </div>
      </div>
      {showNew && (
        <NewProviderModal
          onClose={() => setShowNew(false)}
          onCreate={p => { setProviders(prev => [p, ...prev]); setSelected(p); }}
        />
      )}
      {selected ? (
        <div className="flex-1 overflow-hidden">
          <ProviderDetail
            provider={selected}
            onClose={() => setSelected(null)}
            onUpdate={(id, updates) => {
              setProviders(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
              setSelected(prev => ({ ...prev, ...updates }));
            }}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-charcoal/20">
          <div className="text-center">
            <Shield className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-body text-sm font-light">Select a provider to manage</p>
          </div>
        </div>
      )}
    </div>
  );
}