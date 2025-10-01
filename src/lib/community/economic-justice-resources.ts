/**
 * ALCHM Economic Justice Resource Navigation System
 * Comprehensive Community Support & Mutual Aid Infrastructure
 * 
 * Revolutionary approach to resource sharing that:
 * - Centers mutual aid over charity models
 * - Addresses systemic barriers and root causes
 * - Provides trauma-informed support
 * - Connects individual healing to collective liberation
 */

export interface EconomicJusticeResource {
  id: string;
  name: string;
  description: string;
  type: ResourceType;
  access_model: 'mutual_aid' | 'sliding_scale' | 'free' | 'low_cost' | 'community_controlled';
  eligibility_requirements?: string[];
  systemic_barriers_addressed: string[];
  trauma_informed_approach: boolean;
  community_organizing_component: boolean;
  location: {
    address?: string;
    city: string;
    state: string;
    country: string;
    accessibility_notes: string[];
    transportation_access: string[];
  };
  contact_info: {
    website?: string;
    phone?: string;
    email?: string;
    social_media?: Record<string, string>;
    preferred_contact_method: string;
    languages_supported: string[];
  };
  availability: {
    hours_of_operation: string;
    emergency_availability: boolean;
    appointment_required: boolean;
    waitlist_typical_length?: string;
  };
  outcomes_tracking: {
    community_impact_focus: boolean;
    individual_empowerment_metrics: string[];
    systemic_change_indicators: string[];
  };
}

export type ResourceType = 
  | 'emergency_financial_aid'
  | 'food_security'
  | 'housing_assistance'
  | 'healthcare_navigation'
  | 'legal_support'
  | 'financial_counseling'
  | 'job_training'
  | 'entrepreneurship_support'
  | 'childcare_assistance'
  | 'transportation_support'
  | 'mental_health_services'
  | 'community_organizing'
  | 'policy_advocacy'
  | 'cooperative_development'
  | 'mutual_aid_networks'
  | 'financial_education'
  | 'digital_literacy'
  | 'crisis_intervention';

export interface MutualAidNetwork {
  id: string;
  name: string;
  mission: string;
  organizing_principles: string[];
  resource_sharing_focus: ResourceType[];
  community_served: {
    demographic_focus?: string[];
    geographic_area: string;
    cultural_competency: string[];
  };
  participation_model: {
    how_to_join: string;
    contribution_expectations: string;
    decision_making_process: string;
  };
  current_initiatives: string[];
  success_stories: string[];
  contact_info: {
    coordinator?: string;
    meeting_schedule: string;
    communication_platforms: Record<string, string>;
  };
}

export interface SystemicChangeOpportunity {
  id: string;
  title: string;
  description: string;
  type: 'policy_advocacy' | 'community_organizing' | 'direct_action' | 'electoral_campaign' | 'cooperative_development';
  target_system: 'local' | 'state' | 'federal' | 'corporate' | 'institutional';
  decision_makers: {
    name: string;
    role: string;
    contact_info: Record<string, string>;
    voting_record_or_stance?: string;
  }[];
  timeline: {
    key_dates: Record<string, string>;
    estimated_duration: string;
    urgency_level: 'low' | 'medium' | 'high' | 'critical';
  };
  ways_to_participate: {
    time_commitment: string;
    skills_needed: string[];
    training_provided: boolean;
    accessibility_accommodations: string[];
  }[];
  expected_impact: {
    direct_beneficiaries: string;
    systemic_change_potential: string;
    connection_to_broader_movement: string;
  };
}

// Comprehensive Economic Justice Resource Database
export class EconomicJusticeResourceNavigator {
  private resources: Map<string, EconomicJusticeResource> = new Map();
  private mutualAidNetworks: Map<string, MutualAidNetwork> = new Map();
  private systemicChangeOpportunities: Map<string, SystemicChangeOpportunity> = new Map();

  constructor() {
    this.initializeResourceDatabase();
  }

  private initializeResourceDatabase(): void {
    // Emergency Financial Aid Resources
    this.addResource({
      id: 'community_emergency_fund',
      name: 'Community Emergency Mutual Aid Fund',
      description: 'No-questions-asked emergency financial assistance organized by and for community members. Explicitly rejects charity model in favor of solidarity and mutual aid.',
      type: 'emergency_financial_aid',
      access_model: 'mutual_aid',
      eligibility_requirements: [],
      systemic_barriers_addressed: ['bureaucratic_barriers', 'poverty_shame', 'typeof window !== 'undefined' && documentation_requirements'],
      trauma_informed_approach: true,
      community_organizing_component: true,
      location: {
        city: 'Community-Based',
        state: 'Various',
        country: 'US',
        accessibility_notes: ['wheelchair_accessible', 'multilingual_support', 'childcare_provided'],
        transportation_access: ['public_transit', 'ride_sharing_available']
      },
      contact_info: {
        email: 'mutualaid@community.org',
        preferred_contact_method: 'secure_form',
        languages_supported: ['en', 'es', 'ko', 'ar', 'asl']
      },
      availability: {
        hours_of_operation: '24/7 online form, responses within 24 hours',
        emergency_availability: true,
        appointment_required: false
      },
      outcomes_tracking: {
        community_impact_focus: true,
        individual_empowerment_metrics: ['crisis_resolution', 'dignity_preservation', 'community_connection'],
        systemic_change_indicators: ['reduced_reliance_on_punitive_systems', 'increased_community_solidarity']
      }
    });

    // Food Security Resources
    this.addResource({
      id: 'community_food_sovereignty_network',
      name: 'Community Food Sovereignty Network',
      description: 'Community-controlled food distribution system that addresses food apartheid while building local food systems. Combines immediate food access with organizing for food justice.',
      type: 'food_security',
      access_model: 'community_controlled',
      eligibility_requirements: [],
      systemic_barriers_addressed: ['food_apartheid', 'cultural_food_access', 'transportation_barriers'],
      trauma_informed_approach: true,
      community_organizing_component: true,
      location: {
        city: 'Neighborhood-Based',
        state: 'Various',
        country: 'US',
        accessibility_notes: ['culturally_relevant_foods', 'cooking_education', 'community_garden_access'],
        transportation_access: ['mobile_pantry', 'delivery_available', 'neighborhood_pickup_points']
      },
      contact_info: {
        website: 'foodsovereignty.community',
        phone: '555-FOOD-NOW',
        preferred_contact_method: 'text_or_call',
        languages_supported: ['en', 'es', 'indigenous_languages']
      },
      availability: {
        hours_of_operation: 'Multiple weekly distributions',
        emergency_availability: true,
        appointment_required: false,
        waitlist_typical_length: 'None - abundance model'
      },
      outcomes_tracking: {
        community_impact_focus: true,
        individual_empowerment_metrics: ['nutrition_access', 'cultural_food_connection', 'cooking_skills'],
        systemic_change_indicators: ['local_food_system_development', 'corporate_food_system_resistance']
      }
    });

    // Housing Justice Resources
    this.addResource({
      id: 'tenant_organizing_legal_clinic',
      name: 'Tenant Organizing & Legal Defense Clinic',
      description: 'Combines legal support for housing issues with tenant organizing to address systemic housing inequity. Provides both individual case support and collective action training.',
      type: 'housing_assistance',
      access_model: 'sliding_scale',
      eligibility_requirements: [],
      systemic_barriers_addressed: ['housing_discrimination', 'gentrification', 'landlord_exploitation'],
      trauma_informed_approach: true,
      community_organizing_component: true,
      location: {
        address: 'Multiple community locations',
        city: 'Metro Area',
        state: 'Various',
        country: 'US',
        accessibility_notes: ['wheelchair_accessible', 'interpretation_services', 'childcare_during_meetings'],
        transportation_access: ['public_transit_accessible', 'community_van_service']
      },
      contact_info: {
        website: 'tenantsorganizing.legal',
        email: 'support@tenantsorganizing.legal',
        preferred_contact_method: 'secure_intake_form',
        languages_supported: ['en', 'es', 'ko', 'vi', 'ar']
      },
      availability: {
        hours_of_operation: 'Monday-Friday 9am-6pm, Emergency hotline 24/7',
        emergency_availability: true,
        appointment_required: true,
        waitlist_typical_length: '2-3 weeks for non-emergency'
      },
      outcomes_tracking: {
        community_impact_focus: true,
        individual_empowerment_metrics: ['housing_stability', 'legal_empowerment', 'organizing_skills'],
        systemic_change_indicators: ['policy_changes_achieved', 'landlord_accountability_increased']
      }
    });

    // Financial Trauma Healing Resources
    this.addResource({
      id: 'financial_trauma_healing_circles',
      name: 'Financial Trauma Healing Circles',
      description: 'Trauma-informed group healing spaces that address money shame, scarcity mindset, and generational financial trauma while connecting healing to economic justice analysis.',
      type: 'financial_counseling',
      access_model: 'sliding_scale',
      eligibility_requirements: [],
      systemic_barriers_addressed: ['financial_shame', 'therapy_access_barriers', 'individualized_blame_for_poverty'],
      trauma_informed_approach: true,
      community_organizing_component: true,
      location: {
        city: 'Community Centers',
        state: 'Various',
        country: 'US',
        accessibility_notes: ['trauma_informed_space', 'sensory_accommodations', 'multiple_communication_options'],
        transportation_access: ['public_transit', 'virtual_option_available']
      },
      contact_info: {
        email: 'healing@financialtrauma.collective',
        preferred_contact_method: 'trauma_informed_intake',
        languages_supported: ['en', 'es', 'asl']
      },
      availability: {
        hours_of_operation: 'Weekly evening circles, monthly weekend intensives',
        emergency_availability: false,
        appointment_required: true,
        waitlist_typical_length: '1-2 months'
      },
      outcomes_tracking: {
        community_impact_focus: true,
        individual_empowerment_metrics: ['reduced_financial_shame', 'increased_financial_agency', 'trauma_symptom_reduction'],
        systemic_change_indicators: ['economic_justice_engagement', 'collective_healing_practices_spread']
      }
    });

    // Cooperative Development Resources
    this.addResource({
      id: 'cooperative_development_incubator',
      name: 'Community Cooperative Development Incubator',
      description: 'Provides technical assistance, funding, and ongoing support for worker cooperatives, housing cooperatives, and community-owned enterprises. Prioritizes marginalized communities.',
      type: 'cooperative_development',
      access_model: 'sliding_scale',
      eligibility_requirements: ['cooperative_commitment', 'community_benefit_focus'],
      systemic_barriers_addressed: ['startup_capital_access', 'business_development_barriers', 'cooperative_education_gaps'],
      trauma_informed_approach: true,
      community_organizing_component: true,
      location: {
        city: 'Regional Hubs',
        state: 'Various',
        country: 'US',
        accessibility_notes: ['culturally_competent_staff', 'flexible_meeting_options', 'language_interpretation'],
        transportation_access: ['public_transit_accessible', 'virtual_participation_options']
      },
      contact_info: {
        website: 'cooperativeincubator.community',
        email: 'develop@cooperativeincubator.community',
        preferred_contact_method: 'initial_consultation_form',
        languages_supported: ['en', 'es', 'indigenous_languages']
      },
      availability: {
        hours_of_operation: 'Monday-Friday business hours, evening workshops',
        emergency_availability: false,
        appointment_required: true,
        waitlist_typical_length: '1-3 months depending on program'
      },
      outcomes_tracking: {
        community_impact_focus: true,
        individual_empowerment_metrics: ['business_development_skills', 'cooperative_leadership', 'economic_empowerment'],
        systemic_change_indicators: ['cooperative_businesses_launched', 'community_wealth_retention', 'democratic_economy_growth']
      }
    });

    // Initialize Mutual Aid Networks
    this.addMutualAidNetwork({
      id: 'neighborhood_mutual_aid_collective',
      name: 'Neighborhood Mutual Aid Collective',
      mission: 'Building community resilience through resource sharing, collective care, and systemic change work',
      organizing_principles: [
        'Solidarity not charity',
        'Community self-determination',
        'Anti-oppression framework',
        'Sustainable collective care',
        'Connection between individual and systemic healing'
      ],
      resource_sharing_focus: ['emergency_financial_aid', 'food_security', 'crisis_intervention', 'community_organizing'],
      community_served: {
        demographic_focus: ['working_class', 'marginalized_communities', 'immigrants', 'single_parents'],
        geographic_area: 'Neighborhood boundaries',
        cultural_competency: ['trauma_informed', 'culturally_responsive', 'linguistically_accessible']
      },
      participation_model: {
        how_to_join: 'Attend community meeting or complete online form',
        contribution_expectations: 'Give what you can, take what you need - multiple ways to contribute',
        decision_making_process: 'Consensus-based with rotating facilitation'
      },
      current_initiatives: [
        'Community emergency fund',
        'Food distribution network',
        'Tenant organizing support',
        'Community defense training',
        'Policy advocacy coordination'
      ],
      success_stories: [
        'Prevented 15 evictions through collective action and emergency funds',
        'Established community-controlled food distribution serving 200+ families',
        'Successfully advocated for community investment in local budget process'
      ],
      contact_info: {
        coordinator: 'Rotating collective leadership',
        meeting_schedule: 'First Sunday each month, 2-4pm',
        communication_platforms: {
          'signal_group': 'Community updates and coordination',
          'community_board': 'Resource requests and offerings',
          'monthly_newsletter': 'Deeper organizing and education content'
        }
      }
    });

    // Initialize Systemic Change Opportunities
    this.addSystemicChangeOpportunity({
      id: 'community_investment_fund_campaign',
      title: 'Community-Controlled Investment Fund Campaign',
      description: 'Campaign to establish a community-controlled fund that invests in cooperative businesses, affordable housing, and community development projects rather than extractive industries.',
      type: 'policy_advocacy',
      target_system: 'local',
      decision_makers: [
        {
          name: 'Mayor Johnson',
          role: 'Mayor',
          contact_info: {
            'email': 'mayor@city.gov',
            'phone': '555-MAYOR-01'
          },
          voting_record_or_stance: 'Previously supported community development initiatives'
        },
        {
          name: 'City Council Economic Development Committee',
          role: 'Committee Chair',
          contact_info: {
            'email': 'economicdev@citycouncil.gov'
          }
        }
      ],
      timeline: {
        key_dates: {
          'petition_launch': 'January 15',
          'community_meetings': 'February - March',
          'city_council_presentation': 'April 10',
          'budget_integration_target': 'June budget cycle'
        },
        estimated_duration: '6 months intensive campaign',
        urgency_level: 'high'
      },
      ways_to_participate: [
        {
          time_commitment: '2-4 hours per week',
          skills_needed: ['community_outreach', 'policy_research'],
          training_provided: true,
          accessibility_accommodations: ['flexible_scheduling', 'virtual_participation', 'transportation_assistance']
        },
        {
          time_commitment: '4-8 hours per week',
          skills_needed: ['campaign_coordination', 'public_speaking', 'coalition_building'],
          training_provided: true,
          accessibility_accommodations: ['leadership_development', 'stipend_available']
        }
      ],
      expected_impact: {
        direct_beneficiaries: 'Low-income residents, cooperative businesses, community organizations',
        systemic_change_potential: 'Model for community-controlled economic development replicable in other cities',
        connection_to_broader_movement: 'Part of national community investment and cooperative economy movement'
      }
    });
  }

  private addResource(resource: EconomicJusticeResource): void {
    this.resources.set(resource.id, resource);
  }

  private addMutualAidNetwork(network: MutualAidNetwork): void {
    this.mutualAidNetworks.set(network.id, network);
  }

  private addSystemicChangeOpportunity(opportunity: SystemicChangeOpportunity): void {
    this.systemicChangeOpportunities.set(opportunity.id, opportunity);
  }

  /**
   * Find resources based on user's specific needs and location
   */
  async findResources(
    criteria: {
      resource_types: ResourceType[];
      location: { city: string; state: string; max_distance_miles?: number; };
      urgent_need: boolean;
      language_preference?: string;
      accessibility_needs?: string[];
      transportation_limitations?: boolean;
    }
  ): Promise<{
    immediate_resources: EconomicJusticeResource[];
    ongoing_support_options: EconomicJusticeResource[];
    mutual_aid_networks: MutualAidNetwork[];
    organizing_opportunities: SystemicChangeOpportunity[];
  }> {
    const allResources = Array.from(this.resources.values());
    
    // Filter resources by criteria
    const matchingResources = allResources.filter(resource => {
      // Type match
      if (!criteria.resource_types.includes(resource.type)) return false;
      
      // Location match (simplified - in production would use geospatial queries)
      if (resource.location.city !== criteria.location.city && 
          resource.location.city !== 'Community-Based' && 
          resource.location.city !== 'Neighborhood-Based') return false;
      
      // Language support
      if (criteria.language_preference && 
          !resource.contact_info.languages_supported.includes(criteria.language_preference)) return false;
      
      // Transportation accessibility
      if (criteria.transportation_limitations && 
          !resource.location.transportation_access.some(access => 
            access.includes('virtual') || access.includes('delivery') || access.includes('mobile'))) return false;
      
      return true;
    });

    // Separate immediate vs ongoing resources
    const immediateResources = matchingResources.filter(resource => 
      resource.availability.emergency_availability || !resource.availability.appointment_required
    );
    
    const ongoingResources = matchingResources.filter(resource => 
      resource.availability.appointment_required && !resource.availability.emergency_availability
    );

    // Find relevant mutual aid networks
    const relevantNetworks = Array.from(this.mutualAidNetworks.values()).filter(network => 
      network.resource_sharing_focus.some(focus => criteria.resource_types.includes(focus))
    );

    // Find organizing opportunities
    const organizingOpportunities = Array.from(this.systemicChangeOpportunities.values());

    return {
      immediate_resources: immediateResources,
      ongoing_support_options: ongoingResources,
      mutual_aid_networks: relevantNetworks,
      organizing_opportunities: organizingOpportunities
    };
  }

  /**
   * Generate personalized resource navigation plan
   */
  async createResourceNavigationPlan(
    userId: string,
    userProfile: {
      immediate_needs: ResourceType[];
      long_term_goals: string[];
      systemic_barriers_faced: string[];
      community_involvement_preference: 'individual_support' | 'community_engagement' | 'organizing_focused';
      trauma_healing_needs: boolean;
    }
  ): Promise<{
    immediate_action_steps: string[];
    resource_utilization_strategy: string[];
    community_engagement_pathway: string[];
    systemic_change_opportunities: string[];
    follow_up_plan: string[];
  }> {
    return {
      immediate_action_steps: [
        'Connect with Community Emergency Mutual Aid Fund for immediate financial support',
        'Join neighborhood mutual aid network for ongoing community support',
        'Access trauma-informed financial counseling if experiencing money-related stress',
        'Explore food sovereignty network for culturally relevant food access'
      ],
      resource_utilization_strategy: [
        'Prioritize resources that address systemic barriers not just symptoms',
        'Choose mutual aid over charity models when possible',
        'Engage with resources that offer community organizing components',
        'Seek trauma-informed services that understand oppression impacts'
      ],
      community_engagement_pathway: [
        'Attend mutual aid network meeting to understand community needs and offerings',
        'Participate in resource sharing both as receiver and contributor',
        'Join issue-based organizing around systemic barriers you face',
        'Connect with others who share similar economic justice analysis'
      ],
      systemic_change_opportunities: [
        'Support community investment fund campaign for local economic democracy',
        'Join tenant organizing if facing housing challenges',
        'Participate in cooperative development if interested in alternative business models',
        'Engage in policy advocacy around issues affecting your community'
      ],
      follow_up_plan: [
        'Schedule monthly check-ins to assess resource needs and community engagement',
        'Document experiences with resources to improve community knowledge base',
        'Share resource navigation skills with others in similar situations',
        'Evaluate progress on both individual stability and systemic change goals'
      ]
    };
  }

  // Getter methods
  getAllResources(): EconomicJusticeResource[] {
    return Array.from(this.resources.values());
  }

  getResourceById(id: string): EconomicJusticeResource | undefined {
    return this.resources.get(id);
  }

  getAllMutualAidNetworks(): MutualAidNetwork[] {
    return Array.from(this.mutualAidNetworks.values());
  }

  getAllSystemicChangeOpportunities(): SystemicChangeOpportunity[] {
    return Array.from(this.systemicChangeOpportunities.values());
  }
}

// Export singleton instance
export const economicJusticeResourceNavigator = new EconomicJusticeResourceNavigator();