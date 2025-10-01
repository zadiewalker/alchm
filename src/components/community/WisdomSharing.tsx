'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Star, Sparkles, Moon, Shield, Plus, Eye, EyeOff } from 'lucide-react';

interface SharedWisdom {
  id: string;
  authorName: string;
  category: 'breakthrough' | 'coping' | 'reflection' | 'gratitude';
  content: string;
  timestamp: Date;
  supportReactions: number;
  isAnonymous: boolean;
}

interface Props {
  sharedWisdom: SharedWisdom[];
  onAddWisdom: (wisdom: SharedWisdom) => void;
}

export const WisdomSharing: React.FC<Props> = ({ sharedWisdom, onAddWisdom }) => {
  const [showShareForm, setShowShareForm] = useState(false);
  const [newWisdom, setNewWisdom] = useState({
    category: 'reflection' as const,
    content: '',
    isAnonymous: true
  });
  const [filter, setFilter] = useState<'all' | 'breakthrough' | 'coping' | 'reflection' | 'gratitude'>('all');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'breakthrough': return <Sparkles className="text-yellow-500" size={16} />;
      case 'coping': return <Shield className="text-blue-500" size={16} />;
      case 'reflection': return <Moon className="text-purple-500" size={16} />;
      case 'gratitude': return <Heart className="text-pink-500" size={16} />;
      default: return <Star className="text-sage-500" size={16} />;
    }
  };

  const handleSubmitWisdom = () => {
    if (newWisdom.content.trim()) {
      const wisdom: SharedWisdom = {
        id: Date.now().toString(),
        authorName: newWisdom.isAnonymous ? 'Anonymous Healer' : 'You',
        category: newWisdom.category,
        content: newWisdom.content,
        timestamp: new Date(),
        supportReactions: 0,
        isAnonymous: newWisdom.isAnonymous
      };
      
      onAddWisdom(wisdom);
      setNewWisdom({ category: 'reflection', content: '', isAnonymous: true });
      setShowShareForm(false);
    }
  };

  const filteredWisdom = sharedWisdom.filter(wisdom => 
    filter === 'all' || wisdom.category === filter
  );

  const FilterButton = ({ category, label }: { category: typeof filter; label: string }) => (
    <button
      onClick={() => setFilter(category)}
      className={`
        px-4 py-2 rounded-lg text-sm font-medium tracking-wide transition-all duration-300
        ${filter === category 
          ? 'bg-sage-600 text-white shadow-md' 
          : 'bg-white text-slate-600 hover:bg-sage-50 hover:text-sage-700 border border-slate-200'
        }
      `}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-medium text-slate-800 tracking-wide">
          Shared Wisdom
        </h3>
        <Button 
          onClick={() => setShowShareForm(true)}
          className="bg-sage-600 hover:bg-sage-700 text-white"
        >
          <Plus size={16} className="mr-2" />
          Share Wisdom
        </Button>
      </div>

      {/* Share Form */}
      {showShareForm && (
        <Card className="p-6 border-sage-200 bg-sage-50">
          <h4 className="text-lg font-medium text-slate-800 mb-4 tracking-wide">
            Share Your Wisdom
          </h4>
          
          <div className="space-y-4">
            {/* Category Selection */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'breakthrough', label: 'Breakthrough', icon: Sparkles },
                  { key: 'coping', label: 'Coping Strategy', icon: Shield },
                  { key: 'reflection', label: 'Reflection', icon: Moon },
                  { key: 'gratitude', label: 'Gratitude', icon: Heart }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setNewWisdom({ ...newWisdom, category: key as any })}
                    className={`
                      flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-300
                      ${newWisdom.category === key 
                        ? 'bg-sage-600 text-white shadow-md' 
                        : 'bg-white text-slate-600 hover:bg-sage-100 border border-slate-200'
                      }
                    `}
                  >
                    <Icon size={14} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Your Wisdom
              </label>
              <textarea
                value={newWisdom.content}
                onChange={(e) => setNewWisdom({ ...newWisdom, content: e.target.value })}
                placeholder="Share something that might help others on their healing journey..."
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-400 focus:border-transparent resize-none"
                rows={4}
              />
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setNewWisdom({ ...newWisdom, isAnonymous: !newWisdom.isAnonymous })}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-300
                  ${newWisdom.isAnonymous 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-slate-100 text-slate-600'
                  }
                `}
              >
                {newWisdom.isAnonymous ? <EyeOff size={14} /> : <Eye size={14} />}
                <span>{newWisdom.isAnonymous ? 'Anonymous' : 'With Name'}</span>
              </button>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 pt-4">
              <Button 
                onClick={handleSubmitWisdom}
                className="bg-sage-600 hover:bg-sage-700 text-white"
              >
                Share Wisdom
              </Button>
              <Button 
                onClick={() => setShowShareForm(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-2">
        <FilterButton category="all" label="All Wisdom" />
        <FilterButton category="breakthrough" label="Breakthroughs" />
        <FilterButton category="coping" label="Coping" />
        <FilterButton category="reflection" label="Reflections" />
        <FilterButton category="gratitude" label="Gratitude" />
      </div>

      {/* Wisdom Cards */}
      <div className="space-y-4">
        {filteredWisdom.map(wisdom => (
          <Card key={wisdom.id} className="p-6 border-sage-200 hover:shadow-sm transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getCategoryIcon(wisdom.category)}
                <span className="font-medium text-slate-700 tracking-wide">
                  {wisdom.authorName}
                </span>
                <span className="text-xs text-slate-500 px-2 py-1 bg-slate-100 rounded-full capitalize">
                  {wisdom.category}
                </span>
              </div>
              <span className="text-xs text-slate-500">
                {wisdom.timestamp.toLocaleString()}
              </span>
            </div>

            <p className="text-slate-700 leading-relaxed tracking-wide mb-4 text-sm">
              {wisdom.content}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-pink-600 hover:text-pink-700 hover:bg-pink-50"
                >
                  <Heart size={14} className="mr-1" />
                  {wisdom.supportReactions} Support
                </Button>
              </div>
              
              {wisdom.isAnonymous && (
                <div className="flex items-center space-x-1 text-xs text-slate-500">
                  <Shield size={12} />
                  <span>Anonymous</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredWisdom.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <Star size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg tracking-wide">No wisdom shared yet in this category</p>
          <p className="text-sm mt-2">Be the first to share your insights</p>
        </div>
      )}
    </div>
  );
};

export default WisdomSharing;