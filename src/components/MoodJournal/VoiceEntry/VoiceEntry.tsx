import React, { useState, useRef, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import RecordingControls from './RecordingControls';
import AudioPlayer from './AudioPlayer';

const VoiceEntry = () => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const durationIntervalRef = useRef<number>();

  useEffect(() => {
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      const startTime = Date.now();
      durationIntervalRef.current = window.setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone. Please check your permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingDuration(0);
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }

      toast({
        title: "Recording Complete! 🎤",
        description: "Your recording has been saved. Click 'Save Recording' to store it.",
      });
    }
  };

  const togglePlayback = () => {
    if (audioElementRef.current) {
      if (isPlaying) {
        audioElementRef.current.pause();
      } else {
        audioElementRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const seekAudio = (seconds: number) => {
    if (audioElementRef.current) {
      audioElementRef.current.currentTime += seconds;
    }
  };

  const handleSave = async () => {
    if (!audioURL) return;

    try {
      const response = await fetch(audioURL);
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        
        const { error } = await supabase
          .from('entries')
          .insert({
            type: 'voice',
            content: base64Audio.split(',')[1],
            title: `Voice Recording - ${new Date().toLocaleString()}`,
            mood: 'neutral'
          });

        if (error) throw error;

        toast({
          title: "Voice Entry Saved! 🎉",
          description: "Your recording has been added to your journal.",
        });

        // Reset the form
        setAudioURL(null);
        if (audioElementRef.current) {
          audioElementRef.current.src = '';
        }
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error saving recording:', error);
      toast({
        title: "Error Saving Recording",
        description: "Failed to save your recording. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-morphism p-6 rounded-lg">
        <div className="flex flex-col items-center space-y-4">
          <RecordingControls
            isRecording={isRecording}
            recordingDuration={recordingDuration}
            startRecording={startRecording}
            stopRecording={stopRecording}
          />

          <AudioPlayer
            audioURL={audioURL}
            isPlaying={isPlaying}
            togglePlayback={togglePlayback}
            seekAudio={seekAudio}
            onSave={handleSave}
            audioRef={audioElementRef}
          />
        </div>
      </div>

      <div className="glass-morphism p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-2 gradient-text">Quick Tips 💡</h3>
        <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
          <li>Speak clearly and at a natural pace</li>
          <li>Find a quiet space for better recording quality</li>
          <li>Take breaks between thoughts</li>
          <li>Preview your recording before saving</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceEntry;