import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import VideoRecorder from './VideoRecorder';
import EmotionTagger from './EmotionTagger';
import { Save, Lock, Globe } from 'lucide-react';

const VideoEntry = () => {
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [reflection, setReflection] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const { toast } = useToast();

  const handleSaveVideo = (blob: Blob) => {
    setVideoBlob(blob);
  };

  const handleEmotionToggle = (emotionId: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotionId)
        ? prev.filter(id => id !== emotionId)
        : [...prev, emotionId]
    );
  };

  const handleSaveEntry = () => {
    // Here you would typically upload the video and save the entry
    toast({
      title: "Entry Saved! 🎥",
      description: "Your video journal entry has been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <VideoRecorder onSaveVideo={handleSaveVideo} />

      {videoBlob && (
        <>
          <EmotionTagger
            selectedEmotions={selectedEmotions}
            onEmotionToggle={handleEmotionToggle}
          />

          <Card className="p-4 space-y-4">
            <h3 className="text-lg font-semibold">Reflect on your entry</h3>
            <Textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What thoughts or insights would you like to add to this entry?"
              className="min-h-[100px]"
            />
          </Card>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setIsPrivate(!isPrivate)}
              className="flex items-center space-x-2"
            >
              {isPrivate ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Private</span>
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4" />
                  <span>Public</span>
                </>
              )}
            </Button>

            <Button onClick={handleSaveEntry} className="bg-duo-green hover:bg-duo-green/90">
              <Save className="w-4 h-4 mr-2" />
              Save Entry
            </Button>
          </div>
        </>
      )}

      <div className="bg-muted/20 p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Tips for Video Journaling 💡</h3>
        <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
          <li>Find a quiet, well-lit space</li>
          <li>Speak naturally and authentically</li>
          <li>Take your time to gather your thoughts</li>
          <li>Focus on one topic or feeling at a time</li>
        </ul>
      </div>
    </div>
  );
};

export default VideoEntry;