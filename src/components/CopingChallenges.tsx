import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Award, Shield, ThumbsUp, Flag, Check } from 'lucide-react';

type Challenge = {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  completed: boolean;
  icon: keyof typeof icons;
};

const icons = {
  award: Award,
  shield: Shield,
  thumbsUp: ThumbsUp,
  flag: Flag,
  check: Check,
};

const initialChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Deep Breathing Exercise',
    description: 'Practice deep breathing for 5 minutes',
    difficulty: 'easy',
    points: 10,
    completed: false,
    icon: 'shield',
  },
  {
    id: '2',
    title: 'Gratitude Journal',
    description: "Write down 3 things you're grateful for",
    difficulty: 'easy',
    points: 15,
    completed: false,
    icon: 'thumbsUp',
  },
  {
    id: '3',
    title: 'Mindful Walking',
    description: 'Take a 10-minute mindful walk outside',
    difficulty: 'medium',
    points: 25,
    completed: false,
    icon: 'flag',
  },
  {
    id: '4',
    title: 'Stress Relief Routine',
    description: 'Complete a 15-minute stress relief routine',
    difficulty: 'hard',
    points: 40,
    completed: false,
    icon: 'award',
  },
];

const difficultyColors = {
  easy: 'bg-duo-green/10 text-duo-green',
  medium: 'bg-duo-orange/10 text-duo-orange',
  hard: 'bg-duo-purple/10 text-duo-purple',
};

const CopingChallenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [totalPoints, setTotalPoints] = useState(0);
  const { toast } = useToast();

  const completeChallenge = (challengeId: string) => {
    setChallenges(prevChallenges =>
      prevChallenges.map(challenge => {
        if (challenge.id === challengeId && !challenge.completed) {
          setTotalPoints(prev => prev + challenge.points);
          
          toast({
            title: "Challenge Completed! 🎉",
            description: `You earned ${challenge.points} points!`,
          });

          if (totalPoints + challenge.points >= 50) {
            toast({
              title: "New Badge Earned! 🏆",
              description: "You've become a Coping Champion!",
            });
          }

          return { ...challenge, completed: true };
        }
        return challenge;
      })
    );
  };

  return (
    <div className="space-y-8 p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-duo-purple to-duo-blue bg-clip-text text-transparent">
          Coping Challenges
        </h2>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-duo-yellow/10">
          <Award className="w-6 h-6 text-duo-yellow" />
          <span className="font-bold text-duo-yellow">{totalPoints} Points</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
        {challenges.map(challenge => {
          const IconComponent = icons[challenge.icon];
          
          return (
            <Card
              key={challenge.id}
              className={`p-8 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                challenge.completed ? 'opacity-75' : ''
              } bg-zinc-900/90 backdrop-blur-sm border-2 border-zinc-800 text-white`}
            >
              <div className="flex flex-col h-full space-y-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${difficultyColors[challenge.difficulty]}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <Badge variant="secondary" className={`${difficultyColors[challenge.difficulty]} border-none text-sm`}>
                      {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                    </Badge>
                  </div>
                  <span className="font-bold text-lg text-duo-purple">{challenge.points} pts</span>
                </div>

                <div className="flex-grow space-y-3">
                  <h3 className="text-xl font-bold text-white">{challenge.title}</h3>
                  <p className="text-gray-300 text-base">{challenge.description}</p>
                </div>

                <Button
                  className={`w-full rounded-xl h-12 text-base font-semibold transition-all duration-300 ${
                    challenge.completed 
                      ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' 
                      : 'bg-duo-purple hover:bg-duo-purple/90 text-white'
                  }`}
                  onClick={() => completeChallenge(challenge.id)}
                  disabled={challenge.completed}
                >
                  {challenge.completed ? (
                    <div className="flex items-center justify-center gap-2">
                      <Check className="w-5 h-5" />
                      Completed
                    </div>
                  ) : (
                    'Complete Challenge'
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CopingChallenges;