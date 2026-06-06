import React, { useState, useRef, useEffect } from 'react';
import { Clock, MapPin, Phone, Mail, Tag, DollarSign, StickyNote, CheckSquare, Play } from 'lucide-react';
import { SERVICE_CONFIG } from '@/lib/bookingConfig';

function HoverTooltip({ booking, block, service, color, anchorRef, onStartVisit, onClick }) {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const tooltipWidth = 280;
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - tooltipWidth - 8));
    const top = rect.top - 8; // anchor to top of card, tooltip goes above
    setPos({ top, left });
  }, [anchorRef]);

  const tasks = booking.intake_answers?._tasks || [];
  const addonLabels = (booking.addons || [])
    .map(id => service?.addons?.find(a => a.id === id)?.label)
    .filter(Boolean);

  const rows = [
    booking.client_name && { icon: <span className="text-[10px]">👤</span>, value: booking.client_name, bold: true },
    service?.label && { icon: <Tag size={11} />, value: service.label },
    block.start_time && { icon: <Clock size={11} />, value: `${block.start_time} – ${block.end_time}` },
    booking.scheduled_date && { icon: <span className="text-[10px]">📅</span>, value: new Date(booking.scheduled_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) },
    booking.client_phone && { icon: <Phone size={11} />, value: booking.client_phone },
    booking.client_email && { icon: <Mail size={11} />, value: booking.client_email, truncate: true },
    booking.client_address && { icon: <MapPin size={11} />, value: booking.client_address },
    (booking.estimated_price_low || booking.estimated_price_high) && { icon: <DollarSign size={11} />, value: `$${booking.estimated_price_low}–$${booking.estimated_price_high} est.` },
    booking.total_duration_minutes && { icon: <Clock size={11} />, value: `${(booking.total_duration_minutes / 60).toFixed(1)} hrs total` },
    booking.status && { icon: <span className="text-[10px]">●</span>, value: booking.status.charAt(0).toUpperCase() + booking.status.slice(1) },
    tasks.length > 0 && { icon: <CheckSquare size={11} />, value: tasks.slice(0, 3).join(', ') + (tasks.length > 3 ? ` +${tasks.length - 3} more` : '') },
    addonLabels.length > 0 && { icon: <span className="text-[10px]">+</span>, value: addonLabels.join(', ') },
    booking.special_notes && { icon: <StickyNote size={11} />, value: booking.special_notes, truncate: true },
    booking.admin_notes && { icon: <StickyNote size={11} />, value: booking.admin_notes, truncate: true },
    booking.intake_answers?.preferred_contact && { icon: <span className="text-[10px]">📲</span>, value: `Pref: ${booking.intake_answers.preferred_contact}` },
  ].filter(Boolean).slice(0, 15);

  return (
    <div
      className="fixed z-[9999] pointer-events-none"
      style={{ top: pos.top, left: pos.left, transform: 'translateY(-100%)' }}
    >
      <div className="w-[280px] bg-white rounded-xl shadow-2xl border border-taupe/20 overflow-hidden">
        {/* Color bar */}
        <div className="h-1 w-full" style={{ background: color }} />
        <div className="p-3 space-y-1.5">
          {rows.map((row, i) => (
            <div key={i} className="flex items-start gap-2 text-[11px] font-body text-charcoal/70">
              <span className="shrink-0 mt-0.5 text-charcoal/35 w-3">{row.icon}</span>
              <span className={`${row.bold ? 'font-semibold text-charcoal' : 'font-light'} ${row.truncate ? 'truncate max-w-[220px]' : 'leading-snug'}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
        <div className="px-3 pb-3 flex gap-2">
          {onStartVisit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartVisit();
              }}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-coral text-white rounded-lg text-[10px] font-body font-light hover:bg-coral/90 transition-colors"
            >
              <Play className="w-3 h-3" /> Start
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            className="flex-1 px-2 py-1.5 border border-taupe/20 rounded-lg text-charcoal/60 text-[10px] font-body font-light hover:border-coral/30 transition-colors"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CalendarEvent({ block, booking, onClick, onStartVisit }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);

  // Travel / prep / wrap block — no booking attached
  if (!booking) {
    const isTravel = block.block_type === 'travel';
    return (
      <div className={`rounded px-2 py-1 text-[10px] font-body font-light border-l-2 ${
        isTravel ? 'bg-slate/8 border-slate/40 text-charcoal/35' : 'bg-cream border-taupe/30 text-charcoal/30'
      }`}>
        <p>{block.label || block.block_type}</p>
        <p className="opacity-60">{block.start_time} – {block.end_time}</p>
      </div>
    );
  }

  const service = SERVICE_CONFIG[booking.service_category];
  const color = service?.color || '#EB9486';

  return (
    <div ref={ref} className="relative">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="rounded-lg px-3 py-2 border-l-4 text-xs font-body hover:shadow-md transition-all select-none group"
        style={{ borderLeftColor: color, backgroundColor: color + '18' }}
      >
        <p className="font-semibold text-charcoal truncate text-[11px]">{booking.client_name}</p>
        <p className="text-[10px] text-charcoal/55 font-light">{block.start_time} – {block.end_time}</p>
        <p className="text-[10px] font-light mt-0.5" style={{ color }}>{service?.label}</p>
        {onStartVisit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStartVisit();
            }}
            className="mt-1.5 w-full flex items-center justify-center gap-1 px-2 py-1 bg-coral text-white rounded text-[9px] font-light opacity-0 group-hover:opacity-100 transition-opacity hover:bg-coral/90"
          >
            <Play className="w-3 h-3" /> Start Visit
          </button>
        )}
      </div>

      {hovered && (
        <HoverTooltip
          booking={booking}
          block={block}
          service={service}
          color={color}
          anchorRef={ref}
          onStartVisit={onStartVisit}
          onClick={onClick}
        />
      )}
    </div>
  );
}