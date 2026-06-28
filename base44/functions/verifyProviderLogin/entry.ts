import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const normalize = (value: unknown) => String(value || '').trim().toLowerCase();

const getProviderUsernameValues = (provider: Record<string, unknown>) => [
  provider.username,
  provider.provider_username,
  provider.portal_username,
  provider.email,
].map(normalize).filter(Boolean);

const providerCanAccessPortal = (provider: Record<string, unknown>) => {
  const status = normalize(provider.status || 'draft');
  const accessLevel = normalize(provider.access_level || 'provider_basic');
  const explicitAccess = provider.portal_access_enabled === true || provider.team_portal_access === true;

  if (provider.portal_access_enabled === false || provider.team_portal_access === false) return false;
  if (['inactive', 'suspended', 'terminated', 'rejected', 'draft'].includes(status)) return false;

  return explicitAccess || status === 'active' || accessLevel.startsWith('provider');
};

const passwordMatches = (provider: Record<string, unknown>, password: string) => {
  const allowedPasswords = [
    provider.password,
    provider.provider_password,
    provider.portal_password,
    provider.access_code,
    provider.login_code,
  ].filter(Boolean).map(value => String(value));

  return allowedPasswords.some(value => value === password);
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const payload = body?.data ?? body ?? {};
    const username = normalize(payload.username);
    const password = String(payload.password || '');

    if (!username || !password) {
      return Response.json({ success: false, error: 'Missing username or password.' });
    }

    const providers = await base44.asServiceRole.entities.Provider.list('-created_date', 500);
    const provider = (providers || []).find((candidate: Record<string, unknown>) => {
      const usernames = getProviderUsernameValues(candidate);
      return usernames.includes(username);
    });

    if (!provider || !passwordMatches(provider, password) || !providerCanAccessPortal(provider)) {
      return Response.json({ success: false, error: 'Invalid username or password.' });
    }

    return Response.json({
      success: true,
      providerId: provider.id,
      providerEmail: provider.email || '',
    });
  } catch (error) {
    console.error('verifyProviderLogin error:', error);
    return Response.json({ success: false, error: error.message || 'Provider login failed.' }, { status: 500 });
  }
});
