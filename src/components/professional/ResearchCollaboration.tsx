'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Shield,
  Award,
  Brain,
  Heart,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
  Star,
  Download,
  Share2,
  ExternalLink,
  BookOpen,
  Microscope,
  Database,
  PieChart,
  LineChart,
  Filter,
  Search,
  Calendar,
  Upload,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Globe,
  Building2,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Lightbulb,
  Zap,
  ChevronDown,
  ChevronRight,
  Plus,
  Settings,
  Info,
  CheckShield
} from 'lucide-react';

interface ResearchStudy {
  id: string;
  title: string;
  institution: string;
  principalInvestigator: string;
  status: 'recruiting' | 'active' | 'analyzing' | 'completed' | 'published';
  phase: 'pilot' | 'phase-1' | 'phase-2' | 'phase-3' | 'longitudinal';
  participantCount: {
    target: number;
    enrolled: number;
    completed: number;
  };
  duration: string;
  startDate: string;
  endDate?: string;
  description: string;
  objectives: string[];
  inclusionCriteria: string[];
  exclusionCriteria: string[];
  interventions: string[];
  outcomes: {
    primary: string[];
    secondary: string[];
  };
  ethicsApproval: {
    irbNumber: string;
    approvalDate: string;
    institution: string;
  };
  funding: {
    source: string;
    amount?: string;
    grantNumber?: string;
  };
  publications: ResearchPublication[];
  participatingTherapists: number;
  dataCollectionMethods: string[];
  compensationOffered: boolean;
  timeCommitment: string;
  tags: string[];
}

interface ResearchPublication {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  status: 'draft' | 'submitted' | 'under-review' | 'accepted' | 'published';
  submissionDate?: string;
  publicationDate?: string;
  doi?: string;
  abstract: string;
  keywords: string[];
  impactFactor?: number;
  citationCount?: number;
  openAccess: boolean;
}

interface CollaborationOpportunity {
  id: string;
  type: 'research-study' | 'case-study' | 'publication' | 'conference' | 'grant-application';
  title: string;
  organization: string;
  contactPerson: string;
  description: string;
  requirements: string[];
  benefits: string[];
  timeline: string;
  applicationDeadline?: string;
  status: 'open' | 'applied' | 'accepted' | 'declined' | 'completed';
  match_score: number;
}

interface DataContribution {
  studyId: string;
  clientsEnrolled: number;
  dataPointsContributed: number;
  lastContribution: string;
  contributionType: 'outcome-measures' | 'engagement-metrics' | 'intervention-data' | 'qualitative-notes';
  privacy_level: 'fully-anonymized' | 'coded' | 'aggregated-only';
  compensation: {
    type: 'monetary' | 'ce-credits' | 'co-authorship' | 'recognition';
    amount?: string;
    earned?: string;
  };
}

export default function ResearchCollaboration() {
  const [activeTab, setActiveTab] = useState<'studies' | 'contributions' | 'publications' | 'opportunities' | 'analytics'>('studies');
  const [studies, setStudies] = useState<ResearchStudy[]>([]);
  const [publications, setPublications] = useState<ResearchPublication[]>([]);
  const [opportunities, setOpportunities] = useState<CollaborationOpportunity[]>([]);
  const [contributions, setContributions] = useState<DataContribution[]>([]);
  const [filterBy, setFilterBy] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    // Initialize sample research data
    setStudies([
      {
        id: 'study-1',
        title: 'AI-Enhanced Trauma Recovery: Effectiveness of Digital Therapeutic Interventions',
        institution: 'Stanford University School of Medicine',
        principalInvestigator: 'Dr. Sarah Chen, PhD',
        status: 'active',
        phase: 'phase-2',
        participantCount: { target: 200, enrolled: 156, completed: 89 },
        duration: '18 months',
        startDate: '2024-01-15',
        endDate: '2025-07-15',
        description: 'A randomized controlled trial examining the effectiveness of AI-powered journaling interventions in reducing PTSD symptoms and improving emotional regulation outcomes.',
        objectives: [
          'Evaluate reduction in PTSD symptom severity',
          'Measure improvement in emotional regulation skills',
          'Assess user engagement with AI-powered interventions',
          'Compare outcomes to traditional therapy approaches'
        ],
        inclusionCriteria: [
          'Adults 18-65 with clinically diagnosed PTSD',
          'Stable on medications for 6+ weeks',
          'Access to smartphone/computer',
          'Fluent in English'
        ],
        exclusionCriteria: [
          'Active suicidal ideation requiring immediate intervention',
          'Substance use disorder requiring detox',
          'Severe cognitive impairment',
          'Currently participating in other research studies'
        ],
        interventions: [
          'AI-guided journaling prompts',
          'Personalized coping skill recommendations',
          'Progress tracking and feedback',
          'Crisis detection and resource connection'
        ],
        outcomes: {
          primary: ['PTSD Checklist for DSM-5 (PCL-5)', 'Difficulties in Emotion Regulation Scale (DERS)'],
          secondary: ['GAD-7', 'PHQ-9', 'WEMWBS', 'User engagement metrics']
        },
        ethicsApproval: {
          irbNumber: 'IRB-2023-089',
          approvalDate: '2023-12-10',
          institution: 'Stanford University IRB'
        },
        funding: {
          source: 'National Institute of Mental Health',
          amount: '$2.3M',
          grantNumber: 'R01MH123456'
        },
        publications: [],
        participatingTherapists: 45,
        dataCollectionMethods: ['Clinical interviews', 'Self-report measures', 'App usage analytics', 'Qualitative interviews'],
        compensationOffered: true,
        timeCommitment: '2-3 hours per participant enrollment + follow-up',
        tags: ['PTSD', 'Digital Therapeutics', 'AI', 'RCT']
      },
      {
        id: 'study-2',
        title: 'Cultural Adaptation of Digital Mental Health Interventions',
        institution: 'UCLA Center for Digital Mental Health',
        principalInvestigator: 'Dr. Maria Rodriguez, PsyD',
        status: 'recruiting',
        phase: 'pilot',
        participantCount: { target: 60, enrolled: 23, completed: 0 },
        duration: '12 months',
        startDate: '2024-03-01',
        description: 'Pilot study examining culturally adapted AI interventions for Latinx and Indigenous communities experiencing intergenerational trauma.',
        objectives: [
          'Develop culturally responsive AI intervention protocols',
          'Assess acceptability and engagement across cultural groups',
          'Identify barriers to digital mental health adoption',
          'Create community-informed adaptation guidelines'
        ],
        inclusionCriteria: [
          'Self-identified Latinx or Indigenous heritage',
          'Experience of intergenerational trauma',
          'Age 18-50',
          'Bilingual (Spanish/English or Native language/English)'
        ],
        exclusionCriteria: [
          'Current participation in intensive therapy',
          'Severe psychiatric symptoms requiring immediate care'
        ],
        interventions: [
          'Culturally adapted journaling prompts',
          'Community wisdom integration',
          'Trauma-informed cultural practices',
          'Peer support circles'
        ],
        outcomes: {
          primary: ['Cultural acceptability measures', 'Engagement metrics'],
          secondary: ['PTSD symptoms', 'Cultural identity strength', 'Social connectedness']
        },
        ethicsApproval: {
          irbNumber: 'UCLA-IRB-2024-012',
          approvalDate: '2024-02-15',
          institution: 'UCLA Institutional Review Board'
        },
        funding: {
          source: 'Robert Wood Johnson Foundation',
          amount: '$485K',
          grantNumber: 'RWJF-2024-078'
        },
        publications: [],
        participatingTherapists: 12,
        dataCollectionMethods: ['Focus groups', 'Cultural consultation', 'Usage analytics', 'Community feedback'],
        compensationOffered: true,
        timeCommitment: '1-2 hours per participant + consultation meetings',
        tags: ['Cultural Adaptation', 'Latinx', 'Indigenous', 'Community-Based']
      }
    ]);

    setPublications([
      {
        id: 'pub-1',
        title: 'Digital Therapeutics in Trauma Recovery: A Systematic Review and Meta-Analysis',
        authors: ['Chen, S.', 'Rodriguez, M.', 'Johnson, K.', 'ALCHM Research Collaborative'],
        journal: 'Journal of Medical Internet Research',
        status: 'published',
        publicationDate: '2024-02-15',
        doi: '10.2196/45678',
        abstract: 'This systematic review and meta-analysis examines the effectiveness of digital therapeutic interventions for trauma recovery across 23 randomized controlled trials...',
        keywords: ['Digital therapeutics', 'PTSD', 'Mobile health', 'Trauma recovery', 'Meta-analysis'],
        impactFactor: 7.4,
        citationCount: 12,
        openAccess: true
      },
      {
        id: 'pub-2',
        title: 'AI-Powered Crisis Detection in Digital Mental Health Platforms: Ethical Considerations',
        authors: ['ALCHM Ethics Board', 'Chen, S.', 'Martinez, L.'],
        journal: 'Ethics in Science and Technology',
        status: 'under-review',
        submissionDate: '2024-01-20',
        abstract: 'As AI systems become more sophisticated in detecting mental health crises, this paper examines the ethical implications...',
        keywords: ['AI ethics', 'Crisis detection', 'Digital mental health', 'Privacy'],
        openAccess: false
      }
    ]);

    setOpportunities([
      {
        id: 'opp-1',
        type: 'grant-application',
        title: 'NIMH Small Business Innovation Research (SBIR) Grant',
        organization: 'National Institute of Mental Health',
        contactPerson: 'Dr. Program Officer',
        description: 'Funding opportunity for innovative digital mental health solutions with commercial potential.',
        requirements: [
          'Small business entity',
          'Novel digital intervention',
          'Strong preliminary data',
          'Commercialization plan'
        ],
        benefits: [
          'Up to $1.8M in funding',
          'NIMH mentorship program',
          'Regulatory guidance',
          'Market validation support'
        ],
        timeline: 'Phase I: 6 months, Phase II: 24 months',
        applicationDeadline: '2024-05-15',
        status: 'open',
        match_score: 94
      },
      {
        id: 'opp-2',
        type: 'publication',
        title: 'Special Issue: Technology and Trauma-Informed Care',
        organization: 'Journal of Trauma & Dissociation',
        contactPerson: 'Dr. Guest Editor',
        description: 'Seeking original research on the intersection of technology and trauma-informed therapeutic practices.',
        requirements: [
          'Original research or systematic review',
          'Trauma-informed approach',
          'Technology component',
          'IRB approval for human subjects research'
        ],
        benefits: [
          'High-impact publication',
          'Expert peer review',
          'Increased visibility',
          'Professional recognition'
        ],
        timeline: 'Submission deadline: June 30, 2024',
        status: 'open',
        match_score: 89
      }
    ]);

    setContributions([
      {
        studyId: 'study-1',
        clientsEnrolled: 12,
        dataPointsContributed: 1847,
        lastContribution: '2024-03-15',
        contributionType: 'outcome-measures',
        privacy_level: 'fully-anonymized',
        compensation: {
          type: 'ce-credits',
          amount: '15 CE credits',
          earned: '12 CE credits'
        }
      },
      {
        studyId: 'study-2',
        clientsEnrolled: 4,
        dataPointsContributed: 298,
        lastContribution: '2024-03-10',
        contributionType: 'qualitative-notes',
        privacy_level: 'coded',
        compensation: {
          type: 'co-authorship',
          amount: 'Contributing author on study publications'
        }
      }
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'published':
      case 'accepted': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'recruiting':
      case 'under-review':
      case 'open': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'analyzing':
      case 'submitted': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'completed': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const renderStudies = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Active Research Studies</h1>
          <p className="text-gray-600">Contribute to evidence-based mental health research</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search studies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            />
          </div>
          <Button variant="secondary" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {studies.map((study) => (
          <Card key={study.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Microscope className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{study.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {study.institution}
                      </span>
                      <span className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        {study.principalInvestigator}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {study.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(study.status)}`}>
                        {study.status}
                      </div>
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                        {study.phase}
                      </div>
                      <div className="text-xs text-gray-500">
                        IRB: {study.ethicsApproval.irbNumber}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button variant="secondary" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Join Study
                </Button>
              </div>
            </div>

            {/* Study Metrics */}
            <div className="grid grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-medium text-blue-600">
                  {study.participantCount.enrolled}/{study.participantCount.target}
                </div>
                <div className="text-xs text-gray-600">Participants</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium text-emerald-600">{study.participantCount.completed}</div>
                <div className="text-xs text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium text-purple-600">{study.participatingTherapists}</div>
                <div className="text-xs text-gray-600">Therapists</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium text-amber-600">
                  {Math.round((study.participantCount.enrolled / study.participantCount.target) * 100)}%
                </div>
                <div className="text-xs text-gray-600">Enrolled</div>
              </div>
            </div>

            {/* Study Description */}
            <div className="mb-4">
              <p className="text-sm text-gray-700 mb-3">{study.description}</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Primary Objectives</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {study.objectives.slice(0, 2).map((objective, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Target className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Interventions</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {study.interventions.slice(0, 2).map((intervention, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Zap className="h-3 w-3 text-emerald-500 mt-1 flex-shrink-0" />
                        <span>{intervention}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Funding & Ethics */}
            <div className="flex items-center justify-between p-3 bg-sage-50 rounded-lg">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-sage-700">
                  <Database className="h-4 w-4" />
                  <span className="font-medium">Funding:</span>
                  <span>{study.funding.source}</span>
                  {study.funding.amount && <span className="text-sage-600">({study.funding.amount})</span>}
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1 text-emerald-700">
                  <CheckShield className="h-4 w-4" />
                  <span>IRB Approved</span>
                </div>
                {study.compensationOffered && (
                  <div className="flex items-center gap-1 text-purple-700">
                    <Award className="h-4 w-4" />
                    <span>Compensation</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {study.tags.map((tag, index) => (
                <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderContributions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">My Research Contributions</h1>
          <p className="text-gray-600">Track your data contributions and research impact</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Contribution Summary */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6 text-center border-sage-200">
          <div className="p-3 bg-sage-100 rounded-xl w-fit mx-auto mb-3">
            <Users className="h-6 w-6 text-sage-600" />
          </div>
          <div className="text-2xl font-medium text-sage-700 mb-1">
            {contributions.reduce((sum, c) => sum + c.clientsEnrolled, 0)}
          </div>
          <div className="text-sm text-sage-600">Clients Enrolled</div>
        </Card>

        <Card className="p-6 text-center border-blue-200">
          <div className="p-3 bg-blue-100 rounded-xl w-fit mx-auto mb-3">
            <Database className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-2xl font-medium text-blue-700 mb-1">
            {contributions.reduce((sum, c) => sum + c.dataPointsContributed, 0)}
          </div>
          <div className="text-sm text-blue-600">Data Points</div>
        </Card>

        <Card className="p-6 text-center border-emerald-200">
          <div className="p-3 bg-emerald-100 rounded-xl w-fit mx-auto mb-3">
            <BookOpen className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="text-2xl font-medium text-emerald-700 mb-1">2</div>
          <div className="text-sm text-emerald-600">Active Studies</div>
        </Card>

        <Card className="p-6 text-center border-purple-200">
          <div className="p-3 bg-purple-100 rounded-xl w-fit mx-auto mb-3">
            <Award className="h-6 w-6 text-purple-600" />
          </div>
          <div className="text-2xl font-medium text-purple-700 mb-1">27</div>
          <div className="text-sm text-purple-600">CE Credits Earned</div>
        </Card>
      </div>

      {/* Individual Contributions */}
      <div className="grid gap-6">
        {contributions.map((contribution) => {
          const study = studies.find(s => s.id === contribution.studyId);
          if (!study) return null;

          return (
            <Card key={contribution.studyId} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{study.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span>Last contribution: {contribution.lastContribution}</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(contribution.privacy_level)}`}>
                      {contribution.privacy_level}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Data
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-medium text-blue-700">{contribution.clientsEnrolled}</div>
                  <div className="text-xs text-blue-600">Clients Enrolled</div>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-lg">
                  <div className="text-lg font-medium text-emerald-700">{contribution.dataPointsContributed}</div>
                  <div className="text-xs text-emerald-600">Data Points</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-medium text-purple-700 capitalize">{contribution.contributionType.replace('-', ' ')}</div>
                  <div className="text-xs text-purple-600">Contribution Type</div>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <div className="text-lg font-medium text-amber-700">{contribution.compensation.earned || contribution.compensation.amount}</div>
                  <div className="text-xs text-amber-600 capitalize">{contribution.compensation.type}</div>
                </div>
              </div>

              <div className="p-4 bg-sage-50 rounded-lg border border-sage-200">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-sage-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-sage-900 mb-1">Privacy Protection</div>
                    <div className="text-sm text-sage-800">
                      Your contributed data is {contribution.privacy_level.replace('-', ' ')} and meets all 
                      HIPAA requirements. Client identities are never shared with researchers.
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderPublications = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Research Publications</h1>
          <p className="text-gray-600">Collaborative research outputs and academic contributions</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Submit Publication
        </Button>
      </div>

      <div className="grid gap-6">
        {publications.map((publication) => (
          <Card key={publication.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <FileText className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{publication.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span className="font-medium">{publication.journal}</span>
                      {publication.impactFactor && (
                        <span className="text-blue-600">IF: {publication.impactFactor}</span>
                      )}
                      {publication.citationCount && (
                        <span className="text-purple-600">{publication.citationCount} citations</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(publication.status)}`}>
                        {publication.status}
                      </div>
                      {publication.openAccess && (
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <Globe className="h-3 w-3 mr-1" />
                          Open Access
                        </div>
                      )}
                      {publication.doi && (
                        <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-xs">
                          DOI: {publication.doi}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Abstract
                </Button>
                {publication.status === 'published' && (
                  <Button variant="secondary" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Read Full Text
                  </Button>
                )}
              </div>
            </div>

            {/* Authors */}
            <div className="mb-3">
              <div className="text-sm text-gray-700">
                <span className="font-medium">Authors:</span> {publication.authors.join(', ')}
              </div>
            </div>

            {/* Publication Details */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                {publication.publicationDate && (
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Published:</span> {publication.publicationDate}
                  </div>
                )}
                {publication.submissionDate && (
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Submitted:</span> {publication.submissionDate}
                  </div>
                )}
              </div>
              <div>
                {publication.impactFactor && (
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Impact Factor:</span> {publication.impactFactor}
                  </div>
                )}
                {publication.citationCount && (
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">Citations:</span> {publication.citationCount}
                  </div>
                )}
              </div>
            </div>

            {/* Abstract */}
            <div className="mb-4">
              <div className="text-sm text-gray-700">
                <span className="font-medium">Abstract:</span> {publication.abstract.slice(0, 200)}...
              </div>
            </div>

            {/* Keywords */}
            <div className="flex flex-wrap gap-2">
              {publication.keywords.map((keyword, index) => (
                <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-800">
                  {keyword}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderOpportunities = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Collaboration Opportunities</h1>
          <p className="text-gray-600">Discover research partnerships and funding opportunities</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Alert
        </Button>
      </div>

      <div className="grid gap-6">
        {opportunities.map((opportunity) => (
          <Card key={opportunity.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Award className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{opportunity.title}</h3>
                      <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                        <Star className="h-3 w-3" />
                        {opportunity.match_score}% match
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {opportunity.organization}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {opportunity.contactPerson}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(opportunity.status)}`}>
                        {opportunity.status}
                      </div>
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 capitalize">
                        {opportunity.type.replace('-', ' ')}
                      </div>
                      {opportunity.applicationDeadline && (
                        <div className="text-xs text-red-600">
                          Deadline: {opportunity.applicationDeadline}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Apply
                </Button>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <p className="text-sm text-gray-700">{opportunity.description}</p>
            </div>

            {/* Requirements & Benefits */}
            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {opportunity.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Benefits</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {opportunity.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-emerald-500 mt-1 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Timeline:</span>
                <span>{opportunity.timeline}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Research Analytics</h1>
          <p className="text-gray-600">Platform-wide research insights and trends</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Dashboard
        </Button>
      </div>

      {/* Platform Statistics */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6 text-center border-sage-200">
          <div className="p-3 bg-sage-100 rounded-xl w-fit mx-auto mb-3">
            <Microscope className="h-6 w-6 text-sage-600" />
          </div>
          <div className="text-2xl font-medium text-sage-700 mb-1">147</div>
          <div className="text-sm text-sage-600">Active Studies</div>
          <div className="text-xs text-sage-500 mt-1">+12 this quarter</div>
        </Card>

        <Card className="p-6 text-center border-blue-200">
          <div className="p-3 bg-blue-100 rounded-xl w-fit mx-auto mb-3">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-2xl font-medium text-blue-700 mb-1">2,847</div>
          <div className="text-sm text-blue-600">Research Participants</div>
          <div className="text-xs text-blue-500 mt-1">89% retention rate</div>
        </Card>

        <Card className="p-6 text-center border-emerald-200">
          <div className="p-3 bg-emerald-100 rounded-xl w-fit mx-auto mb-3">
            <FileText className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="text-2xl font-medium text-emerald-700 mb-1">234</div>
          <div className="text-sm text-emerald-600">Publications</div>
          <div className="text-xs text-emerald-500 mt-1">67% open access</div>
        </Card>

        <Card className="p-6 text-center border-purple-200">
          <div className="p-3 bg-purple-100 rounded-xl w-fit mx-auto mb-3">
            <Award className="h-6 w-6 text-purple-600" />
          </div>
          <div className="text-2xl font-medium text-purple-700 mb-1">$18.2M</div>
          <div className="text-sm text-purple-600">Research Funding</div>
          <div className="text-xs text-purple-500 mt-1">From 47 grants</div>
        </Card>
      </div>

      {/* Research Impact */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <TrendingUp className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Research Impact Metrics</h3>
            <p className="text-sm text-gray-600">Platform contributions to mental health research</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-medium text-blue-700 mb-2">23%</div>
            <div className="text-sm font-medium text-blue-600 mb-1">Faster Recovery</div>
            <div className="text-xs text-blue-500">
              With AI-assisted interventions vs. control groups
            </div>
          </div>
          
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <div className="text-3xl font-medium text-emerald-700 mb-2">4.7x</div>
            <div className="text-sm font-medium text-emerald-600 mb-1">Higher Engagement</div>
            <div className="text-xs text-emerald-500">
              Compared to traditional journaling methods
            </div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-medium text-purple-700 mb-2">67%</div>
            <div className="text-sm font-medium text-purple-600 mb-1">Crisis Prevention</div>
            <div className="text-xs text-purple-500">
              Effective early warning system accuracy
            </div>
          </div>
        </div>
      </Card>

      {/* Research Ethics */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <Shield className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Ethical Research Standards</h3>
            <p className="text-sm text-gray-600">Our commitment to responsible research practices</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <CheckShield className="h-5 w-5 text-emerald-600" />
              <div>
                <div className="font-medium text-emerald-900">100% IRB Approved</div>
                <div className="text-sm text-emerald-700">All studies meet ethical standards</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Lock className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium text-blue-900">HIPAA Compliant</div>
                <div className="text-sm text-blue-700">Full privacy protection guaranteed</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <div className="font-medium text-purple-900">Informed Consent</div>
                <div className="text-sm text-purple-700">Comprehensive participant education</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <Globe className="h-5 w-5 text-amber-600" />
              <div>
                <div className="font-medium text-amber-900">Open Science</div>
                <div className="text-sm text-amber-700">67% of publications open access</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-sage-50 rounded-lg border border-sage-200">
              <Heart className="h-5 w-5 text-sage-600" />
              <div>
                <div className="font-medium text-sage-900">Community Benefit</div>
                <div className="text-sm text-sage-700">Research directly improves platform care</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <div className="font-medium text-red-900">Harm Prevention</div>
                <div className="text-sm text-red-700">Zero tolerance for exploitative research</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-sanctuary-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
            <Microscope className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-medium text-gray-900 mb-1">Research Collaboration</h1>
            <p className="text-gray-600">Advancing evidence-based mental health care through research</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">Research Tier Active</div>
            <div className="text-xs text-gray-500">Contributing to 2 active studies</div>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
            <Award className="h-5 w-5 text-emerald-700" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 p-1 bg-gray-50 rounded-xl">
        <Button
          variant={activeTab === 'studies' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('studies')}
          className="px-6"
        >
          <Microscope className="h-4 w-4 mr-2" />
          Studies
        </Button>
        <Button
          variant={activeTab === 'contributions' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('contributions')}
          className="px-6"
        >
          <Database className="h-4 w-4 mr-2" />
          My Contributions
        </Button>
        <Button
          variant={activeTab === 'publications' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('publications')}
          className="px-6"
        >
          <FileText className="h-4 w-4 mr-2" />
          Publications
        </Button>
        <Button
          variant={activeTab === 'opportunities' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('opportunities')}
          className="px-6"
        >
          <Award className="h-4 w-4 mr-2" />
          Opportunities
        </Button>
        <Button
          variant={activeTab === 'analytics' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('analytics')}
          className="px-6"
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Analytics
        </Button>
      </div>

      {/* Content */}
      {activeTab === 'studies' && renderStudies()}
      {activeTab === 'contributions' && renderContributions()}
      {activeTab === 'publications' && renderPublications()}
      {activeTab === 'opportunities' && renderOpportunities()}
      {activeTab === 'analytics' && renderAnalytics()}
    </div>
  );
}