'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { 
  Users, 
  Clock, 
  Globe, 
  Lock, 
  Calendar, 
  MessageCircle,
  Video,
  Heart,
  Shield,
  Plus,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface HealingCircle {
  id: string;
  name: string;
  description: string;
  topic: string;
  type: string;
  facilitatorId?: string;
  isActive: boolean;
  currentCapacity: number;
  maxCapacity: number;
  isPublic: boolean;
  meetingSchedule: {
    frequency: string;
    dayOfWeek?: number;
    timeUTC: string;
    duration: number;
  };
  guidelines: string[];
  participants: any[];
  requiredHealingStage?: string;
  nextMeeting?: Date;
}

interface HealingCircleManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onCircleCreated: (circle: HealingCircle) => void;
  userPermissions: {
    canCreateCircles: boolean;
    canFacilitate: boolean;
  };
}

export default function HealingCircleManager({ 
  isOpen, 
  onClose, 
  onCircleCreated, 
  userPermissions 
}: HealingCircleManagerProps) {
  const { user } = useAuth();
  const [mode, setMode] = useState<'browse' | 'create' | 'join'>('browse');
  const [circles, setCircles] = useState<HealingCircle[]>([]);
  const [selectedCircle, setSelectedCircle] = useState<HealingCircle | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Create Circle Form Data
  const [createFormData, setCreateFormData] = useState({
    name: '',
    description: '',
    topic: 'general',
    type: 'peer_led',
    maxCapacity: 8,
    isPublic: true,
    frequency: 'weekly',
    dayOfWeek: 1, // Monday
    timeUTC: '19:00',
    duration: 60,
    guidelines: [] as string[],
    requiredHealingStage: ''
  });

  const topics = [
    { value: 'general', label: 'General Support', description: 'Open support for various healing journeys' },
    { value: 'anxiety', label: 'Anxiety', description: 'Managing anxiety and panic' },
    { value: 'depression', label: 'Depression', description: 'Support for depression and low mood' },
    { value: 'trauma', label: 'Trauma', description: 'Healing from traumatic experiences' },
    { value: 'grief', label: 'Grief & Loss', description: 'Processing loss and bereavement' },
    { value: 'addiction', label: 'Addiction Recovery', description: 'Support for addiction recovery' },
    { value: 'relationships', label: 'Relationships', description: 'Healing in relationships' },
    { value: 'self_care', label: 'Self-Care', description: 'Building healthy self-care practices' },
    { value: 'mindfulness', label: 'Mindfulness', description: 'Meditation and mindfulness practice' },
    { value: 'creativity', label: 'Creative Healing', description: 'Using creativity for healing' }
  ];

  const circleTypes = [
    { value: 'guided', label: 'Guided Circle', description: 'Led by a trained facilitator with structured activities' },
    { value: 'peer_led', label: 'Peer-Led', description: 'Community members take turns facilitating' },
    { value: 'open_sharing', label: 'Open Sharing', description: 'Unstructured sharing and mutual support' },
    { value: 'meditation', label: 'Meditation Circle', description: 'Guided meditation and mindfulness practice' },
    { value: 'journaling', label: 'Group Journaling', description: 'Collective journaling with prompts and sharing' }
  ];

  const daysOfWeek = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  const defaultGuidelines = [
    'Speak from personal experience using "I" statements',
    'Listen without judgment and avoid giving advice unless requested',
    'Maintain confidentiality - what\'s shared here stays here',
    'Be respectful of different perspectives and experiences',
    'Take breaks if you need them - your well-being comes first',
    'Focus on support rather than problem-solving',
    'Honor the anonymous nature of our community'
  ];

  useEffect(() => {
    if (isOpen && mode === 'browse') {
      loadHealingCircles();
    }
  }, [isOpen, mode]);

  const loadHealingCircles = async () => {
    setLoading(true);
    try {
      // Mock data - would call getHealingCircles function
      const mockCircles: HealingCircle[] = [
        {
          id: '1',
          name: 'Evening Anxiety Support',
          description: 'A gentle space for those managing anxiety. We share coping strategies, practice breathing exercises, and support each other through difficult moments.',
          topic: 'anxiety',
          type: 'peer_led',
          isActive: true,
          currentCapacity: 6,
          maxCapacity: 8,
          isPublic: true,
          meetingSchedule: {
            frequency: 'weekly',
            dayOfWeek: 2, // Tuesday
            timeUTC: '20:00',
            duration: 60
          },
          guidelines: defaultGuidelines,
          participants: [],
          nextMeeting: new Date('2024-01-30T20:00:00Z')
        },
        {
          id: '2',
          name: 'Creative Healing Workshop',
          description: 'Express your healing journey through art, writing, and creative activities. No experience necessary - just bring your authentic self.',
          topic: 'creativity',
          type: 'guided',
          facilitatorId: 'facilitator_1',
          isActive: true,
          currentCapacity: 4,
          maxCapacity: 6,
          isPublic: true,
          meetingSchedule: {
            frequency: 'weekly',
            dayOfWeek: 6, // Saturday
            timeUTC: '18:00',
            duration: 90
          },
          guidelines: defaultGuidelines,
          participants: [],
          nextMeeting: new Date('2024-02-03T18:00:00Z')
        }
      ];
      setCircles(mockCircles);
    } catch (error) {
      setError('Failed to load healing circles');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCircle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userPermissions.canCreateCircles) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/community/create-healing-circle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken: await user.getIdToken(),
          circleData: {
            ...createFormData,
            guidelines: createFormData.guidelines.length > 0 ? createFormData.guidelines : defaultGuidelines
          }
        })
      });

      const result = await response.json();

      if (response.ok) {
        onCircleCreated(result.circle);
        setMode('browse');
        // Reset form
        setCreateFormData({
          name: '',
          description: '',
          topic: 'general',
          type: 'peer_led',
          maxCapacity: 8,
          isPublic: true,
          frequency: 'weekly',
          dayOfWeek: 1,
          timeUTC: '19:00',
          duration: 60,
          guidelines: [],
          requiredHealingStage: ''
        });
      } else {
        setError(result.error || 'Failed to create healing circle');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCircle = async (circleId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch('/api/community/join-healing-circle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken: await user.getIdToken(),
          circleId,
          joinData: {
            healingTopics: [selectedCircle?.topic || ''],
            supportGoals: 'Seeking peer support and community connection'
          }
        })
      });

      const result = await response.json();

      if (response.ok) {
        // Update local state
        setCircles(prev => prev.map(circle => 
          circle.id === circleId 
            ? { ...circle, currentCapacity: circle.currentCapacity + 1 }
            : circle
        ));
        setMode('browse');
        setSelectedCircle(null);
      } else {
        setError(result.error || 'Failed to join healing circle');
      }
    } catch (error) {
      setError('Failed to join healing circle');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Healing Circles</h2>
            <p className="text-gray-600 mt-1">Find your community for healing and support</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setMode('browse')}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                mode === 'browse'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Browse Circles
            </button>
            {userPermissions.canCreateCircles && (
              <button
                onClick={() => setMode('create')}
                className={`px-6 py-4 font-medium text-sm transition-colors ${
                  mode === 'create'
                    ? 'border-b-2 border-purple-500 text-purple-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Create Circle
              </button>
            )}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          
          {/* Browse Mode */}
          {mode === 'browse' && (
            <div className="space-y-6">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-100 p-6 rounded-lg animate-pulse">
                      <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : circles.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Healing Circles Yet</h3>
                  <p className="text-gray-600 mb-6">Be the first to create a healing circle for the community</p>
                  {userPermissions.canCreateCircles && (
                    <button
                      onClick={() => setMode('create')}
                      className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Create First Circle
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid gap-6">
                  {circles.map(circle => (
                    <div key={circle.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-purple-300 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{circle.name}</h3>
                          <p className="text-gray-600 mb-3">{circle.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                              {topics.find(t => t.value === circle.topic)?.label}
                            </span>
                            <span className="flex items-center gap-1">
                              {circle.isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                              {circle.isPublic ? 'Public' : 'Private'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {circle.currentCapacity}/{circle.maxCapacity}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {circle.meetingSchedule.frequency}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {daysOfWeek[circle.meetingSchedule.dayOfWeek || 0]} {circle.meetingSchedule.timeUTC}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          {circle.facilitatorId && (
                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm mb-2">
                              <CheckCircle className="w-3 h-3" />
                              Facilitated
                            </span>
                          )}
                          {circle.nextMeeting && (
                            <div className="text-sm text-gray-500">
                              Next: {new Date(circle.nextMeeting).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full" 
                              style={{ width: `${(circle.currentCapacity / circle.maxCapacity) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {Math.round((circle.currentCapacity / circle.maxCapacity) * 100)}% full
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedCircle(circle);
                              setMode('join');
                            }}
                            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                          >
                            View Details
                          </button>
                          {circle.currentCapacity < circle.maxCapacity && (
                            <button
                              onClick={() => handleJoinCircle(circle.id)}
                              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                            >
                              Join Circle
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Join/Details Mode */}
          {mode === 'join' && selectedCircle && (
            <div className="space-y-6">
              <button
                onClick={() => setMode('browse')}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                ← Back to Circles
              </button>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedCircle.name}</h3>
                <p className="text-gray-600 mb-6">{selectedCircle.description}</p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Circle Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Topic:</span>
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                          {topics.find(t => t.value === selectedCircle.topic)?.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Type:</span>
                        <span>{circleTypes.find(t => t.value === selectedCircle.type)?.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Schedule:</span>
                        <span>
                          {selectedCircle.meetingSchedule.frequency} on {daysOfWeek[selectedCircle.meetingSchedule.dayOfWeek || 0]} 
                          at {selectedCircle.meetingSchedule.timeUTC} UTC ({selectedCircle.meetingSchedule.duration} min)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Capacity:</span>
                        <span>{selectedCircle.currentCapacity}/{selectedCircle.maxCapacity} members</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Community Guidelines</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {selectedCircle.guidelines.slice(0, 4).map((guideline, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {guideline}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {selectedCircle.currentCapacity < selectedCircle.maxCapacity ? (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">Ready to Join?</h4>
                    <p className="text-purple-700 text-sm mb-4">
                      By joining this circle, you'll be part of a supportive community committed to healing and growth together.
                    </p>
                    <button
                      onClick={() => handleJoinCircle(selectedCircle.id)}
                      disabled={loading}
                      className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Joining...
                        </>
                      ) : (
                        <>
                          <Heart className="w-4 h-4" />
                          Join This Circle
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-2">Circle Full</h4>
                    <p className="text-yellow-700 text-sm">
                      This circle has reached its capacity. You can join the waitlist or explore other available circles.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Create Mode */}
          {mode === 'create' && userPermissions.canCreateCircles && (
            <form onSubmit={handleCreateCircle} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Circle Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={createFormData.name}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Give your circle a welcoming name..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                    maxLength={100}
                  />
                </div>

                <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Topic *
                  </label>
                  <select
                    id="topic"
                    value={createFormData.topic}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, topic: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  >
                    {topics.map(topic => (
                      <option key={topic.value} value={topic.value}>
                        {topic.label} - {topic.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  value={createFormData.description}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the purpose, tone, and approach of your healing circle..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                  maxLength={500}
                />
                <p className="text-sm text-gray-500 mt-1">{createFormData.description.length}/500</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Circle Type *
                  </label>
                  <select
                    id="type"
                    value={createFormData.type}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  >
                    {circleTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label} - {type.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Members *
                  </label>
                  <select
                    id="maxCapacity"
                    value={createFormData.maxCapacity}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, maxCapacity: Number(e.target.value) }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  >
                    {[6, 8, 10, 12, 15].map(capacity => (
                      <option key={capacity} value={capacity}>
                        {capacity} members
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Frequency *
                  </label>
                  <select
                    id="frequency"
                    value={createFormData.frequency}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, frequency: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700 mb-2">
                    Day of Week
                  </label>
                  <select
                    id="dayOfWeek"
                    value={createFormData.dayOfWeek}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, dayOfWeek: Number(e.target.value) }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    disabled={createFormData.frequency === 'daily'}
                  >
                    {daysOfWeek.map((day, index) => (
                      <option key={index} value={index}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="timeUTC" className="block text-sm font-medium text-gray-700 mb-2">
                    Time (UTC) *
                  </label>
                  <input
                    type="time"
                    id="timeUTC"
                    value={createFormData.timeUTC}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, timeUTC: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={createFormData.isPublic}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
                  Make this circle publicly discoverable
                </label>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setMode('browse')}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4" />
                      Create Circle
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}