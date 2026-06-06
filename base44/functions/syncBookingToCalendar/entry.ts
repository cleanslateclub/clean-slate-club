import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Blueprint: human-readable service names mapped from DB category keys
const SERVICE_LABELS = {
  home_reset:    'Hot Mess Express',
  family_support:'Chaos Coordinator',
  senior_support:'The Check-In',
  errands:       'The Runaround',
  meal_prep:     'Clean Plate Club',
  organization:  'Room Service',
  consult:       'Free Consult Call',
};

// Blueprint: color by booking status for easy calendar scanning
const STATUS_COLORS = {
  pending:   '5',  // Banana (yellow)  — needs action
  confirmed: '7',  // Peacock (blue)   — locked in
  completed: '10', // Basil (green)    — done
  cancelled: '11', // Tomato (red)     — cancelled (before delete)
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const booking = body.data || body.booking;

    // FIX: Validate booking exists before anything else
    if (!booking) {
      return Response.json({ skipped: true, reason: 'No booking data provided' });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    // Handle cancellation — delete calendar event if one exists
    if (booking.status === 'cancelled') {
      if (booking.google_calendar_event_id) {
        const delRes = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events/${booking.google_calendar_event_id}?sendUpdates=all`,
          { method: 'DELETE', headers: { 'Authorization': `Bearer ${accessToken}` } }
        );
        // 204 = deleted, 410 = already gone — both are acceptable
        if (!delRes.ok && delRes.status !== 410) {
          console.error('Failed to delete calendar event:', await delRes.text());
          return Response.json({ error: 'Failed to remove calendar event.' }, { status: 500 });
        }
        // FIX: Clear the event ID from the booking record
        base44.asServiceRole.entities.Booking.update(booking.id, {
          google_calendar_event_id: null
        }).catch((e) => console.error('Failed to clear event ID:', e));
        // FIX: Return deleted:true instead of skipped:true so caller knows it happened
        return Response.json({ success: true, deleted: true });
      }
      return Response.json({ skipped: true, reason: 'Cancelled booking had no calendar event' });
    }

    // FIX: Skip if no real date/time — don’t create placeholder events
    if (!booking.scheduled_date ||
        !booking.scheduled_start_time ||
        booking.scheduled_start_time === 'TBD' ||
        !booking.scheduled_end_time ||
        booking.scheduled_end_time === 'TBD') {
      return Response.json({ skipped: true, reason: 'No confirmed date/time' });
    }

    // FIX: Use human-readable service names from blueprint map
    const serviceLabel = SERVICE_LABELS[booking.service_category]
      || booking.service_category?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      || 'Service';

    // FIX: addon IDs joined — note: if addon labels are available use those instead
    const addons = Array.isArray(booking.addons) && booking.addons.length > 0
      ? booking.addons.join(', ')
      : '';
    const tasks = Array.isArray(booking.intake_answers?._tasks) && booking.intake_answers._tasks.length > 0
      ? booking.intake_answers._tasks.join(', ')
      : '';

    // FIX: Guard against undefined fields, remove admin_notes (blueprint: CEO-only, not for calendar)
    const description = [
      `CLIENT: ${booking.client_name || 'Unknown'}`,
      `Email: ${booking.client_email || ''}`,
      `Phone: ${booking.client_phone || ''}`,
      `Address: ${booking.client_address || ''}`,
      '',
      `SERVICE: ${serviceLabel}`,
      addons ? `Add-ons: ${addons}` : null,
      tasks  ? `Tasks: ${tasks}`   : null,
      '',
      `QUOTED COST: $${booking.estimated_price_low || 0}–$${booking.estimated_price_high || 0}`,
      booking.special_notes ? `Notes: ${booking.special_notes}` : null,
      // FIX: admin_notes removed — blueprint says providers cannot see CEO-only notes
      // and this calendar may be visible to providers
    ].filter(l => l !== null && l !== undefined).join('\n');

    const startDateTime = `${booking.scheduled_date}T${to24h(booking.scheduled_start_time)}:00`;
    const endDateTime   = `${booking.scheduled_date}T${to24h(booking.scheduled_end_time)}:00`;

    // FIX: Color reflects booking status so calendar is easy to read at a glance
    const colorId = STATUS_COLORS[booking.status] || '7';

    const event = {
      summary:     `✨ ${serviceLabel} — ${booking.client_name || 'Guest'}`,
      location:    booking.client_address || '',
      description,
      start:       { dateTime: startDateTime, timeZone: 'America/New_York' },
      end:         { dateTime: endDateTime,   timeZone: 'America/New_York' },
      colorId,
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 60 },
          { method: 'email', minutes: 1440 }, // 24 hrs
        ],
      },
    };

    const existingEventId = booking.google_calendar_event_id;

    let calRes;
    if (existingEventId) {
      // UPDATE — FIX: added sendUpdates=all so client gets notified of reschedules
      calRes = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${existingEventId}?sendUpdates=all`,
        {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(event),
        }
      );
    } else {
      // CREATE
      calRes = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all',
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(event),
        }
      );
    }

    if (!calRes.ok) {
      // FIX: Log error server-side, return generic message to caller
      const err = await calRes.text();
      console.error('Google Calendar API error:', err);
      return Response.json({ error: 'Failed to sync calendar event. Booking is still confirmed.' }, { status: 500 });
    }

    const result = await calRes.json();

    // Save event ID back to booking if newly created
    if (!existingEventId && booking.id) {
      base44.asServiceRole.entities.Booking.update(booking.id, {
        google_calendar_event_id: result.id
      }).catch((e) => console.error('Failed to save event ID to booking:', e));
    }

    return Response.json({ success: true, eventId: result.id });

  } catch (error) {
    console.error('syncBookingToCalendar error:', error);
    // FIX: Don’t expose raw error to caller
    return Response.json({ error: 'Calendar sync failed. Booking is still confirmed.' }, { status: 500 });
  }
});

// Convert "9:00 AM" / "2:30 PM" → "09:00" / "14:30"
function to24h(timeStr) {
  if (!timeStr || timeStr === 'TBD') return '09:00';
  const [time, meridiem] = timeStr.split(' ');
  if (!meridiem) return timeStr; // already 24h format
  let [hours, minutes] = time.split(':').map(Number);
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
