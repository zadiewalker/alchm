'use client';

/**
 * Professional Community Network Platform
 * 
 * Exclusive network for verified mental health professionals using ALCHM.
 * Features professional collaboration, research sharing, CEU tracking,
 * referral systems, and advocacy building tools.
 */

import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface CommunityNetworkProps {
  therapistId: string;
  therapistProfile: any; // Would use TherapistProfile type from platform
}

interface Discussion {
  id: string;
  authorId: string;
  authorName: string;
  authorCredentials: string;
  title: string;
  content: string;
  category: 'clinical-insights' | 'research' | 'case-consultation' | 'alchm-integration' | 'general';
  tags: string[];
  likes: number;
  replies: number;
  isAnonymous: boolean;
  createdAt: Timestamp;
  lastActivity: Timestamp;
}

interface CaseConsultation {
  id: string;
  consultantId: string;
  title: string;
  description: string;
  clientDemographics: {
    ageRange: string;
    presentingConcerns: string[];
    treatmentHistory: string;
  };
  alchemIntegration: {
    pathwaysUsed: string[];
    engagementLevel: string;
    challenges: string[];
  };
  questionsForCommunity: string[];
  urgency: 'low' | 'medium' | 'high';
  status: 'open' | 'resolved' | 'archived';
  responses: number;
  createdAt: Timestamp;
}

interface ResearchCollaboration {
  id: string;
  leadResearcherId: string;
  title: string;
  description: string;
  researchType: 'effectiveness-study' | 'case-series' | 'outcome-research' | 'qualitative-study';
  participationRequirements: string[];
  timeline: string;
  expectedCommitment: string;
  ethicsApproval: boolean;
  participantsNeeded: number;
  currentParticipants: number;
  status: 'recruiting' | 'active' | 'analyzing' | 'completed';
  compensationOffered: boolean;
  ceuCredits?: number;
  createdAt: Timestamp;
}

interface CEUOpportunity {
  id: string;
  title: string;
  provider: string;
  description: string;
  type: 'webinar' | 'course' | 'workshop' | 'conference';
  credits: number;
  cost: number;
  startDate: Timestamp;
  duration: string;
  topics: string[];
  registrationLink: string;
  alchemRelated: boolean;
}

interface ProfessionalConnection {
  id: string;
  therapistId: string;
  name: string;
  credentials: string;
  specializations: string[];
  location: string;
  practiceType: string;
  alchemExperience: string;
  referralAccepting: boolean;
  contactPreference: 'profile-message' | 'email' | 'phone';
  mutualConnections: number;
}

export default function CommunityNetwork({ therapistId, therapistProfile }: CommunityNetworkProps) {
  const [activeTab, setActiveTab] = useState<'discussions' | 'consultations' | 'research' | 'ceu' | 'network'>('discussions');
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [consultations, setCasesultations] = useState<CaseConsultation[]>([]);
  const [researchOpportunities, setResearchOpportunities] = useState<ResearchCollaboration[]>([]);
  const [ceuOpportunities, setCeuOpportunities] = useState<CEUOpportunity[]>([]);
  const [professionalConnections, setProfessionalConnections] = useState<ProfessionalConnection[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [showNewConsultation, setShowNewConsultation] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  useEffect(() => {
    loadCommunityData();
  }, [therapistId]);

  const loadCommunityData = async () => {
    try {
      await Promise.all([
        loadDiscussions(),
        loadCaseConsultations(),
        loadResearchOpportunities(),
        loadCEUOpportunities(),
        loadProfessionalConnections()
      ]);
    } catch (error) {
      console.error('Error loading community data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDiscussions = async () => {
    // Mock discussions data
    const mockDiscussions: Discussion[] = [
      {
        id: '1',
        authorId: 'therapist-123',
        authorName: 'Dr. Sarah Chen',
        authorCredentials: 'LCSW, PhD',
        title: 'ALCHM Integration with DBT Skills Training',
        content: 'Has anyone found effective ways to integrate ALCHM pathways with traditional DBT skills groups? I\'m seeing great results with individual clients but wondering about group applications.',
        category: 'alchm-integration',
        tags: ['DBT', 'group-therapy', 'skills-training'],
        likes: 12,
        replies: 8,
        isAnonymous: false,
        createdAt: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)),
        lastActivity: Timestamp.fromDate(new Date(Date.now() - 4 * 60 * 60 * 1000))
      },
      {
        id: '2',
        authorId: 'therapist-456',
        authorName: 'Anonymous Clinician',
        authorCredentials: 'LPC',
        title: 'Effectiveness with Adolescent Anxiety',
        content: 'Preliminary observations suggest excellent engagement with anxiety pathways in teen population. Anyone conducting formal outcome measures?',
        category: 'clinical-insights',
        tags: ['adolescents', 'anxiety', 'outcomes'],
        likes: 7,
        replies: 5,
        isAnonymous: true,
        createdAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)),
        lastActivity: Timestamp.fromDate(new Date(Date.now() - 2 * 60 * 60 * 1000))
      }
    ];
    
    setDiscussions(mockDiscussions);
  };

  const loadCaseConsultations = async () => {
    // Mock consultation data
    const mockConsultations: CaseConsultation[] = [
      {
        id: '1',
        consultantId: 'therapist-789',
        title: 'Complex PTSD with Technology Resistance',
        description: 'Working with adult survivor of childhood trauma who shows resistance to digital tools despite being tech-savvy in other areas.',
        clientDemographics: {
          ageRange: '35-40',
          presentingConcerns: ['PTSD', 'Technology anxiety', 'Trust issues'],
          treatmentHistory: 'Multiple therapists, some progress with EMDR'
        },
        alchemIntegration: {
          pathwaysUsed: ['Trauma Recovery Foundation'],
          engagementLevel: 'Low - starts but doesn\'t complete modules',
          challenges: ['Digital overwhelm', 'Perfectionism', 'Control concerns']
        },
        questionsForCommunity: [
          'Strategies for tech-resistant trauma survivors?',
          'Alternative engagement approaches?',
          'Balance between digital and analog methods?'
        ],
        urgency: 'medium',
        status: 'open',
        responses: 3,
        createdAt: Timestamp.fromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000))
      }
    ];
    
    setCasesultations(mockConsultations);
  };

  const loadResearchOpportunities = async () => {
    // Mock research opportunities
    const mockResearch: ResearchCollaboration[] = [
      {
        id: '1',
        leadResearcherId: 'researcher-001',
        title: 'ALCHM Effectiveness in Community Mental Health Settings',
        description: 'Multi-site effectiveness study examining outcomes for clients using ALCHM in community mental health centers.',
        researchType: 'effectiveness-study',
        participationRequirements: [
          'Licensed mental health professional',
          'Minimum 10 ALCHM clients',
          'Willingness to collect outcome measures'
        ],
        timeline: '18 months',
        expectedCommitment: '2-3 hours monthly for data collection',
        ethicsApproval: true,
        participantsNeeded: 25,
        currentParticipants: 12,
        status: 'recruiting',
        compensationOffered: true,
        ceuCredits: 15,
        createdAt: Timestamp.fromDate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000))
      }
    ];
    
    setResearchOpportunities(mockResearch);
  };

  const loadCEUOpportunities = async () => {
    // Mock CEU opportunities
    const mockCEU: CEUOpportunity[] = [
      {
        id: '1',
        title: 'Digital Therapeutics in Clinical Practice',
        provider: 'ALCHM Education',
        description: 'Comprehensive training on integrating digital mental health tools into evidence-based practice.',
        type: 'course',
        credits: 6,
        cost: 0,
        startDate: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
        duration: '3 sessions, 2 hours each',
        topics: ['Digital therapeutics', 'HIPAA compliance', 'Outcome measurement'],
        registrationLink: 'https://education.alchm.app/digital-therapeutics',
        alchemRelated: true
      },
      {
        id: '2',
        title: 'Trauma-Informed Technology Integration',
        provider: 'National Center for Trauma-Informed Care',
        description: 'Best practices for introducing technology-based interventions to trauma survivors.',
        type: 'webinar',
        credits: 2,
        cost: 50,
        startDate: Timestamp.fromDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)),
        duration: '2 hours',
        topics: ['Trauma-informed care', 'Technology integration', 'Safety planning'],
        registrationLink: 'https://nctic.org/webinar-registration',
        alchemRelated: false
      }
    ];
    
    setCeuOpportunities(mockCEU);
  };

  const loadProfessionalConnections = async () => {
    // Mock professional connections
    const mockConnections: ProfessionalConnection[] = [
      {
        id: '1',
        therapistId: 'therapist-999',
        name: 'Dr. Marcus Rodriguez',
        credentials: 'LMFT, EMDR Certified',
        specializations: ['Trauma therapy', 'Couples counseling', 'Digital integration'],
        location: 'San Francisco, CA',
        practiceType: 'Private practice',
        alchemExperience: '2+ years, specializes in trauma pathways',
        referralAccepting: true,
        contactPreference: 'email',
        mutualConnections: 3
      },
      {
        id: '2',
        therapistId: 'therapist-888',
        name: 'Dr. Jennifer Kim',
        credentials: 'PhD, LP',
        specializations: ['Adolescent therapy', 'Anxiety disorders', 'Technology integration'],
        location: 'Seattle, WA',
        practiceType: 'Group practice',
        alchemExperience: '1 year, focus on teen anxiety pathways',
        referralAccepting: true,
        contactPreference: 'profile-message',
        mutualConnections: 1
      }
    ];
    
    setProfessionalConnections(mockConnections);
  };

  const createDiscussion = async (discussionData: any) => {
    try {
      await addDoc(collection(db, 'professionalDiscussions'), {
        ...discussionData,
        authorId: therapistId,
        authorName: therapistProfile.name,
        authorCredentials: therapistProfile.credentials,
        likes: 0,
        replies: 0,
        createdAt: Timestamp.now(),
        lastActivity: Timestamp.now()
      });
      
      await loadDiscussions();
      setShowNewDiscussion(false);
    } catch (error) {
      console.error('Error creating discussion:', error);
    }
  };

  const createCaseConsultation = async (consultationData: any) => {
    try {
      await addDoc(collection(db, 'caseConsultations'), {
        ...consultationData,
        consultantId: therapistId,
        responses: 0,
        status: 'open',
        createdAt: Timestamp.now()
      });
      
      await loadCaseConsultations();
      setShowNewConsultation(false);
    } catch (error) {
      console.error('Error creating case consultation:', error);
    }
  };

  const joinResearchStudy = async (studyId: string) => {
    try {
      // Implementation would handle research study enrollment
      console.log(`Joining research study: ${studyId}`);
    } catch (error) {
      console.error('Error joining research study:', error);
    }
  };

  const registerForCEU = (opportunity: CEUOpportunity) => {
    typeof window !== 'undefined' && window.open(opportunity.registrationLink, '_blank');
  };

  const connectWithProfessional = async (professionalId: string) => {
    try {
      // Implementation would handle professional networking
      console.log(`Connecting with professional: ${professionalId}`);
    } catch (error) {
      console.error('Error connecting with professional:', error);
    }
  };

  const renderDiscussions = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Professional Discussions</h3>
        <Button onClick={() => setShowNewDiscussion(true)}>
          Start Discussion
        </Button>
      </div>

      {discussions.map(discussion => (
        <Card key={discussion.id} className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-semibold text-lg">{discussion.title}</h4>
              <p className="text-sm text-gray-600">
                by {discussion.isAnonymous ? 'Anonymous Clinician' : discussion.authorName} 
                ({discussion.authorCredentials}) • {discussion.createdAt.toDate().toLocaleDateString()}
              </p>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              {discussion.category.replace('-', ' ')}
            </Badge>
          </div>

          <p className="text-gray-700 mb-4">{discussion.content}</p>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {discussion.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{discussion.likes} likes</span>
              <span>{discussion.replies} replies</span>
              <Button variant="outline" size="sm">View Discussion</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderCaseConsultations = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Case Consultations</h3>
        <Button onClick={() => setShowNewConsultation(true)}>
          Request Consultation
        </Button>
      </div>

      {consultations.map(consultation => (
        <Card key={consultation.id} className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-semibold text-lg">{consultation.title}</h4>
              <p className="text-sm text-gray-600">
                Posted {consultation.createdAt.toDate().toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant={consultation.urgency === 'high' ? 'destructive' : 'secondary'}>
                {consultation.urgency} urgency
              </Badge>
              <Badge className="bg-green-100 text-green-800">
                {consultation.status}
              </Badge>
            </div>
          </div>

          <p className="text-gray-700 mb-4">{consultation.description}</p>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <h5 className="font-medium mb-2">Client Demographics</h5>
              <div className="text-sm space-y-1">
                <p><strong>Age:</strong> {consultation.clientDemographics.ageRange}</p>
                <p><strong>Concerns:</strong> {consultation.clientDemographics.presentingConcerns.join(', ')}</p>
                <p><strong>History:</strong> {consultation.clientDemographics.treatmentHistory}</p>
              </div>
            </div>

            <div>
              <h5 className="font-medium mb-2">ALCHM Integration</h5>
              <div className="text-sm space-y-1">
                <p><strong>Pathways:</strong> {consultation.alchemIntegration.pathwaysUsed.join(', ')}</p>
                <p><strong>Engagement:</strong> {consultation.alchemIntegration.engagementLevel}</p>
                <p><strong>Challenges:</strong> {consultation.alchemIntegration.challenges.join(', ')}</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h5 className="font-medium mb-2">Questions for Community</h5>
            <ul className="text-sm space-y-1">
              {consultation.questionsForCommunity.map((question, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  {question}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{consultation.responses} responses</span>
            <Button variant="outline" size="sm">
              Provide Consultation
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderResearchOpportunities = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Research Collaborations</h3>

      {researchOpportunities.map(study => (
        <Card key={study.id} className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-semibold text-lg">{study.title}</h4>
              <p className="text-sm text-gray-600">
                Posted {study.createdAt.toDate().toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-purple-100 text-purple-800">
                {study.researchType.replace('-', ' ')}
              </Badge>
              <Badge variant={study.status === 'recruiting' ? 'default' : 'secondary'}>
                {study.status}
              </Badge>
            </div>
          </div>

          <p className="text-gray-700 mb-4">{study.description}</p>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <h5 className="font-medium mb-2">Study Details</h5>
              <div className="text-sm space-y-1">
                <p><strong>Timeline:</strong> {study.timeline}</p>
                <p><strong>Commitment:</strong> {study.expectedCommitment}</p>
                <p><strong>Participants:</strong> {study.currentParticipants}/{study.participantsNeeded}</p>
                <p><strong>Ethics Approved:</strong> {study.ethicsApproval ? 'Yes' : 'Pending'}</p>
              </div>
            </div>

            <div>
              <h5 className="font-medium mb-2">Benefits</h5>
              <div className="text-sm space-y-1">
                {study.compensationOffered && <p className="text-green-600">✓ Compensation provided</p>}
                {study.ceuCredits && <p className="text-blue-600">✓ {study.ceuCredits} CEU credits</p>}
                <p className="text-purple-600">✓ Research collaboration credit</p>
                <p className="text-orange-600">✓ Publication authorship opportunity</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h5 className="font-medium mb-2">Requirements</h5>
            <ul className="text-sm space-y-1">
              {study.participationRequirements.map((req, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Research collaboration opportunity
            </div>
            <Button 
              onClick={() => joinResearchStudy(study.id)}
              disabled={study.status !== 'recruiting'}
            >
              {study.status === 'recruiting' ? 'Join Study' : 'Not Recruiting'}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderCEUOpportunities = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Continuing Education</h3>

      {ceuOpportunities.map(opportunity => (
        <Card key={opportunity.id} className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-semibold text-lg">{opportunity.title}</h4>
              <p className="text-sm text-gray-600">
                by {opportunity.provider} • {opportunity.credits} CEU credits
              </p>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-green-100 text-green-800">
                {opportunity.type}
              </Badge>
              {opportunity.alchemRelated && (
                <Badge className="bg-blue-100 text-blue-800">
                  ALCHM Related
                </Badge>
              )}
            </div>
          </div>

          <p className="text-gray-700 mb-4">{opportunity.description}</p>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <h5 className="font-medium mb-2">Details</h5>
              <div className="text-sm space-y-1">
                <p><strong>Start Date:</strong> {opportunity.startDate.toDate().toLocaleDateString()}</p>
                <p><strong>Duration:</strong> {opportunity.duration}</p>
                <p><strong>Cost:</strong> {opportunity.cost === 0 ? 'Free' : `$${opportunity.cost}`}</p>
              </div>
            </div>

            <div>
              <h5 className="font-medium mb-2">Topics Covered</h5>
              <div className="flex flex-wrap gap-1">
                {opportunity.topics.map(topic => (
                  <Badge key={topic} variant="outline" className="text-xs">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {opportunity.credits} CEU credits • {opportunity.cost === 0 ? 'Free' : `$${opportunity.cost}`}
            </div>
            <Button onClick={() => registerForCEU(opportunity)}>
              Register
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderProfessionalNetwork = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Professional Network</h3>

      {professionalConnections.map(professional => (
        <Card key={professional.id} className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-semibold text-lg">{professional.name}</h4>
              <p className="text-sm text-gray-600">
                {professional.credentials} • {professional.location}
              </p>
            </div>
            <div className="flex gap-2">
              {professional.referralAccepting && (
                <Badge className="bg-green-100 text-green-800">
                  Accepting Referrals
                </Badge>
              )}
              <Badge variant="outline">
                {professional.mutualConnections} mutual connections
              </Badge>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <h5 className="font-medium mb-2">Practice Information</h5>
              <div className="text-sm space-y-1">
                <p><strong>Type:</strong> {professional.practiceType}</p>
                <p><strong>Specializations:</strong> {professional.specializations.join(', ')}</p>
                <p><strong>Contact:</strong> {professional.contactPreference.replace('-', ' ')}</p>
              </div>
            </div>

            <div>
              <h5 className="font-medium mb-2">ALCHM Experience</h5>
              <p className="text-sm">{professional.alchemExperience}</p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => connectWithProfessional(professional.id)}
            >
              Connect
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading professional community...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Professional Community Network</h2>
            <p className="text-gray-600 mt-2">
              Connect, collaborate, and grow with verified mental health professionals
            </p>
          </div>
          <Badge className="bg-blue-100 text-blue-800">
            Verified Professional
          </Badge>
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'discussions', label: 'Discussions', count: discussions.length },
          { key: 'consultations', label: 'Consultations', count: consultations.length },
          { key: 'research', label: 'Research', count: researchOpportunities.length },
          { key: 'ceu', label: 'CEU', count: ceuOpportunities.length },
          { key: 'network', label: 'Network', count: professionalConnections.length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
              activeTab === tab.key
                ? 'bg-white shadow-sm font-medium'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
            <Badge variant="secondary" className="text-xs">
              {tab.count}
            </Badge>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'discussions' && renderDiscussions()}
      {activeTab === 'consultations' && renderCaseConsultations()}
      {activeTab === 'research' && renderResearchOpportunities()}
      {activeTab === 'ceu' && renderCEUOpportunities()}
      {activeTab === 'network' && renderProfessionalNetwork()}
    </div>
  );
}