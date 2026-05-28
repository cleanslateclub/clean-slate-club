import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Search, Trash2, Edit2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClientsTab() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    client_address: '',
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const bookings = await base44.entities.Booking.list('-created_date', 500);
    const uniqueClients = {};
    (bookings || []).forEach(b => {
      if (b.client_email && !uniqueClients[b.client_email]) {
        uniqueClients[b.client_email] = {
          id: b.client_email,
          client_name: b.client_name,
          client_email: b.client_email,
          client_phone: b.client_phone,
          client_address: b.client_address,
        };
      }
    });
    setClients(Object.values(uniqueClients).sort((a, b) => a.client_name.localeCompare(b.client_name)));
    setLoading(false);
  };

  const handleSave = async () => {
    if (!formData.client_name || !formData.client_email) {
      alert('Name and email are required');
      return;
    }

    if (editingId) {
      // Update existing client by creating a stub booking (since we only have booking data)
      // For now, just update local state
      setClients(prev => prev.map(c => c.id === editingId ? { ...formData, id: editingId } : c));
    } else {
      // Add new client
      setClients(prev => [...prev, { ...formData, id: formData.client_email }]);
    }

    setFormData({ client_name: '', client_email: '', client_phone: '', client_address: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this client?')) {
      setClients(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleEdit = (client) => {
    setFormData(client);
    setEditingId(client.id);
    setShowForm(true);
  };

  const filtered = clients.filter(c => {
    const q = search.toLowerCase();
    return c.client_name.toLowerCase().includes(q) || c.client_email.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-taupe/20 bg-warm-white font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40"
          />
        </div>
        <button
          onClick={() => {
            setFormData({ client_name: '', client_email: '', client_phone: '', client_address: '' });
            setEditingId(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-coral text-white text-xs font-body font-light hover:bg-coral/90 transition-colors whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          New Client
        </button>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-warm-white rounded-2xl border border-taupe/15 p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-semibold text-charcoal">
                {editingId ? 'Edit Client' : 'Add New Client'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-cream rounded-lg">
                <X className="w-4 h-4 text-charcoal/40" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Client Name"
                value={formData.client_name}
                onChange={e => setFormData({ ...formData, client_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm focus:outline-none focus:border-coral/40"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.client_email}
                onChange={e => setFormData({ ...formData, client_email: e.target.value })}
                disabled={!!editingId}
                className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm focus:outline-none focus:border-coral/40 disabled:opacity-60"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.client_phone}
                onChange={e => setFormData({ ...formData, client_phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm focus:outline-none focus:border-coral/40"
              />
              <textarea
                placeholder="Address"
                value={formData.client_address}
                onChange={e => setFormData({ ...formData, client_address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-taupe/20 bg-cream font-body text-sm focus:outline-none focus:border-coral/40 h-20 resize-none"
              />
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2.5 rounded-full bg-coral text-white text-xs font-body font-light hover:bg-coral/90 transition-colors"
              >
                {editingId ? 'Update' : 'Add'} Client
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2.5 rounded-full border border-taupe/20 bg-cream text-charcoal text-xs font-body font-light hover:border-taupe/40 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clients List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-taupe border-t-coral rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="font-body text-sm text-charcoal/30 font-light">
            {search ? `No results for "${search}"` : 'No clients yet'}
          </p>
        </div>
      ) : (
        <div className="grid gap-2">
          {filtered.map(client => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-warm-white rounded-xl border border-taupe/15 p-4 flex items-center justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <p className="font-heading text-sm font-semibold text-charcoal">{client.client_name}</p>
                <p className="font-body text-xs text-charcoal/50 truncate">{client.client_email}</p>
                {client.client_phone && (
                  <p className="font-body text-xs text-charcoal/40">{client.client_phone}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(client)}
                  className="p-2 rounded-lg hover:bg-cream transition-colors text-charcoal/40 hover:text-coral"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="p-2 rounded-lg hover:bg-cream transition-colors text-charcoal/40 hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}