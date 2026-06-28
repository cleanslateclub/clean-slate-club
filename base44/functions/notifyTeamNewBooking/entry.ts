import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const TEAM_EMAIL = 'cleanslateclubpa@gmail.com';

const escapeHtml = (value: unknown) => String(value || '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const getPayload = async (req: Request) => {
  try {
    const body = await req.json();
    return body?.data ?? body ?? {};
  } catch {
    return {};
  }
};

const formatDate = (date: string) => {
  if (!date) return 'TBD';
  try {
    return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return date;
  }
};

const moneyRange = (booking: Record<string, unknown>) => {
  const low = booking.estimated_price_low ?? 0;
  const high = booking.estimated_price_high ?? 0;
  if (!low && !high) return 'Not estimated';
  return `$${low} - $${high}`;
};

const mapsUrl = (address: string) => address
  ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  : '';

const buildEmail = (booking: Record<string, unknown>, context: Record<string, unknown>) => {
  const address = String(booking.client_address || '');
  const service = booking.service_label || booking.service_category || 'Clean Slate Club Visit';
  const date = formatDate(String(booking.scheduled_date || ''));
  const start = booking.scheduled_start_time || 'TBD';
  const end = booking.scheduled_end_time || 'TBD';
  const addons = Array.isArray(booking.addons) ? booking.addons.join(', ') : String(booking.addons || 'None');
  const intake = booking.intake_answers || {};
  const smsOptIn = typeof intake === 'object' && intake !== null ? (intake as Record<string, unknown>).sms_opt_in : undefined;
  const mapLink = mapsUrl(address);

  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#fdfcfb;font-family:Arial,Helvetica,sans-serif;color:#333;">
  <div style="max-width:640px;margin:0 auto;background:#fff;">
    <div style="background:linear-gradient(135deg,#EB9486 0%,#EFB988 45%,#CAE7B9 100%);padding:34px 28px;text-align:center;color:#fff;">
      <p style="margin:0;font-size:11px;letter-spacing:.24em;text-transform:uppercase;font-weight:700;">Clean Slate Club</p>
      <h1 style="margin:10px 0 0;font-size:24px;">New booking needs review</h1>
      <p style="margin:8px 0 0;font-size:13px;opacity:.9;">${escapeHtml(String(service))}</p>
    </div>
    <div style="padding:28px;">
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">A booking-related event was received from <strong>${escapeHtml(context.source || 'public_booking')}</strong>.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr><td style="padding:10px 0;border-bottom:1px solid #f0e8e4;color:#888;font-size:12px;">Guest</td><td style="padding:10px 0;border-bottom:1px solid #f0e8e4;font-size:14px;">${escapeHtml(booking.client_name)}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f0e8e4;color:#888;font-size:12px;">Phone</td><td style="padding:10px 0;border-bottom:1px solid #f0e8e4;font-size:14px;"><a href="tel:${escapeHtml(booking.client_phone)}">${escapeHtml(booking.client_phone)}</a></td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f0e8e4;color:#888;font-size:12px;">Email</td><td style="padding:10px 0;border-bottom:1px solid #f0e8e4;font-size:14px;"><a href="mailto:${escapeHtml(booking.client_email)}">${escapeHtml(booking.client_email)}</a></td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f0e8e4;color:#888;font-size:12px;">Address</td><td style="padding:10px 0;border-bottom:1px solid #f0e8e4;font-size:14px;">${mapLink ? `<a href="${mapLink}">${escapeHtml(address)}</a>` : escapeHtml(address || 'None')}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f0e8e4;color:#888;font-size:12px;">Date/time</td><td style="padding:10px 0;border-bottom:1px solid #f0e8e4;font-size:14px;">${escapeHtml(date)} · ${escapeHtml(start)} - ${escapeHtml(end)}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f0e8e4;color:#888;font-size:12px;">Estimate</td><td style="padding:10px 0;border-bottom:1px solid #f0e8e4;font-size:14px;">${escapeHtml(moneyRange(booking))}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f0e8e4;color:#888;font-size:12px;">Status</td><td style="padding:10px 0;border-bottom:1px solid #f0e8e4;font-size:14px;">${escapeHtml(booking.status)} / ${escapeHtml(booking.payment_status)}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f0e8e4;color:#888;font-size:12px;">Add-ons</td><td style="padding:10px 0;border-bottom:1px solid #f0e8e4;font-size:14px;">${escapeHtml(addons || 'None')}</td></tr>
        <tr><td style="padding:10px 0;color:#888;font-size:12px;">SMS opt-in</td><td style="padding:10px 0;font-size:14px;">${smsOptIn === undefined ? 'Not shown' : smsOptIn ? 'Yes' : 'No'}</td></tr>
      </table>
      ${context.note ? `<div style="margin-top:18px;padding:14px;border-radius:14px;background:#f9f4f2;"><strong>Note:</strong> ${escapeHtml(context.note)}</div>` : ''}
      <div style="margin-top:24px;text-align:center;"><a href="https://cleanslateclub.co/admin" style="display:inline-block;background:#EB9486;color:#fff;text-decoration:none;padding:13px 26px;border-radius:999px;font-size:13px;font-weight:700;">Open admin dashboard</a></div>
    </div>
  </div>
</body></html>`;
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await getPayload(req);
    const bookingId = payload.bookingId || payload.id;

    let booking = payload.booking || payload;
    if (bookingId) {
      booking = await base44.asServiceRole.entities.Booking.get(bookingId);
    }

    if (!booking?.id) {
      return Response.json({ success: false, error: 'Booking not found.' }, { status: 404 });
    }

    const service = booking.service_label || booking.service_category || 'Clean Slate Club Visit';
    const subject = `New Booking Request - ${booking.client_name || service}`;

    await base44.integrations.Core.SendEmail({
      to: TEAM_EMAIL,
      subject,
      body: buildEmail(booking, payload),
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('notifyTeamNewBooking error:', error);
    return Response.json({ success: false, error: error.message || 'Team notification failed.' }, { status: 500 });
  }
});