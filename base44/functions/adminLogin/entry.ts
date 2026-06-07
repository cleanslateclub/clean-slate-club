import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    // Required: Base44 runtime uses this to initialise the function.
    // Without this call the platform returns 404 before your code runs.
    createClientFromRequest(req);

    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return Response.json({ success: false, error: 'Missing credentials.' });
    }

    const validUsername = Deno.env.get('ADMIN_USERNAME');
    const validPassword = Deno.env.get('ADMIN_PASSWORD');

    if (!validUsername || !validPassword) {
      console.error('adminLogin: ADMIN_USERNAME or ADMIN_PASSWORD env vars not set.');
      return Response.json({ success: false, error: 'Server configuration error.' });
    }

    if (username !== validUsername || password !== validPassword) {
      return Response.json({ success: false, error: 'Invalid credentials.' });
    }

    // Generate a session token for the frontend to store
    const token = crypto.randomUUID();

    return Response.json({ success: true, token, username });

  } catch (error) {
    console.error('adminLogin error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});