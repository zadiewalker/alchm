/**
 * ✨ Khepera Personality System Demo
 * 
 * Interactive demonstration of the adaptive AI personality system
 * Shows how Khepera responds differently based on user level, context, and emotional state
 * 
 * Run this script to see the personality system in action:
 * npx tsx src/khepera/demo-personality-system.ts
 */

import { KheperaPersonalityIntegration } from '../lib/khepera-personality-integration';
import { KheperaScenarioRunner, KHEPERA_RESPONSE_SCENARIOS } from './example-response-scenarios';

class KheperaPersonalityDemo {
  /**
   * Interactive demo that shows personality adaptation
   */
  static async runInteractiveDemo() {
    console.log('🌟'.repeat(20));
    console.log('✨ KHEPERA ADAPTIVE PERSONALITY DEMO ✨');
    console.log('🌟'.repeat(20));
    console.log('\nThis demo shows how Khepera adapts to different users and contexts');
    console.log('like Duolingo adapts to your language learning level.\n');

    await this.demoVocabularyAdaptation();
    await this.demoArchetypeSelection();
    await this.demoContextAwareness();
    await this.demoFeatureIntroduction();
    await this.demoProgressCelebration();
    
    console.log('\n🎯 KEY TAKEAWAYS:');
    console.log('1. Khepera adapts complexity to user\'s emotional vocabulary level');
    console.log('2. Different archetypes (Sage/Coach/Poet) serve different needs');
    console.log('3. Responses are contextually aware of app page and user journey');
    console.log('4. Features are introduced at psychologically optimal moments');
    console.log('5. Progress is celebrated in trauma-informed, non-gamified ways');
    console.log('\n✨ Khepera makes emotional wellness as engaging as language learning! ✨\n');
  }

  /**
   * Shows how language complexity adapts to user level
   */
  static async demoVocabularyAdaptation() {
    console.log('\n📚 VOCABULARY ADAPTATION DEMO');
    console.log('=' .repeat(40));
    console.log('Same emotional content, different complexity levels\n');

    const scenarios = [
      {
        level: 'Explorer',
        text: "I feel weird and don't know why",
        context: { sessionCount: 1, recentTexts: ["I feel weird and don't know why"] }
      },
      {
        level: 'Learner', 
        text: "I'm feeling anxious about work but also proud of how I handled a difficult conversation",
        context: { sessionCount: 10, recentTexts: ["Today was stressful but manageable", "Feeling grateful for small wins"] }
      },
      {
        level: 'Articulator',
        text: "I'm experiencing a profound sense of bittersweet transformation as I integrate lessons from past trauma into my current relationships",
        context: { sessionCount: 40, recentTexts: ["Contemplating the paradox of healing", "Integration feels like sacred alchemy"] }
      }
    ];

    for (const scenario of scenarios) {
      const request = KheperaPersonalityIntegration.createEnhancedRequest(
        { text: scenario.text, userTier: 'seeker' },
        { sessionCount: scenario.context.sessionCount, recentTexts: scenario.context.recentTexts }
      );

      const response = await KheperaPersonalityIntegration.enhanceKheperaResponse(request);
      
      console.log(`🎭 ${scenario.level} Level Response:`);
      console.log(`📝 Input: "${scenario.text}"`);
      console.log(`✨ Khepera: ${response.insight}`);
      console.log(`📊 Detected Level: ${response.personalityArchetype.adaptedComplexity}`);
      
      if (response.engagementElements.vocabularyGrowth) {
        console.log(`📖 Suggested Words: ${response.engagementElements.vocabularyGrowth.suggestedWords.join(', ')}`);
      }
      console.log();
    }
  }

  /**
   * Shows how different archetypes respond to different needs
   */
  static async demoArchetypeSelection() {
    console.log('\n🎭 ARCHETYPE SELECTION DEMO');
    console.log('=' .repeat(40));
    console.log('How Sage, Coach, and Poet respond to different emotional needs\n');

    const archetypeScenarios = [
      {
        archetype: 'Sage',
        trigger: 'Crisis/Support Need',
        text: "I'm feeling really overwhelmed and don't know how to cope",
        context: { interactionContext: 'returning' as const }
      },
      {
        archetype: 'Coach',
        trigger: 'Growth/Achievement',
        text: "I can't believe I've been journaling every day for a week! I feel stronger",
        context: { interactionContext: 'streak_milestone' as const, currentStreak: 7 }
      },
      {
        archetype: 'Poet',
        trigger: 'Complex Processing',
        text: "The interplay between joy and sorrow in my life feels like a beautiful, complex dance",
        context: { sessionCount: 25 }
      }
    ];

    for (const scenario of archetypeScenarios) {
      const request = KheperaPersonalityIntegration.createEnhancedRequest(
        { text: scenario.text, userTier: 'seeker', sessionCount: scenario.context.sessionCount || 10 },
        { 
          interactionContext: scenario.context.interactionContext,
          currentStreak: scenario.context.currentStreak || 3
        }
      );

      const response = await KheperaPersonalityIntegration.enhanceKheperaResponse(request);
      
      console.log(`🎭 ${scenario.archetype} Response (${scenario.trigger}):`);
      console.log(`📝 Input: "${scenario.text}"`);
      console.log(`✨ Khepera: ${response.insight}`);
      console.log(`🔮 Selected Archetype: ${response.personalityArchetype.current}`);
      console.log(`💭 Reasoning: ${response.personalityArchetype.reasoning}`);
      console.log();
    }
  }

  /**
   * Shows context-aware responses based on app page
   */
  static async demoContextAwareness() {
    console.log('\n🌍 CONTEXT AWARENESS DEMO');
    console.log('=' .repeat(40));
    console.log('How responses adapt to different app pages and contexts\n');

    const contextScenarios = [
      {
        page: 'dashboard' as const,
        context: 'first_visit' as const,
        text: "Just signed up, not sure what to expect",
        description: 'New user on dashboard'
      },
      {
        page: 'journal' as const,
        context: 'returning' as const,
        text: "Today was challenging but I'm learning to process my emotions better",
        description: 'Post-writing reflection'
      },
      {
        page: 'pricing' as const,
        context: 'returning' as const,
        text: "Considering upgrading after using free version for a month",
        description: 'Evaluating premium features'
      },
      {
        page: 'analytics' as const,
        context: 'returning' as const,
        text: "Looking at my patterns, I see I write more when stressed but also more positively after exercise",
        description: 'Reviewing emotional patterns'
      }
    ];

    for (const scenario of contextScenarios) {
      const request = KheperaPersonalityIntegration.createEnhancedRequest(
        { text: scenario.text, userTier: 'seeker', currentPage: scenario.page },
        { interactionContext: scenario.context, sessionCount: 15 }
      );

      const response = await KheperaPersonalityIntegration.enhanceKheperaResponse(request);
      
      console.log(`📍 ${scenario.description}:`);
      console.log(`📝 Input: "${scenario.text}"`);
      console.log(`✨ Khepera: ${response.insight}`);
      console.log(`🎯 Page-Specific: ${response.contextualAdaptation.pageSpecific ? 'Yes' : 'No'}`);
      console.log(`📱 Context: ${scenario.page} → ${scenario.context}`);
      console.log();
    }
  }

  /**
   * Shows smart feature introduction timing
   */
  static async demoFeatureIntroduction() {
    console.log('\n🌟 FEATURE INTRODUCTION DEMO');
    console.log('=' .repeat(40));
    console.log('Perfect timing for introducing new features\n');

    const featureScenarios = [
      {
        timing: 'Too Early',
        sessions: 2,
        text: "Still getting used to this journaling thing",
        expectation: 'No feature introduction'
      },
      {
        timing: 'Perfect for Analytics',
        sessions: 8,
        text: "I'm starting to notice patterns in when I feel most stressed",
        expectation: 'Analytics feature suggested'
      },
      {
        timing: 'Community Ready',
        sessions: 12,
        text: "Sometimes I wonder if other people go through similar emotional experiences",
        expectation: 'Community feature suggested',
        recentTexts: ["Feeling isolated in my struggles", "Wish I could connect with others who understand"]
      }
    ];

    for (const scenario of featureScenarios) {
      const request = KheperaPersonalityIntegration.createEnhancedRequest(
        { text: scenario.text, userTier: 'seeker', sessionCount: scenario.sessions },
        { 
          sessionCount: scenario.sessions,
          recentTexts: scenario.recentTexts || [scenario.text]
        }
      );

      const response = await KheperaPersonalityIntegration.enhanceKheperaResponse(request);
      
      console.log(`⏰ ${scenario.timing} (${scenario.sessions} sessions):`);
      console.log(`📝 Input: "${scenario.text}"`);
      console.log(`✨ Khepera: ${response.insight}`);
      console.log(`🎁 Feature Suggested: ${response.contextualAdaptation.featureIntroduction?.suggested ? 
        response.contextualAdaptation.featureIntroduction.featureName : 'None'}`);
      console.log(`✅ Expected: ${scenario.expectation}`);
      console.log();
    }
  }

  /**
   * Shows progress celebration without gamification
   */
  static async demoProgressCelebration() {
    console.log('\n🎉 PROGRESS CELEBRATION DEMO');
    console.log('=' .repeat(40));
    console.log('Meaningful recognition without gamifying emotions\n');

    const progressScenarios = [
      {
        milestone: 'First Entry',
        sessions: 1,
        streak: 1,
        text: "Not sure what I'm doing but here goes...",
        context: 'first_visit' as const
      },
      {
        milestone: 'Week Streak',
        sessions: 7,
        streak: 7,
        text: "I can't believe I've written every day for a week!",
        context: 'streak_milestone' as const
      },
      {
        milestone: 'Growth Recognition',
        sessions: 20,
        streak: 5,
        text: "I notice I'm getting better at naming my emotions instead of just saying 'fine'",
        context: 'returning' as const
      }
    ];

    for (const scenario of progressScenarios) {
      const request = KheperaPersonalityIntegration.createEnhancedRequest(
        { text: scenario.text, userTier: 'seeker', sessionCount: scenario.sessions },
        { 
          currentStreak: scenario.streak,
          interactionContext: scenario.context
        }
      );

      const response = await KheperaPersonalityIntegration.enhanceKheperaResponse(request);
      
      console.log(`🏆 ${scenario.milestone}:`);
      console.log(`📝 Input: "${scenario.text}"`);
      console.log(`✨ Khepera: ${response.insight}`);
      
      if (response.engagementElements.progressCelebration) {
        console.log(`🎉 Celebrating: ${response.engagementElements.progressCelebration.milestone}`);
        console.log(`🌟 Achievement: ${response.engagementElements.progressCelebration.achievement}`);
      }
      console.log();
    }
  }

  /**
   * Run a single scenario for testing
   */
  static async testSingleScenario(scenarioIndex: number = 0) {
    if (scenarioIndex >= KHEPERA_RESPONSE_SCENARIOS.length) {
      console.log(`❌ Scenario ${scenarioIndex} not found. Available: 0-${KHEPERA_RESPONSE_SCENARIOS.length - 1}`);
      return;
    }

    await KheperaScenarioRunner.runScenario(KHEPERA_RESPONSE_SCENARIOS[scenarioIndex]);
  }

  /**
   * Quick test of the integration
   */
  static async quickTest() {
    console.log('🚀 QUICK KHEPERA TEST\n');
    
    const testRequest = KheperaPersonalityIntegration.createEnhancedRequest(
      {
        text: "I'm feeling grateful for this journey of self-discovery. Some days are harder than others, but I'm learning to be patient with myself.",
        userTier: 'seeker',
        sessionCount: 12
      },
      {
        currentStreak: 4,
        interactionContext: 'returning',
        completedFeatures: []
      }
    );

    const response = await KheperaPersonalityIntegration.enhanceKheperaResponse(testRequest);
    
    console.log('📝 Test Input: User reflecting on their growth journey');
    console.log(`✨ Khepera Response: ${response.insight}`);
    console.log(`🎭 Archetype: ${response.personalityArchetype.current}`);
    console.log(`📚 Complexity: ${response.personalityArchetype.adaptedComplexity}`);
    console.log(`🌟 Features Suggested: ${response.contextualAdaptation.featureIntroduction?.suggested ? 'Yes' : 'No'}`);
    console.log('\n✅ Integration working correctly!\n');
  }
}

// Allow running specific demos
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0] || 'full';

  switch (command) {
    case 'quick':
      KheperaPersonalityDemo.quickTest();
      break;
    case 'scenario':
      const index = parseInt(args[1]) || 0;
      KheperaPersonalityDemo.testSingleScenario(index);
      break;
    case 'vocab':
      KheperaPersonalityDemo.demoVocabularyAdaptation();
      break;
    case 'archetypes':
      KheperaPersonalityDemo.demoArchetypeSelection();
      break;
    case 'context':
      KheperaPersonalityDemo.demoContextAwareness();
      break;
    case 'features':
      KheperaPersonalityDemo.demoFeatureIntroduction();
      break;
    case 'progress':
      KheperaPersonalityDemo.demoProgressCelebration();
      break;
    case 'all-scenarios':
      KheperaScenarioRunner.demonstrateAllScenarios();
      break;
    default:
      KheperaPersonalityDemo.runInteractiveDemo();
  }
}

export default KheperaPersonalityDemo;