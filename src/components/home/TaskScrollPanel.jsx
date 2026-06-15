import React from 'react';
import { motion } from 'framer-motion';

const tasks = [
  { label: 'Home Reset', color: '#EB9486', icon: 'home' },
  { label: 'Laundry Catch-Up', color: '#CAE7B9', icon: 'sparkle' },
  { label: 'Kitchen Reset', color: '#EFB988', icon: 'kitchen' },
  { label: 'Errand Run', color: '#8B93A7', icon: 'bag' },
  { label: 'Grocery Pickup', color: '#DFE3A2', icon: 'bag' },
  { label: 'Meal Prep Help', color: '#7E7F9A', icon: 'kitchen' },
  { label: 'Fridge Refresh', color: '#D8E2DC', icon: 'sparkle' },
  { label: 'Pantry Tidy', color: '#F3DE8A', icon: 'kitchen' },
  { label: 'Donation Drop-Off', color: '#B58A90', icon: 'bag' },
  { label: 'School-Day Support', color: '#97A7B3', icon: 'calendar' },
  { label: 'Appointment Help', color: '#8B93A7', icon: 'calendar' },
  { label: 'Senior Check-In', color: '#B58A90', icon: 'heart' },
  { label: 'Pet & Plant Care', color: '#CAE7B9', icon: 'heart' },
  { label: 'Room Reset', color: '#FFE5D9', icon: 'home' },
  { label: 'Inbox of Life', color: '#F3DE8A', icon: 'sparkle' },
  { label: 'Return Runs', color: '#EFB988', icon: 'bag' },
];

const icons = {
  home: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5 10 4l7 5.5" />
      <path d="M5 8.5V16h10V8.5" />
      <path d="M8.5 16v-4h3v4" />
    </svg>
  ),
  bag: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 7h10l-1 9H6L5 7Z" />
      <path d="M8 7V6a2 2 0 0 1 4 0v1" />
    </svg>
  ),
  kitchen: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 8h10v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Z" />
      <path d="M4 8h12" />
      <path d="M8 8V6a2 2 0 0 1 4 0v2" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4v3M15 4v3" />
      <path d="M4 6h12v10H4z" />
      <path d="M7 10h2M11 10h2M7 13h2" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 16s-6-3.7-6-8a3.3 3.3 0 0 1 6-1.9A3.3 3.3 0 0 1 16 8c0 4.3-6 8-6 8Z" />
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3l1.3 4.2L15.5 8.5l-4.2 1.3L10 14l-1.3-4.2L4.5 8.5l4.2-1.3L10 3Z" />
      <path d="M15 13l.6 1.8 1.9.7-1.9.7L15 18l-.6-1.8-1.9-.7 1.9-.7L15 13Z" />
    </svg>
  ),
};

const col1 = tasks.filter((_, i) => i % 2 === 0);
const col2 = tasks.filter((_, i) => i % 2 === 1);

function withOpacity(hex, opacity = '66') {
  return `${hex}${opacity}`;
}

function TaskColumn({ items, direction = 1, speed = 28 }) {
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden flex-1 relative" style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.18) 7%, black 19%, black 81%, rgba(0,0,0,0.18) 93%, transparent 100%)', maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.18) 7%, black 19%, black 81%, rgba(0,0,0,0.18) 93%, transparent 100%)' }}>
      <motion.div
        animate={{ y: direction === 1 ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
        className="flex flex-col gap-2.5"
      >
        {doubled.map((task, i) => (
          <TaskCard key={`${task.label}-${i}`} task={task} />
        ))}
      </motion.div>
    </div>
  );
}

function TaskCard({ task }) {
  return (
    <div
      className="rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm border select-none whitespace-nowrap"
      style={{
        background: withOpacity(task.color),
        borderColor: task.color,
        minWidth: '178px',
      }}
    >
      <span
        className="w-7 h-7 rounded-xl border flex items-center justify-center shrink-0"
        style={{ borderColor: '#33333325', background: '#FFFFFFB3', color: '#333333' }}
      >
        <span className="w-4 h-4 block">{icons[task.icon]}</span>
      </span>
      <span className="font-body text-sm font-medium leading-none" style={{ color: '#333333' }}>
        {task.label}
      </span>
    </div>
  );
}

export default function TaskScrollPanel() {
  return (
    <div className="relative w-full h-full flex gap-3 px-2 py-4">
      <TaskColumn items={col1} direction={1} speed={34} />
      <TaskColumn items={col2} direction={-1} speed={29} />
    </div>
  );
}
