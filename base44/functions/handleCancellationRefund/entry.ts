import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@17.0.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event, data } = await req.json();

    // Only process if status changed to cancelled
    if (data.status !== 'cancelled') {
      return Response.json({ message: 'Not a cancellation, skipping refund' }, { status: 200 });
    }

    const booking = data;

    // FIX: Parse as midnight Eastern time (UTC-5) instead of UTC midnight.
    // Previously this was off by 4-5 hours, causing incorrect 24-hour window checks.
    const scheduledDate = new Date(booking.scheduled_date + 'T00:00:00-05:00');
    const now = new Date();
    const hoursUntilService = (scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Only refund if cancelled more than 24 hours before
    if (hoursUntilService <= 24) {
      return Response.json({ message: 'Cancelled within 24 hours, no refund issued' }, { status: 200 });
    }

    // FIX: Check the dedicated payment_intent_id field first (new bookings),
    // then fall back to scanning admin_notes for backwards compatibility with older bookings.
    let paymentIntentId = booking.payment_intent_id || null;

    if (!paymentIntentId) {
      const adminNotes = booking.admin_notes || '';
      const intentMatch = adminNotes.match(/Stripe ID: (pi_[a-zA-Z0-9_]+)/);
      if (intentMatch) {
        paymentIntentId = intentMatch[1];
      }
    }

    if (!paymentIntentId) {
      return Response.json({ message: 'No Stripe payment intent found, skipping refund' }, { status: 200 });
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

    // FIX: Use expand to get latest_charge — intent.charges.data was removed in newer Stripe versions
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ['latest_charge'],
    });

    if (!intent.latest_charge) {
      return Response.json({ error: 'No charge found for payment intent' }, { status: 400 });
    }

    const chargeId = typeof intent.latest_charge === 'string'
      ? intent.latest_charge
      : intent.latest_charge.id;

    // Issue the refund
    const refund = await stripe.refunds.create({
      charge: chargeId,
      reason: 'requested_by_customer',
    });

    // FIX: Use asServiceRole so the update succeeds even without user auth context
    const adminNotes = booking.admin_notes || '';
    await base44.asServiceRole.entities.Booking.update(booking.id, {
      admin_notes: `${adminNotes}\nRefund issued: ${refund.id} on ${new Date().toISOString()}`
    });

    return Response.json({
      success: true,
      refundId: refund.id,
      amount: refund.amount / 100,
      message: `Refund of $${(refund.amount / 100).toFixed(2)} issued for booking ${booking.id}`
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
