import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import GardenGrid from './GardenGrid';
import FlowerSelector from './FlowerSelector';
import { GardenCell, EmotionFlower } from './types';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const wateringAffirmations = {
  seed: [
    "A moment of care plants seeds of peace 🌱",
    "Every beginning holds potential for growth ✨",
    "Mindfully nurturing new possibilities 💫",
    "Your gentle attention helps life flourish 🌱"
  ],
  sprout: [
    "Watch patiently as your care brings growth 🌿",
    "Each drop of mindfulness helps us grow 💫",
    "Finding peace in nurturing moments ✨",
    "Your kindness creates beautiful growth 🌱"
  ],
  bud: [
    "Your consistent care brings transformation 🌿",
    "Mindful moments bloom into beauty ✨",
    "Growing stronger with each gentle act 💫",
    "Patience and care reveal life's beauty 🌱"
  ],
  bloom: [
    "Your mindful care has created beauty 🌸",
    "Celebrating growth with gratitude ✨",
    "Finding joy in nurturing life 💫",
    "Your garden reflects your peaceful heart 🌱"
  ]
};

const EmojiGarden: React.FC = () => {
  const [selectedFlower, setSelectedFlower] = useState<EmotionFlower | null>(null);
  const [cells, setCells] = useState<GardenCell[]>(
    Array(25).fill(null).map((_, i) => ({
      id: `cell-${i}`,
      emoji: null,
      emotion: '',
      description: '',
      timestamp: new Date(),
      growthStage: 'seed',
      waterCount: 0
    }))
  );
  const { toast } = useToast();

  const handleCellClick = (index: number) => {
    if (!selectedFlower) {
      toast({
        title: "Select a Flower First",
        description: "Choose an emotion flower to plant in your garden!",
      });
      return;
    }

    setCells(prev => {
      const newCells = [...prev];
      newCells[index] = {
        ...newCells[index],
        emoji: selectedFlower.emoji,
        emotion: selectedFlower.emotion,
        description: selectedFlower.description,
        timestamp: new Date(),
        growthStage: 'seed',
        waterCount: 0
      };
      return newCells;
    });

    toast({
      title: "🌱",
      description: "Hover and water to grow",
    });
  };

  const handleWater = (cellId: string) => {
    setCells(prev => prev.map(cell => {
      if (cell.id === cellId) {
        const newWaterCount = (cell.waterCount || 0) + 1;
        let newGrowthStage = cell.growthStage;

        // Update growth stage based on water count (3 steps)
        if (newWaterCount >= 3) {
          newGrowthStage = 'bloom';
        } else if (newWaterCount >= 2) {
          newGrowthStage = 'bud';
        } else if (newWaterCount >= 1) {
          newGrowthStage = 'sprout';
        }

        // Show toast with water droplet and stage-specific affirmation
        const stageAffirmations = wateringAffirmations[newGrowthStage];
        const randomAffirmation = stageAffirmations[Math.floor(Math.random() * stageAffirmations.length)];
        toast({
          title: "💧",
          description: randomAffirmation,
        });

        return {
          ...cell,
          lastWatered: new Date(),
          waterCount: newWaterCount,
          growthStage: newGrowthStage
        };
      }
      return cell;
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-[#0A0F1C] to-[#1A1F3C] px-4 py-6 sm:p-6 text-white"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto space-y-8"
      >
        <motion.div
          variants={item}
          className="text-center mb-12 animate-fade-in relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/20 to-[#D946EF]/20 blur-3xl -z-10" />
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent mb-4">
            Your Emoji Garden 🌸
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-6">
            Plant emotions and watch your garden grow!
          </p>
        </motion.div>

        <motion.div 
          variants={item}
          className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 p-6 space-y-4"
        >
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent">
            Choose Your Emotion
          </h2>
          <FlowerSelector onSelect={setSelectedFlower} />
        </motion.div>

        <motion.div 
          variants={item}
          className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 p-6 space-y-4"
        >
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent">
            Your Garden
          </h2>
          <GardenGrid 
            cells={cells}
            onCellClick={handleCellClick}
            onWater={handleWater}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default EmojiGarden;