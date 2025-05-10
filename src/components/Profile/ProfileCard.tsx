import { Card } from "@/components/ui/card";
import { Mail, Calendar, User2 } from 'lucide-react';

interface ProfileCardProps {
  user: {
    name: string;
    joinDate: string;
    avatarUrl: string;
    bio: string;
    email: string;
    dateOfBirth: string;
    gender: string;
  };
}

const ProfileCard = ({ user }: ProfileCardProps) => {
  return (
    <div className="relative p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 transition-all duration-300 hover:border-primary/50">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            {user.name}
          </h2>
          <p className="text-sm text-gray-400">Joined {user.joinDate}</p>
        </div>

        <div className="w-full space-y-4">
          <div className="flex items-center gap-3 text-gray-300">
            <Mail className="w-4 h-4" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <Calendar className="w-4 h-4" />
            <span>{user.dateOfBirth || 'Not set'}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <User2 className="w-4 h-4" />
            <span>{user.gender || 'Not set'}</span>
          </div>
        </div>

        <div className="w-full">
          <p className="text-sm text-gray-400">{user.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
