'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TextArea } from '@/components/ui/textarea';
import CrisisKeywordDetector from '@/components/ui/CrisisKeywordDetector';

interface CirclePost {
  id: string;
  content: string;
  timestamp: Date;
  reactions: {
    heart: number;
    strength: number;
    wisdom: number;
    solidarity: number;
  };
  userReaction?: 'heart' | 'strength' | 'wisdom' | 'solidarity' | null;
  isAnonymous: true; // Always anonymous for safety
  pathway?: 'resilience' | 'becoming' | 'purpose' | 'belonging';
  mood?: string;
}

interface SharingCircleProps {
  pathway?: 'resilience' | 'becoming' | 'purpose' | 'belonging';
  title?: string;
  description?: string;
}

const REACTION_TYPES = {
  heart: { emoji: '💜', label: 'Heart', description: 'This touched my heart' },
  strength: { emoji: '💪', label: 'Strength', description: 'This shows incredible strength' },
  wisdom: { emoji: '🌟', label: 'Wisdom', description: 'This is wise and insightful' },
  solidarity: { emoji: '🤝', label: 'Solidarity', description: 'I stand with you' }
};

const PATHWAY_PROMPTS = {
  resilience: [
    "What's one moment you survived that you thought you wouldn't?",
    "What strength have you discovered through difficulty?",
    "How has a challenge become a teacher for you?"
  ],
  becoming: [
    "What old story about yourself are you ready to release?",
    "Who are you becoming that your past self wouldn't recognize?",
    "What permission do you need to give yourself right now?"
  ],
  purpose: [
    "What makes you feel most alive and connected to meaning?",
    "How do your unique gifts serve something larger than yourself?",
    "What would you do if you knew you couldn't fail?"
  ],
  belonging: [
    "Where do you feel most seen and accepted for who you truly are?",
    "How do you create belonging for others?",
    "What does authentic community mean to you?"
  ]
};

// Mock data for demonstration
const DEMO_POSTS: CirclePost[] = [
  {
    id: '1',
    content: "I never thought I'd say this, but losing my job was one of the best things that happened to me. It forced me to confront who I really am beneath all the titles and expectations. I'm still scared about the future, but for the first time in years, I feel like I'm living authentically.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    reactions: { heart: 12, strength: 8, wisdom: 15, solidarity: 6 },
    userReaction: null,
    isAnonymous: true,
    pathway: 'becoming',
    mood: 'hopeful'
  },
  {
    id: '2', 
    content: "To anyone feeling alone right now: your pain is valid, your struggles are real, and you belong here. Sometimes the bravest thing we can do is simply keep breathing and show up for another day. You matter more than you know.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    reactions: { heart: 28, strength: 12, wisdom: 9, solidarity: 22 },
    userReaction: 'heart',
    isAnonymous: true,
    pathway: 'belonging',
    mood: 'supportive'
  },
  {
    id: '3',
    content: "I've been through therapy, read all the self-help books, tried meditation... but it wasn't until I started volunteering at the animal shelter that I found my purpose. Sometimes the answer isn't in healing ourselves - it's in healing others.",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    reactions: { heart: 18, strength: 5, wisdom: 24, solidarity: 7 },
    userReaction: null,
    isAnonymous: true,
    pathway: 'purpose',
    mood: 'grateful'
  }
];

export default function SharingCircle({ 
  pathway, 
  title = "Anonymous Sharing Circle",
  description = "A safe space to share your truth and connect with others on similar journeys"
}: SharingCircleProps) {
  const [posts, setPosts] = useState<CirclePost[]>(DEMO_POSTS);
  const [newPost, setNewPost] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [crisisDetected, setCrisisDetected] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);

  const prompts = pathway ? PATHWAY_PROMPTS[pathway] : [
    "What's something you need to share but haven't found the words for?",
    "What wisdom would you give to someone earlier in their journey?",
    "How has your perspective on healing changed over time?"
  ];

  const handleCrisisDetection = (keywords: string[]) => {
    setCrisisDetected(keywords);
  };

  const handleReaction = (postId: string, reactionType: keyof typeof REACTION_TYPES) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        const currentUserReaction = post.userReaction;
        const reactions = { ...post.reactions };
        
        // Remove previous reaction if exists
        if (currentUserReaction) {
          reactions[currentUserReaction]--;
        }
        
        // Add new reaction if different from current
        const newUserReaction = currentUserReaction === reactionType ? null : reactionType;
        if (newUserReaction) {
          reactions[newUserReaction]++;
        }
        
        return {
          ...post,
          reactions,
          userReaction: newUserReaction
        };
      }
      return post;
    }));
  };

  const handleSubmitPost = async () => {
    if (!newPost.trim() || crisisDetected.length > 0) return;
    
    setIsPosting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const post: CirclePost = {
      id: Date.now().toString(),
      content: newPost.trim(),
      timestamp: new Date(),
      reactions: { heart: 0, strength: 0, wisdom: 0, solidarity: 0 },
      userReaction: null,
      isAnonymous: true,
      pathway,
      mood: 'sharing'
    };
    
    setPosts(prev => [post, ...prev]);
    setNewPost('');
    setSelectedPrompt(null);
    setIsPosting(false);
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#5E8E7F]/20 flex items-center justify-center">
          <span className="text-2xl">🌙</span>
        </div>
        <h1 className="text-2xl font-light text-white mb-2">{title}</h1>
        <p className="text-white/80 text-sm max-w-md mx-auto">{description}</p>
      </div>

      {/* Safety Notice */}
      <Card className="bg-blue-500/10 border-blue-500/20 p-4">
        <div className="flex items-start gap-3">
          <span className="text-blue-400 text-lg">🛡️</span>
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">Safe Space Guidelines</p>
            <p className="text-blue-200/80 text-xs leading-relaxed">
              All sharing is anonymous. Be kind, authentic, and respectful. If you're in crisis, 
              please reach out to <span className="font-medium">988</span> or emergency services.
            </p>
          </div>
        </div>
      </Card>

      {/* Sharing Prompts */}
      <Card className="bg-white/5 border-white/10 p-4">
        <p className="text-white/90 text-sm font-medium mb-3">✨ Reflection Prompts</p>
        <div className="space-y-2">
          {prompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedPrompt(prompt);
                setNewPost(prompt + '\n\n');
              }}
              className="w-full text-left p-3 rounded-lg border border-white/10 hover:border-[#5E8E7F]/50 hover:bg-white/5 transition-all duration-200"
            >
              <p className="text-white/80 text-sm italic">"{prompt}"</p>
            </button>
          ))}
        </div>
      </Card>

      {/* New Post Creation */}
      <Card className="bg-white/5 border-white/10 p-4">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white/60 text-sm">Sharing anonymously</span>
            <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-300 text-xs">Anonymous</span>
          </div>
          
          <CrisisKeywordDetector 
            text={newPost}
            onCrisisDetected={handleCrisisDetection}
          />
          
          <TextArea
            placeholder="Share your truth, your wisdom, or your struggle. This is a safe space..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="min-h-32 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#5E8E7F] resize-none"
          />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-white/40 text-xs">
            {newPost.length}/500 characters
          </span>
          <Button
            onClick={handleSubmitPost}
            disabled={!newPost.trim() || newPost.length > 500 || crisisDetected.length > 0 || isPosting}
            className="bg-[#5E8E7F] hover:bg-[#4A6B5E] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPosting ? 'Sharing...' : 'Share Anonymously'}
          </Button>
        </div>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="bg-white/5 border-white/10 p-6">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">A</span>
                </div>
                <span className="text-white/60 text-sm">Anonymous</span>
                {post.pathway && (
                  <span className="px-2 py-1 rounded-full bg-[#5E8E7F]/20 text-[#5E8E7F] text-xs capitalize">
                    {post.pathway}
                  </span>
                )}
                <span className="text-white/40 text-xs ml-auto">
                  {formatTimestamp(post.timestamp)}
                </span>
              </div>
              
              <p className="text-white/90 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
            
            {/* Reactions */}
            <div className="flex items-center gap-1 pt-3 border-t border-white/10">
              {Object.entries(REACTION_TYPES).map(([key, reaction]) => {
                const count = post.reactions[key as keyof typeof post.reactions];
                const isActive = post.userReaction === key;
                
                return (
                  <button
                    key={key}
                    onClick={() => handleReaction(post.id, key as keyof typeof REACTION_TYPES)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-all duration-200 ${
                      isActive 
                        ? 'bg-[#5E8E7F]/20 text-[#5E8E7F]' 
                        : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                    }`}
                    title={reaction.description}
                  >
                    <span>{reaction.emoji}</span>
                    {count > 0 && <span>{count}</span>}
                  </button>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center py-4">
        <Button
          variant="ghost"
          className="text-white/60 hover:text-white/80"
          onClick={() => {
            // In production, this would load more posts from the API
            console.log('Loading more posts...');
          }}
        >
          Load more stories
        </Button>
      </div>
    </div>
  );
}