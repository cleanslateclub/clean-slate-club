import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@17.0.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const {
      bookingId,
      reason,
      cancelledBy,   // provider full name
      notifyClient,  // boolean — provider chose Yes or No before submitting
    } = await req.json();

    if (!bookingId) {
      return Response.json({ success: false, error: 'Missing bookingId.' }, { status: 400 });
    }

    // --- Load booking ---
    const booking = await base44.asServiceRole.entities.Booking.get(bookingId);
    if (!booking) {
      return Response.json({ success: false, error: 'Booking not found.' }, { status: 404 });
    }
    if (booking.status === 'cancelled') {
      return Response.json({ success: false, error: 'This booking is already cancelled.' }, { status: 400 });
    }

    // --- Check refund eligibility ---
    // Parse as midnight Eastern time to avoid UTC offset issues
    const scheduledDate = new Date(booking.scheduled_date + 'T00:00:00-05:00');
    const hoursUntilService = (scheduledDate.getTime() - Date.now()) / (1000 * 60 * 60);
    const refundEligible = hoursUntilService > 24;

    let refundId: string | null = null;
    let refundAmount: number | null = null;
    let refundNote = '';

    // --- Process refund if eligible ---
    if (refundEligible) {
      // Check the dedicated field first, then fall back to admin_notes (legacy bookings)
      let paymentIntentId = booking.payment_intent_id || null;
      if (!paymentIntentId) {
        const match = (booking.admin_notes || '').match(/Stripe ID: (pi_[a-zA-Z0-9_]+)/);
        if (match) paymentIntentId = match[1];
      }

      if (paymentIntentId) {
        try {
          const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
          const intent = await stripe.paymentIntents.retrieve(paymentIntentId, {
            expand: ['latest_charge'],
          });

          if (intent.latest_charge) {
            const chargeId = typeof intent.latest_charge === 'string'
              ? intent.latest_charge
              : intent.latest_charge.id;

            const refund = await stripe.refunds.create({
              charge: chargeId,
              reason: 'requested_by_customer',
            });
            refundId = refund.id;
            refundAmount = refund.amount / 100;
            refundNote = `\n✓ Refund of $${refundAmount.toFixed(2)} issued: ${refundId}`;
          }
        } catch (refundErr) {
          console.error('Refund processing failed (non-blocking):', refundErr);
          refundNote = '\n⚠️ Refund could not be processed automatically — please review manually.';
        }
      } else {
        refundNote = '\nNo Stripe payment found — no refund to process.';
      }
    } else {
      refundNote = '\nNo refund issued — cancelled within 24 hours of service.';
    }

    // --- Build admin note ---
    const cancelNote = [
      `\n✗ Cancelled by ${cancelledBy || 'Provider'} on ${new Date().toLocaleDateString('en-US')}`,
      `  Visit was: ${booking.scheduled_date} at ${booking.scheduled_start_time}`,
      reason ? `  Reason: ${reason}` : null,
      `  Client notified: ${notifyClient ? 'Yes (SMS + Email)' : 'No'}`,
      refundNote,
      // IMPORTANT: This marker tells handleCancellationRefund to skip this booking
      // and prevents a double refund from the entity automation.
      `  REFUND_HANDLED_BY_CANCELLATION_FUNCTION`,
    ].filter(Boolean).join('\n');

    // --- Update booking to cancelled ---
    await base44.asServiceRole.entities.Booking.update(bookingId, {
      status: 'cancelled',
      admin_notes: (booking.admin_notes || '') + cancelNote,
    });

    // --- Delete linked TimeBlocks ---
    try {
      const blocks = await base44.asServiceRole.entities.TimeBlock.filter({ booking_id: bookingId });
      for (const block of blocks || []) {
        await base44.asServiceRole.entities.TimeBlock.delete(block.id);
      }
    } catch (blockErr) {
      console.error('TimeBlock cleanup failed (non-blocking):', blockErr);
    }

    // --- Mark Google Calendar event as cancelled ---
    if (booking.google_calendar_event_id) {
      try {
        const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');
        await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events/${booking.google_calendar_event_id}?sendUpdates=${notifyClient ? 'all' : 'none'}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              summary: `❌ CANCELLED — ${booking.client_name}`,
              status: 'cancelled',
            }),
          }
        );
      } catch (calErr) {
        console.error('Calendar update failed (non-blocking):', calErr);
      }
    }

    // --- Format dates for notifications ---
    const displayDate = new Date(booking.scheduled_date + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
    });

    // --- Notify client (only if provider said Yes) ---
    if (notifyClient) {
      const smsOptIn = booking.intake_answers?.sms_opt_in !== false;

      if (smsOptIn && booking.client_phone) {
        try {
          const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
          const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
          const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');
          const auth = btoa(`${accountSid}:${authToken}`);

          const smsBody = refundId
            ? `Hi ${booking.client_name}, your Clean Slate Club visit on ${displayDate} has been cancelled and a full deposit refund has been issued. Questions? Text us at (206) 825-4061. Reply STOP to opt out.`
            : `Hi ${booking.client_name}, your Clean Slate Club visit on ${displayDate} has been cancelled.${reason ? ` Reason: ${reason}.` : ''} Questions? Text us at (206) 825-4061. Reply STOP to opt out.`;

          await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
            method: 'POST',
            headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ From: fromNumber, To: booking.client_phone, Body: smsBody }).toString(),
          });
        } catch (smsErr) {
          console.error('SMS failed (non-blocking):', smsErr);
        }
      }

      if (booking.client_email) {
        try {
          const refundSection = refundId
            ? `<div class="card"><p class="card-label">Deposit Refund</p><p class="card-value">A full refund of your deposit has been issued and will appear on your original payment method within 5–10 business days.</p></div>`
            : refundEligible
            ? `<div class="card"><p class="card-label">Deposit Refund</p><p class="card-value">Your visit qualified for a refund but we couldn’t process it automatically. Please contact us and we’ll make it right right away.</p></div>`
            : '';

          const emailBody = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
<style>
  body{margin:0;padding:0;background:#fdfcfb;font-family:'Lato',sans-serif;color:#333;}
  .wrapper{max-width:600px;margin:0 auto;background:#fdfcfb;}
  .header{background:linear-gradient(135deg,#97A7B3 0%,#b8c8d4 60%,#ece4db 100%);padding:40px;text-align:center;}
  .brand-name{font-family:'Montserrat',sans-serif;font-size:13px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#fff;margin:0 0 2px;}
  .brand-sub{font-family:'Montserrat',sans-serif;font-size:26px;font-weight:300;color:#fff;margin:0;}
  .body{padding:36px 40px;}
  .greeting{font-family:'Montserrat',sans-serif;font-size:22px;font-weight:600;color:#333;margin:0 0 12px;}
  p{font-family:'Lato',sans-serif;font-size:15px;font-weight:300;color:#555;line-height:1.7;margin:0 0 16px;}
  .card{background:#fff;border:1px solid #f0e8e4;border-radius:16px;padding:22px 24px;margin:20px 0;}
  .card-label{font-family:'Montserrat',sans-serif;font-size:10px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#97A7B3;margin:0 0 10px;}
  .card-value{font-family:'Lato',sans-serif;font-size:15px;color:#333;margin:0 0 6px;line-height:1.6;}
  .footer{background:#f9f4f2;padding:28px 40px;text-align:center;border-top:1px solid #f0e8e4;}
  .footer p{font-size:12px;font-weight:300;color:#aaa;margin:0 0 4px;}
</style></head>
<body><div class="wrapper">
  <div class="header">
    <p class="brand-name">Clean Slate</p>
    <p class="brand-sub">Club™</p>
  </div>
  <div class="body">
    <p class="greeting">Your visit has been cancelled</p>
    <p>We’re sorry for any inconvenience. Your upcoming visit has been cancelled.</p>
    <div class="card">
      <p class="card-label">Cancelled Visit</p>
      <p class="card-value"><strong>${displayDate} at ${booking.scheduled_start_time}</strong></p>
      ${booking.client_address ? `<p class="card-value" style="color:#999;">${booking.client_address}</p>` : ''}
      ${reason ? `<p class="card-label" style="margin-top:14px;">Reason</p><p class="card-value">${reason}</p>` : ''}
    </div>
    ${refundSection}
    <p style="font-size:14px;color:#888;font-weight:300;">We’d love to get you rescheduled. Just reply to this email or text us and we’ll find a time that works.</p>
    <p style="font-size:13px;color:#aaa;margin-top:24px;font-weight:300;">With care,<br><strong style="color:#EB9486;font-family:'Montserrat',sans-serif;font-weight:600;">Masha</strong><br>Clean Slate Club™</p>
  </div>
  <div class="footer">
    <p>Questions? Reply to this email or text us at (206) 825-4061</p>
    <p>cleanslateclubpa@gmail.com · cleanslateclub.co</p>
  </div>
</div></body></html>`;

          await base44.asServiceRole.integrations.Core.SendEmail({
            to: booking.client_email,
            subject: `Your Clean Slate Club visit on ${displayDate} has been cancelled`,
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
        subject: `❌ Booking cancelled by ${cancelledBy || 'Provider'} — ${booking.client_name}`,
        body: [
          `A booking has been cancelled from the provider dashboard.`,
          ``,
          `Client: ${booking.client_name} (${booking.client_email} / ${booking.client_phone})`,
          `Cancelled by: ${cancelledBy || 'Provider'}`,
          `Visit was: ${displayDate} at ${booking.scheduled_start_time}`,
          reason ? `Reason: ${reason}` : null,
          ``,
          refundId
            ? `✓ Refund of $${refundAmount?.toFixed(2)} issued automatically (${refundId})`
            : refundEligible
            ? '⚠️ Refund eligible but could not be processed — please review manually.'
            : 'No refund — cancelled within 24 hours of service.',
          ``,
          `Client notified: ${notifyClient ? 'Yes (SMS + Email)' : 'No'}`,
          ``,
          `View in dashboard: https://cleanslateclub.co/admin`,
        ].filter(Boolean).join('\n'),
      });
    } catch (adminErr) {
      console.error('Admin email failed (non-blocking):', adminErr);
    }

    return Response.json({
      success: true,
      refundIssued: !!refundId,
      refundId,
      refundAmount,
      message: [
        'Booking cancelled.',
        refundId ? `Refund of $${refundAmount?.toFixed(2)} issued.` : refundEligible ? 'No payment found to refund — check manually.' : 'No refund (within 24 hours).',
        `Client ${notifyClient ? 'was' : 'was not'} notified.`,
      ].join(' '),
    });

  } catch (error) {
    console.error('cancelBookingByProvider error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
});
