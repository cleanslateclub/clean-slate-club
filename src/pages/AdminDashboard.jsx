import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';
import { useAuth } from '@/lib/AuthContext';
import { Search, RefreshCw, LayoutGrid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BookingListItem from '@/components/admin/BookingListItem';
import BookingDetail from '@/components/admin/BookingDetail';

const STATUS_TABS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

const STAT_COLORS = {
  pending: 'border-butter bg-butter/20 text-charcoal',
  confirmed: 'border-sage bg-sage/20 text-charcoal',
  completed: 'border-taupe bg-taupe/20 text-charcoal/60',
  cancelled: 'border-red-100 bg-red-50 text-red-400',
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [serviceFilter, setServiceFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const load = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    const data = await base44.entities.Booking.list('-scheduled_date', 200);
    setBookings(data || []);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    await base44.entities.Booking.update(id, { status });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    setUpdatingId(null);
  };

  const deleteBooking = async (id) => {
    await base44.entities.Booking.delete(id);
    setBookings(prev => prev.filter(b => b.id !== id));
    setSelected(null);
  };

  const filtered = useMemo(() => {
    return bookings.filter(b => {
      const statusOk = filter === 'all' || b.status === filter;
      const serviceOk = serviceFilter === 'all' || b.service_category === serviceFilter;
      const q = search.toLowerCase();
      const searchOk = !q || [b.client_name, b.client_email, b.client_phone, b.client_address, b.service_category]
        .some(v => v && v.toLowerCase().includes(q));
      return statusOk && serviceOk && searchOk;
    });
  }, [bookings, filter, serviceFilter, search]);

  const selectedBooking = selected ? bookings.find(b => b.id === selected) : null;

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return {
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      todayCount: bookings.filter(b => b.scheduled_date === today && b.status !== 'cancelled').length,
      totalRevenue: bookings
        .filter(b => b.status === 'completed')
        .reduce((s, b) => s + (((b.estimated_price_low || 0) + (b.estimated_price_high || 0)) / 2), 0),
    };
  }, [bookings]);

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="font-heading text-xl font-semibold text-charcoal mb-2">Access Restricted</p>
          <p className="font-body text-sm text-charcoal/40 font-light">This dashboard is for service providers only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-20 pb-16">
      {/* Top header bar */}
      <div className="bg-warm-white border-b border-taupe/15 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-body text-[10px] tracking-[0.25em] uppercase text-coral/60 font-light">Service Provider</p>
            <h1 className="font-heading text-2xl font-semibold text-charcoal leading-tight">Operations Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => load(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-taupe/20 bg-cream text-xs font-body font-light text-charcoal/50 hover:border-coral/30 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <a href="/book" target="_blank"
              className="px-4 py-2 rounded-full bg-coral text-white text-xs font-body tracking-wide hover:opacity-90 transition-opacity">
              + New Booking
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {[
            { label: "Today's visits", value: stats.todayCount, accent: '#EB9486' },
            { label: 'Pending', value: stats.pending, accent: '#F3DE8A', tab: 'pending' },
            { label: 'Confirmed', value: stats.confirmed, accent: '#CAE7B9', tab: 'confirmed' },
            { label: 'Completed', value: stats.completed, accent: '#DCDCDC', tab: 'completed' },
            { label: 'Cancelled', value: stats.cancelled, accent: '#fca5a5', tab: 'cancelled' },
            { label: 'Est. Revenue', value: `$${Math.round(stats.totalRevenue).toLocaleString()}`, accent: '#B58A90' },
          ].map(s => (
            <button
              key={s.label}
              onClick={() => s.tab && setFilter(s.tab)}
              className={`p-3 rounded-2xl border bg-warm-white text-left transition-all hover:shadow-sm ${
                filter === s.tab ? 'border-coral shadow-sm' : 'border-taupe/15 hover:border-coral/25'
              }`}
            >
              <p className="font-heading text-xl font-semibold text-charcoal">{s.value}</p>
              <p className="font-body text-[10px] text-charcoal/40 font-light mt-0.5">{s.label}</p>
            </button>
          ))}
        </div>

        {/* Search + filters bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, phone, address..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-taupe/20 bg-warm-white font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 transition-colors"
            />
          </div>
          {/* Service filter */}
          <select
            value={serviceFilter}
            onChange={e => setServiceFilter(e.target.value)}
            className="px-4 py-2.5 rounded-2xl border border-taupe/20 bg-warm-white font-body text-sm text-charcoal/60 focus:outline-none focus:border-coral/40 transition-colors"
          >
            <option value="all">All Services</option>
            {Object.entries(SERVICE_CONFIG).filter(([k]) => k !== 'consult').map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>

        {/* Status tabs */}
        <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-body font-light border whitespace-nowrap transition-all ${
                filter === tab
                  ? 'bg-coral border-coral text-white'
                  : 'bg-warm-white border-taupe/20 text-charcoal/50 hover:border-coral/30'
              }`}
            >
              {tab === 'all' ? `All (${bookings.length})` : `${tab.charAt(0).toUpperCase() + tab.slice(1)} (${bookings.filter(b => b.status === tab).length})`}
            </button>
          ))}
        </div>

        {/* Main 2-col layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Left: booking list */}
          <div className="lg:col-span-2 space-y-2">
            {loading && (
              <div className="flex items-center justify-center py-16">
                <div className="w-6 h-6 border-3 border-taupe border-t-coral rounded-full animate-spin" />
              </div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="text-center py-12">
                <p className="font-body text-sm text-charcoal/30 font-light">
                  {search ? `No results for "${search}"` : 'No bookings found'}
                </p>
              </div>
            )}
            {!loading && filtered.map(b => (
              <BookingListItem
                key={b.id}
                booking={b}
                isSelected={selected === b.id}
                onClick={() => setSelected(prev => prev === b.id ? null : b.id)}
              />
            ))}
            {!loading && (
              <p className="font-body text-[10px] text-charcoal/25 font-light text-center pt-2">
                {filtered.length} booking{filtered.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Right: detail panel */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {selectedBooking ? (
                <motion.div
                  key={selectedBooking.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <BookingDetail
                    booking={selectedBooking}
                    onUpdateStatus={updateStatus}
                    onDelete={deleteBooking}
                    updatingId={updatingId}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-warm-white rounded-3xl border border-taupe/15 flex flex-col items-center justify-center py-24 px-8 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-cream-linen flex items-center justify-center mb-4 text-xl">✦</div>
                  <p className="font-heading text-base font-semibold text-charcoal mb-1">Select a booking</p>
                  <p className="font-body text-sm text-charcoal/35 font-light">Click any booking to view full details, contact the client, send invoices, and more.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}