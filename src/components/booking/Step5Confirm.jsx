import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';

// ── Accent colors per service ─────────────────────────────────────────────────
const ACCENT = {
  home_reset:      '#EB9486',
  mothers_helper:  '#EFB988',
  errands:         '#CAE7B9',
  senior_support:  '#B58A90',
  meal_prep:       '#F3DE8A',
  organization:    '#7E7F9A',
};

const SERVICE_LABELS = {
  consult: "Not Sure Yet - Let's Talk",
  home_reset: 'Hot Mess Express',
  mothers_helper: 'Chaos Coordinator',
  errands: 'The Runaround',
  senior_support: 'The Check-In',
  meal_prep: 'Clean Plate Club',
  organization: 'Room Service',
};

// Services that show the emergency contact tap-to-call card
const EMERGENCY_SERVICES = ['mothers_helper', 'senior_support'];

// ── Acknowledgement definitions (second-person, no personal names) ─────────────
const ACKNOWLEDGEMENTS = [
  {
    id: 'first_visit_presence',
    emoji: 'house',
    title: 'Initial Visit Access',
    body: 'For your first visit, someone must be home to let us in, walk us through the space, and answer any important questions before we get started. After that initial visit, we can make access arrangements for future appointments when appropriate.',
    bullets: [
      'A guest or approved adult must be present at the start of the first visit',
      'Please plan a few minutes for instructions, priorities, and any off-limits areas',
      'Future visits may use a lockbox, code, key handoff, or another approved access plan',
      'If we arrive and cannot access the home, the appointment may be treated as a no-show and your deposit may be forfeited',
    ],
  },
  {
    id: 'supplies',
    emoji: 'cleaning',
    title: 'Supplies & Materials',
    body: 'We bring basic cleaning supplies and small tools for standard household reset tasks. For larger equipment, like vacuums, carpet cleaners, steamers, step stools, specialty tools, or appliances, we prefer to use what you already have in your home when appropriate. Please provide any project-specific materials needed for your visit.',
    bullets: [
      'Bins, baskets, labels, hangers, drawer organizers, or pantry containers',
      'Meal prep containers, food storage bags, groceries, or special ingredients',
      'Laundry products, pet supplies, specialty cleaners, or surface-specific products',
      'If supplies are needed, you can add a store run for an additional fee so your scheduled time stays on track',
    ],
  },
  {
    id: 'scope',
    emoji: 'clipboard',
    title: 'Scope of Work',
    body: 'Your provider will complete only the tasks agreed upon at the time of booking. Tasks added during a session that were not included in the original booking will require a new appointment.',
    bullets: [
      'Adding rooms or spaces that were not selected during booking',
      'Requesting deep-clean level service when a standard session was booked',
      'Adding laundry, dishes, or errands that were not on the original task list',
      'Asking the provider to stay beyond the scheduled end time without pre-authorization',
    ],
  },
  {
    id: 'cancellation',
    emoji: 'calendar',
    title: 'Cancellation & Rescheduling',
    body: 'Cancellations and rescheduling requests must be made at least 24 hours before your appointment start time. Late cancellations and no-shows may result in a partial or full charge.',
    bullets: [
      'Same-day cancellations: up to 50% of the estimated session fee',
      'No-shows (provider arrives, no answer): charged in full',
      'Rescheduling within 24 hours is subject to availability and is not guaranteed',
    ],
  },
  {
    id: 'unsafe',
    emoji: 'warning',
    title: 'Unsafe Conditions',
    body: 'Your provider has the right to pause or leave a job site if conditions are considered unsafe - without penalty or refund obligation for time not completed. Please ensure the space is ready before your appointment.',
    bullets: [
      'Unsecured or aggressive pets that cannot be fully contained during the visit',
      'Biohazard materials such as bodily fluids, sewage, active mold, or pest infestations',
      'Hostile, threatening, or inappropriate behavior directed at the provider',
      'Structural hazards or extreme conditions that prevent safe movement or task completion',
    ],
  },
];

function hexToRgba(hex, opacity = 0.4) {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function AckIcon({ emoji }) {
  const icons = { house: '🏠', cleaning: '🧹', clipboard: '📋', calendar: '📅', warning: '⚠️' };
  return <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>{icons[emoji] || '✅'}</span>;
}

function CheckBox({ checked, accentColor }) {
  return (
    <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${checked ? accentColor : '#ccc'}`, background: checked ? accentColor : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.18s ease' }}>
      {checked && (
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
          <path d="M1 5l3.5 3.5L11 1" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

function AckCard({ ack, checked, onChange, accentColor }) {
  const checkedBg = hexToRgba(accentColor, 0.4);

  return (
    <div onClick={() => onChange(!checked)} style={{ border: `1.5px solid ${checked ? accentColor : '#e5e0dc'}`, borderRadius: 14, padding: '18px 20px', marginBottom: 12, background: checked ? checkedBg : '#fff', cursor: 'pointer', transition: 'all 0.2s ease', userSelect: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ paddingTop: 1 }}><CheckBox checked={checked} accentColor={accentColor} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <AckIcon emoji={ack.emoji} />
            <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#2d2d2d' }}>{ack.title}</p>
          </div>
          <p style={{ margin: '0 0 10px', fontSize: 13.5, color: '#555', lineHeight: 1.55 }}>{ack.body}</p>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {ack.bullets.map((bullet, i) => (
              <li key={i} style={{ fontSize: 12.5, color: '#777', lineHeight: 1.65, marginBottom: 1 }}>{bullet}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, accentColor }) {
  return (
    <label style={{ position: 'relative', display: 'inline-block', width: 46, height: 26, cursor: 'pointer', flexShrink: 0 }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
      <span style={{ position: 'absolute', inset: 0, background: checked ? accentColor : '#ddd', borderRadius: 13, transition: 'background 0.2s' }} />
      <span style={{ position: 'absolute', top: 4, left: checked ? 24 : 4, width: 18, height: 18, background: '#fff', borderRadius: '50%', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.22)' }} />
    </label>
  );
}

export default function Step5Confirm({ booking, serviceKey, clientInfo, selectedDate, selectedTime, totalDuration, dynamicEstimate, smsOptIn, setSmsOptIn, onAllAcknowledged }) {
  const [checked, setChecked] = useState({});

  const previewBooking = booking || {
    service_category: serviceKey,
    client_name: clientInfo?.name || '',
    client_address: clientInfo?.address || '',
    scheduled_date: selectedDate,
    scheduled_start_time: selectedTime,
    scheduled_end_time: selectedTime && totalDuration ? addMinutesToTime(selectedTime, totalDuration) : 'TBD',
    estimated_price_low: dynamicEstimate?.low || 0,
    estimated_price_high: dynamicEstimate?.high || 0,
  };

  const accentColor = ACCENT[previewBooking?.service_category] || '#EB9486';
  const isConsult = previewBooking?.service_category === 'consult';
  const showEmergency = EMERGENCY_SERVICES.includes(previewBooking?.service_category);
  const serviceLabel = SERVICE_LABELS[previewBooking?.service_category] || (previewBooking?.service_category || '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const approxDuration = !isConsult && totalDuration ? formatDuration(totalDuration) : null;

  const totalAcks = ACKNOWLEDGEMENTS.length;
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const allChecked = checkedCount === totalAcks;

  useEffect(() => { onAllAcknowledged?.(allChecked); }, [allChecked, onAllAcknowledged]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', paddingBottom: 48 }}>
      <div style={{ background: '#fff', border: '1.5px solid #f0e8e4', borderTop: `4px solid ${accentColor}`, borderRadius: 16, padding: '24px 24px 20px', marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 18px', fontSize: 17, fontWeight: 700, color: '#2d2d2d' }}>Booking Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 24px' }}>
          <div><p style={labelStyle(accentColor)}>Service</p><p style={valueStyle}>{serviceLabel || '--'}</p></div>
          <div><p style={labelStyle(accentColor)}>Name</p><p style={valueStyle}>{previewBooking?.client_name || '--'}</p></div>
          <div><p style={labelStyle(accentColor)}>Date</p><p style={valueStyle}>{formatDate(previewBooking?.scheduled_date)}</p></div>
          <div><p style={labelStyle(accentColor)}>Time</p><p style={valueStyle}>{previewBooking?.scheduled_start_time || 'TBD'}{!isConsult && previewBooking?.scheduled_end_time ? ` - ${previewBooking.scheduled_end_time}` : ''}</p></div>
          {approxDuration && (<div><p style={labelStyle(accentColor)}>Approx. Visit Length</p><p style={valueStyle}>{approxDuration}</p></div>)}
          {!isConsult && (<div><p style={labelStyle(accentColor)}>Estimated Cost</p><p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: accentColor }}>${previewBooking?.estimated_price_low || 0} - ${previewBooking?.estimated_price_high || 0}</p></div>)}
          {previewBooking?.client_address && (<div style={{ gridColumn: '1 / -1' }}><p style={labelStyle(accentColor)}>Address</p><p style={{ margin: 0, fontSize: 13.5, color: '#555' }}>{previewBooking.client_address}</p></div>)}
        </div>
      </div>

      {showEmergency && (
        <div style={{ background: `${accentColor}12`, border: `1.5px solid ${accentColor}55`, borderRadius: 14, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div><p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: accentColor }}>Emergency Contact</p><p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#2d2d2d' }}>Clean Slate Club</p><p style={{ margin: '2px 0 0', fontSize: 13, color: '#666' }}>(206) 825-4061</p></div>
          <a href="tel:+12068254061" style={{ display: 'flex', alignItems: 'center', gap: 8, background: accentColor, color: '#fff', borderRadius: 50, padding: '11px 20px', textDecoration: 'none', fontSize: 13, fontWeight: 700, flexShrink: 0, whiteSpace: 'nowrap' }}><Phone size={15} />Call Now</a>
        </div>
      )}

      {setSmsOptIn && (
        <div style={{ background: '#fff', border: '1.5px solid #f0e8e4', borderRadius: 14, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div><p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: 14.5, color: '#2d2d2d' }}>Text Updates</p><p style={{ margin: 0, fontSize: 12.5, color: '#666', lineHeight: 1.45 }}>Send me booking updates, arrival reminders, and quick questions by SMS.</p></div>
          <Toggle checked={!!smsOptIn} onChange={setSmsOptIn} accentColor={accentColor} />
        </div>
      )}

      <div style={{ marginBottom: 18 }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 700, color: '#2d2d2d' }}>Please Review Before Booking</h3>
        <p style={{ margin: '0 0 16px', fontSize: 13.5, color: '#666', lineHeight: 1.55 }}>Tap each item to confirm you understand the booking policies.</p>
        {ACKNOWLEDGEMENTS.map((ack) => <AckCard key={ack.id} ack={ack} checked={!!checked[ack.id]} onChange={(value) => setChecked((prev) => ({ ...prev, [ack.id]: value }))} accentColor={accentColor} />)}
      </div>

      <div style={{ background: allChecked ? `${accentColor}15` : '#f8f6f4', border: `1.5px solid ${allChecked ? `${accentColor}55` : '#e5e0dc'}`, borderRadius: 14, padding: '14px 18px', textAlign: 'center', transition: 'all 0.2s ease' }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: allChecked ? accentColor : '#888' }}>{allChecked ? 'You are ready to submit your request.' : `${checkedCount} of ${totalAcks} confirmed`}</p>
      </div>
    </div>
  );
}

function addMinutesToTime(timeStr, minutesToAdd) {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  const total = hours * 60 + minutes + minutesToAdd;
  const displayHours24 = Math.floor(total / 60);
  const displayMinutes = total % 60;
  const displayPeriod = displayHours24 >= 12 ? 'PM' : 'AM';
  const displayHours = displayHours24 > 12 ? displayHours24 - 12 : displayHours24 === 0 ? 12 : displayHours24;
  return displayHours + ':' + displayMinutes.toString().padStart(2, '0') + ' ' + displayPeriod;
}

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (!hours) return `${mins} min`;
  if (!mins) return `${hours} hr${hours === 1 ? '' : 's'}`;
  return `${hours} hr${hours === 1 ? '' : 's'} ${mins} min`;
}

function labelStyle(color) {
  return { margin: '0 0 4px', fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color };
}

const valueStyle = { margin: 0, fontSize: 14, fontWeight: 600, color: '#333' };
