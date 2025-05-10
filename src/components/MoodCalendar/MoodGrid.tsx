import React from 'react';
import { motion } from 'framer-motion';

interface MoodGridProps {
  selectedMood: string;
  onMoodSelect: (mood: string) => void;
  MOODS: Record<string, { label: string; prompt: string; color: string }>;
}

const MoodGrid = ({ selectedMood, onMoodSelect, MOODS }: MoodGridProps) => {
  return (
    <div className="grid grid-cols-4 gap-3">
      {Object.entries(MOODS).map(([emoji, { label, color }]) => (
        <motion.button
          key={emoji}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onMoodSelect(emoji)}
          className={`p-4 rounded-lg flex flex-col items-center gap-2 transition-colors
            ${selectedMood === emoji ? 'ring-2 ring-primary' : 'hover:bg-accent'}
            ${selectedMood === emoji ? color : ''}`}
          aria-label={`Select ${label} mood`}
        >
          <span className="text-3xl" role="img" aria-label={label}>
            {emoji}
          </span>
          <span className="text-xs font-medium text-black">{label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default MoodGrid;