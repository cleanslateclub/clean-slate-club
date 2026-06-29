import Stripe from 'npm:stripe@14.21.0';

const parseJsonBody = async (req: Request) => {
  try {
    return await req.json();
  } catch {
    return {};
  }
};

const normalizeAmountCents = (amount: unknown) => {
  const dollars = Number(amount || 50);
  if (!Number.isFinite(dollars) || dollars <= 0) return 5000;
  return Math.round(dollars * 100);
};

Deno.serve(async (req) => {
  try {
    const secretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!secretKey || !secretKey.startsWith('sk_')) {
      console.error('createDepositPaymentIntent: STRIPE_SECRET_KEY env var is missing or invalid.');
      return Response.json({ error: 'Stripe secret key is not configured.' }, { status: 500 });
    }

    const body = await parseJsonBody(req);
    const payload = body?.data ?? body ?? {};
    const {
      amount = 50,
      clientName = '',
      clientEmail = '',
      serviceLabel = 'Clean Slate Club Visit',
      bookingData = {},
    } = payload;

    if (!clientName || !clientEmail) {
      return Response.json({ error: 'Missing guest name or email.' }, { status: 400 });
    }

    const amountCents = normalizeAmountCents(amount);
    const stripe = new Stripe(secretKey);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'usd',
      receipt_email: clientEmail,
      description: `$${(amountCents / 100).toFixed(0)} deposit — ${serviceLabel} booking for ${clientName}`,
      payment_method_types: ['card'],
      setup_future_usage: 'off_session',
      metadata: {
        client_name: String(clientName).slice(0, 500),
        client_email: String(clientEmail).slice(0, 500),
        service: String(serviceLabel).slice(0, 500),
        service_key: String(bookingData?.serviceKey || '').slice(0, 500),
        selected_date: String(bookingData?.selectedDate || '').slice(0, 500),
        selected_time: String(bookingData?.selectedTime || '').slice(0, 500),
        total_duration: String(bookingData?.totalDuration || '').slice(0, 500),
        payment_stage: 'deposit',
        deposit_card_only: 'true',
      },
    });

    if (!paymentIntent.client_secret) {
      console.error('createDepositPaymentIntent: Stripe returned no client_secret.', paymentIntent.id);
      return Response.json({ error: 'Stripe client secret is missing.' }, { status: 500 });
    }

    return Response.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('createDepositPaymentIntent error:', error);
    return Response.json({ error: error.message || 'Could not create deposit payment intent.' }, { status: 500 });
  }
});
