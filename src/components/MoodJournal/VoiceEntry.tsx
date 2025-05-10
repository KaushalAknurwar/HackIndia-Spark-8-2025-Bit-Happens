import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  Mic, 
  Square, 
  Play, 
  Pause,
  Save,
  FastForward,
  Rewind,
  Trash2
} from 'lucide-react';

const VoiceEntry = () => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setTranscript(transcript);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
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
        analyzeEmotion();
      };

      mediaRecorderRef.current.start();
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      setIsRecording(true);

      // Start duration timer
      const startTime = Date.now();
      const durationInterval = setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      // Store interval ID for cleanup
      return () => clearInterval(durationInterval);
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
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      setRecordingDuration(0);

      // Show completion toast
      toast({
        title: "Recording Complete! 🎤",
        description: "Your voice entry has been saved successfully.",
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

  const analyzeEmotion = () => {
    // Simulate emotion analysis
    const emotions = ['happy', 'calm', 'reflective', 'energetic'];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    setCurrentEmotion(randomEmotion);

    // Show emotion feedback
    toast({
      title: "Emotion Detected! 🎭",
      description: `You seem to be feeling ${randomEmotion} today!`,
    });
  };

  const deleteRecording = () => {
    setAudioURL(null);
    setTranscript('');
    setCurrentEmotion(null);
    if (audioElementRef.current) {
      audioElementRef.current.src = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col items-center space-y-4">
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
              <span className="text-red-500 animate-pulse">
                Recording: {recordingDuration}s
              </span>
            )}
          </div>

          {audioURL && (
            <div className="w-full space-y-4">
              <audio ref={audioElementRef} src={audioURL} className="w-full" />
              <div className="flex items-center justify-center space-x-4">
                <Button onClick={() => seekAudio(-10)}>
                  <Rewind className="w-4 h-4" />
                </Button>
                <Button onClick={togglePlayback}>
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
                <Button onClick={() => seekAudio(10)}>
                  <FastForward className="w-4 h-4" />
                </Button>
                <Button variant="destructive" onClick={deleteRecording}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {transcript && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Transcript</h3>
          <Textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="min-h-[150px]"
            placeholder="Your transcribed text will appear here..."
          />
          <Button className="bg-duo-green hover:bg-duo-green/90">
            <Save className="w-4 h-4 mr-2" />
            Save Entry
          </Button>
        </div>
      )}

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

      <div className="bg-muted/20 p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Quick Tips 💡</h3>
        <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
          <li>Speak clearly and at a natural pace</li>
          <li>Find a quiet space for better recording quality</li>
          <li>Take breaks between thoughts</li>
          <li>Review and edit your transcript if needed</li>
        </ul>
      </div>
    </div>
  );

};

export default VoiceEntry;
