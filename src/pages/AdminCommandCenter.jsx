import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bell, Search, ChevronDown, Plus, Calendar, Users, CreditCard, BarChart3, Settings, Home, MoreHorizontal, Package, FileText, Zap } from 'lucide-react';
import AdminSidebar from '@/components/admin/os/AdminSidebar';
import AdminCalendarOS from '@/components/admin/os/AdminCalendarOS';
import AdminBookingsOS from '@/components/admin/os/AdminBookingsOS';
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

export default function AdminCommandCenter() {
  const navigate = useNavigate();
  const [topSection, setTopSection] = useState('calendar');
  const [sidebarItem, setSidebarItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    navigate('/admin');
  };

  const handleTopNav = (key) => {
    setTopSection(key);
    setSidebarItem(null);
  };

  const handleSidebarNav = (item) => {
    setSidebarItem(item);
  };

  const renderMain = () => {
    // Sidebar item takes priority
    if (sidebarItem) {
      const section = sidebarItem.section;
      if (section === 'schedule' || section === 'bookings') return <AdminCalendarOS sidebarItem={sidebarItem} />;
      if (section === 'services' || section === 'packages' || section === 'addons' || section === 'appt_templates') return <AdminServicesOS sidebarItem={sidebarItem} />;
      if (section === 'households') return <AdminHouseholdsOS sidebarItem={sidebarItem} />;
      if (section === 'providers') return <AdminProvidersOS sidebarItem={sidebarItem} />;
      if (section === 'payments') return <AdminPaymentsOS sidebarItem={sidebarItem} />;
      if (section === 'marketing') return <AdminMarketingOS sidebarItem={sidebarItem} />;
      if (section === 'reports') return <AdminReportsOS sidebarItem={sidebarItem} />;
      if (section === 'settings') return <AdminSettingsOS sidebarItem={sidebarItem} />;
    }

    // Top nav fallback
    switch (topSection) {
      case 'calendar': return <AdminCalendarOS sidebarItem={null} />;
      case 'checkout': return <AdminPaymentsOS sidebarItem={null} />;
      case 'households': return <AdminHouseholdsOS sidebarItem={null} />;
      case 'marketing': return <AdminMarketingOS sidebarItem={null} />;
      case 'reports': return <AdminReportsOS sidebarItem={null} />;
      case 'settings': return <AdminSettingsOS sidebarItem={null} />;
      default: return <AdminCalendarOS sidebarItem={null} />;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#1a1a2e' }}>
      {/* ── Dark Top Navigation ── */}
      <header className="shrink-0 flex items-center justify-between px-4 h-12 border-b border-white/10" style={{ background: '#1a1a2e' }}>
        {/* Left: brand + nav */}
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

        {/* Right: search + actions */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search bookings, households..."
              className="bg-white/8 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs font-body text-white/70 placeholder-white/25 focus:outline-none focus:border-coral/40 w-56"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            />
          </div>
          <button className="flex items-center gap-1.5 bg-coral text-white px-3 py-1.5 rounded-lg text-xs font-body font-semibold hover:bg-coral/90 transition-colors">
            <Plus className="w-3.5 h-3.5" />
            New Booking
          </button>
          <button className="p-1.5 text-white/40 hover:text-white/70 transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <button
            onClick={handleLogout}
            className="p-1.5 text-white/40 hover:text-coral transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── Body: Sidebar + Main ── */}
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar
          topSection={topSection}
          activeItem={sidebarItem}
          onNavigate={handleSidebarNav}
        />
        <main className="flex-1 overflow-auto bg-[#f8f5f2]">
          {renderMain()}
        </main>
      </div>
    </div>
  );
}