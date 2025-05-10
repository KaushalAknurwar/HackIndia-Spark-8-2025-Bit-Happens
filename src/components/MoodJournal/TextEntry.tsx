import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, BarChart2 } from 'lucide-react';
import { useJournal } from '@/contexts/JournalContext';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

interface TextEntryProps {
  textEntry: string;
  setTextEntry: (text: string) => void;
  handleSaveEntry: () => void;
}

interface SentimentAnalysis {
  mood: string;
  emotions: Array<{
    label: string;
    score: number;
  }>;
}

const TextEntry = ({ textEntry, setTextEntry, handleSaveEntry }: TextEntryProps) => {
  const { addEntry } = useJournal();
  const { toast } = useToast();
  const [isFlipped, setIsFlipped] = useState(false);
  const [analysis, setAnalysis] = useState<SentimentAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeSentiment = async () => {
    if (!textEntry.trim()) {
      toast({
        title: "No text to analyze",
        description: "Please write something first.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('http://localhost:3001/api/sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textEntry }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze sentiment');
      }

      const data = await response.json();
      setAnalysis(data);
      setIsFlipped(true);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      toast({
        title: "Analysis failed",
        description: "Could not analyze your text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (!textEntry.trim()) return;
    
    addEntry({
      type: 'text',
      content: textEntry,
      mood: analysis?.mood || '😌',
      title: 'Journal Entry',
      privacy: 'private'
    });
    
    setTextEntry('');
    handleSaveEntry();
    setIsFlipped(false);
    setAnalysis(null);
  };

  return (
    <div className="relative w-full h-[400px] perspective-1000">
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Front of card */}
        <div className={`absolute w-full h-full backface-hidden ${isFlipped ? 'hidden' : 'block'}`}>
          <div className="space-y-4">
            <Textarea
              placeholder="How are you feeling today?"
              className="min-h-[200px] text-lg bg-zinc-900/90 text-white placeholder:text-gray-400 border-zinc-800"
              value={textEntry}
              onChange={(e) => setTextEntry(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button 
                onClick={analyzeSentiment}
                disabled={isAnalyzing}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <BarChart2 className="w-4 h-4 mr-2" />
                {isAnalyzing ? 'Analyzing...' : 'Show Analysis'}
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-duo-green hover:bg-duo-green/90"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Entry
              </Button>
            </div>
          </div>
        </div>

        {/* Back of card - Analysis */}
        <div className={`absolute w-full h-full backface-hidden rotate-y-180 ${isFlipped ? 'block' : 'hidden'}`}>
          <div className="bg-zinc-900/90 rounded-lg p-6 h-full">
            <h3 className="text-xl font-semibold text-white mb-4">Sentiment Analysis</h3>
            
            {analysis && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{analysis.mood}</span>
                  <span className="text-white/80">Primary Emotion</span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-white/80">Emotion Breakdown:</h4>
                  {analysis.emotions.map((emotion, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-full bg-zinc-800 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${emotion.score * 100}%` }}
                        />
                      </div>
                      <span className="text-white/60 text-sm min-w-[100px]">
                        {emotion.label}
                      </span>
                      <span className="text-white/40 text-sm">
                        {(emotion.score * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => setIsFlipped(false)}
                  className="w-full mt-4 bg-zinc-800 hover:bg-zinc-700"
                >
                  Back to Entry
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TextEntry;