import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface BreathingExerciseProps {
  onComplete: () => void;
}

const BreathingExercise = ({ onComplete }: BreathingExerciseProps) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          switch (phase) {
            case 'inhale':
              setPhase('hold');
              return 0;
            case 'hold':
              setPhase('exhale');
              return 0;
            case 'exhale':
              clearInterval(timer);
              onComplete();
              return 0;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [phase]);

  const circleVariants = {
    inhale: {
      scale: 1.5,
      transition: { duration: 4, ease: "easeInOut" }
    },
    hold: {
      scale: 1.5,
      transition: { duration: 4, ease: "easeInOut" }
    },
    exhale: {
      scale: 1,
      transition: { duration: 4, ease: "easeInOut" }
    }
  };

  return (
    <div className="text-center space-y-6">
      <h3 className="text-2xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent">
        Mindful Breathing
      </h3>
      <motion.div
        className="w-40 h-40 mx-auto rounded-full bg-white/5 backdrop-blur-lg border border-white/10 flex items-center justify-center relative overflow-hidden group"
        animate={phase}
        variants={circleVariants}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/20 to-[#D946EF]/20 blur-xl" />
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/10 via-[#D946EF]/10 to-[#8B5CF6]/10 blur-xl"
        />
        <span className="text-white font-medium text-lg relative z-10">
          {phase === 'inhale' ? 'Breathe In' : phase === 'hold' ? 'Hold' : 'Breathe Out'}
        </span>
      </motion.div>
      <div className="w-full max-w-md mx-auto bg-white/5 backdrop-blur-lg rounded-full p-2 border border-white/10">
        <Progress 
          value={progress} 
          className="h-2 bg-white/10" 
        />
      </div>
    </div>
  );
};

export default BreathingExercise;