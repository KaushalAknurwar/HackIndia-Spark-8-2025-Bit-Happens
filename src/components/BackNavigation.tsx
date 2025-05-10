import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackNavigation = () => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-4 mb-6">
        <Button
        variant="outline"
        onClick={() => navigate("/")}
        className="gap-2 bg-white/10 text-white hover:bg-white/20 hover:text-white border-white/20"
        >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
        </Button>
        <Button
        variant="outline"
        onClick={() => navigate("/games")}
        className="gap-2 bg-white/10 text-white hover:bg-white/20 hover:text-white border-white/20"
        >
        <ArrowLeft className="w-4 h-4" />
        Back to Games
        </Button>
    </div>
  );
};

export default BackNavigation;