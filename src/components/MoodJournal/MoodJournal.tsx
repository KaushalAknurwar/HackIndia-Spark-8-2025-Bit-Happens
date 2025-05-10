import React, { useState, useRef } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import TextEntry from './TextEntry';
import ArtEntry from './ArtEntry';
import VoiceEntry from './VoiceEntry';
import VideoEntry from './VideoEntry/VideoEntry';
import JournalHeader from './JournalHeader';
import JournalTabs from './JournalTabs';
import { useToast } from "@/components/ui/use-toast";

const MoodJournal = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('text');
  
  // Text Entry State
  const [textEntry, setTextEntry] = useState('');
  const handleSaveTextEntry = () => {
    toast({
      title: "Entry saved",
      description: "Your journal entry has been saved successfully.",
    });
  };

  // Art Entry State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'private'>('private');
  const [isDrawing, setIsDrawing] = useState(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleSaveArtwork = () => {
    toast({
      title: "Artwork saved",
      description: "Your artwork has been saved successfully.",
    });
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (context && canvas) {
      const rect = canvas.getBoundingClientRect();
      context.beginPath();
      context.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (context && canvas) {
      const rect = canvas.getBoundingClientRect();
      context.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      context.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
      context.lineWidth = brushSize;
      context.lineCap = 'round';
      context.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <JournalHeader />

      <Card className="bg-zinc-900/90 bg-gradient-to-br from-[#8B5CF6]/5 to-[#D946EF]/5 backdrop-blur-md border-white/20">
        <CardContent className="p-8">
          <Tabs defaultValue="text" className="w-full" onValueChange={setActiveTab}>
            <div className="px-1">
              <JournalTabs />
            </div>

            <div className="mt-8 text-white">
              <TabsContent value="text" className="text-white">
                <TextEntry 
                  textEntry={textEntry}
                  setTextEntry={setTextEntry}
                  handleSaveEntry={handleSaveTextEntry}
                />
              </TabsContent>

              <TabsContent value="art" className="text-white">
                <ArtEntry 
                  canvasRef={canvasRef}
                  color={color}
                  setColor={setColor}
                  brushSize={brushSize}
                  setBrushSize={setBrushSize}
                  tool={tool}
                  setTool={setTool}
                  clearCanvas={clearCanvas}
                  handleSaveArtwork={handleSaveArtwork}
                  title={title}
                  setTitle={setTitle}
                  description={description}
                  setDescription={setDescription}
                  privacy={privacy}
                  setPrivacy={setPrivacy}
                  startDrawing={startDrawing}
                  draw={draw}
                  stopDrawing={stopDrawing}
                />
              </TabsContent>

              <TabsContent value="voice" className="text-white">
                <VoiceEntry />
              </TabsContent>

              <TabsContent value="video" className="text-white">
                <VideoEntry />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodJournal;