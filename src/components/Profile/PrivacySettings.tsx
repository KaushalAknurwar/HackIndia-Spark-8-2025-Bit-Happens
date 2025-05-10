import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, Globe, Activity } from 'lucide-react';

interface PrivacySettingsProps {
  settings: {
    isPublic: boolean;
    shareMoodHistory: boolean;
    showActivityStatus: boolean;
  };
  onSettingChange: (setting: string, value: boolean) => void;
}

const PrivacySettings = ({ settings, onSettingChange }: PrivacySettingsProps) => {
  return (
    <div className="space-y-4 mt-6">
      <h4 className="text-sm font-medium mb-4">Privacy Settings</h4>
      <div className="space-y-4">
        <TooltipProvider>
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                <Label className="text-base">Public Profile</Label>
              </div>
              <p className="text-sm text-muted-foreground">Allow others to view your profile</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Switch
                  checked={settings.isPublic}
                  onCheckedChange={(checked) => onSettingChange('isPublic', checked)}
                  className="data-[state=checked]:bg-primary"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Make your profile visible to others</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-duo-blue" />
                <Label className="text-base">Share Mood History</Label>
              </div>
              <p className="text-sm text-muted-foreground">Share your mood tracking journey</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Switch
                  checked={settings.shareMoodHistory}
                  onCheckedChange={(checked) => onSettingChange('shareMoodHistory', checked)}
                  className="data-[state=checked]:bg-duo-blue"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Allow others to see your mood history</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-duo-green" />
                <Label className="text-base">Activity Status</Label>
              </div>
              <p className="text-sm text-muted-foreground">Show when you're online</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Switch
                  checked={settings.showActivityStatus}
                  onCheckedChange={(checked) => onSettingChange('showActivityStatus', checked)}
                  className="data-[state=checked]:bg-duo-green"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Display your online status to others</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default PrivacySettings;