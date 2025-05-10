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
  Share2, 
  Trash2,
  Search,
  Calendar
} from 'lucide-react';
import { useJournal } from '@/contexts/JournalContext';

const DrawingsTab = () => {
  const [selectedDrawing, setSelectedDrawing] = useState<string | null>(null);
  const { toast } = useToast();
  const { entries, deleteEntry } = useJournal();

  const drawingEntries = entries.filter(entry => entry.type === 'drawing');

  const handleShare = (id: string) => {
    toast({
      title: "Sharing drawing",
      description: "Your drawing has been shared successfully!",
    });
  };

  const handleDelete = (id: string) => {
    deleteEntry(id);
    setSelectedDrawing(null);
    toast({
      title: "Drawing deleted",
      description: "Your drawing has been removed.",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search drawings..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          Filter by Date
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {drawingEntries.map((entry) => (
          <Card 
            key={entry.id}
            className="group hover:shadow-lg transition-shadow duration-300"
            onClick={() => setSelectedDrawing(entry.id)}
          >
            <CardContent className="p-4">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <img
                  src={entry.content}
                  alt={entry.title || 'Drawing'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(entry.id);
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(entry.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <h3 className="mt-2 font-medium">{entry.title || 'Untitled Drawing'}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(entry.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedDrawing} onOpenChange={() => setSelectedDrawing(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {entries.find(e => e.id === selectedDrawing)?.title || 'Drawing'}
            </DialogTitle>
          </DialogHeader>
          {selectedDrawing && (
            <div className="space-y-4">
              <img
                src={entries.find(e => e.id === selectedDrawing)?.content}
                alt="Drawing"
                className="w-full rounded-lg"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleShare(selectedDrawing)}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(selectedDrawing)}
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

export default DrawingsTab;