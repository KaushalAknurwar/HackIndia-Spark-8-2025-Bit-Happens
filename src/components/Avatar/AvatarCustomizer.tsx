import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Star, Trophy } from 'lucide-react';

interface AvatarStats {
  health: number;
  experience: number;
  level: number;
}

const AvatarCustomizer = () => {
  const [stats, setStats] = useState<AvatarStats>({
    health: 80,
    experience: 60,
    level: 1,
  });

  return (
    <div className="mt-6 space-y-6">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart className="text-red-500" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Health</p>
              <Progress value={stats.health} className="w-[200px]" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-500" />
            <span className="font-bold">Level {stats.level}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Star className="text-primary" />
          <div className="space-y-1 flex-1">
            <p className="text-sm font-medium">Experience</p>
            <Progress value={stats.experience} className="w-full" />
          </div>
        </div>
      </Card>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="accessories">Accessories</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        <TabsContent value="appearance" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-24 hover:bg-secondary/50">
              Style 1
            </Button>
            <Button variant="outline" className="h-24 hover:bg-secondary/50">
              Style 2
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="accessories" className="mt-4">
          <div className="text-center text-muted-foreground">
            Complete more challenges to unlock accessories!
          </div>
        </TabsContent>
        <TabsContent value="achievements" className="mt-4">
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Trophy className="text-yellow-500" />
                <div>
                  <h4 className="font-semibold">Wellness Warrior</h4>
                  <p className="text-sm text-muted-foreground">Complete 5 daily mood check-ins</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AvatarCustomizer;