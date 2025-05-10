import React from 'react';
import { Trophy, Star, Heart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { GameState, Difficulty } from './types';

interface GameHeaderProps {
  gameState: GameState;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onNewMaze: () => void;
}

const GameHeader = ({ gameState, onDifficultyChange, onNewMaze }: GameHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-primary mb-4">Mindful Maze</h1>
      <p className="text-muted-foreground mb-6">
        Navigate through the maze while practicing mindfulness
      </p>
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-white/20">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="font-semibold text-white">{gameState.score} Points</span>
        </div>
        
        <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-white/20">
          <Star className="w-5 h-5 text-[#8B5CF6]" />
          <span className="font-semibold text-white">Level {gameState.level}</span>
        </div>
        
        <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-white/20">
          <Heart className="w-5 h-5 text-[#D946EF]" />
          <div className="w-24">
          <Progress value={80} className="h-2" />
          </div>
        </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
        <Button 
          variant="outline" 
          onClick={() => onDifficultyChange('easy')}
          className={`bg-white/10 text-white hover:bg-white/20 hover:text-white border-white/20 ${
          gameState.difficulty === 'easy' ? 'bg-[#8B5CF6] hover:bg-[#8B5CF6]/80 border-[#8B5CF6]' : ''
          }`}
        >
          Easy
        </Button>
        <Button 
          variant="outline"
          onClick={() => onDifficultyChange('medium')}
          className={`bg-white/10 text-white hover:bg-white/20 hover:text-white border-white/20 ${
          gameState.difficulty === 'medium' ? 'bg-[#8B5CF6] hover:bg-[#8B5CF6]/80 border-[#8B5CF6]' : ''
          }`}
        >
          Medium
        </Button>
        <Button 
          variant="outline"
          onClick={() => onDifficultyChange('hard')}
          className={`bg-white/10 text-white hover:bg-white/20 hover:text-white border-white/20 ${
          gameState.difficulty === 'hard' ? 'bg-[#8B5CF6] hover:bg-[#8B5CF6]/80 border-[#8B5CF6]' : ''
          }`}
        >
          Hard
        </Button>
        <Button 
          variant="outline" 
          onClick={onNewMaze}
          className="gap-2 bg-white/10 text-white hover:bg-white/20 hover:text-white border-white/20"
        >
          <RefreshCw className="w-4 h-4" />
          New Maze
        </Button>
        </div>
    </div>
  );
};

export default GameHeader;