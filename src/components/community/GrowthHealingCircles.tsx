'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  Calendar, 
  Heart,
  Shield,
  MessageCircle,
  Star,
  ChevronRight,
  UserCheck,
  Globe2
} from 'lucide-react';

interface HealingCircle {
  id: string;
  name: string;
  description: string;
  topic: string;
  facilitator: string;
  memberCount: number;
  maxCapacity: number;
  nextMeeting: string;
  timeSlot: string;
  isJoined: boolean;
  safetyRating: number;
  tags: string[];
  guidelines: string[];
}

export default function GrowthHealingCircles() {
  const [circles, setCircles] = useState<HealingCircle[]>([]);
  const [selectedCircle, setSelectedCircle] = useState<HealingCircle | null>(null);
  const [isJoining, setIsJoining] = useState<string | null>(null);
  const [showGuidelines, setShowGuidelines] = useState(false);

  useEffect(() => {
    loadGrowthCircles();
  }, []);

  const loadGrowthCircles = () => {
    // Curated healing circles for Growth tier users
    const growthCircles: HealingCircle[] = [
      {
        id: 'daily-check-in',
        name: 'Daily Check-in Circle',
        description: 'Start each day by sharing your intentions and receiving gentle support from peers.',
        topic: 'Daily Wellness',
        facilitator: 'Community Guided',
        memberCount: 12,
        maxCapacity: 15,
        nextMeeting: 'Today at 8:00 AM',
        timeSlot: 'Every morning, 15 min',
        isJoined: false,
        safetyRating: 4.8,
        tags: ['Morning', 'Quick Share', 'Intention Setting'],
        guidelines: [
          'Share only what feels comfortable',
          'No advice unless requested',
          'Honor everyone\'s journey',
          'Keep sharing to 2-3 minutes'
        ]
      },
      {
        id: 'grief-processing',
        name: 'Gentle Grief Processing',
        description: 'A compassionate space to process loss, disappointment, and life transitions with others who understand.',
        topic: 'Grief & Loss',
        facilitator: 'Peer Support',
        memberCount: 8,
        maxCapacity: 12,
        nextMeeting: 'Wednesday at 7:00 PM',
        timeSlot: 'Wednesdays, 60 min',
        isJoined: true,
        safetyRating: 4.9,
        tags: ['Loss', 'Healing', 'Compassion'],
        guidelines: [
          'Honor all forms of grief',
          'No timeline pressure',
          'Confidentiality is sacred',
          'Support without fixing'
        ]
      },
      {
        id: 'anxiety-support',
        name: 'Anxiety & Overwhelm Support',
        description: 'Learn coping strategies and share experiences with others navigating anxiety and stress.',
        topic: 'Mental Wellness',
        facilitator: 'Guided Discussion',
        memberCount: 15,
        maxCapacity: 18,
        nextMeeting: 'Tomorrow at 6:30 PM',
        timeSlot: 'Tuesdays & Thursdays, 45 min',
        isJoined: false,
        safetyRating: 4.7,
        tags: ['Anxiety', 'Coping', 'Mindfulness'],
        guidelines: [
          'Focus on personal experience',
          'Share coping strategies that work',
          'Practice grounding together',
          'No medical advice'
        ]
      },
      {
        id: 'relationship-patterns',
        name: 'Relationship Patterns Circle',
        description: 'Explore patterns in relationships and learn healthier ways to connect with others.',
        topic: 'Relationships',
        facilitator: 'Peer-Led',
        memberCount: 10,
        maxCapacity: 14,
        nextMeeting: 'Sunday at 4:00 PM',
        timeSlot: 'Sundays, 75 min',
        isJoined: false,
        safetyRating: 4.6,
        tags: ['Boundaries', 'Communication', 'Growth'],
        guidelines: [
          'Respect all relationship types',
          'Focus on your own patterns',
          'Practice vulnerability safely',
          'No judgment of choices'
        ]
      },
      {
        id: 'creative-expression',
        name: 'Healing Through Creativity',
        description: 'Express your healing journey through art, writing, music, or any creative medium that speaks to you.',
        topic: 'Creative Healing',
        facilitator: 'Creative Guide',
        memberCount: 7,
        maxCapacity: 10,
        nextMeeting: 'Friday at 7:30 PM',
        timeSlot: 'Fridays, 90 min',
        isJoined: false,
        safetyRating: 4.8,
        tags: ['Art', 'Expression', 'Creativity'],
        guidelines: [
          'All skill levels welcome',
          'Process over perfection',
          'Share only if you want to',
          'Honor diverse expressions'
        ]
      }
    ];

    setCircles(growthCircles);
  };

  const joinCircle = async (circleId: string) => {
    setIsJoining(circleId);
    
    // Simulate joining process
    setTimeout(() => {
      setCircles(prev => prev.map(circle => 
        circle.id === circleId 
          ? { ...circle, isJoined: true, memberCount: circle.memberCount + 1 }
          : circle
      ));
      setIsJoining(null);
    }, 1500);
  };

  const leaveCircle = async (circleId: string) => {
    setCircles(prev => prev.map(circle => 
      circle.id === circleId 
        ? { ...circle, isJoined: false, memberCount: Math.max(0, circle.memberCount - 1) }
        : circle
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-light text-gray-800 mb-4">Growth Healing Circles</h2>
        <p className="text-gray-600 mb-4">
          Connect with peers in safe, moderated healing circles designed for your Growth journey.
        </p>
        
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-purple-600" />
            <h3 className="text-purple-800 font-medium">Safe Space Promise</h3>
          </div>
          <p className="text-purple-700 text-sm leading-relaxed">
            All circles are anonymous, confidential, and guided by community safety principles. 
            Report any concerns using the safety icon in each circle.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {circles.map((circle) => (
          <div
            key={circle.id}
            className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-medium text-gray-800">{circle.name}</h3>
                  {circle.isJoined && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <UserCheck className="w-3 h-3" />
                      Joined
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-3 leading-relaxed">{circle.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {circle.tags.map((tag) => (
                    <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="text-right ml-4">
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  {circle.safetyRating}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  {circle.memberCount}/{circle.maxCapacity}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{circle.nextMeeting}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{circle.timeSlot}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MessageCircle className="w-4 h-4" />
                <span>{circle.facilitator}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedCircle(selectedCircle?.id === circle.id ? null : circle)}
                className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                View Guidelines
                <ChevronRight className={`w-4 h-4 transition-transform ${selectedCircle?.id === circle.id ? 'rotate-90' : ''}`} />
              </button>

              <div className="flex items-center gap-3">
                {circle.isJoined ? (
                  <>
                    <button
                      onClick={() => leaveCircle(circle.id)}
                      className="text-gray-500 hover:text-gray-700 text-sm font-medium px-4 py-2"
                    >
                      Leave Circle
                    </button>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                      <Globe2 className="w-4 h-4" />
                      Join Meeting
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => joinCircle(circle.id)}
                    disabled={isJoining === circle.id || circle.memberCount >= circle.maxCapacity}
                    className={`px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                      circle.memberCount >= circle.maxCapacity
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    {isJoining === circle.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Joining...
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4" />
                        {circle.memberCount >= circle.maxCapacity ? 'Full' : 'Join Circle'}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Guidelines Dropdown */}
            {selectedCircle?.id === circle.id && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-3">Circle Guidelines</h4>
                <ul className="space-y-2">
                  {circle.guidelines.map((guideline, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>{guideline}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          New circles are added regularly based on community needs and interests.
        </p>
      </div>
    </div>
  );
}