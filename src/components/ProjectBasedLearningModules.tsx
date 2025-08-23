// ALCHM Project-Based Learning Modules
// Real-world project experiences with mentorship, collaboration, and portfolio integration

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ProjectBasedLearning,
  LearningPathway,
  SkillsInventoryProfile,
  CareerOption,
  SkillLevel
} from '@/types/career-future-readiness-schema';
import { IdentityExplorationProfile } from '@/types/identity-pathway-schema';
import { CulturalContext } from '@/types/identity-schema';

interface ProjectLearningProps {
  userId: string;
  skillsProfile: SkillsInventoryProfile;
  identityProfile: IdentityExplorationProfile;
  culturalContext: CulturalContext;
  activePathways: LearningPathway[];
  targetCareers: CareerOption[];
  onProjectStart?: (project: ProjectBasedLearning) => void;
  onProjectComplete?: (project: ProjectBasedLearning) => void;
  onMilestoneAchieved?: (projectId: string, milestone: string) => void;
}

interface ProjectTemplate {
  templateId: string;
  title: string;
  description: string;
  category: 'skill_building' | 'portfolio_piece' | 'real_world_application' | 'collaboration' | 'innovation';
  skillTargets: string[];
  difficultyLevel: 'starter' | 'intermediate' | 'advanced' | 'expert';
  estimatedHours: number;
  industryRelevance: string[];
  collaborationType: 'individual' | 'pair' | 'team' | 'community';
  mentorshipAvailable: boolean;
  realWorldImpact: boolean;
}

interface ProjectProgress {
  projectId: string;
  currentPhase: string;
  completionPercentage: number;
  skillsGained: SkillGain[];
  milestonesAchieved: string[];
  collaboratorFeedback: CollaboratorFeedback[];
  mentorGuidance: MentorGuidance[];
  portfolioContributions: PortfolioContribution[];
  realWorldImpact: ImpactMetric[];
}

interface SkillGain {
  skillName: string;
  levelBefore: SkillLevel;
  levelAfter: SkillLevel;
  evidenceLinks: string[];
  validatedBy: string[];
  confidence: number; // 0-1
}

interface CollaboratorFeedback {
  collaboratorId: string;
  collaboratorName: string;
  feedback: string;
  skillsObserved: string[];
  rating: number; // 1-5
  date: Date;
}

interface MentorGuidance {
  mentorId: string;
  mentorName: string;
  guidanceType: 'review' | 'direction' | 'feedback' | 'connection';
  content: string;
  actionItems: string[];
  date: Date;
}

interface PortfolioContribution {
  contributionType: 'project_showcase' | 'code_sample' | 'design_asset' | 'case_study' | 'reflection';
  title: string;
  description: string;
  skillsDemonstrated: string[];
  artifactUrls: string[];
  presentationReady: boolean;
}

interface ImpactMetric {
  metricType: 'users_affected' | 'problems_solved' | 'improvements_made' | 'feedback_received';
  description: string;
  quantifiableValue?: number;
  qualitativeEvidence: string[];
}

const ProjectBasedLearningModules: React.FC<ProjectLearningProps> = ({
  userId,
  skillsProfile,
  identityProfile,
  culturalContext,
  activePathways,
  targetCareers,
  onProjectStart,
  onProjectComplete,
  onMilestoneAchieved
}) => {
  // State management
  const [activeTab, setActiveTab] = useState<'discover' | 'active' | 'templates' | 'portfolio' | 'mentorship'>('discover');
  const [activeProjects, setActiveProjects] = useState<ProjectBasedLearning[]>([]);
  const [projectTemplates, setProjectTemplates] = useState<ProjectTemplate[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectBasedLearning | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectProgress, setProjectProgress] = useState<Record<string, ProjectProgress>>({});
  const [availableMentors, setAvailableMentors] = useState<any[]>([]);
  const [collaborationOpportunities, setCollaborationOpportunities] = useState<any[]>([]);
  const [portfolioShowcase, setPortfolioShowcase] = useState<any[]>([]);

  // Initialize project-based learning data
  useEffect(() => {
    loadProjectLearningData();
  }, [userId, skillsProfile, activePathways]);

  const loadProjectLearningData = async () => {
    try {
      // Load project templates based on skills gaps and career targets
      const templates = await generateProjectTemplates(
        skillsProfile,
        targetCareers,
        activePathways,
        identityProfile
      );
      setProjectTemplates(templates);

      // Load active projects
      const projects = await loadActiveProjects(userId);
      setActiveProjects(projects);

      // Load project progress
      const progressData = await loadProjectProgress(projects);
      setProjectProgress(progressData);

      // Load mentors and collaboration opportunities
      const mentors = await findAvailableMentors(targetCareers, culturalContext);
      setAvailableMentors(mentors);

      const collaborations = await findCollaborationOpportunities(targetCareers, skillsProfile);
      setCollaborationOpportunities(collaborations);

      // Load portfolio showcase
      const showcase = await loadPortfolioShowcase(userId);
      setPortfolioShowcase(showcase);

    } catch (error) {
      console.error('Error loading project learning data:', error);
    }
  };

  // Start new project
  const handleStartProject = useCallback(async (template: ProjectTemplate) => {
    try {
      const newProject = await createProjectFromTemplate(
        template,
        userId,
        skillsProfile,
        identityProfile,
        culturalContext
      );
      
      setActiveProjects(prev => [...prev, newProject]);
      onProjectStart?.(newProject);
      setShowProjectModal(false);
      
    } catch (error) {
      console.error('Error starting project:', error);
    }
  }, [userId, skillsProfile, identityProfile, culturalContext, onProjectStart]);

  // Complete project milestone
  const handleMilestoneComplete = useCallback(async (projectId: string, milestone: string) => {
    try {
      const updatedProject = await completeMilestone(projectId, milestone);
      
      setActiveProjects(prev => 
        prev.map(project => 
          project.projectId === projectId ? updatedProject : project
        )
      );
      
      onMilestoneAchieved?.(projectId, milestone);
      
    } catch (error) {
      console.error('Error completing milestone:', error);
    }
  }, [onMilestoneAchieved]);

  // Render project discovery
  const renderProjectDiscovery = () => {
    return (
      <div className="space-y-6">
        {/* Recommended projects based on learning pathways */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Recommended for Your Learning Goals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getRecommendedProjects(projectTemplates, activePathways).map((template, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-gray-800">{template.title}</h4>
                  <span className={`px-2 py-1 rounded text-xs ${
                    template.difficultyLevel === 'starter' ? 'bg-green-100 text-green-700' :
                    template.difficultyLevel === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                    template.difficultyLevel === 'advanced' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {template.difficultyLevel}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="text-xs text-gray-500">Skills you'll develop:</div>
                  <div className="flex flex-wrap gap-1">
                    {template.skillTargets.slice(0, 3).map((skill, skillIndex) => (
                      <span key={skillIndex} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                  <span>📅 {template.estimatedHours} hours</span>
                  <span>🤝 {template.collaborationType}</span>
                </div>

                {template.realWorldImpact && (
                  <div className="bg-green-50 border border-green-200 rounded p-2 mb-3">
                    <span className="text-xs text-green-700">🌍 Real-world impact project</span>
                  </div>
                )}

                <button
                  onClick={() => handleStartProject(template)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Start Project
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Project categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {getProjectCategories().map((category, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="text-3xl mb-3">{category.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-2">{category.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{category.description}</p>
              <div className="text-sm text-blue-600">
                {getProjectCountByCategory(projectTemplates, category.id)} projects available
              </div>
            </div>
          ))}
        </div>

        {/* Industry-specific projects */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🏢 Industry-Specific Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {targetCareers.slice(0, 4).map((career, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">{career.title}</h4>
                <div className="space-y-2">
                  {getProjectsForCareer(projectTemplates, career).slice(0, 3).map((project, projectIndex) => (
                    <div key={projectIndex} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{project.title}</span>
                      <button
                        onClick={() => handleStartProject(project)}
                        className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100"
                      >
                        Start
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render active projects
  const renderActiveProjects = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">Active Projects</h3>
          <button
            onClick={() => setActiveTab('discover')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Discover New Projects
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeProjects.map((project) => {
            const progress = projectProgress[project.projectId];
            
            return (
              <div key={project.projectId} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-800">{project.title}</h4>
                    <p className="text-sm text-gray-600">{project.category.replace('_', ' ').toUpperCase()}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    project.status === 'active' ? 'bg-green-100 text-green-700' :
                    project.status === 'planning' ? 'bg-blue-100 text-blue-700' :
                    project.status === 'review' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {project.status}
                  </span>
                </div>

                <p className="text-sm text-gray-700 mb-4">{project.description}</p>

                {/* Progress bar */}
                {progress && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{Math.round(progress.completionPercentage * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${progress.completionPercentage * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Current phase */}
                {progress && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <div className="text-sm font-medium text-blue-800">Current Phase:</div>
                    <div className="text-sm text-blue-700">{progress.currentPhase}</div>
                  </div>
                )}

                {/* Skills being developed */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Skills Developing:</div>
                  <div className="flex flex-wrap gap-1">
                    {project.skillTargets.slice(0, 3).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                        {skill.skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Team composition */}
                {project.teamComposition && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-1">Team:</div>
                    <div className="text-sm text-gray-600">
                      {project.teamComposition.size} members • {project.teamComposition.roles.join(', ')}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Continue Working
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProject(project);
                      setActiveTab('portfolio');
                    }}
                    className="px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                  >
                    View Portfolio
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {activeProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📂</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Active Projects</h3>
            <p className="text-gray-600 mb-4">Start your first project-based learning experience</p>
            <button
              onClick={() => setActiveTab('discover')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Discover Projects
            </button>
          </div>
        )}
      </div>
    );
  };

  // Render mentorship tab
  const renderMentorshipTab = () => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Project Mentorship & Guidance</h3>
          <p className="text-gray-600">
            Connect with industry professionals for project guidance, code reviews, and career advice
          </p>
        </div>

        {/* Available mentors */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">👥 Available Mentors</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableMentors.slice(0, 6).map((mentor, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium">{mentor.name?.charAt(0) || 'M'}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{mentor.name}</div>
                    <div className="text-sm text-gray-600">{mentor.title}</div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-600">Expertise:</div>
                  <div className="flex flex-wrap gap-1">
                    {mentor.expertise?.slice(0, 3).map((skill: string, skillIndex: number) => (
                      <span key={skillIndex} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-3">
                  {mentor.experience} years experience • {mentor.projectsGuided} projects guided
                </div>

                <button className="w-full px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                  Request Mentorship
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Mentorship benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {getMentorshipBenefits().map((benefit, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="text-3xl mb-3">{benefit.icon}</div>
              <h4 className="font-semibold text-gray-800 mb-2">{benefit.title}</h4>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Project-Based Learning
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Learn by doing with real-world projects that build skills, create portfolio pieces, 
            and make meaningful impact while connecting with mentors and collaborators.
          </p>
        </div>

        {/* Navigation tabs */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8">
          <div className="flex space-x-4">
            {[
              { id: 'discover', label: 'Discover Projects', icon: '🔍' },
              { id: 'active', label: 'Active Projects', icon: '🚀' },
              { id: 'templates', label: 'Project Templates', icon: '📋' },
              { id: 'mentorship', label: 'Mentorship', icon: '👥' },
              { id: 'portfolio', label: 'Portfolio', icon: '🎨' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        {activeTab === 'discover' && renderProjectDiscovery()}
        {activeTab === 'active' && renderActiveProjects()}
        {activeTab === 'mentorship' && renderMentorshipTab()}
        {activeTab === 'templates' && (
          <div className="text-center py-12">
            <p className="text-gray-600">Project templates content would be implemented here</p>
          </div>
        )}
        {activeTab === 'portfolio' && (
          <div className="text-center py-12">
            <p className="text-gray-600">Portfolio showcase content would be implemented here</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions
const getRecommendedProjects = (templates: ProjectTemplate[], pathways: LearningPathway[]): ProjectTemplate[] => {
  // Implementation would filter templates based on active learning pathways
  return templates.slice(0, 6);
};

const getProjectCategories = () => [
  {
    id: 'skill_building',
    name: 'Skill Building',
    icon: '💪',
    description: 'Projects focused on developing specific technical or soft skills'
  },
  {
    id: 'portfolio_piece',
    name: 'Portfolio Projects',
    icon: '🎨',
    description: 'Showcase projects that demonstrate your capabilities to employers'
  },
  {
    id: 'real_world_application',
    name: 'Real-World Impact',
    icon: '🌍',
    description: 'Projects that solve actual problems and create meaningful impact'
  },
  {
    id: 'collaboration',
    name: 'Team Collaboration',
    icon: '🤝',
    description: 'Multi-person projects that build teamwork and leadership skills'
  }
];

const getProjectCountByCategory = (templates: ProjectTemplate[], categoryId: string): number => {
  return templates.filter(t => t.category === categoryId).length;
};

const getProjectsForCareer = (templates: ProjectTemplate[], career: CareerOption): ProjectTemplate[] => {
  return templates.filter(t => 
    t.industryRelevance.some(industry => 
      career.industry.some(careerIndustry => 
        industry.toLowerCase().includes(careerIndustry.toLowerCase())
      )
    )
  );
};

const getMentorshipBenefits = () => [
  {
    icon: '🎯',
    title: 'Expert Guidance',
    description: 'Get direct feedback and direction from industry professionals'
  },
  {
    icon: '🔍',
    title: 'Code Reviews',
    description: 'Receive detailed reviews of your work and suggestions for improvement'
  },
  {
    icon: '🌟',
    title: 'Career Insights',
    description: 'Learn about industry trends, career paths, and professional development'
  }
];

// API functions (implementations would be expanded)
const generateProjectTemplates = async (
  skillsProfile: SkillsInventoryProfile,
  targetCareers: CareerOption[],
  pathways: LearningPathway[],
  identityProfile: IdentityExplorationProfile
): Promise<ProjectTemplate[]> => {
  // Implementation would generate AI-powered project templates
  return [];
};

const loadActiveProjects = async (userId: string): Promise<ProjectBasedLearning[]> => {
  // Implementation would load user's active projects
  return [];
};

const loadProjectProgress = async (projects: ProjectBasedLearning[]): Promise<Record<string, ProjectProgress>> => {
  // Implementation would load progress for each project
  return {};
};

const findAvailableMentors = async (careers: CareerOption[], culturalContext: CulturalContext): Promise<any[]> => {
  // Implementation would find mentors relevant to career goals
  return [];
};

const findCollaborationOpportunities = async (careers: CareerOption[], skillsProfile: SkillsInventoryProfile): Promise<any[]> => {
  // Implementation would find collaboration opportunities
  return [];
};

const loadPortfolioShowcase = async (userId: string): Promise<any[]> => {
  // Implementation would load portfolio items
  return [];
};

const createProjectFromTemplate = async (
  template: ProjectTemplate,
  userId: string,
  skillsProfile: SkillsInventoryProfile,
  identityProfile: IdentityExplorationProfile,
  culturalContext: CulturalContext
): Promise<ProjectBasedLearning> => {
  // Implementation would create personalized project from template
  return {} as ProjectBasedLearning;
};

const completeMilestone = async (projectId: string, milestone: string): Promise<ProjectBasedLearning> => {
  // Implementation would update milestone completion
  return {} as ProjectBasedLearning;
};

export default ProjectBasedLearningModules;