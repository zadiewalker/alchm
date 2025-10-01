'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Clock, Shield, Plus, Star, Heart } from 'lucide-react';

interface HealingCircle {
  id: string;
  name: string;
  theme: string;
  memberCount: number;
  isActive: boolean;
  nextMeeting: Date;
  supportLevel: 'gentle' | 'moderate' | 'deep';
  facilitator: string;
  description: string;
}

interface Props {
  circles: HealingCircle[];
  userParticipation: {
    anonymousMode: boolean;
    preferredSupport: string[];
    availabilityWindow: string;
  };
}

export const HealingCircles: React.FC<Props> = ({ circles, userParticipation }) => {
  const [selectedCircle, setSelectedCircle] = useState<HealingCircle | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const getSupportLevelColor = (level: string) => {
    switch (level) {
      case 'gentle': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-blue-600 bg-blue-100';
      case 'deep': return 'text-purple-600 bg-purple-100';
      default: return 'text-sage-600 bg-sage-100';
    }
  };

  const getSupportLevelDescription = (level: string) => {
    switch (level) {
      case 'gentle': return 'Light support, encouragement, and positive sharing';
      case 'moderate': return 'Structured discussion with guided exercises';
      case 'deep': return 'Intensive healing work with professional facilitation';
      default: return 'General peer support';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-medium text-slate-800 tracking-wide">
          Healing Circles
        </h3>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-sage-600 hover:bg-sage-700 text-white"
        >
          <Plus size={16} className="mr-2" />
          Create Circle
        </Button>
      </div>

      {/* Circles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {circles.map(circle => (
          <Card 
            key={circle.id} 
            className={`p-6 border-sage-200 cursor-pointer transition-all duration-300 ${
              selectedCircle?.id === circle.id ? 'ring-2 ring-sage-400 shadow-md' : 'hover:shadow-sm'
            }`}
            onClick={() => setSelectedCircle(circle)}
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-lg font-medium text-slate-800 tracking-wide">
                {circle.name}
              </h4>
              <div className="flex items-center space-x-2">
                <span className={`
                  px-2 py-1 rounded-full text-xs font-medium tracking-wide
                  ${getSupportLevelColor(circle.supportLevel)}
                `}>
                  {circle.supportLevel}
                </span>
                {circle.isActive && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </div>
            </div>

            <p className="text-slate-600 text-sm mb-4 tracking-wide">
              {circle.theme}
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div className="flex items-center space-x-2">
                <Users size={14} className="text-slate-400" />
                <span className="text-slate-600">{circle.memberCount} members</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={14} className="text-slate-400" />
                <span className="text-slate-600">{circle.nextMeeting.toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Facilitated by {circle.facilitator}
              </span>
              <Button size="sm" variant="outline">
                {circle.isActive ? 'Join Circle' : 'Request Access'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Circle Details */}
      {selectedCircle && (
        <Card className="p-6 border-sage-200 bg-sage-50">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-xl font-medium text-slate-800 tracking-wide mb-2">
                {selectedCircle.name}
              </h4>
              <p className="text-slate-600 tracking-wide">
                {selectedCircle.description || selectedCircle.theme}
              </p>
            </div>
            <Button className="bg-sage-600 hover:bg-sage-700 text-white">
              Join Circle
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Support Level</label>
              <div>
                <span className={`
                  px-3 py-1 rounded-full text-sm font-medium tracking-wide
                  ${getSupportLevelColor(selectedCircle.supportLevel)}
                `}>
                  {selectedCircle.supportLevel}
                </span>
                <p className="text-xs text-slate-600 mt-1">
                  {getSupportLevelDescription(selectedCircle.supportLevel)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Next Meeting</label>
              <div className="flex items-center space-x-2">
                <Calendar className="text-slate-400" size={16} />
                <span className="text-slate-800">{selectedCircle.nextMeeting.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Community</label>
              <div className="flex items-center space-x-2">
                <Users className="text-slate-400" size={16} />
                <span className="text-slate-800">{selectedCircle.memberCount} active members</span>
              </div>
            </div>
          </div>

          {/* Circle Guidelines */}
          <div className="bg-white p-4 rounded-lg border border-sage-200">
            <h5 className="font-medium text-slate-800 mb-2">Circle Guidelines</h5>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Respect everyone's anonymity and privacy choices</li>
              <li>• Practice active listening and empathy</li>
              <li>• Share only what feels safe and comfortable</li>
              <li>• No advice-giving unless requested</li>
              <li>• Honor the sacred nature of shared experiences</li>
            </ul>
          </div>
        </Card>
      )}

      {/* Create Circle Form */}
      {showCreateForm && (
        <Card className="p-6 border-sage-200 bg-sage-50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-slate-800 tracking-wide">
              Create New Healing Circle
            </h4>
            <Button 
              onClick={() => setShowCreateForm(false)}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
          </div>

          <div className="text-center py-8 text-slate-500">
            <Users size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg tracking-wide">Circle creation coming soon</p>
            <p className="text-sm mt-2">
              We're building tools for community members to create and facilitate their own healing circles
            </p>
          </div>
        </Card>
      )}

      {circles.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <Users size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg tracking-wide">No healing circles available yet</p>
          <p className="text-sm mt-2">Be the first to create a circle for your community</p>
        </div>
      )}
    </div>
  );
};

export default HealingCircles;