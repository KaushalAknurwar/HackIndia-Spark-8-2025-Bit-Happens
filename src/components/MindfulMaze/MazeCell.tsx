import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Star, Heart, Diamond } from 'lucide-react';

interface MazeCellProps {
  isPath: boolean;
  isPlayer: boolean;
  isEnd: boolean;
  collectible?: {
    type: 'star' | 'crystal' | 'heart';
    collected: boolean;
  };
}

const MazeCell = ({ isPath, isPlayer, isEnd, collectible }: MazeCellProps) => {
  const getCollectibleIcon = () => {
    switch (collectible?.type) {
      case 'star':
        return <Star className="w-6 h-6 text-[#D946EF]" />;
      case 'crystal':
        return <Diamond className="w-6 h-6 text-[#8B5CF6]" />;
      case 'heart':
        return <Heart className="w-6 h-6 text-[#D946EF]" />;
      default:
        return null;
    }
  };

  return (
    <div
        className={cn(
        'w-12 h-12 rounded-xl transition-all duration-300 flex items-center justify-center border border-white/5',
        isPath ? 'bg-white/5 backdrop-blur-sm' : 'bg-white/60',
        isEnd && 'bg-gradient-to-r from-[#8B5CF6]/20 to-[#D946EF]/20 animate-pulse'
        )}
    >
      {isPlayer ? (
        <motion.div
          className="w-full h-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] shadow-lg animate-pulse" />
        </motion.div>
      ) : collectible && !collectible.collected ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ 
            scale: [0.8, 1, 0.8],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          {getCollectibleIcon()}
        </motion.div>
      ) : null}
    </div>
  );
};

export default MazeCell;