Deno.serve(async (req) => {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return Response.json({ success: false, error: 'Missing credentials.' });
    }

    const validUsername = Deno.env.get('ADMIN_USERNAME');
    const validPassword = Deno.env.get('ADMIN_PASSWORD');

    if (!validUsername || !validPassword) {
      console.error('adminLogin: ADMIN_USERNAME or ADMIN_PASSWORD env vars not set.');
      return Response.json({ success: false, error: 'Server configuration error.' });
    }
