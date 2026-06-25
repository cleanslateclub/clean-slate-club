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
  { key: 'checkout', label: 'Checkout', icon: CreditCard },
  { key: 'customers', label: 'Customers', icon: Users },
  { key: 'marketing', label: 'Marketing', icon: Bell },
  { key: 'reports', label: 'Reports', icon: BarChart3 },
  { key: 'settings', label: 'Settings', icon: Settings },
  { key: 'more', label: 'More', icon: ClipboardList },
];

const MENU = [
  { title: 'Schedule', icon: CalendarDays, items: ['Today', 'Week View', 'Month View', 'Unassigned Requests', 'Consults', 'Provider Availability', 'Blackouts + Holidays'] },
  { title: 'Bookings', icon: ClipboardList, items: ['New Requests', 'Needs Review', 'Pending Deposit', 'Confirmed', 'Completed', 'Cancelled / No Show'] },
  { title: 'Services', icon: Sparkles, items: ['Hot Mess Express', 'Clean Plate Club', 'Chaos Coordinator', 'The Check-In', 'The Runaround', 'Room Service'] },
  { title: 'Packages', icon: ClipboardList, items: ['Initial Visit', 'Recurring Visit', 'Member Priority', 'Custom Support'] },
  { title: 'Appointments', icon: Bell, items: ['Free Consult', 'Service Visit', 'Follow Up', 'Internal Request'] },
  { title: 'People', icon: Users, items: ['Households', 'Members', 'Leads', 'Providers'] },
  { title: 'Admin Tools', icon: Settings, items: ['Service Menu', 'Booking Rules', 'Payment Rules', 'Message Templates', 'Launch Guards'] },
];

const EVENTS = [
  { title: 'Hot Mess Express', time: '10:00', end: '11:30', status: 'Needs Review', style: 'border-coral bg-coral/10 text-coral' },
  { title: 'Free Consult', time: '12:00', end: '12:15', status: 'Consult', style: 'border-butter bg-butter/25 text-charcoal' },
  { title: 'Clean Plate Club', time: '1:00', end: '3:30', status: 'Confirmed', style: 'border-sage bg-sage/15 text-charcoal' },
  { title: 'The Runaround', time: '4:00', end: '6:00', status: 'Unassigned', style: 'border-dusty-blue bg-dusty-blue/15 text-charcoal' },
];

const DETAILS = {
  'Hot Mess Express': ['Home Reset', '$75/hr', '3 to 5 hr', '$50 deposit', 'Guest-facing'],
  'Clean Plate Club': ['Meal Prep', '$75/hr', '3 to 5 hr', '$50 deposit', 'Guest-facing'],
  'Chaos Coordinator': ['Family Support', '$75/hr', '2 to 4 hr', '$50 deposit', 'Guest-facing'],
  'The Check-In': ['Companion Care', '$75/hr', '2 to 4 hr', '$50 deposit', 'Guest-facing'],
  'The Runaround': ['Errands', '$75/hr', '2 to 4 hr', '$50 deposit', 'Guest-facing'],
  'Room Service': ['Room Reset', '$75/hr', '2 hr min', '$50 deposit', 'Guest-facing'],
  'Initial Visit': ['Package', '$150+', '2 hr min', '$50 deposit', 'Bookable'],
  'Recurring Visit': ['Package', '$300+', '4 to 6 hr', '$50 deposit', 'Member-ready'],
  'Member Priority': ['Membership Package', '$49/mo + service', 'Priority windows', '$50 deposit', 'Member-only'],
  'Custom Support': ['Manual Quote', 'Review', 'Manual', '$50 deposit', 'Admin review'],
  'Free Consult': ['Consult', '$0', '15 min', '$0 deposit', 'Monday 10 to 12'],
  'Service Visit': ['Appointment Template', 'Calculated', 'Service duration', '$50 deposit', 'Calendar block'],
  'Follow Up': ['Appointment Template', '$0+', '15 to 30 min', '$0 deposit', 'Internal/guest'],
  'Internal Request': ['Appointment Template', 'Manual', 'Manual', '$0 deposit', 'Admin only'],
};

const SYNC_TARGETS = ['Online booking', 'Packages', 'Calendar', 'Provider rules', 'Checkout', 'Reports'];

function TopNav({ active, onSelect, onLogout }) {
  return <header className="sticky top-0 z-40 bg-charcoal text-warm-white shadow-sm"><div className="h-16 px-5 flex items-center justify-between gap-4"><div className="flex items-center gap-3 min-w-[210px]"><div className="w-9 h-9 rounded-2xl bg-coral/20 border border-coral/30 flex items-center justify-center font-logo text-coral">C</div><div><p className="font-logo text-xl leading-none">Clean Slate</p><p className="font-body text-[10px] uppercase tracking-[0.24em] text-warm-white/45">Admin OS</p></div></div><nav className="flex-1 flex items-center gap-1 overflow-x-auto">{TOP_NAV.map(item => { const Icon = item.icon; return <button key={item.key} type="button" onClick={() => onSelect(item.key)} className={`h-10 px-3 rounded-xl flex items-center gap-2 text-xs font-body whitespace-nowrap ${active === item.key ? 'bg-warm-white/15 text-warm-white' : 'text-warm-white/60 hover:bg-warm-white/10'}`}><Icon className="w-4 h-4" />{item.label}</button>; })}</nav><button type="button" onClick={onLogout} className="h-10 px-3 rounded-xl border border-warm-white/15 text-xs text-warm-white/70 hover:bg-warm-white/10 flex items-center gap-2"><LogOut className="w-4 h-4" /> Sign Out</button></div></header>;
}

function LeftMenu({ selected, onSelect }) {
  return <aside className="w-[320px] shrink-0 h-[calc(100vh-4rem)] overflow-y-auto bg-warm-white border-r border-taupe/15"><div className="p-4 border-b border-taupe/10"><div className="grid grid-cols-3 gap-2"><button className="rounded-xl bg-coral text-warm-white py-2.5 text-xs font-body">+ Booking</button><button className="rounded-xl bg-sage text-charcoal py-2.5 text-xs font-body">+ Service</button><button className="rounded-xl bg-butter text-charcoal py-2.5 text-xs font-body">+ Package</button></div><div className="mt-3 rounded-xl border border-taupe/20 px-3 py-2 text-xs text-charcoal/35 font-body">Search guests, bookings, services...</div></div><div className="p-3 space-y-4">{MENU.map(section => { const Icon = section.icon; return <div key={section.title}><div className="flex items-center gap-2 px-2 mb-2"><Icon className="w-4 h-4 text-coral" /><p className="font-body text-[11px] uppercase tracking-[0.18em] text-charcoal/45">{section.title}</p></div><div className="space-y-1">{section.items.map(item => <button key={item} type="button" onClick={() => onSelect(section.title, item)} className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-body ${selected === item ? 'bg-coral/10 text-coral border border-coral/20' : 'text-charcoal/65 hover:bg-cream border border-transparent'}`}><span>{item}</span><span className="w-2 h-2 rounded-full bg-sage/70" /></button>)}</div></div>; })}</div></aside>;
}

function AdminSummary() {
  const cards = [['Needs review', '4', 'bg-coral/10 text-coral'], ['Unassigned', '2', 'bg-butter/25 text-charcoal'], ['Confirmed today', '3', 'bg-sage/15 text-charcoal'], ['Payments due', '2', 'bg-dusty-blue/15 text-charcoal']];
  return <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">{cards.map(([label, value, cls]) => <div key={label} className={`rounded-2xl border border-taupe/10 p-4 ${cls}`}><p className="font-heading text-2xl">{value}</p><p className="font-body text-xs mt-1 opacity-70">{label}</p></div>)}</div>;
}

function CalendarBoard({ selected }) {
  return <div className="space-y-4"><AdminSummary /><div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-4"><section className="rounded-3xl bg-warm-white border border-taupe/15 overflow-hidden"><div className="px-4 py-3 border-b border-taupe/10 flex items-center justify-between gap-3 flex-wrap"><div><p className="font-logo text-3xl text-coral leading-tight">Calendar</p><p className="font-body text-sm text-charcoal/45">Schedule first. Every service, package, appointment, provider and payment routes back here.</p></div><div className="flex gap-2"><button className="rounded-xl bg-coral text-warm-white px-4 py-2 text-xs font-body">Day</button><button className="rounded-xl border border-taupe/20 px-4 py-2 text-xs text-charcoal/55 font-body">Week</button><button className="rounded-xl border border-taupe/20 px-4 py-2 text-xs text-charcoal/55 font-body">Month</button><button className="rounded-xl border border-taupe/20 px-4 py-2 text-xs text-charcoal/55 font-body">Filters</button></div></div><div className="grid grid-cols-[72px_1fr] min-h-[560px]"><div className="bg-cream/60 border-r border-taupe/10">{['9 AM','10 AM','11 AM','12 PM','1 PM','2 PM','3 PM','4 PM','5 PM'].map(hour => <div key={hour} className="h-[62px] border-b border-taupe/10 px-3 py-2 text-[11px] text-charcoal/35">{hour}</div>)}</div><div className="relative">{Array.from({ length: 9 }).map((_, index) => <div key={index} className="h-[62px] border-b border-taupe/10" />)}{EVENTS.map((event, index) => <button key={event.title} className={`absolute left-4 right-4 rounded-2xl border p-3 text-left shadow-sm ${event.style}`} style={{ top: 18 + index * 108, minHeight: 82 }}><p className="font-heading text-sm">{event.title}</p><p className="font-body text-[11px] mt-1 opacity-75">{event.time} to {event.end}</p><p className="font-body text-[11px] mt-1 opacity-75">{event.status}</p></button>)}</div></div></section><RightDrawer selected={selected} /></div></div>;
}

function RightDrawer({ selected }) {
  const data = DETAILS[selected] || ['Selected record', 'Editable', 'Calendar linked', 'Payment linked', 'Needs review'];
  return <aside className="rounded-3xl bg-warm-white border border-taupe/15 p-4 h-fit"><p className="font-heading text-lg text-charcoal">Selected</p><p className="font-logo text-2xl text-coral mt-1">{selected}</p><div className="mt-4 space-y-3">{['Type','Price','Duration','Deposit','Visibility'].map((label, index) => <div key={label} className="rounded-2xl border border-taupe/10 bg-cream/40 p-3"><p className="font-body text-[11px] text-charcoal/35">{label}</p><p className="font-body text-sm text-charcoal/65 mt-1">{data[index]}</p></div>)}</div><div className="mt-4 rounded-2xl bg-butter/15 border border-butter/30 p-4 flex gap-3"><AlertTriangle className="w-4 h-4 text-coral mt-0.5" /><p className="font-body text-xs text-charcoal/50 leading-relaxed">Safe preview. Payments, texts, auto-assignment and policy fees stay locked until verified.</p></div></aside>;
}

function ManageView({ selected }) {
  const data = DETAILS[selected] || ['Custom record', 'Editable', 'Manual', 'Optional', 'Internal'];
  return <div className="rounded-3xl bg-warm-white border border-taupe/15 overflow-hidden"><div className="px-4 py-3 border-b border-taupe/10 flex items-center justify-between gap-3 flex-wrap"><div><p className="font-logo text-3xl text-coral leading-tight">Manage Services, Packages & Appointments</p><p className="font-body text-sm text-charcoal/45">Create, edit, archive, duplicate, price, schedule, and keep the calendar updated.</p></div><div className="flex gap-2"><button className="rounded-xl bg-sage px-4 py-2 text-xs text-charcoal font-body">Create New</button><button className="rounded-xl border border-taupe/20 px-4 py-2 text-xs text-charcoal/55 font-body">Duplicate</button><button className="rounded-xl border border-coral/30 px-4 py-2 text-xs text-coral font-body">Delete / Archive</button><button className="rounded-xl bg-coral px-4 py-2 text-xs text-warm-white font-body">Save Changes</button></div></div><div className="p-4 grid grid-cols-1 xl:grid-cols-[1fr_1fr_320px] gap-4"><section className="rounded-2xl border border-taupe/10 bg-cream/30 p-4 space-y-3"><p className="font-body text-[11px] uppercase tracking-[0.18em] text-coral">Details</p><Field label="Name" value={selected} /><Field label="Type" value={data[0]} /><Field label="Visibility" value={data[4]} /></section><section className="rounded-2xl border border-taupe/10 bg-cream/30 p-4 space-y-3"><p className="font-body text-[11px] uppercase tracking-[0.18em] text-coral">Pricing + Schedule</p><Field label="Price" value={data[1]} /><Field label="Duration" value={data[2]} /><Field label="Deposit" value={data[3]} /></section><section className="rounded-2xl border border-dusty-blue/25 bg-dusty-blue/10 p-4"><p className="font-heading text-sm text-charcoal">Updates Everywhere</p>{SYNC_TARGETS.map(item => <div key={item} className="mt-2 rounded-xl bg-warm-white border border-taupe/10 px-3 py-2 text-xs text-charcoal/55">{item}</div>)}</section></div></div>;
}

function Field({ label, value }) {
  return <label className="block"><span className="font-body text-xs text-charcoal/45">{label}</span><div className="mt-1 rounded-xl bg-warm-white border border-taupe/20 px-3 py-2 text-sm text-charcoal/70 min-h-[38px]">{value}</div></label>;
}

function Workspace({ active, section, selected }) {
  if (['Services', 'Packages', 'Appointments'].includes(section)) return <ManageView selected={selected} />;
  if (section === 'Bookings') return <BookingsWorkspace />;
  if (section === 'Admin Tools') return <SettingsWorkspace />;
  if (active === 'checkout') return <PaymentsWorkspace />;
  if (active === 'customers') return <HouseholdsWorkspace />;
  if (active === 'marketing') return <MessagesWorkspace />;
  if (active === 'more') return <SettingsWorkspace />;
  if (active === 'bookings') return <BookingsWorkspace />;
  if (active === 'households') return <HouseholdsWorkspace />;
  if (active === 'providers') return <ProvidersWorkspace />;
  if (active === 'payments') return <PaymentsWorkspace />;
  if (active === 'reports') return <ReportsWorkspace />;
  if (active === 'settings') return <SettingsWorkspace />;
  return <CalendarBoard selected={selected} />;
}

export default function AdminCommandCenter() {
  const navigate = useNavigate();
  const [active, setActive] = useState('calendar');
  const [section, setSection] = useState('Schedule');
  const [selected, setSelected] = useState('Today');
  const logout = () => { localStorage.removeItem('adminSession'); navigate('/admin'); };
  const selectTopNav = next => { setActive(next); if (next === 'home' || next === 'calendar') { setSection('Schedule'); setSelected('Today'); } if (next === 'checkout') { setSection('Payments'); setSelected('Checkout'); } if (next === 'customers') { setSection('People'); setSelected('Households'); } if (next === 'marketing') { setSection('Marketing'); setSelected('Campaigns'); } };
  const selectMenu = (nextSection, nextSelected) => { setSection(nextSection); setSelected(nextSelected); if (nextSection === 'Schedule') setActive('calendar'); if (nextSection === 'Bookings') setActive('bookings'); if (['Services','Packages','Appointments'].includes(nextSection)) setActive('more'); if (nextSection === 'Admin Tools') setActive('settings'); if (nextSection === 'People' && nextSelected === 'Providers') setActive('providers'); if (nextSection === 'People' && nextSelected !== 'Providers') setActive('customers'); };
  return <main className="min-h-screen bg-cream"><TopNav active={active} onSelect={selectTopNav} onLogout={logout} /><div className="flex"><LeftMenu selected={selected} onSelect={selectMenu} /><section className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto"><div className="sticky top-0 z-20 bg-cream/90 backdrop-blur border-b border-taupe/10 px-5 py-3 flex items-center justify-between gap-3 flex-wrap"><div className="flex items-center gap-2 flex-wrap"><span className="rounded-full bg-coral/10 border border-coral/20 px-3 py-1 text-xs text-coral font-body">Working admin build</span><span className="rounded-full bg-sage/15 border border-sage/25 px-3 py-1 text-xs text-charcoal/60 font-body">{section}</span><span className="rounded-full bg-dusty-blue/15 border border-dusty-blue/25 px-3 py-1 text-xs text-charcoal/60 font-body">{selected}</span></div><p className="font-body text-xs text-charcoal/40">Calendar-forward operations for a lifestyle support business.</p></div><div className="p-5 max-w-[1500px] mx-auto space-y-4"><Workspace active={active} section={section} selected={selected} />{['Services','Packages','Appointments'].includes(section) && <ServicesOSTab />}{active === 'calendar' && <CalendarWorkspace />}{active === 'bookings' && <BookingActionCenter />}{active === 'marketing' && <MessagesWorkspace />}</div></section></div></main>;
}
