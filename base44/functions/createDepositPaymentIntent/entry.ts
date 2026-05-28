import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { clientName, clientEmail, serviceLabel } = await req.json();

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 5000, // $50.00 in cents
      currency: 'usd',
      receipt_email: clientEmail,
      description: `$50 deposit — ${serviceLabel} booking for ${clientName}`,
      metadata: {
        client_name: clientName,
        client_email: clientEmail,
        service: serviceLabel,
      },
    });

    return Response.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});