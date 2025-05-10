import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';

const ProfileHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Simply navigate to home for now
    navigate('/');
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <Button
        variant="ghost"
        onClick={handleLogout}
        className="gap-2 hover:bg-white/10 transition-all duration-300"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </Button>
    </div>
  );
};

export default ProfileHeader;
