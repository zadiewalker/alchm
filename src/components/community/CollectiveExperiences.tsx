'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { 
  Heart, 
  Users, 
  Play, 
  Pause, 
  Calendar, 
  Clock, 
  Star,
  Gift,
  Target,
  Sparkles,
  X,
  Plus,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface CollectiveExperience {
  id: string;
  name: string;
  description: string;
  type: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  participantCount: number;
  facilitatorId?: string;
  prompts: CollectivePrompt[];
  currentDay?: number;
  totalDays?: number;
}

interface CollectivePrompt {
  id: string;
  dayNumber?: number;
  prompt: string;
  type: string;
  responses: AnonymousResponse[];
  scheduledFor?: Date;
}

interface AnonymousResponse {
  participantAnonymousId: string;
  response: string;
  submittedAt: Date;
  isPublic: boolean;
}

interface CollectiveExperiencesProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CollectiveExperiences({ isOpen, onClose }: CollectiveExperiencesProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'current' | 'upcoming' | 'create'>('current');
  const [experiences, setExperiences] = useState<CollectiveExperience[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<CollectiveExperience | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userParticipation, setUserParticipation] = useState<{ [key: string]: boolean }>({});

  // Create form data
  const [createFormData, setCreateFormData] = useState({
    name: '',
    description: '',
    type: 'healing_challenge',
    duration: 7,
    prompts: [] as { prompt: string; type: string; dayNumber?: number }[]
  });

  const experienceTypes = [
    { 
      value: 'meditation', 
      label: 'Meditation Journey', 
      description: 'Synchronized meditation sessions with the community',
      icon: '🧘‍♀️',
      duration: [1, 7, 21]
    },
    { 
      value: 'intention_setting', 
      label: 'Intention Setting', 
      description: 'Collective goal-setting and manifestation practice',
      icon: '🎯',
      duration: [1, 3, 7]
    },
    { 
      value: 'gratitude_circle', 
      label: 'Gratitude Circle', 
      description: 'Daily gratitude sharing and appreciation practice',
      icon: '🙏',
      duration: [7, 14, 21, 30]
    },
    { 
      value: 'healing_challenge', 
      label: 'Healing Challenge', 
      description: 'Structured activities for personal growth and healing',
      icon: '💪',
      duration: [7, 14, 21, 30]
    },
    { 
      value: 'milestone_celebration', 
      label: 'Milestone Celebration', 
      description: 'Celebrating community achievements and progress',
      icon: '🎉',
      duration: [1, 3]
    }
  ];

  const promptTypes = [
    { value: 'reflection', label: 'Reflection', description: 'Deep thinking and self-discovery prompts' },
    { value: 'action', label: 'Action', description: 'Practical activities to practice' },
    { value: 'meditation_focus', label: 'Meditation Focus', description: 'Themes for meditation practice' },
    { value: 'gratitude', label: 'Gratitude', description: 'Appreciation and thankfulness prompts' },
    { value: 'intention', label: 'Intention', description: 'Goal-setting and manifestation prompts' }
  ];

  useEffect(() => {
    if (isOpen) {
      loadCollectiveExperiences();
    }
  }, [isOpen]);

  const loadCollectiveExperiences = async () => {
    setLoading(true);
    try {
      // Mock data - would call actual API
      const mockExperiences: CollectiveExperience[] = [
        {
          id: '1',
          name: '7 Days of Self-Compassion',
          description: 'A week-long journey to develop a kinder, more understanding relationship with yourself through daily reflections and practices.',
          type: 'healing_challenge',
          startDate: new Date('2024-01-22'),
          endDate: new Date('2024-01-28'),
          isActive: true,
          participantCount: 156,
          currentDay: 4,
          totalDays: 7,
          prompts: [
            {
              id: 'p1',
              dayNumber: 1,
              prompt: 'Write yourself a letter of compassion for a recent mistake or difficult moment. What would you tell a dear friend in the same situation?',
              type: 'reflection',
              responses: [],
              scheduledFor: new Date('2024-01-22')
            },
            {
              id: 'p2',
              dayNumber: 4,
              prompt: 'Today, practice the self-compassion break: acknowledge your pain, remember that suffering is part of the human experience, and offer yourself kindness.',
              type: 'action',
              responses: [],
              scheduledFor: new Date('2024-01-25')
            }
          ]
        },
        {
          id: '2',
          name: 'Community Gratitude Circle',
          description: 'Join our ongoing gratitude practice where we share three things we\'re grateful for each day, creating a ripple effect of appreciation throughout our healing community.',
          type: 'gratitude_circle',
          startDate: new Date('2024-01-01'),
          isActive: true,
          participantCount: 89,
          prompts: [
            {
              id: 'p3',
              prompt: 'What three things brought you joy or peace today, no matter how small?',
              type: 'gratitude',
              responses: [
                {
                  participantAnonymousId: 'grateful_heart_2x9k',
                  response: 'Morning sunlight through my window, a text from a friend checking on me, and the taste of my favorite tea.',
                  submittedAt: new Date('2024-01-25'),
                  isPublic: true
                },
                {
                  participantAnonymousId: 'peaceful_soul_7m4n',
                  response: 'My cat purring on my lap, finishing a difficult task, and realizing I felt genuinely happy for a few moments.',
                  submittedAt: new Date('2024-01-25'),
                  isPublic: true
                }
              ]
            }
          ]
        },
        {
          id: '3',
          name: 'New Moon Intention Setting',
          description: 'Harness the energy of the new moon to set powerful intentions for your healing journey. We\'ll create intentions together and support each other in manifesting positive change.',
          type: 'intention_setting',
          startDate: new Date('2024-02-09'),
          endDate: new Date('2024-02-11'),
          isActive: false,
          participantCount: 0,
          prompts: []
        }
      ];

      setExperiences(mockExperiences);
      
      // Mock user participation
      setUserParticipation({
        '1': true,
        '2': false,
        '3': false
      });

    } catch (error) {
      setError('Failed to load collective experiences');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinExperience = async (experienceId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch('/api/community/join-collective-experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken: await user.getIdToken(),
          experienceId
        })
      });

      const result = await response.json();

      if (response.ok) {
        setUserParticipation(prev => ({ ...prev, [experienceId]: true }));
        setExperiences(prev => prev.map(exp => 
          exp.id === experienceId 
            ? { ...exp, participantCount: exp.participantCount + 1 }
            : exp
        ));
      } else {
        setError(result.error || 'Failed to join experience');
      }
    } catch (error) {
      setError('Failed to join collective experience');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + createFormData.duration);

      const response = await fetch('/api/community/create-collective-experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken: await user.getIdToken(),
          experienceData: {
            ...createFormData,
            startDate: new Date(),
            endDate: createFormData.duration > 1 ? endDate : undefined
          }
        })
      });

      const result = await response.json();

      if (response.ok) {
        setActiveTab('current');
        loadCollectiveExperiences();
        // Reset form
        setCreateFormData({
          name: '',
          description: '',
          type: 'healing_challenge',
          duration: 7,
          prompts: []
        });
      } else {
        setError(result.error || 'Failed to create collective experience');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addPrompt = () => {
    if (createFormData.prompts.length < createFormData.duration) {
      setCreateFormData(prev => ({
        ...prev,
        prompts: [...prev.prompts, {
          prompt: '',
          type: 'reflection',
          dayNumber: prev.prompts.length + 1
        }]
      }));
    }
  };

  const updatePrompt = (index: number, field: string, value: string) => {
    setCreateFormData(prev => ({
      ...prev,
      prompts: prev.prompts.map((prompt, i) => 
        i === index ? { ...prompt, [field]: value } : prompt
      )
    }));
  };

  const removePrompt = (index: number) => {
    setCreateFormData(prev => ({
      ...prev,
      prompts: prev.prompts.filter((_, i) => i !== index).map((prompt, i) => ({
        ...prompt,
        dayNumber: i + 1
      }))
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Collective Healing Experiences</h2>
            <p className="text-gray-600 mt-1">Join synchronized healing activities with the community</p>
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
              onClick={() => setActiveTab('current')}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === 'current'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Play className="w-4 h-4 inline mr-2" />
              Active Experiences
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === 'upcoming'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                activeTab === 'create'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Create Experience
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          
          {/* Active Experiences */}
          {activeTab === 'current' && (
            <div className="space-y-6">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
                      <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : experiences.filter(exp => exp.isActive).length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Experiences</h3>
                  <p className="text-gray-600 mb-6">Create the first collective healing experience for the community</p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Create Experience
                  </button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {experiences.filter(exp => exp.isActive).map(experience => (
                    <div key={experience.id} className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                      
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">
                              {experienceTypes.find(t => t.value === experience.type)?.icon}
                            </span>
                            <h3 className="text-xl font-bold text-gray-900">{experience.name}</h3>
                            {userParticipation[experience.id] && (
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Joined
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 mb-4">{experience.description}</p>
                          
                          <div className="flex items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {experience.participantCount} participants
                            </div>
                            {experience.currentDay && experience.totalDays && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Day {experience.currentDay} of {experience.totalDays}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Started {new Date(experience.startDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          {!userParticipation[experience.id] ? (
                            <button
                              onClick={() => handleJoinExperience(experience.id)}
                              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                            >
                              Join Experience
                            </button>
                          ) : (
                            <button
                              onClick={() => setSelectedExperience(experience)}
                              className="bg-white text-purple-600 border border-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors"
                            >
                              View Details
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar for Multi-day Experiences */}
                      {experience.currentDay && experience.totalDays && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Progress</span>
                            <span>{Math.round((experience.currentDay / experience.totalDays) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(experience.currentDay / experience.totalDays) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Recent Community Responses */}
                      {experience.prompts.some(p => p.responses.length > 0) && (
                        <div className="bg-white rounded-lg p-4 mt-4">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-500" />
                            Recent Community Sharing
                          </h4>
                          <div className="space-y-3">
                            {experience.prompts
                              .flatMap(p => p.responses)
                              .filter(r => r.isPublic)
                              .slice(0, 2)
                              .map((response, index) => (
                                <div key={index} className="border-l-3 border-purple-300 pl-3">
                                  <p className="text-gray-700 italic">"{response.response}"</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    — {response.participantAnonymousId}
                                  </p>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Upcoming Experiences */}
          {activeTab === 'upcoming' && (
            <div className="space-y-6">
              {experiences.filter(exp => !exp.isActive && new Date(exp.startDate) > new Date()).length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Upcoming Experiences</h3>
                  <p className="text-gray-600 mb-6">Check back later or create a new experience</p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Create Experience
                  </button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {experiences
                    .filter(exp => !exp.isActive && new Date(exp.startDate) > new Date())
                    .map(experience => (
                      <div key={experience.id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl">
                                {experienceTypes.find(t => t.value === experience.type)?.icon}
                              </span>
                              <h3 className="text-lg font-semibold text-gray-900">{experience.name}</h3>
                            </div>
                            <p className="text-gray-600 mb-3">{experience.description}</p>
                            <div className="text-sm text-gray-500">
                              Starts: {new Date(experience.startDate).toLocaleDateString()}
                            </div>
                          </div>
                          <button
                            onClick={() => handleJoinExperience(experience.id)}
                            className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors"
                          >
                            Join When Ready
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Create Experience */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreateExperience} className="space-y-6 max-w-2xl">
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={createFormData.name}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Give your collective experience an inspiring name..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                  maxLength={100}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Type *
                  </label>
                  <select
                    id="type"
                    value={createFormData.type}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  >
                    {experienceTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (Days) *
                  </label>
                  <select
                    id="duration"
                    value={createFormData.duration}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  >
                    {experienceTypes
                      .find(t => t.value === createFormData.type)?.duration
                      .map(days => (
                        <option key={days} value={days}>
                          {days} {days === 1 ? 'day' : 'days'}
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
                  placeholder="Describe the purpose, benefits, and approach of your collective experience..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                  maxLength={500}
                />
              </div>

              {/* Daily Prompts */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Daily Prompts</h3>
                  <button
                    type="button"
                    onClick={addPrompt}
                    disabled={createFormData.prompts.length >= createFormData.duration}
                    className="bg-purple-100 text-purple-700 px-3 py-1 rounded text-sm hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Prompt
                  </button>
                </div>

                <div className="space-y-4">
                  {createFormData.prompts.map((prompt, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-900">Day {prompt.dayNumber}</h4>
                        <button
                          type="button"
                          onClick={() => removePrompt(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <select
                            value={prompt.type}
                            onChange={(e) => updatePrompt(index, 'type', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                          >
                            {promptTypes.map(type => (
                              <option key={type.value} value={type.value}>
                                {type.label} - {type.description}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <textarea
                            value={prompt.prompt}
                            onChange={(e) => updatePrompt(index, 'prompt', e.target.value)}
                            placeholder="Enter the prompt or activity for this day..."
                            rows={3}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                            maxLength={300}
                          />
                          <p className="text-xs text-gray-500 mt-1">{prompt.prompt.length}/300</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {createFormData.prompts.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <Target className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">Add prompts to guide participants through the experience</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('current')}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !createFormData.name || !createFormData.description}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Create Experience
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