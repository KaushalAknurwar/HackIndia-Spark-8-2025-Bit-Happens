import React, { useState } from 'react';
import { Smile, Meh, Frown, Trophy, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import AvatarButton from './Avatar/AvatarButton';

const moods = [
  { emoji: Smile, label: 'Happy', value: 3, color: 'text-duo-green' },
  { emoji: Meh, label: 'Okay', value: 2, color: 'text-duo-yellow' },
  { emoji: Frown, label: 'Sad', value: 1, color: 'text-duo-blue' },
];

const encouragements = [
  "Great job tracking your mood today! 🌟",
  "You're doing amazing! Keep it up! 💫",
  "Every entry helps you understand yourself better! 🎯",
  "Wonderful! You're on a roll! 🌈",
];

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [streak, setStreak] = useState(1);
  const [points, setPoints] = useState(0);
  const { toast } = useToast();

  const handleMoodSelect = (value: number) => {
    setSelectedMood(value);
  };

  const handleSubmit = () => {
    if (selectedMood === null) return;

    const basePoints = 5;
    const streakBonus = streak >= 7 ? 10 : 0;
    const newPoints = points + basePoints + streakBonus;
    
    setPoints(newPoints);
    setStreak(prev => prev + 1);
    
    const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    
    toast({
      title: randomEncouragement,
      description: `You earned ${basePoints + streakBonus} points! 🎉`,
    });

    setSelectedMood(null);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-background to-background/80">
      <div className="max-w-md mx-auto space-y-6">
        <Card className="p-6 shadow-lg border border-border/50 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-8">
            <div className="text-center flex-1">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2">
                How are you feeling?
              </h1>
              <p className="text-sm text-muted-foreground">Track your mood and earn points!</p>
            </div>
            <div className="ml-4">
              <AvatarButton />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {moods.map(({ emoji: EmojiIcon, label, value, color }) => (
              <button
                key={label}
                onClick={() => handleMoodSelect(value)}
                className={`p-4 rounded-xl transition-all duration-300 ${
                  selectedMood === value 
                    ? 'bg-primary/10 scale-105 ring-2 ring-primary/20' 
                    : 'hover:bg-primary/5 hover:scale-102'
                }`}
              >
                <EmojiIcon 
                  className={`w-10 h-10 mx-auto mb-2 ${color} ${
                    selectedMood === value ? 'animate-bounce' : ''
                  }`}
                />
                <span className="block text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={selectedMood === null}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Log Mood
          </Button>
        </Card>

        <Card className="p-6 border border-border/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-duo-yellow" />
              <span className="font-semibold">{points} Points</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-duo-red" />
              <span className="font-semibold">{streak} Day Streak</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Streak Progress</span>
              <span>{streak}/7 days</span>
            </div>
            <Progress 
              value={(streak % 7) * 14.28} 
              className="h-2 bg-secondary"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MoodTracker;