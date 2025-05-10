import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  Video, 
  Headphones, 
  Award, 
  Search,
  BookMarked,
  PlayCircle,
  FileText,
  ArrowRight,
  Star
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'audio';
  category: string;
  duration: string;
  rating: number;
  author: string;
  thumbnail?: string;
}

const resources: Resource[] = [
  {
    id: '1',
    title: "Understanding Anxiety: A Comprehensive Guide",
    description: "Learn about the different types of anxiety and effective coping strategies.",
    type: 'article',
    category: 'Mental Health',
    duration: '10 min read',
    rating: 4.8,
    author: "Dr. Sarah Johnson"
  },
  {
    id: '2',
    title: "Mindfulness Meditation for Beginners",
    description: "A step-by-step guide to starting your mindfulness practice.",
    type: 'video',
    category: 'Meditation',
    duration: '15 min',
    rating: 4.9,
    author: "Mark Williams",
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop"
  },
  {
    id: '3',
    title: "Sleep Meditation: Deep Relaxation",
    description: "Guided meditation for better sleep and relaxation.",
    type: 'audio',
    category: 'Sleep',
    duration: '20 min',
    rating: 4.7,
    author: "Emma Thompson"
  }
];

const CommunityHub = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userPoints, setUserPoints] = useState(0);
  const { toast } = useToast();

  const handleResourceComplete = (points: number) => {
    setUserPoints(prev => prev + points);
    toast({
      title: "Resource Completed! 🌟",
      description: `You earned ${points} points!`,
    });
  };

  const getIconByType = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText className="w-5 h-5 text-[#D946EF]" />;
      case 'video':
        return <PlayCircle className="w-5 h-5 text-[#8B5CF6]" />;
      case 'audio':
        return <Headphones className="w-5 h-5 text-[#EC4899]" />;
      default:
        return <BookMarked className="w-5 h-5 text-[#8B5CF6]" />;
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-black/40 bg-gradient-to-br from-[#8B5CF6]/5 to-[#D946EF]/5 backdrop-blur-md rounded-xl border-white/20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border-b border-white/20 bg-black/20 backdrop-blur-md rounded-t-xl -mt-4 sm:-mt-6 -mx-4 sm:-mx-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-[#D946EF]" />
          <div>
            <h2 className="font-semibold text-white">Resource Library</h2>
            <p className="text-sm text-white/80">Explore curated content for your well-being</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:ml-auto">
          <Award className="w-5 h-5 text-[#8B5CF6]" />
          <span className="font-semibold text-white">{userPoints} Points</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search resources..."
          className="pl-10 bg-black/20 border-white/20 text-white placeholder:text-white/50"
        />
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full bg-black/20 border-white/20 p-1 flex flex-wrap sm:flex-nowrap">
          <TabsTrigger 
            value="all"
            className="flex-1 min-w-[100px] data-[state=active]:bg-white/10 data-[state=active]:text-white"
          >
            All
          </TabsTrigger>
          <TabsTrigger 
            value="articles"
            className="flex-1 min-w-[100px] data-[state=active]:bg-white/10 data-[state=active]:text-white"
          >
            <FileText className="w-4 h-4 mr-2 hidden sm:inline-block" />
            Articles
          </TabsTrigger>
          <TabsTrigger 
            value="videos"
            className="flex-1 min-w-[100px] data-[state=active]:bg-white/10 data-[state=active]:text-white"
          >
            <Video className="w-4 h-4 mr-2 hidden sm:inline-block" />
            Videos
          </TabsTrigger>
          <TabsTrigger 
            value="audio"
            className="flex-1 min-w-[100px] data-[state=active]:bg-white/10 data-[state=active]:text-white"
          >
            <Headphones className="w-4 h-4 mr-2 hidden sm:inline-block" />
            Audio
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {resources.map((resource) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-4 sm:p-6 bg-black/40 backdrop-blur-md border-white/20 hover:border-[#8B5CF6]/50 transition-all duration-300">
                  <div className="flex flex-col h-full">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="flex-shrink-0">
                        {getIconByType(resource.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <h3 className="text-lg font-semibold text-white truncate">{resource.title}</h3>
                          <Badge variant="secondary" className="bg-black/40 text-white border-white/20 whitespace-nowrap">
                            {resource.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-white/60 line-clamp-2 mt-2">{resource.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/60 mt-4">
                          <span>{resource.duration}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>{resource.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <Button 
                        variant="ghost" 
                        className="w-full text-white hover:bg-white/10"
                        onClick={() => handleResourceComplete(10)}
                      >
                        Start Learning
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="articles">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {resources.filter(r => r.type === 'article').map((resource) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-4 sm:p-6 bg-black/40 backdrop-blur-md border-white/20 hover:border-[#8B5CF6]/50 transition-all duration-300">
                  <div className="flex flex-col h-full">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="flex-shrink-0">
                        {getIconByType(resource.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <h3 className="text-lg font-semibold text-white truncate">{resource.title}</h3>
                          <Badge variant="secondary" className="bg-black/40 text-white border-white/20 whitespace-nowrap">
                            {resource.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-white/60 line-clamp-2 mt-2">{resource.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/60 mt-4">
                          <span>{resource.duration}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>{resource.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <Button 
                        variant="ghost" 
                        className="w-full text-white hover:bg-white/10"
                        onClick={() => handleResourceComplete(10)}
                      >
                        Start Learning
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {resources.filter(r => r.type === 'video').map((resource) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-4 sm:p-6 bg-black/40 backdrop-blur-md border-white/20 hover:border-[#8B5CF6]/50 transition-all duration-300">
                  <div className="flex flex-col h-full">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="flex-shrink-0">
                        {getIconByType(resource.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <h3 className="text-lg font-semibold text-white truncate">{resource.title}</h3>
                          <Badge variant="secondary" className="bg-black/40 text-white border-white/20 whitespace-nowrap">
                            {resource.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-white/60 line-clamp-2 mt-2">{resource.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/60 mt-4">
                          <span>{resource.duration}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>{resource.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <Button 
                        variant="ghost" 
                        className="w-full text-white hover:bg-white/10"
                        onClick={() => handleResourceComplete(10)}
                      >
                        Start Learning
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audio">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {resources.filter(r => r.type === 'audio').map((resource) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-4 sm:p-6 bg-black/40 backdrop-blur-md border-white/20 hover:border-[#8B5CF6]/50 transition-all duration-300">
                  <div className="flex flex-col h-full">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="flex-shrink-0">
                        {getIconByType(resource.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <h3 className="text-lg font-semibold text-white truncate">{resource.title}</h3>
                          <Badge variant="secondary" className="bg-black/40 text-white border-white/20 whitespace-nowrap">
                            {resource.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-white/60 line-clamp-2 mt-2">{resource.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/60 mt-4">
                          <span>{resource.duration}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>{resource.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <Button 
                        variant="ghost" 
                        className="w-full text-white hover:bg-white/10"
                        onClick={() => handleResourceComplete(10)}
                      >
                        Start Learning
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CommunityHub;