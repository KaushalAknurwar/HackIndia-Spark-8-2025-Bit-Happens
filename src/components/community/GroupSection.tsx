import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Shield } from 'lucide-react';

interface GroupSectionProps {
  onPointsEarned: (points: number) => void;
}

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  isJoined: boolean;
}

const sampleGroups: Group[] = [
  {
    id: '1',
    name: "Mindfulness Practitioners",
    description: "A group dedicated to sharing mindfulness techniques and experiences.",
    members: 128,
    category: "Meditation",
    isJoined: false
  },
  {
    id: '2',
    name: "Anxiety Support Circle",
    description: "A safe space to discuss anxiety and share coping strategies.",
    members: 256,
    category: "Support",
    isJoined: false
  }
];

const GroupSection: React.FC<GroupSectionProps> = ({ onPointsEarned }) => {
  const [groups, setGroups] = useState<Group[]>(sampleGroups);

  const handleJoinGroup = (groupId: string) => {
    setGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? { ...group, isJoined: !group.isJoined, members: group.isJoined ? group.members - 1 : group.members + 1 }
          : group
      )
    );
    onPointsEarned(10);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Support Groups</h3>
        <Button className="gap-2">
          <Users className="w-4 h-4" />
          Create Group
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map(group => (
          <Card key={group.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-semibold mb-2">{group.name}</h4>
                <Badge variant="secondary" className="mb-2">
                  {group.category}
                </Badge>
              </div>
              <Button
                variant={group.isJoined ? "outline" : "default"}
                size="sm"
                onClick={() => handleJoinGroup(group.id)}
                className="gap-2"
              >
                {group.isJoined ? (
                  <>
                    <Shield className="w-4 h-4" />
                    Joined
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Join
                  </>
                )}
              </Button>
            </div>

            <p className="text-muted-foreground mb-4">{group.description}</p>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              {group.members} members
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GroupSection;