import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Pause, 
  FastForward, 
  Rewind,
  Save
} from 'lucide-react';

interface AudioPlayerProps {
  audioURL: string | null;
  isPlaying: boolean;
  togglePlayback: () => void;
  seekAudio: (seconds: number) => void;
  onSave: () => Promise<void>;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const AudioPlayer = ({
  audioURL,
  isPlaying,
  togglePlayback,
  seekAudio,
  onSave,
  audioRef
}: AudioPlayerProps) => {
  if (!audioURL) return null;

  return (
    <div className="w-full space-y-4">
      <audio ref={audioRef} src={audioURL} className="w-full" />
      <div className="flex items-center justify-center space-x-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => seekAudio(-10)}
          className="hover-card"
        >
          <Rewind className="w-4 h-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={togglePlayback}
          className="hover-card"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => seekAudio(10)}
          className="hover-card"
        >
          <FastForward className="w-4 h-4" />
        </Button>
        <Button 
          variant="default"
          onClick={onSave}
          className="button-gradient"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Recording
        </Button>
      </div>
    </div>
  );
};

export default AudioPlayer;