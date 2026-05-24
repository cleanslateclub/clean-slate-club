import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const tasks = [
  { label: 'Grocery Shopping',    color: '#EB9486', bg: '#fef0ee' },
  { label: 'Multiple Store Run',  color: '#EFB988', bg: '#fef5ec' },
  { label: 'Grocery Put-Away',    color: '#EB9486', bg: '#fef0ee' },
  { label: 'Meal Prep',           color: '#CAE7B9', bg: '#eef8ea' },
  { label: 'School Lunch Prep',   color: '#97A7B3', bg: '#eef1f4' },
  { label: 'Snack Prep',          color: '#EFB988', bg: '#fef5ec' },
  { label: 'Produce Prep',        color: '#CAE7B9', bg: '#eef8ea' },
  { label: 'Pantry Restock',      color: '#B58A90', bg: '#f7edef' },
  { label: 'Fridge Organization', color: '#97A7B3', bg: '#eef1f4' },
  { label: 'Freezer Meals',       color: '#CAE7B9', bg: '#eef8ea' },
  { label: 'Returns',             color: '#EFB988', bg: '#fef5ec' },
  { label: 'Donation Dropoff',    color: '#B58A90', bg: '#f7edef' },
  { label: 'Pharmacy Pickup',     color: '#EB9486', bg: '#fef0ee' },
  { label: 'Dry Cleaning',        color: '#97A7B3', bg: '#eef1f4' },
  { label: 'Post Office Runs',    color: '#EFB988', bg: '#fef5ec' },
  { label: 'Feeding Pets',        color: '#CAE7B9', bg: '#eef8ea' },
  { label: 'Pet Supply Run',      color: '#B58A90', bg: '#f7edef' },
];

// Emoji map for a little extra personality
const emojis = {
  'Grocery Shopping':    '🛒',
  'Multiple Store Run':  '🗺️',
  'Grocery Put-Away':    '🥫',
  'Meal Prep':           '🍳',
  'School Lunch Prep':   '🥪',
  'Snack Prep':          '🍎',
  'Produce Prep':        '🥦',
  'Pantry Restock':      '🧺',
  'Fridge Organization': '❄️',
  'Freezer Meals':       '🫙',
  'Returns':             '📦',
  'Donation Dropoff':    '💛',
  'Pharmacy Pickup':     '💊',
  'Dry Cleaning':        '👗',
  'Post Office Runs':    '✉️',
  'Feeding Pets':        '🐾',
  'Pet Supply Run':      '🦴',
};

// Split into two columns with offset
const col1 = tasks.filter((_, i) => i % 2 === 0);
const col2 = tasks.filter((_, i) => i % 2 === 1);

function TaskColumn({ items, direction = 1, speed = 28 }) {
  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden flex-1 relative" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)' }}>
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
        background: task.bg,
        borderColor: task.color + '30',
        minWidth: '170px',
      }}
    >
      {/* Checkbox */}
      <span
        className="w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 text-white text-[10px] font-bold"
        style={{ borderColor: task.color, background: task.color }}
      >
        ✓
      </span>
      <span className="font-body text-sm font-light text-charcoal/75 leading-none">
        {emojis[task.label] && <span className="mr-1.5">{emojis[task.label]}</span>}
        {task.label}
      </span>
    </div>
  );
}

export default function TaskScrollPanel() {
  return (
    <div className="relative w-full h-full flex gap-3 px-2 py-4">
      <TaskColumn items={col1} direction={1} speed={32} />
      <TaskColumn items={col2} direction={-1} speed={26} />
    </div>
  );
}