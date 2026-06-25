import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { ChevronLeft, ChevronRight, Plus, Search, CalendarDays, List, Grid3X3, AlertTriangle, DollarSign, X } from 'lucide-react';
import BookingDrawer from '@/components/admin/os/BookingDrawer';
import QuickBookingModal from '@/components/admin/QuickBookingModal';

const STATUS_COLORS = {
  pending:          { bg: '#EB948615', border: '#EB948640', text: '#EB9486', label: 'New Request', dot: '#EB9486' },
  needs_review:     { bg: '#EB948610', border: '#EB9486', text: '#EB9486', label: 'Needs Review', dot: '#EB9486' },
  draft:            { bg: '#F3DE8A15', border: '#F3DE8A50', text: '#b8860b', label: 'Draft', dot: '#F3DE8A' },
  approved:         { bg: '#CAE7B920', border: '#CAE7B960', text: '#4a7c59', label: 'Approved', dot: '#CAE7B9' },
  confirmed:        { bg: '#CAE7B925', border: '#CAE7B9', text: '#3d6b4a', label: 'Confirmed', dot: '#CAE7B9' },
  provider_assigned:{ bg: '#8B93A715', border: '#8B93A740', text: '#5c6378', label: 'Assigned', dot: '#8B93A7' },
  in_progress:      { bg: '#EFB98820', border: '#EFB98860', text: '#8b6914', label: 'In Progress', dot: '#EFB988' },
  completed:        { bg: '#CAE7B915', border: '#CAE7B940', text: '#6b8c73', label: 'Completed', dot: '#a8c5a0' },
  cancelled:        { bg: '#e8e8e415', border: '#e8e8e440', text: '#999', label: 'Cancelled', dot: '#ccc' },
  no_show:          { bg: '#EB948615', border: '#EB948650', text: '#c0392b', label: 'No Show', dot: '#e74c3c' },
  consult:          { bg: '#F3DE8A15', border: '#F3DE8A50', text: '#8b7214', label: 'Consult', dot: '#F3DE8A' },
  rescheduled:      { bg: '#8B93A715', border: '#8B93A740', text: '#5c6378', label: 'Rescheduled', dot: '#8B93A7' },
};

const STATUS_BADGE_STYLES = {
  pending:          'bg-coral/15 border-coral/40 text-coral',
  needs_review:     'bg-coral/10 border-coral text-coral',
  draft:            'bg-butter/20 border-butter/50 text-amber-700',
  approved:         'bg-sage/20 border-sage/60 text-green-700',
  confirmed:        'bg-sage/25 border-sage text-green-800',
  provider_assigned:'bg-blue-gray/15 border-blue-gray/40 text-blue-gray',
  in_progress:      'bg-peach/20 border-peach/60 text-amber-800',
  completed:        'bg-sage/15 border-sage/40 text-green-700',
  cancelled:        'bg-taupe/15 border-taupe/40 text-charcoal/40',
  no_show:          'bg-red-50 border-red-200 text-red-600',
  rescheduled:      'bg-blue-gray/15 border-blue-gray/40 text-blue-gray',
};

const HOUR_SLOTS = Array.from({ length: 12 }, (_, i) => i + 8); // 8am–7pm

function TimeColumn() {
  return (
    <div className="w-16 shrink-0 border-r border-taupe/15">
      <div className="h-10 border-b border-taupe/10" />
      {HOUR_SLOTS.map(h => (
        <div key={h} className="h-16 border-b border-taupe/8 flex items-start justify-end pr-2 pt-1">
          <span className="font-body text-[10px] text-charcoal/30 font-light">
            {h === 12 ? '12pm' : h < 12 ? `${h}am` : `${h - 12}pm`}
          </span>
        </div>
      ))}
    </div>
  );
}

function parseTimeToMinutes(timeStr) {
  if (!timeStr) return 10 * 60;
  const ampm = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (ampm) {
    let h = parseInt(ampm[1]);
    const m = parseInt(ampm[2]);
    const period = ampm[3].toUpperCase();
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  }
  const parts = timeStr.split(':');
  return parseInt(parts[0] || 10) * 60 + parseInt(parts[1] || 0);
}

function BookingBlock({ booking, onClick }) {
  const sc = STATUS_COLORS[booking.status] || STATUS_COLORS.pending;
  const totalMins = parseTimeToMinutes(booking.scheduled_start_time);
  const startH = Math.floor(totalMins / 60);
  const startM = totalMins % 60;
  const top = (startH - 8) * 64 + (startM / 60) * 64 + 40;
  const dur = Math.max((booking.total_duration_minutes || 120) / 60, 0.5);
  const height = Math.max(dur * 64 - 4, 28);

  return (
    <div
      className="absolute left-1 right-1 rounded-lg cursor-pointer border overflow-hidden hover:shadow-md transition-shadow z-10 group"
      style={{ top, height, background: sc.bg, borderColor: sc.border, borderLeftWidth: 3, borderLeftColor: sc.dot }}
      onClick={() => onClick(booking)}
    >
      <div className="px-2 py-1">
        <p className="font-body text-[11px] font-semibold leading-tight truncate" style={{ color: sc.text }}>
          {booking.client_name}
        </p>
        <p className="font-body text-[10px] font-light opacity-75 truncate" style={{ color: sc.text }}>
          {booking.service_label || booking.service_category?.replace(/_/g, ' ')}
        </p>
        {height > 44 && (
          <p className="font-body text-[10px] opacity-60 mt-0.5" style={{ color: sc.text }}>
            {booking.scheduled_start_time}
          </p>
        )}
      </div>
    </div>
  );
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AdminCalendarOS({ sidebarItem }) {
  const [view, setView] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProvider, setFilterProvider] = useState('all');
  const [providers, setProviders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewBooking, setShowNewBooking] = useState(false);

  useEffect(() => {
    if (sidebarItem?.key === 'day_view') setView('day');
    else if (sidebarItem?.key === 'week_view') setView('week');
    else if (sidebarItem?.key === 'month_view') setView('month');
    else if (sidebarItem?.key === 'today') { setView('day'); setCurrentDate(new Date()); }
  }, [sidebarItem]);

  const loadData = () => {
    Promise.all([
      base44.entities.Booking.list('-scheduled_date', 200),
      base44.entities.Provider.filter({ status: 'active' }),
    ]).then(([b, p]) => {
      setBookings(b || []);
      setProviders(p || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  // Week dates
  const weekDates = useMemo(() => {
    const d = new Date(currentDate);
    const day = d.getDay();
    const monday = new Date(d);
    monday.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
    return Array.from({ length: 7 }, (_, i) => {
      const dd = new Date(monday);
      dd.setDate(monday.getDate() + i);
      return dd;
    });
  }, [currentDate]);

  const filteredBookings = useMemo(() => {
    let b = bookings;
    if (filterStatus !== 'all') b = b.filter(x => x.status === filterStatus);
    if (filterProvider !== 'all') b = b.filter(x => x.provider_email === filterProvider);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      b = b.filter(x => x.client_name?.toLowerCase().includes(q) || x.client_email?.toLowerCase().includes(q));
    }
    return b;
  }, [bookings, filterStatus, filterProvider, searchQuery]);

  const bookingsByDate = useMemo(() => {
    const map = {};
    filteredBookings.forEach(b => {
      if (!map[b.scheduled_date]) map[b.scheduled_date] = [];
      map[b.scheduled_date].push(b);
    });
    return map;
  }, [filteredBookings]);

  const navigate = (dir) => {
    const d = new Date(currentDate);
    if (view === 'day') d.setDate(d.getDate() + dir);
    else if (view === 'week') d.setDate(d.getDate() + 7 * dir);
    else d.setMonth(d.getMonth() + dir);
    setCurrentDate(d);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Pending counts for attention strip
  const newCount = bookings.filter(b => b.status === 'pending').length;
  const reviewCount = bookings.filter(b => b.status === 'needs_review').length;
  const depositCount = bookings.filter(b => b.deposit_status === 'pending' && b.status !== 'cancelled').length;

  return (
    <div className="flex flex-col h-full">
      {/* Attention strip */}
      {(newCount > 0 || reviewCount > 0 || depositCount > 0) && (
        <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-taupe/15 text-xs font-body">
          {newCount > 0 && (
            <button onClick={() => setFilterStatus('pending')} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-coral/10 border border-coral/30 text-coral hover:bg-coral/20 transition-colors">
              <span className="w-4 h-4 rounded-full bg-coral text-white text-[9px] flex items-center justify-center font-bold">{newCount}</span>
              New Requests
            </button>
          )}
          {reviewCount > 0 && (
            <button onClick={() => setFilterStatus('needs_review')} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-butter/20 border border-butter/50 text-amber-700 hover:bg-butter/30 transition-colors">
              <AlertTriangle className="w-3 h-3" />
              {reviewCount} Needs Review
            </button>
          )}
          {depositCount > 0 && (
            <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate/10 border border-slate/30 text-slate hover:bg-slate/20 transition-colors">
              <DollarSign className="w-3 h-3" />
              {depositCount} Pending Deposits
            </button>
          )}
          {(filterStatus !== 'all') && (
            <button onClick={() => setFilterStatus('all')} className="ml-auto flex items-center gap-1 text-charcoal/40 hover:text-coral px-2 py-1 rounded hover:bg-coral/5">
              <X className="w-3 h-3" /> Clear filter
            </button>
          )}
        </div>
      )}

      {/* Calendar toolbar */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-white border-b border-taupe/15 flex-wrap">
        <div className="flex items-center gap-1">
          <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-cream rounded-lg transition-colors">
            <ChevronLeft className="w-4 h-4 text-charcoal/50" />
          </button>
          <button
            onClick={() => { setCurrentDate(new Date()); }}
            className="px-2.5 py-1 text-xs font-body text-charcoal/50 hover:bg-cream rounded-lg transition-colors"
          >
            Today
          </button>
          <button onClick={() => navigate(1)} className="p-1.5 hover:bg-cream rounded-lg transition-colors">
            <ChevronRight className="w-4 h-4 text-charcoal/50" />
          </button>
          <h2 className="font-heading text-base font-semibold text-charcoal ml-2">
            {view === 'week'
              ? `${weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
              : view === 'day'
              ? currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
              : currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            }
          </h2>
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-charcoal/30" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search guest..."
              className="bg-cream border border-taupe/20 rounded-lg pl-6 pr-2 py-1 text-xs font-body text-charcoal/70 focus:outline-none focus:border-coral/40 w-40"
            />
          </div>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-cream border border-taupe/20 rounded-lg px-2 py-1 text-xs font-body text-charcoal/60 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_COLORS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>

          {providers.length > 0 && (
            <select
              value={filterProvider}
              onChange={e => setFilterProvider(e.target.value)}
              className="bg-cream border border-taupe/20 rounded-lg px-2 py-1 text-xs font-body text-charcoal/60 focus:outline-none"
            >
              <option value="all">All Providers</option>
              {providers.map(p => (
                <option key={p.id} value={p.email}>{p.full_name}</option>
              ))}
            </select>
          )}

          <div className="flex items-center gap-px bg-cream border border-taupe/20 rounded-lg overflow-hidden">
            {[['day', <List className="w-3.5 h-3.5" />], ['week', <CalendarDays className="w-3.5 h-3.5" />], ['month', <Grid3X3 className="w-3.5 h-3.5" />]].map(([v, icon]) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-2.5 py-1.5 transition-colors ${view === v ? 'bg-coral text-white' : 'text-charcoal/40 hover:text-charcoal/70'}`}
              >
                {icon}
              </button>
            ))}
          </div>

          <button onClick={() => setShowNewBooking(true)} className="flex items-center gap-1.5 bg-coral text-white px-3 py-1.5 rounded-lg text-xs font-body font-semibold hover:bg-coral/90 transition-colors">
            <Plus className="w-3.5 h-3.5" /> New Booking
          </button>
        </div>
      </div>

      {/* Calendar body */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-6 h-6 border-2 border-coral border-t-transparent rounded-full animate-spin" />
          </div>
        ) : view === 'week' ? (
          <div className="flex h-full min-h-[780px]">
            <TimeColumn />
            {weekDates.map((date, i) => {
              const dateStr = date.toISOString().split('T')[0];
              const isToday = dateStr === todayStr;
              const dayBookings = (bookingsByDate[dateStr] || []).sort((a, b) =>
                (a.scheduled_start_time || '').localeCompare(b.scheduled_start_time || '')
              );
              return (
                <div key={dateStr} className={`flex-1 border-r border-taupe/10 relative ${isToday ? 'bg-coral/2' : ''}`} style={{ minWidth: 90 }}>
                  {/* Day header */}
                  <div className={`h-10 border-b flex items-center justify-center gap-1.5 sticky top-0 z-10 ${isToday ? 'bg-coral/5 border-coral/20' : 'bg-white/95 border-taupe/10'}`}>
                    <span className="font-body text-[10px] text-charcoal/40 uppercase">{DAY_LABELS[date.getDay()]}</span>
                    <span className={`font-heading text-sm font-semibold ${isToday ? 'text-coral' : 'text-charcoal/70'}`}>{date.getDate()}</span>
                  </div>
                  {/* Hour rows */}
                  {HOUR_SLOTS.map(h => (
                    <div key={h} className="h-16 border-b border-taupe/6" />
                  ))}
                  {/* Booking blocks */}
                  {dayBookings.map(b => (
                    <BookingBlock key={b.id} booking={b} onClick={setSelectedBooking} />
                  ))}
                </div>
              );
            })}
          </div>
        ) : view === 'day' ? (
          <div className="flex h-full min-h-[780px]">
            <TimeColumn />
            <div className="flex-1 relative">
              <div className="h-10 border-b bg-white/95 flex items-center px-4">
                <span className="font-heading text-sm font-semibold text-charcoal">
                  {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
                {currentDate.toISOString().split('T')[0] === todayStr && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-coral text-white text-[10px] font-body">Today</span>
                )}
              </div>
              {HOUR_SLOTS.map(h => (
                <div key={h} className="h-16 border-b border-taupe/6" />
              ))}
              {(bookingsByDate[currentDate.toISOString().split('T')[0]] || []).map(b => (
                <BookingBlock key={b.id} booking={b} onClick={setSelectedBooking} />
              ))}
            </div>
          </div>
        ) : (
          // Month view
          <div className="p-4">
            <div className="grid grid-cols-7 mb-2">
              {DAY_LABELS.map(d => (
                <div key={d} className="text-center font-body text-xs text-charcoal/40 uppercase py-2">{d}</div>
              ))}
            </div>
            <MonthGrid currentDate={currentDate} bookingsByDate={bookingsByDate} onBookingClick={setSelectedBooking} />
          </div>
        )}
      </div>

      {/* Status legend */}
      <div className="px-4 py-2 bg-white border-t border-taupe/10 flex items-center gap-4 overflow-x-auto">
        {Object.entries(STATUS_COLORS).slice(0, 8).map(([k, v]) => (
          <div key={k} className="flex items-center gap-1.5 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: v.dot }} />
            <span className="font-body text-[10px] text-charcoal/40">{v.label}</span>
          </div>
        ))}
      </div>

      {selectedBooking && (
        <BookingDrawer
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdate={(id, updates) => {
            setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
            setSelectedBooking(prev => ({ ...prev, ...updates }));
          }}
          statusColors={STATUS_BADGE_STYLES}
        />
      )}

      {showNewBooking && (
        <QuickBookingModal
          onClose={() => setShowNewBooking(false)}
          onSuccess={() => { setShowNewBooking(false); loadData(); }}
        />
      )}
    </div>
  );
}

function MonthGrid({ currentDate, bookingsByDate, onBookingClick }) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = new Date().toISOString().split('T')[0];
  const cells = Array.from({ length: firstDay }, () => null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  return (
    <div className="grid grid-cols-7 gap-1">
      {cells.map((day, i) => {
        if (!day) return <div key={`e-${i}`} />;
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayBookings = bookingsByDate[dateStr] || [];
        const isToday = dateStr === todayStr;
        return (
          <div key={dateStr} className={`min-h-24 rounded-xl border p-2 ${isToday ? 'bg-coral/5 border-coral/20' : 'bg-white border-taupe/10'}`}>
            <p className={`font-heading text-sm font-semibold mb-1.5 ${isToday ? 'text-coral' : 'text-charcoal/60'}`}>{day}</p>
            {dayBookings.slice(0, 3).map(b => {
              const sc = STATUS_COLORS[b.status] || STATUS_COLORS.pending;
              return (
                <button
                  key={b.id}
                  onClick={() => onBookingClick(b)}
                  className="w-full text-left mb-0.5 rounded px-1.5 py-0.5 text-[10px] font-body truncate border"
                  style={{ background: sc.bg, borderColor: sc.border, color: sc.text, borderLeftWidth: 2, borderLeftColor: sc.dot }}
                >
                  {b.client_name}
                </button>
              );
            })}
            {dayBookings.length > 3 && (
              <p className="text-[10px] text-charcoal/30 font-body">+{dayBookings.length - 3} more</p>
            )}
          </div>
        );
      })}
    </div>
  );
}