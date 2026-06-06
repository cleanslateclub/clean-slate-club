import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const {
      clientName, clientEmail, clientPhone, clientAddress,
      serviceLabel, addonLabels, selectedDate, startTime, endTime,
      totalDuration, estimateLow, estimateHigh, specialNotes, tasks,
      sendInviteToClient = false, // FIX: now reads this param from BookNow.jsx
      isConsult = false           // FIX: flag for consult-specific handling
    } = body;

    // FIX: Validate required fields before hitting Google API
    if (!selectedDate || !startTime || startTime === 'TBD' || !endTime || endTime === 'TBD') {
      // Skip creating calendar event if we don’t have a real date/time yet
      // (happens for consults that haven’t been scheduled)
      return Response.json({ success: false, skipped: true, reason: 'No confirmed date/time — calendar event not created.' });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    // Build a rich description
    const addonSection = addonLabels?.length > 0 ? `\nAdd-ons: ${addonLabels.join(', ')}` : '';
    const tasksSection = tasks?.length > 0 ? `\nTasks: ${tasks.join(', ')}` : '';
    const notesSection = specialNotes ? `\nNotes: ${specialNotes}` : '';

    // FIX: Duration display — shows '15 min' for consults instead of '0.0 hours'
    const durationDisplay = isConsult
      ? '15 min (free consult call)'
      : `${(totalDuration / 60).toFixed(1)} hours`;

    const description = [
      `CLIENT: ${clientName}`,
      `Email: ${clientEmail}`,
      `Phone: ${clientPhone}`,
      clientAddress ? `Address: ${clientAddress}` : null,
      ``,
      `SERVICE: ${serviceLabel}${addonSection}${tasksSection}`,
      `Duration: ${durationDisplay}`,
      estimateLow && estimateHigh ? `\nQUOTED COST: $${estimateLow}–$${estimateHigh}` : null,
      notesSection || null, // FIX: use null instead of '' so filter removes it
    ].filter(l => l !== null && l !== undefined).join('\n'); // FIX: filter out null AND undefined

    // Build RFC3339 datetimes
    const startDateTime = `${selectedDate}T${to24h(startTime)}:00`;
    const endDateTime = `${selectedDate}T${to24h(endTime)}:00`;

    const event = {
      summary: isConsult
        ? `📞 Free Consult — ${clientName}`
        : `✨ ${serviceLabel} — ${clientName}`,
      location: clientAddress || '',
      description,
      start: { dateTime: startDateTime, timeZone: 'America/New_York' },
      end: { dateTime: endDateTime, timeZone: 'America/New_York' },
      colorId: '11',
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 60 },
          { method: 'email', minutes: 1440 }, // 24 hrs
        ],
      },
    };

    // FIX: Add client as attendee so they get a Google Calendar invite
    if (sendInviteToClient && clientEmail) {
      event.attendees = [{ email: clientEmail, displayName: clientName }];
    }

    // FIX: Add Google Meet link for consult calls
    let calendarUrl = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
    if (isConsult) {
      event.conferenceData = {
        createRequest: {
          requestId: `consult-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      };
      calendarUrl += '?conferenceDataVersion=1'; // required for Meet link generation
    }

    // FIX: Also add sendUpdates param so attendees get email notification
    const sendUpdates = sendInviteToClient ? 'all' : 'none';
    calendarUrl += (calendarUrl.includes('?') ? '&' : '?') + `sendUpdates=${sendUpdates}`;

    const calRes = await fetch(calendarUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!calRes.ok) {
      const err = await calRes.text();
      // FIX: Log error server-side but return generic message to client
      console.error('Google Calendar API error:', err);
      return Response.json({ error: 'Failed to create calendar event. Please check admin dashboard.' }, { status: 500 });
    }

    const created = await calRes.json();

    // FIX: Return Meet link if generated (useful for consult confirmation emails)
    const meetLink = created.conferenceData?.entryPoints?.find(e => e.entryPointType === 'video')?.uri || null;

    return Response.json({ success: true, eventId: created.id, meetLink });

  } catch (error) {
    console.error('addBookingToCalendar error:', error);
    // FIX: Don’t expose raw error message to client
    return Response.json({ error: 'Calendar sync failed. Booking is confirmed.' }, { status: 500 });
  }
});

// Convert "9:00 AM" / "2:30 PM" → "09:00" / "14:30"
function to24h(timeStr) {
  if (!timeStr || timeStr === 'TBD') return '09:00';
  const [time, meridiem] = timeStr.split(' ');
  if (!meridiem) return timeStr; // FIX: handle already-24h format gracefully
  let [hours, minutes] = time.split(':').map(Number);
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
