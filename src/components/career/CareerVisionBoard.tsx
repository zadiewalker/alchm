// ALCHM Career Vision Board
// Interactive, AI-enhanced vision board for career planning and future visualization

'use client';

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  CareerVisionBoard,
  VisionElement,
  FutureScenario,
  AspirationalRole,
  LifestyleGoal,
  ImpactVision,
  CareerJourney,
  SMARTGoal
} from '@/types/career-schema';
import { IdentityJourney, CulturalContext } from '@/types/identity-schema';

interface CareerVisionBoardProps {
  userId: string;
  careerJourney: CareerJourney;
  identityJourney: IdentityJourney;
  visionBoard?: CareerVisionBoard;
  smartGoals: SMARTGoal[];
  onUpdateVisionBoard: (visionBoard: CareerVisionBoard) => void;
  onCreateSmartGoal: (goalData: Omit<SMARTGoal, 'goalId' | 'createdAt' | 'updatedAt'>) => void;
  onConnectGoalToVision: (goalId: string, visionElementId: string) => void;
  culturalSensitivityMode: boolean;
  mentorshipMode: boolean;
  collaborativeMode: boolean;
}

interface VisionBoardState {
  viewMode: 'canvas' | 'timeline' | 'scenarios' | 'goals_integration' | 'cultural_alignment';
  editMode: boolean;
  selectedElement: VisionElement | null;
  selectedTimeframe: '1_year' | '3_years' | '5_years' | '10_years' | 'lifetime';
  canvasZoom: number;
  canvasOffset: { x: number; y: number };
  showConnections: boolean;
  showCulturalElements: boolean;
  showIdentityAlignment: boolean;
  draggedElement: VisionElement | null;
  isDragging: boolean;
  aiSuggestions: VisionSuggestion[];
  inspirationSources: InspirationSource[];
  realityCheckMode: boolean;
  collaborativeElements: CollaborativeElement[];
}

interface VisionSuggestion {
  id: string;
  type: 'role_suggestion' | 'lifestyle_goal' | 'impact_opportunity' | 'skill_development' | 'network_building' | 'cultural_integration';
  title: string;
  description: string;
  confidence: number; // 0-1
  alignmentScore: number; // 0-1
  source: 'ai_analysis' | 'career_matching' | 'identity_integration' | 'cultural_wisdom' | 'peer_inspiration';
  timeframe: string;
  feasibility: number; // 0-1
  culturalRelevance: number; // 0-1
  identityResonance: number; // 0-1
  actionSteps: string[];
  resources: string[];
  relatedGoals: string[];
}

interface InspirationSource {
  id: string;
  type: 'role_model' | 'success_story' | 'cultural_figure' | 'community_leader' | 'innovative_career';
  name: string;
  description: string;
  culturalBackground: string[];
  careerPath: string[];
  keyLessons: string[];
  inspirationalQuote: string;
  relevanceToUser: number; // 0-1
  motivationalImpact: number; // 0-1
  accessibilityOfPath: number; // 0-1
}

interface CollaborativeElement {
  id: string;
  contributorId: string;
  contributorName: string;
  elementType: 'suggestion' | 'feedback' | 'resource' | 'connection';
  content: string;
  supportLevel: number; // 1-5
  culturalAlignment: number; // 0-1
  expertise: string[];
  timestamp: Date;
}

export const CareerVisionBoardComponent: React.FC<CareerVisionBoardProps> = ({
  userId,
  careerJourney,
  identityJourney,
  visionBoard,
  smartGoals,
  onUpdateVisionBoard,
  onCreateSmartGoal,
  onConnectGoalToVision,
  culturalSensitivityMode,
  mentorshipMode,
  collaborativeMode
}) => {
  
  const [state, setState] = useState<VisionBoardState>({
    viewMode: 'canvas',
    editMode: false,
    selectedElement: null,
    selectedTimeframe: '3_years',
    canvasZoom: 1,
    canvasOffset: { x: 0, y: 0 },
    showConnections: true,
    showCulturalElements: culturalSensitivityMode,
    showIdentityAlignment: true,
    draggedElement: null,
    isDragging: false,
    aiSuggestions: [],
    inspirationSources: [],
    realityCheckMode: false,
    collaborativeElements: []
  });

  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 });

  // Initialize or create vision board
  const activeVisionBoard = useMemo(() => {
    if (visionBoard) return visionBoard;
    
    return {
      boardId: `vision_${userId}_${Date.now()}`,
      userId,
      title: 'My Career Vision',
      description: 'A visual representation of my career aspirations and future goals',
      visionElements: [],
      futureScenarios: [],
      aspirationalRoles: [],
      lifestyleGoals: [],
      impactVision: [],
      timeframes: [
        { period: '1_year', title: 'Next Year', description: 'Immediate goals and steps' },
        { period: '3_years', title: '3 Years', description: 'Medium-term career development' },
        { period: '5_years', title: '5 Years', description: 'Established career position' },
        { period: '10_years', title: '10 Years', description: 'Long-term vision and impact' }
      ],
      culturalVisionIntegration: {
        culturalValues: identityJourney.culturalContext.valueSystem || [],
        culturalCareerPaths: [],
        culturalWisdomElements: [],
        familyCommunityExpectations: [],
        culturalBarrierAddressing: []
      },
      identityVisionAlignment: {
        personalIdentityElements: identityJourney.identityMap.personal.map(p => p.elementId),
        culturalIdentityElements: identityJourney.identityMap.cultural.map(c => c.culturalDimension),
        aspirationalIdentityElements: identityJourney.identityMap.aspirational.map(a => a.aspiration),
        identityGrowthVision: [],
        authenticityMeasures: []
      },
      valuesExpression: careerJourney.values.map(v => ({
        valueName: v.valueName,
        expressionMethods: [],
        careerIntegration: [],
        lifestyle: [],
        impactChannels: []
      })),
      visualAssets: [],
      inspirationSources: [],
      manifestationStrategy: {
        approachType: 'integrated',
        techniques: ['visualization', 'goal_setting', 'action_planning'],
        culturalPractices: [],
        communityEngagement: [],
        mentoringIntegration: []
      },
      progressVisualization: {
        trackingMethod: 'milestone_based',
        visualFormat: 'journey_map',
        celebrationPlans: [],
        adjustmentTriggers: []
      },
      adaptabilityPlan: {
        flexibilityAreas: [],
        pivotStrategies: [],
        emergencyOptions: [],
        supportSystems: []
      },
      sharingPreferences: {
        visibilityLevel: 'private',
        communitySharing: false,
        mentorAccess: mentorshipMode,
        collaborativeElements: collaborativeMode
      },
      communityFeedback: [],
      mentorGuidance: [],
      realityChecks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      lastReviewedAt: new Date(),
      isActive: true
    } as CareerVisionBoard;
  }, [visionBoard, userId, identityJourney, careerJourney, mentorshipMode, collaborativeMode]);

  // Filter vision elements by timeframe
  const filteredVisionElements = useMemo(() => {
    return activeVisionBoard.visionElements.filter(element => 
      element.timeframe === state.selectedTimeframe || element.timeframe === 'all'
    );
  }, [activeVisionBoard.visionElements, state.selectedTimeframe]);

  // Generate AI suggestions based on current context
  const generateAISuggestions = useCallback(async () => {
    // In real implementation, this would call AI services
    const suggestions: VisionSuggestion[] = [
      {
        id: 'suggestion_1',
        type: 'role_suggestion',
        title: 'Senior Data Scientist',
        description: 'Leadership role combining technical expertise with strategic vision',
        confidence: 0.85,
        alignmentScore: 0.9,
        source: 'career_matching',
        timeframe: '3_years',
        feasibility: 0.8,
        culturalRelevance: 0.9,
        identityResonance: 0.85,
        actionSteps: [
          'Complete advanced machine learning certification',
          'Lead 2-3 high-impact projects',
          'Develop mentoring and leadership skills'
        ],
        resources: ['Online courses', 'Professional mentors', 'Project opportunities'],
        relatedGoals: smartGoals.filter(g => g.category === 'skill_development').map(g => g.goalId)
      },
      {
        id: 'suggestion_2',
        type: 'impact_opportunity',
        title: 'Community Data Literacy Program',
        description: 'Use data skills to create educational programs for underserved communities',
        confidence: 0.7,
        alignmentScore: 0.95,
        source: 'identity_integration',
        timeframe: '5_years',
        feasibility: 0.75,
        culturalRelevance: 0.95,
        identityResonance: 0.9,
        actionSteps: [
          'Partner with community organizations',
          'Develop curriculum for data literacy',
          'Secure funding for program sustainability'
        ],
        resources: ['Community partnerships', 'Grant opportunities', 'Volunteer support'],
        relatedGoals: []
      }
    ];

    setState(prev => ({ ...prev, aiSuggestions: suggestions }));
  }, [smartGoals]);

  // Load inspiration sources
  const loadInspirationSources = useCallback(async () => {
    // In real implementation, this would fetch from API
    const sources: InspirationSource[] = [
      {
        id: 'inspiration_1',
        type: 'role_model',
        name: 'Dr. Fei-Fei Li',
        description: 'AI researcher, educator, and advocate for diversity in tech',
        culturalBackground: ['Chinese-American'],
        careerPath: ['PhD Computer Science', 'Professor Stanford', 'Chief Scientist Google', 'Co-Director Stanford HAI'],
        keyLessons: [
          'Bridge technical excellence with social impact',
          'Use privilege to create opportunities for others',
          'Stay connected to cultural values while pursuing global impact'
        ],
        inspirationalQuote: 'The AI revolution will be most successful if we can bridge our humanity and our technology.',
        relevanceToUser: 0.9,
        motivationalImpact: 0.85,
        accessibilityOfPath: 0.7
      }
    ];

    setState(prev => ({ ...prev, inspirationSources: sources }));
  }, []);

  // Initialize AI suggestions and inspiration
  useEffect(() => {
    generateAISuggestions();
    loadInspirationSources();
  }, [generateAISuggestions, loadInspirationSources]);

  // Handle vision element creation
  const createVisionElement = useCallback((
    type: VisionElement['type'],
    position: { x: number; y: number }
  ) => {
    const newElement: VisionElement = {
      elementId: `element_${Date.now()}`,
      type,
      title: `New ${type.replace('_', ' ')}`,
      description: '',
      position,
      size: type === 'central_vision' ? { width: 200, height: 150 } : { width: 160, height: 120 },
      color: type === 'central_vision' ? '#3498db' : '#2ecc71',
      timeframe: state.selectedTimeframe,
      priority: 'medium',
      feasibility: 0.7,
      emotionalResonance: 0.8,
      culturalAlignment: 0.8,
      identityConnection: [],
      valuesAlignment: [],
      skillRequirements: [],
      resourceNeeds: [],
      connectionPoints: [],
      progressIndicators: [],
      inspirationSource: null,
      realityCheckNotes: '',
      communityFeedback: [],
      mentorGuidance: [],
      isPubliclyShared: false,
      lastUpdated: new Date()
    };

    const updatedBoard = {
      ...activeVisionBoard,
      visionElements: [...activeVisionBoard.visionElements, newElement],
      updatedAt: new Date()
    };

    onUpdateVisionBoard(updatedBoard);
    setState(prev => ({ ...prev, selectedElement: newElement, editMode: true }));
  }, [activeVisionBoard, onUpdateVisionBoard, state.selectedTimeframe]);

  // Handle element editing
  const updateVisionElement = useCallback((
    elementId: string,
    updates: Partial<VisionElement>
  ) => {
    const updatedElements = activeVisionBoard.visionElements.map(element =>
      element.elementId === elementId
        ? { ...element, ...updates, lastUpdated: new Date() }
        : element
    );

    const updatedBoard = {
      ...activeVisionBoard,
      visionElements: updatedElements,
      updatedAt: new Date()
    };

    onUpdateVisionBoard(updatedBoard);

    if (state.selectedElement?.elementId === elementId) {
      setState(prev => ({
        ...prev,
        selectedElement: { ...state.selectedElement, ...updates }
      }));
    }
  }, [activeVisionBoard, onUpdateVisionBoard, state.selectedElement]);

  // Handle drag and drop
  const handleMouseDown = useCallback((
    event: React.MouseEvent,
    element: VisionElement
  ) => {
    if (!state.editMode) return;

    event.preventDefault();
    setState(prev => ({
      ...prev,
      draggedElement: element,
      isDragging: true
    }));
  }, [state.editMode]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!state.isDragging || !state.draggedElement) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (event.clientX - rect.left - state.canvasOffset.x) / state.canvasZoom;
    const y = (event.clientY - rect.top - state.canvasOffset.y) / state.canvasZoom;

    updateVisionElement(state.draggedElement.elementId, {
      position: { x: x - state.draggedElement.size.width / 2, y: y - state.draggedElement.size.height / 2 }
    });
  }, [state.isDragging, state.draggedElement, state.canvasOffset, state.canvasZoom, updateVisionElement]);

  const handleMouseUp = useCallback(() => {
    setState(prev => ({
      ...prev,
      draggedElement: null,
      isDragging: false
    }));
  }, []);

  // Connect vision element to SMART goal
  const connectToGoal = useCallback((visionElementId: string, goalId: string) => {
    onConnectGoalToVision(goalId, visionElementId);

    // Update vision element with goal connection
    updateVisionElement(visionElementId, {
      connectionPoints: [
        ...(activeVisionBoard.visionElements
          .find(e => e.elementId === visionElementId)?.connectionPoints || []),
        {
          type: 'smart_goal',
          targetId: goalId,
          connectionStrength: 0.8,
          bidirectional: true
        }
      ]
    });
  }, [activeVisionBoard.visionElements, onConnectGoalToVision, updateVisionElement]);

  // Generate SMART goal from vision element
  const generateGoalFromVision = useCallback((element: VisionElement) => {
    const goalData = {
      userId,
      category: 'career_transition' as const,
      goalTitle: `Achieve ${element.title}`,
      goalDescription: `Work towards realizing the vision: ${element.description}`,
      specific: {
        whatSpecifically: element.title,
        whyImportant: element.description,
        whoInvolved: ['self'],
        whereOccurs: 'Various contexts',
        whichResources: element.resourceNeeds || [],
        constraints: [],
        requirements: element.skillRequirements || [],
        scope: element.description,
        boundaries: []
      },
      measurable: [{
        metricName: 'Progress towards vision',
        metricType: 'qualitative' as const,
        currentValue: 0,
        targetValue: 100,
        unit: 'percentage',
        measurementMethod: 'Self-assessment and milestone tracking',
        frequency: 'monthly',
        dataSource: ['self-reflection', 'mentor feedback'],
        trackingTools: ['vision board updates', 'progress journal'],
        validationCriteria: ['milestone achievements', 'skill development', 'opportunity creation']
      }],
      achievable: {
        feasibilityScore: element.feasibility,
        resourceAvailability: {
          available: [],
          required: element.resourceNeeds || [],
          gaps: []
        },
        skillRequirements: element.skillRequirements?.map(skill => ({
          skillName: skill,
          currentLevel: 5,
          requiredLevel: 8,
          developmentPlan: `Develop ${skill} through practice and learning`,
          timeline: '6 months',
          resources: ['online courses', 'practice projects'],
          milestones: [`Basic ${skill}`, `Intermediate ${skill}`, `Advanced ${skill}`]
        })) || [],
        timeRequirements: {
          hoursPerWeek: 10,
          totalHours: 200,
          timeline: '6-12 months',
          flexibility: 'moderate'
        },
        supportSystemNeeds: ['mentor', 'peer support'],
        riskFactors: [],
        contingencyPlans: [],
        successPredictors: [],
        challengesPredicted: [],
        mitigationStrategies: []
      },
      relevant: {
        careerGoalsAlignment: 0.9,
        personalValuesAlignment: element.valuesAlignment?.reduce((acc, curr) => acc + curr, 0) / (element.valuesAlignment?.length || 1) || 0.8,
        lifeCircumstancesAlignment: 0.8,
        culturalAlignment: element.culturalAlignment,
        identityAlignment: 0.85,
        marketRelevance: 0.8,
        timingAppropriate: true,
        priorityLevel: element.priority as 'high' | 'medium' | 'low' | 'critical',
        impactOnOtherGoals: [],
        opportunityCost: {
          alternatives: [],
          benefits: [],
          costs: []
        },
        synergies: []
      },
      timeBound: {
        startDate: new Date(),
        targetEndDate: new Date(Date.now() + (element.timeframe === '1_year' ? 365 : element.timeframe === '3_years' ? 1095 : 1825) * 24 * 60 * 60 * 1000),
        timeframeType: 'flexible' as const,
        totalDuration: element.timeframe === '1_year' ? '1 year' : element.timeframe === '3_years' ? '3 years' : '5 years',
        phaseBreakdown: [],
        criticalPath: [],
        dependencies: [],
        bufferTime: 20,
        checkpointSchedule: [],
        urgencyLevel: 'medium' as const,
        deadlineFlexibility: 'moderate' as const
      },
      culturallyAligned: {
        culturalValues: identityJourney.culturalContext.valueSystem || [],
        culturalPractices: [],
        communityBenefit: '',
        familyConsiderations: [],
        culturalBarriers: [],
        culturalSupports: []
      },
      identityIntegrated: {
        identityElements: element.identityConnection || [],
        authenticityMeasures: [],
        identityGrowthPotential: '',
        valueExpressionMethods: [],
        identityConflictResolution: []
      },
      valuesDriven: careerJourney.values.map(v => ({
        valueName: v.valueName,
        alignmentLevel: v.importance / 10,
        expressionMethods: [],
        priorityInGoal: v.importance
      })),
      actionPlan: {
        phases: [],
        majorMilestones: [],
        keyActivities: [],
        resourceAllocation: [],
        timeline: [],
        dependencies: [],
        criticalPath: [],
        riskMitigation: [],
        qualityAssurance: [],
        communicationPlan: [],
        adaptationMechanisms: []
      },
      resourceRequirements: element.resourceNeeds?.map(resource => ({
        resourceType: 'skill' as const,
        resourceName: resource,
        quantity: 1,
        timeline: 'ongoing',
        priority: 'high' as const,
        alternatives: [],
        costEstimate: 0,
        availabilityCheck: true,
        acquisitionPlan: `Develop ${resource} through learning and practice`
      })) || [],
      skillDevelopmentNeeds: element.skillRequirements?.map(skill => ({
        skillArea: skill,
        currentLevel: 5,
        targetLevel: 8,
        developmentPlan: `Structured learning plan for ${skill}`,
        timeline: '6 months',
        resources: ['courses', 'practice'],
        milestones: [`Basic ${skill}`, `Advanced ${skill}`]
      })) || [],
      mentorshipNeeds: [],
      accountabilitySystem: {
        accountabilityPartner: 'mentor',
        checkInFrequency: 'bi-weekly',
        reportingMethod: 'progress updates',
        consequencesSystem: [],
        rewardsSystem: [],
        trackingTools: ['vision board', 'progress journal'],
        escalationProcedure: []
      },
      progressTracking: {
        trackingMethod: 'milestone' as const,
        frequency: 'monthly',
        metrics: ['skill development', 'opportunity creation'],
        tools: ['self-assessment', 'mentor feedback'],
        reportingSchedule: [],
        reviewCycle: 'quarterly',
        adjustmentTriggers: [],
        dataCollection: [],
        analysisMethod: 'qualitative review',
        dashboardSetup: false
      },
      riskMitigation: {
        identifiedRisks: [],
        preventativeMeasures: [],
        contingencyPlans: [],
        monitoringSystem: [],
        escalationProcedures: [],
        recoveryStrategies: [],
        riskOwnership: [],
        reviewSchedule: 'quarterly'
      },
      adaptationMechanisms: [],
      milestones: [
        {
          milestoneId: `milestone_${Date.now()}`,
          title: `Initial progress towards ${element.title}`,
          description: 'First steps taken towards vision realization',
          targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          category: 'progress' as const,
          importance: 'high' as const,
          dependencies: [],
          successCriteria: ['Vision element further defined', 'Initial action steps taken'],
          deliverables: [],
          resources: [],
          timeEstimate: '3 months',
          riskFactors: [],
          celebrationPlan: 'Acknowledge progress and reflect on learnings',
          isCompleted: false,
          completionDate: undefined,
          notes: ''
        }
      ],
      deadlines: [],
      checkpoints: [],
      celebrations: [],
      careerRoleAlignment: [],
      visionBoardConnection: [element.elementId],
      projectPortfolioIntegration: [],
      learningPathAlignment: [],
      networkingGoals: [],
      status: 'draft' as const,
      priority: element.priority as 'high' | 'medium' | 'low' | 'critical',
      difficulty: 'intermediate' as const,
      confidence: element.feasibility,
      motivation: element.emotionalResonance * 10,
      energy: 8,
      reflections: [],
      lessonsLearned: [],
      unexpectedOutcomes: [],
      pivotPoints: [],
      isSharedPublicly: false,
      communitySupport: {
        communityGroup: '',
        supportType: [],
        engagementLevel: 'moderate',
        feedbackDesired: true,
        celebrationSharing: true,
        challengeSupport: true,
        accountabilityBuddy: false,
        mentorshipCircle: false,
        progressSharing: true,
        learningSharing: true
      },
      mentorInvolvement: {
        mentorId: '',
        mentorRole: 'advisor' as const,
        involvementLevel: 'periodic',
        guidanceAreas: ['strategy', 'accountability'],
        meetingFrequency: 'bi-weekly',
        communicationStyle: 'structured',
        feedbackType: ['progress', 'strategy'],
        boundarySettings: []
      },
      collaborationOpportunities: [],
      targetCompletionDate: new Date(Date.now() + (element.timeframe === '1_year' ? 365 : element.timeframe === '3_years' ? 1095 : 1825) * 24 * 60 * 60 * 1000),
      lastReviewedAt: new Date(),
      totalTimeInvested: 0
    } as Omit<SMARTGoal, 'goalId' | 'createdAt' | 'updatedAt'>;

    onCreateSmartGoal(goalData);
  }, [userId, identityJourney.culturalContext, careerJourney.values, onCreateSmartGoal]);

  // Render vision element
  const renderVisionElement = useCallback((element: VisionElement) => {
    const isSelected = state.selectedElement?.elementId === element.elementId;
    const connectedGoals = smartGoals.filter(goal => 
      goal.visionBoardConnection?.includes(element.elementId)
    );

    return (
      <div
        key={element.elementId}
        style={{
          position: 'absolute',
          left: element.position.x,
          top: element.position.y,
          width: element.size.width,
          height: element.size.height,
          backgroundColor: element.color,
          border: isSelected ? '3px solid #e74c3c' : '2px solid #bdc3c7',
          borderRadius: '12px',
          padding: '12px',
          cursor: state.editMode ? 'move' : 'pointer',
          transform: state.canvasZoom !== 1 ? `scale(${state.canvasZoom})` : 'none',
          transformOrigin: 'top left',
          boxShadow: isSelected ? '0 6px 20px rgba(231, 76, 60, 0.3)' : '0 4px 12px rgba(0,0,0,0.1)',
          transition: 'all 0.2s ease',
          overflow: 'hidden'
        }}
        onClick={() => setState(prev => ({ ...prev, selectedElement: element }))}
        onMouseDown={(e) => handleMouseDown(e, element)}
      >
        {/* Element header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: 'white',
            opacity: 0.9
          }}>
            {element.type.replace('_', ' ').toUpperCase()}
          </div>
          {element.priority && (
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 
                element.priority === 'critical' ? '#e74c3c' :
                element.priority === 'high' ? '#f39c12' :
                element.priority === 'medium' ? '#f1c40f' : '#95a5a6'
            }} />
          )}
        </div>

        {/* Element content */}
        <div style={{ color: 'white', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
          {element.title}
        </div>
        {element.description && (
          <div style={{
            color: 'white',
            fontSize: '11px',
            opacity: 0.9,
            lineHeight: '1.3',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {element.description}
          </div>
        )}

        {/* Progress indicators */}
        {element.progressIndicators && element.progressIndicators.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            <div style={{
              height: '4px',
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                backgroundColor: 'white',
                width: `${(element.progressIndicators[0]?.value || 0) * 100}%`,
                borderRadius: '2px',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}

        {/* Connected goals indicator */}
        {connectedGoals.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            backgroundColor: '#27ae60',
            color: 'white',
            fontSize: '10px',
            fontWeight: 'bold',
            padding: '2px 6px',
            borderRadius: '10px',
            minWidth: '16px',
            textAlign: 'center'
          }}>
            {connectedGoals.length}
          </div>
        )}

        {/* Cultural alignment indicator */}
        {state.showCulturalElements && element.culturalAlignment > 0.8 && (
          <div style={{
            position: 'absolute',
            bottom: '4px',
            left: '4px',
            fontSize: '12px'
          }}>
            🌍
          </div>
        )}

        {/* Identity alignment indicator */}
        {state.showIdentityAlignment && element.identityConnection && element.identityConnection.length > 0 && (
          <div style={{
            position: 'absolute',
            bottom: '4px',
            right: '4px',
            fontSize: '12px'
          }}>
            ✨
          </div>
        )}
      </div>
    );
  }, [state.selectedElement, state.editMode, state.canvasZoom, state.showCulturalElements, state.showIdentityAlignment, smartGoals, handleMouseDown]);

  // Render timeframe selector
  const renderTimeframeSelector = () => (
    <div style={{
      display: 'flex',
      gap: '8px',
      marginBottom: '16px',
      flexWrap: 'wrap'
    }}>
      {activeVisionBoard.timeframes.map(timeframe => (
        <button
          key={timeframe.period}
          onClick={() => setState(prev => ({ 
            ...prev, 
            selectedTimeframe: timeframe.period as VisionBoardState['selectedTimeframe']
          }))}
          style={{
            backgroundColor: state.selectedTimeframe === timeframe.period ? '#3498db' : 'white',
            color: state.selectedTimeframe === timeframe.period ? 'white' : '#3498db',
            border: '2px solid #3498db',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {timeframe.title}
        </button>
      ))}
    </div>
  );

  // Render AI suggestions panel
  const renderAISuggestionsPanel = () => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '16px',
      border: '2px solid #f1f3f4'
    }}>
      <h4 style={{ color: '#2c3e50', marginBottom: '12px' }}>
        🤖 AI Career Suggestions
      </h4>
      {state.aiSuggestions.slice(0, 3).map(suggestion => (
        <div
          key={suggestion.id}
          style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '8px',
            border: '1px solid #e9ecef'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <div style={{
              fontWeight: '500',
              fontSize: '14px',
              color: '#2c3e50'
            }}>
              {suggestion.title}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#7f8c8d',
              backgroundColor: '#ecf0f1',
              padding: '2px 8px',
              borderRadius: '10px'
            }}>
              {Math.round(suggestion.confidence * 100)}% match
            </div>
          </div>
          <div style={{
            fontSize: '12px',
            color: '#34495e',
            marginBottom: '8px'
          }}>
            {suggestion.description}
          </div>
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => createVisionElement(
                suggestion.type === 'role_suggestion' ? 'aspirational_role' : 'impact_vision',
                { x: Math.random() * 400, y: Math.random() * 300 }
              )}
              style={{
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 12px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              Add to Board
            </button>
            <button
              onClick={() => generateGoalFromVision({
                elementId: `temp_${suggestion.id}`,
                type: 'aspirational_role',
                title: suggestion.title,
                description: suggestion.description,
                position: { x: 0, y: 0 },
                size: { width: 160, height: 120 },
                color: '#3498db',
                timeframe: suggestion.timeframe as any,
                priority: 'high',
                feasibility: suggestion.feasibility,
                emotionalResonance: 0.8,
                culturalAlignment: suggestion.culturalRelevance,
                identityConnection: [],
                valuesAlignment: [],
                skillRequirements: [],
                resourceNeeds: suggestion.resources,
                connectionPoints: [],
                progressIndicators: [],
                inspirationSource: null,
                realityCheckNotes: '',
                communityFeedback: [],
                mentorGuidance: [],
                isPubliclyShared: false,
                lastUpdated: new Date()
              })}
              style={{
                backgroundColor: 'transparent',
                color: '#2ecc71',
                border: '1px solid #2ecc71',
                borderRadius: '6px',
                padding: '4px 12px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              Create Goal
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="career-vision-board" style={{
      padding: '20px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '8px' }}>
          🌟 Career Vision Board
        </h2>
        <p style={{ color: '#7f8c8d', margin: 0 }}>
          Visualize and plan your career future with AI-powered insights
        </p>
      </div>

      {/* Controls */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        {/* View mode selector */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {[
            { mode: 'canvas', label: '🎨 Canvas View', icon: '🎨' },
            { mode: 'timeline', label: '⏰ Timeline View', icon: '⏰' },
            { mode: 'scenarios', label: '🎯 Scenarios', icon: '🎯' },
            { mode: 'goals_integration', label: '🎪 Goals Integration', icon: '🎪' }
          ].map(({ mode, label }) => (
            <button
              key={mode}
              onClick={() => setState(prev => ({ ...prev, viewMode: mode as any }))}
              style={{
                backgroundColor: state.viewMode === mode ? '#3498db' : 'transparent',
                color: state.viewMode === mode ? 'white' : '#3498db',
                border: '2px solid #3498db',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Edit mode toggle */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <input
              type="checkbox"
              checked={state.editMode}
              onChange={(e) => setState(prev => ({ ...prev, editMode: e.target.checked }))}
            />
            Edit Mode
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <input
              type="checkbox"
              checked={state.showConnections}
              onChange={(e) => setState(prev => ({ ...prev, showConnections: e.target.checked }))}
            />
            Show Connections
          </label>

          {culturalSensitivityMode && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={state.showCulturalElements}
                onChange={(e) => setState(prev => ({ ...prev, showCulturalElements: e.target.checked }))}
              />
              Cultural Elements
            </label>
          )}
        </div>

        {/* Timeframe selector */}
        {renderTimeframeSelector()}
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Main canvas area */}
        <div style={{ flex: 1 }}>
          {state.viewMode === 'canvas' && (
            <div
              ref={canvasRef}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                position: 'relative',
                width: canvasSize.width,
                height: canvasSize.height,
                border: '2px solid #f1f3f4',
                overflow: 'hidden',
                cursor: state.editMode ? 'crosshair' : 'default'
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onDoubleClick={(e) => {
                if (!state.editMode) return;
                const rect = canvasRef.current?.getBoundingClientRect();
                if (!rect) return;
                
                const x = (e.clientX - rect.left - state.canvasOffset.x) / state.canvasZoom;
                const y = (e.clientY - rect.top - state.canvasOffset.y) / state.canvasZoom;
                
                createVisionElement('aspirational_role', { x: x - 80, y: y - 60 });
              }}
            >
              {/* Grid background */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 
                  'radial-gradient(circle, #bdc3c7 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                opacity: 0.3
              }} />

              {/* Vision elements */}
              {filteredVisionElements.map(renderVisionElement)}

              {/* Add element button */}
              {state.editMode && (
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  display: 'flex',
                  gap: '8px',
                  flexDirection: 'column'
                }}>
                  <button
                    onClick={() => createVisionElement('central_vision', { x: 100, y: 100 })}
                    style={{
                      backgroundColor: '#3498db',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    + Central Vision
                  </button>
                  <button
                    onClick={() => createVisionElement('aspirational_role', { x: 200, y: 150 })}
                    style={{
                      backgroundColor: '#2ecc71',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    + Role Vision
                  </button>
                  <button
                    onClick={() => createVisionElement('lifestyle_goal', { x: 300, y: 200 })}
                    style={{
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    + Lifestyle
                  </button>
                  <button
                    onClick={() => createVisionElement('impact_vision', { x: 400, y: 250 })}
                    style={{
                      backgroundColor: '#f39c12',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    + Impact
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Other view modes would be implemented here */}
          {state.viewMode !== 'canvas' && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center',
              color: '#7f8c8d'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
              <p>{state.viewMode} view coming soon!</p>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ width: '300px' }}>
          {/* AI Suggestions */}
          {renderAISuggestionsPanel()}

          {/* Selected element details */}
          {state.selectedElement && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px',
              border: '2px solid #f1f3f4'
            }}>
              <h4 style={{ color: '#2c3e50', marginBottom: '12px' }}>
                ✨ Element Details
              </h4>
              
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px' }}>
                  Title
                </label>
                <input
                  type="text"
                  value={state.selectedElement.title}
                  onChange={(e) => updateVisionElement(state.selectedElement!.elementId, { title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #bdc3c7',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', marginBottom: '4px' }}>
                  Description
                </label>
                <textarea
                  value={state.selectedElement.description}
                  onChange={(e) => updateVisionElement(state.selectedElement!.elementId, { description: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #bdc3c7',
                    borderRadius: '6px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button
                  onClick={() => generateGoalFromVision(state.selectedElement!)}
                  style={{
                    backgroundColor: '#2ecc71',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  Create Goal
                </button>
                <button
                  onClick={() => {
                    const updatedElements = activeVisionBoard.visionElements.filter(
                      e => e.elementId !== state.selectedElement!.elementId
                    );
                    onUpdateVisionBoard({
                      ...activeVisionBoard,
                      visionElements: updatedElements,
                      updatedAt: new Date()
                    });
                    setState(prev => ({ ...prev, selectedElement: null }));
                  }}
                  style={{
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          )}

          {/* Connected goals */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '16px',
            border: '2px solid #f1f3f4'
          }}>
            <h4 style={{ color: '#2c3e50', marginBottom: '12px' }}>
              🎯 Connected Goals
            </h4>
            {smartGoals.filter(goal => 
              state.selectedElement && goal.visionBoardConnection?.includes(state.selectedElement.elementId)
            ).map(goal => (
              <div
                key={goal.goalId}
                style={{
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  padding: '8px',
                  marginBottom: '8px',
                  fontSize: '12px'
                }}
              >
                <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                  {goal.goalTitle}
                </div>
                <div style={{ color: '#7f8c8d' }}>
                  Status: {goal.status} • Priority: {goal.priority}
                </div>
              </div>
            ))}
            
            {smartGoals.filter(goal => 
              !state.selectedElement || !goal.visionBoardConnection?.includes(state.selectedElement.elementId)
            ).slice(0, 3).map(goal => (
              <div
                key={goal.goalId}
                style={{
                  backgroundColor: '#ecf0f1',
                  borderRadius: '8px',
                  padding: '8px',
                  marginBottom: '8px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  opacity: 0.7
                }}
                onClick={() => state.selectedElement && connectToGoal(state.selectedElement.elementId, goal.goalId)}
              >
                <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                  {goal.goalTitle}
                </div>
                <div style={{ color: '#7f8c8d' }}>
                  Click to connect
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerVisionBoardComponent;