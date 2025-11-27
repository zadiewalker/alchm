'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  economicJusticePathwayOrchestrator, 
  type RevolutionaryPathway 
} from '@/lib/pathways/economic-justice-pathways';
import { 
  economicJusticeResourceNavigator, 
  type EconomicJusticeResource 
} from '@/lib/community/economic-justice-resources';
import { 
  traumaInformedEconomicStressEngine,
  type EconomicStressProfile
} from '@/lib/trauma-informed-economic-stress-management';

interface EconomicJusticePathwayInterfaceProps {
  userId: string;
  userProfile?: {
    current_financial_situation: 'survival' | 'stability' | 'growth' | 'wealth_building';
    primary_economic_barriers: string[];
    community_involvement_level: number;
    systemic_change_interest: number;
    trauma_healing_readiness: number;
  };
}

const EconomicJusticePathwayInterface: React.FC<EconomicJusticePathwayInterfaceProps> = ({
  userId,
  userProfile
}) => {
  const [activeTab, setActiveTab] = useState<'pathways' | 'resources' | 'stress_support' | 'community'>('pathways');
  const [selectedPathway, setSelectedPathway] = useState<RevolutionaryPathway | null>(null);
  const [economicStressProfile, setEconomicStressProfile] = useState<EconomicStressProfile | null>(null);
  const [availableResources, setAvailableResources] = useState<EconomicJusticeResource[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize economic justice data
  useEffect(() => {
    const initializeEconomicJusticeSystem = async () => {
      setIsLoading(true);
      try {
        // Load available resources
        const resources = economicJusticeResourceNavigator.getAllResources();
        setAvailableResources(resources);

        // Create economic stress profile if needed
        if (userProfile) {
          const stressProfile = await traumaInformedEconomicStressEngine.assessEconomicStress(userId, {
            economic_situation: {
              income_stability: userProfile.current_financial_situation === 'survival' ? 'crisis' : 'stable',
              housing_security: 'stable',
              food_security: 'secure',
              healthcare_access: 'adequate',
              debt_burden: 'manageable',
              financial_safety_net: 'some_family_support'
            },
            systemic_barriers: {
              racism_impact: 5,
              classism_impact: 7,
              sexism_impact: 4,
              ableism_impact: 2,
              homophobia_transphobia_impact: 1,
              immigration_status_impact: 0,
              geographic_isolation_impact: 3,
              educational_barrier_impact: 4,
              criminal_justice_system_impact: 0,
              healthcare_system_barriers: 5
            },
            trauma_symptoms: {
              financial_anxiety_severity: 6,
              money_avoidance_behaviors: ['bill_avoidance', 'financial_planning_avoidance'],
              scarcity_mindset_indicators: ['hoarding_tendency', 'fear_of_spending'],
              financial_shame_levels: 7,
              hypervigilance_around_money: 8,
              financial_decision_paralysis: 6,
              money_related_nightmares: true,
              physical_symptoms: ['stomach_tension', 'sleep_disruption'],
              relationship_impact: ['financial_arguments', 'money_secrecy'],
              work_performance_impact: ['distraction', 'burnout_risk']
            },
            current_stressors: ['rent_burden', 'healthcare_costs', 'job_insecurity'],
            support_system: {
              family_support: 'limited',
              community_connections: 'some',
              professional_support: 'none'
            }
          });
          setEconomicStressProfile(stressProfile);
        }
      } catch (error) {
        console.error('Error initializing economic justice system:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeEconomicJusticeSystem();
  }, [userId, userProfile]);

  const renderSystemicAwarenessCard = () => (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="text-red-800 flex items-center">
          🔥 Revolutionary Economic Justice Approach
        </CardTitle>
      </CardHeader>
      <CardContent className="text-red-700">
        <p className="mb-3">
          <strong>This system explicitly acknowledges:</strong> Your financial struggles are largely the result 
          of systemic oppression, not personal failures. Poverty is violence, not a character flaw.
        </p>
        <p className="mb-3">
          <strong>We reject:</strong> Bootstrap mythology, positive thinking as a solution to structural problems, 
          and any approach that blames individuals for economic inequality.
        </p>
        <p>
          <strong>We provide:</strong> Practical support while working to dismantle the systems that create 
          economic hardship. Individual healing AND collective liberation.
        </p>
      </CardContent>
    </Card>
  );

  const renderPathwaysTab = () => {
    const pathways = economicJusticePathwayOrchestrator.getAllEconomicJusticePathways();
    
    return (
      <div className="space-y-6">
        {renderSystemicAwarenessCard()}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pathways.map((pathway) => (
            <Card key={pathway.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{pathway.name}</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{pathway.duration_weeks} weeks</Badge>
                  <Badge variant="outline">{pathway.phases.length} phases</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{pathway.description}</p>
                <div className="space-y-2">
                  <div className="text-xs">
                    <strong>Cultural Integration:</strong> {pathway.cultural_adaptations.ancestral_wisdom_integration.join(', ')}
                  </div>
                  <div className="text-xs">
                    <strong>Healing Modalities:</strong> {pathway.cultural_adaptations.healing_modalities.join(', ')}
                  </div>
                </div>
                <Button 
                  className="w-full mt-4"
                  onClick={() => setSelectedPathway(pathway)}
                >
                  Explore Pathway
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedPathway && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{selectedPathway.name} - Detailed View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Pathway Phases:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedPathway.phases.map((phase, index) => (
                      <li key={index} className="capitalize">{phase.replace('_', ' ')}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">AI Coaching Specialization:</h4>
                  <p className="text-sm">{selectedPathway.ai_coaching.khepera_specialization}</p>
                  <p className="text-sm">Tone: {selectedPathway.ai_coaching.coaching_tone}</p>
                </div>
              </div>
              <Button 
                className="mt-4"
                onClick={() => setSelectedPathway(null)}
              >
                Back to Pathways
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderResourcesTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🤝 Community Resources & Mutual Aid</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            These resources prioritize mutual aid over charity, community control over bureaucracy, 
            and systemic change over temporary fixes.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableResources.slice(0, 6).map((resource) => (
          <Card key={resource.id}>
            <CardHeader>
              <CardTitle className="text-lg">{resource.name}</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{resource.access_model.replace('_', ' ')}</Badge>
                <Badge variant="outline">{resource.type.replace('_', ' ')}</Badge>
                {resource.trauma_informed_approach && (
                  <Badge variant="default">Trauma-Informed</Badge>
                )}
                {resource.community_organizing_component && (
                  <Badge variant="destructive">Organizing Component</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-3">{resource.description}</p>
              <div className="space-y-2 text-xs">
                <div>
                  <strong>Systemic Barriers Addressed:</strong>{' '}
                  {resource.systemic_barriers_addressed.join(', ')}
                </div>
                <div>
                  <strong>Location:</strong> {resource.location.city}, {resource.location.state}
                </div>
                <div>
                  <strong>Availability:</strong> {resource.availability.hours_of_operation}
                </div>
              </div>
              <Button className="w-full mt-3" size="sm">
                Connect to Resource
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderStressSupportTab = () => {
    const interventions = traumaInformedEconomicStressEngine.getAllInterventions();
    
    return (
      <div className="space-y-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">💙 Trauma-Informed Economic Stress Support</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <p className="mb-3">
              Your financial stress is a rational response to irrational economic systems. 
              This support acknowledges both your individual healing needs and the systemic changes needed.
            </p>
            {economicStressProfile && (
              <div className="mt-4 p-4 bg-blue-100 rounded-lg">
                <h4 className="font-medium mb-2">Your Economic Stress Profile:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Financial Anxiety Level:</strong> {economicStressProfile.economic_trauma_symptoms.financial_anxiety_severity}/10
                  </div>
                  <div>
                    <strong>Financial Shame Level:</strong> {economicStressProfile.economic_trauma_symptoms.financial_shame_levels}/10
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interventions.map((intervention) => (
            <Card key={intervention.id}>
              <CardHeader>
                <CardTitle className="text-lg">{intervention.name}</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{intervention.type.replace('_', ' ')}</Badge>
                  {intervention.systemic_analysis_component && (
                    <Badge variant="destructive">Systemic Analysis</Badge>
                  )}
                  {intervention.community_based && (
                    <Badge variant="default">Community-Based</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">{intervention.description}</p>
                <div className="space-y-2 text-xs">
                  <div>
                    <strong>Target Symptoms:</strong> {intervention.target_symptoms.join(', ')}
                  </div>
                  <div>
                    <strong>Steps:</strong> {intervention.intervention_steps.length} structured steps
                  </div>
                </div>
                <Button className="w-full mt-3" size="sm">
                  Begin Intervention
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderCommunityTab = () => {
    const mutualAidNetworks = economicJusticeResourceNavigator.getAllMutualAidNetworks();
    const systemicChangeOpportunities = economicJusticeResourceNavigator.getAllSystemicChangeOpportunities();
    
    return (
      <div className="space-y-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">🌱 Community Organizing & Systemic Change</CardTitle>
          </CardHeader>
          <CardContent className="text-green-700">
            <p>
              Individual healing happens within community, and community healing requires systemic change. 
              Connect with others working for economic justice in your area.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium mb-4">Mutual Aid Networks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mutualAidNetworks.map((network) => (
                <Card key={network.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{network.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{network.mission}</p>
                    <div className="space-y-2 text-xs">
                      <div>
                        <strong>Organizing Principles:</strong>
                        <ul className="list-disc list-inside ml-2">
                          {network.organizing_principles.slice(0, 3).map((principle, index) => (
                            <li key={index}>{principle}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <strong>Current Initiatives:</strong> {network.current_initiatives.join(', ')}
                      </div>
                      <div>
                        <strong>Meeting Schedule:</strong> {network.contact_info.meeting_schedule}
                      </div>
                    </div>
                    <Button className="w-full mt-3" size="sm">
                      Join Network
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-4">Systemic Change Opportunities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {systemicChangeOpportunities.map((opportunity) => (
                <Card key={opportunity.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{opportunity.type.replace('_', ' ')}</Badge>
                      <Badge variant="outline">{opportunity.target_system}</Badge>
                      <Badge 
                        variant={opportunity.timeline.urgency_level === 'high' ? 'destructive' : 'default'}
                      >
                        {opportunity.timeline.urgency_level} urgency
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{opportunity.description}</p>
                    <div className="space-y-2 text-xs">
                      <div>
                        <strong>Expected Impact:</strong> {opportunity.expected_impact.direct_beneficiaries}
                      </div>
                      <div>
                        <strong>Duration:</strong> {opportunity.timeline.estimated_duration}
                      </div>
                      <div>
                        <strong>Ways to Participate:</strong> {opportunity.ways_to_participate.length} different options
                      </div>
                    </div>
                    <Button className="w-full mt-3" size="sm">
                      Get Involved
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p>Loading Economic Justice System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-medium mb-2">Economic Justice & Resource Navigation</h1>
        <p className="text-gray-600">
          Revolutionary pathways for financial empowerment, community healing, and systemic change
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b">
        {[
          { id: 'pathways', label: '🎯 Justice Pathways' },
          { id: 'resources', label: '🤝 Community Resources' },
          { id: 'stress_support', label: '💙 Trauma-Informed Support' },
          { id: 'community', label: '🌱 Organizing & Action' }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'outline'}
            onClick={() => setActiveTab(tab.id as any)}
            className="mb-2"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-screen">
        {activeTab === 'pathways' && renderPathwaysTab()}
        {activeTab === 'resources' && renderResourcesTab()}
        {activeTab === 'stress_support' && renderStressSupportTab()}
        {activeTab === 'community' && renderCommunityTab()}
      </div>
    </div>
  );
};

export default EconomicJusticePathwayInterface;