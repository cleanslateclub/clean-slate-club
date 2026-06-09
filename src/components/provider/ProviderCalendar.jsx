import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus, Users, CheckSquare } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { base44 } from '@/api/base44Client';
import CalendarEvent from '@/components/provider/CalendarEvent';
import BookingDetailPopup from '@/components/provider/BookingDetailPopup';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const STATUS_STYLES = {
  confirmed: 'bg-sage/20 border-sage/40 text-charcoal/70',
  pending:   'bg-butter/30 border-butter/60 text-charcoal/70',
  completed: 'bg-taupe/20 border-taupe/40 text-charcoal/40',
  cancelled: 'bg-red-50 border-red-100 text-red-400',
};

export default function ProviderCalendar({
  timeBlocks    = [],
  bookings      = [],
  selectedWeek,
  onWeekChange,
  onTimeBlockUpdate,
  user,
  onQuickBook,
  onAddBooking,
  onStartVisit,
  onBookingClick,
  isAdmin = false,
}) {
  // Accepts both prop names — fixes the Book+ silent failure
  const handleBook = onAddBooking || onQuickBook;

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [hoveredBooking,  setHoveredBooking]  = useState(null);
  const [hoverPos,        setHoverPos]        = useState({ x: 0, y: 0 });
  const [providers,       setProviders]       = useState([]);
  const [filterEmail,     setFilterEmail]     = useState('all');
  const hoverTimer = useRef(null);

  // Fetch providers for dropdown
  useEffect(() => {
    base44.entities.Provider.list('-created_date', 100)
      .then(data => setProviders((data || []).filter(p => p.status !== 'archived')))
      .catch(() => {});
  }, []);

  // Week dates Mon–Sun
  const weekDates = useMemo(() => {
    const d    = new Date(selectedWeek);
    const day  = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const mon  = new Date(d.setDate(diff));
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(mon);
      date.setDate(date.getDate() + i);
      return date;
    });
  }, [selectedWeek]);

  // Provider filter — narrows which booking IDs are visible
  const visibleIds = useMemo(() => {
    if (filterEmail === 'all') return new Set(bookings.map(b => b.id));
    return new Set(
      bookings.filter(b => b.provider_email === filterEmail).map(b => b.id)
    );
  }, [bookings, filterEmail]);

  // Time blocks filtered by provider selection
  const filteredBlocks = useMemo(() =>
    filterEmail === 'all'
      ? timeBlocks
      : timeBlocks.filter(bl => !bl.booking_id || visibleIds.has(bl.booking_id)),
    [timeBlocks, visibleIds, filterEmail]
  );

  // Group blocks by date string
  const blocksByDay = useMemo(() => {
    const map = {};
    weekDates.forEach(d => { map[d.toISOString().split('T')[0]] = []; });
    filteredBlocks.forEach(bl => { if (map[bl.date]) map[bl.date].push(bl); });
    return map;
  }, [filteredBlocks, weekDates]);

  const handleDragEnd = ({ destination, draggableId }) => {
    if (!destination) return;
    const blockId = draggableId.split('-')[1];
    const block   = timeBlocks.find(b => b.id === blockId);
    if (!block) return;
    const newDate = weekDates[parseInt(destination.droppableId)]?.toISOString().split('T')[0];
    if (newDate && newDate !== block.date) onTimeBlockUpdate(blockId, { date: newDate });
  };

  // Hover card positioning — appears to the right, flips left if off-screen
  const showHover = (e, booking) => {
    if (!booking) return;
    clearTimeout(hoverTimer.current);
    const rect  = e.currentTarget.getBoundingClientRect();
    const cardW = 292;
    const cardH = 480;
    let x = rect.right + 10;
    let y = rect.top;
    if (x + cardW > window.innerWidth  - 8) x = rect.left - cardW - 10;
    if (y + cardH > window.innerHeight - 8) y = window.innerHeight - cardH - 8;
    if (y < 8) y = 8;
    setHoverPos({ x, y });
    setHoveredBooking(booking);
  };

  const hideHover = () => {
    hoverTimer.current = setTimeout(() => setHoveredBooking(null), 200);
  };

  const keepHover = () => clearTimeout(hoverTimer.current);

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-3xl border border-taupe/15 shadow-sm p-6 overflow-visible relative">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6 pb-5 border-b border-taupe/10 flex-wrap gap-3">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-charcoal mb-0.5">Calendar</h2>
          <p className="font-body text-sm text-charcoal/50 font-light">
            Week of {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            {' – '}
            {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">

          {/* Provider dropdown — admin only */}
          {isAdmin && providers.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-taupe/20 bg-cream">
              <Users className="w-4 h-4 text-charcoal/40 shrink-0" />
              <select
                value={filterEmail}
                onChange={e => setFilterEmail(e.target.value)}
                className="bg-transparent font-body text-sm text-charcoal focus:outline-none cursor-pointer"
              >
                <option value="all">All Providers</option>
                {providers.map(p => (
                  <option key={p.id} value={p.email}>{p.full_name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Week navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => { const d = new Date(selectedWeek); d.setDate(d.getDate() - 7); onWeekChange(d); }}
              className="p-2 hover:bg-cream rounded-lg transition-colors"
            >
              <ChevronLeft size={20} className="text-charcoal/40" />
            </button>
            <button
              onClick={() => onWeekChange(new Date())}
              className="px-3 py-1.5 text-xs font-body text-charcoal/50 hover:bg-cream rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => { const d = new Date(selectedWeek); d.setDate(d.getDate() + 7); onWeekChange(d); }}
              className="p-2 hover:bg-cream rounded-lg transition-colors"
            >
              <ChevronRight size={20} className="text-charcoal/40" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Calendar Grid ── */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-7 gap-1 bg-cream/50 rounded-2xl p-1">
          {weekDates.map((date, dayIdx) => {
            const dateStr  = date.toISOString().split('T')[0];
            const isToday  = new Date().toISOString().split('T')[0] === dateStr;
            const dayBlocks = (blocksByDay[dateStr] || [])
              .slice()
              .sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''));

            return (
              <div key={dateStr}
                className={`rounded-xl border p-2 min-h-[520px] transition-colors ${
                  isToday
                    ? 'bg-coral/5 border-coral/20'
                    : 'bg-white border-taupe/10'
                }`}
              >
                {/* Day label */}
                <div className="mb-2 pb-2 border-b border-taupe/10">
                  <p className="font-body text-[10px] font-light text-charcoal/50 uppercase tracking-widest">
                    {DAY_LABELS[dayIdx]}
                  </p>
                  <p className={`font-heading text-lg font-semibold leading-tight ${isToday ? 'text-coral' : 'text-charcoal'}`}>
                    {date.getDate()}
                  </p>
                </div>

                {/* Book+ button — now actually fires because prop name is resolved above */}
                <button
                  onClick={() => handleBook?.(dateStr, '10:00 AM')}
                  className="mb-2 w-full py-2 rounded-lg border-2 border-dashed border-coral/50 bg-coral/5 text-coral text-xs font-body font-bold hover:border-coral hover:bg-coral/10 active:scale-95 transition-all flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Book+
                </button>

                {/* Droppable events */}
                <Droppable droppableId={dayIdx.toString()}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-1.5 min-h-[400px] rounded-lg transition-colors ${
                        snapshot.isDraggingOver ? 'bg-coral/5 p-1' : ''
                      }`}
                    >
                      {dayBlocks.map((block, idx) => {
                        const booking = bookings.find(b => b.id === block.booking_id);
                        return (
                          <Draggable key={block.id} draggableId={`block-${block.id}`} index={idx}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={snapshot.isDragging ? 'opacity-60' : ''}
                                onMouseEnter={e => booking && showHover(e, booking)}
                                onMouseLeave={hideHover}
                              >
                                <CalendarEvent
                                  block={block}
                                  booking={booking}
                                  onUpdate={onTimeBlockUpdate}
                                  onClick={() => {
                                    if (booking) {
                                      setSelectedBooking(booking);
                                      onBookingClick?.(booking.id);
                                    }
                                  }}
                                  onStartVisit={
                                    onStartVisit && booking
                                      ? () => onStartVisit(booking)
                                      : null
                                  }
                                />
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      <p className="text-xs font-body text-charcoal/25 font-light mt-4 text-center">
        Drag appointments to reschedule · Hover over a booking for details
      </p>

      {/* Click-to-open detail popup */}
      {selectedBooking && (
        <BookingDetailPopup
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}

      {/* ── Hover Card (20 data points) ── */}
      {hoveredBooking && (() => {
        const b   = hoveredBooking;
        const cfg = SERVICE_CONFIG[b.service_category] || {};
        const ia  = b.intake_answers || {};
        const addonLabels = (b.addons || [])
          .map(id => cfg.addons?.find(a => a.id === id)?.label)
          .filter(Boolean);

        const rows = [
          ['📅', 'Date',
            b.scheduled_date
              ? new Date(b.scheduled_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
              : null],
          ['🕐', 'Time',
            b.scheduled_start_time
              ? `${b.scheduled_start_time}${b.scheduled_end_time ? ` – ${b.scheduled_end_time}` : ''}`
              : null],
          ['🧹', 'Service',   cfg.label || b.service_category],
          ['📞', 'Phone',     b.client_phone],
          ['✉️', 'Email',     b.client_email],
          ['📍', 'Address',   b.client_address],
          ['💰', 'Estimate',
            b.estimated_price_low
              ? `$${b.estimated_price_low} – $${b.estimated_price_high}`
              : null],
          ['💳', 'Deposit',   b.payment_intent_id ? '✓ Paid / Sent' : 'Not collected'],
          ['👤', 'Provider',  b.provider_email || 'Unassigned'],
          ['🛏',  'Beds',     ia.num_bedrooms],
          ['🚿', 'Baths',     ia.num_bathrooms],
          ['🔑', 'Access',    ia.access_method?.replace(/_/g, ' ')],
          ['🔐', 'Code',      ia.access_code],
          ['🐾', 'Pets',      ia.has_pets    ? (ia.pet_details    || 'Yes') : 'None'],
          ['⚠️', 'Allergies', ia.has_allergies ? (ia.allergy_details || 'Yes') : 'None'],
          ['➕', 'Add-ons',   addonLabels.length ? addonLabels.join(', ') : 'None'],
          ['📝', 'Notes',     b.special_notes || ia.special_notes],
          ['🗒',  'Admin',    b.admin_notes],
          ['📆', 'Booked',
            b.created_date
              ? new Date(b.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : null],
        ].filter(([,, v]) => v && String(v).trim() && String(v).trim() !== 'undefined');

        return (
          <div
            style={{ position: 'fixed', left: hoverPos.x, top: hoverPos.y, zIndex: 9999, width: 292 }}
            className="bg-warm-white border border-taupe/20 rounded-2xl shadow-2xl overflow-hidden"
            onMouseEnter={keepHover}
            onMouseLeave={() => setHoveredBooking(null)}
          >
            {/* Card header */}
            <div className="px-4 pt-4 pb-3 border-b border-taupe/10">
              <p className="font-heading text-sm font-semibold text-charcoal leading-tight">
                {b.client_name}
              </p>
              <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border font-body font-light mt-1 ${
                STATUS_STYLES[b.status] || 'bg-taupe/10 border-taupe/30 text-charcoal/50'
              }`}>
                {b.status}
              </span>
            </div>

            {/* Data rows — scrollable if long */}
            <div className="px-4 py-3 space-y-1.5 max-h-64 overflow-y-auto">
              {rows.map(([icon, label, value]) => (
                <div key={label} className="flex items-start gap-1.5 text-xs font-body">
                  <span className="w-4 shrink-0 text-center leading-tight">{icon}</span>
                  <span className="text-charcoal/40 shrink-0 w-[4.5rem] leading-tight">{label}</span>
                  <span className="text-charcoal font-light leading-tight break-words flex-1">
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>

            {/* COMPLETE VISIT — big, obvious, can't miss it */}
            {onStartVisit && !['completed', 'cancelled', 'archived'].includes(b.status) && (
              <div className="px-4 pb-4">
                <button
                  onClick={() => { onStartVisit(b); setHoveredBooking(null); }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-coral text-white font-body text-sm font-bold shadow-lg ring-2 ring-coral/25 hover:bg-coral/85 active:scale-[0.98] transition-all"
                >
                  <CheckSquare className="w-4 h-4" />
                  ✅ COMPLETE VISIT NOW
                </button>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
