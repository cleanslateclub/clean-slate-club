import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const TEAM_EMAIL = 'cleanslateclubpa@gmail.com';
const TEAM_PHONE = '2068254061'; // used when SMS is configured

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const booking = body.data;

    if (!booking) {
      return Response.json({ skipped: 'no booking data' });
    }

    const serviceLabel = booking.service_category
      ?.replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase()) || 'Unknown Service';

    const isConsult = !booking.scheduled_date || booking.scheduled_start_time === 'TBD';
    const tasks = booking.intake_answers?._tasks || [];
    const addons = booking.addons || [];

    const dateStr = isConsult
      ? 'Date TBD (Consult Request)'
      : new Date(booking.scheduled_date + 'T00:00:00').toLocaleDateString('en-US', {
          weekday: 'long', month: 'long', day: 'numeric'
        });

    const timeStr = isConsult
      ? 'Time TBD'
      : `${booking.scheduled_start_time} – ${booking.scheduled_end_time || 'TBD'}`;

    // --- Email notification ---
    const emailSubject = isConsult
      ? `🌿 New Consult Request — ${booking.client_name}`
      : `✨ New Booking: ${serviceLabel} — ${booking.client_name} on ${dateStr}`;

    const emailBody = `
<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  body{margin:0;padding:0;background:#fdfcfb;font-family:'Arial',sans-serif;color:#333;}
  .wrap{max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #f0e8e4;}
  .header{background:linear-gradient(135deg,#EB9486,#fcd5ce);padding:28px 32px;}
  .header h1{margin:0;font-size:18px;font-weight:700;color:#fff;letter-spacing:0.02em;}
  .header p{margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.85);}
  .body{padding:28px 32px;}
  .badge{display:inline-block;background:#fdf0ee;border:1px solid #fcd5ce;border-radius:20px;padding:4px 12px;font-size:12px;color:#EB9486;font-weight:600;margin-bottom:16px;}
  .section{margin-bottom:20px;}
  .label{font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#EB9486;margin-bottom:6px;}
  .value{font-size:14px;color:#333;line-height:1.6;}
  .value.light{color:#666;}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
  .cta{display:inline-block;margin-top:8px;background:#EB9486;color:#fff;font-size:13px;font-weight:600;padding:12px 24px;border-radius:50px;text-decoration:none;}
  .footer{background:#f9f4f2;padding:16px 32px;font-size:11px;color:#aaa;border-top:1px solid #f0e8e4;}
</style></head>
<body><div class="wrap">
  <div class="header">
    <h1>${isConsult ? '🌿 New Consult Request' : '✨ New Booking'}</h1>
    <p>${serviceLabel}${!isConsult ? ` · ${dateStr}` : ''}</p>
  </div>
  <div class="body">
    <div class="badge">${booking.status?.toUpperCase() || 'PENDING'}</div>

    <div class="grid">
      <div class="section">
        <div class="label">Client</div>
        <div class="value">${booking.client_name}</div>
      </div>
      <div class="section">
        <div class="label">Service</div>
        <div class="value">${serviceLabel}</div>
      </div>
      <div class="section">
        <div class="label">Email</div>
        <div class="value light">${booking.client_email}</div>
      </div>
      <div class="section">
        <div class="label">Phone</div>
        <div class="value light">${booking.client_phone || '—'}</div>
      </div>
      ${!isConsult ? `
      <div class="section">
        <div class="label">Date & Time</div>
        <div class="value">${dateStr}</div>
        <div class="value light">${timeStr}</div>
      </div>
      <div class="section">
        <div class="label">Quoted Cost</div>
        <div class="value">$${booking.estimated_price_low || 0}–$${booking.estimated_price_high || 0}</div>
      </div>
      ` : ''}
    </div>

    ${booking.client_address ? `
    <div class="section">
      <div class="label">Address</div>
      <div class="value light">${booking.client_address}</div>
    </div>` : ''}

    ${tasks.length > 0 ? `
    <div class="section">
      <div class="label">Tasks Requested</div>
      <div class="value light">${tasks.join(' · ')}</div>
    </div>` : ''}

    ${addons.length > 0 ? `
    <div class="section">
      <div class="label">Add-ons</div>
      <div class="value light">${addons.join(', ')}</div>
    </div>` : ''}

    ${booking.special_notes ? `
    <div class="section">
      <div class="label">Notes</div>
      <div class="value light">${booking.special_notes}</div>
    </div>` : ''}

    ${isConsult && booking.intake_answers ? `
    <div class="section">
      <div class="label">Preferred Contact</div>
      <div class="value light">${booking.intake_answers.preferred_contact || '—'}</div>
    </div>
    <div class="section">
      <div class="label">Availability</div>
      <div class="value light">${booking.intake_answers.availability_notes || '—'}</div>
    </div>` : ''}

    <a class="cta" href="https://cleanslateclubpa.com/admin">View in Dashboard →</a>
  </div>
  <div class="footer">Clean Slate Club™ · cleanslateclubpa@gmail.com · (206) 825-4061</div>
</div></body></html>`;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: TEAM_EMAIL,
      subject: emailSubject,
      body: emailBody,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});