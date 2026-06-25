import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { ChevronLeft, ChevronRight, Plus, Search, CalendarDays, List, Grid3X3, AlertTriangle, X, Coffee, Lock, Pencil, Check, Trash2, BanIcon } from 'lucide-react';
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
  rescheduled:      { bg: '#f0f2ff', border: '#5c6bc0', text: '#3949ab', label: 'Rescheduled', dot: '#5c6bc0' },
};

const HOUR_SLOTS = Array.from({ length: 13 }, (_, i) => i + 7); // 7am–7pm
const SLOT_HEIGHT = 64; // px per hour
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const p = h >= 12 ? 'PM' : 'AM';
  const dh = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${dh}:${m.toString().padStart(2, '0')} ${p}`;
}

function minutesToTopPx(mins) {
  return (mins - 7 * 60) / 60 * SLOT_HEIGHT + 48; // 48 = header height
}

// ── BLOCK TIME MODAL ──────────────────────────────────────────────────────────
const BLOCK_TYPES = [
  { key: 'lunch', label: 'Lunch Break', color: '#EFB988', defaultDur: 60 },
  { key: 'personal', label: 'Personal Time', color: '#B58A90', defaultDur: 60 },
  { key: 'prep', label: 'Prep / Wrap', color: '#CAE7B9', defaultDur: 30 },
  { key: 'manual_block', label: 'Admin Hold', color: '#7E7F9A', defaultDur: 60 },
  { key: 'provider_unavailable', label: 'Provider Unavailable', color: '#bbb', defaultDur: 120 },
];

const TIME_OPTS = Array.from({ length: 26 }, (_, i) => {
  const mins = 7 * 60 + i * 30;
  return minutesToTimeStr(mins);
});

function BlockTimeModal({ defaultDate, defaultTime, defaultBlockType, defaultAllDay, providers, onClose, onCreate }) {
  const [form, setForm] = useState({
    date: defaultDate || '',
    start_time: defaultTime || '12:00 PM',
    duration: BLOCK_TYPES.find(t => t.key === defaultBlockType)?.defaultDur || 60,
    block_type: defaultBlockType || 'lunch',
    all_day: defaultAllDay || false,
    label: '',
    provider_id: '',
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const selectedType = BLOCK_TYPES.find(t => t.key === form.block_type) || BLOCK_TYPES[0];

  const handleCreate = async () => {
    setSaving(true);
    const block = {
      date: form.date,
      block_type: form.block_type,
      label: form.label || selectedType.label,
      provider_id: form.provider_id || null,
      status: 'active',
      created_by_role: 'admin',
      all_day: form.all_day,
      start_time: form.all_day ? '7:00 AM' : form.start_time,
      end_time: form.all_day ? '7:00 PM' : minutesToTimeStr(parseTimeToMinutes(form.start_time) + parseInt(form.duration)),
    };
    const created = await base44.entities.TimeBlock.create(block);
    onCreate(created);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-taupe/15 shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-base font-semibold text-gray-900 flex items-center gap-2">
            <Coffee className="w-4 h-4 text-coral" /> Block Time
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-400" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="font-body text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1 block">Type</label>
            <div className="grid grid-cols-2 gap-1.5">
              {BLOCK_TYPES.map(t => (
                <button key={t.key} onClick={() => { set('block_type', t.key); set('duration', t.defaultDur); set('label', ''); }}
                  className={`px-2.5 py-2 rounded-lg text-xs font-body font-semibold border-2 text-left transition-all ${form.block_type === t.key ? 'border-coral text-coral bg-coral/5' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  <span className="w-2.5 h-2.5 rounded-full inline-block mr-1.5" style={{ background: t.color }} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="font-body text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1 block">Label (optional)</label>
            <input value={form.label} onChange={e => set('label', e.target.value)} placeholder={selectedType.label}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:border-coral" />
          </div>
          {/* All-day toggle */}
          <label className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer">
            <div>
              <p className="font-body text-sm font-semibold text-gray-800">All-Day Block</p>
              <p className="font-body text-xs text-gray-500">Marks entire day unavailable — nothing can be booked</p>
            </div>
            <div onClick={() => set('all_day', !form.all_day)}
              className={`w-10 h-5 rounded-full transition-all relative cursor-pointer ${form.all_day ? 'bg-coral' : 'bg-gray-300'}`}>
              <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all shadow ${form.all_day ? 'left-5' : 'left-0.5'}`} />
            </div>
          </label>

          {!form.all_day && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-body text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1 block">Date</label>
                <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:border-coral" />
              </div>
              <div>
                <label className="font-body text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1 block">Start Time</label>
                <select value={form.start_time} onChange={e => set('start_time', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:border-coral">
                  {TIME_OPTS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          )}
          {form.all_day && (
            <div>
              <label className="font-body text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1 block">Date</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:border-coral" />
            </div>
          )}
          {!form.all_day && (
            <div>
              <label className="font-body text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1 block">Duration</label>
              <select value={form.duration} onChange={e => set('duration', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:border-coral">
                {[15, 30, 45, 60, 90, 120, 180, 240].map(d => <option key={d} value={d}>{d} min</option>)}
              </select>
            </div>
          )}
          {providers.length > 0 && (
            <div>
              <label className="font-body text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1 block">Provider (optional)</label>
              <select value={form.provider_id} onChange={e => set('provider_id', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:border-coral">
                <option value="">All / Admin</option>
                {providers.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
              </select>
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={handleCreate} disabled={saving || !form.date}
            className="flex-1 py-2.5 bg-coral text-white rounded-xl text-sm font-body font-bold hover:bg-coral/90 disabled:opacity-50">
            {saving ? 'Saving...' : 'Block Time'}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-body text-gray-500 hover:bg-gray-50">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── BOOKING BLOCK with travel buffers + drag ──────────────────────────────────
function BookingBlock({ booking, onDragEnd, onClick, onDelete, travelBuffer }) {
  const [hovered, setHovered] = useState(false);
  const sc = STATUS_COLORS[booking.status] || STATUS_COLORS.pending;
  const startMins = parseTimeToMinutes(booking.scheduled_start_time);
  const dur = booking.total_duration_minutes || 120;
  const isConsult = booking.service_category === 'consult' || booking.service_label?.toLowerCase().includes('consult');
  const buffer = isConsult ? 0 : (travelBuffer ?? (booking.travel_buffer_minutes ?? 20));
  const top = minutesToTopPx(startMins);
  const height = Math.max((dur / 60) * SLOT_HEIGHT - 2, 28);
  const bufferPx = (buffer / 60) * SLOT_HEIGHT;
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartMins = useRef(startMins);
  const blockRef = useRef(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  const handleMouseDown = (e) => {
    if (e.target.closest('[data-no-drag]')) return;
    e.preventDefault();
    isDragging.current = true;
    dragStartY.current = e.clientY;
    dragStartMins.current = startMins;
    setDragging(true);

    const onMove = (me) => {
      if (!isDragging.current) return;
      const deltaY = me.clientY - dragStartY.current;
      const deltaMins = Math.round((deltaY / SLOT_HEIGHT) * 60 / 15) * 15;
      setDragOffset(deltaMins);
    };
    const onUp = (me) => {
      isDragging.current = false;
      setDragging(false);
      const deltaY = me.clientY - dragStartY.current;
      const deltaMins = Math.round((deltaY / SLOT_HEIGHT) * 60 / 15) * 15;
      if (Math.abs(deltaMins) >= 15) {
        const newStartMins = Math.max(7 * 60, Math.min(19 * 60, dragStartMins.current + deltaMins));
        onDragEnd(booking, newStartMins);
      }
      setDragOffset(0);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const effectiveTop = top + (dragging ? (dragOffset / 60) * SLOT_HEIGHT : 0);
  const endMins = startMins + dur;
  const endStr = minutesToTimeStr(endMins);

  return (
    <>
      {/* Travel buffer before */}
      {buffer > 0 && !dragging && (
        <div className="absolute left-0.5 right-0.5 rounded-sm z-[5] pointer-events-none"
          style={{
            top: effectiveTop - bufferPx,
            height: bufferPx,
            background: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(235,148,134,0.15) 3px, rgba(235,148,134,0.15) 6px)',
            borderTop: '1px dashed rgba(235,148,134,0.4)',
            borderLeft: '1px dashed rgba(235,148,134,0.3)',
            borderRight: '1px dashed rgba(235,148,134,0.3)',
          }}>
          <span className="absolute bottom-0.5 left-1 font-body text-[8px] font-bold text-coral/60 uppercase tracking-wider">{buffer}m travel</span>
        </div>
      )}

      {/* Main booking block */}
      <div
        ref={blockRef}
        className={`absolute left-1 right-1 rounded-lg border-l-4 overflow-hidden z-10 transition-shadow select-none ${dragging ? 'shadow-2xl opacity-90 cursor-grabbing z-30' : 'cursor-grab hover:shadow-lg'}`}
        style={{
          top: effectiveTop,
          height,
          background: sc.bg,
          borderColor: sc.border,
          borderLeftColor: sc.dot,
          borderTopWidth: 1,
          borderRightWidth: 1,
          borderBottomWidth: 1,
        }}
        onMouseDown={handleMouseDown}
        onClick={e => { if (!dragging) { e.stopPropagation(); onClick(booking); } }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="px-2 py-1 h-full flex flex-col">
          {/* Name + status dot + delete */}
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: sc.dot }} />
            <p className="font-body text-xs font-bold leading-tight truncate flex-1" style={{ color: sc.text }}>
              {booking.client_name}
            </p>
            {hovered && onDelete && (
              <button
                data-no-drag="true"
                onClick={e => { e.stopPropagation(); onDelete(booking.id); }}
                className="shrink-0 w-4 h-4 rounded flex items-center justify-center bg-black/10 hover:bg-red-500 hover:text-white transition-colors"
                style={{ color: sc.text }}
              >
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
          {/* Service */}
          {height > 36 && (
            <p className="font-body text-[10px] truncate mt-0.5" style={{ color: sc.text, opacity: 0.85 }}>
              {booking.service_label || booking.service_category?.replace(/_/g, ' ')}
            </p>
          )}
          {/* Time */}
          {height > 52 && (
            <p className="font-body text-[10px] mt-0.5 font-semibold" style={{ color: sc.text, opacity: 0.75 }}>
              {booking.scheduled_start_time} – {endStr}
            </p>
          )}
          {/* Provider + address */}
          {height > 72 && (
            <p className="font-body text-[10px] mt-0.5 truncate" style={{ color: sc.text, opacity: 0.65 }}>
              {booking.provider_name ? `👤 ${booking.provider_name}` : '⚠️ Unassigned'}
            </p>
          )}
          {height > 92 && booking.client_address && (
            <p className="font-body text-[10px] mt-0.5 truncate" style={{ color: sc.text, opacity: 0.55 }}>
              📍 {booking.client_address.split(',')[0]}
            </p>
          )}
          {/* Price */}
          {height > 112 && (booking.final_price || booking.estimated_price_low) && (
            <p className="font-body text-[10px] mt-auto font-bold" style={{ color: sc.text, opacity: 0.8 }}>
              {booking.final_price ? `$${booking.final_price}` : `$${booking.estimated_price_low}–$${booking.estimated_price_high}`}
            </p>
          )}
        </div>
        {/* Drag handle indicator */}
        <div className="absolute bottom-1 right-1 opacity-20 pointer-events-none">
          <div className="w-3 h-0.5 bg-current rounded mb-0.5" />
          <div className="w-2 h-0.5 bg-current rounded" />
        </div>
      </div>

      {/* Travel buffer after */}
      {buffer > 0 && !dragging && (
        <div className="absolute left-0.5 right-0.5 rounded-sm z-[5] pointer-events-none"
          style={{
            top: effectiveTop + height,
            height: bufferPx,
            background: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(235,148,134,0.15) 3px, rgba(235,148,134,0.15) 6px)',
            borderBottom: '1px dashed rgba(235,148,134,0.4)',
            borderLeft: '1px dashed rgba(235,148,134,0.3)',
            borderRight: '1px dashed rgba(235,148,134,0.3)',
          }}>
          <span className="absolute top-0.5 left-1 font-body text-[8px] font-bold text-coral/60 uppercase tracking-wider">{buffer}m travel</span>
        </div>
      )}
    </>
  );
}

// ── TIME BLOCK (lunch/personal) ───────────────────────────────────────────────
function TimeBlockDisplay({ block, onDelete }) {
  const t = BLOCK_TYPES.find(t => t.key === block.block_type) || { color: '#ccc', label: 'Block' };
  const [hovered, setHovered] = useState(false);

  // All-day blocks are rendered in the day header, not here
  if (block.all_day) return null;

  const startMins = parseTimeToMinutes(block.start_time);
  const endMins = parseTimeToMinutes(block.end_time);
  const dur = endMins - startMins;
  const top = minutesToTopPx(startMins);
  const height = Math.max((dur / 60) * SLOT_HEIGHT - 2, 20);

  return (
    <div className="absolute left-0 right-0 z-[8]"
      style={{ top, height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="mx-0.5 h-full rounded-lg border-2 border-dashed flex items-center justify-between px-2"
        style={{ borderColor: t.color + '88', background: t.color + '18' }}>
        <span className="font-body text-[10px] font-bold truncate" style={{ color: t.color }}>
          {block.label || t.label}
        </span>
        {hovered && (
          <button
            data-no-drag="true"
            onClick={e => { e.stopPropagation(); onDelete(block.id); }}
            className="shrink-0 w-5 h-5 rounded flex items-center justify-center hover:bg-red-100 transition-colors"
            style={{ color: t.color }}
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

// ── ALL-DAY BLOCK BANNER ───────────────────────────────────────────────────────
function AllDayBlockBanner({ block, onDelete }) {
  const t = BLOCK_TYPES.find(t => t.key === block.block_type) || { color: '#bbb', label: 'Unavailable' };
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="mx-0.5 mb-0.5 rounded px-2 py-0.5 flex items-center justify-between gap-1 border border-dashed"
      style={{ borderColor: t.color + '99', background: t.color + '22' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="font-body text-[9px] font-bold truncate" style={{ color: t.color }}>
        🚫 {block.label || t.label}
      </span>
      {hovered && (
        <button
          onClick={e => { e.stopPropagation(); onDelete(block.id); }}
          className="shrink-0 hover:text-red-500 transition-colors"
          style={{ color: t.color }}
        >
          <Trash2 className="w-2.5 h-2.5" />
        </button>
      )}
    </div>
  );
}

// ── TIME COLUMN ───────────────────────────────────────────────────────────────
function TimeColumn() {
  return (
    <div className="w-16 shrink-0 border-r border-gray-300" style={{ background: '#f8f4f0' }}>
      <div className="h-12 border-b border-gray-300" />
      {HOUR_SLOTS.map(h => (
        <div key={h} className="h-16 border-b border-gray-300 flex items-start justify-end pr-2 pt-1">
          <span className="font-body text-xs font-bold text-gray-700">
            {h === 12 ? '12pm' : h < 12 ? `${h}am` : `${h - 12}pm`}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── DAY COLUMN ────────────────────────────────────────────────────────────────
function DayColumn({ date, dateStr, isToday, dayBookings, dayBlocks, onBookingClick, onSlotClick, onBlockClick, onDeleteBlock, onDeleteBooking, onDragEnd, travelBuffer }) {
  const [slotMenu, setSlotMenu] = useState(null); // { time, x, y }
  const allDayBlocks = (dayBlocks || []).filter(b => b.all_day);

  const handleSlotClick = (e) => {
    if (e.target.closest('[data-no-drag]')) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relY = e.clientY - rect.top - 48;
    const totalMins = Math.max(7 * 60, Math.round((relY / SLOT_HEIGHT) * 60) + 7 * 60);
    const snapped = Math.round(totalMins / 30) * 30;
    const time = minutesToTimeStr(snapped);
    setSlotMenu({ time, x: e.clientX, y: e.clientY });
  };

  return (
    <div
      className={`flex-1 border-r border-gray-300 relative ${isToday ? 'bg-coral/[0.04]' : 'bg-white'}`}
      style={{ minWidth: 90, cursor: 'crosshair' }}
      onClick={handleSlotClick}
    >
      <div className={`border-b sticky top-0 z-20 ${isToday ? 'bg-coral/15 border-coral/40' : 'bg-cream/60 border-gray-300'}`}>
        <div className="h-10 flex items-center justify-center gap-1.5">
          <span className="font-body text-xs font-bold text-gray-500 uppercase">{DAY_LABELS[date.getDay()]}</span>
          <span className={`font-heading text-sm font-bold ${isToday ? 'text-coral' : 'text-gray-800'}`}>{date.getDate()}</span>
        </div>
        {allDayBlocks.length > 0 && (
          <div className="px-0.5 pb-1">
            {allDayBlocks.map(bl => (
              <AllDayBlockBanner key={bl.id} block={bl} onDelete={onDeleteBlock} />
            ))}
          </div>
        )}
      </div>
      {HOUR_SLOTS.map(h => (
        <div key={h} className={`h-16 border-b hover:bg-coral/5 transition-colors ${h === 12 ? 'border-coral/30 bg-amber-50/20' : 'border-gray-300'}`} />
      ))}
      {(dayBlocks || []).map(bl => <TimeBlockDisplay key={bl.id} block={bl} onDelete={onDeleteBlock} />)}
      {dayBookings.map(b => (
        <BookingBlock key={b.id} booking={b} onClick={onBookingClick} onDragEnd={onDragEnd} onDelete={onDeleteBooking} travelBuffer={travelBuffer} />
      ))}

      {/* Slot context menu */}
      {slotMenu && (
        <div
          className="fixed z-50"
          style={{ left: slotMenu.x, top: slotMenu.y }}
          onMouseLeave={() => setSlotMenu(null)}
        >
          <div className="bg-white rounded-xl border border-gray-200 shadow-2xl overflow-hidden w-52 mt-1">
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
              <p className="font-body text-xs font-bold text-gray-500 uppercase tracking-wider">{slotMenu.time} · {dateStr}</p>
            </div>
            <button
              onClick={() => { setSlotMenu(null); onSlotClick(dateStr, slotMenu.time); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-body font-semibold text-gray-800 hover:bg-coral/5 hover:text-coral transition-colors text-left"
            >
              <span className="w-7 h-7 rounded-lg bg-coral/10 flex items-center justify-center text-coral">+</span>
              New Booking
            </button>
            {BLOCK_TYPES.slice(0, 3).map(bt => (
              <button
                key={bt.key}
                onClick={() => { setSlotMenu(null); onBlockClick(dateStr, slotMenu.time, bt.key, false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-body font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-left"
              >
                <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs" style={{ background: bt.color + '25', color: bt.color }}>☕</span>
                {bt.label}
              </button>
            ))}
            <div className="border-t border-gray-100 mt-1">
              <button
                onClick={() => { setSlotMenu(null); onBlockClick(dateStr, null, 'provider_unavailable', true); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-body font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
              >
                <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-xs">🚫</span>
                All-Day Unavailable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── TRAVEL BUFFER EDITOR ──────────────────────────────────────────────────────
function TravelBufferEditor({ value, onChange }) {
  const [editing, setEditing] = useState(false);
  const [localVal, setLocalVal] = useState(value);

  if (!editing) return (
    <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-body font-semibold text-gray-600 hover:border-coral/40 hover:text-coral transition-colors">
      <span className="w-2 h-2 rounded-sm" style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(235,148,134,0.5) 1px, rgba(235,148,134,0.5) 2px)' }} />
      Travel Buffer: {value}m
      <Pencil className="w-3 h-3" />
    </button>
  );

  return (
    <div className="flex items-center gap-1">
      <select value={localVal} onChange={e => setLocalVal(Number(e.target.value))}
        className="border border-coral rounded-lg px-2 py-1.5 text-xs font-body focus:outline-none">
        {[0, 10, 15, 20, 25, 30, 45, 60].map(v => <option key={v} value={v}>{v}m buffer</option>)}
      </select>
      <button onClick={() => { onChange(localVal); setEditing(false); }}
        className="p-1.5 bg-coral text-white rounded-lg hover:bg-coral/90">
        <Check className="w-3.5 h-3.5" />
      </button>
      <button onClick={() => setEditing(false)} className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-100">
        <X className="w-3.5 h-3.5 text-gray-400" />
      </button>
    </div>
  );
}

// ── MAIN CALENDAR ─────────────────────────────────────────────────────────────
export default function AdminCalendarOS({ sidebarItem }) {
  const [view, setView] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [timeBlocks, setTimeBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProvider, setFilterProvider] = useState('all');
  const [providers, setProviders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newBooking, setNewBooking] = useState(null);
  const [blockModal, setBlockModal] = useState(null); // { date, time, block_type }
  const [travelBuffer, setTravelBuffer] = useState(20);

  const SIDEBAR_STATUS_MAP = {
    new_requests:    'pending',
    needs_review:    'needs_review',
    pending_deposit: 'pending',
    confirmed:       'confirmed',
    assigned:        'provider_assigned',
    in_progress:     'in_progress',
    completed:       'completed',
    cancelled:       'cancelled',
    no_show:         'no_show',
    archived_bookings: 'archived',
  };

  useEffect(() => {
    if (!sidebarItem) return;
    const { key } = sidebarItem;
    if (key === 'day_view') setView('day');
    else if (key === 'week_view') setView('week');
    else if (key === 'month_view') setView('month');
    else if (key === 'today') { setView('day'); setCurrentDate(new Date()); }
    else if (SIDEBAR_STATUS_MAP[key]) setFilterStatus(SIDEBAR_STATUS_MAP[key]);
  }, [sidebarItem]);

  const loadData = () => {
    Promise.all([
      base44.entities.Booking.list('-scheduled_date', 300),
      base44.entities.Provider.filter({ status: 'active' }),
      base44.entities.TimeBlock.filter({ status: 'active' }, '-date', 200),
    ]).then(([b, p, tb]) => {
      setBookings(b || []);
      setProviders(p || []);
      setTimeBlocks(tb || []);
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

  const blocksByDate = useMemo(() => {
    const map = {};
    timeBlocks.forEach(tb => {
      if (!map[tb.date]) map[tb.date] = [];
      map[tb.date].push(tb);
    });
    return map;
  }, [timeBlocks]);

  const navigate = (dir) => {
    const d = new Date(currentDate);
    if (view === 'day') d.setDate(d.getDate() + dir);
    else if (view === 'week') d.setDate(d.getDate() + 7 * dir);
    else d.setMonth(d.getMonth() + dir);
    setCurrentDate(d);
  };

  const handleBlockClick = useCallback((date, time, block_type, all_day = false) => {
    setBlockModal({ date, time, block_type, all_day });
  }, []);

  const handleDeleteBlock = useCallback(async (blockId) => {
    await base44.entities.TimeBlock.delete(blockId);
    setTimeBlocks(prev => prev.filter(b => b.id !== blockId));
  }, []);

  const handleDeleteBooking = useCallback(async (bookingId) => {
    await base44.entities.Booking.delete(bookingId);
    setBookings(prev => prev.filter(b => b.id !== bookingId));
    setSelectedBooking(null);
  }, []);

  const handleDragEnd = useCallback(async (booking, newStartMins) => {
    const newStartTime = minutesToTimeStr(newStartMins);
    const dur = booking.total_duration_minutes || 120;
    const newEndTime = minutesToTimeStr(newStartMins + dur);
    setBookings(prev => prev.map(b => b.id === booking.id
      ? { ...b, scheduled_start_time: newStartTime, scheduled_end_time: newEndTime }
      : b
    ));
    await base44.entities.Booking.update(booking.id, {
      scheduled_start_time: newStartTime,
      scheduled_end_time: newEndTime,
    });
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const newCount = bookings.filter(b => b.status === 'pending').length;
  const reviewCount = bookings.filter(b => b.status === 'needs_review').length;

  const dayViewDate = currentDate.toISOString().split('T')[0];

  return (
    <div className="flex flex-col h-full" style={{ background: '#fdfcfb' }}>
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
              <AlertTriangle className="w-3.5 h-3.5" /> {reviewCount} Needs Review
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
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-300 flex-wrap" style={{ background: '#f8f4f0' }}>
        <div className="flex items-center gap-1">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-4 h-4 text-gray-700" />
          </button>
          <button onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 text-sm font-body font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Today</button>
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
          {/* Travel buffer editor */}
          <TravelBufferEditor value={travelBuffer} onChange={setTravelBuffer} />

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search guest..."
              className="bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm font-body text-gray-800 placeholder-gray-400 focus:outline-none focus:border-coral w-40" />
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

          <button onClick={() => setBlockModal({ date: currentDate.toISOString().split('T')[0], time: '12:00 PM' })}
            className="flex items-center gap-1.5 border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm font-body font-semibold hover:border-coral/40 hover:text-coral transition-colors">
            <Coffee className="w-4 h-4" /> Block Time
          </button>

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
          <div className="flex h-full min-h-[900px]">
            <TimeColumn />
            {weekDates.map(date => {
              const dateStr = date.toISOString().split('T')[0];
              return (
                <DayColumn
                  key={dateStr}
                  date={date}
                  dateStr={dateStr}
                  isToday={dateStr === todayStr}
                  dayBookings={(bookingsByDate[dateStr] || []).sort((a, b) =>
                    (a.scheduled_start_time || '').localeCompare(b.scheduled_start_time || ''))}
                  dayBlocks={blocksByDate[dateStr] || []}
                  onBookingClick={setSelectedBooking}
                  onSlotClick={(d, t) => setNewBooking({ date: d, time: t })}
                  onBlockClick={handleBlockClick}
                  onDeleteBlock={handleDeleteBlock}
                  onDeleteBooking={handleDeleteBooking}
                  onDragEnd={handleDragEnd}
                  travelBuffer={travelBuffer}
                />
              );
            })}
          </div>
        ) : view === 'day' ? (
          <div className="flex h-full min-h-[900px]">
            <TimeColumn />
            <DayColumn
              date={currentDate}
              dateStr={dayViewDate}
              isToday={dayViewDate === todayStr}
              dayBookings={(bookingsByDate[dayViewDate] || []).sort((a, b) =>
                (a.scheduled_start_time || '').localeCompare(b.scheduled_start_time || ''))}
              dayBlocks={blocksByDate[dayViewDate] || []}
              onBookingClick={setSelectedBooking}
              onSlotClick={(d, t) => setNewBooking({ date: d, time: t })}
              onBlockClick={handleBlockClick}
              onDeleteBlock={handleDeleteBlock}
              onDeleteBooking={handleDeleteBooking}
              onDragEnd={handleDragEnd}
              travelBuffer={travelBuffer}
            />
          </div>
        ) : (
          <div className="p-4">
            <div className="grid grid-cols-7 mb-1">
              {DAY_LABELS.map(d => (
                <div key={d} className="text-center font-body text-xs font-bold text-gray-600 uppercase py-2">{d}</div>
              ))}
            </div>
            <MonthGrid currentDate={currentDate} bookingsByDate={bookingsByDate}
              onBookingClick={setSelectedBooking} onDayClick={date => setNewBooking({ date, time: '10:00 AM' })} />
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="px-4 py-2 border-t border-gray-300 flex items-center gap-4 overflow-x-auto shrink-0" style={{ background: '#f8f4f0' }}>
        <span className="font-body text-xs font-semibold text-gray-500 shrink-0">Click to book · Drag to reschedule</span>
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-6 h-3 rounded-sm" style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(235,148,134,0.3) 2px, rgba(235,148,134,0.3) 4px)', border: '1px dashed rgba(235,148,134,0.5)' }} />
          <span className="font-body text-xs font-semibold text-gray-500">Travel buffer</span>
        </div>
        <div className="w-px h-4 bg-gray-200" />
        {Object.entries(STATUS_COLORS).slice(0, 6).map(([k, v]) => (
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
          onDelete={handleDeleteBooking}
          onUpdate={(id, updates) => {
            // Auto-remove cancelled/no-show/archived bookings from the calendar
            if (['cancelled', 'no_show', 'archived'].includes(updates.status)) {
              setBookings(prev => prev.filter(b => b.id !== id));
              setSelectedBooking(null);
            } else {
              setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
              setSelectedBooking(prev => ({ ...prev, ...updates }));
            }
          }}
        />
      )}

      {newBooking && (
        <CalendarNewBookingModal
          defaultDate={newBooking.date}
          defaultTime={newBooking.time}
          onClose={() => setNewBooking(null)}
          onSuccess={() => { setNewBooking(null); loadData(); }}
        />
      )}

      {blockModal && (
        <BlockTimeModal
          defaultDate={blockModal.date}
          defaultTime={blockModal.time}
          defaultBlockType={blockModal.block_type}
          defaultAllDay={blockModal.all_day}
          providers={providers}
          onClose={() => setBlockModal(null)}
          onCreate={(block) => {
            setTimeBlocks(prev => [...prev, block]);
            setBlockModal(null);
          }}
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
                  {b.client_name} · {b.scheduled_start_time}
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