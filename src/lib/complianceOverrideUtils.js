export const COMPLIANCE_OVERRIDE_STATUSES = {
  active: 'active',
  expired: 'expired',
  revoked: 'revoked',
};

export const getComplianceOverrides = (provider = {}) => {
  if (Array.isArray(provider.compliance_overrides)) return provider.compliance_overrides;

  try {
    const parsed = JSON.parse(provider.compliance_overrides || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const serializeComplianceOverrides = (overrides = []) => JSON.stringify(overrides || []);

export const isOverrideActive = (override = {}, now = new Date()) => {
  if (!override || override.status !== COMPLIANCE_OVERRIDE_STATUSES.active) return false;
  if (!override.expires_at) return false;
  return new Date(override.expires_at) >= now;
};

export const getActiveComplianceOverrides = (provider = {}) => {
  const now = new Date();
  return getComplianceOverrides(provider).filter(override => isOverrideActive(override, now));
};

export const createComplianceOverride = ({
  requirementKey,
  requirementLabel,
  reason,
  expiresAt,
  adminName = 'Admin',
  providerId,
  providerName,
} = {}) => ({
  id: `override_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  requirement_key: requirementKey,
  requirement_label: requirementLabel,
  reason,
  expires_at: expiresAt,
  status: COMPLIANCE_OVERRIDE_STATUSES.active,
  provider_id: providerId,
  provider_name: providerName,
  created_by: adminName,
  created_at: new Date().toISOString(),
});

export const revokeComplianceOverride = (provider = {}, overrideId, adminName = 'Admin') => {
  return getComplianceOverrides(provider).map(override => (
    override.id === overrideId
      ? {
          ...override,
          status: COMPLIANCE_OVERRIDE_STATUSES.revoked,
          revoked_at: new Date().toISOString(),
          revoked_by: adminName,
        }
      : override
  ));
};

export const getProviderReadinessWithOverrides = ({ provider, checklist }) => {
  const activeOverrides = getActiveComplianceOverrides(provider);
  const activeOverrideKeys = new Set(activeOverrides.map(override => override.requirement_key));

  const completedOrOverridden = checklist.filter(item => item.complete || activeOverrideKeys.has(item.key));
  const missing = checklist.filter(item => !item.complete && !activeOverrideKeys.has(item.key));

  return {
    activeOverrides,
    activeOverrideKeys,
    completeCount: completedOrOverridden.length,
    totalCount: checklist.length,
    missing,
    readyWithOverrides: checklist.length > 0 && completedOrOverridden.length === checklist.length && provider?.status === 'active',
  };
};
