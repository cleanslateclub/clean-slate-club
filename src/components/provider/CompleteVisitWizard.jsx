import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';
import { useAuth } from '@/lib/AuthContext';
import {
  Search, RefreshCw, BarChart2, Users, Calendar as CalendarIcon,
  Archive, LogOut, Settings, AlertTriangle, DollarSign, UserPlus,
  Briefcase, LayoutDashboard, CheckSquare
} from 'lucide-react';
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
import { isAdmin } from '@/lib/roles';
import CompleteVisitWizard from '@/components/provider/CompleteVisitWizard';

const TABS = [
  { key: 'overview',   label: 'Overview',   icon: LayoutDashboard },
  { key: 'calendar',   label: 'Calendar',   icon: CalendarIcon },
  { key: 'bookings',   label: 'Bookings',   icon: Search },
  { key: 'guests',     label: 'Guests',     icon: UserPlus },
  { key: 'clients',    label: 'Clients',    icon: Users },
  { key: 'providers',  label: 'Providers',  icon: Briefcase },
  { key: 'reports',    label: 'Revenue',    icon: BarChart2 },
  { key: 'payouts',    label: 'Payouts',    icon: DollarSign },
  { key: 'incidents',  label: 'Incidents',  icon: AlertTriangle },
  { key: 'settings',   label: 'Settings',   icon: Settings },
];

const STATUS_TABS = ['all', 'pending', 'confirmed', 'completed', 'cancelled', 'archived'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings]             = useState([]);
  const [timeBlocks, setTimeBlocks]         = useState([]);
  const [loading, setLoading]               = useState(true);
  const [tab, setTab]                       = useState('overview');
  const [filter, setFilter]                 = useState('pending');
  const [search, setSearch]                 = useState('');
  const [selected, setSelected]             = useState(null);
  const [updatingId, setUpdatingId]         = useState(null);
  const [serviceFilter, setServiceFilter]   = useState('all');
  const [refreshing, setRefreshing]         = useState(false);
  const [selectedWeek, setSelectedWeek]     = useState(new Date());
  const [showQuickBook, setShowQuickBook]   = useState(false);
  const [bookingDate, setBookingDate]       = useState(null);
  const [bookingTime, setBookingTime]       = useState(null);
  // ✅ NEW: Complete Visit Wizard for admin
  const [activeVisitBooking, setActiveVisitBooking] = useState(null);

  const load = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const [bookingData, blockData] = await Promise.all([
        base44.entities.Booking.list('-scheduled_date', 500),
        base44.entities.TimeBlock.list('-date', 500)
      ]);
      setBookings(bookingData || []);
      setTimeBlocks(blockData || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('adminSession') || '{}');
    if (!session.token || Date.now() > session.expiresAt) {
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
  }, [navigate, load]);

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
    try {
      await base44.entities.Booking.update(id, { status });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      if (status === 'archived') setSelected(null);
      if (status === 'cancelled') {
        const booking = bookings.find(b => b.id === id);
        if (booking) {
          base44.functions
            .invoke('syncBookingToCalendar', { data: { ...booking, status: 'cancelled' } })
            .catch((err) => console.error('Google Calendar sync failed:', err));
        }
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleBookingUpdated = (id, updates) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    base44.entities.TimeBlock.list('-date', 500)
      .then(blocks => setTimeBlocks(blocks || []))
      .catch(err => console.error('Failed to reload time blocks:', err));
  };

  const deleteBooking = async (id) => {
    try {
      await base44.entities.Booking.delete(id);
      setBookings(prev => prev.filter(b => b.id !== id));
      setSelected(null);
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const activeBookings = useMemo(() => bookings.filter(b => b.status !== 'archived'), [bookings]);

  const filtered = useMemo(() => {
    const pool = filter === 'archived'
      ? bookings.filter(b => b.status === 'archived')
      : activeBookings;
    return pool.filter(b => {
      const statusOk  = filter === 'archived' || filter === 'all' || b.status === filter;
      const serviceOk = serviceFilter === 'all' || b.service_category === serviceFilter;
      const q         = search.toLowerCase();
      const searchOk  = !q || [b.client_name, b.client_email, b.client_phone, b.client_address, b.service_category]
        .some(v => v && v.toLowerCase().includes(q));
      return statusOk && serviceOk && searchOk;
    });
  }, [bookings, activeBookings, filter, serviceFilter, search]);

  const selectedBooking = selected ? bookings.find(b => b.id === selected) : null;

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    navigate('/admin-login');
  };

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

      {/* ✅ Complete Visit Wizard — accessible from admin for any confirmed/pending booking */}
      {activeVisitBooking && (
        <CompleteVisitWizard
          booking={activeVisitBooking}
          providerData={null}
          onComplete={() => { setActiveVisitBooking(null); load(true); }}
          onClose={() => setActiveVisitBooking(null)}
        />
      )}

      {/* Header */}
      <div className="bg-warm-white border-b border-taupe/15 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-body text-[10px] tracking-[0.25em] uppercase text-coral/60 font-light">Clean Slate Club™</p>
            <h1 className="font-logo text-2xl text-coral leading-tight">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={() => load(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-taupe/20 bg-cream text-xs font-body font-light text-charcoal/50 hover:border-coral/30 transition-colors">
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-taupe/20 bg-cream text-xs font-body font-light text-charcoal/50 hover:border-coral/30 transition-colors">
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
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-body font-light border-b-2 whitespace-nowrap transition-all ${
                  tab === t.key ? 'border-coral text-coral' : 'border-transparent text-charcoal/40 hover:text-charcoal/70'
                }`}>
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        <AnimatePresence mode="wait">

          {/* ── OVERVIEW TAB ── */}
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
                    <p className="font-heading text-sm font-semibold text-charcoal mb-4">Today’s Schedule</p>
                    {(() => {
                      const today = new Date().toISOString().split('T')[0];
                      const todayBookings = activeBookings
                        .filter(b => b.scheduled_date === today && b.status !== 'cancelled')
                        .sort((a, b) => (a.scheduled_start_time || '').localeCompare(b.scheduled_start_time || ''));
                      if (!todayBookings.length) return (
                        <div className="text-center py-8">
                          <p className="font-body text-sm text-charcoal/30 font-light">No visits scheduled today.</p>
                          <a href="/book" target="_blank" rel="noreferrer"
                            className="inline-block mt-3 text-xs font-body text-coral hover:underline font-light">+ Add a booking →</a>
                        </div>
                      );
                      return (
                        <div className="space-y-2">
                          {todayBookings.map(b => {
                            const cfg = SERVICE_CONFIG[b.service_category];
                            return (
                              <div key={b.id} className="w-full flex items-center gap-3 p-3 rounded-xl border border-taupe/10 bg-cream transition-all">
                                <button
                                  onClick={() => { setSelected(b.id); setTab('bookings'); }}
                                  className="flex items-center gap-3 flex-1 text-left hover:opacity-80 transition-opacity min-w-0"
                                >
                                  <div className="w-2 h-10 rounded-full shrink-0" style={{ background: cfg?.color || '#EB9486' }} />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-body text-sm text-charcoal font-light truncate">{b.client_name}</p>
                                    <p className="font-body text-xs text-charcoal/40 font-light">{b.scheduled_start_time} · {cfg?.label || b.service_category}</p>
                                  </div>
                                </button>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-body font-light ${
                                    b.status === 'confirmed' ? 'bg-sage/20 border-sage/40 text-charcoal/60' : 'bg-butter/20 border-butter/40 text-charcoal/60'
                                  }`}>{b.status}</span>
                                  {['pending', 'confirmed'].includes(b.status) && (
                                    <button
                                      onClick={() => setActiveVisitBooking(b)}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-coral text-white font-body text-[10px] tracking-wide hover:bg-coral/90 transition-all whitespace-nowrap"
                                    >
                                      <CheckSquare className="w-3 h-3" /> Complete
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Pending — needs action */}
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

                  {/* This Week */}
                  <div className="bg-warm-white rounded-2xl border border-taupe/15 p-5">
                    <p className="font-heading text-sm font-semibold text-charcoal mb-3">This Week</p>
                    {(() => {
                      const now   = new Date();
                      const start = new Date(now); start.setDate(now.getDate() - now.getDay());
                      const end   = new Date(start); end.setDate(start.getDate() + 6);
                      const fmt   = d => d.toISOString().split('T')[0];
                      const week  = activeBookings
                        .filter(b => b.scheduled_date >= fmt(start) && b.scheduled_date <= fmt(end) && b.status !== 'cancelled')
                        .sort((a, b) => (a.scheduled_date || '').localeCompare(b.scheduled_date || ''));
                      if (!week.length) return <p className="font-body text-sm text-charcoal/30 font-light text-center py-4">No visits this week.</p>;
                      return (
                        <div className="space-y-2">
                          {week.map(b => {
                            const cfg = SERVICE_CONFIG[b.service_category];
                            return (
                              <div key={b.id} className="flex items-center gap-2 p-2.5 rounded-xl bg-cream border border-taupe/10">
                                <div className="w-1.5 h-8 rounded-full shrink-0" style={{ background: cfg?.color || '#EB9486' }} />
                                <div className="flex-1 min-w-0">
                                  <p className="font-body text-xs text-charcoal font-light truncate">{b.client_name}</p>
                                  <p className="font-body text-[10px] text-charcoal/40 font-light">{b.scheduled_date} · {b.scheduled_start_time}</p>
                                </div>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-body font-light ${
                                  b.status === 'confirmed' ? 'bg-sage/20 border-sage/40 text-charcoal/60' : 'bg-butter/20 border-butter/40 text-charcoal/60'
                                }`}>{b.status}</span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {/* ── CALENDAR TAB ── */}
          {tab === 'calendar' && (
            <motion.div key="calendar" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
              <ProviderCalendar
                timeBlocks={timeBlocks}
                bookings={activeBookings}
                selectedWeek={selectedWeek}
                onWeekChange={setSelectedWeek}
                onTimeBlockUpdate={handleTimeBlockUpdate}
                user={null}
                onStartVisit={(b) => setActiveVisitBooking(b)}
              />
              {showQuickBook && (
                <QuickBookingModal
                  date={bookingDate}
                  time={bookingTime}
                  onClose={() => setShowQuickBook(false)}
                  onBooked={() => { setShowQuickBook(false); load(true); }}
                />
              )}
            </motion.div>
          )}

          {/* ── BOOKINGS TAB ── */}
          {tab === 'bookings' && (
            <motion.div key="bookings" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">

              {/* Status filter tabs */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {STATUS_TABS.map(s => (
                  <button key={s} onClick={() => setFilter(s)}
                    className={`px-4 py-1.5 rounded-full font-body text-xs font-light whitespace-nowrap transition-all ${
                      filter === s
                        ? 'bg-coral text-white'
                        : 'bg-warm-white border border-taupe/20 text-charcoal/50 hover:border-coral/30'
                    }`}>
                    {s}
                  </button>
                ))}
              </div>

              {/* Search + service filter */}
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-charcoal/30" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name, email, phone, address..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-full border border-taupe/20 bg-warm-white font-body text-sm text-charcoal placeholder-charcoal/25 focus:outline-none focus:border-coral/40"
                  />
                </div>
                <select
                  value={serviceFilter}
                  onChange={e => setServiceFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-full border border-taupe/20 bg-warm-white font-body text-sm text-charcoal/60 focus:outline-none focus:border-coral/40"
                >
                  <option value="all">All services</option>
                  {Object.entries(SERVICE_CONFIG).map(([key, cfg]) => (
                    <option key={key} value={key}>{cfg.label}</option>
                  ))}
                </select>
              </div>

              {/* Booking list + detail */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* List */}
                <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                  {filtered.length === 0 && (
                    <p className="font-body text-sm text-charcoal/30 font-light text-center py-8">No bookings found.</p>
                  )}
                  {filtered.map(b => (
                    <BookingListItem
                      key={b.id}
                      booking={b}
                      selected={selected === b.id}
                      onClick={() => setSelected(b.id)}
                      updatingId={updatingId}
                    />
                  ))}
                </div>

                {/* Detail panel */}
                <div className="lg:col-span-2">
                  {selectedBooking ? (
                    <div className="space-y-3">
                      {/* ✅ Complete Visit button — visible in booking detail for pending/confirmed bookings */}
                      {['pending', 'confirmed'].includes(selectedBooking.status) && (
                        <div className="flex justify-end">
                          <button
                            onClick={() => setActiveVisitBooking(selectedBooking)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-coral text-white font-body text-sm tracking-wide hover:bg-coral/90 transition-all shadow-sm"
                          >
                            <CheckSquare className="w-4 h-4" />
                            Complete Visit
                          </button>
                        </div>
                      )}
                      <BookingDetail
                        booking={selectedBooking}
                        onStatusUpdate={updateStatus}
                        onBookingUpdated={handleBookingUpdated}
                        onDelete={deleteBooking}
                        updatingId={updatingId}
                      />
                    </div>
                  ) : (
                    <div className="bg-warm-white rounded-2xl border border-taupe/15 p-10 text-center">
                      <p className="font-body text-sm text-charcoal/30 font-light">Select a booking from the list to view details.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── GUESTS TAB ── */}
          {tab === 'guests' && (
            <motion.div key="guests" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <GuestsTab />
            </motion.div>
          )}

          {/* ── CLIENTS TAB ── */}
          {tab === 'clients' && (
            <motion.div key="clients" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <ClientsTab bookings={bookings} />
            </motion.div>
          )}

          {/* ── PROVIDERS TAB ── */}
          {tab === 'providers' && (
            <motion.div key="providers" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <ProvidersTab />
            </motion.div>
          )}

          {/* ── REVENUE / REPORTS TAB ── */}
          {tab === 'reports' && (
            <motion.div key="reports" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <ReportsTab bookings={bookings} />
            </motion.div>
          )}

          {/* ── PAYOUTS TAB ── */}
          {tab === 'payouts' && (
            <motion.div key="payouts" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <PayoutsTab />
            </motion.div>
          )}

          {/* ── INCIDENTS TAB ── */}
          {tab === 'incidents' && (
            <motion.div key="incidents" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <IncidentsTab />
            </motion.div>
          )}

          {/* ── SETTINGS TAB ── */}
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
