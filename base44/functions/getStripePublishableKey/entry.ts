Deno.serve(async () => {
  try {
    const publishableKey = Deno.env.get('STRIPE_PUBLISHABLE_KEY');

    if (!publishableKey || !publishableKey.startsWith('pk_')) {
      console.error('getStripePublishableKey: STRIPE_PUBLISHABLE_KEY env var is missing or invalid.');
      return Response.json({ error: 'Stripe publishable key is not configured.' }, { status: 500 });
    }

    return Response.json({ publishableKey });
  } catch (error) {
    console.error('getStripePublishableKey error:', error);
    return Response.json({ error: error.message || 'Could not load Stripe publishable key.' }, { status: 500 });
  }
});
