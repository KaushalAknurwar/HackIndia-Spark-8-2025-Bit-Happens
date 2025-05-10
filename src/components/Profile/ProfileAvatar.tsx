import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ProfileAvatarProps {
  name: string;
  avatarUrl?: string;
}

const ProfileAvatar = ({ name, avatarUrl }: ProfileAvatarProps) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <Avatar className="w-24 h-24 border-2 border-white/20">
      <AvatarImage src={avatarUrl} alt={name} />
      <AvatarFallback className="text-lg bg-primary/20 text-primary">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfileAvatar;
