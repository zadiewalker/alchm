/**
 * Comprehensive Emotional Intelligence Test Suite
 * Tests the advanced emotional intelligence capabilities of ALCHM
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { 
  advancedEmotionDetector,
  AdvancedEmotionDetector,
  QuantumEmotionalState,
  EmotionVector,
  NeuralEmotionalProfile
} from '../lib/advanced-emotional-intelligence';
import { identityAnalysisEngine } from '../lib/dynamic-report-card-system';
import { advancedArchetypeSystem } from '../lib/advanced-archetype-system';

describe('Advanced Emotional Intelligence System', () => {
  let detector: AdvancedEmotionDetector;

  beforeEach(() => {
    detector = advancedEmotionDetector;
  });

  describe('Quantum Emotional State Detection', () => {
    it('should detect simple positive emotions', async () => {
      const content = "I feel so happy and grateful today! Life is beautiful and I'm excited about the future.";
      const metadata = {
        userId: 'test-user-1',
        culturalContext: {
          culturalBackground: ['western'],
          emotionalExpression: 'individualist' as const,
          spiritualFramework: 'secular_humanist',
          familyEmotionalPatterns: ['expressive'],
          generationalTrauma: false,
          culturalStrengths: ['emotional_literacy'],
          adaptationLevel: 0.8
        }
      };

      const result = await detector.detectQuantumEmotionalState(content, metadata);

      expect(result).toBeDefined();
      expect(result.primaryEmotion.emotion).toMatch(/joy|happiness|gratitude/);
      expect(result.primaryEmotion.valence).toBeGreaterThan(0.5);
      expect(result.coherence).toBeGreaterThan(0.6);
      expect(result.secondaryEmotions.length).toBeGreaterThanOrEqual(1);
    });

    it('should detect complex mixed emotions', async () => {
      const content = "I'm grateful for my family but also feeling anxious about the future. There's joy in my heart but also a deep sadness about what I've lost.";
      const metadata = {
        userId: 'test-user-2'
      };

      const result = await detector.detectQuantumEmotionalState(content, metadata);

      expect(result.emotionalSuperposition).toBeGreaterThan(0.3); // Mixed emotions
      expect(result.secondaryEmotions.length).toBeGreaterThanOrEqual(2);
      expect(result.entanglement.length).toBeGreaterThanOrEqual(0);
      
      // Should detect both positive and negative valences
      const emotions = [result.primaryEmotion, ...result.secondaryEmotions];
      const hasPositive = emotions.some(e => e.valence > 0.3);
      const hasNegative = emotions.some(e => e.valence < -0.3);
      expect(hasPositive && hasNegative).toBe(true);
    });

    it('should detect cultural emotional expressions', async () => {
      const content = "I'm feeling blue today, but I know I need to keep a stiff upper lip.";
      const metadata = {
        userId: 'test-user-3',
        culturalContext: {
          culturalBackground: ['western'],
          emotionalExpression: 'individualist' as const,
          spiritualFramework: 'secular_humanist',
          familyEmotionalPatterns: ['reserved'],
          generationalTrauma: false,
          culturalStrengths: ['emotional_restraint'],
          adaptationLevel: 0.9
        }
      };

      const result = await detector.detectQuantumEmotionalState(content, metadata);

      expect(result.primaryEmotion.culturalModifier).toBeDefined();
      expect(result.culturalContext).toBeDefined();
      expect(result.culturalContext.culturalBackground).toContain('western');
    });

    it('should handle temporal emotional patterns', async () => {
      const morningContent = "I wake up feeling hopeful about today";
      const eveningContent = "As the day ends, I feel reflective and tired";
      
      const morningMetadata = {
        userId: 'test-user-4',
        timeContext: { hour: 8, isWeekend: false }
      };
      
      const eveningMetadata = {
        userId: 'test-user-4',
        timeContext: { hour: 20, isWeekend: false }
      };

      const morningResult = await detector.detectQuantumEmotionalState(morningContent, morningMetadata);
      const eveningResult = await detector.detectQuantumEmotionalState(eveningContent, eveningMetadata);

      expect(morningResult.temporalContext.circadianAlignment).toBeDefined();
      expect(eveningResult.temporalContext.circadianAlignment).toBeDefined();
      
      // Morning should have different temporal characteristics than evening
      expect(morningResult.temporalContext.circadianAlignment).not.toEqual(
        eveningResult.temporalContext.circadianAlignment
      );
    });

    it('should detect archetypal emotional patterns', async () => {
      const motherContent = "I just want to protect and nurture everyone I love. Their wellbeing matters more than my own.";
      const warriorContent = "I'm ready to fight for what's right. This injustice cannot stand, and I have the strength to face it.";
      const sageContent = "I find myself seeking deeper meaning and understanding in this experience. What is it trying to teach me?";

      const metadata = { userId: 'test-user-5' };

      const motherResult = await detector.detectQuantumEmotionalState(motherContent, metadata);
      const warriorResult = await detector.detectQuantumEmotionalState(warriorContent, metadata);
      const sageResult = await detector.detectQuantumEmotionalState(sageContent, metadata);

      expect(motherResult.archetypeResonance).toBeDefined();
      expect(warriorResult.archetypeResonance).toBeDefined();
      expect(sageResult.archetypeResonance).toBeDefined();

      // Each should resonate with different archetypes
      const motherArchetypes = Object.keys(motherResult.archetypeResonance);
      const warriorArchetypes = Object.keys(warriorResult.archetypeResonance);
      const sageArchetypes = Object.keys(sageResult.archetypeResonance);

      expect(motherArchetypes.length).toBeGreaterThan(0);
      expect(warriorArchetypes.length).toBeGreaterThan(0);
      expect(sageArchetypes.length).toBeGreaterThan(0);
    });
  });

  describe('Emotional Pattern Recognition', () => {
    it('should identify emotional entanglement patterns', async () => {
      const traumaContent = "This situation reminds me of when I was a child and felt so powerless and scared.";
      const metadata = { userId: 'test-user-6' };

      const result = await detector.detectQuantumEmotionalState(traumaContent, metadata);

      expect(result.entanglement).toBeDefined();
      expect(result.entanglement.length).toBeGreaterThanOrEqual(1);
      
      if (result.entanglement.length > 0) {
        const entanglement = result.entanglement[0];
        expect(entanglement.connectedExperience).toBeDefined();
        expect(entanglement.entanglementStrength).toBeGreaterThan(0);
        expect(entanglement.healingPotential).toBeDefined();
      }
    });

    it('should calculate emotional coherence accurately', async () => {
      const coherentContent = "I feel deeply peaceful and centered today. Everything feels aligned and harmonious.";
      const incoherentContent = "I'm so happy but also terrified and angry and sad and I don't know what I feel anymore.";
      
      const metadata = { userId: 'test-user-7' };

      const coherentResult = await detector.detectQuantumEmotionalState(coherentContent, metadata);
      const incoherentResult = await detector.detectQuantumEmotionalState(incoherentContent, metadata);

      expect(coherentResult.coherence).toBeGreaterThan(incoherentResult.coherence);
      expect(coherentResult.coherence).toBeGreaterThan(0.7);
      expect(incoherentResult.coherence).toBeLessThan(0.5);
    });

    it('should recognize seasonal and circadian patterns', async () => {
      const winterContent = "The dark days are getting to me. I feel sluggish and withdrawn.";
      const springContent = "I feel so alive and energized! Everything is blooming and so am I.";
      
      const metadata = { userId: 'test-user-8' };

      const winterResult = await detector.detectQuantumEmotionalState(winterContent, metadata);
      const springResult = await detector.detectQuantumEmotionalState(springContent, metadata);

      expect(winterResult.temporalContext.seasonalInfluence).toBeLessThan(0);
      expect(springResult.temporalContext.seasonalInfluence).toBeGreaterThan(0);
    });
  });
});

describe('Dynamic Report Card System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Identity Evolution Analysis', () => {
    it('should analyze identity themes correctly', async () => {
      const mockEntries = [
        {
          id: '1',
          userId: 'test-user',
          content: 'I am discovering who I really am. This journey of self-discovery is challenging but rewarding.',
          createdAt: new Date('2024-01-01')
        },
        {
          id: '2',
          userId: 'test-user',
          content: 'My relationships are teaching me so much about love and boundaries. I am growing.',
          createdAt: new Date('2024-01-02')
        },
        {
          id: '3',
          userId: 'test-user',
          content: 'My spiritual practice is deepening. I feel more connected to something greater than myself.',
          createdAt: new Date('2024-01-03')
        }
      ];

      const reportCard = await identityAnalysisEngine.generateDynamicReportCard(
        'test-user',
        mockEntries,
        'month'
      );

      expect(reportCard).toBeDefined();
      expect(reportCard.identityEvolution).toBeDefined();
      expect(reportCard.identityEvolution.currentIdentityTheme).toBeDefined();
      expect(reportCard.identityEvolution.identityCoherence).toBeGreaterThanOrEqual(0);
      expect(reportCard.identityEvolution.identityCoherence).toBeLessThanOrEqual(1);
      expect(reportCard.identityEvolution.growthTrajectory).toMatch(/expanding|integrating|consolidating|transforming/);
    });

    it('should calculate emotional intelligence metrics', async () => {
      const mockEntries = [
        {
          id: '1',
          userId: 'test-user',
          content: 'I notice that when I feel angry, it usually comes from a place of hurt. I am learning to recognize this pattern.',
          createdAt: new Date('2024-01-01')
        },
        {
          id: '2',
          userId: 'test-user',
          content: 'I held space for my friend today when they were crying. It felt good to just listen without trying to fix.',
          createdAt: new Date('2024-01-02')
        }
      ];

      const reportCard = await identityAnalysisEngine.generateDynamicReportCard(
        'test-user',
        mockEntries,
        'week'
      );

      expect(reportCard.emotionalIntelligence).toBeDefined();
      expect(reportCard.emotionalIntelligence.selfAwareness).toBeGreaterThan(0.5);
      expect(reportCard.emotionalIntelligence.empathyCapacity).toBeGreaterThan(0.3);
      expect(reportCard.emotionalIntelligence.emotionalRegulation).toBeGreaterThanOrEqual(0);
      expect(reportCard.emotionalIntelligence.emotionalRange).toBeGreaterThanOrEqual(0);
    });

    it('should generate actionable growth insights', async () => {
      const mockEntries = [
        {
          id: '1',
          userId: 'test-user',
          content: 'I keep struggling with the same pattern of avoiding conflict. I know I need to work on this.',
          createdAt: new Date('2024-01-01')
        }
      ];

      const reportCard = await identityAnalysisEngine.generateDynamicReportCard(
        'test-user',
        mockEntries,
        'month'
      );

      expect(reportCard.growthInsights).toBeDefined();
      expect(reportCard.growthInsights.length).toBeGreaterThan(0);
      
      reportCard.growthInsights.forEach(insight => {
        expect(insight.category).toBeDefined();
        expect(insight.insight).toBeDefined();
        expect(insight.evidenceStrength).toBeGreaterThanOrEqual(0);
        expect(insight.evidenceStrength).toBeLessThanOrEqual(1);
        expect(typeof insight.actionable).toBe('boolean');
      });
    });

    it('should provide personalized recommendations', async () => {
      const mockEntries = [
        {
          id: '1',
          userId: 'test-user',
          content: 'I feel overwhelmed and scattered. I cannot seem to get grounded or find my center.',
          createdAt: new Date('2024-01-01')
        }
      ];

      const reportCard = await identityAnalysisEngine.generateDynamicReportCard(
        'test-user',
        mockEntries,
        'week'
      );

      expect(reportCard.recommendations).toBeDefined();
      expect(reportCard.recommendations.length).toBeGreaterThan(0);
      
      reportCard.recommendations.forEach(rec => {
        expect(rec.type).toMatch(/growth|healing|integration|exploration|celebration/);
        expect(rec.priority).toMatch(/low|medium|high|urgent/);
        expect(rec.recommendation).toBeDefined();
        expect(rec.suggestedActions).toBeDefined();
        expect(rec.suggestedActions.length).toBeGreaterThan(0);
      });
    });

    it('should track sacred journey progression', async () => {
      const mockEntries = [
        {
          id: '1',
          userId: 'test-user',
          content: 'I am learning to trust the process of my healing. Each day brings new insights and growth.',
          createdAt: new Date('2024-01-01')
        }
      ];

      const reportCard = await identityAnalysisEngine.generateDynamicReportCard(
        'test-user',
        mockEntries,
        'month'
      );

      expect(reportCard.sacredJourney).toBeDefined();
      expect(reportCard.sacredJourney.currentChapter).toBeDefined();
      expect(reportCard.sacredJourney.majorThemes).toBeDefined();
      expect(reportCard.sacredJourney.wisdomGained).toBeDefined();
      expect(reportCard.sacredJourney.healingProgress).toBeDefined();
      expect(reportCard.sacredJourney.giftsEmerging).toBeDefined();
      
      expect(Array.isArray(reportCard.sacredJourney.majorThemes)).toBe(true);
      expect(Array.isArray(reportCard.sacredJourney.wisdomGained)).toBe(true);
      expect(Array.isArray(reportCard.sacredJourney.giftsEmerging)).toBe(true);
    });
  });

  describe('Wellness Metrics Calculation', () => {
    it('should calculate comprehensive wellness scores', async () => {
      const positiveEntries = [
        {
          id: '1',
          userId: 'test-user',
          content: 'I feel strong, resilient, and capable of handling whatever comes my way.',
          createdAt: new Date('2024-01-01')
        },
        {
          id: '2',
          userId: 'test-user',
          content: 'I am adapting well to changes and finding balance in my life.',
          createdAt: new Date('2024-01-02')
        }
      ];

      const reportCard = await identityAnalysisEngine.generateDynamicReportCard(
        'test-user',
        positiveEntries,
        'month'
      );

      expect(reportCard.wellnessMetrics.overallWellness).toBeGreaterThan(50);
      expect(reportCard.wellnessMetrics.resilience).toBeGreaterThan(50);
      expect(reportCard.wellnessMetrics.adaptation).toBeGreaterThan(50);
      expect(reportCard.wellnessMetrics.integration).toBeGreaterThan(50);
      
      // All scores should be between 0 and 100
      Object.values(reportCard.wellnessMetrics).forEach(score => {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      });
    });

    it('should detect low wellness requiring intervention', async () => {
      const challengingEntries = [
        {
          id: '1',
          userId: 'test-user',
          content: 'I feel overwhelmed, hopeless, and unable to cope with daily life.',
          createdAt: new Date('2024-01-01')
        }
      ];

      const reportCard = await identityAnalysisEngine.generateDynamicReportCard(
        'test-user',
        challengingEntries,
        'week'
      );

      expect(reportCard.wellnessMetrics.overallWellness).toBeLessThan(70);
      
      // Should generate high-priority recommendations for low wellness
      const highPriorityRecs = reportCard.recommendations.filter(r => 
        r.priority === 'high' || r.priority === 'urgent'
      );
      expect(highPriorityRecs.length).toBeGreaterThan(0);
    });
  });
});

describe('Advanced Archetype System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Archetype Evolution', () => {
    it('should generate archetype constellation', async () => {
      const mockEntries = [
        {
          id: '1',
          userId: 'test-user',
          content: 'I find myself holding space for others\' pain without trying to fix or change anything.',
          createdAt: new Date('2024-01-01')
        },
        {
          id: '2',
          userId: 'test-user',
          content: 'Sometimes I need to challenge myself and others to grow beyond our comfort zones.',
          createdAt: new Date('2024-01-02')
        }
      ];

      const mockEmotionalStates = [
        {
          primaryEmotion: { emotion: 'compassion', intensity: 0.8, valence: 0.7, arousal: 0.4, confidence: 0.9, culturalModifier: 0, temporalDecay: 0.1, resonanceFrequency: 0.8 },
          secondaryEmotions: [],
          emotionalSuperposition: 0.2,
          coherence: 0.8,
          entanglement: [],
          temporalContext: {
            pastEcho: 0.3,
            presentFocus: 0.8,
            futureOrientation: 0.5,
            circadianAlignment: 0.7,
            seasonalInfluence: 0.2
          },
          culturalContext: {
            culturalBackground: ['western'],
            emotionalExpression: 'individualist' as const,
            spiritualFramework: 'secular_humanist',
            familyEmotionalPatterns: ['expressive'],
            generationalTrauma: false,
            culturalStrengths: ['emotional_literacy'],
            adaptationLevel: 0.8
          },
          archetypeResonance: {
            'gentle_witness': { resonance: 0.9, evolutionPotential: 0.7, activationThreshold: 0.6, lastActivation: new Date(), growthTrajectory: 'ascending' as const }
          }
        }
      ];

      const constellation = await advancedArchetypeSystem.generateArchetypeConstellation(
        'test-user',
        mockEntries,
        mockEmotionalStates
      );

      expect(constellation).toBeDefined();
      expect(constellation.userId).toBe('test-user');
      expect(constellation.centralArchetype).toBeDefined();
      expect(constellation.activeArchetypes).toBeDefined();
      expect(constellation.activeArchetypes.length).toBeGreaterThan(0);
      expect(constellation.evolutionPhase).toMatch(/formation|stabilization|transformation|transcendence/);
    });

    it('should generate dynamic archetype responses', async () => {
      const mockConstellation = {
        userId: 'test-user',
        constellationName: 'Test Constellation',
        centralArchetype: 'gentle_witness',
        activeArchetypes: [{
          id: 'gentle_witness',
          name: 'The Gentle Witness',
          evolutionStage: 'developing' as const,
          archetypeDepth: 0.6,
          shadowIntegration: 0.4,
          giftExpression: 0.7,
          evolutionPotential: 0.8,
          resonanceFrequency: 0.7,
          lastActivation: new Date(),
          activationCount: 5,
          evolutionTriggers: ['emotional intensity'],
          developmentChallenges: ['maintaining boundaries'],
          integrationGifts: ['healing presence'],
          archetypeRelationships: {}
        }],
        dormantArchetypes: [],
        emergingArchetypes: [],
        archetypeInteractions: [],
        constellationBalance: 0.7,
        evolutionPhase: 'stabilization' as const,
        nextEvolutionCatalyst: 'deeper integration',
        integrationOpportunities: ['shadow work']
      };

      const mockEmotionalState = {
        primaryEmotion: { emotion: 'sadness', intensity: 0.7, valence: -0.6, arousal: 0.3, confidence: 0.8, culturalModifier: 0, temporalDecay: 0.1, resonanceFrequency: 0.7 },
        secondaryEmotions: [],
        emotionalSuperposition: 0.1,
        coherence: 0.8,
        entanglement: [],
        temporalContext: {
          pastEcho: 0.4,
          presentFocus: 0.7,
          futureOrientation: 0.3,
          circadianAlignment: 0.6,
          seasonalInfluence: 0.1
        },
        culturalContext: {
          culturalBackground: ['western'],
          emotionalExpression: 'individualist' as const,
          spiritualFramework: 'secular_humanist',
          familyEmotionalPatterns: ['expressive'],
          generationalTrauma: false,
          culturalStrengths: ['emotional_literacy'],
          adaptationLevel: 0.8
        },
        archetypeResonance: {}
      };

      const response = await advancedArchetypeSystem.generateDynamicArchetypeResponse(
        'I am feeling lost and need guidance',
        mockConstellation,
        mockEmotionalState
      );

      expect(response).toBeDefined();
      expect(response.primaryArchetype).toBeDefined();
      expect(response.responseMessage).toBeDefined();
      expect(response.evolutionaryGuidance).toBeDefined();
      expect(response.integrationPractice).toBeDefined();
      expect(response.nextDevelopmentFocus).toBeDefined();
      expect(response.archetypeEvolutionPrediction).toBeDefined();
      
      expect(response.archetypeEvolutionPrediction.likelyEvolution).toBeDefined();
      expect(response.archetypeEvolutionPrediction.timeframe).toBeDefined();
      expect(Array.isArray(response.archetypeEvolutionPrediction.catalysts)).toBe(true);
      expect(Array.isArray(response.archetypeEvolutionPrediction.supportNeeded)).toBe(true);
    });
  });

  describe('Shadow Work Integration', () => {
    it('should detect shadow work opportunities', async () => {
      const mockConstellation = {
        userId: 'test-user',
        constellationName: 'Test Constellation',
        centralArchetype: 'gentle_witness',
        activeArchetypes: [{
          id: 'gentle_witness',
          name: 'The Gentle Witness',
          evolutionStage: 'mature' as const,
          archetypeDepth: 0.8,
          shadowIntegration: 0.3, // Low shadow integration
          giftExpression: 0.7,
          evolutionPotential: 0.6,
          resonanceFrequency: 0.7,
          lastActivation: new Date(),
          activationCount: 10,
          evolutionTriggers: ['emotional intensity'],
          developmentChallenges: ['maintaining boundaries'],
          integrationGifts: ['healing presence'],
          archetypeRelationships: {}
        }],
        dormantArchetypes: [],
        emergingArchetypes: [],
        archetypeInteractions: [],
        constellationBalance: 0.7,
        evolutionPhase: 'transformation' as const,
        nextEvolutionCatalyst: 'shadow integration',
        integrationOpportunities: ['shadow work']
      };

      const highCoherenceEmotionalState = {
        primaryEmotion: { emotion: 'avoidance', intensity: 0.6, valence: -0.4, arousal: 0.5, confidence: 0.8, culturalModifier: 0, temporalDecay: 0.1, resonanceFrequency: 0.6 },
        secondaryEmotions: [],
        emotionalSuperposition: 0.2,
        coherence: 0.8, // High coherence suggests readiness
        entanglement: [],
        temporalContext: {
          pastEcho: 0.3,
          presentFocus: 0.8,
          futureOrientation: 0.5,
          circadianAlignment: 0.7,
          seasonalInfluence: 0.2
        },
        culturalContext: {
          culturalBackground: ['western'],
          emotionalExpression: 'individualist' as const,
          spiritualFramework: 'secular_humanist',
          familyEmotionalPatterns: ['expressive'],
          generationalTrauma: false,
          culturalStrengths: ['emotional_literacy'],
          adaptationLevel: 0.8
        },
        archetypeResonance: {}
      };

      const response = await advancedArchetypeSystem.generateDynamicArchetypeResponse(
        'I keep avoiding taking action when I should speak up',
        mockConstellation,
        highCoherenceEmotionalState
      );

      expect(response.shadowWorkInvitation).toBeDefined();
      expect(response.shadowWorkInvitation).toContain('shadow');
    });
  });
});

describe('Integration Tests', () => {
  it('should integrate emotional intelligence with report card generation', async () => {
    const complexEntry = {
      id: '1',
      userId: 'integration-test-user',
      content: `Today I realized something profound about myself. I've been carrying this pattern of self-doubt 
                that I learned from my childhood, but I also see how it has made me more compassionate toward 
                others who struggle. I'm angry at the injustice I faced, but I'm also grateful for the wisdom 
                it brought me. I feel like I'm transforming into someone new, someone who can hold both the 
                pain and the beauty of life. I want to use my experience to help others heal too.`,
      createdAt: new Date('2024-01-15')
    };

    // First detect emotional state
    const emotionalState = await advancedEmotionDetector.detectQuantumEmotionalState(
      complexEntry.content,
      { userId: complexEntry.userId }
    );

    // Then generate report card
    const reportCard = await identityAnalysisEngine.generateDynamicReportCard(
      complexEntry.userId,
      [complexEntry],
      'week'
    );

    // Verify integration
    expect(emotionalState).toBeDefined();
    expect(reportCard).toBeDefined();
    
    // Complex content should show high emotional range and mixed emotions
    expect(emotionalState.emotionalSuperposition).toBeGreaterThan(0.3);
    expect(emotionalState.secondaryEmotions.length).toBeGreaterThan(1);
    
    // Report card should reflect the emotional complexity
    expect(reportCard.emotionalIntelligence.emotionalRange).toBeGreaterThan(0.5);
    expect(reportCard.growthInsights.length).toBeGreaterThan(0);
    
    // Should generate appropriate recommendations for transformation phase
    const transformationRecs = reportCard.recommendations.filter(r => 
      r.type === 'integration' || r.type === 'growth'
    );
    expect(transformationRecs.length).toBeGreaterThan(0);
  });

  it('should demonstrate the complete emotional intelligence pipeline', async () => {
    const journalEntries = [
      {
        id: '1',
        userId: 'pipeline-test-user',
        content: 'I feel lost and confused about my direction in life.',
        createdAt: new Date('2024-01-01')
      },
      {
        id: '2',
        userId: 'pipeline-test-user',
        content: 'Today I had a breakthrough in therapy. I understand my patterns better now.',
        createdAt: new Date('2024-01-07')
      },
      {
        id: '3',
        userId: 'pipeline-test-user',
        content: 'I am feeling more integrated and whole. I can hold complexity without falling apart.',
        createdAt: new Date('2024-01-14')
      }
    ];

    // Process all entries through emotional intelligence
    const emotionalStates = [];
    for (const entry of journalEntries) {
      const state = await advancedEmotionDetector.detectQuantumEmotionalState(
        entry.content,
        { userId: entry.userId }
      );
      emotionalStates.push(state);
    }

    // Generate archetype constellation
    const constellation = await advancedArchetypeSystem.generateArchetypeConstellation(
      'pipeline-test-user',
      journalEntries,
      emotionalStates
    );

    // Generate comprehensive report card
    const reportCard = await identityAnalysisEngine.generateDynamicReportCard(
      'pipeline-test-user',
      journalEntries,
      'month'
    );

    // Verify complete pipeline functionality
    expect(emotionalStates.length).toBe(3);
    expect(constellation).toBeDefined();
    expect(reportCard).toBeDefined();
    
    // Should show evolution over time
    const finalEmotionalState = emotionalStates[2];
    expect(finalEmotionalState.coherence).toBeGreaterThan(0.6);
    
    // Report should show growth trajectory
    expect(reportCard.identityEvolution.growthTrajectory).toMatch(/expanding|integrating|transforming/);
    expect(reportCard.emotionalIntelligence.emotionalGrowthRate).toBeGreaterThan(0);
    
    // Should have active archetypes in constellation
    expect(constellation.activeArchetypes.length).toBeGreaterThan(0);
    expect(constellation.evolutionPhase).toBeDefined();
    
    console.log('✅ Complete Emotional Intelligence Pipeline Test Passed');
    console.log(`   - Processed ${journalEntries.length} journal entries`);
    console.log(`   - Generated ${emotionalStates.length} emotional states`);
    console.log(`   - Created archetype constellation with ${constellation.activeArchetypes.length} active archetypes`);
    console.log(`   - Generated report card with ${reportCard.growthInsights.length} insights and ${reportCard.recommendations.length} recommendations`);
  });
});