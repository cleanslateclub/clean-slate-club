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

// Services that show the emergency contact tap-to-call card
const EMERGENCY_SERVICES = ['mothers_helper', 'senior_support'];

// ── Acknowledgement definitions (second-person, no personal names) ─────────────
const ACKNOWLEDGEMENTS = [
  {
    id: 'supplies',
    emoji: 'cleaning',
    title: 'Supplies & Materials',
    body: 'You are responsible for providing all supplies and materials needed to complete your service. Your provider does not bring products or equipment unless arranged in advance.',
    bullets: [
      'Cleaning sprays, disinfectants, and scrub brushes',
      'Trash bags, paper towels, sponges, and gloves',
      'Mop, bucket, vacuum, and any specialty equipment',
      'Surface-specific products (e.g., wood polish, stainless steel cleaner, grout cleaner)',
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

// ── Emoji icon renderer (avoids additional icon library deps) ─────────────────
function AckIcon({ emoji }) {
  const icons = {
    cleaning:   '🧹',
    clipboard:  '📋',
    calendar:   '📅',
    warning:    '⚠️',
  };
  return (
    <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>
      {icons[emoji] || '✅'}
    </span>
  );
}

// ── Custom checkbox icon ──────────────────────────────────────────────────────
function CheckBox({ checked, accentColor }) {
  return (
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: '50%',
        border: `2px solid ${checked ? accentColor : '#ccc'}`,
        background: checked ? accentColor : '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.18s ease',
      }}
    >
      {checked && (
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
          <path d="M1 5l3.5 3.5L11 1" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

// ── Individual acknowledgement card ──────────────────────────────────────────
function AckCard({ ack, checked, onChange, accentColor }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        border: `1.5px solid ${checked ? accentColor : '#e5e0dc'}`,
        borderRadius: 14,
        padding: '18px 20px',
        marginBottom: 12,
        background: checked ? `${accentColor}11` : '#fff',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ paddingTop: 1 }}>
          <CheckBox checked={checked} accentColor={accentColor} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <AckIcon emoji={ack.emoji} />
            <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#2d2d2d' }}>
              {ack.title}
            </p>
          </div>
          <p style={{ margin: '0 0 10px', fontSize: 13.5, color: '#555', lineHeight: 1.55 }}>
            {ack.body}
          </p>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {ack.bullets.map((bullet, i) => (
              <li
                key={i}
                style={{ fontSize: 12.5, color: '#777', lineHeight: 1.65, marginBottom: 1 }}
              >
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ── Toggle switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, accentColor }) {
  return (
    <label
      style={{ position: 'relative', display: 'inline-block', width: 46, height: 26, cursor: 'pointer', flexShrink: 0 }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ opacity: 0, width: 0, height: 0 }}
      />
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background: checked ? accentColor : '#ddd',
          borderRadius: 13,
          transition: 'background 0.2s',
        }}
      />
      <span
        style={{
          position: 'absolute',
          top: 4,
          left: checked ? 24 : 4,
          width: 18,
          height: 18,
          background: '#fff',
          borderRadius: '50%',
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.22)',
        }}
      />
    </label>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Step5Confirm({ booking, smsOptIn, setSmsOptIn, onAllAcknowledged }) {
  const [checked, setChecked] = useState({});

  const accentColor = ACCENT[booking?.service_category] || '#EB9486';
  const isConsult    = !booking?.scheduled_date || booking?.scheduled_start_time === 'TBD';
  const showEmergency = EMERGENCY_SERVICES.includes(booking?.service_category);

  const serviceLabel = (booking?.service_category || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const totalAcks   = ACKNOWLEDGEMENTS.length;
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const allChecked  = checkedCount === totalAcks;

  useEffect(() => {
    onAllAcknowledged?.(allChecked);
  }, [allChecked]);

  const handleCheck = (id, value) => {
    setChecked((prev) => ({ ...prev, [id]: value }));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      month:   'long',
      day:     'numeric',
    });
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', paddingBottom: 48 }}>

      {/* ── Booking Summary ───────────────────────────────────────────── */}
      <div
        style={{
          background: '#fff',
          border: '1.5px solid #f0e8e4',
          borderTop: `4px solid ${accentColor}`,
          borderRadius: 16,
          padding: '24px 24px 20px',
          marginBottom: 20,
        }}
      >
        <h3 style={{ margin: '0 0 18px', fontSize: 17, fontWeight: 700, color: '#2d2d2d' }}>
          Booking Summary
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 24px' }}>
          <div>
            <p style={labelStyle(accentColor)}>Service</p>
            <p style={valueStyle}>{serviceLabel}</p>
          </div>
          <div>
            <p style={labelStyle(accentColor)}>Name</p>
            <p style={valueStyle}>{booking?.client_name || '--'}</p>
          </div>
          <div>
            <p style={labelStyle(accentColor)}>Date</p>
            <p style={valueStyle}>
              {isConsult ? 'TBD (Consult Request)' : formatDate(booking?.scheduled_date)}
            </p>
          </div>
          <div>
            <p style={labelStyle(accentColor)}>Time</p>
            <p style={valueStyle}>
              {isConsult
                ? 'TBD'
                : `${booking?.scheduled_start_time || ''} - ${booking?.scheduled_end_time || 'TBD'}`}
            </p>
          </div>

          {!isConsult && (
            <div>
              <p style={labelStyle(accentColor)}>Estimated Cost</p>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: accentColor }}>
                ${booking?.estimated_price_low || 0} - ${booking?.estimated_price_high || 0}
              </p>
            </div>
          )}

          {booking?.client_address && (
            <div style={{ gridColumn: '1 / -1' }}>
              <p style={labelStyle(accentColor)}>Address</p>
              <p style={{ margin: 0, fontSize: 13.5, color: '#555' }}>{booking.client_address}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Emergency Contact (mothers_helper / senior_support only) ──── */}
      {showEmergency && (
        <div
          style={{
            background: `${accentColor}12`,
            border: `1.5px solid ${accentColor}55`,
            borderRadius: 14,
            padding: '16px 20px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div>
            <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: accentColor }}>
              Emergency Contact
            </p>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#2d2d2d' }}>Clean Slate Club</p>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: '#666' }}>(206) 825-4061</p>
          </div>
          <a
            href="tel:+12068254061"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: accentColor,
              color: '#fff',
              borderRadius: 50,
              padding: '11px 20px',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 700,
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            <Phone size={15} />
            Call Now
          </a>
        </div>
      )}

      {/* ── SMS Opt-in ────────────────────────────────────────────────── */}
      {setSmsOptIn && (
        <div
          style={{
            background: '#fff',
            border: '1.5px solid #f0e8e4',
            borderRadius: 14,
            padding: '16px 20px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div>
            <p style={{ margin: '0 0 3px', fontWeight: 700, fontSize: 14, color: '#333' }}>
              Text Message Updates
            </p>
            <p style={{ margin: 0, fontSize: 12.5, color: '#888', lineHeight: 1.5 }}>
              Receive SMS reminders and status updates about your booking.
            </p>
          </div>
          <Toggle checked={!!smsOptIn} onChange={setSmsOptIn} accentColor={accentColor} />
        </div>
      )}

      {/* ── Acknowledgements ──────────────────────────────────────────── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#2d2d2d' }}>
            Review & Confirm
          </h3>
          <span
            style={{
              background: allChecked ? `${accentColor}22` : '#f5f5f5',
              color:      allChecked ? accentColor : '#aaa',
              border:     `1px solid ${allChecked ? accentColor + '55' : '#e8e8e8'}`,
              borderRadius: 50,
              padding: '4px 13px',
              fontSize: 12,
              fontWeight: 700,
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {checkedCount} / {totalAcks} confirmed
          </span>
        </div>

        <p style={{ margin: '0 0 16px', fontSize: 13, color: '#888', lineHeight: 1.5 }}>
          Please read and check each item below before submitting your booking.
          Tap a card to confirm you understand and agree.
        </p>

        {ACKNOWLEDGEMENTS.map((ack) => (
          <AckCard
            key={ack.id}
            ack={ack}
            checked={!!checked[ack.id]}
            onChange={(val) => handleCheck(ack.id, val)}
            accentColor={accentColor}
          />
        ))}

        {!allChecked && (
          <p style={{ textAlign: 'center', fontSize: 12.5, color: '#bbb', marginTop: 10 }}>
            All {totalAcks} items must be confirmed to proceed.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Style helpers ─────────────────────────────────────────────────────────────
const labelStyle = (color) => ({
  margin: '0 0 3px',
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.13em',
  textTransform: 'uppercase',
  color,
});

const valueStyle = {
  margin: 0,
  fontSize: 14,
  fontWeight: 600,
  color: '#333',
};
