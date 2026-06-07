import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    // ✅ FIX: Clone the request BEFORE passing to createClientFromRequest.
    // In Deno, the request body is a one-time readable stream.
    // If createClientFromRequest reads the body internally, req.json() would
    // return empty. Cloning gives each one its own fresh stream.
    const reqClone = req.clone();
    createClientFromRequest(req);

    const body = await reqClone.json();

    // Unwrap Base44 SDK data envelope if present
    const payload = body?.data ?? body;
    const { username, password } = payload ?? {};

    if (!username || !password) {
      // Temporary debug — remove after confirming login works
      return Response.json({
        success: false,
        error: 'Missing credentials.',
        _debug: {
          bodyKeys: Object.keys(body ?? {}),
          payloadKeys: Object.keys(payload ?? {}),
          hasData: !!body?.data,
        }
      });
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
