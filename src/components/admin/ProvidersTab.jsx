import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, X, Archive, Phone, Mail, Edit2, Check } from 'lucide-react';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';

const SERVICE_OPTIONS = Object.entries(SERVICE_CONFIG)
  .filter(([k]) => k !== 'consult')
  .map(([k, v]) => ({ key: k, label: v.label }));

const ROLE_COLORS = { owner: '#EB9486', provider: '#CAE7B9', assistant: '#EFB988' };

function ProviderForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { full_name: '', email: '', phone: '', role: 'provider', services: [], status: 'active', notes: '' });

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
        ].map(f => (
          <div key={f.key}>
            <label className="font-body text-xs text-charcoal/50 font-light block mb-1.5">{f.label}{f.required && <span className="text-coral ml-0.5">*</span>}</label>
            <input
              value={form[f.key] || ''}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              placeholder={f.placeholder}
              className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40"
            />
          </div>
        ))}
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
          onClick={() => form.full_name && form.email && onSave(form)}
          disabled={!form.full_name || !form.email}
          className="flex-1 py-2.5 rounded-2xl bg-coral text-white font-body text-sm tracking-wide disabled:opacity-40 hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" /> Save Provider
        </button>
      </div>
    </div>
  );
}

export default function ProvidersTab({ bookings }) {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showArchived, setShowArchived] = useState(false);

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
          <button onClick={() => { setShowForm(true); setEditingId(null); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-coral text-white text-xs font-body tracking-wide hover:opacity-90 transition-opacity">
            <Plus className="w-3.5 h-3.5" /> Add Provider
          </button>
        )}
      </div>

      {showForm && !editingId && (
        <ProviderForm onSave={handleSave} onCancel={() => setShowForm(false)} />
      )}

      {displayed.length === 0 && (
        <div className="text-center py-12 bg-warm-white rounded-2xl border border-taupe/15">
          <p className="font-body text-sm text-charcoal/30 font-light">
            {showArchived ? 'No archived providers.' : 'No providers yet. Add your first one above.'}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {displayed.map(p => (
          editingId === p.id ? (
            <ProviderForm key={p.id} initial={p} onSave={handleSave} onCancel={() => setEditingId(null)} />
          ) : (
            <div key={p.id} className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-heading font-semibold text-sm shrink-0"
                    style={{ background: ROLE_COLORS[p.role] || '#EB9486' }}>
                    {p.full_name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-heading text-sm font-semibold text-charcoal">{p.full_name}</p>
                      <span className="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-body font-light border"
                        style={{ color: ROLE_COLORS[p.role], borderColor: ROLE_COLORS[p.role] + '40', background: ROLE_COLORS[p.role] + '10' }}>
                        {p.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <a href={`mailto:${p.email}`} className="font-body text-xs text-charcoal/40 font-light hover:text-coral transition-colors flex items-center gap-1">
                        <Mail className="w-3 h-3" />{p.email}
                      </a>
                      {p.phone && (
                        <a href={`tel:${p.phone}`} className="font-body text-xs text-charcoal/40 font-light hover:text-coral transition-colors flex items-center gap-1">
                          <Phone className="w-3 h-3" />{p.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditingId(p.id); setShowForm(false); }}
                    className="p-2 rounded-full hover:bg-taupe/10 text-charcoal/30 hover:text-charcoal transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {showArchived ? (
                    <button onClick={() => handleRestore(p.id)}
                      className="px-3 py-1.5 rounded-full border border-sage/40 text-sage text-xs font-body font-light hover:bg-sage/10 transition-colors">
                      Restore
                    </button>
                  ) : (
                    <button onClick={() => handleArchive(p.id)}
                      className="p-2 rounded-full hover:bg-taupe/10 text-charcoal/25 hover:text-charcoal/50 transition-colors">
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {p.services?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {p.services.map(s => (
                    <span key={s} className="px-2.5 py-0.5 rounded-full bg-cream border border-taupe/20 text-[10px] font-body font-light text-charcoal/50">
                      {SERVICE_CONFIG[s]?.label || s}
                    </span>
                  ))}
                </div>
              )}

              {p.notes && (
                <p className="font-body text-xs text-charcoal/40 font-light mt-2 italic">{p.notes}</p>
              )}
            </div>
          )
        ))}
      </div>
    </div>
  );
}