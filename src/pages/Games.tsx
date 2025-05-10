import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Gamepad2, Puzzle, Heart, Flower2, ArrowLeft, Dumbbell, Brain } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PunchingBag = lazy(() => import('@/components/PunchingBag/PunchingBag'));
const MindfulMaze = lazy(() => import('@/components/MindfulMaze/MindfulMaze'));
const MemoryMatch = lazy(() => import('@/components/MemoryMatch/MemoryMatch'));

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

const games = [
  {
    id: 'mindful-maze',
    name: 'Mindful Maze',
    description: 'Navigate through a maze while practicing mindfulness',
    icon: Puzzle,
    route: '/games/mindful-maze'
  },
  {
    id: 'memory-match',
    name: 'Memory Match',
    description: 'Match pairs of calming images and quotes',
    icon: Gamepad2,
    route: '/games/memory-match'
  },
  {
    id: 'breathing',
    name: 'Mindful Breathing',
    description: 'Practice guided breathing exercises',
    icon: Heart,
    route: '/games/breathing'
  },
  {
    id: 'emoji-garden',
    name: 'Emoji Garden',
    description: 'Express emotions through a beautiful emoji garden',
    icon: Flower2,
    route: '/games/emoji-garden'
  },
  {
    id: 'punching-bag',
    name: 'Stress Relief Bag',
    description: 'Release stress by punching a virtual bag',
    icon: Dumbbell,
    route: '/games/punching-bag'
  },
  {
    id: 'mental-health-quiz',
    name: 'Mental Health Quiz',
    description: 'Test your mental health knowledge with AI-generated questions',
    icon: Brain,
    route: '/games/mental-health-quiz'
  }
];

const Games = () => {
  const navigate = useNavigate();

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
        {/* Header Section */}
        <motion.div variants={item}>
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </motion.div>

        <motion.div 
          className="text-center mb-12 animate-fade-in relative"
          variants={item}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/20 to-[#D946EF]/20 blur-3xl -z-10" />
          <motion.h1 
            className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent mb-4"
            variants={item}
          >
            Mindfulness Games
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl text-gray-300 mb-6"
            variants={item}
          >
            Explore interactive games designed to enhance your mental well-being
          </motion.p>
        </motion.div>

        {/* Games Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          variants={container}
        >
          {games.map((game) => (
            <motion.div
              key={game.id}
              variants={item}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => navigate(game.route)}
              className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10 overflow-hidden group hover:border-[#8B5CF6]/50 cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-[#8B5CF6]/20 to-[#D946EF]/20">
                    <game.icon className="w-8 h-8 text-[#D946EF]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
                    <p className="text-gray-300">{game.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Games;