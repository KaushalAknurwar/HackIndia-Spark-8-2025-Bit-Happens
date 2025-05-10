import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BackNavigation from '../BackNavigation';
import MazeCell from './MazeCell';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import GameHeader from './GameHeader';
import { 
  MAZE_SIZE, 
  generateMaze, 
  generateCollectibles, 
  calculatePoints,
  type Collectible 
} from './gameLogic';
import { GameState, Position, Difficulty, Theme } from './types';

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

const MindfulMaze = () => {
  const [maze, setMaze] = useState<number[][]>([]);
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 0, y: 0 });
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    level: 1,
    difficulty: 'easy',
    theme: 'calm'
  });
  
  const { toast } = useToast();

  const initializeMaze = () => {
    const newMaze = generateMaze(gameState.difficulty);
    setMaze(newMaze);
    setPlayerPosition({ x: 0, y: 0 });
    const newCollectibles = generateCollectibles(newMaze);
    setCollectibles(newCollectibles);
  };

  useEffect(() => {
    initializeMaze();
  }, [gameState.difficulty]);

  const handleMove = (dx: number, dy: number) => {
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    if (
      newX >= 0 && newX < MAZE_SIZE &&
      newY >= 0 && newY < MAZE_SIZE &&
      maze[newY][newX] === 0
    ) {
      setPlayerPosition({ x: newX, y: newY });
      
      // Check for collectibles
      const collectible = collectibles.find(
        c => c.x === newX && c.y === newY && !c.collected
      );
      
      if (collectible) {
        const points = calculatePoints(collectible.type);
        setGameState(prev => ({ ...prev, score: prev.score + points }));
        setCollectibles(prev =>
          prev.map(c =>
            c.x === newX && c.y === newY
              ? { ...c, collected: true }
              : c
          )
        );
        
        toast({
          title: "Item Collected! ✨",
          description: `You earned ${points} points!`,
        });
      }
      
      if (newX === MAZE_SIZE - 1 && newY === MAZE_SIZE - 1) {
        handleWin();
      }
    }
  };

  const handleWin = () => {
    const levelPoints = 50 * gameState.level;
    setGameState(prev => ({
      ...prev,
      score: prev.score + levelPoints,
      level: prev.level + 1
    }));
    toast({
      title: "Level Complete! 🎉",
      description: `You completed level ${gameState.level} and earned ${levelPoints} points!`,
    });
    initializeMaze();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        handleMove(0, -1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        handleMove(0, 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        handleMove(-1, 0);
        break;
      case 'ArrowRight':
        e.preventDefault();
        handleMove(1, 0);
        break;
    }
  };

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setGameState(prev => ({ ...prev, difficulty }));
  };

  const getThemeClasses = () => {
    switch (gameState.theme) {
      case 'calm':
        return 'from-blue-50 to-purple-50';
      case 'joy':
        return 'from-yellow-50 to-orange-50';
      case 'focus':
        return 'from-green-50 to-teal-50';
      default:
        return 'from-blue-50 to-purple-50';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-[#0A0F1C] to-[#1A1F3C] px-4 py-6 sm:p-6 text-white"
      tabIndex={0} 
      onKeyDown={handleKeyDown}
    >
      <BackNavigation />
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto space-y-8"
      >
        <motion.div variants={item}>
          <GameHeader 
            gameState={gameState}
            onDifficultyChange={handleDifficultyChange}
            onNewMaze={initializeMaze}
          />
        </motion.div>

        <motion.div 
          variants={item}
          className="grid place-items-center"
        >
          <div 
            className="grid gap-1 p-6 bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 hover:border-[#8B5CF6]/50 transition-all duration-300"
            style={{ 
              gridTemplateColumns: `repeat(${MAZE_SIZE}, minmax(0, 1fr))` 
            }}
          >
            {maze.map((row, y) =>
              row.map((cell, x) => (
                <MazeCell
                  key={`${x}-${y}`}
                  isPath={cell === 0}
                  isPlayer={x === playerPosition.x && y === playerPosition.y}
                  isEnd={x === MAZE_SIZE - 1 && y === MAZE_SIZE - 1}
                  collectible={collectibles.find(
                    c => c.x === x && c.y === y && !c.collected
                  )}
                />
              ))
            )}
          </div>
          
          <motion.div 
            variants={item}
            className="mt-6 text-center text-sm text-gray-300 bg-white/5 backdrop-blur-lg rounded-full px-4 py-2 border border-white/10"
          >
            Use arrow keys to move through the maze
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MindfulMaze;