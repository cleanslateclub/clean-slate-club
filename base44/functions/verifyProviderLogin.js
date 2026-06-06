import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { username, password } = await req.json();

    if (!username || !password) {
      return Response.json({ success: false, error: 'Missing credentials.' });
    }

    const providers = await base44.asServiceRole.entities.Provider.filter({ login_username: username });

    if (!providers || providers.length === 0) {
      return Response.json({ success: false, error: 'Invalid username or password.' });
    }

    const provider = providers[0];

    if (provider.login_password !== password) {
      return Response.json({ success: false, error: 'Invalid username or password.' });
    }

    return Response.json({
      success: true,
      providerId: provider.id,
      providerEmail: provider.email,
    });

  } catch (error) {
    console.error('verifyProviderLogin error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});
