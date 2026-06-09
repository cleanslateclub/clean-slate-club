import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Convert "9:00 AM" / "2:30 PM" → "09:00" / "14:30" for Google Calendar
function to24h(timeStr: string): string {
  if (!timeStr || timeStr === 'TBD') return '09:00';
  const [time, meridiem] = timeStr.split(' ');
  if (!meridiem) return timeStr;
  let [hours, minutes] = time.split(':').map(Number);
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const {
      bookingId,
      newDate,         // YYYY-MM-DD
      newStartTime,    // e.g. "10:00 AM"
      newEndTime,      // e.g. "2:00 PM"
      reason,          // optional string
      rescheduledBy,   // provider name or "Admin"
      notifyClient,    // boolean — provider chose Yes or No before submitting
    } = await req.json();

    // --- Validate ---
    if (!bookingId || !newDate || !newStartTime || !newEndTime) {
      return Response.json(
        { success: false, error: 'Missing required fields: bookingId, newDate, newStartTime, newEndTime.' },
        { status: 400 }
      );
    }

    // --- Load booking ---
    const booking = await base44.asServiceRole.entities.Booking.get(bookingId);
    if (!booking) {
      return Response.json({ success: false, error: 'Booking not found.' }, { status: 404 });
    }

    const oldDate = booking.scheduled_date;
    const oldStart = booking.scheduled_start_time;

    // --- Build admin note ---
    const rescheduleNote = [
      `\n➩ Rescheduled by ${rescheduledBy || 'Provider'} on ${new Date().toLocaleDateString('en-US')}`,
      `   From: ${oldDate} at ${oldStart}`,
      `   To:   ${newDate} at ${newStartTime}`,
      reason ? `   Reason: ${reason}` : null,
      `   Client notified: ${notifyClient ? 'Yes' : 'No'}`,
    ].filter(Boolean).join('\n');

    // --- Update booking ---
    await base44.asServiceRole.entities.Booking.update(bookingId, {
      scheduled_date: newDate,
      scheduled_start_time: newStartTime,
      scheduled_end_time: newEndTime,
      admin_notes: (booking.admin_notes || '') + rescheduleNote,
    });

    // --- Update TimeBlocks linked to this booking ---
    try {
      const blocks = await base44.asServiceRole.entities.TimeBlock.filter({ booking_id: bookingId });
      for (const block of blocks || []) {
        const isTravel = block.block_type === 'travel';
        await base44.asServiceRole.entities.TimeBlock.update(block.id, {
          date: newDate,
          start_time: isTravel ? newEndTime : newStartTime,
          end_time: isTravel ? block.end_time : newEndTime,
        });
      }
    } catch (blockErr) {
      console.error('TimeBlock update failed (non-blocking):', blockErr);
    }

    // --- Update Google Calendar event ---
    if (booking.google_calendar_event_id) {
      try {
        const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');
        const startDateTime = `${newDate}T${to24h(newStartTime)}:00`;
        const endDateTime = `${newDate}T${to24h(newEndTime)}:00`;

        const calRes = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events/${booking.google_calendar_event_id}?sendUpdates=${notifyClient ? 'all' : 'none'}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              start: { dateTime: startDateTime, timeZone: 'America/New_York' },
              end: { dateTime: endDateTime, timeZone: 'America/New_York' },
              description: [
                booking.client_address ? `Address: ${booking.client_address}` : null,
                reason ? `Reschedule reason: ${reason}` : null,
              ].filter(Boolean).join('\n'),
            }),
          }
        );
        if (!calRes.ok) {
          const err = await calRes.text();
          console.error('Google Calendar update failed:', err);
        }
      } catch (calErr) {
        console.error('Calendar sync failed (non-blocking):', calErr);
      }
    }

    // --- Format display date for notifications ---
    const displayDate = new Date(newDate + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
    const oldDisplayDate = new Date(oldDate + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

    // --- Notify client (only if provider said Yes) ---
    if (notifyClient) {
      // SMS — only if client opted in
      const smsOptIn = booking.intake_answers?.sms_opt_in !== false;
      if (smsOptIn && booking.client_phone) {
        try {
          const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
          const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
          const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

          const smsBody = reason
            ? `Hi ${booking.client_name}! Your Clean Slate Club visit has been rescheduled to ${displayDate} at ${newStartTime}. Reason: ${reason}. Questions? Text us at (206) 825-4061. Reply STOP to opt out.`
            : `Hi ${booking.client_name}! Your Clean Slate Club visit has been rescheduled to ${displayDate} at ${newStartTime}. Questions? Text us at (206) 825-4061. Reply STOP to opt out.`;

          const auth = btoa(`${accountSid}:${authToken}`);
          await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
            {
              method: 'POST',
              headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({
                From: fromNumber,
                To: booking.client_phone,
                Body: smsBody,
              }).toString(),
            }
          );
        } catch (smsErr) {
          console.error('SMS send failed (non-blocking):', smsErr);
        }
      }

      // Email to client
      if (booking.client_email) {
        try {
          const emailBody = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
<style>
  body{margin:0;padding:0;background:#fdfcfb;font-family:'Lato',sans-serif;color:#333;}
  .wrapper{max-width:600px;margin:0 auto;background:#fdfcfb;}
  .header{background:linear-gradient(135deg,#EB9486 0%,#fcd5ce 60%,#ece4db 100%);padding:40px;text-align:center;}
  .brand-name{font-family:'Montserrat',sans-serif;font-size:13px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#fff;margin:0 0 2px;}
  .brand-sub{font-family:'Montserrat',sans-serif;font-size:26px;font-weight:300;color:#fff;margin:0;}
  .body{padding:36px 40px;}
  .greeting{font-family:'Montserrat',sans-serif;font-size:22px;font-weight:600;color:#333;margin:0 0 12px;}
  p{font-family:'Lato',sans-serif;font-size:15px;font-weight:300;color:#555;line-height:1.7;margin:0 0 16px;}
  .card{background:#fff;border:1px solid #f0e8e4;border-radius:16px;padding:22px 24px;margin:20px 0;}
  .card-label{font-family:'Montserrat',sans-serif;font-size:10px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#EB9486;margin:0 0 10px;}
  .card-value{font-family:'Lato',sans-serif;font-size:15px;color:#333;margin:0 0 6px;line-height:1.6;}
  .card-value.muted{color:#999;font-size:13px;text-decoration:line-through;}
  .footer{background:#f9f4f2;padding:28px 40px;text-align:center;border-top:1px solid #f0e8e4;}
  .footer p{font-size:12px;font-weight:300;color:#aaa;margin:0 0 4px;}
</style></head>
<body><div class="wrapper">
  <div class="header">
    <p class="brand-name">Clean Slate</p>
    <p class="brand-sub">Club™</p>
  </div>
  <div class="body">
    <p class="greeting">Your visit has been rescheduled 📅</p>
    <p>No worries — your upcoming visit has been moved to a new time. Here are your updated details:</p>
    <div class="card">
      <p class="card-label">Previous Date &amp; Time</p>
      <p class="card-value muted">${oldDisplayDate} at ${oldStart}</p>
      <p class="card-label" style="margin-top:14px;">New Date &amp; Time</p>
      <p class="card-value"><strong>${displayDate} at ${newStartTime}</strong></p>
      ${booking.client_address ? `<p class="card-label" style="margin-top:14px;">Location</p><p class="card-value">${booking.client_address}</p>` : ''}
      ${reason ? `<p class="card-label" style="margin-top:14px;">Reason</p><p class="card-value">${reason}</p>` : ''}
    </div>
    <p style="font-size:14px;color:#888;font-weight:300;">If this doesn’t work for you, just reply to this email or text us and we’ll sort it out.</p>
    <p style="font-size:13px;color:#aaa;margin-top:24px;font-weight:300;">With care,<br><strong style="color:#EB9486;font-family:'Montserrat',sans-serif;font-weight:600;">Masha</strong><br>Clean Slate Club™</p>
  </div>
  <div class="footer">
    <p>Questions? Reply to this email or text us at (206) 825-4061</p>
    <p>cleanslateclubpa@gmail.com · cleanslateclub.co</p>
  </div>
</div></body></html>`;

          await base44.asServiceRole.integrations.Core.SendEmail({
            to: booking.client_email,
            subject: `Your Clean Slate Club visit has been rescheduled — ${displayDate}`,
            body: emailBody,
          });
        } catch (emailErr) {
          console.error('Client email failed (non-blocking):', emailErr);
        }
      }
    }

    // --- Always notify admin ---
    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: 'cleanslateclubpa@gmail.com',
        subject: `📅 Booking rescheduled by ${rescheduledBy || 'Provider'} — ${booking.client_name}`,
        body: [
          `A booking has been rescheduled.`,
          ``,
          `Client: ${booking.client_name}`,
          `Rescheduled by: ${rescheduledBy || 'Provider'}`,
          `From: ${oldDisplayDate} at ${oldStart}`,
          `To: ${displayDate} at ${newStartTime}`,
          reason ? `Reason: ${reason}` : null,
          `Client notified: ${notifyClient ? 'Yes (SMS + Email)' : 'No'}`,
          ``,
          `View in dashboard: https://cleanslateclub.co/admin`,
        ].filter(Boolean).join('\n'),
      });
    } catch (adminEmailErr) {
      console.error('Admin email failed (non-blocking):', adminEmailErr);
    }

    return Response.json({
      success: true,
      message: `Booking rescheduled to ${displayDate} at ${newStartTime}. Client ${notifyClient ? 'was' : 'was not'} notified.`,
    });

  } catch (error) {
    console.error('rescheduleBooking error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});
