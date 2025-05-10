import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from 'lucide-react';

interface RecordingControlsProps {
  isRecording: boolean;
  recordingDuration: number;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
}

const RecordingControls = ({
  isRecording,
  recordingDuration,
  startRecording,
  stopRecording
}: RecordingControlsProps) => {
  return (
    <div className="flex items-center space-x-4">
      <Button
        onClick={isRecording ? stopRecording : startRecording}
        className={isRecording ? "bg-red-500 hover:bg-red-600" : "bg-duo-blue hover:bg-duo-blue/90"}
      >
        {isRecording ? (
          <>
            <Square className="w-4 h-4 mr-2" />
            Stop Recording
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 mr-2" />
            Start Recording
          </>
        )}
      </Button>
      {isRecording && (
        <span className="text-red-500 animate-pulse flex items-center">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Recording: {recordingDuration}s
        </span>
      )}
    </div>
  );
};

export default RecordingControls;