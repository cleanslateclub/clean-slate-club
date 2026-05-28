import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    return Response.json({ publishableKey: Deno.env.get('STRIPE_PUBLISHABLE_KEY') });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});