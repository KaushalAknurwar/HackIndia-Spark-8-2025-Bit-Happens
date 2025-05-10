import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Target, Calendar, Trophy, Tag, Plus } from 'lucide-react';

type Goal = {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  progress: number;
  points: number;
};

const CATEGORIES = ['Mindfulness', 'Stress Management', 'Self-Care', 'Emotional Growth'];

const GoalTracker = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: CATEGORIES[0],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });
  const { toast } = useToast();

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.endDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      ...newGoal,
      progress: 0,
      points: 0,
    };

    setGoals([...goals, goal]);
    setNewGoal({
      title: '',
      description: '',
      category: CATEGORIES[0],
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    });

    toast({
      title: "Goal Added",
      description: "Your new goal has been created!",
    });
  };

  const updateProgress = (goalId: string, newProgress: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const updatedGoal = { ...goal, progress: newProgress };
        if (newProgress === 100 && goal.progress < 100) {
          toast({
            title: "🎉 Goal Completed!",
            description: "Congratulations! You've earned the 'Goal Getter' badge!",
          });
          updatedGoal.points += 50;
        }
        return updatedGoal;
      }
      return goal;
    }));
  };

  return (
    <div className="space-y-6 p-6 bg-black/40 bg-gradient-to-br from-[#8B5CF6]/5 to-[#D946EF]/5 backdrop-blur-md rounded-xl border-white/20">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-white/20 bg-black/20 backdrop-blur-md rounded-t-xl -mt-6 -mx-6">
        <Target className="w-6 h-6 text-[#D946EF]" />
        <div className="flex-1">
          <h2 className="font-semibold text-white">Goal Setting</h2>
          <p className="text-sm text-white/80">Track your progress and earn rewards</p>
        </div>
        <Trophy className="w-5 h-5 text-[#8B5CF6]" />
      </div>

      {/* Add New Goal Form */}
      <Card className="p-6 bg-black/40 backdrop-blur-md border-white/20">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Title</label>
            <Input
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              placeholder="Enter your goal"
              className="bg-black/20 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Description</label>
            <Input
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              placeholder="Describe your goal"
              className="bg-black/20 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Category</label>
            <select
              className="w-full rounded-md border border-white/20 bg-black/20 px-3 py-2 text-white"
              value={newGoal.category}
              onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Start Date</label>
              <Input
                type="date"
                value={newGoal.startDate}
                onChange={(e) => setNewGoal({ ...newGoal, startDate: e.target.value })}
                className="bg-black/20 border-white/20 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">End Date</label>
              <Input
                type="date"
                value={newGoal.endDate}
                onChange={(e) => setNewGoal({ ...newGoal, endDate: e.target.value })}
                className="bg-black/20 border-white/20 text-white"
              />
            </div>
          </div>
          
          <Button 
            className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white font-medium hover:opacity-90 transition-opacity shadow-lg"
            onClick={handleAddGoal}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
        </div>
      </Card>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map(goal => (
          <Card key={goal.id} className="p-6 bg-black/40 backdrop-blur-md border-white/20 hover:border-[#8B5CF6]/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{goal.title}</h3>
                <p className="text-sm text-white/60">{goal.description}</p>
              </div>
              <Badge variant="secondary" className="bg-black/40 text-white border-white/20 flex items-center gap-1">
                <Tag className="w-4 h-4" />
                {goal.category}
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-white/60 mb-1">
                  <span>Progress</span>
                  <span>{goal.progress}%</span>
                </div>
                <Progress 
                  value={goal.progress} 
                  className="h-2 bg-white/10"
                  indicatorClassName="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF]"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-white/60" />
                  <span className="text-sm text-white/60">
                    {new Date(goal.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#8B5CF6]" />
                  <span className="font-semibold text-white">{goal.points} pts</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                {[25, 50, 75, 100].map(progress => (
                  <Button
                    key={progress}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                    onClick={() => updateProgress(goal.id, progress)}
                  >
                    {progress}%
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default GoalTracker;