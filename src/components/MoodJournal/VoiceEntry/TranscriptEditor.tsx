import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save } from 'lucide-react';

interface TranscriptEditorProps {
  transcript: string;
  setTranscript: (value: string) => void;
  onSave: () => void;
  currentEmotion: string | null;
}

const TranscriptEditor = ({
  transcript,
  setTranscript,
  onSave,
  currentEmotion
}: TranscriptEditorProps) => {
  if (!transcript) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Transcript</h3>
      <Textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        className="min-h-[150px]"
        placeholder="Your transcribed text will appear here..."
      />
      <Button 
        className="bg-duo-green hover:bg-duo-green/90"
        onClick={onSave}
      >
        <Save className="w-4 h-4 mr-2" />
        Save Entry
      </Button>

      {currentEmotion && (
        <div className="bg-duo-purple/10 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Reflection Prompt</h3>
          <p className="text-muted-foreground">
            {currentEmotion === 'happy' && "What made you feel particularly joyful today?"}
            {currentEmotion === 'calm' && "What helped you maintain this sense of peace?"}
            {currentEmotion === 'reflective' && "What insights have you gained from this reflection?"}
            {currentEmotion === 'energetic' && "What's inspiring your enthusiasm today?"}
          </p>
        </div>
      )}
    </div>
  );
};

export default TranscriptEditor;