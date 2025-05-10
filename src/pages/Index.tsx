import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { Gamepad2, User, Sparkles, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";
import GoalTracker from "@/components/GoalTracker";
import QuizSection from "@/components/QuizSection";
import Satrang from "@/components/Satrang/Satrang";
import CopingChallenges from "@/components/CopingChallenges";
import CommunityHub from "@/components/community/CommunityHub";
import MoodJournal from "@/components/MoodJournal/MoodJournal";
import MoodCalendar from "@/components/MoodCalendar/MoodCalendar";
import AshaChatbot from "@/components/AshaChatbot";
import EmergencyContacts from "@/components/EmergencyContacts/EmergencyContacts";

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

const Index = () => {
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
        <motion.div 
          className="text-center mb-12 animate-fade-in relative"
          variants={item}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/20 to-[#D946EF]/20 blur-3xl -z-10" />
          <motion.h1 
            className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent mb-4"
            variants={item}
          >
            Your Wellness Dashboard 
            
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl text-gray-300 mb-6"
            variants={item}
          >
            Track your journey, embrace growth, and nurture your well-being
          </motion.p>
          <motion.div 
            className="flex justify-center gap-4"
            variants={item}
          >
            <Button 
              variant="outline" 
              className="bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              onClick={() => navigate('/games')}
            >
              <Gamepad2 className="w-5 h-5 mr-2" />
              Games
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              onClick={() => navigate('/sahayak')}
            >
              <HeartHandshake className="w-5 h-5 mr-2" />
              Sahayak
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              onClick={() => navigate('/profile')}
            >
              <User className="w-5 h-5 mr-2" />
              Profile
            </Button>
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Left Column */}
          <motion.div className="space-y-6" variants={item}>
            <motion.div 
              className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10 overflow-hidden group hover:border-[#8B5CF6]/50"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <MoodCalendar />
            </motion.div>
            <motion.div 
              className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10 overflow-hidden group hover:border-[#D946EF]/50"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <MoodJournal />
            </motion.div>
            <motion.div 
              className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10 overflow-hidden group hover:border-[#8B5CF6]/50"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <CommunityHub />
            </motion.div>
          </motion.div>

                {/* Right Column */}
                <motion.div className="space-y-6" variants={item}>
                <motion.div 
                  className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10 overflow-hidden group hover:border-[#D946EF]/50"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                    <Satrang />
                </motion.div>
                <motion.div 
                  className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10 overflow-hidden group hover:border-[#8B5CF6]/50"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <GoalTracker />
                </motion.div>
                <motion.div 
                  className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10 overflow-hidden group hover:border-[#D946EF]/50"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <CopingChallenges />
                </motion.div>
                <motion.div 
                  className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10 overflow-hidden group hover:border-[#8B5CF6]/50"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <QuizSection />
                </motion.div>
                </motion.div>

        </motion.div>
      </motion.div>
        <AshaChatbot />
        <EmergencyContacts />
      </motion.div>
  );
};

export default Index;