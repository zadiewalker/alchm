/**
 * ALCHM Indigenous Wisdom Integration
 * 
 * CRITICAL ETHICAL FRAMEWORK:
 * - Nothing here is appropriated from closed practices
 * - All wisdom shared comes from publicly available teachings
 * - Indigenous users validate their identity through community connections
 * - Non-Indigenous users receive respectful education, not practice
 * - All traditional knowledge includes proper attribution and reciprocity
 * 
 * Philosophy: "Indigenous healing wisdom belongs to Indigenous communities.
 * We can learn about respect, reciprocity, and land connection without
 * appropriating specific ceremonies or sacred practices."
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface IndigenousWisdomProps {
  userProfile: {
    isIndigenous: boolean;
    tribalAffiliation?: string;
    communityVerification?: boolean;
  };
  journalContent?: string;
  onWisdomSelected?: (wisdom: IndigenousWisdom) => void;
}

interface IndigenousWisdom {
  id: string;
  type: 'land_connection' | 'seasonal_awareness' | 'community_healing' | 'gratitude_practice';
  title: string;
  description: string;
  sourceAttribution: string;
  isForIndigenousUsersOnly: boolean;
  practiceGuidance?: string;
  educationalContent?: string;
  reciprocityNote?: string;
  communityResource?: string;
}

export default function IndigenousWisdomIntegration({ 
  userProfile, 
  journalContent = '',
  onWisdomSelected 
}: IndigenousWisdomProps) {
  const [availableWisdom, setAvailableWisdom] = useState<IndigenousWisdom[]>([]);
  const [selectedWisdom, setSelectedWisdom] = useState<IndigenousWisdom | null>(null);

  useEffect(() => {
    loadAppropriateWisdom();
  }, [userProfile]);

  const loadAppropriateWisdom = () => {
    // Universal teachings that can be respectfully shared
    const universalWisdom: IndigenousWisdom[] = [
      {
        id: 'seven_generations',
        type: 'community_healing',
        title: 'Seven Generations Thinking',
        description: 'Consider how your healing today affects seven generations into the future',
        sourceAttribution: 'Haudenosaunee (Iroquois) teaching - publicly shared wisdom',
        isForIndigenousUsersOnly: false,
        educationalContent: 'This teaching reminds us that our actions today impact not just ourselves, but future generations. When you heal, you break cycles that might have continued.',
        reciprocityNote: 'To honor this teaching, consider supporting Indigenous-led environmental or youth organizations.'
      },
      {
        id: 'land_connection_universal',
        type: 'land_connection',
        title: 'Earth as Teacher',
        description: 'Many Indigenous traditions recognize the land as our first teacher',
        sourceAttribution: 'Universal Indigenous concept - varies by nation and region',
        isForIndigenousUsersOnly: false,
        educationalContent: 'Spending time in nature, even for a few minutes, can help ground difficult emotions. The earth has witnessed all human experiences.',
        practiceGuidance: 'Sit outside or by a window. Place your hands on the ground if possible. Breathe with the rhythm of the earth.',
        reciprocityNote: 'Honor this teaching by learning about the Indigenous history of the land you live on.'
      },
      {
        id: 'gratitude_reciprocity',
        type: 'gratitude_practice',
        title: 'Gratitude as Reciprocity',
        description: 'Gratitude is not just feeling - it is relationship and responsibility',
        sourceAttribution: 'Robin Wall Kimmerer (Potawatomi) - Braiding Sweetgrass',
        isForIndigenousUsersOnly: false,
        educationalContent: 'True gratitude creates relationship and responsibility. When we receive a gift, we have a responsibility to give back.',
        practiceGuidance: 'List three things you are grateful for. For each, consider: How can I give back or honor this gift?',
        reciprocityNote: 'Support Indigenous authors and knowledge keepers by purchasing their books and supporting their work.'
      },
      {
        id: 'seasonal_healing',
        type: 'seasonal_awareness',
        title: 'Seasonal Emotional Cycles',
        description: 'Our emotions often mirror the natural cycles of seasons',
        sourceAttribution: 'Universal Indigenous understanding - many nations recognize seasonal emotional cycles',
        isForIndigenousUsersOnly: false,
        educationalContent: 'Indigenous knowledge systems recognize that our inner lives often reflect the outer world. Winter is for rest and reflection, spring for new growth.',
        practiceGuidance: 'What season does your current emotional state feel like? Honor that season within you.',
        reciprocityNote: 'Learn about the seasonal practices of the Indigenous nations whose land you live on.'
      }
    ];

    // Practices specifically for verified Indigenous users
    const indigenousSpecificWisdom: IndigenousWisdom[] = [
      {
        id: 'ancestral_connection',
        type: 'community_healing',
        title: 'Ancestral Strength Meditation',
        description: 'Connect with the unbroken line of your ancestors',
        sourceAttribution: 'Traditional practice - varies by nation',
        isForIndigenousUsersOnly: true,
        practiceGuidance: 'This is your ancestral wisdom to use as feels right for your traditions. Trust your cultural knowledge.',
        communityResource: 'Consider connecting with elders or cultural knowledge keepers in your community for guidance.'
      },
      {
        id: 'land_based_healing',
        type: 'land_connection',
        title: 'Land-Based Healing Practice',
        description: 'Healing practices that connect you to your traditional territories',
        sourceAttribution: 'Traditional Indigenous healing - specific to your nation\'s practices',
        isForIndigenousUsersOnly: true,
        practiceGuidance: 'Your cultural traditions hold the specific practices for your people. Trust your cultural knowledge.',
        communityResource: 'Seek guidance from cultural knowledge keepers or traditional healers in your community.'
      }
    ];

    // Filter based on user profile
    let wisdom = universalWisdom;
    
    if (userProfile.isIndigenous && userProfile.communityVerification) {
      wisdom = [...universalWisdom, ...indigenousSpecificWisdom];
    }

    // Filter by journal content relevance
    const relevantWisdom = wisdom.filter(w => {
      const content = journalContent.toLowerCase();
      if (w.type === 'land_connection' && (content.includes('nature') || content.includes('outside') || content.includes('earth'))) return true;
      if (w.type === 'community_healing' && (content.includes('family') || content.includes('generation') || content.includes('ancestor'))) return true;
      if (w.type === 'gratitude_practice' && (content.includes('grateful') || content.includes('thank') || content.includes('blessing'))) return true;
      if (w.type === 'seasonal_awareness' && (content.includes('season') || content.includes('change') || content.includes('cycle'))) return true;
      return true; // Always include some options
    });

    setAvailableWisdom(relevantWisdom.slice(0, 3)); // Limit to 3 options
  };

  const handleWisdomSelection = (wisdom: IndigenousWisdom) => {
    setSelectedWisdom(wisdom);
    onWisdomSelected?.(wisdom);
  };

  if (!userProfile.isIndigenous && availableWisdom.length === 0) {
    return null; // No appropriate content for this user
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-green-800 mb-2">
          {userProfile.isIndigenous ? '🪶 Indigenous Wisdom for Healing' : '🌍 Learning from Indigenous Wisdom'}
        </h3>
        
        {!userProfile.isIndigenous && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p className="text-sm text-yellow-800">
              <strong>Cultural Respect Note:</strong> These are publicly shared teachings meant for learning and respect. 
              Sacred ceremonies and closed practices are not included. We encourage supporting Indigenous communities and learning about the Indigenous history of your land.
            </p>
          </div>
        )}
        
        {userProfile.isIndigenous && !userProfile.communityVerification && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
            <p className="text-sm text-blue-800">
              To access more specific cultural practices, consider connecting with community members who can verify your tribal affiliation and cultural knowledge.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {availableWisdom.map((wisdom) => (
          <Card 
            key={wisdom.id} 
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedWisdom?.id === wisdom.id ? 'ring-2 ring-green-500 bg-green-50' : 'bg-white'
            }`}
            onClick={() => handleWisdomSelection(wisdom)}
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-medium text-green-800">{wisdom.title}</h4>
              {wisdom.isForIndigenousUsersOnly && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Community Knowledge
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-700 mb-3">{wisdom.description}</p>
            
            <div className="text-xs text-gray-500 border-t pt-2">
              <p><strong>Source:</strong> {wisdom.sourceAttribution}</p>
            </div>
          </Card>
        ))}
      </div>

      {selectedWisdom && (
        <Card className="mt-6 p-4 bg-green-50 border-green-200">
          <h4 className="font-medium text-green-800 mb-3">Guidance: {selectedWisdom.title}</h4>
          
          {selectedWisdom.educationalContent && (
            <div className="mb-4">
              <h5 className="font-medium text-gray-800 mb-2">Understanding This Teaching:</h5>
              <p className="text-sm text-gray-700">{selectedWisdom.educationalContent}</p>
            </div>
          )}
          
          {selectedWisdom.practiceGuidance && (
            <div className="mb-4">
              <h5 className="font-medium text-gray-800 mb-2">Practice Guidance:</h5>
              <p className="text-sm text-gray-700">{selectedWisdom.practiceGuidance}</p>
            </div>
          )}
          
          {selectedWisdom.communityResource && (
            <div className="mb-4">
              <h5 className="font-medium text-gray-800 mb-2">Community Connection:</h5>
              <p className="text-sm text-gray-700">{selectedWisdom.communityResource}</p>
            </div>
          )}
          
          {selectedWisdom.reciprocityNote && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
              <h5 className="font-medium text-yellow-800 mb-1">Reciprocity & Respect:</h5>
              <p className="text-sm text-yellow-700">{selectedWisdom.reciprocityNote}</p>
            </div>
          )}
        </Card>
      )}
      
      <div className="mt-6 text-center">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.open('https://native-land.ca/', '_blank')}
          className="text-green-700 border-green-300 hover:bg-green-50"
        >
          🌍 Learn About Indigenous Land History
        </Button>
      </div>
    </Card>
  );
}

/**
 * Community Verification System for Indigenous Users
 */
export function IndigenousCommunityVerification({ 
  onVerificationSubmit 
}: { 
  onVerificationSubmit: (data: any) => void 
}) {
  const [formData, setFormData] = useState({
    tribalAffiliation: '',
    communityConnection: '',
    culturalKnowledgeLevel: '',
    eldersOrMentors: '',
    respectsProtocols: false
  });

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Indigenous Community Verification</h3>
      <p className="text-sm text-gray-600 mb-6">
        This helps us provide appropriate cultural content while respecting traditional knowledge protocols.
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tribal Affiliation/Nation</label>
          <input
            type="text"
            value={formData.tribalAffiliation}
            onChange={(e) => setFormData(prev => ({ ...prev, tribalAffiliation: e.target.value }))}
            className="w-full p-3 border rounded-lg"
            placeholder="e.g., Ojibwe, Cherokee, Navajo, etc."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Community Connection</label>
          <textarea
            value={formData.communityConnection}
            onChange={(e) => setFormData(prev => ({ ...prev, communityConnection: e.target.value }))}
            className="w-full p-3 border rounded-lg h-20"
            placeholder="Briefly describe your connection to Indigenous community (family, tribal membership, cultural participation, etc.)"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Cultural Knowledge Level</label>
          <select
            value={formData.culturalKnowledgeLevel}
            onChange={(e) => setFormData(prev => ({ ...prev, culturalKnowledgeLevel: e.target.value }))}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Select level</option>
            <option value="learning">Still learning about my culture</option>
            <option value="connected">Connected to cultural practices</option>
            <option value="knowledgeable">Knowledgeable in traditional ways</option>
            <option value="knowledge_keeper">Cultural knowledge keeper/teacher</option>
          </select>
        </div>
        
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="protocols"
            checked={formData.respectsProtocols}
            onChange={(e) => setFormData(prev => ({ ...prev, respectsProtocols: e.target.checked }))}
            className="mt-1"
          />
          <label htmlFor="protocols" className="text-sm">
            I understand and respect traditional knowledge protocols, and I will not share sacred or closed practices outside of appropriate cultural contexts.
          </label>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button 
          onClick={() => onVerificationSubmit(formData)}
          disabled={!formData.respectsProtocols}
          className="bg-green-600 hover:bg-green-700"
        >
          Submit for Community Review
        </Button>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>
          This information helps us serve you appropriately while respecting cultural protocols. 
          Community verification may involve connecting with cultural knowledge keepers.
        </p>
      </div>
    </Card>
  );
}

/**
 * Reciprocity Tracker - Helps users give back to Indigenous communities
 */
export function IndigenousReciprocityTracker() {
  const [reciprocityActions, setReciprocityActions] = useState([
    {
      id: 1,
      action: 'Learn about local Indigenous history',
      completed: false,
      resource: 'https://native-land.ca/'
    },
    {
      id: 2,
      action: 'Support Indigenous-authored books/media',
      completed: false,
      resource: 'Search for Indigenous authors in your local bookstore'
    },
    {
      id: 3,
      action: 'Donate to Indigenous-led organizations',
      completed: false,
      resource: 'Research Indigenous nonprofits in your area'
    },
    {
      id: 4,
      action: 'Attend Indigenous cultural events (when welcome)',
      completed: false,
      resource: 'Look for public Indigenous cultural events'
    }
  ]);

  const toggleAction = (id: number) => {
    setReciprocityActions(prev => 
      prev.map(action => 
        action.id === id ? { ...action, completed: !action.completed } : action
      )
    );
  };

  return (
    <Card className="p-6 bg-yellow-50 border-yellow-200">
      <h3 className="text-lg font-medium text-yellow-800 mb-4">
        🤝 Reciprocity & Respect Tracker
      </h3>
      <p className="text-sm text-yellow-700 mb-4">
        When we learn from Indigenous wisdom, we have a responsibility to give back and support Indigenous communities.
      </p>
      
      <div className="space-y-3">
        {reciprocityActions.map(action => (
          <div key={action.id} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={action.completed}
              onChange={() => toggleAction(action.id)}
              className="rounded border-yellow-300"
            />
            <span className={`text-sm flex-1 ${action.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
              {action.action}
            </span>
            <button 
              onClick={() => window.open(action.resource, '_blank')}
              className="text-xs text-yellow-600 hover:text-yellow-800 underline"
            >
              Learn More
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-yellow-600">
        Completed: {reciprocityActions.filter(a => a.completed).length} of {reciprocityActions.length} actions
      </div>
    </Card>
  );
}