import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Palette, Mic, Video } from 'lucide-react';

const JournalTabs = () => {
  return (
    <TabsList className="grid grid-cols-4 h-14 p-1 bg-black/20 backdrop-blur-md rounded-xl">
      <TabsTrigger 
        value="text" 
        className="data-[state=active]:bg-[#65a30d] data-[state=active]:text-white rounded-lg flex gap-2 items-center"
      >
        <Pencil className="h-4 w-4" />
        Text
      </TabsTrigger>
      
      <TabsTrigger 
        value="art" 
        className="rounded-lg flex gap-2 items-center text-white/70 hover:text-white/90"
      >
        <Palette className="h-4 w-4" />
        Art
      </TabsTrigger>
      
      <TabsTrigger 
        value="voice" 
        className="rounded-lg flex gap-2 items-center text-white/70 hover:text-white/90"
      >
        <Mic className="h-4 w-4" />
        Voice
      </TabsTrigger>
      
      <TabsTrigger 
        value="video" 
        className="rounded-lg flex gap-2 items-center text-white/70 hover:text-white/90"
      >
        <Video className="h-4 w-4" />
        Video
      </TabsTrigger>
    </TabsList>
  );
};

export default JournalTabs;