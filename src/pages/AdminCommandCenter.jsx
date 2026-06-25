import React, { useState } from 'react';
import { AlertTriangle, BarChart3, Bell, CalendarDays, ClipboardList, CreditCard, Home, LogOut, Settings, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BookingActionCenter from '@/components/admin/BookingActionCenter';
import BookingsWorkspace from '@/components/admin/BookingsWorkspace';
import CalendarWorkspace from '@/components/admin/CalendarWorkspace';
import HouseholdsWorkspace from '@/components/admin/HouseholdsWorkspace';
import MessagesWorkspace from '@/components/admin/MessagesWorkspace';
import PaymentsWorkspace from '@/components/admin/PaymentsWorkspace';
import ProvidersWorkspace from '@/components/admin/ProvidersWorkspace';
import ReportsWorkspace from '@/components/admin/ReportsWorkspace';
import ServicesOSTab from '@/components/admin/ServicesOSTab';
import SettingsWorkspace from '@/components/admin/SettingsWorkspace';

const TOP_NAV = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'calendar', label: 'Calendar', icon: CalendarDays },
  { key: 'bookings', label: 'Bookings', icon: ClipboardList },
  { key: 'households', label: 'Households', icon: Users },
  { key: 'providers', label: 'Providers', icon: ShieldCheck },
  { key: 'payments', label: 'Payments', icon: CreditCard },
  { key: 'reports', label: 'Reports', icon: BarChart3 },
  { key: 'settings', label: 'Settings', icon: Settings },
];

const LEFT_MENU = [
  { title: 'Schedule', icon: CalendarDays, items: ['Today', 'Week View', 'Unassigned Requests', 'Consults', 'Provider Availability', 'Blackouts + Holidays'] },
  { title: 'Services', icon: Sparkles, items: ['Hot Mess Express', 'Clean Plate Club', 'Chaos Coordinator', 'The Check-In', 'The Runaround', 'Room Service'] },
  { title: 'Packages', icon: ClipboardList, items: ['Initial Visit', 'Recurring Visit', 'Member Priority', 'Custom Support'] },
  { title: 'Appointments', icon: Bell, items: ['Free Consult', 'Service Visit', 'Follow Up', 'Internal Request'] },
  { title: 'People', icon: Users, items: ['Households', 'Members', 'Leads', 'Providers'] },
];

const CALENDAR_EVENTS = [
  { title: 'Hot Mess Express', time: '10:00 AM', end: '11:30 AM', household: 'Needs Review', style: 'border-coral bg-coral/10 text-coral' },
  { title: 'Free Consult', time: '12:00 PM', end: '12:15 PM', household: 'New Lead', style: 'border-butter bg-butter/25 text-charcoal' },
  { title: 'Clean Plate Club', time: '1:00 PM', end: '3:30 PM', household: 'Confirmed Member', style: 'border-sage bg-sage/15 text-charcoal' },
  { title: 'The Runaround', time: '4:00 PM', end: '6:00 PM', household: 'Unassigned', style: 'border-dusty-blue bg-dusty-blue/15 text-charcoal' },
];

function TopNav({ active, onSelect, onLogout }) {
  return (
    <header className="sticky top-0 z-40 bg-charcoal text-warm-white shadow-sm">
      <div className="h-16 px-5 flex items-center justify-between gap-4">
        <div className="min-w-[190px]">
          <p className="font-logo text-xl leading-none">Clean Slate</p>
          <p className="font-body text-[10px] uppercase tracking-[0.25em] text-warm-white/45">Admin OS</p>
        </div>
        <nav className="flex-1 flex items-center gap-1 overflow-x-auto">
          {TOP_NAV.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.key} type="button" onClick={() => onSelect(item.key)} className={`h-10 px-3 rounded-xl flex items-center gap-2 text-xs font-body whitespace-nowrap ${active === item.key ? 'bg-warm-white/15 text-warm-white' : 'text-warm-white/60 hover:bg-warm-white/10'}`}>
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <button type="button" onClick={onLogout} className="h-10 px-3 rounded-xl border border-warm-white/15 text-xs text-warm-white/70 hover:bg-warm-white/10 flex items-center gap-2">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </header>
  );
}

function LeftMenu({ activeItem, onSelect }) {
  return (
    <aside className="w-[310px] shrink-0 h-[calc(100vh-4rem)] overflow-y-auto bg-warm-white border-r border-taupe/15">
      <div className="p-4 border-b border-taupe/10">
        <div className="grid grid-cols-2 gap-2">
          <button className="rounded-xl bg-coral text-warm-white py-2.5 text-xs font-body">+ Booking</button>
          <button className="rounded-xl bg-sage text-charcoal py-2.5 text-xs font-body">+ Service</button>
        </div>
        <div className="mt-3 rounded-xl border border-taupe/20 px-3 py-2 text-xs text-charcoal/35 font-body">Search guests, bookings, services...</div>
      </div>
      <div className="p-3 space-y-4">
        {LEFT_MENU.map(section => {
          const Icon = section.icon;
          return (
            <div key={section.title}>
              <div className="flex items-center gap-2 px-2 mb-2">
                <Icon className="w-4 h-4 text-coral" />
                <p className="font-body text-[11px] uppercase tracking-[0.18em] text-charcoal/45">{section.title}</p>
              </div>
              <div className="space-y-1">
                {section.items.map((item, index) => (
                  <button key={item} type="button" onClick={() => onSelect(section.title, item)} className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-body ${activeItem === item ? 'bg-coral/10 text-coral border border-coral/20' : 'text-charcoal/65 hover:bg-cream border border-transparent'}`}>
                    <span>{item}</span>
                    <span className="w-2 h-2 rounded-full bg-sage/70" />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function CalendarFirstView({ selectedItem }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
      <section className="rounded-3xl bg-warm-white border border-taupe/15 overflow-hidden">
        <div className="px-4 py-3 border-b border-taupe/10 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="font-logo text-3xl text-coral leading-tight">Calendar</p>
            <p className="font-body text-sm text-charcoal/45 font-light">Schedule first. Services, packages, appointments, providers, and payments connect back here.</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-xl bg-coral text-warm-white px-4 py-2 text-xs font-body">Day</button>
            <button className="rounded-xl border border-taupe/20 px-4 py-2 text-xs text-charcoal/55 font-body">Week</button>
            <button className="rounded-xl border border-taupe/20 px-4 py-2 text-xs text-charcoal/55 font-body">Month</button>
          </div>
        </div>
        <div className="grid grid-cols-[72px_1fr] min-h-[560px]">
          <div className="bg-cream/60 border-r border-taupe/10">
            {['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'].map(hour => <div key={hour} className="h-[62px] border-b border-taupe/10 px-3 py-2 text-[11px] text-charcoal/35">{hour}</div>)}
          </div>
          <div className="relative">
            {['9', '10', '11', '12', '1', '2', '3', '4', '5'].map(hour => <div key={hour} className="h-[62px] border-b border-taupe/10" />)}
            {CALENDAR_EVENTS.map((event, index) => (
              <button key={event.title} className={`absolute left-4 right-4 rounded-2xl border p-3 text-left shadow-sm ${event.style}`} style={{ top: 18 + index * 108, minHeight: 82 }}>
                <p className="font-heading text-sm">{event.title}</p>
                <p className="font-body text-[11px] mt-1 opacity-75">{event.time} to {event.end}</p>
                <p className="font-body text-[11px] mt-1 opacity-75">{event.household}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <aside className="rounded-3xl bg-warm-white border border-taupe/15 p-4 h-fit">
        <p className="font-heading text-lg text-charcoal">Selected</p>
        <p className="font-logo text-2xl text-coral mt-1">{selectedItem}</p>
        <div className="mt-4 space-y-3">
          {['Guest details', 'Service/package', 'Provider assignment', 'Deposit + balance', 'Readiness warnings'].map(label => (
            <div key={label} className="rounded-2xl border border-taupe/10 bg-cream/40 p-3 text-sm font-body text-charcoal/60">{label}</div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl bg-butter/15 border border-butter/30 p-4 flex gap-3">
          <AlertTriangle className="w-4 h-4 text-coral mt-0.5" />
          <p className="font-body text-xs text-charcoal/50 leading-relaxed">This is the admin UI rebuild. Payment sends, SMS sends, provider auto-assignment, and policy fees still stay locked until verified.</p>
        </div>
      </aside>
    </div>
  );
}

function ManageThingsView({ selectedItem }) {
  return (
    <div className="rounded-3xl bg-warm-white border border-taupe/15 overflow-hidden">
      <div className="px-4 py-3 border-b border-taupe/10 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="font-logo text-3xl text-coral leading-tight">Manage Services, Packages & Appointments</p>
          <p className="font-body text-sm text-charcoal/45">Create, edit, archive, duplicate, price, schedule, and connect everything back to booking and calendar logic.</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-xl border border-taupe/20 px-4 py-2 text-xs text-charcoal/55 font-body">Duplicate</button>
          <button className="rounded-xl border border-coral/30 px-4 py-2 text-xs text-coral font-body">Archive</button>
          <button className="rounded-xl bg-coral px-4 py-2 text-xs text-warm-white font-body">Save Changes</button>
        </div>
      </div>
      <div className="p-4 grid grid-cols-1 xl:grid-cols-3 gap-4">
        {['Basic Information', 'Pricing & Duration', 'Online Booking'].map((title, index) => (
          <section key={title} className="rounded-2xl border border-taupe/10 bg-cream/30 p-4">
            <p className="font-body text-[11px] uppercase tracking-[0.18em] text-coral">{title}</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-warm-white border border-taupe/20 px-3 py-2 text-sm text-charcoal">{index === 0 ? selectedItem : index === 1 ? '$75/hr • 2 hr minimum' : 'Visible online • deposit required'}</div>
              <div className="rounded-xl bg-warm-white border border-taupe/20 px-3 py-2 text-sm text-charcoal/55">Connected to packages, forms, calendar, providers, checkout, reports</div>
              <div className="flex items-center justify-between rounded-xl bg-warm-white border border-taupe/20 px-3 py-2">
                <span className="font-body text-sm text-charcoal/60">Active</span>
                <span className="w-11 h-6 rounded-full bg-sage relative"><span className="absolute right-1 top-1 w-4 h-4 bg-warm-white rounded-full" /></span>
              </div>
            </div>
          </section>
        ))}
      </div>
      <div className="m-4 rounded-2xl border border-dusty-blue/25 bg-dusty-blue/10 p-4 text-sm text-charcoal/55 font-body">
        Changes should update online booking, calendar estimates, package contents, provider eligibility, deposits, final checkout, and reporting.
      </div>
    </div>
  );
}

function Workspace({ active, menuSection, selectedItem }) {
  if (menuSection === 'Services' || menuSection === 'Packages' || menuSection === 'Appointments') return <ManageThingsView selectedItem={selectedItem} />;
  if (active === 'bookings') return <BookingsWorkspace />;
  if (active === 'households') return <HouseholdsWorkspace />;
  if (active === 'providers') return <ProvidersWorkspace />;
  if (active === 'payments') return <PaymentsWorkspace />;
  if (active === 'reports') return <ReportsWorkspace />;
  if (active === 'settings') return <SettingsWorkspace />;
  return <CalendarFirstView selectedItem={selectedItem} />;
}

export default function AdminCommandCenter() {
  const navigate = useNavigate();
  const [active, setActive] = useState('calendar');
  const [menuSection, setMenuSection] = useState('Schedule');
  const [selectedItem, setSelectedItem] = useState('Today');

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    navigate('/admin');
  };

  const handleMenuSelect = (section, item) => {
    setMenuSection(section);
    setSelectedItem(item);
    if (section === 'Schedule') setActive('calendar');
    if (['Services', 'Packages', 'Appointments'].includes(section)) setActive('services');
    if (section === 'People' && item === 'Providers') setActive('providers');
    if (section === 'People' && item !== 'Providers') setActive('households');
  };

  return (
    <main className="min-h-screen bg-cream">
      <TopNav active={active} onSelect={setActive} onLogout={handleLogout} />
      <div className="flex">
        <LeftMenu activeItem={selectedItem} onSelect={handleMenuSelect} />
        <section className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="sticky top-0 z-20 bg-cream/90 backdrop-blur border-b border-taupe/10 px-5 py-3 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded-full bg-coral/10 border border-coral/20 px-3 py-1 text-xs text-coral font-body">Calendar-first admin v2</span>
              <span className="rounded-full bg-sage/15 border border-sage/25 px-3 py-1 text-xs text-charcoal/60 font-body">{menuSection}</span>
              <span className="rounded-full bg-dusty-blue/15 border border-dusty-blue/25 px-3 py-1 text-xs text-charcoal/60 font-body">{selectedItem}</span>
            </div>
            <p className="font-body text-xs text-charcoal/40">Designed around Vagaro-style navigation for a lifestyle support business.</p>
          </div>
          <div className="p-5 max-w-[1500px] mx-auto space-y-4">
            <Workspace active={active} menuSection={menuSection} selectedItem={selectedItem} />
            {active === 'services' && <ServicesOSTab />}
            {active === 'calendar' && <CalendarWorkspace />}
            {active === 'bookings' && <BookingActionCenter />}
            {active === 'messages' && <MessagesWorkspace />}
          </div>
        </section>
      </div>
    </main>
  );
}
