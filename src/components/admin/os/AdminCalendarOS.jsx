import React, { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { ChevronLeft, ChevronRight, Plus, Search, CalendarDays, List, Grid3X3, AlertTriangle, DollarSign, X } from 'lucide-react';
import BookingDrawer from '@/components/admin/os/BookingDrawer';
import CalendarNewBookingModal from '@/components/admin/os/CalendarNewBookingModal';

const STATUS_COLORS = {
  pending:          { bg: '#fff0ed', border: '#EB9486', text: '#c0392b', label: 'New Request', dot: '#EB9486' },
  needs_review:     { bg: '#fff0ed', border: '#c0392b', text: '#c0392b', label: 'Needs Review', dot: '#c0392b' },
  draft:            { bg: '#fffbe6', border: '#d4a017', text: '#7a5c00', label: 'Draft', dot: '#F3DE8A' },
  approved:         { bg: '#edfff4', border: '#27ae60', text: '#1a6b3a', label: 'Approved', dot: '#27ae60' },
  confirmed:        { bg: '#edfff4', border: '#1e8449', text: '#145a32', label: 'Confirmed', dot: '#1e8449' },
  provider_assigned:{ bg: '#f0f2ff', border: '#5c6bc0', text: '#3949ab', label: 'Assigned', dot: '#5c6bc0' },
  in_progress:      { bg: '#fff8ec', border: '#e67e22', text: '#784212', label: 'In Progress', dot: '#e67e22' },
  completed:        { bg: '#edfff4', border: '#27ae60', text: '#196f3d', label: 'Completed', dot: '#27ae60' },
  cancelled:        { bg: '#f5f5f5', border: '#bbb', text: '#666', label: 'Cancelled', dot: '#bbb' },
  no_show:          { bg: '#fff0f0', border: '#e74c3c', text: '#c0392b', label: 'No Show', dot: '#e74c3c' },
  consult:          { bg: '#fffbe6', border: '#d4a017', text: '#7a5c00', label: 'Consult', dot: '#d4a017' },
  rescheduled:      { bg: '#f0f2ff', border: '#5c6bc0', text: '#3949ab', label: 'Rescheduled', dot: '#5c6bc0' },
};

const HOUR_SLOTS = Array.from({ length: 13 }, (_, i) => i + 7); // 7am–7pm

function TimeColumn() {
  return (
    <div className="w-16 shrink-0 border-r border-gray-200 bg-white">
      <div className="h-12 border-b border-gray-100" />
      {HOUR_SLOTS.map(h => (
        <div key={h} className="h-16 border-b border-gray-100 flex items-start justify-end pr-2 pt-1">
          <span className="font-body text-xs font-bold text-gray-600">
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

function minutesToTimeStr(mins) {
  const h = Math.floor(mins / 60); const m = mins % 60;
  const p = h >= 12 ? 'PM' : 'AM'; const dh = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${dh}:${m.toString().padStart(2,'0')} ${p}`;
}

function BookingBlock({ booking, onClick }) {
  const sc = STATUS_COLORS[booking.status] || STATUS_COLORS.pending;
  const totalMins = parseTimeToMinutes(booking.scheduled_start_time);
  const startH = Math.floor(totalMins / 60);
  const startM = totalMins % 60;
  const top = (startH - 7) * 64 + (startM / 60) * 64 + 12;
  const dur = Math.max((booking.total_duration_minutes || 120) / 60, 0.5);
  const height = Math.max(dur * 64 - 4, 28);

  return (
    <div
      className="absolute left-1 right-1 rounded-lg cursor-pointer border-l-4 overflow-hidden hover:shadow-lg transition-shadow z-10"
      style={{ top, height, background: sc.bg, borderColor: sc.border, borderLeftColor: sc.dot, borderTopWidth: 1, borderRightWidth: 1, borderBottomWidth: 1 }}
      onClick={e => { e.stopPropagation(); onClick(booking); }}
    >
      <div className="px-2 py-1">
        <p className="font-body text-xs font-bold leading-tight truncate" style={{ color: sc.text }}>
          {booking.client_name}
        </p>
        {height > 32 && (
          <p className="font-body text-[11px] truncate mt-0.5" style={{ color: sc.text, opacity: 0.85 }}>
            {booking.service_label || booking.service_category?.replace(/_/g, ' ')}
          </p>
        )}
        {height > 50 && (
          <p className="font-body text-[10px] mt-0.5" style={{ color: sc.text, opacity: 0.7 }}>
            {booking.scheduled_start_time}
          </p>
        )}
      </div>
    </div>
  );
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function DayColumn({ date, dateStr, isToday, dayBookings, onBookingClick, onSlotClick }) {
  const handleSlotClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relY = e.clientY - rect.top - 12; // offset for header
    const totalMins = Math.max(0, Math.round((relY / 64) * 60) + 7 * 60);
    const snapped = Math.round(totalMins / 30) * 30;
    onSlotClick(dateStr, minutesToTimeStr(snapped));
  };

  return (
    <div
      className={`flex-1 border-r border-gray-100 relative ${isToday ? 'bg-coral/3' : 'bg-white'}`}
      style={{ minWidth: 90, cursor: 'crosshair' }}
      onClick={handleSlotClick}
    >
      <div className={`h-12 border-b flex items-center justify-center gap-1.5 sticky top-0 z-10 ${isToday ? 'bg-coral/10 border-coral/20' : 'bg-white border-gray-100'}`}>
        <span className="font-body text-xs font-bold text-gray-500 uppercase">{DAY_LABELS[date.getDay()]}</span>
        <span className={`font-heading text-sm font-bold ${isToday ? 'text-coral' : 'text-gray-800'}`}>{date.getDate()}</span>
      </div>
      {HOUR_SLOTS.map(h => (
        <div key={h} className="h-16 border-b border-gray-100 hover:bg-blue-50/30 transition-colors" />
      ))}
      {dayBookings.map(b => (
        <BookingBlock key={b.id} booking={b} onClick={onBookingClick} />
      ))}
    </div>
  );
}

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
  const [newBooking, setNewBooking] = useState(null); // { date, time }

  useEffect(() => {
    if (sidebarItem?.key === 'day_view') setView('day');
    else if (sidebarItem?.key === 'week_view') setView('week');
    else if (sidebarItem?.key === 'month_view') setView('month');
    else if (sidebarItem?.key === 'today') { setView('day'); setCurrentDate(new Date()); }
  }, [sidebarItem]);

  const loadData = () => {
    Promise.all([
      base44.entities.Booking.list('-scheduled_date', 300),
      base44.entities.Provider.filter({ status: 'active' }),
    ]).then(([b, p]) => {
      setBookings(b || []);
      setProviders(p || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

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
  const newCount = bookings.filter(b => b.status === 'pending').length;
  const reviewCount = bookings.filter(b => b.status === 'needs_review').length;

  const handleSlotClick = (date, time) => {
    setNewBooking({ date, time });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Attention strip */}
      {(newCount > 0 || reviewCount > 0) && (
        <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-gray-200 text-xs font-body">
          {newCount > 0 && (
            <button onClick={() => setFilterStatus('pending')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-300 text-red-700 font-semibold hover:bg-red-100 transition-colors">
              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">{newCount}</span>
              New Requests
            </button>
          )}
          {reviewCount > 0 && (
            <button onClick={() => setFilterStatus('needs_review')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 font-semibold hover:bg-amber-100 transition-colors">
              <AlertTriangle className="w-3.5 h-3.5" />
              {reviewCount} Needs Review
            </button>
          )}
          {filterStatus !== 'all' && (
            <button onClick={() => setFilterStatus('all')} className="ml-auto flex items-center gap-1 text-gray-500 hover:text-coral px-2 py-1 rounded hover:bg-red-50 transition-colors font-semibold">
              <X className="w-3.5 h-3.5" /> Clear filter
            </button>
          )}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-gray-200 flex-wrap">
        <div className="flex items-center gap-1">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-4 h-4 text-gray-700" />
          </button>
          <button onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 text-sm font-body font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            Today
          </button>
          <button onClick={() => navigate(1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronRight className="w-4 h-4 text-gray-700" />
          </button>
          <h2 className="font-heading text-base font-bold text-gray-900 ml-2">
            {view === 'week'
              ? `${weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
              : view === 'day'
              ? currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
              : currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            }
          </h2>
        </div>

        <div className="flex items-center gap-2 ml-auto flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search guest..."
              className="bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm font-body text-gray-800 placeholder-gray-400 focus:outline-none focus:border-coral w-44"
            />
          </div>

          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-body text-gray-700 focus:outline-none focus:border-coral">
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_COLORS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>

          {providers.length > 0 && (
            <select value={filterProvider} onChange={e => setFilterProvider(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-body text-gray-700 focus:outline-none focus:border-coral">
              <option value="all">All Providers</option>
              {providers.map(p => <option key={p.id} value={p.email}>{p.full_name}</option>)}
            </select>
          )}

          <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
            {[['day', <List className="w-4 h-4" />], ['week', <CalendarDays className="w-4 h-4" />], ['month', <Grid3X3 className="w-4 h-4" />]].map(([v, icon]) => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-2 transition-colors ${view === v ? 'bg-coral text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'}`}>
                {icon}
              </button>
            ))}
          </div>

          <button onClick={() => setNewBooking({ date: currentDate.toISOString().split('T')[0], time: '10:00 AM' })}
            className="flex items-center gap-1.5 bg-coral text-white px-4 py-2 rounded-lg text-sm font-body font-bold hover:bg-coral/90 transition-colors">
            <Plus className="w-4 h-4" /> New Booking
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
          <div className="flex h-full min-h-[840px]">
            <TimeColumn />
            {weekDates.map(date => {
              const dateStr = date.toISOString().split('T')[0];
              const isToday = dateStr === todayStr;
              const dayBookings = (bookingsByDate[dateStr] || []).sort((a, b) =>
                (a.scheduled_start_time || '').localeCompare(b.scheduled_start_time || '')
              );
              return (
                <DayColumn
                  key={dateStr}
                  date={date}
                  dateStr={dateStr}
                  isToday={isToday}
                  dayBookings={dayBookings}
                  onBookingClick={setSelectedBooking}
                  onSlotClick={handleSlotClick}
                />
              );
            })}
          </div>
        ) : view === 'day' ? (
          <div className="flex h-full min-h-[840px]">
            <TimeColumn />
            <div className="flex-1 relative bg-white" style={{ cursor: 'crosshair' }}
              onClick={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                const relY = e.clientY - rect.top - 12;
                const totalMins = Math.max(0, Math.round((relY / 64) * 60) + 7 * 60);
                const snapped = Math.round(totalMins / 30) * 30;
                handleSlotClick(currentDate.toISOString().split('T')[0], minutesToTimeStr(snapped));
              }}>
              <div className="h-12 border-b bg-white flex items-center px-4 sticky top-0 z-10">
                <span className="font-heading text-sm font-bold text-gray-900">
                  {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
                {currentDate.toISOString().split('T')[0] === todayStr && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-coral text-white text-xs font-body font-semibold">Today</span>
                )}
              </div>
              {HOUR_SLOTS.map(h => <div key={h} className="h-16 border-b border-gray-100 hover:bg-blue-50/30 transition-colors" />)}
              {(bookingsByDate[currentDate.toISOString().split('T')[0]] || []).map(b => (
                <BookingBlock key={b.id} booking={b} onClick={setSelectedBooking} />
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="grid grid-cols-7 mb-1">
              {DAY_LABELS.map(d => (
                <div key={d} className="text-center font-body text-xs font-bold text-gray-600 uppercase py-2">{d}</div>
              ))}
            </div>
            <MonthGrid currentDate={currentDate} bookingsByDate={bookingsByDate}
              onBookingClick={setSelectedBooking} onDayClick={date => handleSlotClick(date, '10:00 AM')} />
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="px-4 py-2 bg-white border-t border-gray-200 flex items-center gap-4 overflow-x-auto shrink-0">
        <span className="font-body text-xs font-semibold text-gray-500 shrink-0">Click any time slot to create a booking</span>
        <div className="w-px h-4 bg-gray-200" />
        {Object.entries(STATUS_COLORS).slice(0, 7).map(([k, v]) => (
          <div key={k} className="flex items-center gap-1.5 shrink-0">
            <div className="w-3 h-3 rounded-full" style={{ background: v.dot }} />
            <span className="font-body text-xs font-semibold text-gray-600">{v.label}</span>
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
          statusColors={{}}
        />
      )}

      {newBooking && (
        <CalendarNewBookingModal
          defaultDate={newBooking.date}
          defaultTime={newBooking.time}
          onClose={() => setNewBooking(null)}
          onSuccess={(booking) => { setNewBooking(null); loadData(); }}
        />
      )}
    </div>
  );
}

function MonthGrid({ currentDate, bookingsByDate, onBookingClick, onDayClick }) {
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
          <div key={dateStr}
            className={`min-h-24 rounded-xl border-2 p-2 cursor-pointer transition-all hover:border-coral/40 ${isToday ? 'bg-coral/5 border-coral/30' : 'bg-white border-gray-100 hover:bg-gray-50'}`}
            onClick={() => onDayClick(dateStr)}>
            <p className={`font-heading text-sm font-bold mb-1.5 ${isToday ? 'text-coral' : 'text-gray-800'}`}>{day}</p>
            {dayBookings.slice(0, 3).map(b => {
              const sc = STATUS_COLORS[b.status] || STATUS_COLORS.pending;
              return (
                <button key={b.id} onClick={e => { e.stopPropagation(); onBookingClick(b); }}
                  className="w-full text-left mb-0.5 rounded px-1.5 py-0.5 text-[11px] font-body font-semibold truncate border-l-2"
                  style={{ background: sc.bg, borderColor: sc.dot, color: sc.text }}>
                  {b.client_name}
                </button>
              );
            })}
            {dayBookings.length > 3 && (
              <p className="text-[11px] text-gray-600 font-body font-semibold">+{dayBookings.length - 3} more</p>
            )}
          </div>
        );
      })}
    </div>
  );
}