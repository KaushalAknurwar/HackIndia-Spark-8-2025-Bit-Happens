import React from 'react';
import { Card } from "@/components/ui/card";
import { Trophy, Calendar } from 'lucide-react';

const JournalHeader = () => {
  return (
    <>
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">
          Your Mood Journal 📖
        </h2>
        <p className="text-white/80 text-lg">
          Express yourself and earn rewards! 🌟
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4 bg-black/40 hover:bg-black/50 bg-gradient-to-br from-[#8B5CF6]/5 to-[#D946EF]/5 backdrop-blur-md border-white/20 transition-all duration-300 cursor-pointer">
          <div className="flex flex-col items-center space-y-2">
            <Trophy className="w-8 h-8 text-[#8B5CF6]" />
            <span className="text-lg font-semibold text-white">150 Points</span>
            <span className="text-sm text-white/70">Total Score</span>
          </div>
        </Card>

        <Card className="p-4 bg-black/40 hover:bg-black/50 bg-gradient-to-br from-[#8B5CF6]/5 to-[#D946EF]/5 backdrop-blur-md border-white/20 transition-all duration-300 cursor-pointer">
          <div className="flex flex-col items-center space-y-2">
            <Calendar className="w-8 h-8 text-[#D946EF]" />
            <span className="text-lg font-semibold text-white">7 Days</span>
            <span className="text-sm text-white/70">Current Streak</span>
          </div>
        </Card>

        <Card className="p-4 bg-black/40 hover:bg-black/50 bg-gradient-to-br from-[#8B5CF6]/5 to-[#D946EF]/5 backdrop-blur-md border-white/20 transition-all duration-300 cursor-pointer md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-white">Today's Prompt</h3>
              <p className="text-lg text-white/80">
                What made you smile today? 😊
              </p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default JournalHeader;