import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const TEAM_EMAIL = Deno.env.get('TEAM_NOTIFICATION_EMAIL') || 'cleanslateclubpa@gmail.com';

const getPayload = async (req: Request) => {
  try {
    const body = await req.json();
    return body?.data ?? body ?? {};
  } catch {
    return {};
  }
};

const formatBookingLine = (booking: Record<string, unknown> | null | undefined) => {
  if (!booking) return 'Booking: N/A';
  return [
    `Booking ID: ${booking.id || 'N/A'}`,
    `Guest: ${booking.client_name || 'N/A'}`,
    `Phone: ${booking.client_phone || 'N/A'}`,
    `Email: ${booking.client_email || 'N/A'}`,
    `Address: ${booking.client_address || 'N/A'}`,
    `Service: ${booking.service_category || 'N/A'}`,
    `Date: ${booking.scheduled_date || 'N/A'}`,
    `Time: ${booking.scheduled_start_time || 'N/A'} - ${booking.scheduled_end_time || 'N/A'}`,
    `Provider: ${booking.provider_name || booking.provider_email || 'Unassigned'}`,
    `Status: ${booking.status || 'N/A'}`,
  ].join('\n');
};

const formatTimeBlockLine = (timeBlock: Record<string, unknown> | null | undefined) => {
  if (!timeBlock) return 'TimeBlock: N/A';
  return [
    `TimeBlock ID: ${timeBlock.id || 'N/A'}`,
    `Booking ID: ${timeBlock.booking_id || 'N/A'}`,
    `Type: ${timeBlock.block_type || 'N/A'}`,
    `Label: ${timeBlock.label || 'N/A'}`,
    `Date: ${timeBlock.date || 'N/A'}`,
    `Time: ${timeBlock.start_time || 'N/A'} - ${timeBlock.end_time || 'N/A'}`,
    `Provider: ${timeBlock.provider_email || 'Unassigned'}`,
  ].join('\n');
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await getPayload(req);

    const eventType = payload.eventType || 'schedule_change';
    const source = payload.source || 'unknown';
    const actor = payload.actor || 'Clean Slate Club';
    const note = payload.note || '';
    const updates = payload.updates || {};
    const booking = payload.booking || null;
    const timeBlock = payload.timeBlock || null;
    const occurredAt = payload.occurredAt || new Date().toISOString();

    const subject = `Clean Slate Club schedule update: ${eventType}`;
    const body = [
      `A schedule change was recorded for Clean Slate Club.`,
      '',
      `Event type: ${eventType}`,
      `Source: ${source}`,
      `Actor: ${actor}`,
      `Occurred at: ${occurredAt}`,
      note ? `Note: ${note}` : null,
      '',
      'Booking',
      formatBookingLine(booking),
      '',
      'Time block',
      formatTimeBlockLine(timeBlock),
      '',
      'Updates',
      JSON.stringify(updates, null, 2),
      '',
      'View dashboard: https://cleanslateclub.co/admin',
    ].filter(Boolean).join('\n');

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: TEAM_EMAIL,
      subject,
      body,
    });

    const providerEmail = booking?.provider_email || timeBlock?.provider_email;
    if (providerEmail && payload.rules?.provider_notifications !== false) {
      const providerSubject = `Clean Slate Club schedule update`;
      const providerBody = [
        `A schedule change was made for one of your Clean Slate Club visits.`,
        '',
        booking?.client_name ? `Guest: ${booking.client_name}` : null,
        booking?.scheduled_date || timeBlock?.date ? `Date: ${booking?.scheduled_date || timeBlock?.date}` : null,
        booking?.scheduled_start_time || timeBlock?.start_time ? `Time: ${booking?.scheduled_start_time || timeBlock?.start_time} - ${booking?.scheduled_end_time || timeBlock?.end_time || 'TBD'}` : null,
        note ? `Note: ${note}` : null,
        '',
        'Please check your provider dashboard for the latest details.',
      ].filter(Boolean).join('\n');

      base44.asServiceRole.integrations.Core.SendEmail({
        to: String(providerEmail),
        subject: providerSubject,
        body: providerBody,
      }).catch((providerErr: Error) => {
        console.error('Provider schedule notification failed:', providerErr);
      });
    }

    return Response.json({ success: true, eventType, notifiedAdmin: true, notifiedProvider: Boolean(providerEmail) });
  } catch (error) {
    console.error('notifyScheduleChange error:', error);
    return Response.json({ success: false, error: error?.message || 'Schedule notification failed.' }, { status: 500 });
  }
});
