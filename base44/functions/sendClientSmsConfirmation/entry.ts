import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const getPayload = async (req: Request) => {
  try {
    const body = await req.json();
    return body?.data ?? body?.event?.data ?? body ?? {};
  } catch {
    return {};
  }
};

const smsAllowed = (booking: Record<string, unknown>) => {
  const intake = booking.intake_answers;
  if (!intake || typeof intake !== 'object') return false;
  return (intake as Record<string, unknown>).sms_opt_in === true;
};

const formatDate = (date: string) => {
  if (!date) return 'your selected date';
  try {
    return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return date;
  }
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
      return Response.json({ success: false, skipped: 'Booking not found.' });
    }

    if (!booking.client_phone || !booking.scheduled_date) {
      return Response.json({ success: true, skipped: 'Missing phone or date.' });
    }

    if (!smsAllowed(booking)) {
      return Response.json({ success: true, skipped: 'Guest did not opt in to SMS.' });
    }

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!accountSid || !authToken || !fromNumber) {
      console.error('sendClientSmsConfirmation: Twilio env vars are missing.');
      return Response.json({ success: false, error: 'SMS provider is not configured.' }, { status: 500 });
    }

    const serviceName = booking.service_label || booking.service_category || 'visit';
    const displayDate = formatDate(String(booking.scheduled_date || ''));
    const scheduledTime = booking.scheduled_start_time || 'TBD';
    const isConsult = booking.service_category === 'consult';

    const message = isConsult
      ? `Hi ${booking.client_name}! Your free Clean Slate Club consult is scheduled for ${displayDate} at ${scheduledTime}. Reply STOP to opt out.`
      : `Hi ${booking.client_name}! We received your Clean Slate Club ${serviceName} request for ${displayDate} at ${scheduledTime}. We'll review and confirm details shortly. Reply STOP to opt out.`;

    const auth = btoa(`${accountSid}:${authToken}`);
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: fromNumber,
        To: booking.client_phone,
        Body: message,
      }).toString(),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error('sendClientSmsConfirmation Twilio error:', result);
      return Response.json({ success: false, error: result.message || 'Failed to send SMS.' }, { status: 500 });
    }

    return Response.json({ success: true, messageSid: result.sid });
  } catch (error) {
    console.error('sendClientSmsConfirmation error:', error);
    return Response.json({ success: false, error: error.message || 'SMS confirmation failed.' }, { status: 500 });
  }
});
