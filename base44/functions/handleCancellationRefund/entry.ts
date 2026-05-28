import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.0.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event, data } = await req.json();

    // Only process if status changed to cancelled
    if (data.status !== 'cancelled') {
      return Response.json({ message: 'Not a cancellation, skipping refund' }, { status: 200 });
    }

    const booking = data;
    const scheduledDate = new Date(booking.scheduled_date + 'T00:00:00');
    const now = new Date();
    const hoursUntilService = (scheduledDate - now) / (1000 * 60 * 60);

    // Only refund if cancelled more than 24 hours before
    if (hoursUntilService <= 24) {
      return Response.json({ message: 'Cancelled within 24 hours, no refund issued' }, { status: 200 });
    }

    // Extract Stripe payment intent ID from admin_notes
    const adminNotes = booking.admin_notes || '';
    const intentMatch = adminNotes.match(/Stripe ID: (pi_[a-zA-Z0-9_]+)/);
    
    if (!intentMatch) {
      return Response.json({ message: 'No Stripe payment intent found, skipping refund' }, { status: 200 });
    }

    const paymentIntentId = intentMatch[1];
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

    // Get the payment intent to find the charge
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (!intent.charges.data || intent.charges.data.length === 0) {
      return Response.json({ error: 'No charge found for payment intent' }, { status: 400 });
    }

    const chargeId = intent.charges.data[0].id;

    // Issue the refund
    const refund = await stripe.refunds.create({
      charge: chargeId,
      reason: 'requested_by_customer'
    });

    // Update booking with refund info
    await base44.entities.Booking.update(booking.id, {
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