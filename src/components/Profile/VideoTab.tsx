import React, { useState } from 'react';
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
  Share2, 
  Trash2,
  Search,
  Calendar,
} from 'lucide-react';
import { useJournal } from '@/contexts/JournalContext';

const VideoTab = () => {
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const { toast } = useToast();
  const { entries, deleteEntry } = useJournal();

  const videoEntries = entries.filter(entry => entry.type === 'video');

  const handleShare = (id: string) => {
    toast({
      title: "Sharing video",
      description: "Your video recording has been shared successfully!",
    });
  };

  const handleDelete = (id: string) => {
    deleteEntry(id);
    setSelectedEntry(null);
    toast({
      title: "Video deleted",
      description: "Your video recording has been removed.",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search video recordings..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          Filter by Date
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videoEntries.map((entry) => (
          <Card 
            key={entry.id}
            className="group hover:shadow-lg transition-shadow duration-300"
            onClick={() => setSelectedEntry(entry.id)}
          >
            <CardContent className="p-4">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <video
                  src={entry.content}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="mt-2">
                <h3 className="font-medium">{entry.title || 'Video Recording'}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(entry.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-2 flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(entry.id);
                  }}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(entry.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {entries.find(e => e.id === selectedEntry)?.title || 'Video Recording'}
            </DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-4">
              <video
                src={entries.find(e => e.id === selectedEntry)?.content}
                controls
                className="w-full rounded-lg"
              />
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

export default VideoTab;