'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NeuroplasticityHabitEngine } from '@/lib/neuroplasticity-habits';
import { PolyvagalStateEngine, PolyvagalState } from '@/lib/polyvagal-state-engine';

interface HabitStackBuilderProps {
  userId: string;
  existingRoutines: ExistingRoutine[];
  emotionalSkillsToLearn: EmotionalSkill[];
  currentNervousSystemState: PolyvagalState;
  onHabitStackCreated: (habitStack: HabitStack) => void;
  traumaInformed?: boolean;
}

interface ExistingRoutine {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  time_of_day: string;
  duration_minutes: number;
  consistency_score: number; // 0-100
  emotional_state_during: 'positive' | 'neutral' | 'negative' | 'variable';
  energy_requirement: 'low' | 'moderate' | 'high';
  nervous_system_impact: 'regulating' | 'activating' | 'neutral' | 'depleting';
  anchor_strength: number; // 0-100, how reliable this routine is
  modification_flexibility: number; // 0-100, how open user is to changing it
}

interface EmotionalSkill {
  id: string;
  skill_name: string;
  description: string;
  target_brain_regions: string[];
  practice_duration_range: [number, number]; // min-max minutes
  complexity_level: 'beginner' | 'intermediate' | 'advanced';
  nervous_system_requirements: {
    minimum_regulation_level: number; // 0-100
    optimal_arousal_state: 'calm' | 'alert' | 'either';
    window_of_tolerance_needed: number; // 0-100
  };
  stacking_compatibility: {
    before_activities: string[]; // activities this pairs well after
    after_activities: string[]; // activities this pairs well before
    simultaneous_activities: string[]; // activities this can be done with
    incompatible_activities: string[]; // activities to avoid pairing with
  };
  neuroplasticity_factors: {
    synaptic_strengthening_potential: number; // 0-100
    myelination_contribution: number; // 0-100
    cross_training_benefits: string[];
  };
  trauma_adaptations: {
    titration_options: string[];
    safety_modifications: string[];
    choice_points: string[];
    overwhelm_prevention: string[];
  };
}

interface HabitStack {
  id: string;
  stack_name: string;
  description: string;
  anchor_routine: ExistingRoutine;
  stacked_skills: StackedSkill[];
  total_duration_minutes: number;
  neuroplasticity_score: number; // 0-100, predicted effectiveness
  trauma_informed_adaptations: TraumaAdaptation[];
  implementation_phases: ImplementationPhase[];
  success_metrics: SuccessMetric[];
  optimization_recommendations: OptimizationRecommendation[];
}

interface StackedSkill {
  skill: EmotionalSkill;
  position: 'before' | 'during' | 'after' | 'replaces_part_of';
  integration_method: 'sequential' | 'overlapping' | 'embedded' | 'replacement';
  duration_minutes: number;
  cue_design: CueDesign;
  reward_integration: RewardIntegration;
  difficulty_progression: DifficultyProgression;
}

interface CueDesign {
  cue_type: 'environmental' | 'temporal' | 'somatic' | 'behavioral' | 'emotional';
  cue_description: string;
  cue_reliability: number; // 0-100
  trauma_safety_rating: number; // 0-100
  implementation_instructions: string[];
}

interface RewardIntegration {
  intrinsic_reward_alignment: string;
  dopamine_optimization: string;
  celebration_moment: string;
  progress_recognition: string;
  social_sharing_opportunity?: string;
}

interface TraumaAdaptation {
  adaptation_type: 'titration' | 'choice_point' | 'safety_modification' | 'overwhelm_prevention';
  description: string;
  implementation: string;
  effectiveness_rating: number; // 0-100
}

interface ImplementationPhase {
  phase_number: number;
  phase_name: string;
  duration_days: number;
  goals: string[];
  skills_introduced: string[];
  success_criteria: string[];
  common_challenges: string[];
  support_strategies: string[];
}

interface SuccessMetric {
  metric_name: string;
  measurement_method: string;
  baseline_value: number;
  target_value: number;
  tracking_frequency: 'daily' | 'weekly' | 'monthly';
  neuroplasticity_correlation: string;
}

interface OptimizationRecommendation {
  recommendation_type: 'timing' | 'sequence' | 'duration' | 'environment' | 'nervous_system';
  description: string;
  scientific_rationale: string;
  implementation_difficulty: 'easy' | 'moderate' | 'challenging';
  expected_impact: number; // 0-100
}

export const HabitStackBuilder: React.FC<HabitStackBuilderProps> = ({
  userId,
  existingRoutines,
  emotionalSkillsToLearn,
  currentNervousSystemState,
  onHabitStackCreated,
  traumaInformed = true
}) => {
  const [selectedRoutine, setSelectedRoutine] = useState<ExistingRoutine | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<EmotionalSkill[]>([]);
  const [stackingPhase, setStackingPhase] = useState<'routine_selection' | 'skill_selection' | 'integration_design' | 'review'>('routine_selection');
  const [generatedStacks, setGeneratedStacks] = useState<HabitStack[]>([]);
  const [selectedStack, setSelectedStack] = useState<HabitStack | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate habit stack recommendations based on neuroplasticity principles
  const generateHabitStacks = async () => {
    if (!selectedRoutine || selectedSkills.length === 0) return;

    setIsGenerating(true);
    
    try {
      const stacks = await Promise.all([
        createSequentialStack(selectedRoutine, selectedSkills),
        createEmbeddedStack(selectedRoutine, selectedSkills),
        createReplacementStack(selectedRoutine, selectedSkills)
      ]);

      // Score and rank stacks based on neuroplasticity effectiveness
      const scoredStacks = stacks
        .filter(stack => stack !== null)
        .map(stack => ({
          ...stack!,
          neuroplasticity_score: calculateNeuroplasticityScore(stack!, currentNervousSystemState)
        }))
        .sort((a, b) => b.neuroplasticity_score - a.neuroplasticity_score);

      setGeneratedStacks(scoredStacks);
      setStackingPhase('review');
    } catch (error) {
      console.error('Error generating habit stacks:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Create a sequential habit stack (skill follows routine)
  const createSequentialStack = async (routine: ExistingRoutine, skills: EmotionalSkill[]): Promise<HabitStack | null> => {
    const compatibleSkills = skills.filter(skill => 
      isNervousSystemCompatible(skill, currentNervousSystemState) &&
      isTimeCompatible(skill, routine)
    );

    if (compatibleSkills.length === 0) return null;

    const stackedSkills: StackedSkill[] = compatibleSkills.map((skill, index) => ({
      skill,
      position: 'after',
      integration_method: 'sequential',
      duration_minutes: Math.min(skill.practice_duration_range[1], routine.duration_minutes * 0.3),
      cue_design: createOptimalCue(skill, routine, 'after'),
      reward_integration: createRewardIntegration(skill, routine),
      difficulty_progression: createDifficultyProgression(skill, index)
    }));

    const totalDuration = routine.duration_minutes + stackedSkills.reduce((sum, s) => sum + s.duration_minutes, 0);
    
    return {
      id: `sequential_${Date.now()}`,
      stack_name: `${routine.name} + Emotional Skills`,
      description: `Practice emotional skills immediately after your established ${routine.name} routine`,
      anchor_routine: routine,
      stacked_skills: stackedSkills,
      total_duration_minutes: totalDuration,
      neuroplasticity_score: 0, // Will be calculated
      trauma_informed_adaptations: createTraumaAdaptations(skills, 'sequential'),
      implementation_phases: createImplementationPhases(stackedSkills, 'sequential'),
      success_metrics: createSuccessMetrics(stackedSkills),
      optimization_recommendations: createOptimizationRecommendations(routine, stackedSkills, 'sequential')
    };
  };

  // Create an embedded habit stack (skill integrated within routine)
  const createEmbeddedStack = async (routine: ExistingRoutine, skills: EmotionalSkill[]): Promise<HabitStack | null> => {
    const embeddableSkills = skills.filter(skill => 
      skill.stacking_compatibility.simultaneous_activities.some(activity => 
        routine.description.toLowerCase().includes(activity.toLowerCase())
      )
    );

    if (embeddableSkills.length === 0) return null;

    const stackedSkills: StackedSkill[] = embeddableSkills.map((skill, index) => ({
      skill,
      position: 'during',
      integration_method: 'embedded',
      duration_minutes: Math.min(skill.practice_duration_range[0], routine.duration_minutes * 0.5),
      cue_design: createOptimalCue(skill, routine, 'during'),
      reward_integration: createRewardIntegration(skill, routine),
      difficulty_progression: createDifficultyProgression(skill, index)
    }));

    return {
      id: `embedded_${Date.now()}`,
      stack_name: `${routine.name} with Integrated Skills`,
      description: `Seamlessly integrate emotional skills into your ${routine.name} routine`,
      anchor_routine: routine,
      stacked_skills: stackedSkills,
      total_duration_minutes: routine.duration_minutes + 2, // Minimal time addition
      neuroplasticity_score: 0,
      trauma_informed_adaptations: createTraumaAdaptations(skills, 'embedded'),
      implementation_phases: createImplementationPhases(stackedSkills, 'embedded'),
      success_metrics: createSuccessMetrics(stackedSkills),
      optimization_recommendations: createOptimizationRecommendations(routine, stackedSkills, 'embedded')
    };
  };

  // Create a replacement habit stack (skill replaces part of routine)
  const createReplacementStack = async (routine: ExistingRoutine, skills: EmotionalSkill[]): Promise<HabitStack | null> => {
    if (routine.modification_flexibility < 60) return null; // User not open to modifications

    const replacementSkills = skills.filter(skill => 
      skill.practice_duration_range[0] <= routine.duration_minutes * 0.4 &&
      skill.nervous_system_requirements.optimal_arousal_state !== 'alert' || routine.energy_requirement === 'low'
    );

    if (replacementSkills.length === 0) return null;

    const stackedSkills: StackedSkill[] = replacementSkills.slice(0, 2).map((skill, index) => ({
      skill,
      position: 'replaces_part_of',
      integration_method: 'replacement',
      duration_minutes: Math.min(skill.practice_duration_range[1], routine.duration_minutes * 0.3),
      cue_design: createOptimalCue(skill, routine, 'replaces_part_of'),
      reward_integration: createRewardIntegration(skill, routine),
      difficulty_progression: createDifficultyProgression(skill, index)
    }));

    return {
      id: `replacement_${Date.now()}`,
      stack_name: `Enhanced ${routine.name}`,
      description: `Replace parts of your ${routine.name} routine with targeted emotional skills`,
      anchor_routine: routine,
      stacked_skills: stackedSkills,
      total_duration_minutes: routine.duration_minutes,
      neuroplasticity_score: 0,
      trauma_informed_adaptations: createTraumaAdaptations(skills, 'replacement'),
      implementation_phases: createImplementationPhases(stackedSkills, 'replacement'),
      success_metrics: createSuccessMetrics(stackedSkills),
      optimization_recommendations: createOptimizationRecommendations(routine, stackedSkills, 'replacement')
    };
  };

  // Helper functions for creating habit stacks
  const isNervousSystemCompatible = (skill: EmotionalSkill, state: PolyvagalState): boolean => {
    return state.window_of_tolerance.current_capacity >= skill.nervous_system_requirements.minimum_regulation_level;
  };

  const isTimeCompatible = (skill: EmotionalSkill, routine: ExistingRoutine): boolean => {
    return skill.practice_duration_range[0] <= routine.duration_minutes * 0.5;
  };

  const createOptimalCue = (skill: EmotionalSkill, routine: ExistingRoutine, position: string): CueDesign => {
    const cueTypes = {
      before: 'temporal',
      during: 'somatic',
      after: 'environmental',
      replaces_part_of: 'behavioral'
    };

    const cueDescriptions = {
      before: `Right before starting ${routine.name}`,
      during: `During a natural pause in ${routine.name}`,
      after: `Immediately after finishing ${routine.name}`,
      replaces_part_of: `Instead of the middle portion of ${routine.name}`
    };

    return {
      cue_type: cueTypes[position as keyof typeof cueTypes] as CueDesign['cue_type'],
      cue_description: cueDescriptions[position as keyof typeof cueDescriptions],
      cue_reliability: routine.consistency_score,
      trauma_safety_rating: routine.nervous_system_impact === 'regulating' ? 90 : 70,
      implementation_instructions: [
        'Set up environmental cue if needed',
        'Practice the cue-response connection',
        'Track successful cue recognition'
      ]
    };
  };

  const createRewardIntegration = (skill: EmotionalSkill, routine: ExistingRoutine): RewardIntegration => {
    return {
      intrinsic_reward_alignment: `Enhanced sense of ${skill.skill_name.toLowerCase()} during ${routine.name}`,
      dopamine_optimization: 'Small celebration after successful skill practice',
      celebration_moment: 'Acknowledge the neural growth happening',
      progress_recognition: 'Track improvements in skill and routine quality',
      social_sharing_opportunity: traumaInformed ? undefined : 'Share progress with support network'
    };
  };

  const createDifficultyProgression = (skill: EmotionalSkill, index: number): DifficultyProgression => {
    return {
      phase_1: {
        name: 'Introduction',
        duration_days: 7 + (index * 3),
        difficulty_level: 'beginner',
        success_criteria: ['Consistent cue recognition', 'Basic skill practice']
      },
      phase_2: {
        name: 'Development',
        duration_days: 14,
        difficulty_level: 'intermediate',
        success_criteria: ['Improved skill quality', 'Reduced effort required']
      },
      phase_3: {
        name: 'Integration',
        duration_days: 21,
        difficulty_level: 'advanced',
        success_criteria: ['Automatic activation', 'Skill transfer to other contexts']
      }
    };
  };

  const createTraumaAdaptations = (skills: EmotionalSkill[], stackType: string): TraumaAdaptation[] => {
    if (!traumaInformed) return [];

    return [
      {
        adaptation_type: 'choice_point',
        description: 'Always provide option to skip or modify practice',
        implementation: 'Include "not today" button and simpler alternatives',
        effectiveness_rating: 95
      },
      {
        adaptation_type: 'titration',
        description: 'Start with minimal doses and gradually increase',
        implementation: 'Begin with 30-second practices, increase by 30 seconds weekly',
        effectiveness_rating: 90
      },
      {
        adaptation_type: 'safety_modification',
        description: 'Ensure all practices feel safe and contained',
        implementation: 'Provide grounding techniques and exit strategies',
        effectiveness_rating: 85
      }
    ];
  };

  const createImplementationPhases = (stackedSkills: StackedSkill[], stackType: string): ImplementationPhase[] => {
    return [
      {
        phase_number: 1,
        phase_name: 'Foundation',
        duration_days: 14,
        goals: ['Establish basic habit linkage', 'Build cue recognition'],
        skills_introduced: stackedSkills.slice(0, 1).map(s => s.skill.skill_name),
        success_criteria: ['80% cue recognition', '60% practice completion'],
        common_challenges: ['Forgetting new skill', 'Resistance to change'],
        support_strategies: ['Environmental cues', 'Gentle reminders', 'Flexible expectations']
      },
      {
        phase_number: 2,
        phase_name: 'Development',
        duration_days: 21,
        goals: ['Increase skill quality', 'Add complexity if appropriate'],
        skills_introduced: stackedSkills.slice(1).map(s => s.skill.skill_name),
        success_criteria: ['70% practice completion', 'Noticeable skill improvement'],
        common_challenges: ['Plateau periods', 'Time pressure'],
        support_strategies: ['Progress tracking', 'Celebration moments', 'Adjustment options']
      },
      {
        phase_number: 3,
        phase_name: 'Integration',
        duration_days: 30,
        goals: ['Achieve automaticity', 'Expand to other contexts'],
        skills_introduced: ['Transfer skills', 'Advanced applications'],
        success_criteria: ['90% consistency', 'Skill transfer evidence'],
        common_challenges: ['Overconfidence', 'Context switching'],
        support_strategies: ['Maintenance planning', 'Challenge preparation', 'Success documentation']
      }
    ];
  };

  const createSuccessMetrics = (stackedSkills: StackedSkill[]): SuccessMetric[] => {
    return [
      {
        metric_name: 'Habit Stack Consistency',
        measurement_method: 'Daily completion tracking',
        baseline_value: 0,
        target_value: 80,
        tracking_frequency: 'daily',
        neuroplasticity_correlation: 'Synaptic strengthening through repetition'
      },
      {
        metric_name: 'Emotional Regulation Improvement',
        measurement_method: 'Weekly emotional regulation self-assessment',
        baseline_value: currentNervousSystemState.window_of_tolerance.current_capacity,
        target_value: Math.min(100, currentNervousSystemState.window_of_tolerance.current_capacity + 20),
        tracking_frequency: 'weekly',
        neuroplasticity_correlation: 'Prefrontal-amygdala pathway strengthening'
      },
      {
        metric_name: 'Skill Automaticity',
        measurement_method: 'Cognitive load assessment during practice',
        baseline_value: 90, // High initial effort
        target_value: 30, // Low effort when automatic
        tracking_frequency: 'weekly',
        neuroplasticity_correlation: 'Basal ganglia automation and myelin development'
      }
    ];
  };

  const createOptimizationRecommendations = (
    routine: ExistingRoutine, 
    stackedSkills: StackedSkill[], 
    stackType: string
  ): OptimizationRecommendation[] => {
    return [
      {
        recommendation_type: 'timing',
        description: 'Consider practicing during your chronotype peak hours',
        scientific_rationale: 'Circadian rhythms affect neuroplasticity and learning efficiency',
        implementation_difficulty: 'easy',
        expected_impact: 75
      },
      {
        recommendation_type: 'environment',
        description: 'Use consistent environmental cues to strengthen associations',
        scientific_rationale: 'Environmental context strengthens memory consolidation',
        implementation_difficulty: 'moderate',
        expected_impact: 65
      },
      {
        recommendation_type: 'nervous_system',
        description: 'Monitor nervous system state before practice for optimal timing',
        scientific_rationale: 'Learning is most effective when nervous system is regulated',
        implementation_difficulty: 'moderate',
        expected_impact: 80
      }
    ];
  };

  const calculateNeuroplasticityScore = (stack: HabitStack, nervousSystemState: PolyvagalState): number => {
    let score = 0;
    
    // Base score from routine anchor strength
    score += stack.anchor_routine.consistency_score * 0.3;
    
    // Score from nervous system compatibility
    const nsCompatibility = nervousSystemState.window_of_tolerance.current_capacity >= 60 ? 85 : 60;
    score += nsCompatibility * 0.2;
    
    // Score from skill synergy
    const skillSynergy = stack.stacked_skills.reduce((total, skill) => {
      return total + (skill.skill.neuroplasticity_factors.synaptic_strengthening_potential * 0.1);
    }, 0);
    score += skillSynergy * 0.3;
    
    // Score from implementation quality
    const implementationQuality = stack.implementation_phases.length * 15; // Phases indicate thorough planning
    score += implementationQuality * 0.2;
    
    return Math.min(100, Math.round(score));
  };

  const renderRoutineSelection = () => (
    <Card className="p-6">
      <h3 className="text-xl font-light text-sage-800 mb-4">
        Choose Your Anchor Routine
      </h3>
      <p className="text-sage-600 mb-6">
        Select a routine you already do consistently. We'll help you attach emotional skills to it.
      </p>
      
      <div className="space-y-4">
        {existingRoutines.map(routine => (
          <div
            key={routine.id}
            onClick={() => setSelectedRoutine(routine)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedRoutine?.id === routine.id
                ? 'border-sage-500 bg-sage-50'
                : 'border-sage-200 hover:border-sage-300'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-sage-800">{routine.name}</h4>
              <div className="flex items-center space-x-2">
                <div className={`px-2 py-1 rounded text-xs ${
                  routine.consistency_score >= 80 ? 'bg-green-100 text-green-800' :
                  routine.consistency_score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {routine.consistency_score}% consistent
                </div>
                <div className="text-sm text-sage-600">
                  {routine.duration_minutes}min
                </div>
              </div>
            </div>
            <p className="text-sm text-sage-600 mb-2">{routine.description}</p>
            <div className="flex items-center space-x-4 text-xs text-sage-500">
              <span>{routine.frequency}</span>
              <span>{routine.time_of_day}</span>
              <span className={`px-2 py-1 rounded ${
                routine.nervous_system_impact === 'regulating' ? 'bg-green-50 text-green-700' :
                routine.nervous_system_impact === 'activating' ? 'bg-blue-50 text-blue-700' :
                routine.nervous_system_impact === 'depleting' ? 'bg-red-50 text-red-700' :
                'bg-gray-50 text-gray-700'
              }`}>
                {routine.nervous_system_impact}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <Button
          onClick={() => setStackingPhase('skill_selection')}
          disabled={!selectedRoutine}
          className="bg-sage-600 hover:bg-sage-700 text-white px-6 py-2 rounded-lg"
        >
          Next: Choose Skills
        </Button>
      </div>
    </Card>
  );

  const renderSkillSelection = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-light text-sage-800">
          Select Emotional Skills
        </h3>
        <Button
          variant="outline"
          onClick={() => setStackingPhase('routine_selection')}
          className="text-sm"
        >
          Back
        </Button>
      </div>
      
      <p className="text-sage-600 mb-6">
        Choose emotional skills to practice. We'll find the best way to integrate them with your {selectedRoutine?.name} routine.
      </p>
      
      <div className="space-y-4">
        {emotionalSkillsToLearn.map(skill => {
          const isSelected = selectedSkills.some(s => s.id === skill.id);
          const isCompatible = isNervousSystemCompatible(skill, currentNervousSystemState);
          
          return (
            <div
              key={skill.id}
              onClick={() => {
                if (isCompatible) {
                  if (isSelected) {
                    setSelectedSkills(prev => prev.filter(s => s.id !== skill.id));
                  } else {
                    setSelectedSkills(prev => [...prev, skill]);
                  }
                }
              }}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-sage-500 bg-sage-50'
                  : isCompatible
                    ? 'border-sage-200 hover:border-sage-300'
                    : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-sage-800">{skill.skill_name}</h4>
                <div className="flex items-center space-x-2">
                  <div className={`px-2 py-1 rounded text-xs ${
                    skill.complexity_level === 'beginner' ? 'bg-green-100 text-green-800' :
                    skill.complexity_level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {skill.complexity_level}
                  </div>
                  <div className="text-sm text-sage-600">
                    {skill.practice_duration_range[0]}-{skill.practice_duration_range[1]}min
                  </div>
                </div>
              </div>
              <p className="text-sm text-sage-600 mb-2">{skill.description}</p>
              <div className="text-xs text-sage-500">
                Targets: {skill.target_brain_regions.join(', ')}
              </div>
              {!isCompatible && (
                <div className="mt-2 text-xs text-red-600">
                  Requires higher nervous system regulation ({skill.nervous_system_requirements.minimum_regulation_level}% needed)
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-6">
        <Button
          onClick={() => setStackingPhase('integration_design')}
          disabled={selectedSkills.length === 0}
          className="bg-sage-600 hover:bg-sage-700 text-white px-6 py-2 rounded-lg"
        >
          Next: Design Integration
        </Button>
      </div>
    </Card>
  );

  const renderIntegrationDesign = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-light text-sage-800">
          Design Your Integration
        </h3>
        <Button
          variant="outline"
          onClick={() => setStackingPhase('skill_selection')}
          className="text-sm"
        >
          Back
        </Button>
      </div>
      
      <p className="text-sage-600 mb-6">
        Let's create scientifically-optimized habit stacks that work with your brain's natural learning patterns.
      </p>
      
      <div className="bg-gradient-to-r from-sage-50 to-sage-100 p-6 rounded-lg mb-6">
        <div className="flex items-center mb-3">
          <span className="text-sage-600 text-lg mr-2">🧠</span>
          <h4 className="font-medium text-sage-800">Neuroplasticity Optimization</h4>
        </div>
        <div className="text-sm text-sage-700 space-y-2">
          <p>• Using your existing routine as a neural anchor (leveraging established pathways)</p>
          <p>• Applying spaced repetition for optimal synaptic strengthening</p>
          <p>• Designing cues that work with your nervous system state</p>
          <p>• Building in celebration moments for dopamine reinforcement</p>
        </div>
      </div>
      
      <div className="text-center">
        <Button
          onClick={generateHabitStacks}
          disabled={isGenerating}
          className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3 rounded-lg text-lg"
        >
          {isGenerating ? 'Generating Stack Options...' : 'Generate Habit Stacks'}
        </Button>
      </div>
    </Card>
  );

  const renderStackReview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-light text-sage-800">
          Your Personalized Habit Stacks
        </h3>
        <Button
          variant="outline"
          onClick={() => setStackingPhase('integration_design')}
          className="text-sm"
        >
          Generate New Options
        </Button>
      </div>
      
      {generatedStacks.map(stack => (
        <Card key={stack.id} className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-medium text-sage-800 mb-2">
                {stack.stack_name}
              </h4>
              <p className="text-sage-600 text-sm">
                {stack.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-light text-sage-800">
                {stack.neuroplasticity_score}%
              </div>
              <div className="text-xs text-sage-600">
                Neuroplasticity Score
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-sage-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-sage-800 mb-1">
                Duration
              </div>
              <div className="text-lg text-sage-700">
                {stack.total_duration_minutes} min
              </div>
            </div>
            <div className="bg-sage-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-sage-800 mb-1">
                Skills Included
              </div>
              <div className="text-lg text-sage-700">
                {stack.stacked_skills.length}
              </div>
            </div>
            <div className="bg-sage-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-sage-800 mb-1">
                Implementation
              </div>
              <div className="text-lg text-sage-700">
                {stack.implementation_phases.length} phases
              </div>
            </div>
          </div>
          
          <div className="space-y-3 mb-6">
            <h5 className="font-medium text-sage-800">Stacked Skills:</h5>
            {stack.stacked_skills.map((stackedSkill, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium text-sage-800">
                    {stackedSkill.skill.skill_name}
                  </div>
                  <div className="text-sm text-sage-600">
                    {stackedSkill.position} {selectedRoutine?.name} • {stackedSkill.integration_method}
                  </div>
                </div>
                <div className="text-sm text-sage-600">
                  {stackedSkill.duration_minutes}min
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex space-x-4">
            <Button
              onClick={() => setSelectedStack(stack)}
              variant="outline"
              className="flex-1"
            >
              View Details
            </Button>
            <Button
              onClick={() => onHabitStackCreated(stack)}
              className="flex-1 bg-sage-600 hover:bg-sage-700 text-white"
            >
              Choose This Stack
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderStackDetails = () => {
    if (!selectedStack) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-light text-sage-800">
            {selectedStack.stack_name} Details
          </h3>
          <Button
            variant="outline"
            onClick={() => setSelectedStack(null)}
            className="text-sm"
          >
            Back to Options
          </Button>
        </div>

        <Card className="p-6">
          <h4 className="font-medium text-sage-800 mb-4">Implementation Phases</h4>
          <div className="space-y-4">
            {selectedStack.implementation_phases.map(phase => (
              <div key={phase.phase_number} className="border-l-4 border-sage-400 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-sage-800">
                    Phase {phase.phase_number}: {phase.phase_name}
                  </h5>
                  <div className="text-sm text-sage-600">
                    {phase.duration_days} days
                  </div>
                </div>
                <div className="text-sm text-sage-600 space-y-1">
                  <div><strong>Goals:</strong> {phase.goals.join(', ')}</div>
                  <div><strong>Success Criteria:</strong> {phase.success_criteria.join(', ')}</div>
                  <div><strong>Support:</strong> {phase.support_strategies.join(', ')}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="font-medium text-sage-800 mb-4">Success Metrics</h4>
          <div className="space-y-4">
            {selectedStack.success_metrics.map((metric, index) => (
              <div key={index} className="p-4 bg-sage-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-sage-800">{metric.metric_name}</h5>
                  <div className="text-sm text-sage-600">
                    {metric.tracking_frequency}
                  </div>
                </div>
                <div className="text-sm text-sage-600 space-y-1">
                  <div>Target: {metric.baseline_value} → {metric.target_value}</div>
                  <div>Method: {metric.measurement_method}</div>
                  <div className="italic">Neural connection: {metric.neuroplasticity_correlation}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {traumaInformed && (
          <Card className="p-6">
            <h4 className="font-medium text-sage-800 mb-4">Trauma-Informed Adaptations</h4>
            <div className="space-y-3">
              {selectedStack.trauma_informed_adaptations.map((adaptation, index) => (
                <div key={index} className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-blue-800 capitalize">
                      {adaptation.adaptation_type.replace('_', ' ')}
                    </h5>
                    <div className="text-sm text-blue-600">
                      {adaptation.effectiveness_rating}% effective
                    </div>
                  </div>
                  <div className="text-sm text-blue-700">
                    <div className="mb-1">{adaptation.description}</div>
                    <div className="italic">{adaptation.implementation}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="text-center">
          <Button
            onClick={() => onHabitStackCreated(selectedStack)}
            className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3 rounded-lg text-lg"
          >
            Start This Habit Stack
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          {['routine_selection', 'skill_selection', 'integration_design', 'review'].map((phase, index) => (
            <React.Fragment key={phase}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                stackingPhase === phase
                  ? 'bg-sage-600 text-white'
                  : index < ['routine_selection', 'skill_selection', 'integration_design', 'review'].indexOf(stackingPhase)
                    ? 'bg-sage-400 text-white'
                    : 'bg-sage-200 text-sage-600'
              }`}>
                {index + 1}
              </div>
              {index < 3 && (
                <div className={`w-12 h-1 rounded ${
                  index < ['routine_selection', 'skill_selection', 'integration_design', 'review'].indexOf(stackingPhase)
                    ? 'bg-sage-400'
                    : 'bg-sage-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Phase Content */}
      {selectedStack ? renderStackDetails() :
       stackingPhase === 'routine_selection' ? renderRoutineSelection() :
       stackingPhase === 'skill_selection' ? renderSkillSelection() :
       stackingPhase === 'integration_design' ? renderIntegrationDesign() :
       stackingPhase === 'review' ? renderStackReview() : null}
    </div>
  );
};

// Additional interface definitions
interface DifficultyProgression {
  phase_1: {
    name: string;
    duration_days: number;
    difficulty_level: string;
    success_criteria: string[];
  };
  phase_2: {
    name: string;
    duration_days: number;
    difficulty_level: string;
    success_criteria: string[];
  };
  phase_3: {
    name: string;
    duration_days: number;
    difficulty_level: string;
    success_criteria: string[];
  };
}

export default HabitStackBuilder;