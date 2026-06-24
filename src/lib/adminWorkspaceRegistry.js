export const ADMIN_WORKSPACE_STATUS = {
  ready: 'ready',
  partial: 'partial',
  pending: 'pending',
  blocked: 'blocked',
};

export const ADMIN_WORKSPACES = [
  { key: 'home', label: 'Command', status: ADMIN_WORKSPACE_STATUS.partial },
  { key: 'bookings', label: 'Bookings', status: ADMIN_WORKSPACE_STATUS.partial },
  { key: 'calendar', label: 'Calendar', status: ADMIN_WORKSPACE_STATUS.partial },
  { key: 'providers', label: 'Providers', status: ADMIN_WORKSPACE_STATUS.partial },
  { key: 'services', label: 'Services', status: ADMIN_WORKSPACE_STATUS.partial },
  { key: 'messages', label: 'Messages', status: ADMIN_WORKSPACE_STATUS.partial },
  { key: 'settings', label: 'Settings', status: ADMIN_WORKSPACE_STATUS.partial },
  { key: 'payments', label: 'Payments', status: ADMIN_WORKSPACE_STATUS.partial, note: 'Component exists; portal wiring pending.' },
  { key: 'households', label: 'Households', status: ADMIN_WORKSPACE_STATUS.blocked, note: 'Workspace write blocked by connector filter.' },
];

export const getAdminWorkspaceStatus = (key) => ADMIN_WORKSPACES.find(item => item.key === key)?.status || ADMIN_WORKSPACE_STATUS.pending;

export const getAdminWorkspaceSummary = () => ADMIN_WORKSPACES.reduce((summary, workspace) => {
  summary[workspace.status] = (summary[workspace.status] || 0) + 1;
  return summary;
}, {});
