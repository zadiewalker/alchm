// Pathway Progress Tracking System for ALCHM
// Integrates with existing pathway structure and adds persistence, AI insights, and crisis monitoring

export interface PathwayStep {
  title: string;
  icon: string;
  reality: string;
  challenge: string;
  prompt: string;
  placeholder: string;
  measurable: string;
}

export interface PathwayProgress {
  pathwayId: string;
  userId: string;
  currentStep: number;
  totalSteps: number;
  responses: string[];
  completed: boolean[];
  insights: PathwayInsight[];
  startedAt: Date;
  lastActiveAt: Date;
  completedAt?: Date;
  timeSpent: number; // in minutes
  status: 'active' | 'paused' | 'completed';
  analytics: PathwayAnalytics;
}

export interface PathwayInsight {
  id: string;
  stepIndex: number;
  type: 'breakthrough' | 'pattern_recognition' | 'emotional_growth' | 'resistance' | 'crisis_support';
  content: string;
  aiGenerated: boolean;
  timestamp: Date;
  confidence: number; // 0-1
}

export interface PathwayAnalytics {
  overallProgress: number; // 0-100
  averageTimePerStep: number; // minutes
  engagementScore: number; // 0-100
  emotionalGrowthTrend: 'improving' | 'stable' | 'declining' | 'fluctuating';
  crisisEvents: number;
  breakthroughMoments: number;
  resistancePatterns: string[];
}

export interface PathwayCompletion {
  pathwayId: string;
  completedAt: Date;
  finalInsights: string;
  nextRecommendations: string[];
  transformationScore: number; // 0-100
  kheperaMessage: string;
}

class PathwayProgressManager {
  private static instance: PathwayProgressManager;
  
  static getInstance(): PathwayProgressManager {
    if (!PathwayProgressManager.instance) {
      PathwayProgressManager.instance = new PathwayProgressManager();
    }
    return PathwayProgressManager.instance;
  }

  // Initialize pathway progress
  async startPathway(pathwayId: string, userId: string, totalSteps: number): Promise<PathwayProgress> {
    const progress: PathwayProgress = {
      pathwayId,
      userId,
      currentStep: 0,
      totalSteps,
      responses: new Array(totalSteps).fill(''),
      completed: new Array(totalSteps).fill(false),
      insights: [],
      startedAt: new Date(),
      lastActiveAt: new Date(),
      timeSpent: 0,
      status: 'active',
      analytics: {
        overallProgress: 0,
        averageTimePerStep: 0,
        engagementScore: 100,
        emotionalGrowthTrend: 'stable',
        crisisEvents: 0,
        breakthroughMoments: 0,
        resistancePatterns: []
      }
    };

    await this.saveProgress(progress);
    return progress;
  }

  // Save step response and analyze with AI
  async saveStepResponse(
    pathwayId: string, 
    userId: string, 
    stepIndex: number, 
    response: string,
    timeSpent: number = 0
  ): Promise<{ progress: PathwayProgress; insights: PathwayInsight[]; crisisDetected: boolean }> {
    
    const progress = await this.getProgress(pathwayId, userId);
    if (!progress) {
      throw new Error('Pathway progress not found');
    }

    // Update response and time
    progress.responses[stepIndex] = response;
    progress.lastActiveAt = new Date();
    progress.timeSpent += timeSpent;

    // Check for crisis indicators
    const crisisDetected = await this.checkForCrisis(response, userId, pathwayId, stepIndex);

    // Generate AI insights
    const newInsights = await this.generateStepInsights(progress, stepIndex, response);
    progress.insights.push(...newInsights);

    // Update analytics
    progress.analytics = this.updateAnalytics(progress);

    await this.saveProgress(progress);

    return { progress, insights: newInsights, crisisDetected };
  }

  // Mark step as completed
  async completeStep(pathwayId: string, userId: string, stepIndex: number): Promise<PathwayProgress> {
    const progress = await this.getProgress(pathwayId, userId);
    if (!progress) {
      throw new Error('Pathway progress not found');
    }

    progress.completed[stepIndex] = true;
    progress.currentStep = Math.min(stepIndex + 1, progress.totalSteps - 1);
    progress.lastActiveAt = new Date();

    // Check if pathway is complete
    const allCompleted = progress.completed.every(completed => completed);
    if (allCompleted) {
      progress.status = 'completed';
      progress.completedAt = new Date();
      await this.generateCompletionInsights(progress);
    }

    progress.analytics = this.updateAnalytics(progress);
    await this.saveProgress(progress);

    return progress;
  }

  // Check for crisis indicators in response
  private async checkForCrisis(response: string, userId: string, pathwayId: string, stepIndex: number): Promise<boolean> {
    try {
      // Import crisis monitoring dynamically to avoid circular dependencies
      const { checkForCrisis } = await import('./crisisMonitoring');
      
      const result = await checkForCrisis(response, userId, 'journal_entry');
      
      if (result.riskLevel === 'high' || result.riskLevel === 'critical') {
        // Log pathway-related crisis event
        const progress = await this.getProgress(pathwayId, userId);
        if (progress) {
          progress.analytics.crisisEvents += 1;
          await this.saveProgress(progress);
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Crisis checking error:', error);
      return false;
    }
  }

  // Generate AI insights for step completion
  private async generateStepInsights(progress: PathwayProgress, stepIndex: number, response: string): Promise<PathwayInsight[]> {
    if (typeof window === 'undefined') {
      return []; // Skip AI generation on server side
    }

    try {
      const insights: PathwayInsight[] = [];

      // Analyze response for patterns
      const analysisPrompt = `Analyze this pathway response for insights:

PATHWAY: ${progress.pathwayId}
STEP: ${stepIndex + 1} of ${progress.totalSteps}
RESPONSE: ${response.substring(0, 1000)}
PREVIOUS RESPONSES: ${progress.responses.slice(0, stepIndex).join('\n\n').substring(0, 500)}

Provide brief, supportive insights focusing on:
1. Emotional breakthroughs or patterns
2. Growth indicators
3. Resistance or avoidance patterns
4. Connection to healing journey

Keep insights personal, encouraging, and under 200 characters each.`;

      const analysisResult = await fetch('/api/analyze-pathway-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: analysisPrompt,
          userId: progress.userId,
          pathwayId: progress.pathwayId
        }),
      });

      if (analysisResult.ok) {
        const aiResponse = await analysisResult.json();
        
        // Parse AI insights
        const insightTypes = ['breakthrough', 'pattern_recognition', 'emotional_growth'];
        const randomType = insightTypes[Math.floor(Math.random() * insightTypes.length)] as any;

        insights.push({
          id: `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          stepIndex,
          type: randomType,
          content: aiResponse.insight || 'Your honest reflection shows courage and self-awareness.',
          aiGenerated: true,
          timestamp: new Date(),
          confidence: 0.8
        });
      }

      return insights;
    } catch (error) {
      console.error('Error generating step insights:', error);
      return [];
    }
  }

  // Generate completion insights and recommendations
  private async generateCompletionInsights(progress: PathwayProgress): Promise<void> {
    try {
      const completionPrompt = `Generate completion insights for this healing pathway:

PATHWAY: ${progress.pathwayId}
TOTAL TIME: ${progress.timeSpent} minutes
RESPONSES: ${progress.responses.join('\n\n').substring(0, 2000)}

Provide:
1. A celebration of their transformation journey
2. Key insights from their responses
3. Next recommended pathways or practices
4. Khepera's encouraging message for their continued healing

Focus on growth, resilience, and next steps in their healing journey.`;

      const completionResult = await fetch('/api/pathway-completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: completionPrompt,
          progress,
        }),
      });

      if (completionResult.ok) {
        const completion = await completionResult.json();
        
        // Save completion insights
        await this.saveCompletion({
          pathwayId: progress.pathwayId,
          completedAt: new Date(),
          finalInsights: completion.insights || 'You have shown incredible courage in completing this pathway.',
          nextRecommendations: completion.recommendations || [],
          transformationScore: this.calculateTransformationScore(progress),
          kheperaMessage: completion.kheperaMessage || 'Your healing journey continues to unfold beautifully.'
        });
      }
    } catch (error) {
      console.error('Error generating completion insights:', error);
    }
  }

  // Calculate transformation score based on engagement and insights
  private calculateTransformationScore(progress: PathwayProgress): number {
    const completionRate = (progress.completed.filter(c => c).length / progress.totalSteps) * 100;
    const engagementBonus = progress.responses.filter(r => r.length > 50).length * 5;
    const timeConsistency = progress.timeSpent > (progress.totalSteps * 10) ? 20 : 0; // Bonus for spending time
    const breakthroughBonus = progress.insights.filter(i => i.type === 'breakthrough').length * 10;
    
    return Math.min(100, completionRate + engagementBonus + timeConsistency + breakthroughBonus);
  }

  // Update analytics based on current progress
  private updateAnalytics(progress: PathwayProgress): PathwayAnalytics {
    const completedSteps = progress.completed.filter(c => c).length;
    const overallProgress = (completedSteps / progress.totalSteps) * 100;
    const averageTimePerStep = completedSteps > 0 ? progress.timeSpent / completedSteps : 0;
    
    // Calculate engagement score based on response quality
    const substantialResponses = progress.responses.filter(r => r.length > 30).length;
    const engagementScore = Math.min(100, (substantialResponses / progress.totalSteps) * 100);

    // Detect emotional growth trend
    const recentInsights = progress.insights.slice(-3);
    const growthInsights = recentInsights.filter(i => i.type === 'emotional_growth' || i.type === 'breakthrough').length;
    const emotionalGrowthTrend = growthInsights > 1 ? 'improving' : 'stable';

    return {
      overallProgress,
      averageTimePerStep,
      engagementScore,
      emotionalGrowthTrend,
      crisisEvents: progress.analytics.crisisEvents,
      breakthroughMoments: progress.insights.filter(i => i.type === 'breakthrough').length,
      resistancePatterns: progress.insights.filter(i => i.type === 'resistance').map(i => i.content)
    };
  }

  // Get user's pathway progress
  async getProgress(pathwayId: string, userId: string): Promise<PathwayProgress | null> {
    try {
      const key = `pathway_progress_${pathwayId}_${userId}`;
      const stored = localStorage.getItem(key);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        parsed.startedAt = new Date(parsed.startedAt);
        parsed.lastActiveAt = new Date(parsed.lastActiveAt);
        if (parsed.completedAt) {
          parsed.completedAt = new Date(parsed.completedAt);
        }
        parsed.insights = parsed.insights.map((insight: any) => ({
          ...insight,
          timestamp: new Date(insight.timestamp)
        }));
        
        return parsed;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting progress:', error);
      return null;
    }
  }

  // Save pathway progress
  private async saveProgress(progress: PathwayProgress): Promise<void> {
    try {
      const key = `pathway_progress_${progress.pathwayId}_${progress.userId}`;
      localStorage.setItem(key, JSON.stringify(progress));
      
      // Also save to session for immediate access
      sessionStorage.setItem(`current_pathway`, JSON.stringify({
        pathwayId: progress.pathwayId,
        currentStep: progress.currentStep,
        overallProgress: progress.analytics.overallProgress
      }));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }

  // Save completion data
  private async saveCompletion(completion: PathwayCompletion): Promise<void> {
    try {
      const key = `pathway_completion_${completion.pathwayId}`;
      const existing = localStorage.getItem(key);
      const completions = existing ? JSON.parse(existing) : [];
      
      completions.push(completion);
      localStorage.setItem(key, JSON.stringify(completions));
    } catch (error) {
      console.error('Error saving completion:', error);
    }
  }

  // Get user's completed pathways
  async getCompletedPathways(userId: string): Promise<PathwayCompletion[]> {
    try {
      const completions: PathwayCompletion[] = [];
      
      // Get all completion data from localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('pathway_completion_')) {
          const stored = localStorage.getItem(key);
          if (stored) {
            const pathwayCompletions = JSON.parse(stored);
            completions.push(...pathwayCompletions);
          }
        }
      }
      
      return completions.map(c => ({
        ...c,
        completedAt: new Date(c.completedAt)
      }));
    } catch (error) {
      console.error('Error getting completed pathways:', error);
      return [];
    }
  }

  // Get pathway insights for dashboard
  async getPathwayInsights(userId: string): Promise<{
    totalPathwaysStarted: number;
    totalPathwaysCompleted: number;
    totalTimeSpent: number;
    recentInsights: PathwayInsight[];
    recommendedNextPathways: string[];
  }> {
    try {
      const progressData: PathwayProgress[] = [];
      
      // Get all progress data
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('pathway_progress_') && key.includes(userId)) {
          const stored = localStorage.getItem(key);
          if (stored) {
            progressData.push(JSON.parse(stored));
          }
        }
      }

      const totalPathwaysStarted = progressData.length;
      const totalPathwaysCompleted = progressData.filter(p => p.status === 'completed').length;
      const totalTimeSpent = progressData.reduce((total, p) => total + p.timeSpent, 0);
      
      const recentInsights = progressData
        .flatMap(p => p.insights)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5);

      return {
        totalPathwaysStarted,
        totalPathwaysCompleted,
        totalTimeSpent,
        recentInsights,
        recommendedNextPathways: this.getRecommendedPathways(progressData)
      };
    } catch (error) {
      console.error('Error getting pathway insights:', error);
      return {
        totalPathwaysStarted: 0,
        totalPathwaysCompleted: 0,
        totalTimeSpent: 0,
        recentInsights: [],
        recommendedNextPathways: []
      };
    }
  }

  // Get recommended next pathways based on completed ones
  private getRecommendedPathways(progressData: PathwayProgress[]): string[] {
    const completed = progressData.filter(p => p.status === 'completed').map(p => p.pathwayId);
    
    // Pathway progression recommendations
    const progressionMap: { [key: string]: string[] } = {
      'foundation': ['calm-the-storm', 'enough-as-you-are'],
      'calm-the-storm': ['foundation', 'honoring-loss'],
      'enough-as-you-are': ['foundation', 'shadow-work'],
      'honoring-loss': ['enough-as-you-are', 'shadow-work'],
      'shadow-work': ['honoring-loss', 'enough-as-you-are']
    };

    const recommendations: string[] = [];
    
    for (const completedPathway of completed) {
      const nextPaths = progressionMap[completedPathway] || [];
      for (const nextPath of nextPaths) {
        if (!completed.includes(nextPath) && !recommendations.includes(nextPath)) {
          recommendations.push(nextPath);
        }
      }
    }

    return recommendations.slice(0, 3);
  }
}

// Export singleton instance
export const pathwayProgress = PathwayProgressManager.getInstance();

// Helper hooks for React components
export const usePathwayProgress = (pathwayId: string, userId: string) => {
  if (typeof window === 'undefined') {
    return {
      progress: null,
      saveResponse: async () => ({ progress: null, insights: [], crisisDetected: false }),
      completeStep: async () => null,
      loading: false
    };
  }

  const { useState, useEffect } = require('react');
  
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      const existingProgress = await pathwayProgress.getProgress(pathwayId, userId);
      setProgress(existingProgress);
      setLoading(false);
    };
    
    loadProgress();
  }, [pathwayId, userId]);

  const saveResponse = async (stepIndex: number, response: string, timeSpent: number = 0) => {
    const result = await pathwayProgress.saveStepResponse(pathwayId, userId, stepIndex, response, timeSpent);
    setProgress(result.progress);
    return result;
  };

  const completeStep = async (stepIndex: number) => {
    const updatedProgress = await pathwayProgress.completeStep(pathwayId, userId, stepIndex);
    setProgress(updatedProgress);
    return updatedProgress;
  };

  return { progress, saveResponse, completeStep, loading };
};