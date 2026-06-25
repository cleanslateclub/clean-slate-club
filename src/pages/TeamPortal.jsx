import React from 'react';
import ProviderDashboard from './ProviderDashboard';
import StaffLogin from './StaffLogin';

const hasValidProviderSession = () => {
  try {
    const session = JSON.parse(localStorage.getItem('providerSession') || '{}');
    return Boolean(session.providerId && session.expiresAt && Date.now() <= session.expiresAt);
  } catch {
    return false;
  }
};

export default function TeamPortal() {
  if (!hasValidProviderSession()) {
    return <StaffLogin defaultMode="provider" providerOnly />;
  }

  return <ProviderDashboard />;
}
