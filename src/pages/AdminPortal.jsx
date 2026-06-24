import React from 'react';
import AdminDashboard from './AdminDashboard';
import StaffLogin from './StaffLogin';

const hasValidAdminSession = () => {
  try {
    const session = JSON.parse(localStorage.getItem('adminSession') || '{}');
    return Boolean(session.token && session.expiresAt && Date.now() <= session.expiresAt);
  } catch {
    return false;
  }
};

export default function AdminPortal() {
  if (!hasValidAdminSession()) {
    return <StaffLogin defaultMode="admin" adminOnly />;
  }

  return <AdminDashboard />;
}
