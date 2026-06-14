import React from 'react';
import { motion } from 'framer-motion';

const tasks = [
  { label: 'Grocery Shopping', color: '#EB9486', bg: '#FFE5D9' },
  { label: 'Multiple Store Run', color: '#8B93A7', bg: '#F1F1F1' },
  { label: 'Grocery Put-Away', color: '#EFb985', bg: '#FFE5D9' },
  { label: 'Meal Prep', color: '#8B93A7', bg: '#CAE7B9' },
  { label: 'School Lunch Prep', color: '#97A7B3', bg: '#F1F1F1' },
  { label: 'Snack Prep', color: '#7E7F9A', bg: '#DFE3A2' },
  { label: 'Produce Prep', color: '#8B93A7', bg: '#CAE7B9' },
  { label: 'Pantry Restock', color: '#B58A90', bg: '#F1F1F1' },
  { label: 'Fridge Organization', color: '#97A7B3', bg: '#F1F1F1' },
  { label: 'Freezer Meals', color: '#7E7F9A', bg: '#DFE3A2' },
  { label: 'Returns', color: '#B58A90', bg: '#FFE5D9' },
  { label: 'Donation Dropoff', color: '#7E7F9A', bg: '#F3DE8A' },
  { label: 'Pharmacy Pickup', color: '#B58A90', bg: '#F1F1F1' },
  { label: 'Dry Cleaning', color: '#97A7B3', bg: '#F1F1F1' },
  { label: 'Post Office Runs', color: '#7E7F9A', bg: '#DFE3A2' },
  { label: 'Feeding Pets', color: '#8B93A7', bg: '#CAE7B9' },
  { label: 'Pet Supply Run', color: '#B58A90', bg: '#FFE5D9' },
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
        borderColor: task.color + '55',
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
      <span className="font-body text-sm font-light leading-none" style={{ color: '#333333' }}>
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
