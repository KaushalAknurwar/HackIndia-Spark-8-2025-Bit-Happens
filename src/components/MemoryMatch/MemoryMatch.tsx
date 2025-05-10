import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import BackNavigation from '../BackNavigation';
import { Card, Difficulty, GameState, GameStats } from './types';
import { Trophy, RefreshCw, ArrowLeft, Volume2, VolumeX } from 'lucide-react';

const GRID_SIZES = {
  easy: 4,
  medium: 6,
  hard: 8,
};

const EMOJIS = [
  '🌻', '🌳', '🦋', '🍎', '🍰', '😊', '❤️', '🌈',
  '🌙', '⭐', '🌺', '🐬', '🦁', '🐘', '🦒', '🐼',
  '🐶', '🐱', '🦊', '🦄', '🐯', '🦁', '🐮', '🐷',
  '🌹', '🌸', '🌼', '🍀', '🌿', '🍁', '🍂', '🎨',
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      duration: 0.8
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const MemoryMatch: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [gameState, setGameState] = useState<GameState>('menu');
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [stats, setStats] = useState<GameStats>({
    attempts: 0,
    matches: 0,
    startTime: null,
    bestTime: null,
  });
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const { toast } = useToast();

  const getRevealTime = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 2000; // 2 seconds
      case 'medium':
        return 4000; // 4 seconds
      case 'hard':
        return 5000; // 5 seconds
      default:
        return 2000;
    }
  };

  const initializeGame = (selectedDifficulty: Difficulty) => {
    const gridSize = GRID_SIZES[selectedDifficulty];
    const pairsCount = (gridSize * gridSize) / 2;
    const selectedEmojis = EMOJIS.slice(0, pairsCount);
    const cardPairs = [...selectedEmojis, ...selectedEmojis];

    const shuffledCards = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: true,
        isMatched: false,
      }));

    setCards(shuffledCards);
    setStats({
      attempts: 0,
      matches: 0,
      startTime: Date.now(),
      bestTime: stats.bestTime,
    });
    setFlippedCards([...shuffledCards.map((_, index) => index)]);

    // Hide all cards after reveal time based on difficulty
    setTimeout(() => {
      setFlippedCards([]);
      setCards(shuffledCards.map(card => ({ ...card, isFlipped: false })));
    }, getRevealTime(selectedDifficulty));
    
    setGameState('playing');
  };

  const handleCardClick = (index: number) => {
    if (
      flippedCards.length === 2 ||
      flippedCards.includes(index) ||
      cards[index].isMatched
    ) {
      return;
    }

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [firstIndex, secondIndex] = newFlippedCards;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.value === secondCard.value) {
        // Match found
        const updatedCards = cards.map((card, idx) =>
          idx === firstIndex || idx === secondIndex
            ? { ...card, isMatched: true }
            : card
        );
        setCards(updatedCards);
        setStats((prev) => ({
          ...prev,
          matches: prev.matches + 1,
          attempts: prev.attempts + 1,
        }));

        if (updatedCards.every((card) => card.isMatched)) {
          handleGameComplete();
        }
      } else {
        // No match
        setStats((prev) => ({
          ...prev,
          attempts: prev.attempts + 1,
        }));
      }

      setTimeout(() => {
        setFlippedCards([]);
      }, 1000);
    }
  };

  const handleGameComplete = () => {
    const endTime = Date.now();
    const timeTaken = endTime - (stats.startTime || endTime);
    const newBestTime =
      !stats.bestTime || timeTaken < stats.bestTime ? timeTaken : stats.bestTime;

    setStats((prev) => ({ ...prev, bestTime: newBestTime }));
    setGameState('completed');

    toast({
      title: 'Congratulations! 🎉',
      description: `You completed the game in ${stats.attempts} moves!`,
    });
  };

  const gridClassName = `
    grid gap-2
    ${
      difficulty === 'easy'
        ? 'grid-cols-4'
        : difficulty === 'medium'
        ? 'grid-cols-6'
        : 'grid-cols-8'
    }
  `;

  const cardSizeClassName = difficulty === 'easy'
    ? 'h-36 w-48'
    : difficulty === 'medium'
    ? 'h-24 w-35'
    : 'h-16 w-23';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-[#0A0F1C] to-[#1A1F3C] px-4 py-6 sm:p-6 text-white"
    >
      <BackNavigation />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto space-y-8"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent">
          Memory Match
          </h1>
          <div className="flex items-center gap-4">
          {gameState !== 'menu' && (
            <>
            <Button
              variant="outline"
              size="icon"
              className="bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white rounded-full"
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            >
              {isSoundEnabled ? <Volume2 /> : <VolumeX />}
            </Button>
            <Button
              variant="outline"
              className="bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white px-6 py-2 rounded-full"
              onClick={() => initializeGame(difficulty)}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Restart
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white px-6 py-2 rounded-full"
              onClick={() => setGameState('menu')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Menu
            </Button>
            </>
          )}
          </div>
        </div>

        {gameState === 'menu' ? (
          <motion.div 
          variants={item}
          className="space-y-8 text-center"
          >
          <h2 className="text-2xl font-semibold text-white">
            Select Difficulty
          </h2>
          <div className="flex flex-col gap-4 max-w-md mx-auto">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
            <Button
              key={level}
              variant="outline"
              className="bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white px-6 py-2 rounded-full w-full text-lg capitalize"
              onClick={() => {
              setDifficulty(level);
              initializeGame(level);
              }}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Button>
            ))}
          </div>
          </motion.div>
        ) : (
          <>
            <motion.div 
              variants={item}
              className="flex justify-between items-center mb-6"
            >
              <div className="space-x-4 bg-white/5 backdrop-blur-lg rounded-full px-6 py-2 border border-white/10">
              <span className="text-white">
                Moves: {stats.attempts}
              </span>
              <span className="text-white">
                Matches: {stats.matches}
              </span>
              </div>
              {stats.bestTime && (
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-lg rounded-full px-6 py-2 border border-white/10">
                <Trophy className="w-5 h-5 text-[#D946EF]" />
                <span className="text-white">
                Best Time: {Math.floor(stats.bestTime / 1000)}s
                </span>
              </div>
              )}
            </motion.div>

            <motion.div 
              variants={item}
              className={`${gridClassName} bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10`}
            >
              {cards.map((card, index) => (
              <motion.div
                key={card.id}
                className={`relative perspective-1000 ${cardSizeClassName}`}
                initial={{ scale: 0 }}
                animate={{
                scale: 1,
                opacity: card.isMatched ? 0 : 1,
                }}
                transition={{
                duration: card.isMatched ? 0.6 : 0.3,
                delay: index * 0.05,
                }}
              >
                <motion.div
                className="relative w-full h-full cursor-pointer"
                style={{
                  transformStyle: 'preserve-3d',
                  transform:
                  flippedCards.includes(index) || card.isMatched
                    ? 'rotateY(180deg)'
                    : 'rotateY(0deg)',
                  transition: 'transform 0.6s',
                }}
                onClick={() => handleCardClick(index)}
                >
                {/* Front (Emoji) */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/20 to-[#D946EF]/20 backdrop-blur-lg rounded-xl flex items-center justify-center text-4xl border border-white/10"
                  style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  }}
                >
                  {card.value}
                </div>
                {/* Back (Question Mark) */}
                <div
                  className="absolute inset-0 bg-white/5 backdrop-blur-lg rounded-xl flex items-center justify-center text-2xl font-bold border border-white/10 text-white"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  ?
                </div>
                </motion.div>
              </motion.div>
              ))}
            </motion.div>
            </>
          )}
          </motion.div>
        </motion.div>
  );
};

export default MemoryMatch;
