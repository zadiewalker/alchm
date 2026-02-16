'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useData } from '@/hooks/useData';
import { safeWindow } from '@/utils/browser';
import { transformationEngine, DailyPrompt, UserProgress, CompletedChallenge, Achievement } from '@/lib/transformationEngine';
import { getStorageItemWithFallback, setStorageItemNormalized } from '@/lib/storageKeys';

export default function DailyTransformation() {
  const { user } = useAuth();
  const { getJournalEntries, isInitialized } = useData();
  const [dailyPrompt, setDailyPrompt] = useState<DailyPrompt | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [challengeComplete, setChallengeComplete] = useState(false);
  const [completionData, setCompletionData] = useState({
    rating: 5,
    reflection: '',
    insights: [] as string[],
    emotionalStateBefore: 5,
    emotionalStateAfter: 5,
    duration: 0
  });
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentMood, setCurrentMood] = useState<number>(5);
  const [showProgress, setShowProgress] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (isInitialized) {
      loadDailyTransformation();
    }
  }, [isInitialized]);

  const loadDailyTransformation = async () => {
    try {
      setIsLoading(true);
      
      // Load user progress
      const progress = await loadUserProgress();
      setUserProgress(progress);
      
      // Check if already completed today
      const today = new Date().toISOString().split('T')[0];
      const alreadyCompleted = progress.challengeHistory.some(
        challenge => challenge.completedAt.toDateString() === new Date().toDateString()
      );
      
      if (alreadyCompleted) {
        setChallengeComplete(true);
        setIsLoading(false);
        return;
      }
      
      // Generate daily prompt
      const journalEntries = await getJournalEntries(10);
      const mood = getCurrentMood();
      setCurrentMood(mood);
      
      // Check for recent crisis level (from localStorage)
      const recentCrisisLevel = getStorageItemWithFallback('recent_crisis_level');
      
      const prompt = transformationEngine.generateDailyPrompt(
        journalEntries,
        progress,
        mood,
        recentCrisisLevel || undefined
      );
      
      setDailyPrompt(prompt);
    } catch (error) {
      console.error('Error loading daily transformation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProgress = async (): Promise<UserProgress> => {
    const storedProgress = getStorageItemWithFallback('transformation_progress');
    
    if (storedProgress) {
      const progress = JSON.parse(storedProgress);
      return {
        ...progress,
        lastCompletedDate: progress.lastCompletedDate ? new Date(progress.lastCompletedDate) : null,
        challengeHistory: progress.challengeHistory.map((c: any) => ({
          ...c,
          completedAt: new Date(c.completedAt)
        })),
        achievements: progress.achievements.map((a: any) => ({
          ...a,
          unlockedAt: new Date(a.unlockedAt)
        }))
      };
    }
    
    // Initialize new user progress
    const newProgress: UserProgress = {
      id: user?.uid || 'anonymous',
      userId: user?.uid || 'anonymous',
      currentStreak: 0,
      longestStreak: 0,
      totalChallengesCompleted: 0,
      categoriesExplored: [],
      preferredDifficulty: 'moderate',
      averageCompletionTime: 15,
      lastCompletedDate: null,
      achievements: [],
      personalGrowthGoals: [],
      challengeHistory: []
    };
    
    saveUserProgress(newProgress);
    return newProgress;
  };

  const saveUserProgress = (progress: UserProgress) => {
    setStorageItemNormalized('transformation_progress', JSON.stringify(progress));
    setUserProgress(progress);
  };

  const getCurrentMood = (): number => {
    // Check recent mood from journal entries or default assessment
    const recentMood = getStorageItemWithFallback('current_mood');
    if (recentMood) {
      const mood = parseInt(recentMood);
      return isNaN(mood) ? 5 : Math.max(1, Math.min(10, mood));
    }
    
    // Default to neutral if no recent data
    return 5;
  };

  const startChallenge = () => {
    setChallengeStarted(true);
    setStartTime(new Date());
    setCompletionData(prev => ({ ...prev, emotionalStateBefore: currentMood }));
  };

  const completeChallenge = () => {
    if (!dailyPrompt || !userProgress || !startTime) return;
    
    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000); // minutes
    
    const completion: CompletedChallenge = {
      challengeId: dailyPrompt.challenge.id,
      completedAt: new Date(),
      duration,
      rating: completionData.rating,
      reflection: completionData.reflection,
      insights: completionData.insights,
      wouldRecommend: completionData.rating >= 4,
      emotionalStateBefore: completionData.emotionalStateBefore,
      emotionalStateAfter: completionData.emotionalStateAfter
    };
    
    // Update progress
    const updatedProgress = updateProgressWithCompletion(userProgress, completion);
    
    // Check for new achievements
    const achievements = checkForNewAchievements(userProgress, updatedProgress);
    setNewAchievements(achievements);
    
    saveUserProgress(updatedProgress);
    setChallengeComplete(true);
    
    // Store completion for crisis monitoring
    setStorageItemNormalized('current_mood', completionData.emotionalStateAfter.toString());
    setStorageItemNormalized('last_transformation_completion', new Date().toISOString());
  };

  const updateProgressWithCompletion = (progress: UserProgress, completion: CompletedChallenge): UserProgress => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Calculate streak
    let newStreak = 1;
    if (progress.lastCompletedDate) {
      const lastDate = new Date(progress.lastCompletedDate);
      if (lastDate.toDateString() === yesterday.toDateString()) {
        newStreak = progress.currentStreak + 1;
      } else if (lastDate.toDateString() === today.toDateString()) {
        newStreak = progress.currentStreak; // Already completed today
      }
    }
    
    // Update categories explored
    const challenge = transformationEngine.getChallengeById(completion.challengeId);
    const newCategories = [...new Set([...progress.categoriesExplored, ...(challenge?.tags || [])])];
    
    // Update average completion time
    const totalTime = (progress.averageCompletionTime * progress.totalChallengesCompleted) + completion.duration;
    const newAverageTime = totalTime / (progress.totalChallengesCompleted + 1);
    
    return {
      ...progress,
      currentStreak: newStreak,
      longestStreak: Math.max(progress.longestStreak, newStreak),
      totalChallengesCompleted: progress.totalChallengesCompleted + 1,
      categoriesExplored: newCategories,
      averageCompletionTime: Math.round(newAverageTime),
      lastCompletedDate: today,
      challengeHistory: [completion, ...progress.challengeHistory.slice(0, 49)] // Keep last 50
    };
  };

  const checkForNewAchievements = (oldProgress: UserProgress, newProgress: UserProgress): Achievement[] => {
    const achievements: Achievement[] = [];
    const existingAchievementIds = oldProgress.achievements.map(a => a.id);
    
    // First completion
    if (newProgress.totalChallengesCompleted === 1) {
      achievements.push({
        id: 'first_step',
        name: 'First Step',
        description: 'Completed your first daily transformation challenge',
        icon: '🌱',
        unlockedAt: new Date(),
        category: 'Milestone',
        milestone: 1
      });
    }
    
    // Streak achievements
    if (newProgress.currentStreak === 7 && !existingAchievementIds.includes('week_warrior')) {
      achievements.push({
        id: 'week_warrior',
        name: 'Week Warrior',
        description: 'Maintained a 7-day transformation streak',
        icon: '🔥',
        unlockedAt: new Date(),
        category: 'Streak',
        milestone: 7
      });
    }
    
    if (newProgress.currentStreak === 30 && !existingAchievementIds.includes('transformation_titan')) {
      achievements.push({
        id: 'transformation_titan',
        name: 'Transformation Titan',
        description: 'Incredible 30-day streak of daily growth',
        icon: '👑',
        unlockedAt: new Date(),
        category: 'Streak',
        milestone: 30
      });
    }
    
    // Category exploration
    if (newProgress.categoriesExplored.length >= 10 && !existingAchievementIds.includes('explorer')) {
      achievements.push({
        id: 'explorer',
        name: 'Growth Explorer',
        description: 'Explored 10 different areas of transformation',
        icon: '🗺️',
        unlockedAt: new Date(),
        category: 'Exploration',
        milestone: 10
      });
    }
    
    // Completion milestones
    const milestones = [10, 25, 50, 100];
    milestones.forEach(milestone => {
      if (newProgress.totalChallengesCompleted >= milestone && 
          oldProgress.totalChallengesCompleted < milestone) {
        achievements.push({
          id: `completion_${milestone}`,
          name: `${milestone} Challenge Club`,
          description: `Completed ${milestone} transformation challenges`,
          icon: milestone >= 100 ? '💎' : milestone >= 50 ? '🏆' : '⭐',
          unlockedAt: new Date(),
          category: 'Completion',
          milestone
        });
      }
    });
    
    return achievements;
  };

  const addInsight = () => {
    const insight = prompt('What insight did you gain from this challenge?');
    if (insight && insight.trim()) {
      setCompletionData(prev => ({
        ...prev,
        insights: [...prev.insights, insight.trim()]
      }));
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'gentle': return 'text-green-400';
      case 'moderate': return 'text-blue-400';
      case 'deep': return 'text-purple-400';
      case 'intensive': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryIcon = (type: string) => {
    const icons = {
      mindfulness: '🧘',
      gratitude: '🙏',
      shadow_work: '🌓',
      connection: '🤝',
      creativity: '🎨',
      reflection: '💭',
      action: '⚡'
    };
    return icons[type as keyof typeof icons] || '✨';
  };

  if (isLoading) {
    return (
      <div className="daily-transformation max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60 text-sm">Personalizing your daily transformation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="daily-transformation max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">🌟</div>
        <h2 className="text-2xl text-white font-light mb-3">Daily Transformation</h2>
        <p className="text-white/70 text-sm">
          Personalized growth challenges adapted to your journey
        </p>
      </div>

      {/* Progress Overview */}
      {userProgress && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white text-lg font-light">Your Growth Journey</h3>
            <button
              onClick={() => setShowProgress(!showProgress)}
              className="text-white/60 hover:text-white transition-colors"
            >
              {showProgress ? '−' : '+'}
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl text-orange-400 font-light">{userProgress.currentStreak}</div>
              <div className="text-white/60 text-sm">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-blue-400 font-light">{userProgress.totalChallengesCompleted}</div>
              <div className="text-white/60 text-sm">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-green-400 font-light">{userProgress.longestStreak}</div>
              <div className="text-white/60 text-sm">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-purple-400 font-light">{userProgress.categoriesExplored.length}</div>
              <div className="text-white/60 text-sm">Areas Explored</div>
            </div>
          </div>

          {/* Streak Visualization */}
          <div className="flex items-center gap-2 justify-center">
            {Array.from({ length: Math.min(userProgress.currentStreak, 14) }, (_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-orange-500 rounded-full"
                title={`Day ${i + 1}`}
              />
            ))}
            {userProgress.currentStreak > 14 && (
              <span className="text-orange-400 text-sm ml-2">+{userProgress.currentStreak - 14}</span>
            )}
          </div>

          {showProgress && (
            <div className="mt-6 pt-6 border-t border-white/20">
              <h4 className="text-white/80 font-medium mb-3">Recent Achievements</h4>
              {userProgress.achievements.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-3">
                  {userProgress.achievements.slice(0, 4).map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 bg-black/20 p-3 rounded-lg">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <div className="text-white font-medium text-sm">{achievement.name}</div>
                        <div className="text-white/60 text-xs">{achievement.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/50 text-sm">Complete your first challenge to earn achievements!</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* New Achievement Notifications */}
      {newAchievements.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-6 mb-6">
          <div className="text-center">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-yellow-200 text-lg font-medium mb-3">New Achievement{newAchievements.length > 1 ? 's' : ''} Unlocked!</h3>
            <div className="space-y-3">
              {newAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center justify-center gap-3">
                  <span className="text-3xl">{achievement.icon}</span>
                  <div className="text-left">
                    <div className="text-yellow-100 font-medium">{achievement.name}</div>
                    <div className="text-yellow-200/70 text-sm">{achievement.description}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setNewAchievements([])}
              className="mt-4 bg-yellow-600/30 border border-yellow-500/30 text-yellow-200 px-4 py-2 rounded-lg hover:bg-yellow-600/40 transition-colors"
            >
              Celebrate! ✨
            </button>
          </div>
        </div>
      )}

      {/* Daily Challenge */}
      {challengeComplete ? (
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-green-200 text-xl font-medium mb-3">Challenge Complete!</h3>
          <p className="text-green-100/80 text-sm mb-6 leading-relaxed">
            You've completed your daily transformation challenge. Your commitment to growth is inspiring!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => safeWindow.reload()}
              className="bg-green-600/30 border border-green-500/30 text-green-200 px-6 py-2 rounded-lg hover:bg-green-600/40 transition-colors"
            >
              🔄 Check Tomorrow's Challenge
            </button>
            <button
              onClick={() => setShowProgress(!showProgress)}
              className="bg-blue-600/30 border border-blue-500/30 text-blue-200 px-6 py-2 rounded-lg hover:bg-blue-600/40 transition-colors"
            >
              📊 View Progress
            </button>
          </div>
        </div>
      ) : dailyPrompt ? (
        <div className="space-y-6">
          {/* Challenge Preview */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{getCategoryIcon(dailyPrompt.challenge.type)}</span>
              <div>
                <h3 className="text-white text-xl font-light">{dailyPrompt.challenge.title}</h3>
                <p className="text-white/60 text-sm">
                  {dailyPrompt.challenge.category} • {dailyPrompt.challenge.estimatedTime} min • 
                  <span className={`${getDifficultyColor(dailyPrompt.challenge.difficulty)} ml-1`}>
                    {dailyPrompt.challenge.difficulty}
                  </span>
                </p>
              </div>
            </div>

            <p className="text-white/80 text-sm mb-4 leading-relaxed">
              {dailyPrompt.challenge.description}
            </p>

            <div className="bg-black/20 p-4 rounded-lg mb-4">
              <p className="text-white/90 italic leading-relaxed">
                "{dailyPrompt.personalizedMessage}"
              </p>
            </div>

            {dailyPrompt.adaptationReason && (
              <div className="text-white/60 text-xs mb-4">
                💡 {dailyPrompt.adaptationReason}
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => setShowChallenge(true)}
                className="bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/30 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Begin Today's Challenge
              </button>
            </div>

            {dailyPrompt.completionIncentive && (
              <p className="text-center text-white/50 text-xs mt-3">
                💪 {dailyPrompt.completionIncentive}
              </p>
            )}
          </div>

          {/* Challenge Interface */}
          {showChallenge && (
            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-2xl p-6">
              <h4 className="text-purple-200 text-lg font-medium mb-4">
                {dailyPrompt.challenge.title}
              </h4>

              <div className="bg-black/30 p-4 rounded-lg mb-6">
                <p className="text-white/90 mb-4 leading-relaxed">
                  {dailyPrompt.challenge.prompt}
                </p>
                
                <div>
                  <h5 className="text-white/80 text-sm font-medium mb-2">Instructions:</h5>
                  <ol className="space-y-2">
                    {dailyPrompt.challenge.instructions.map((instruction, index) => (
                      <li key={index} className="text-white/70 text-sm flex gap-3">
                        <span className="text-purple-400 font-medium">{index + 1}.</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {!challengeStarted ? (
                <div className="text-center">
                  <button
                    onClick={startChallenge}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                  >
                    Start Challenge
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-green-400 mb-2">Challenge in Progress...</div>
                    <div className="text-white/60 text-sm">Take your time and be present with the practice</div>
                  </div>

                  {/* Completion Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/80 text-sm mb-2">
                        How are you feeling after this practice? ({completionData.emotionalStateAfter}/10)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={completionData.emotionalStateAfter}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          setCompletionData(prev => ({ 
                            ...prev, 
                            emotionalStateAfter: isNaN(value) ? 5 : value 
                          }));
                        }}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none slider"
                      />
                      <div className="flex justify-between text-xs text-white/50 mt-1">
                        <span>Much Worse</span>
                        <span>Same</span>
                        <span>Much Better</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm mb-2">
                        How helpful was this practice? ({completionData.rating}/5)
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(rating => (
                          <button
                            key={rating}
                            onClick={() => setCompletionData(prev => ({ ...prev, rating }))}
                            className={`w-10 h-10 rounded-full transition-colors ${
                              rating <= completionData.rating
                                ? 'bg-yellow-500 text-white'
                                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                            }`}
                          >
                            ⭐
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm mb-2">
                        Reflection (optional)
                      </label>
                      <textarea
                        value={completionData.reflection}
                        onChange={(e) => setCompletionData(prev => ({ 
                          ...prev, 
                          reflection: e.target.value 
                        }))}
                        placeholder="What did you notice during this practice? How did it feel?"
                        className="w-full h-24 bg-black/30 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        rows={3}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-white/80 text-sm">
                          Insights ({completionData.insights.length})
                        </label>
                        <button
                          onClick={addInsight}
                          className="text-purple-400 hover:text-purple-300 text-sm"
                        >
                          + Add Insight
                        </button>
                      </div>
                      {completionData.insights.length > 0 && (
                        <div className="space-y-2">
                          {completionData.insights.map((insight, index) => (
                            <div
                              key={index}
                              className="bg-black/20 p-3 rounded-lg text-white/70 text-sm"
                            >
                              💡 {insight}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={completeChallenge}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                      Complete Challenge
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Follow-up Prompts */}
          {dailyPrompt.followUpPrompts.length > 0 && showChallenge && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h4 className="text-white/80 font-medium mb-3">Reflection Prompts</h4>
              <div className="space-y-2">
                {dailyPrompt.followUpPrompts.map((prompt, index) => (
                  <div key={index} className="text-white/60 text-sm flex gap-3">
                    <span className="text-blue-400">•</span>
                    <span>{prompt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-50">🔄</div>
          <p className="text-white/50 text-sm">
            Unable to generate today's challenge. Please try again later.
          </p>
        </div>
      )}
    </div>
  );
}
