import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const booking = body.data || body.booking;
    if (!booking || booking.status === 'cancelled') {
      // If cancelled and we have a calendar event ID, delete it
      if (booking?.google_calendar_event_id) {
        const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');
        await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events/${booking.google_calendar_event_id}`,
          { method: 'DELETE', headers: { 'Authorization': `Bearer ${accessToken}` } }
        );
      }
      return Response.json({ skipped: true });
    }

    // Skip consult requests (no confirmed date/time)
    if (!booking.scheduled_date || booking.scheduled_start_time === 'TBD') {
      return Response.json({ skipped: 'no date/time' });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    const serviceLabel = booking.service_category?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Service';
    const addons = booking.addons?.join(', ') || '';
    const tasks = booking.intake_answers?._tasks?.join(', ') || '';

    const description = [
      `CLIENT: ${booking.client_name}`,
      `Email: ${booking.client_email}`,
      `Phone: ${booking.client_phone || ''}`,
      `Address: ${booking.client_address || ''}`,
      ``,
      `SERVICE: ${serviceLabel}`,
      addons ? `Add-ons: ${addons}` : '',
      tasks ? `Tasks: ${tasks}` : '',
      ``,
      `QUOTED COST: $${booking.estimated_price_low || 0}–$${booking.estimated_price_high || 0}`,
      booking.special_notes ? `Notes: ${booking.special_notes}` : '',
      booking.admin_notes ? `Admin Notes: ${booking.admin_notes}` : '',
    ].filter(Boolean).join('\n');

    const startDateTime = `${booking.scheduled_date}T${to24h(booking.scheduled_start_time)}:00`;
    const endDateTime = `${booking.scheduled_date}T${to24h(booking.scheduled_end_time || booking.scheduled_start_time)}:00`;

    const event = {
      summary: `✨ ${serviceLabel} — ${booking.client_name}`,
      location: booking.client_address || '',
      description,
      start: { dateTime: startDateTime, timeZone: 'America/New_York' },
      end: { dateTime: endDateTime, timeZone: 'America/New_York' },
      colorId: '11',
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 60 },
          { method: 'email', minutes: 1440 },
        ],
      },
    };

    const existingEventId = booking.google_calendar_event_id;

    let calRes;
    if (existingEventId) {
      // UPDATE existing event
      calRes = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${existingEventId}`,
        {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(event),
        }
      );
    } else {
      // CREATE new event
      calRes = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(event),
        }
      );
    }

    if (!calRes.ok) {
      const err = await calRes.text();
      return Response.json({ error: err }, { status: 500 });
    }

    const result = await calRes.json();

    // If we created a new event, save the event ID back to the booking (best-effort)
    if (!existingEventId && booking.id) {
      base44.asServiceRole.entities.Booking.update(booking.id, {
        google_calendar_event_id: result.id
      }).catch(() => {});
    }

    return Response.json({ success: true, eventId: result.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function to24h(timeStr) {
  if (!timeStr || timeStr === 'TBD') return '09:00';
  const [time, meridiem] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}