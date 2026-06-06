import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

async function sendSms(accountSid, authToken, from, to, body) {
  const auth = btoa(`${accountSid}:${authToken}`);
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ From: from, To: to, Body: body }).toString(),
  });
  return res.json();
}

const brandedEmailHeader = (emoji, headline, subline) => `
  <div style="background:linear-gradient(135deg,#EB9486 0%,#EFB988 40%,#CAE7B9 100%);padding:44px 40px 36px;text-align:center;">
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
      <span style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.9);">CLEAN SLATE</span>
      <span style="font-family:Georgia,'Times New Roman',serif;font-size:24px;font-style:italic;color:#fff;margin-left:7px;">Club</span>
    </td></tr></table>
    <div style="height:1px;background:rgba(255,255,255,0.3);margin:14px auto;max-width:180px;"></div>
    <p style="margin:0;font-family:Arial,sans-serif;font-size:24px;font-weight:700;color:#fff;">${emoji} ${headline}</p>
    ${subline ? `<p style="margin:8px 0 0;font-family:Arial,sans-serif;font-size:14px;color:rgba(255,255,255,0.85);">${subline}</p>` : ''}
  </div>
`;

const brandedFooter = `
  <div style="background:linear-gradient(135deg,#fdf0ee,#f9f4f2);padding:22px 40px;text-align:center;border-top:1px solid #f0e8e4;">
    <p style="font-family:Arial,sans-serif;font-size:11px;color:#bbb;margin:0 0 3px;">Need to reschedule? Reply to this email or text (206) 825-4061</p>
    <p style="font-family:Arial,sans-serif;font-size:11px;color:#ccc;margin:0;">cleanslateclubpa@gmail.com · <a href="https://cleanslateclub.co" style="color:#EB9486;text-decoration:none;">cleanslateclub.co</a></p>
  </div>
`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { reminderType } = await req.json();

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

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
      const consultDt = new Date(`${booking.scheduled_date}T${booking.scheduled_start_time}:00-04:00`);
      const hoursUntil = (consultDt - now) / (1000 * 60 * 60);

      if (reminderType === '48hr_email') {
        if (hoursUntil < 44 || hoursUntil > 52) continue;

        const displayDate = consultDt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/New_York' });
        const displayTime = consultDt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' });

        const emailBody = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#fdfcfb;">
<div style="max-width:580px;margin:0 auto;background:#fdfcfb;">
  ${brandedEmailHeader('🌿', `See you soon, ${booking.client_name}!`, 'Your free consult is in 2 days')}
  <div style="padding:36px 40px;">
    <p style="font-family:Arial,sans-serif;font-size:15px;font-weight:300;color:#555;line-height:1.7;margin:0 0 24px;">
      Your free 15-minute consult is coming up in <strong>2 days</strong>. We can't wait to connect with you! Here's what to expect:
    </p>

    <!-- Date card -->
    <div style="background:linear-gradient(135deg,#fff8f7,#fff);border:1px solid #fcd5ce;border-left:4px solid #EB9486;border-radius:0 16px 16px 0;padding:22px 24px;margin-bottom:20px;">
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#EB9486;">Your Consult</p>
      <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:18px;font-weight:700;color:#333;">${displayDate}</p>
      <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#888;">${displayTime} · 15-minute call</p>
    </div>

    <!-- How it works -->
    <div style="background:#f3faf0;border:1px solid #CAE7B9;border-radius:16px;padding:20px 22px;margin-bottom:20px;">
      <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#5a8f4a;">What Happens</p>
      <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:13px;color:#555;">📞 We'll call you at <strong>${booking.client_phone}</strong> at the time above.</p>
      <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:13px;color:#555;">🌿 No prep needed — just show up as you are.</p>
      <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#555;">💬 We'll listen, understand, and build a plan together.</p>
    </div>

    <div style="background:linear-gradient(135deg,#fdf8f0,#fffef9);border:1px solid #F3DE8A;border-radius:16px;padding:18px 20px;margin-bottom:24px;">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#856a00;font-style:italic;">
        "This isn't a sales call. It's a real conversation — because great support starts with actually listening."
      </p>
    </div>

    <p style="font-family:Arial,sans-serif;font-size:14px;color:#999;margin:0 0 8px;">Need to reschedule? Reply to this email or text (206) 825-4061 and we'll sort it out.</p>
    <p style="font-family:Arial,sans-serif;font-size:13px;color:#aaa;margin:0;">With care,<br><strong style="color:#EB9486;font-weight:700;">The Clean Slate Club Team</strong></p>
  </div>
  ${brandedFooter}
</div></body></html>`;

        await base44.asServiceRole.integrations.Core.SendEmail({
          to: booking.client_email,
          subject: `Your free consult is in 2 days — Clean Slate Club™`,
          body: emailBody
        });

        results.push({ id: booking.id, name: booking.client_name, sent: '48hr_email' });

      } else if (reminderType === '24hr_sms') {
        if (hoursUntil < 20 || hoursUntil > 28) continue;
        if (!booking.intake_answers?.sms_opt_in && booking.intake_answers?.sms_opt_in !== undefined) continue;

        const displayDate = consultDt.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', timeZone: 'America/New_York' });
        const displayTime = consultDt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' });

        await sendSms(accountSid, authToken, fromNumber, booking.client_phone,
          `Hi ${booking.client_name}! 🌿 Reminder — your FREE Clean Slate Club consult is tomorrow, ${displayDate} at ${displayTime}. We'll call you at this number. Can't wait to chat! ✨ cleanslateclub.co | Reply STOP to opt out.`
        );

        results.push({ id: booking.id, name: booking.client_name, sent: '24hr_sms' });

      } else if (reminderType === '1hr_sms') {
        if (hoursUntil < 0.75 || hoursUntil > 1.5) continue;
        if (!booking.intake_answers?.sms_opt_in && booking.intake_answers?.sms_opt_in !== undefined) continue;

        const displayTime = consultDt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' });

        await sendSms(accountSid, authToken, fromNumber, booking.client_phone,
          `Hi ${booking.client_name}! 🌿 Your Clean Slate Club consult is in about 1 hour (${displayTime}). We're looking forward to connecting! ✨ cleanslateclub.co | Reply STOP to opt out.`
        );

        results.push({ id: booking.id, name: booking.client_name, sent: '1hr_sms' });
      }
    }

    return Response.json({ success: true, reminderType, sent: results.length, results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});