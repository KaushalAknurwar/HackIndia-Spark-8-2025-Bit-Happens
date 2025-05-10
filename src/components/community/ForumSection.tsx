import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ThumbsUp, Flag } from 'lucide-react';

interface ForumSectionProps {
  onPointsEarned: (points: number) => void;
}

interface Post {
  id: string;
  title: string;
  author: string;
  content: string;
  likes: number;
  replies: number;
  tags: string[];
  timestamp: string;
}

const samplePosts: Post[] = [
  {
    id: '1',
    title: "Dealing with Anxiety - My Journey",
    author: "Sarah M.",
    content: "I wanted to share my experience with managing anxiety...",
    likes: 15,
    replies: 8,
    tags: ["Anxiety", "Self-Care"],
    timestamp: "2 hours ago"
  },
  {
    id: '2',
    title: "Weekly Meditation Group",
    author: "Michael R.",
    content: "Join us for our weekly meditation sessions...",
    likes: 23,
    replies: 12,
    tags: ["Meditation", "Group Activity"],
    timestamp: "5 hours ago"
  }
];

const ForumSection: React.FC<ForumSectionProps> = ({ onPointsEarned }) => {
  const [posts, setPosts] = useState<Post[]>(samplePosts);

  const handleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    );
    onPointsEarned(5);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Recent Discussions</h3>
        <Button className="gap-2">
          <MessageSquare className="w-4 h-4" />
          New Post
        </Button>
      </div>

      <div className="space-y-4">
        {posts.map(post => (
          <Card key={post.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-semibold mb-2">{post.title}</h4>
                <div className="flex gap-2 mb-2">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(post.id)}
                className="gap-2"
              >
                <ThumbsUp className="w-4 h-4" />
                {post.likes}
              </Button>
            </div>

            <p className="text-muted-foreground mb-4">{post.content}</p>

            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>By {post.author}</span>
                <span>{post.timestamp}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                {post.replies} replies
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ForumSection;