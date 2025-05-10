import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { EmotionFlower, EmotionCategory } from './types';
import { emotionFlowers } from './flowerData';

interface FlowerSelectorProps {
  onSelect: (flower: EmotionFlower) => void;
}

const FlowerSelector: React.FC<FlowerSelectorProps> = ({ onSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<EmotionCategory | 'all'>('all');

  const categories: { [key in EmotionCategory]: string } = {
    positive: '✨ Positive',
    growth: '🌱 Growth',
    calming: '🍃 Calming',
    energetic: '⚡ Energetic'
  };

  const filteredFlowers = selectedCategory === 'all' 
    ? emotionFlowers 
    : emotionFlowers.filter(flower => flower.category === selectedCategory);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full text-sm ${
            selectedCategory === 'all' 
              ? 'bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white' 
              : 'bg-white/10 text-white/80 hover:bg-white/20'
          }`}
        >
          All
        </motion.button>
        {Object.entries(categories).map(([category, label]) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(category as EmotionCategory)}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedCategory === category 
                ? 'bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white' 
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            {label}
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredFlowers.map((flower) => (
          <motion.div
            key={flower.emoji}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card
              className="p-4 cursor-pointer bg-white/10 hover:bg-white/20 border-white/10 transition-all duration-300"
              onClick={() => onSelect(flower)}
            >
              <div className="text-center">
                <span className="text-3xl block mb-2">{flower.emoji}</span>
                <p className="text-sm font-medium text-white">{flower.emotion}</p>
                <p className="text-xs text-white/60 mt-1">{flower.description}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FlowerSelector;