import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, X, Archive, Phone, Mail, Edit2, Check } from 'lucide-react';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';
import ProviderDetailPanel from '@/components/admin/ProviderDetailPanel';
import { motion, AnimatePresence } from 'framer-motion';

const SERVICE_OPTIONS = Object.entries(SERVICE_CONFIG)
  .filter(([k]) => k !== 'consult')
  .map(([k, v]) => ({ key: k, label: v.label }));

const ROLE_COLORS = { owner: '#EB9486', provider: '#CAE7B9', assistant: '#EFB988' };

function ProviderForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || {
    full_name: '',
    email: '',
    phone: '',
    login_username: '',
    login_password: '',
    role: 'provider',
    services: [],
    status: 'active',
    notes: '',
    hours_available_per_week: 20,
    auto_assign_enabled: false,
    calendar_sync_enabled: true,
    sms_notifications_enabled: true,
    email_notifications_enabled: true
  });

  const generateLoginCredentials = () => {
    const username = form.full_name
      ? form.full_name.toLowerCase().replace(/\s+/g, '.') + Math.random().toString(36).slice(-4)
      : 'provider' + Math.random().toString(36).slice(-6);
    const password = Math.random().toString(36).slice(-12);
    setForm(f => ({ ...f, login_username: username, login_password: password }));
  };

  const toggleService = (key) => {
    setForm(f => ({
      ...f,
      services: f.services?.includes(key) ? f.services.filter(s => s !== key) : [...(f.services || []), key]
    }));
  };

  return (
    <div className="bg-warm-white rounded-2xl border border-taupe/15 p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { key: 'full_name', label: 'Full Name', placeholder: 'Provider name', required: true },
          { key: 'email', label: 'Email', placeholder: 'email@example.com', required: true },
          { key: 'phone', label: 'Phone', placeholder: '(555) 555-5555' },
          { key: 'hours_available_per_week', label: 'Weekly Hours Available', placeholder: '20', type: 'number' },
        ].map(f => (
          <div key={f.key}>
            <label className="font-body text-xs text-charcoal/50 font-light block mb-1.5">{f.label}{f.required && <span className="text-coral ml-0.5">*</span>}</label>
            <input
              type={f.type || 'text'}
              value={form[f.key] || ''}
              onChange={e => setForm(p => ({ ...p, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
              placeholder={f.placeholder}
              className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40"
            />
          </div>
        ))}

        {/* Login Credentials Section */}
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <label className="font-body text-xs text-charcoal/50 font-light">Portal Login Credentials<span className="text-coral ml-0.5">*</span></label>
            <button
              type="button"
              onClick={generateLoginCredentials}
              className="text-[10px] font-body text-coral hover:underline font-light"
            >
              Generate →
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                value={form.login_username || ''}
                onChange={e => setForm(p => ({ ...p, login_username: e.target.value }))}
                placeholder="Username"
                className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40"
              />
            </div>
            <div>
              <input
                type="text"
                value={form.login_password || ''}
                onChange={e => setForm(p => ({ ...p, login_password: e.target.value }))}
                placeholder="Password"
                className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40"
              />
            </div>
          </div>
          <p className="font-body text-[10px] text-charcoal/40 font-light mt-1.5">Share these credentials with the provider. They can update them after first login.</p>
        </div>
        <div>
          <label className="font-body text-xs text-charcoal/50 font-light block mb-1.5">Role</label>
          <select
            value={form.role}
            onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal focus:outline-none focus:border-coral/40"
          >
            <option value="owner">Owner</option>
            <option value="provider">Provider</option>
            <option value="assistant">Assistant</option>
          </select>
        </div>
      </div>

      <div>
        <label className="font-body text-xs text-charcoal/50 font-light block mb-2">Services offered</label>
        <div className="flex flex-wrap gap-2">
          {SERVICE_OPTIONS.map(s => {
            const sel = form.services?.includes(s.key);
            return (
              <button key={s.key} type="button" onClick={() => toggleService(s.key)}
                className={`px-3 py-1.5 rounded-full border text-xs font-body font-light transition-all ${
                  sel ? 'bg-coral border-coral text-white' : 'bg-cream border-taupe/20 text-charcoal/60 hover:border-coral/30'
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="font-body text-xs text-charcoal/50 font-light block mb-1.5">Notes</label>
        <textarea
          value={form.notes || ''}
          onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
          placeholder="Availability, preferences, notes..."
          rows={2}
          className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 resize-none"
        />
      </div>

      <div className="flex gap-3 pt-1">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-2xl border border-taupe/20 text-charcoal/50 font-body text-sm font-light hover:border-coral/30 transition-colors">Cancel</button>
        <button
          onClick={() => form.full_name && form.email && form.login_username && form.login_password && onSave(form)}
          disabled={!form.full_name || !form.email || !form.login_username || !form.login_password}
          className="flex-1 py-2.5 rounded-2xl bg-coral text-white font-body text-sm tracking-wide disabled:opacity-40 hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" /> Save Provider
        </button>
      </div>
    </div>
  );
}

export default function ProvidersTab({ bookings }) {
  const [showVisibilitySettings, setShowVisibilitySettings] = useState(false);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState(null);

  const load = async () => {
    const data = await base44.entities.Provider.list('-created_date', 100);
    setProviders(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    if (editingId) {
      await base44.entities.Provider.update(editingId, form);
    } else {
      await base44.entities.Provider.create(form);
    }
    setShowForm(false);
    setEditingId(null);
    load();
  };

  const handleUpdateProvider = async (id, updates) => {
    await base44.entities.Provider.update(id, updates);
    load();
    setSelectedProviderId(null);
  };

  const handleArchive = async (id) => {
    await base44.entities.Provider.update(id, { status: 'archived' });
    load();
  };

  const handleRestore = async (id) => {
    await base44.entities.Provider.update(id, { status: 'active' });
    load();
  };

  const active = providers.filter(p => p.status !== 'archived');
  const archived = providers.filter(p => p.status === 'archived');
  const displayed = showArchived ? archived : active;

  // Booking counts per provider email
  const bookingsByProvider = {};
  bookings.forEach(b => {
    if (b.provider_email) {
      bookingsByProvider[b.provider_email] = (bookingsByProvider[b.provider_email] || 0) + 1;
    }
  });

  if (loading) return <div className="flex items-center justify-center py-16"><div className="w-6 h-6 border-2 border-taupe border-t-coral rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-4">
      {/* Visibility controls */}
      <div className="bg-warm-white rounded-2xl border border-taupe/15 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading text-sm font-semibold text-charcoal">Provider Dashboard Access</h3>
            <p className="font-body text-xs text-charcoal/50 font-light mt-1">Control what providers can see on their dashboards.</p>
          </div>
          <button
            onClick={() => setShowVisibilitySettings(!showVisibilitySettings)}
            className="px-3 py-1.5 text-xs font-body rounded-full border border-coral/30 bg-coral/5 text-coral hover:bg-coral/10 transition-colors"
          >
            {showVisibilitySettings ? 'Done' : 'Customize'}
          </button>
        </div>

        {showVisibilitySettings && (
          <div className="space-y-3 pt-4 border-t border-taupe/10">
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-cream transition-colors">
              <input type="checkbox" defaultChecked className="mt-1" />
              <div>
                <p className="font-body text-sm text-charcoal font-light">Show assigned bookings only</p>
                <p className="font-body text-xs text-charcoal/40 font-light">Providers see only visits assigned to them</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-cream transition-colors">
              <input type="checkbox" defaultChecked className="mt-1" />
              <div>
                <p className="font-body text-sm text-charcoal font-light">Allow calendar editing</p>
                <p className="font-body text-xs text-charcoal/40 font-light">Providers can drag-and-drop to reschedule</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-cream transition-colors">
              <input type="checkbox" defaultChecked={false} className="mt-1" />
              <div>
                <p className="font-body text-sm text-charcoal font-light">Show pricing breakdown</p>
                <p className="font-body text-xs text-charcoal/40 font-light">Providers see deposit amount and rates</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-cream transition-colors">
              <input type="checkbox" defaultChecked={false} className="mt-1" />
              <div>
                <p className="font-body text-sm text-charcoal font-light">Show client notes</p>
                <p className="font-body text-xs text-charcoal/40 font-light">Providers see intake answers and special requests</p>
              </div>
            </label>
          </div>
        )}
      </div>

      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          <button onClick={() => setShowArchived(false)}
            className={`px-4 py-1.5 rounded-full text-xs font-body font-light border transition-all ${!showArchived ? 'bg-coral border-coral text-white' : 'bg-warm-white border-taupe/20 text-charcoal/50 hover:border-coral/30'}`}>
            Active ({active.length})
          </button>
          <button onClick={() => setShowArchived(true)}
            className={`px-4 py-1.5 rounded-full text-xs font-body font-light border transition-all ${showArchived ? 'bg-coral border-coral text-white' : 'bg-warm-white border-taupe/20 text-charcoal/50 hover:border-coral/30'}`}>
            Archived ({archived.length})
          </button>
        </div>
        {!showArchived && (
          <button onClick={() => { setShowForm(true); setEditingId(null); setSelectedProviderId(null); }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-coral text-white text-xs font-body font-light tracking-widest uppercase hover:bg-coral/90 transition-colors">
            <Plus className="w-4 h-4" /> Add Provider
          </button>
        )}
      </div>

      {/* Add/Edit Provider Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            key="form-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-warm-white rounded-3xl border border-taupe/15 shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="mb-6">
                <h3 className="font-heading text-2xl font-semibold text-charcoal">
                  {editingId ? 'Edit Provider' : 'Add New Provider'}
                </h3>
                <p className="font-body text-sm text-charcoal/50 font-light mt-2">
                  {editingId ? 'Update provider details, credentials, and settings.' : 'Create a new employee or contractor profile with login credentials for portal access.'}
                </p>
              </div>
              <ProviderForm
                initial={editingId ? providers.find(p => p.id === editingId) : undefined}
                onSave={(form) => {
                  handleSave(form);
                  setShowForm(false);
                }}
                onCancel={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {displayed.length === 0 && (
        <div className="text-center py-12 bg-warm-white rounded-2xl border border-taupe/15">
          <p className="font-body text-sm text-charcoal/30 font-light">
            {showArchived ? 'No archived providers.' : 'No providers yet. Add your first one above.'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Provider List */}
        <div className="lg:col-span-1 space-y-3">
          {displayed.map(p => {
            const complianceCount = [
              p.background_check_cleared,
              p.drivers_license_on_file,
              p.vehicle_insurance_on_file,
              p.cpr_certification_on_file,
              p.w9_on_file,
              p.contractor_agreement_signed
            ].filter(Boolean).length;

            return (
              <motion.button
                key={p.id}
                onClick={() => setSelectedProviderId(p.id)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`w-full text-left bg-warm-white rounded-2xl border transition-all ${
                  selectedProviderId === p.id
                    ? 'border-coral/40 shadow-md bg-coral/5'
                    : 'border-taupe/15 hover:border-coral/20'
                } p-4`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-heading font-bold shrink-0"
                    style={{ background: ROLE_COLORS[p.role] || '#EB9486' }}
                  >
                    {p.full_name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading text-sm font-semibold text-charcoal truncate">{p.full_name}</p>
                    <p className="font-body text-xs text-charcoal/50 font-light mt-0.5">{p.role}</p>
                    {/* Compliance and stats badge */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-body font-light ${
                          complianceCount === 6
                            ? 'bg-sage/10 text-sage'
                            : 'bg-butter/10 text-charcoal/60'
                        }`}
                      >
                        {complianceCount}/6 docs
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-body font-light bg-cream text-charcoal/60">
                        {p.jobs_completed || 0} jobs
                      </span>
                    </div>
                  </div>
                  {showArchived ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestore(p.id);
                      }}
                      className="px-2 py-1 rounded border border-sage/40 text-sage text-[10px] font-body font-light hover:bg-sage/10 transition-colors shrink-0"
                    >
                      Restore
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArchive(p.id);
                      }}
                      className="p-1.5 rounded hover:bg-taupe/10 text-charcoal/25 hover:text-charcoal/50 transition-colors shrink-0"
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedProviderId ? (
              <ProviderDetailPanel
                provider={providers.find(p => p.id === selectedProviderId)}
                onClose={() => setSelectedProviderId(null)}
                onUpdate={handleUpdateProvider}
              />
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-warm-white rounded-3xl border border-taupe/15 flex flex-col items-center justify-center py-24 px-8 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-cream-linen flex items-center justify-center mb-4 text-2xl">
                  👥
                </div>
                <p className="font-heading text-base font-semibold text-charcoal mb-1">
                  Select a provider
                </p>
                <p className="font-body text-sm text-charcoal/35 font-light">
                  Click any provider name to view compliance, manage access, set automations, and edit availability.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}