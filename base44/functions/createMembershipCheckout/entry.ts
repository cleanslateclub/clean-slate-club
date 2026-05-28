import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    const { customerEmail, customerName, successUrl, cancelUrl } = await req.json();

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

    // Find or create customer
    let customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
    let customer;
    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({
        name: customerName || customerEmail,
        email: customerEmail,
        metadata: { source: 'clean_slate_club_membership' }
      });
    }

    // Create a Stripe Checkout Session for the $49/month subscription
    // Uses a price lookup key — you must create a recurring $49/month price in your Stripe dashboard
    // and set its lookup key to "catch_up_club_monthly"
    // OR we create it on the fly using price_data
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Catch-Up Club™ Membership',
              description: 'Monthly membership — priority scheduling, member rates, and exclusive perks.',
            },
            unit_amount: 4900, // $49.00
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl || 'https://cleanslateclubpa.com/dashboard?membership=success',
      cancel_url: cancelUrl || 'https://cleanslateclubpa.com/memberships',
      metadata: {
        customer_email: customerEmail,
        source: 'catch_up_club_membership',
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});