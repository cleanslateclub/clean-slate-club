import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bell, Search, Plus, Calendar, Users, CreditCard, BarChart3, Settings, Zap, Menu, X, ChevronLeft } from 'lucide-react';
import AdminSidebar from '@/components/admin/os/AdminSidebar';
import AdminCalendarOS from '@/components/admin/os/AdminCalendarOS';
import AdminHouseholdsOS from '@/components/admin/os/AdminHouseholdsOS';
import AdminProvidersOS from '@/components/admin/os/AdminProvidersOS';
import AdminPaymentsOS from '@/components/admin/os/AdminPaymentsOS';
import AdminReportsOS from '@/components/admin/os/AdminReportsOS';
import AdminSettingsOS from '@/components/admin/os/AdminSettingsOS';
import AdminServicesOS from '@/components/admin/os/AdminServicesOS';
import AdminMarketingOS from '@/components/admin/os/AdminMarketingOS';

const TOP_NAV = [
  { key: 'calendar', label: 'Calendar', icon: Calendar },
  { key: 'checkout', label: 'Checkout', icon: CreditCard },
  { key: 'households', label: 'Households', icon: Users },
  { key: 'marketing', label: 'Marketing', icon: Zap },
  { key: 'reports', label: 'Reports', icon: BarChart3 },
  { key: 'settings', label: 'Settings', icon: Settings },
];

// Mobile bottom nav (5 key sections)
const MOBILE_NAV = [
  { key: 'calendar', label: 'Calendar', icon: Calendar },
  { key: 'households', label: 'Clients', icon: Users },
  { key: 'checkout', label: 'Payments', icon: CreditCard },
  { key: 'marketing', label: 'Marketing', icon: Zap },
  { key: 'settings', label: 'Settings', icon: Settings },
];

function renderSection(topSection, sidebarItem) {
  if (sidebarItem) {
    const s = sidebarItem.section;
    if (s === 'schedule' || s === 'bookings') return <AdminCalendarOS sidebarItem={sidebarItem} />;
    if (s === 'services' || s === 'packages' || s === 'addons' || s === 'appt_templates') return <AdminServicesOS sidebarItem={sidebarItem} />;
    if (s === 'households') return <AdminHouseholdsOS sidebarItem={sidebarItem} />;
    if (s === 'providers') return <AdminProvidersOS sidebarItem={sidebarItem} />;
    if (s === 'payments') return <AdminPaymentsOS sidebarItem={sidebarItem} />;
    if (s === 'marketing') return <AdminMarketingOS sidebarItem={sidebarItem} />;
    if (s === 'reports') return <AdminReportsOS sidebarItem={sidebarItem} />;
    if (s === 'settings') return <AdminSettingsOS sidebarItem={sidebarItem} />;
  }
  switch (topSection) {
    case 'calendar':   return <AdminCalendarOS sidebarItem={null} />;
    case 'checkout':   return <AdminPaymentsOS sidebarItem={null} />;
    case 'households': return <AdminHouseholdsOS sidebarItem={null} />;
    case 'marketing':  return <AdminMarketingOS sidebarItem={null} />;
    case 'reports':    return <AdminReportsOS sidebarItem={null} />;
    case 'settings':   return <AdminSettingsOS sidebarItem={null} />;
    default:           return <AdminCalendarOS sidebarItem={null} />;
  }
}

export default function AdminCommandCenter() {
  const navigate = useNavigate();
  const [topSection, setTopSection] = useState('calendar');
  const [sidebarItem, setSidebarItem] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    navigate('/admin');
  };

  const handleTopNav = (key) => {
    setTopSection(key);
    setSidebarItem(null);
    setMobileSidebarOpen(false);
  };

  const handleSidebarNav = (item) => {
    setSidebarItem(item);
    setMobileSidebarOpen(false);
  };

  const sectionLabel = sidebarItem?.label || TOP_NAV.find(n => n.key === topSection)?.label || 'Admin';

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#1a1a2e' }}>

      {/* ── Desktop Top Navigation ── */}
      <header className="hidden md:flex shrink-0 items-center justify-between px-4 h-12 border-b border-white/10" style={{ background: '#1a1a2e' }}>
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-2 mr-4 pr-4 border-r border-white/10">
            <span className="font-logo text-lg text-coral leading-none">Clean Slate</span>
            <span className="font-body text-[10px] text-white/40 uppercase tracking-widest">Club™</span>
          </div>
          {TOP_NAV.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => handleTopNav(item.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body font-light transition-all ${
                  topSection === item.key && !sidebarItem
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 bg-coral text-white px-3 py-1.5 rounded-lg text-xs font-body font-semibold hover:bg-coral/90 transition-colors">
            <Plus className="w-3.5 h-3.5" />
            New Booking
          </button>
          <button className="p-1.5 text-white/40 hover:text-white/70 transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <button onClick={handleLogout} className="p-1.5 text-white/40 hover:text-coral transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── Mobile Top Bar ── */}
      <header className="md:hidden shrink-0 flex items-center justify-between px-4 h-12 border-b border-white/10" style={{ background: '#1a1a2e' }}>
        <button onClick={() => setMobileSidebarOpen(true)} className="p-2 text-white/60 hover:text-white transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="font-logo text-base text-coral leading-none">Clean Slate</span>
          <span className="font-body text-[9px] text-white/40 uppercase tracking-widest">Club™</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 text-white/40 hover:text-white/70">
            <Bell className="w-4 h-4" />
          </button>
          <button onClick={handleLogout} className="p-2 text-white/40 hover:text-coral">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <AdminSidebar
            topSection={topSection}
            activeItem={sidebarItem}
            onNavigate={handleSidebarNav}
          />
        </div>

        {/* Mobile Sidebar Drawer */}
        {mobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
            <div className="w-72 h-full overflow-y-auto flex flex-col" style={{ background: '#1a1a2e' }}>
              <div className="flex items-center justify-between px-4 h-12 border-b border-white/10 shrink-0">
                <span className="font-body text-xs text-white/40 uppercase tracking-widest">Menu</span>
                <button onClick={() => setMobileSidebarOpen(false)} className="p-1.5 text-white/40 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <AdminSidebar
                topSection={topSection}
                activeItem={sidebarItem}
                onNavigate={handleSidebarNav}
              />
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-[#f8f5f2]">
          {renderSection(topSection, sidebarItem)}
        </main>
      </div>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="md:hidden shrink-0 flex items-center border-t border-white/10" style={{ background: '#1a1a2e', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {MOBILE_NAV.map(item => {
          const Icon = item.icon;
          const isActive = topSection === item.key && !sidebarItem;
          return (
            <button
              key={item.key}
              onClick={() => handleTopNav(item.key)}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors ${isActive ? 'text-coral' : 'text-white/35 hover:text-white/60'}`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-body text-[9px] uppercase tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}