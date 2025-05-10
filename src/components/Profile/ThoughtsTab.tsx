import React, { useState } from 'react';
import { 
  Card,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Pencil, 
  Share2, 
  Trash2,
  Search,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useJournal } from '@/contexts/JournalContext';

const ThoughtsTab = () => {
  const [selectedThought, setSelectedThought] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { entries, deleteEntry, updateEntry } = useJournal();

  const textEntries = entries.filter(entry => entry.type === 'text');

  const handleEdit = (id: string) => {
    // Implement edit functionality
    updateEntry(id, { content: "Updated content" });
  };

  const handleShare = (id: string) => {
    // Implement share functionality
    console.log('Sharing entry:', id);
  };

  const handleDelete = (id: string) => {
    deleteEntry(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search journal entries..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          Filter by Date
        </Button>
      </div>

      <div className="space-y-4">
        {textEntries.map((entry) => (
          <Card 
            key={entry.id}
            className="hover:shadow-md transition-shadow duration-300"
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{entry.title || 'Journal Entry'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                >
                  {expandedId === entry.id ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              {expandedId === entry.id && (
                <div className="mt-4">
                  <p className="text-sm">{entry.content}</p>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(entry.id)}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(entry.id)}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(entry.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedThought} onOpenChange={() => setSelectedThought(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Journal Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedThought && (
              <div className="space-y-4">
                <p>{entries.find(e => e.id === selectedThought)?.content}</p>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleEdit(selectedThought)}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleShare(selectedThought)}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleDelete(selectedThought);
                      setSelectedThought(null);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ThoughtsTab;
