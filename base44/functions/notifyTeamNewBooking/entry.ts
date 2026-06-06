import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const TEAM_EMAIL = 'cleanslateclubpa@gmail.com';

const emailHeader = (title, subtitle) => `
  <div style="background:linear-gradient(135deg,#EB9486 0%,#EFB988 40%,#CAE7B9 100%);padding:40px 32px 32px;text-align:center;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center">
      <span style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.9);">CLEAN SLATE</span>
      <span style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-style:italic;color:#fff;margin-left:6px;font-weight:400;">Club</span>
    </td></tr></table>
    <div style="height:1px;background:rgba(255,255,255,0.25);margin:14px auto;max-width:200px;"></div>
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:700;color:#fff;letter-spacing:0.02em;">${title}</p>
    ${subtitle ? `<p style="margin:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:rgba(255,255,255,0.85);">${subtitle}</p>` : ''}
  </div>
`;

const emailFooter = `
  <div style="background:#f9f4f2;padding:20px 32px;text-align:center;border-top:1px solid #f0e8e4;">
    <p style="font-family:Arial,sans-serif;font-size:11px;color:#aaa;margin:0 0 4px;">Clean Slate Club™ · cleanslateclubpa@gmail.com · (206) 825-4061</p>
    <p style="font-family:Arial,sans-serif;font-size:11px;color:#bbb;margin:0;">cleanslateclub.co</p>
  </div>
`;

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

    const emailSubject = isConsult
      ? `🌿 New Consult Request — ${booking.client_name}`
      : `✨ New Booking: ${serviceLabel} — ${booking.client_name} on ${dateStr}`;

    const serviceColors = {
      home_reset: '#EB9486',
      mothers_helper: '#EFB988',
      errands: '#CAE7B9',
      senior_support: '#B58A90',
      meal_prep: '#F3DE8A',
      organization: '#7E7F9A',
    };
    const accentColor = serviceColors[booking.service_category] || '#EB9486';

    const emailBody = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#fdfcfb;">
<div style="max-width:580px;margin:0 auto;background:#fdfcfb;font-family:Arial,Helvetica,sans-serif;">
  ${emailHeader(isConsult ? '🌿 New Consult Request' : '✨ New Booking', `${serviceLabel}${!isConsult ? ` · ${dateStr}` : ''}`)}

  <div style="padding:32px;">
    <!-- Status badge -->
    <div style="display:inline-block;background:${accentColor}22;border:1px solid ${accentColor}55;border-radius:20px;padding:5px 14px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${accentColor};margin-bottom:20px;">
      ${booking.status?.toUpperCase() || 'PENDING'}
    </div>

    <!-- Client info grid -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td width="50%" style="padding:0 8px 16px 0;vertical-align:top;">
          <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${accentColor};">Client</p>
          <p style="margin:0;font-size:15px;color:#333;font-weight:600;">${booking.client_name}</p>
        </td>
        <td width="50%" style="padding:0 0 16px 8px;vertical-align:top;">
          <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${accentColor};">Service</p>
          <p style="margin:0;font-size:15px;color:#333;font-weight:600;">${serviceLabel}</p>
        </td>
      </tr>
      <tr>
        <td width="50%" style="padding:0 8px 16px 0;vertical-align:top;">
          <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${accentColor};">Email</p>
          <p style="margin:0;font-size:13px;color:#666;">${booking.client_email}</p>
        </td>
        <td width="50%" style="padding:0 0 16px 8px;vertical-align:top;">
          <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${accentColor};">Phone</p>
          <p style="margin:0;font-size:13px;color:#666;">${booking.client_phone || '—'}</p>
        </td>
      </tr>
      ${!isConsult ? `
      <tr>
        <td width="50%" style="padding:0 8px 0 0;vertical-align:top;">
          <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${accentColor};">Date & Time</p>
          <p style="margin:0;font-size:14px;color:#333;font-weight:600;">${dateStr}</p>
          <p style="margin:2px 0 0;font-size:13px;color:#666;">${timeStr}</p>
        </td>
        <td width="50%" style="padding:0 0 0 8px;vertical-align:top;">
          <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${accentColor};">Quoted Cost</p>
          <p style="margin:0;font-size:18px;font-weight:700;color:${accentColor};">$${booking.estimated_price_low || 0}–$${booking.estimated_price_high || 0}</p>
        </td>
      </tr>` : ''}
    </table>

    ${booking.client_address ? `
    <div style="background:#fff;border:1px solid #f0e8e4;border-left:3px solid ${accentColor};border-radius:0 12px 12px 0;padding:14px 18px;margin-bottom:16px;">
      <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${accentColor};">Address</p>
      <p style="margin:0;font-size:14px;color:#555;">${booking.client_address}</p>
    </div>` : ''}

    ${tasks.length > 0 ? `
    <div style="background:#fff;border:1px solid #f0e8e4;border-left:3px solid ${accentColor};border-radius:0 12px 12px 0;padding:14px 18px;margin-bottom:16px;">
      <p style="margin:0 0 8px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${accentColor};">Tasks Requested</p>
      <p style="margin:0;font-size:13px;color:#666;line-height:1.6;">${tasks.join(' · ')}</p>
    </div>` : ''}

    ${addons.length > 0 ? `
    <div style="background:#fff;border:1px solid #f0e8e4;border-left:3px solid ${accentColor};border-radius:0 12px 12px 0;padding:14px 18px;margin-bottom:16px;">
      <p style="margin:0 0 8px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${accentColor};">Add-ons</p>
      <p style="margin:0;font-size:13px;color:#666;">${addons.join(', ')}</p>
    </div>` : ''}

    ${booking.special_notes ? `
    <div style="background:#fff;border:1px solid #f0e8e4;border-left:3px solid ${accentColor};border-radius:0 12px 12px 0;padding:14px 18px;margin-bottom:16px;">
      <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${accentColor};">Notes</p>
      <p style="margin:0;font-size:13px;color:#666;">${booking.special_notes}</p>
    </div>` : ''}

    ${isConsult && booking.intake_answers ? `
    <div style="background:#fff;border:1px solid #f0e8e4;border-left:3px solid ${accentColor};border-radius:0 12px 12px 0;padding:14px 18px;margin-bottom:16px;">
      <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${accentColor};">Preferred Contact</p>
      <p style="margin:0;font-size:13px;color:#666;">${booking.intake_answers.preferred_contact || '—'}</p>
      <p style="margin:8px 0 4px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${accentColor};">Availability</p>
      <p style="margin:0;font-size:13px;color:#666;">${booking.intake_answers.availability_notes || '—'}</p>
    </div>` : ''}

    <div style="margin-top:24px;text-align:center;">
      <a href="https://cleanslateclub.co/admin" style="display:inline-block;background:${accentColor};color:#fff;font-size:13px;font-weight:700;letter-spacing:0.08em;padding:13px 28px;border-radius:50px;text-decoration:none;">
        View in Dashboard →
      </a>
    </div>
  </div>
  ${emailFooter}
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