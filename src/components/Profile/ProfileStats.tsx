import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProfileStatsProps {
  stats: {
    totalEntries: number;
    moodScore: number;
    streakDays: number;
  };
}

const ProfileStats = ({ stats }: ProfileStatsProps) => {
  const streakCount = stats.streakDays;

  return (
    <Card className="col-span-1 lg:col-span-2 p-8 bg-white/10 backdrop-blur-lg border-white/20 hover:border-primary/50 transition-all duration-300">
      <div className="grid grid-cols-3 gap-6">
        <div className="text-center p-4 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
          <h3 className="text-3xl font-bold text-primary">{stats.totalEntries}</h3>
          <p className="text-sm text-gray-400">Total Entries</p>
        </div>

        <div className="text-center p-4 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
          <h3 className="text-3xl font-bold text-duo-green">{stats.moodScore}%</h3>
          <p className="text-sm text-gray-400">Mood Score</p>
        </div>

        <div className="text-center p-4 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
          <h3 className="text-3xl font-bold text-duo-orange">{streakCount}</h3>
          <p className="text-sm text-gray-400">Day Streak</p>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-sm font-medium mb-2">Journey Progress</h4>
        <Progress value={65} className="h-2 bg-white/10" />
      </div>
    </Card>
  );
};

export default ProfileStats;
