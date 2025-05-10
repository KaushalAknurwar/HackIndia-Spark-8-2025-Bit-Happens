import React, { useState, useEffect } from 'react';
import BackNavigation from './BackNavigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Play, Pause, RefreshCw } from "lucide-react";

const BreathingGame = () => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);
  const { toast } = useToast();

  const INHALE_TIME = 4000;
  const HOLD_TIME = 7000;
  const EXHALE_TIME = 8000;
  const TOTAL_TIME = INHALE_TIME + HOLD_TIME + EXHALE_TIME;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let startTime: number;

    if (isActive) {
      startTime = Date.now();
      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const totalProgress = (elapsed % TOTAL_TIME) / TOTAL_TIME * 100;
        setProgress(totalProgress);

        if (elapsed % TOTAL_TIME < INHALE_TIME) {
          setPhase('inhale');
        } else if (elapsed % TOTAL_TIME < INHALE_TIME + HOLD_TIME) {
          setPhase('hold');
        } else {
          setPhase('exhale');
        }

        if (elapsed % TOTAL_TIME === 0) {
          setCycles(prev => {
            const newCycles = prev + 1;
            if (newCycles % 3 === 0) {
              toast({
                title: "Great progress! 🌟",
                description: `You've completed ${newCycles} breathing cycles!`,
              });
            }
            return newCycles;
          });
        }
      }, 50);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, toast]);

  const toggleBreathing = () => {
    setIsActive(!isActive);
  };

  const resetBreathing = () => {
    setIsActive(false);
    setProgress(0);
    setPhase('inhale');
    setCycles(0);
  };

  const getInstructions = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe in slowly...';
      case 'hold':
        return 'Hold your breath...';
      case 'exhale':
        return 'Breathe out slowly...';
      default:
        return '';
    }
  };

  const getColor = () => {
    switch (phase) {
      case 'inhale':
        return 'bg-blue-500';
      case 'hold':
        return 'bg-purple-500';
      case 'exhale':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <BackNavigation />
      
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-primary">
            Mindful Breathing Exercise 🌬️
          </h1>
          <p className="text-muted-foreground">
            Follow the rhythm to practice deep, calming breaths
          </p>
        </div>

        <Card className="p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className={`text-2xl font-semibold transition-colors duration-300 ${
              phase === 'inhale' ? 'text-blue-500' :
              phase === 'hold' ? 'text-purple-500' :
              'text-green-500'
            }`}>
              {getInstructions()}
            </div>
            
            <div className="text-lg text-muted-foreground">
              Cycles completed: {cycles}
            </div>
          </div>

          <div className="relative h-48 flex items-center justify-center">
            <div className={`absolute w-48 h-48 rounded-full transition-all duration-300 ${
              phase === 'inhale' ? 'scale-100 opacity-50' :
              phase === 'hold' ? 'scale-110 opacity-70' :
              'scale-90 opacity-30'
            } ${getColor()}`} />
            <div className="relative text-4xl">
              {phase === 'inhale' ? '🌬️' : phase === 'hold' ? '✨' : '😌'}
            </div>
          </div>

          <Progress value={progress} className="w-full" />

          <div className="flex justify-center gap-4">
            <Button
              onClick={toggleBreathing}
              className="gap-2"
              size="lg"
            >
              {isActive ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={resetBreathing}
              className="gap-2"
              size="lg"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Tips for Better Breathing</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Find a comfortable, quiet place to sit or lie down</li>
            <li>• Keep your back straight and shoulders relaxed</li>
            <li>• Place one hand on your chest and one on your belly</li>
            <li>• Focus on the movement of your breath</li>
            <li>• If your mind wanders, gently bring it back to your breath</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default BreathingGame;