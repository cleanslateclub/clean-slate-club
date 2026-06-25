import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Sparkles, Package, ShoppingBag, Layout, Plus, Edit2, Trash2, X, Check, ToggleLeft, ToggleRight } from 'lucide-react';

const TYPE_TABS = [
  { key: 'service', label: 'Services', icon: Sparkles },
  { key: 'package', label: 'Packages', icon: Package },
  { key: 'addon', label: 'Add-ons', icon: ShoppingBag },
  { key: 'appt_template', label: 'Templates', icon: Layout },
];

const COLORS = ['#EB9486','#CAE7B9','#F3DE8A','#EFB988','#B58A90','#8B93A7','#97A7B3','#7E7F9A'];

function ItemFormModal({ item, type, onClose, onSave }) {
  const isNew = !item?.id;
  const [form, setForm] = useState(item || { type, status: 'active', online_booking_enabled: true, color: '#EB9486' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.label) return;
    setSaving(true);
    try {
      let result;
      if (isNew) {
        result = await base44.entities.ServiceItem.create({ ...form, type });
      } else {
        await base44.entities.ServiceItem.update(item.id, form);
        result = { ...item, ...form };
      }
      onSave(result, isNew);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="font-heading text-base font-bold text-gray-900">{isNew ? 'New' : 'Edit'} {type.replace(/_/g, ' ')}</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="font-body text-xs font-bold uppercase tracking-wider text-gray-600 mb-1 block">Name *</label>
            <input value={form.label || ''} onChange={e => set('label', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body text-gray-900 focus:outline-none focus:border-coral" />
          </div>
          <div>
            <label className="font-body text-xs font-bold uppercase tracking-wider text-gray-600 mb-1 block">Description</label>
            <textarea value={form.description || ''} onChange={e => set('description', e.target.value)} rows={3}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body text-gray-900 focus:outline-none focus:border-coral resize-none" />
          </div>
          {(type === 'service' || type === 'package') && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-body text-xs font-bold uppercase tracking-wider text-gray-600 mb-1 block">Price Low ($)</label>
                <input type="number" value={form.price_low || ''} onChange={e => set('price_low', parseFloat(e.target.value))}
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body text-gray-900 focus:outline-none focus:border-coral" />
              </div>
              <div>
                <label className="font-body text-xs font-bold uppercase tracking-wider text-gray-600 mb-1 block">Price High ($)</label>
                <input type="number" value={form.price_high || ''} onChange={e => set('price_high', parseFloat(e.target.value))}
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body text-gray-900 focus:outline-none focus:border-coral" />
              </div>
            </div>
          )}
          {type === 'addon' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-body text-xs font-bold uppercase tracking-wider text-gray-600 mb-1 block">Price Display</label>
                <input value={form.price_display || ''} onChange={e => set('price_display', e.target.value)} placeholder="+$45"
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body text-gray-900 focus:outline-none focus:border-coral" />
              </div>
              <div>
                <label className="font-body text-xs font-bold uppercase tracking-wider text-gray-600 mb-1 block">Added Time (min)</label>
                <input type="number" value={form.duration_minutes || ''} onChange={e => set('duration_minutes', parseInt(e.target.value))}
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body text-gray-900 focus:outline-none focus:border-coral" />
              </div>
            </div>
          )}
          <div>
            <label className="font-body text-xs font-bold uppercase tracking-wider text-gray-600 mb-1 block">Duration Display</label>
            <input value={form.duration_display || ''} onChange={e => set('duration_display', e.target.value)} placeholder="2-4 hrs"
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body text-gray-900 focus:outline-none focus:border-coral" />
          </div>
          {type !== 'addon' && (
            <div>
              <label className="font-body text-xs font-bold uppercase tracking-wider text-gray-600 mb-2 block">Color</label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map(c => (
                  <button key={c} onClick={() => set('color', c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${form.color === c ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                    style={{ background: c }} />
                ))}
              </div>
            </div>
          )}
          <div>
            <label className="font-body text-xs font-bold uppercase tracking-wider text-gray-600 mb-1 block">Key (internal ID)</label>
            <input value={form.key || ''} onChange={e => set('key', e.target.value.toLowerCase().replace(/\s/g, '_'))}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono text-gray-700 focus:outline-none focus:border-coral" />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl border-2 border-gray-100">
            <div>
              <p className="font-body text-sm font-semibold text-gray-800">Online Booking Enabled</p>
              <p className="font-body text-xs text-gray-500">Show to customers on the booking page</p>
            </div>
            <button onClick={() => set('online_booking_enabled', !form.online_booking_enabled)}
              className={`w-11 h-6 rounded-full transition-all relative ${form.online_booking_enabled ? 'bg-green-500' : 'bg-gray-300'}`}>
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all shadow ${form.online_booking_enabled ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>
          <div>
            <label className="font-body text-xs font-bold uppercase tracking-wider text-gray-600 mb-1 block">Status</label>
            <select value={form.status || 'active'} onChange={e => set('status', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body text-gray-900 focus:outline-none focus:border-coral">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="font-body text-xs font-bold uppercase tracking-wider text-gray-600 mb-1 block">Admin Notes</label>
            <textarea value={form.notes || ''} onChange={e => set('notes', e.target.value)} rows={2}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-body text-gray-700 focus:outline-none focus:border-coral resize-none" />
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t border-gray-100">
          <button onClick={submit} disabled={saving || !form.label}
            className="flex-1 py-3 bg-coral text-white rounded-xl text-sm font-body font-semibold hover:bg-coral/90 disabled:opacity-50 transition-colors">
            {saving ? 'Saving...' : isNew ? 'Create' : 'Save Changes'}
          </button>
          <button onClick={onClose} className="px-5 py-3 border-2 border-gray-200 rounded-xl text-sm font-body text-gray-600 hover:bg-gray-50">Cancel</button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ item, onConfirm, onCancel }) {
  const [deleting, setDeleting] = useState(false);
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
        <h3 className="font-heading text-base font-bold text-gray-900 mb-2">Delete "{item.label}"?</h3>
        <p className="font-body text-sm text-gray-600 mb-5">This cannot be undone. It will be removed from the admin and the customer-facing site.</p>
        <div className="flex gap-3">
          <button onClick={async () => { setDeleting(true); await base44.entities.ServiceItem.delete(item.id); onConfirm(item.id); }}
            disabled={deleting} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-body font-semibold hover:bg-red-600 disabled:opacity-50">
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
          <button onClick={onCancel} className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-body text-gray-600">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminServicesOS({ sidebarItem }) {
  const [activeType, setActiveType] = useState('service');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const key = sidebarItem?.section;
    if (key === 'services') setActiveType('service');
    else if (key === 'packages') setActiveType('package');
    else if (key === 'addons') setActiveType('addon');
    else if (key === 'appt_templates') setActiveType('appt_template');
  }, [sidebarItem]);

  useEffect(() => {
    setLoading(true);
    setSelected(null);
    base44.entities.ServiceItem.filter({ type: activeType })
      .then(r => { setItems(r || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [activeType]);

  const filtered = items.filter(i =>
    !search || i.label?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (result, isNew) => {
    if (isNew) {
      setItems(prev => [result, ...prev]);
    } else {
      setItems(prev => prev.map(i => i.id === result.id ? result : i));
      if (selected?.id === result.id) setSelected(result);
    }
  };

  const handleDelete = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
    if (selected?.id === id) setSelected(null);
    setDeleting(null);
  };

  const toggleStatus = async (item) => {
    const newStatus = item.status === 'active' ? 'inactive' : 'active';
    await base44.entities.ServiceItem.update(item.id, { status: newStatus });
    const updated = { ...item, status: newStatus };
    setItems(prev => prev.map(i => i.id === item.id ? updated : i));
    if (selected?.id === item.id) setSelected(updated);
  };

  const TabIcon = TYPE_TABS.find(t => t.key === activeType)?.icon || Sparkles;

  return (
    <div className="flex h-full">
      {/* List panel */}
      <div className="w-72 shrink-0 border-r border-gray-200 flex flex-col bg-gray-50">
        <div className="p-3 border-b border-gray-200 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TabIcon className="w-4 h-4 text-coral" />
              <h2 className="font-heading text-sm font-bold text-gray-900">{TYPE_TABS.find(t => t.key === activeType)?.label}</h2>
            </div>
            <button onClick={() => setEditing({})}
              className="flex items-center gap-1 bg-coral text-white px-2.5 py-1.5 rounded-lg text-xs font-body font-semibold hover:bg-coral/90">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          <div className="flex gap-1 flex-wrap">
            {TYPE_TABS.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => { setActiveType(key); setSelected(null); }}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-body font-semibold transition-colors ${activeType === key ? 'bg-coral text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Icon className="w-3 h-3" /> {label}
              </button>
            ))}
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-body text-gray-800 focus:outline-none focus:border-coral" />
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {loading ? (
            <div className="flex justify-center py-12"><div className="w-5 h-5 border-2 border-coral border-t-transparent rounded-full animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <TabIcon className="w-10 h-10 mx-auto text-gray-300 mb-2" />
              <p className="font-body text-sm text-gray-500">No {activeType}s yet.</p>
              <button onClick={() => setEditing({})} className="mt-2 text-xs text-coral font-body hover:underline">+ Add one</button>
            </div>
          ) : filtered.map(item => (
            <div key={item.id}
              onClick={() => setSelected(item)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${selected?.id === item.id ? 'bg-coral/5 border-coral/40' : 'bg-white border-gray-200 hover:border-coral/30'}`}>
              <div className="flex items-center gap-2.5">
                {item.color && <div className="w-2.5 h-8 rounded-full shrink-0" style={{ background: item.color }} />}
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-semibold text-gray-900 truncate">{item.label}</p>
                  <p className="font-body text-xs text-gray-500 truncate">
                    {item.price_display || (item.price_low ? `$${item.price_low}–$${item.price_high}` : item.duration_display || '')}
                  </p>
                </div>
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-body font-semibold uppercase tracking-wider ${item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {item.status || 'active'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      {selected ? (
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="border-b border-gray-200 px-6 py-4 flex items-start justify-between bg-gray-50">
            <div className="flex items-center gap-3">
              {selected.color && <div className="w-4 h-12 rounded-full" style={{ background: selected.color }} />}
              <div>
                <h2 className="font-heading text-xl font-bold text-gray-900">{selected.label}</h2>
                <p className="font-body text-sm text-gray-600 capitalize">{selected.type?.replace(/_/g, ' ')} · {selected.status}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleStatus(selected)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body font-semibold border transition-colors ${selected.status === 'active' ? 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200' : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'}`}>
                {selected.status === 'active' ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                {selected.status === 'active' ? 'Active' : 'Inactive'}
              </button>
              <button onClick={() => setEditing(selected)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body font-semibold bg-coral text-white hover:bg-coral/90">
                <Edit2 className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={() => setDeleting(selected)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body font-semibold border border-red-200 text-red-500 hover:bg-red-50">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {selected.description && (
              <div>
                <p className="font-body text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Description</p>
                <p className="font-body text-sm text-gray-800 leading-relaxed">{selected.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {(selected.price_low || selected.price_high) && (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                  <p className="font-body text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Price Range</p>
                  <p className="font-heading text-lg font-bold text-gray-900">${selected.price_low}–${selected.price_high}</p>
                </div>
              )}
              {selected.price_display && (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                  <p className="font-body text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Price</p>
                  <p className="font-heading text-lg font-bold text-gray-900">{selected.price_display}</p>
                </div>
              )}
              {(selected.duration_display || selected.duration_minutes) && (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                  <p className="font-body text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Duration</p>
                  <p className="font-body text-sm font-semibold text-gray-800">{selected.duration_display || `${selected.duration_minutes} min`}</p>
                </div>
              )}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                <p className="font-body text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Online Booking</p>
                <p className={`font-body text-sm font-semibold ${selected.online_booking_enabled !== false ? 'text-green-700' : 'text-gray-500'}`}>
                  {selected.online_booking_enabled !== false ? '✓ Visible to customers' : '✗ Admin only'}
                </p>
              </div>
            </div>

            {selected.notes && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="font-body text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">Admin Notes</p>
                <p className="font-body text-sm text-gray-700">{selected.notes}</p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="font-body text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">Customer Site Impact</p>
              <p className="font-body text-sm text-gray-700">
                {selected.online_booking_enabled !== false && selected.status === 'active'
                  ? '✅ This item is live and visible on your customer booking page.'
                  : '⚠️ This item is NOT currently visible to customers. Toggle status or online booking to make it live.'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <TabIcon className="w-14 h-14 mx-auto text-gray-300 mb-3" />
            <p className="font-body text-base text-gray-500">Select an item or create a new one</p>
            <button onClick={() => setEditing({})} className="mt-3 flex items-center gap-2 mx-auto bg-coral text-white px-4 py-2 rounded-xl text-sm font-body font-semibold hover:bg-coral/90">
              <Plus className="w-4 h-4" /> Add {activeType.replace(/_/g, ' ')}
            </button>
          </div>
        </div>
      )}

      {editing !== null && (
        <ItemFormModal
          item={editing.id ? editing : null}
          type={activeType}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
      {deleting && (
        <DeleteConfirm item={deleting} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />
      )}
    </div>
  );
}