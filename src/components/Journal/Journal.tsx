import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useJournal } from '@/contexts/JournalContext';
import { format } from 'date-fns';
import { BarChart2, BookOpen } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SentimentResponse {
  label: string;
  score: number;
}

const Journal = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { entries, addEntry, deleteEntry, updateEntry } = useJournal();
  const [newEntry, setNewEntry] = useState('');
  const [sentiment, setSentiment] = useState<SentimentResponse | null>(null);
  const { toast } = useToast();

  const analyzeSentiment = async (text: string): Promise<SentimentResponse> => {
    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze sentiment');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      toast({
        title: "Error",
        description: "Failed to analyze sentiment. Please try again.",
        variant: "destructive",
      });
      return { label: 'neutral', score: 0 };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.trim()) return;

    try {
      const sentimentResult = await analyzeSentiment(newEntry);
      addEntry({
        type: 'text',
        content: newEntry,
        mood: sentimentResult.label,
        title: 'Journal Entry',
        privacy: 'private'
      });
      setNewEntry('');
      toast({
        title: "Entry Added",
        description: "Your journal entry has been saved.",
      });
    } catch (error) {
      console.error('Error adding entry:', error);
      toast({
        title: "Error",
        description: "Failed to add entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[600px]">
      <motion.div
        className="backdrop-blur-md bg-black/40 rounded-xl p-8 border border-white/20 hover:border-[#8B5CF6]/50 transition-all duration-300 w-full h-full"
        style={{ perspective: '1000px' }}
      >
        <motion.div
          className="relative w-full h-full"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front of card - Journal Entries */}
          <motion.div
            className="absolute w-full h-full"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="space-y-6 w-full h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-[#D946EF]" />
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent">
                    Journal
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="hover:bg-black/30 text-white transition-all duration-300"
                >
                  <BarChart2 className="h-5 w-5 mr-2" />
                  Show Analysis
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                  value={newEntry}
                  onChange={(e) => setNewEntry(e.target.value)}
                  placeholder="How are you feeling today?"
                  className="w-full h-32 p-4 rounded-lg bg-black/20 text-white placeholder-white/50 border border-white/20 focus:border-[#8B5CF6] focus:outline-none transition-all duration-300"
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white hover:opacity-90 transition-all duration-300"
                >
                  Add Entry
                </Button>
              </form>

              <div className="space-y-4 mt-8">
                {entries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="backdrop-blur-md bg-black/20 rounded-lg p-4 border border-white/20 hover:border-[#8B5CF6]/50 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-white/80 text-sm">
                        {format(new Date(entry.created_at), 'PPP')}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateEntry(entry.id, { ...entry, content: entry.content })}
                          className="text-white hover:bg-black/30 transition-all duration-300"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteEntry(entry.id)}
                          className="text-red-400 hover:bg-red-400/10 transition-all duration-300"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <p className="text-white">{entry.content}</p>
                    {entry.mood && (
                      <div className="mt-2 text-sm text-white/60">
                        Sentiment: {entry.mood}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Back of card - Sentiment Analysis */}
          <motion.div
            className="absolute w-full h-full"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="space-y-6 w-full h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <BarChart2 className="w-8 h-8 text-[#D946EF]" />
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent">
                    Sentiment Analysis
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="hover:bg-black/30 text-white transition-all duration-300"
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Show Journal
                </Button>
              </div>

              <div className="space-y-6">
                {entries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="backdrop-blur-md bg-black/20 rounded-lg p-4 border border-white/20 hover:border-[#8B5CF6]/50 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-white/80 text-sm">
                        {format(new Date(entry.created_at), 'PPP')}
                      </p>
                    </div>
                    <p className="text-white mb-2">{entry.content}</p>
                    {entry.mood && (
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-white/60">Sentiment:</div>
                        <div className={`px-2 py-1 rounded-full text-sm ${
                          entry.mood === 'positive' ? 'bg-green-500/20 text-green-400' :
                          entry.mood === 'negative' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {entry.mood}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Journal; 