import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';
import { useAuth } from '@/lib/AuthContext';
import { Search, RefreshCw, BarChart2, Users, Calendar as CalendarIcon, Archive, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BookingListItem from '@/components/admin/BookingListItem';
import BookingDetail from '@/components/admin/BookingDetail';
import StatsOverview from '@/components/admin/StatsOverview';
import ReportsTab from '@/components/admin/ReportsTab';
import ProvidersTab from '@/components/admin/ProvidersTab';
import ClientsTab from '@/components/admin/ClientsTab';
import QuickActions from '@/components/admin/QuickActions';
import ProviderCalendar from '@/components/provider/ProviderCalendar';
import QuickBookingModal from '@/components/admin/QuickBookingModal';
import SettingsTab from '@/components/admin/SettingsTab';
import GuestsTab from '@/components/admin/GuestsTab';
import IncidentsTab from '@/components/admin/IncidentsTab';
import PayoutsTab from '@/components/admin/PayoutsTab';
import { Settings, AlertTriangle, DollarSign, Home } from 'lucide-react';
import { isAdmin } from '@/lib/roles';

const TABS = [
  { key: 'calendar', label: 'Calendar', icon: CalendarIcon },
  { key: 'bookings', label: 'Bookings', icon: Search },
  { key: 'guests', label: 'Guests', icon: Home },
  { key: 'clients', label: 'Clients', icon: Users },
  { key: 'providers', label: 'Providers', icon: Users },
  { key: 'reports', label: 'Revenue', icon: BarChart2 },
  { key: 'payouts', label: 'Payouts', icon: DollarSign },
  { key: 'incidents', label: 'Incidents', icon: AlertTriangle },
  { key: 'settings', label: 'Settings', icon: Settings },
];

const STATUS_TABS = ['all', 'pending', 'confirmed', 'completed', 'cancelled', 'archived'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [timeBlocks, setTimeBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('calendar');
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [serviceFilter, setServiceFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [showQuickBook, setShowQuickBook] = useState(false);
  const [bookingDate, setBookingDate] = useState(null);
  const [bookingTime, setBookingTime] = useState(null);

  // Check admin session on mount + real-time subscriptions
  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) {
      navigate('/admin-login');
      return;
    }
    load();

    const unsubBookings = base44.entities.Booking.subscribe((event) => {
      if (event.type === 'create') {
        setBookings(prev => [event.data, ...prev]);
      } else if (event.type === 'update') {
        setBookings(prev => prev.map(b => b.id === event.id ? { ...b, ...event.data } : b));
      } else if (event.type === 'delete') {
        setBookings(prev => prev.filter(b => b.id !== event.id));
      }
    });

    const unsubBlocks = base44.entities.TimeBlock.subscribe((event) => {
      if (event.type === 'create') {
        setTimeBlocks(prev => [event.data, ...prev]);
      } else if (event.type === 'update') {
        setTimeBlocks(prev => prev.map(b => b.id === event.id ? { ...b, ...event.data } : b));
      } else if (event.type === 'delete') {
        setTimeBlocks(prev => prev.filter(b => b.id !== event.id));
      }
    });

    return () => { unsubBookings(); unsubBlocks(); };
  }, [navigate]);

  const load = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    const [bookingData, blockData] = await Promise.all([
      base44.entities.Booking.list('-scheduled_date', 500),
      base44.entities.TimeBlock.list('-date', 500)
    ]);
    setBookings(bookingData || []);
    setTimeBlocks(blockData || []);
    setLoading(false);
    setRefreshing(false);
  };

  const handleTimeBlockUpdate = async (blockId, updates) => {
    try {
      await base44.entities.TimeBlock.update(blockId, updates);
      setTimeBlocks(prev => prev.map(b => b.id === blockId ? { ...b, ...updates } : b));
    } catch (error) {
      console.error('Error updating time block:', error);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    await base44.entities.Booking.update(id, { status });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    setUpdatingId(null);
    if (status === 'archived') setSelected(null);
    // Sync cancellation to Google Calendar
    if (status === 'cancelled') {
      const booking = bookings.find(b => b.id === id);
      if (booking) base44.functions.invoke('syncBookingToCalendar', { data: { ...booking, status: 'cancelled' } }).catch(() => {});
    }
  };

  const handleBookingUpdated = (id, updates) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    // Also reload time blocks to reflect any date/time changes in calendar
    base44.entities.TimeBlock.list('-date', 500).then(blocks => setTimeBlocks(blocks || []));
  };

  const deleteBooking = async (id) => {
    await base44.entities.Booking.delete(id);
    setBookings(prev => prev.filter(b => b.id !== id));
    setSelected(null);
  };

  // Active bookings (non-archived) used for stats/reports
  const activeBookings = useMemo(() => bookings.filter(b => b.status !== 'archived'), [bookings]);

  const filtered = useMemo(() => {
    const pool = filter === 'archived'
      ? bookings.filter(b => b.status === 'archived')
      : activeBookings;

    return pool.filter(b => {
      const statusOk = filter === 'archived' || filter === 'all' || b.status === filter;
      const serviceOk = serviceFilter === 'all' || b.service_category === serviceFilter;
      const q = search.toLowerCase();
      const searchOk = !q || [b.client_name, b.client_email, b.client_phone, b.client_address, b.service_category]
        .some(v => v && v.toLowerCase().includes(q));
      return statusOk && serviceOk && searchOk;
    });
  }, [bookings, activeBookings, filter, serviceFilter, search]);

  const selectedBooking = selected ? bookings.find(b => b.id === selected) : null;

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    navigate('/admin-login');
  };

  // Check admin session (local gate) + role gate
  const adminSession = typeof window !== 'undefined' ? localStorage.getItem('adminSession') : null;
  if (!adminSession) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-taupe border-t-clay rounded-full animate-spin"></div>
      </div>
    );
  }

  // Secondary role-based guard: if a logged-in non-admin somehow has a session token, block them
  if (user && !isAdmin(user)) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="text-center">
          <p className="font-heading text-xl font-semibold text-charcoal mb-2">Access Denied</p>
          <p className="font-body text-sm text-charcoal/40 font-light">Admin access required.</p>
          <button onClick={handleLogout} className="mt-6 px-6 py-2.5 rounded-full bg-coral text-white font-body text-sm tracking-wide hover:bg-coral/90 transition-all">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-20 pb-16">
      {/* Header */}
      <div className="bg-warm-white border-b border-taupe/15 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-body text-[10px] tracking-[0.25em] uppercase text-coral/60 font-light">Clean Slate Club™</p>
            <h1 className="font-logo text-2xl text-coral leading-tight">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => load(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-taupe/20 bg-cream text-xs font-body font-light text-charcoal/50 hover:border-coral/30 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-taupe/20 bg-cream text-xs font-body font-light text-charcoal/50 hover:border-coral/30 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div className="bg-warm-white border-b border-taupe/10 px-6">
        <div className="max-w-7xl mx-auto flex gap-1 overflow-x-auto">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-body font-light border-b-2 whitespace-nowrap transition-all ${
                  tab === t.key
                    ? 'border-coral text-coral'
                    : 'border-transparent text-charcoal/40 hover:text-charcoal/70'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        <AnimatePresence mode="wait">

          {/* CALENDAR TAB */}
          {tab === 'calendar' && (
            <motion.div key="calendar" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-6 h-6 border-2 border-taupe border-t-coral rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <ProviderCalendar
                    timeBlocks={timeBlocks}
                    bookings={bookings}
                    selectedWeek={selectedWeek}
                    onWeekChange={setSelectedWeek}
                    onTimeBlockUpdate={handleTimeBlockUpdate}
                    user={user}
                    onQuickBook={(date, time) => {
                      setBookingDate(date);
                      setBookingTime(time);
                      setShowQuickBook(true);
                    }}
                  />
                  {showQuickBook && (
                    <QuickBookingModal
                      onClose={() => setShowQuickBook(false)}
                      onSuccess={() => load()}
                      selectedDate={bookingDate}
                      selectedTime={bookingTime}
                      timeBlocks={timeBlocks}
                    />
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* OVERVIEW TAB (Hidden) */}
          {tab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
              <StatsOverview
                bookings={activeBookings}
                onFilterChange={(f) => { setFilter(f); setTab('bookings'); }}
                activeFilter={filter}
              />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2">
                  {/* Today's schedule */}
                  <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
                    <p className="font-heading text-sm font-semibold text-charcoal mb-4">Today's Schedule</p>
                    {(() => {
                      const today = new Date().toISOString().split('T')[0];
                      const todayBookings = activeBookings
                        .filter(b => b.scheduled_date === today && b.status !== 'cancelled')
                        .sort((a, b) => (a.scheduled_start_time || '').localeCompare(b.scheduled_start_time || ''));
                      if (!todayBookings.length) return (
                        <div className="text-center py-8">
                          <p className="font-body text-sm text-charcoal/30 font-light">No visits scheduled today.</p>
                          <a href="/book" target="_blank" className="inline-block mt-3 text-xs font-body text-coral hover:underline font-light">
                            + Add a booking →
                          </a>
                        </div>
                      );
                      return (
                        <div className="space-y-2">
                          {todayBookings.map(b => {
                            const cfg = SERVICE_CONFIG[b.service_category];
                            return (
                              <button key={b.id} onClick={() => { setSelected(b.id); setTab('bookings'); }}
                                className="w-full flex items-center gap-3 p-3 rounded-xl border border-taupe/10 bg-cream hover:border-coral/25 transition-all text-left">
                                <div className="w-2 h-10 rounded-full shrink-0" style={{ background: cfg?.color || '#EB9486' }} />
                                <div className="flex-1 min-w-0">
                                  <p className="font-body text-sm text-charcoal font-light truncate">{b.client_name}</p>
                                  <p className="font-body text-xs text-charcoal/40 font-light">{b.scheduled_start_time} · {cfg?.label || b.service_category}</p>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-body font-light ${
                                  b.status === 'confirmed' ? 'bg-sage/20 border-sage/40 text-charcoal/60' : 'bg-butter/20 border-butter/40 text-charcoal/60'
                                }`}>{b.status}</span>
                              </button>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Pending bookings needing action */}
                  <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5 mt-4">
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-heading text-sm font-semibold text-charcoal">Needs Action</p>
                      <button onClick={() => { setFilter('pending'); setTab('bookings'); }}
                        className="font-body text-xs text-coral font-light hover:underline">View all →</button>
                    </div>
                    {(() => {
                      const pending = activeBookings.filter(b => b.status === 'pending').slice(0, 4);
                      if (!pending.length) return <p className="font-body text-sm text-charcoal/30 font-light text-center py-4">All clear ✓</p>;
                      return (
                        <div className="space-y-2">
                          {pending.map(b => {
                            const cfg = SERVICE_CONFIG[b.service_category];
                            return (
                              <button key={b.id} onClick={() => { setSelected(b.id); setTab('bookings'); }}
                                className="w-full flex items-center gap-3 p-3 rounded-xl border border-butter/30 bg-butter/5 hover:border-coral/25 transition-all text-left">
                                <div>
                                  <p className="font-body text-sm text-charcoal font-light">{b.client_name}</p>
                                  <p className="font-body text-xs text-charcoal/40 font-light">{cfg?.label} · {b.scheduled_date || 'TBD'}</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div className="space-y-4">
                  <QuickActions />

                  {/* Upcoming this week */}
                  <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
                    <p className="font-heading text-sm font-semibold text-charcoal mb-3">This Week</p>
                    {(() => {
                      const now = new Date();
                      const start = new Date(now); start.setDate(now.getDate() - now.getDay());
                      const end = new Date(start); end.setDate(start.getDate() + 6);
                      const fmt = d => d.toISOString().split('T')[0];
                      const week = activeBookings.filter(b =>
                        b.scheduled_date >= fmt(start) && b.scheduled_date <= fmt(end) && b.status !== 'cancelled'
                      );
                      if (!week.length) return <p className="font-body text-xs text-charcoal/30 font-light">No visits this week.</p>;
                      return (
                        <div className="space-y-1.5">
                          {week.slice(0, 5).map(b => (
                            <div key={b.id} className="flex items-center justify-between">
                              <p className="font-body text-xs text-charcoal/60 font-light truncate">{b.client_name}</p>
                              <p className="font-body text-[10px] text-charcoal/30 font-light ml-2 shrink-0">
                                {new Date(b.scheduled_date + 'T00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })}
                              </p>
                            </div>
                          ))}
                          {week.length > 5 && (
                            <p className="font-body text-[10px] text-charcoal/30 font-light">+{week.length - 5} more</p>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* BOOKINGS TAB */}
          {tab === 'bookings' && (
            <motion.div key="bookings" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Search + filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name, email, phone..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-taupe/20 bg-warm-white font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40 transition-colors"
                  />
                </div>
                <select
                  value={serviceFilter}
                  onChange={e => setServiceFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-2xl border border-taupe/20 bg-warm-white font-body text-sm text-charcoal/60 focus:outline-none focus:border-coral/40"
                >
                  <option value="all">All Services</option>
                  {Object.entries(SERVICE_CONFIG).filter(([k]) => k !== 'consult').map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>

              {/* Status tabs */}
              <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
                {STATUS_TABS.map(t => (
                  <button key={t} onClick={() => setFilter(t)}
                    className={`px-4 py-1.5 rounded-full text-xs font-body font-light border whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      filter === t ? 'bg-coral border-coral text-white' : 'bg-warm-white border-taupe/20 text-charcoal/50 hover:border-coral/30'
                    }`}
                  >
                    {t === 'archived' && <Archive className="w-3 h-3" />}
                    {t === 'all' ? `All (${activeBookings.length})` : t === 'archived' ? `Archived (${bookings.filter(b => b.status === 'archived').length})` : `${t.charAt(0).toUpperCase() + t.slice(1)} (${activeBookings.filter(b => b.status === t).length})`}
                  </button>
                ))}
              </div>

              {/* 2-col layout */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                <div className="lg:col-span-2 space-y-2">
                  {loading && <div className="flex items-center justify-center py-16"><div className="w-6 h-6 border-2 border-taupe border-t-coral rounded-full animate-spin" /></div>}
                  {!loading && filtered.length === 0 && (
                    <div className="text-center py-12">
                      <p className="font-body text-sm text-charcoal/30 font-light">{search ? `No results for "${search}"` : 'No bookings found'}</p>
                    </div>
                  )}
                  {!loading && filtered.map(b => (
                    <BookingListItem key={b.id} booking={b} isSelected={selected === b.id} onClick={() => setSelected(prev => prev === b.id ? null : b.id)} />
                  ))}
                  {!loading && <p className="font-body text-[10px] text-charcoal/25 font-light text-center pt-2">{filtered.length} booking{filtered.length !== 1 ? 's' : ''}</p>}
                </div>

                <div className="lg:col-span-3">
                  <AnimatePresence mode="wait">
                    {selectedBooking ? (
                      <motion.div key={selectedBooking.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                        <BookingDetail booking={selectedBooking} onUpdateStatus={updateStatus} onDelete={deleteBooking} updatingId={updatingId} onBookingUpdated={handleBookingUpdated} />
                      </motion.div>
                    ) : (
                      <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="bg-warm-white rounded-3xl border border-taupe/15 flex flex-col items-center justify-center py-24 px-8 text-center">
                        <div className="w-12 h-12 rounded-full bg-cream-linen flex items-center justify-center mb-4 text-xl">✦</div>
                        <p className="font-heading text-base font-semibold text-charcoal mb-1">Select a booking</p>
                        <p className="font-body text-sm text-charcoal/35 font-light">Click any booking to view details, contact the client, send invoices, and more.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {/* REPORTS TAB — CEO/Admin only (revenue, margins, analytics) */}
          {tab === 'reports' && (
            <motion.div key="reports" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <ReportsTab bookings={activeBookings} />
            </motion.div>
          )}

          {/* CLIENTS TAB */}
          {tab === 'clients' && (
            <motion.div key="clients" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <ClientsTab />
            </motion.div>
          )}

          {/* PROVIDERS TAB */}
          {tab === 'providers' && (
            <motion.div key="providers" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <ProvidersTab bookings={activeBookings} />
            </motion.div>
          )}

          {/* GUESTS TAB */}
          {tab === 'guests' && (
            <motion.div key="guests" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <GuestsTab bookings={activeBookings} />
            </motion.div>
          )}

          {/* PAYOUTS TAB */}
          {tab === 'payouts' && (
            <motion.div key="payouts" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <PayoutsTab />
            </motion.div>
          )}

          {/* INCIDENTS TAB */}
          {tab === 'incidents' && (
            <motion.div key="incidents" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <IncidentsTab />
            </motion.div>
          )}

          {/* SETTINGS TAB */}
          {tab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <SettingsTab />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}