import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const {
      clientName, clientEmail, clientPhone, clientAddress,
      serviceLabel, addonLabels, selectedDate, startTime, endTime,
      totalDuration, estimateLow, estimateHigh, specialNotes, tasks
    } = await req.json();

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    // Build a rich description
    const addonSection = addonLabels?.length > 0 ? `\nAdd-ons: ${addonLabels.join(', ')}` : '';
    const tasksSection = tasks?.length > 0 ? `\nTasks: ${tasks.join(', ')}` : '';
    const notesSection = specialNotes ? `\nNotes: ${specialNotes}` : '';

    const description = [
      `CLIENT: ${clientName}`,
      `Email: ${clientEmail}`,
      `Phone: ${clientPhone}`,
      `Address: ${clientAddress}`,
      ``,
      `SERVICE: ${serviceLabel}${addonSection}${tasksSection}`,
      `Duration: ${(totalDuration / 60).toFixed(1)} hours`,
      ``,
      `QUOTED COST: $${estimateLow}–$${estimateHigh}`,
      notesSection,
    ].filter(l => l !== undefined).join('\n');

    // Build RFC3339 datetimes
    const startDateTime = `${selectedDate}T${to24h(startTime)}:00`;
    const endDateTime = `${selectedDate}T${to24h(endTime)}:00`;

    const event = {
      summary: `✨ ${serviceLabel} — ${clientName}`,
      location: clientAddress,
      description,
      start: { dateTime: startDateTime, timeZone: 'America/New_York' },
      end: { dateTime: endDateTime, timeZone: 'America/New_York' },
      colorId: '11', // Tomato/coral
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 60 },
          { method: 'email', minutes: 1440 }, // 24 hrs
        ],
      },
    };

    const calRes = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    if (!calRes.ok) {
      const err = await calRes.text();
      return Response.json({ error: err }, { status: 500 });
    }

    const created = await calRes.json();
    return Response.json({ success: true, eventId: created.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// Convert "9:00 AM" / "2:30 PM" → "09:00" / "14:30"
function to24h(timeStr) {
  if (!timeStr || timeStr === 'TBD') return '09:00';
  const [time, meridiem] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}