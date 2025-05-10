import React, { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Pencil, 
  Eraser, 
  Save, 
  Trash2,
} from 'lucide-react';
import { useJournal } from '@/contexts/JournalContext';
import { useToast } from "@/components/ui/use-toast";

interface ArtEntryProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  color: string;
  setColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  tool: 'brush' | 'eraser';
  setTool: (tool: 'brush' | 'eraser') => void;
  clearCanvas: () => void;
  handleSaveArtwork: () => void;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  privacy: 'public' | 'private';
  setPrivacy: (privacy: 'public' | 'private') => void;
  startDrawing: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  draw: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  stopDrawing: () => void;
}

const ArtEntry = ({ 
  canvasRef, color, setColor, brushSize, setBrushSize, tool, setTool,
  clearCanvas, handleSaveArtwork, title, setTitle, description, setDescription,
  privacy, setPrivacy, startDrawing, draw, stopDrawing
}: ArtEntryProps) => {
  const { toast } = useToast();
  const { addEntry } = useJournal();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please give your artwork a title before saving.",
        variant: "destructive"
      });
      return;
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const artworkData = canvas.toDataURL('image/png');
      try {
        await addEntry({
          type: 'drawing',
          content: artworkData,
          title: title,
          description: description,
          privacy: privacy,
          mood: 'creative'
        });

        toast({
          title: "Artwork saved! 🎨",
          description: "Your masterpiece has been added to your drawings collection.",
        });

        handleSaveArtwork();
      } catch (error) {
        toast({
          title: "Failed to save artwork",
          description: "Please try again later.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto p-4">
      <div className="sticky top-0 z-10 backdrop-blur-md bg-background/30 border rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-4">
            <Input 
              type="color" 
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-12 p-1 rounded-lg cursor-pointer bg-transparent"
            />
            <Input 
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-32 bg-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="ghost"
              onClick={() => setTool('brush')}
              className={`gap-2 backdrop-blur-sm ${tool === 'brush' ? 'bg-primary/20' : 'bg-background/20'} hover:bg-primary/30`}
            >
              <Pencil className="w-4 h-4" />
              Brush
            </Button>
            <Button
              variant="ghost"
              onClick={() => setTool('eraser')}
              className={`gap-2 backdrop-blur-sm ${tool === 'eraser' ? 'bg-primary/20' : 'bg-background/20'} hover:bg-primary/30`}
            >
              <Eraser className="w-4 h-4" />
              Eraser
            </Button>
            <Button
              variant="ghost"
              onClick={clearCanvas}
              className="gap-2 backdrop-blur-sm bg-destructive/20 hover:bg-destructive/30 text-destructive"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="border rounded-lg bg-white cursor-crosshair shadow-md"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>

      <div className="space-y-4 bg-background/30 backdrop-blur-sm p-4 rounded-lg border">
        <Input
          placeholder="Give your artwork a title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-medium bg-transparent"
        />
        <Textarea
          placeholder="Share your thoughts about this piece..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[100px] bg-transparent"
        />
        <div className="flex justify-between items-center">
          <select
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value as 'public' | 'private')}
            className="px-4 py-2 rounded-lg border bg-transparent backdrop-blur-sm"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          <Button 
            onClick={handleSave} 
            className="gap-2 bg-duo-blue/80 hover:bg-duo-blue/90 backdrop-blur-sm"
          >
            <Save className="w-4 h-4" />
            Save Art
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArtEntry;