import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const getPayload = async (req: Request) => {
  try {
    const body = await req.json();
    return body?.data ?? body ?? {};
  } catch {
    return {};
  }
};

const hasTime = (value: unknown) => typeof value === 'string' && value.trim() && value !== 'TBD';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await getPayload(req);
    const {
      clientName,
      clientEmail,
      clientPhone,
      clientAddress,
      serviceLabel,
      addonLabels = [],
      selectedDate,
      startTime,
      endTime,
      totalDuration,
      estimateLow,
      estimateHigh,
      specialNotes,
      tasks = [],
      sendInviteToClient = false,
      isConsult = false,
    } = payload;

    if (!selectedDate || !hasTime(startTime) || !hasTime(endTime)) {
      return Response.json({
        success: true,
        skipped: true,
        reason: 'No confirmed date/time. Calendar event not created.',
      });
    }

    const connection = await base44.asServiceRole.connectors.getConnection('googlecalendar');
    const accessToken = connection?.accessToken;

    if (!accessToken) {
      console.error('addBookingToCalendar: Google Calendar connection is missing an access token.');
      return Response.json({
        success: false,
        skipped: true,
        error: 'Google Calendar is not connected.',
      }, { status: 500 });
    }

    const addonSection = addonLabels?.length > 0 ? `\nAdd-ons: ${addonLabels.join(', ')}` : '';
    const tasksSection = tasks?.length > 0 ? `\nTasks: ${tasks.join(', ')}` : '';
    const notesSection = specialNotes ? `\nNotes: ${specialNotes}` : '';
    const durationDisplay = isConsult ? '15 min (free consult call)' : `${(Number(totalDuration || 0) / 60).toFixed(1)} hours`;

    const description = [
      `CLIENT: ${clientName || 'N/A'}`,
      `Email: ${clientEmail || 'N/A'}`,
      `Phone: ${clientPhone || 'N/A'}`,
      clientAddress ? `Address: ${clientAddress}` : null,
      '',
      `SERVICE: ${serviceLabel || 'Clean Slate Club visit'}${addonSection}${tasksSection}`,
      `Duration: ${durationDisplay}`,
      estimateLow && estimateHigh ? `\nQUOTED COST: $${estimateLow}–$${estimateHigh}` : null,
      notesSection || null,
    ].filter(l => l !== null && l !== undefined).join('\n');

    const startDateTime = `${selectedDate}T${to24h(String(startTime))}:00`;
    const endDateTime = `${selectedDate}T${to24h(String(endTime))}:00`;

    const event: Record<string, unknown> = {
      summary: isConsult
        ? `Free Consult — ${clientName || 'Clean Slate Club'}`
        : `${serviceLabel || 'Clean Slate Club Visit'} — ${clientName || 'Guest'}`,
      location: clientAddress || '',
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

    if (sendInviteToClient && clientEmail) {
      event.attendees = [{ email: clientEmail, displayName: clientName || 'Clean Slate Club Guest' }];
    }

    let calendarUrl = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
    if (isConsult) {
      event.conferenceData = {
        createRequest: {
          requestId: `consult-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      };
      calendarUrl += '?conferenceDataVersion=1';
    }

    const sendUpdates = sendInviteToClient ? 'all' : 'none';
    calendarUrl += (calendarUrl.includes('?') ? '&' : '?') + `sendUpdates=${sendUpdates}`;

    const calRes = await fetch(calendarUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!calRes.ok) {
      const err = await calRes.text();
      console.error('Google Calendar API error:', err);
      return Response.json({
        success: false,
        error: 'Failed to create calendar event.',
      }, { status: 500 });
    }

    const created = await calRes.json();
    const meetLink = created.conferenceData?.entryPoints?.find((e: Record<string, unknown>) => e.entryPointType === 'video')?.uri || null;

    return Response.json({ success: true, eventId: created.id, meetLink });
  } catch (error) {
    console.error('addBookingToCalendar error:', error);
    return Response.json({
      success: false,
      error: error?.message || 'Calendar sync failed.',
    }, { status: 500 });
  }
});

function to24h(timeStr: string) {
  if (!timeStr || timeStr === 'TBD') return '09:00';
  const [time, meridiem] = timeStr.split(' ');
  if (!meridiem) return timeStr;
  let [hours, minutes] = time.split(':').map(Number);
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  return `${String(hours).padStart(2, '0')}:${String(minutes || 0).padStart(2, '0')}`;
}
