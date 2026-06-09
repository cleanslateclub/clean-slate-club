import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@17.0.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature');

    if (!sig) {
      return Response.json({ error: 'Missing signature' }, { status: 400 });
    }

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      return Response.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    // Verify webhook signature using async method for Deno
    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);
    } catch (err) {
      return Response.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);

    // Helper: find a booking by payment intent ID.
    // FIX: Query by the dedicated payment_intent_id field first (fast, direct lookup).
    // Fall back to scanning admin_notes for older bookings that predate the new field.
    const findBookingByPaymentIntent = async (paymentIntentId) => {
      const byField = await base44.asServiceRole.entities.Booking.filter({ payment_intent_id: paymentIntentId });
      if (byField && byField.length > 0) return byField[0];

      // Fallback for legacy bookings
      const all = await base44.asServiceRole.entities.Booking.filter({});
      return all.find(b => b.admin_notes?.includes(paymentIntentId)) || null;
    };

    // Handle payment intent events
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const booking = await findBookingByPaymentIntent(paymentIntentId);

      if (booking) {
        // Update booking status to confirmed
        await base44.asServiceRole.entities.Booking.update(booking.id, {
          status: 'confirmed',
          admin_notes: `${booking.admin_notes || ''}\n✓ Payment confirmed at ${new Date().toISOString()}`
        });

        // Send confirmation email to client
        const displayDate = booking.scheduled_date
          ? new Date(booking.scheduled_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
          : 'TBD';

        const confirmationBody = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
<style>
  body{margin:0;padding:0;background:#fdfcfb;font-family:'Lato',sans-serif;color:#333333;}
  .wrapper{max-width:600px;margin:0 auto;background:#fdfcfb;}
  .header{background:linear-gradient(135deg,#EB9486 0%,#fcd5ce 60%,#ece4db 100%);padding:40px 40px 32px;text-align:center;}
  .brand-name{font-family:'Montserrat',sans-serif;font-size:13px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#fff;margin:0 0 2px;}
  .brand-sub{font-family:'Montserrat',sans-serif;font-size:26px;font-weight:300;color:#fff;margin:0;letter-spacing:0.04em;}
  .body{padding:36px 40px;}
  .greeting{font-family:'Montserrat',sans-serif;font-size:22px;font-weight:600;color:#333;margin:0 0 12px;}
  p{font-family:'Lato',sans-serif;font-size:15px;font-weight:300;color:#555;line-height:1.7;margin:0 0 16px;}
  .card{background:#fff;border:1px solid #f0e8e4;border-radius:16px;padding:22px 24px;margin:20px 0;}
  .card-label{font-family:'Montserrat',sans-serif;font-size:10px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#EB9486;margin:0 0 10px;}
  .card-value{font-family:'Lato',sans-serif;font-size:15px;font-weight:400;color:#333;margin:0 0 6px;line-height:1.6;}
  .footer{background:#f9f4f2;padding:28px 40px;text-align:center;border-top:1px solid #f0e8e4;}
  .footer p{font-size:12px;font-weight:300;color:#aaa;margin:0 0 4px;}
</style></head>
<body><div class="wrapper">
  <div class="header">
    <p class="brand-name">Clean Slate</p>
    <p class="brand-sub">Club™</p>
  </div>
  <div class="body">
    <p class="greeting">Payment received! ✓</p>
    <p>Your deposit has been securely processed. Your booking is now confirmed.</p>
    <div class="card">
      <p class="card-label">Booking Details</p>
      <p class="card-value"><strong>${booking.client_name}</strong></p>
      <p class="card-value">${displayDate} at ${booking.scheduled_start_time}</p>
      <p class="card-value">${booking.client_address}</p>
    </div>
    <p style="font-size:14px;color:#888;font-weight:300;">See you soon! If you have any questions, feel free to reach out.</p>
    <p style="font-size:13px;color:#aaa;margin-top:24px;font-weight:300;">With care,<br><strong style="color:#EB9486;font-family:'Montserrat',sans-serif;font-weight:600;">Masha</strong><br>Clean Slate Club™</p>
  </div>
  <div class="footer">
    <p>Questions? Reply to this email or text us at (206) 825-4061</p>
    <p>cleanslateclubpa@gmail.com &middot; cleanslateclub.co</p>
  </div>
</div></body></html>`;

        await base44.asServiceRole.integrations.Core.SendEmail({
          to: booking.client_email,
          subject: `Payment confirmed — Your Clean Slate Club™ booking is locked in`,
          body: confirmationBody
        });

        // FIX: Corrected domain from cleanslateclubpa.com → cleanslateclub.co
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: 'cleanslateclubpa@gmail.com',
          subject: `Payment received for ${booking.client_name} — ${displayDate}`,
          body: `Payment confirmed!\n\nBooking: ${booking.client_name}\nAmount: $${(paymentIntent.amount / 100).toFixed(2)}\nDate: ${displayDate} at ${booking.scheduled_start_time}\n\nView in dashboard: https://cleanslateclub.co/admin`
        });
      }
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const booking = await findBookingByPaymentIntent(paymentIntentId);

      if (booking) {
        await base44.asServiceRole.entities.Booking.update(booking.id, {
          admin_notes: `${booking.admin_notes || ''}\n✗ Payment failed: ${paymentIntent.last_payment_error?.message || 'Unknown error'}`
        });

        // FIX: Corrected domain from cleanslateclubpa.com → cleanslateclub.co
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: 'cleanslateclubpa@gmail.com',
          subject: `Payment failed for ${booking.client_name}`,
          body: `Payment processing failed.\n\nBooking: ${booking.client_name}\nError: ${paymentIntent.last_payment_error?.message || 'Unknown'}\n\nContact client to retry: ${booking.client_email} / ${booking.client_phone}\n\nView in dashboard: https://cleanslateclub.co/admin`
        });
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
