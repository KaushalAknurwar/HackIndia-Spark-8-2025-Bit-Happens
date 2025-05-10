import React, { useState, useEffect } from 'react';
import { 
  Card,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Play,
  Pause,
  Share2, 
  Trash2,
  Search,
  Calendar,
} from 'lucide-react';
import { useJournal } from '@/contexts/JournalContext';
import { supabase } from "@/integrations/supabase/client";

const VoiceTab = () => {
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceEntries, setVoiceEntries] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchVoiceEntries();
  }, []);

  const fetchVoiceEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('type', 'voice')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVoiceEntries(data || []);
    } catch (error) {
      console.error('Error fetching voice entries:', error);
      toast({
        title: "Error loading recordings",
        description: "Failed to load your voice recordings.",
        variant: "destructive"
      });
    }
  };

  const handlePlay = (audioContent: string) => {
    const audio = new Audio(`data:audio/wav;base64,${audioContent}`);
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleShare = (id: string) => {
    toast({
      title: "Sharing recording",
      description: "Your voice recording has been shared successfully!",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setVoiceEntries(prev => prev.filter(entry => entry.id !== id));
      setSelectedEntry(null);
      toast({
        title: "Recording deleted",
        description: "Your voice recording has been removed.",
      });
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast({
        title: "Error",
        description: "Failed to delete the recording.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search voice recordings..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          Filter by Date
        </Button>
      </div>

      <div className="space-y-4">
        {voiceEntries.map((entry) => (
          <Card 
            key={entry.id}
            className="hover:shadow-md transition-shadow duration-300"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{entry.title || 'Voice Recording'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(entry.created_at).toLocaleDateString()} at{' '}
                    {new Date(entry.created_at).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePlay(entry.content)}
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
                    onClick={() => handleShare(entry.id)}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(entry.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 h-12 bg-muted rounded-lg overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-primary/20 to-primary/40" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {voiceEntries.find(e => e.id === selectedEntry)?.title || 'Voice Recording'}
            </DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePlay(voiceEntries.find(e => e.id === selectedEntry)?.content)}
                  className="mx-auto block"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </Button>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleShare(selectedEntry)}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(selectedEntry)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VoiceTab;