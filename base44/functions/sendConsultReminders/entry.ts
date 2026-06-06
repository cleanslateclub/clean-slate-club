import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Shared Twilio SMS helper
async function sendSms(accountSid, authToken, from, to, body) {
  const auth = btoa(`${accountSid}:${authToken}`);
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ From: from, To: to, Body: body }).toString(),
  });
  return res.json();
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { reminderType } = await req.json(); // '48hr_email' | '24hr_sms' | '1hr_sms'

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    // Find all confirmed/pending consult bookings
    // Consults are stored as service_category = 'home_reset' with admin_notes starting with "CONSULT"
    const bookings = await base44.asServiceRole.entities.Booking.list('-scheduled_date', 200);
    const consults = bookings.filter(b =>
      b.admin_notes?.startsWith('CONSULT') &&
      (b.status === 'pending' || b.status === 'confirmed') &&
      b.scheduled_date &&
      b.scheduled_start_time !== 'TBD'
    );

    const now = new Date();
    const results = [];

    for (const booking of consults) {
      // Build consult datetime in ET
      const consultDt = new Date(`${booking.scheduled_date}T${booking.scheduled_start_time}:00-04:00`);
      const hoursUntil = (consultDt - now) / (1000 * 60 * 60);

      if (reminderType === '48hr_email') {
        // Send if 44–52 hours out (8hr window centered on 48hr)
        if (hoursUntil < 44 || hoursUntil > 52) continue;

        const displayDate = consultDt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/New_York' });
        const displayTime = consultDt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' });

        await base44.asServiceRole.integrations.Core.SendEmail({
          to: booking.client_email,
          subject: `Your free consult is in 2 days — Clean Slate Club™`,
          body: `<!DOCTYPE html><html><body style="font-family:Lato,sans-serif;background:#fdfcfb;color:#333;margin:0;padding:0;">
<div style="max-width:560px;margin:0 auto;padding:40px 20px;">
  <div style="background:linear-gradient(135deg,#EB9486,#fcd5ce);padding:32px;border-radius:16px;text-align:center;margin-bottom:24px;">
    <p style="font-family:Montserrat,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#fff;margin:0 0 4px;">Clean Slate Club™</p>
    <p style="font-family:Montserrat,sans-serif;font-size:22px;font-weight:300;color:#fff;margin:0;">See you soon, ${booking.client_name}! 🌿</p>
  </div>
  <p style="font-size:15px;font-weight:300;color:#555;line-height:1.7;margin:0 0 20px;">Your free 15-minute consult is coming up in <strong>2 days</strong>. Here's a quick reminder of what to expect:</p>
  <div style="background:#fff;border:1px solid #f0e8e4;border-radius:16px;padding:22px 24px;margin-bottom:20px;">
    <p style="font-family:Montserrat,sans-serif;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#EB9486;margin:0 0 10px;">Your Consult</p>
    <p style="font-size:16px;font-weight:600;color:#333;margin:0 0 4px;">${displayDate}</p>
    <p style="font-size:14px;font-weight:300;color:#777;margin:0;">${displayTime} (15 min call)</p>
  </div>
  <p style="font-size:14px;font-weight:300;color:#777;line-height:1.7;">We'll call you at <strong>${booking.client_phone}</strong> to kick things off. No prep needed — just show up as you are.</p>
  <p style="font-size:13px;color:#aaa;margin-top:24px;">Need to reschedule? Reply to this email or text (206) 825-4061.</p>
  <p style="font-size:13px;font-weight:300;color:#888;margin-top:24px;">With care,<br><strong style="color:#EB9486;font-family:Montserrat,sans-serif;">The Clean Slate Club Team</strong></p>
</div></body></html>`
        });

        results.push({ id: booking.id, name: booking.client_name, sent: '48hr_email' });

      } else if (reminderType === '24hr_sms') {
        // Send if 20–28 hours out
        if (hoursUntil < 20 || hoursUntil > 28) continue;
        if (!booking.intake_answers?.sms_opt_in && booking.intake_answers?.sms_opt_in !== undefined) continue;

        const displayDate = consultDt.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'America/New_York' });
        const displayTime = consultDt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' });

        await sendSms(accountSid, authToken, fromNumber, booking.client_phone,
          `Hi ${booking.client_name}! 🌿 Just a reminder — your free Clean Slate consult is tomorrow, ${displayDate} at ${displayTime}. We'll call you at this number. See you then! Reply STOP to opt out.`
        );

        results.push({ id: booking.id, name: booking.client_name, sent: '24hr_sms' });

      } else if (reminderType === '1hr_sms') {
        // Send if 0.75–1.5 hours out
        if (hoursUntil < 0.75 || hoursUntil > 1.5) continue;
        if (!booking.intake_answers?.sms_opt_in && booking.intake_answers?.sms_opt_in !== undefined) continue;

        const displayTime = consultDt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' });

        await sendSms(accountSid, authToken, fromNumber, booking.client_phone,
          `Hi ${booking.client_name}! Your Clean Slate consult starts in about 1 hour (${displayTime}). We're looking forward to connecting! Reply STOP to opt out.`
        );

        results.push({ id: booking.id, name: booking.client_name, sent: '1hr_sms' });
      }
    }

    return Response.json({ success: true, reminderType, sent: results.length, results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});