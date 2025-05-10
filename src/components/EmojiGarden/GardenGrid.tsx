import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { GardenGridProps } from './types';
import { growthStages } from './flowerData';




const GardenGrid: React.FC<GardenGridProps> = ({ cells, onCellClick, onWater }) => {
  const getGrowthEmoji = (cell: any) => {
    if (!cell.emoji) return null;
    
    switch (cell.growthStage) {
      case 'seed':
        return growthStages.seed;
      case 'sprout':
        return growthStages.sprout;
      case 'bud':
        return growthStages.bud;
      case 'bloom':
        return cell.emoji;
      default:
        return cell.emoji;
    }
  };

  const getGrowthProgress = (cell: any) => {
    if (!cell.waterCount) return 0;
    const maxWater = 3; // Number of waters needed to reach full bloom
    return Math.min((cell.waterCount / maxWater) * 100, 100);
  };

  return (
    <div className="grid grid-cols-5 gap-4 p-4">
      {cells.map((cell, index) => (
      <TooltipProvider key={cell.id}>
        <Tooltip>
        <TooltipTrigger>
          <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCellClick(index)}
          >
          <Card 
            className={`w-20 h-20 flex flex-col items-center justify-center cursor-pointer relative
            ${cell.emoji ? 'bg-white/10 backdrop-blur-lg' : 'bg-white/5'} 
            border border-white/10 hover:border-white/20 transition-all duration-300`}
          >
            {cell.emoji ? (
            <>
              <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-4xl mb-1"
              >
              {getGrowthEmoji(cell)}
              </motion.span>
              {/* Growth Progress Bar */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getGrowthProgress(cell)}%` }}
                className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF]"
                transition={{ duration: 0.5 }}
              />
              </div>
            </>
            ) : (
            <span className="text-white/40 text-2xl">+</span>
            )}
          </Card>
          </motion.div>
        </TooltipTrigger>
        {cell.emoji && (
            <TooltipContent side="top" sideOffset={5} className="p-2">
              <button 
              onClick={(e) => {
                e.stopPropagation();
                onWater(cell.id);
              }}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 group"
              >
                <span className="text-lg group-hover:scale-110 transition-transform">
                💧
                </span>
              </button>
            </TooltipContent>

        )}
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default GardenGrid;