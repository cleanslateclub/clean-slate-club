import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ─── Helpers ────────────────────────────────────────────────────────────────

// FIX 5: Normalize any phone format to E.164
function toE164(phone) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return null;
}

// FIX 9: Parse "10:00 AM" or "14:00" → "14:00" (24-hour HH:MM)
function parseTimeTo24h(timeStr) {
  if (!timeStr || timeStr === 'TBD') return null;
  const ampm = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (ampm) {
    let h = parseInt(ampm[1], 10);
    const m = ampm[2];
    const period = ampm[3].toUpperCase();
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:${m}`;
  }
  return timeStr;
}

// FIX 1: DST-aware ET parser — no hardcoded -04:00 offset
// Converts a stored ET local date+time to a UTC Date object
function parseAsEastern(dateStr, timeStr) {
  const time24 = parseTimeTo24h(timeStr);
  if (!time24) return null;
  // Treat as UTC first to get a reference point
  const utcRef = new Date(`${dateStr}T${time24}:00Z`);
  // Get ET and UTC string representations to compute the real offset
  const etStr  = utcRef.toLocaleString('en-US', { timeZone: 'America/New_York' });
  const utcStr = utcRef.toLocaleString('en-US', { timeZone: 'UTC' });
  const offsetMs = new Date(utcStr) - new Date(etStr);
  // Apply offset to get the correct UTC moment
  return new Date(utcRef.getTime() + offsetMs);
}

// ─── Twilio SMS ──────────────────────────────────────────────────────────────

// FIX 3: Throws on Twilio error instead of silently ignoring it
async function sendSms(accountSid, authToken, from, to, body) {
  const auth = btoa(`${accountSid}:${authToken}`);
  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ From: from, To: to, Body: body }).toString(),
    }
  );
  const result = await res.json();
  if (!res.ok) {
    throw new Error(`Twilio ${res.status}: ${result.message || JSON.stringify(result)}`);
  }
  return result;
}

// ─── Email templates ─────────────────────────────────────────────────────────

// FIX 8: Removed emoji parameter — garbled on copy-paste and unreliable in email clients
const brandedEmailHeader = (headline, subline) => `
  <div style="background:linear-gradient(135deg,#EB9486 0%,#EFB988 40%,#CAE7B9 100%);padding:44px 40px 36px;text-align:center;">
    <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
      <span style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:rgba(255,255,255,0.9);">CLEAN SLATE</span>
      <span style="font-family:Georgia,'Times New Roman',serif;font-size:24px;font-style:italic;color:#fff;margin-left:7px;">Club</span>
    </td></tr></table>
    <div style="height:1px;background:rgba(255,255,255,0.3);margin:14px auto;max-width:180px;"></div>
    <p style="margin:0;font-family:Arial,sans-serif;font-size:24px;font-weight:700;color:#fff;">${headline}</p>
    ${subline ? `<p style="margin:8px 0 0;font-family:Arial,sans-serif;font-size:14px;color:rgba(255,255,255,0.85);">${subline}</p>` : ''}
  </div>
`;

const brandedFooter = `
  <div style="background:linear-gradient(135deg,#fdf0ee,#f9f4f2);padding:22px 40px;text-align:center;border-top:1px solid #f0e8e4;">
    <p style="font-family:Arial,sans-serif;font-size:11px;color:#bbb;margin:0 0 3px;">Need to reschedule? Reply to this email or text (206) 825-4061</p>
    <p style="font-family:Arial,sans-serif;font-size:11px;color:#ccc;margin:0;">cleanslateclubpa@gmail.com &middot; <a href="https://cleanslateclub.co" style="color:#EB9486;text-decoration:none;">cleanslateclub.co</a></p>
  </div>
`;

// ─── Main ────────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { reminderType } = await req.json();

    // FIX 11: Validate reminderType up front
    const VALID_TYPES = ['48hr_email', '24hr_sms', '1hr_sms'];
    if (!VALID_TYPES.includes(reminderType)) {
      return Response.json(
        { error: `Invalid reminderType. Must be one of: ${VALID_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // FIX 6: Validate Twilio env vars before doing any work
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken  = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (reminderType !== '48hr_email' && (!accountSid || !authToken || !fromNumber)) {
      console.error('sendConsultReminders: Missing Twilio env vars');
      return Response.json({ error: 'SMS service not configured.' }, { status: 500 });
    }

    const allBookings = await base44.asServiceRole.entities.Booking.list('-scheduled_date', 200);

    // FIX 2: Filter by service_category === 'consult', not admin_notes text match
    const consults = allBookings.filter(b =>
      b.service_category === 'consult' &&
      (b.status === 'pending' || b.status === 'confirmed') &&
      b.scheduled_date &&
      b.scheduled_start_time &&
      b.scheduled_start_time !== 'TBD'
    );

    const now = new Date();
    const results = [];
    const errors  = [];

    for (const booking of consults) {
      // FIX 4: Per-booking try/catch — one failure never stops the rest
      try {
        // FIX 1 + 9: DST-aware parse, handles "10:00 AM" format
        const consultDt = parseAsEastern(booking.scheduled_date, booking.scheduled_start_time);
        if (!consultDt || isNaN(consultDt.getTime())) {
          console.warn(`Skipping ${booking.id} — unparseable time: ${booking.scheduled_date} ${booking.scheduled_start_time}`);
          continue;
        }

        const hoursUntil = (consultDt - now) / (1000 * 60 * 60);

        // ── 48hr email ────────────────────────────────────────────────────
        if (reminderType === '48hr_email') {
          if (hoursUntil < 44 || hoursUntil > 52) continue;

          const displayDate = consultDt.toLocaleDateString('en-US', {
            weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/New_York'
          });
          const displayTime = consultDt.toLocaleTimeString('en-US', {
            hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York'
          });

          const emailBody = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#fdfcfb;">
<div style="max-width:580px;margin:0 auto;background:#fdfcfb;">
  ${brandedEmailHeader(`See you soon, ${booking.client_name}!`, 'Your free consult is in 2 days')}
  <div style="padding:36px 40px;">
    <p style="font-family:Arial,sans-serif;font-size:15px;font-weight:300;color:#555;line-height:1.7;margin:0 0 24px;">
      Your free 15-minute consult is coming up in <strong>2 days</strong>. We cannot wait to connect with you!
    </p>

    <div style="background:linear-gradient(135deg,#fff8f7,#fff);border:1px solid #fcd5ce;border-left:4px solid #EB9486;border-radius:0 16px 16px 0;padding:22px 24px;margin-bottom:20px;">
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#EB9486;">Your Consult</p>
      <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:18px;font-weight:700;color:#333;">${displayDate}</p>
      <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#888;">${displayTime} &middot; 15-minute call</p>
    </div>

    <div style="background:#f3faf0;border:1px solid #CAE7B9;border-radius:16px;padding:20px 22px;margin-bottom:20px;">
      <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#5a8f4a;">What Happens</p>
      <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:13px;color:#555;">We will call you at <strong>${booking.client_phone}</strong> at the time above.</p>
      <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:13px;color:#555;">No prep needed -- just show up as you are.</p>
      <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#555;">We will listen, understand, and build a plan together.</p>
    </div>

    <div style="background:linear-gradient(135deg,#fdf8f0,#fffef9);border:1px solid #F3DE8A;border-radius:16px;padding:18px 20px;margin-bottom:24px;">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#856a00;font-style:italic;">
        "This is not a sales call. It is a real conversation -- because great support starts with actually listening."
      </p>
    </div>

    <p style="font-family:Arial,sans-serif;font-size:14px;color:#999;margin:0 0 8px;">
      Need to reschedule? Reply to this email or text (206) 825-4061 and we will sort it out.
    </p>
    <p style="font-family:Arial,sans-serif;font-size:13px;color:#aaa;margin:0;">
      With care,<br>
      <strong style="color:#EB9486;font-weight:700;">The Clean Slate Club Team</strong>
    </p>
  </div>
  ${brandedFooter}
</div></body></html>`;

          await base44.asServiceRole.integrations.Core.SendEmail({
            to: booking.client_email,
            subject: `Your free consult is in 2 days -- Clean Slate Club`,
            body: emailBody,
          });

          results.push({ id: booking.id, name: booking.client_name, sent: '48hr_email' });

        // ── 24hr SMS ──────────────────────────────────────────────────────
        } else if (reminderType === '24hr_sms') {
          if (hoursUntil < 20 || hoursUntil > 28) continue;

          // FIX 10: Cleaner opt-in check — only skip if explicitly false
          if (booking.intake_answers?.sms_opt_in === false) continue;

          // FIX 5: Normalize to E.164
          const toNumber = toE164(booking.client_phone);
          if (!toNumber) {
            console.warn(`Skipping 24hr SMS for ${booking.id} — invalid phone: ${booking.client_phone}`);
            continue;
          }

          const displayDate = consultDt.toLocaleDateString('en-US', {
            weekday: 'long', month: 'short', day: 'numeric', timeZone: 'America/New_York'
          });
          const displayTime = consultDt.toLocaleTimeString('en-US', {
            hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York'
          });

          // FIX 7: No emojis — plain ASCII keeps messages under 160 chars (1 segment)
          await sendSms(
            accountSid, authToken, fromNumber, toNumber,
            `Hi ${booking.client_name}, reminder that your free Clean Slate Club consult is tomorrow, ${displayDate} at ${displayTime}. We will call you at this number. Questions? Call or text (206) 825-4061. Reply STOP to unsubscribe.`
          );

          results.push({ id: booking.id, name: booking.client_name, sent: '24hr_sms' });

        // ── 1hr SMS ───────────────────────────────────────────────────────
        } else if (reminderType === '1hr_sms') {
          if (hoursUntil < 0.75 || hoursUntil > 1.5) continue;

          // FIX 10: Cleaner opt-in check
          if (booking.intake_answers?.sms_opt_in === false) continue;

          // FIX 5: Normalize to E.164
          const toNumber = toE164(booking.client_phone);
          if (!toNumber) {
            console.warn(`Skipping 1hr SMS for ${booking.id} — invalid phone: ${booking.client_phone}`);
            continue;
          }

          const displayTime = consultDt.toLocaleTimeString('en-US', {
            hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York'
          });

          // FIX 7: No emojis — plain ASCII
          await sendSms(
            accountSid, authToken, fromNumber, toNumber,
            `Hi ${booking.client_name}, your Clean Slate Club consult is in about 1 hour at ${displayTime}. We are looking forward to connecting! Questions? Call or text (206) 825-4061. Reply STOP to unsubscribe.`
          );

          results.push({ id: booking.id, name: booking.client_name, sent: '1hr_sms' });
        }

      } catch (bookingErr) {
        // FIX 4: Log and continue — never let one booking fail the whole batch
        console.error(`Error on booking ${booking.id} (${booking.client_name}):`, bookingErr.message);
        errors.push({ id: booking.id, name: booking.client_name, error: bookingErr.message });
      }
    }

    return Response.json({
      success: true,
      reminderType,
      sent: results.length,
      failed: errors.length,
      results,
      errors,
    });

  } catch (error) {
    console.error('sendConsultReminders fatal error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
