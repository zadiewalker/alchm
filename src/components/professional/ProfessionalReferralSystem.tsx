'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users,
  UserPlus,
  TrendingUp,
  Heart,
  Shield,
  Award,
  Brain,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
  Star,
  Send,
  Share2,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Filter,
  Search,
  Download,
  Upload,
  Eye,
  EyeOff,
  MessageCircle,
  Bell,
  Globe,
  Building2,
  GraduationCap,
  Briefcase,
  Lightbulb,
  Zap,
  ChevronDown,
  ChevronRight,
  Plus,
  Settings,
  Info,
  CheckShield,
  FileText,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

interface ProfessionalContact {
  id: string;
  name: string;
  title: string;
  credentials: string[];
  specializations: string[];
  organization: string;
  location: string;
  phone: string;
  email: string;
  website?: string;
  languages: string[];
  acceptingReferrals: boolean;
  insurance: string[];
  sliding_scale: boolean;
  emergency_availability: boolean;
  cultural_competencies: string[];
  therapeutic_approaches: string[];
  relationship: 'colleague' | 'peer' | 'supervisor' | 'referral-partner' | 'collaborator';
  trust_level: number;
  response_time: string;
  success_rate: number;
  last_interaction: string;
  notes: string;
  verified: boolean;
}

interface Referral {
  id: string;
  client_initials: string;
  referring_to: string;
  referral_type: 'specialty-care' | 'higher-level' | 'intensive-outpatient' | 'inpatient' | 'group-therapy' | 'medication-management' | 'crisis-intervention';
  urgency: 'routine' | 'urgent' | 'emergent';
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'no-response';
  reason: string;
  clinical_summary: string;
  current_medications: string[];
  risk_factors: string[];
  strengths: string[];
  cultural_considerations: string[];
  preferred_approaches: string[];
  insurance_info: string;
  transportation_needs: boolean;
  language_preference: string;
  availability_constraints: string[];
  sent_date: string;
  response_date?: string;
  appointment_scheduled?: string;
  outcome: string;
  follow_up_date?: string;
  satisfaction_rating?: number;
}

interface AdvocacyAction {
  id: string;
  type: 'policy-comment' | 'legislative-contact' | 'community-outreach' | 'professional-education' | 'research-dissemination';
  title: string;
  description: string;
  target_audience: string;
  impact_area: 'mental-health-parity' | 'digital-therapeutics' | 'trauma-informed-care' | 'cultural-competency' | 'access-equity';
  status: 'draft' | 'pending' | 'submitted' | 'responded' | 'enacted';
  deadline?: string;
  action_taken: string;
  date_completed?: string;
  collaborators: string[];
  outcome?: string;
  impact_metrics?: {
    reach: number;
    engagement: number;
    policy_changes: number;
  };
}

interface NetworkMetrics {
  total_contacts: number;
  verified_professionals: number;
  successful_referrals: number;
  average_response_time: string;
  referral_success_rate: number;
  advocacy_actions: number;
  policy_impacts: number;
  community_reach: number;
}

export default function ProfessionalReferralSystem() {
  const [activeTab, setActiveTab] = useState<'network' | 'referrals' | 'advocacy' | 'analytics'>('network');
  const [contacts, setContacts] = useState<ProfessionalContact[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [advocacyActions, setAdvocacyActions] = useState<AdvocacyAction[]>([]);
  const [networkMetrics, setNetworkMetrics] = useState<NetworkMetrics>({} as NetworkMetrics);
  const [filterBy, setFilterBy] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  useEffect(() => {
    // Initialize sample data
    setContacts([
      {
        id: 'contact-1',
        name: 'Dr. Elena Rodriguez',
        title: 'Clinical Psychologist',
        credentials: ['PhD', 'Licensed Psychologist'],
        specializations: ['Trauma Therapy', 'EMDR', 'Cultural Psychology'],
        organization: 'Healing Springs Psychology Center',
        location: 'San Francisco, CA',
        phone: '(415) 555-0123',
        email: 'e.rodriguez@healingsprings.com',
        website: 'healingsprings.com',
        languages: ['English', 'Spanish', 'Portuguese'],
        acceptingReferrals: true,
        insurance: ['Aetna', 'Blue Cross', 'Kaiser', 'Sliding Scale'],
        sliding_scale: true,
        emergency_availability: false,
        cultural_competencies: ['Latinx Communities', 'LGBTQ+', 'Immigration Trauma'],
        therapeutic_approaches: ['EMDR', 'Somatic Experiencing', 'Narrative Therapy'],
        relationship: 'referral-partner',
        trust_level: 9,
        response_time: '< 24 hours',
        success_rate: 92,
        last_interaction: '2024-03-12',
        notes: 'Excellent with complex trauma. Very responsive to referrals.',
        verified: true
      },
      {
        id: 'contact-2',
        name: 'Dr. Michael Chen',
        title: 'Psychiatrist',
        credentials: ['MD', 'Board Certified Psychiatrist'],
        specializations: ['Mood Disorders', 'Anxiety', 'Medication Management'],
        organization: 'Bay Area Psychiatric Associates',
        location: 'Oakland, CA',
        phone: '(510) 555-0234',
        email: 'm.chen@baypsych.com',
        languages: ['English', 'Mandarin', 'Cantonese'],
        acceptingReferrals: true,
        insurance: ['Most Major Insurance', 'Medicare', 'Medicaid'],
        sliding_scale: false,
        emergency_availability: true,
        cultural_competencies: ['Asian American Communities', 'Tech Industry Professionals'],
        therapeutic_approaches: ['Psychopharmacology', 'Integrative Psychiatry'],
        relationship: 'colleague',
        trust_level: 8,
        response_time: '2-3 days',
        success_rate: 89,
        last_interaction: '2024-03-08',
        notes: 'Great for medication consultations. Collaborative approach.',
        verified: true
      },
      {
        id: 'contact-3',
        name: 'Sarah Kim, LCSW',
        title: 'Clinical Social Worker',
        credentials: ['MSW', 'LCSW', 'EMDR Certified'],
        specializations: ['Adolescent Therapy', 'Family Systems', 'School-Based Mental Health'],
        organization: 'Sunrise Family Counseling',
        location: 'Berkeley, CA',
        phone: '(510) 555-0345',
        email: 's.kim@sunrisefamily.org',
        languages: ['English', 'Korean'],
        acceptingReferrals: true,
        insurance: ['Blue Cross', 'Anthem', 'Sliding Scale'],
        sliding_scale: true,
        emergency_availability: false,
        cultural_competencies: ['Korean American Families', 'First Generation Immigrants'],
        therapeutic_approaches: ['Family Systems Therapy', 'EMDR', 'Play Therapy'],
        relationship: 'peer',
        trust_level: 9,
        response_time: '< 48 hours',
        success_rate: 95,
        last_interaction: '2024-03-15',
        notes: 'Outstanding with teens and families. Culturally sensitive.',
        verified: true
      }
    ]);

    setReferrals([
      {
        id: 'ref-1',
        client_initials: 'A.M.',
        referring_to: 'Dr. Elena Rodriguez',
        referral_type: 'specialty-care',
        urgency: 'routine',
        status: 'completed',
        reason: 'EMDR for complex trauma processing',
        clinical_summary: 'Client presents with PTSD symptoms following MVA. Ready for trauma-focused therapy.',
        current_medications: ['Sertraline 100mg', 'Trazodone 50mg PRN'],
        risk_factors: ['History of depression', 'Mild dissociation'],
        strengths: ['Strong support system', 'High motivation', 'Previous therapy experience'],
        cultural_considerations: ['Bilingual Spanish/English', 'Catholic background'],
        preferred_approaches: ['EMDR', 'Somatic work'],
        insurance_info: 'Blue Cross PPO',
        transportation_needs: false,
        language_preference: 'English',
        availability_constraints: ['Evenings preferred', 'Not Fridays'],
        sent_date: '2024-02-15',
        response_date: '2024-02-16',
        appointment_scheduled: '2024-02-28',
        outcome: 'Client successfully engaged in EMDR treatment',
        follow_up_date: '2024-03-15',
        satisfaction_rating: 5
      },
      {
        id: 'ref-2',
        client_initials: 'J.R.',
        referring_to: 'Dr. Michael Chen',
        referral_type: 'medication-management',
        urgency: 'urgent',
        status: 'accepted',
        reason: 'Medication evaluation for treatment-resistant depression',
        clinical_summary: 'Client with MDD, partial response to multiple SSRIs. Considering augmentation.',
        current_medications: ['Escitalopram 20mg', 'Wellbutrin 300mg'],
        risk_factors: ['Previous suicidal ideation', 'Medication sensitivity'],
        strengths: ['Excellent adherence', 'Strong therapeutic alliance'],
        cultural_considerations: ['None noted'],
        preferred_approaches: ['Collaborative medication management'],
        insurance_info: 'Kaiser HMO',
        transportation_needs: true,
        language_preference: 'English',
        availability_constraints: ['Mornings only'],
        sent_date: '2024-03-10',
        response_date: '2024-03-11',
        appointment_scheduled: '2024-03-18',
        outcome: 'Pending appointment'
      }
    ]);

    setAdvocacyActions([
      {
        id: 'adv-1',
        type: 'policy-comment',
        title: 'Public Comment on Digital Therapeutics Regulation',
        description: 'Submitted formal comment to FDA regarding DTx approval pathways',
        target_audience: 'FDA Digital Health Advisory Committee',
        impact_area: 'digital-therapeutics',
        status: 'submitted',
        deadline: '2024-03-01',
        action_taken: 'Comprehensive 15-page comment on evidence standards and accessibility requirements',
        date_completed: '2024-02-28',
        collaborators: ['ALCHM Professional Network', 'Digital Therapeutics Alliance'],
        outcome: 'Comment included in official docket, cited in final guidance',
        impact_metrics: {
          reach: 1500,
          engagement: 89,
          policy_changes: 2
        }
      },
      {
        id: 'adv-2',
        type: 'legislative-contact',
        title: 'Mental Health Parity Enforcement Letter',
        description: 'Contacted state representatives about insurance parity enforcement',
        target_audience: 'California State Legislature',
        impact_area: 'mental-health-parity',
        status: 'responded',
        action_taken: 'Co-signed letter with 156 mental health professionals',
        date_completed: '2024-02-15',
        collaborators: ['California Association of MFTs', 'NASW California'],
        outcome: 'Meeting scheduled with Assembly Health Committee',
        impact_metrics: {
          reach: 890,
          engagement: 156,
          policy_changes: 1
        }
      }
    ]);

    setNetworkMetrics({
      total_contacts: 47,
      verified_professionals: 43,
      successful_referrals: 89,
      average_response_time: '18 hours',
      referral_success_rate: 92,
      advocacy_actions: 12,
      policy_impacts: 5,
      community_reach: 2847
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'accepted':
      case 'verified':
      case 'enacted': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'pending':
      case 'submitted': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'declined':
      case 'no-response': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrustLevelColor = (level: number) => {
    if (level >= 8) return 'text-emerald-600 bg-emerald-50';
    if (level >= 6) return 'text-blue-600 bg-blue-50';
    if (level >= 4) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const renderNetwork = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Professional Network</h1>
          <p className="text-gray-600">Build and manage your referral network</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            />
          </div>
          <Button variant="secondary" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Network Summary */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6 text-center border-sage-200">
          <div className="p-3 bg-sage-100 rounded-xl w-fit mx-auto mb-3">
            <Users className="h-6 w-6 text-sage-600" />
          </div>
          <div className="text-2xl font-medium text-sage-700 mb-1">{networkMetrics.total_contacts}</div>
          <div className="text-sm text-sage-600">Total Contacts</div>
          <div className="text-xs text-sage-500 mt-1">{networkMetrics.verified_professionals} verified</div>
        </Card>

        <Card className="p-6 text-center border-emerald-200">
          <div className="p-3 bg-emerald-100 rounded-xl w-fit mx-auto mb-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="text-2xl font-medium text-emerald-700 mb-1">{networkMetrics.referral_success_rate}%</div>
          <div className="text-sm text-emerald-600">Success Rate</div>
          <div className="text-xs text-emerald-500 mt-1">{networkMetrics.successful_referrals} successful</div>
        </Card>

        <Card className="p-6 text-center border-blue-200">
          <div className="p-3 bg-blue-100 rounded-xl w-fit mx-auto mb-3">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-2xl font-medium text-blue-700 mb-1">{networkMetrics.average_response_time}</div>
          <div className="text-sm text-blue-600">Avg Response</div>
          <div className="text-xs text-blue-500 mt-1">Typical turnaround</div>
        </Card>

        <Card className="p-6 text-center border-purple-200">
          <div className="p-3 bg-purple-100 rounded-xl w-fit mx-auto mb-3">
            <Heart className="h-6 w-6 text-purple-600" />
          </div>
          <div className="text-2xl font-medium text-purple-700 mb-1">{networkMetrics.advocacy_actions}</div>
          <div className="text-sm text-purple-600">Advocacy Actions</div>
          <div className="text-xs text-purple-500 mt-1">{networkMetrics.policy_impacts} policy impacts</div>
        </Card>
      </div>

      {/* Professional Contacts */}
      <div className="grid gap-6">
        {contacts.map((contact) => (
          <Card key={contact.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-700">
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{contact.name}</h3>
                    <span className="text-sm text-gray-600">{contact.title}</span>
                    {contact.verified && (
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckShield className="h-3 w-3 mr-1" />
                        Verified
                      </div>
                    )}
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTrustLevelColor(contact.trust_level)}`}>
                      Trust: {contact.trust_level}/10
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    {contact.credentials.join(', ')} • {contact.organization}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {contact.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {contact.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {contact.phone}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                      contact.acceptingReferrals 
                        ? 'text-emerald-600 bg-emerald-50 border-emerald-200' 
                        : 'text-amber-600 bg-amber-50 border-amber-200'
                    }`}>
                      {contact.acceptingReferrals ? 'Accepting Referrals' : 'Not Accepting'}
                    </div>
                    
                    {contact.sliding_scale && (
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        Sliding Scale
                      </div>
                    )}
                    
                    {contact.emergency_availability && (
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        Emergency Available
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Specializations:</span> {contact.specializations.join(', ')}
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Cultural Competencies:</span> {contact.cultural_competencies.join(', ')}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Languages:</span> {contact.languages.join(', ')}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  <Send className="h-4 w-4 mr-2" />
                  Refer Client
                </Button>
                <Button variant="secondary" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button variant="secondary" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </div>
            </div>

            {/* Professional Stats */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-medium text-emerald-600">{contact.success_rate}%</div>
                <div className="text-xs text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium text-blue-600">{contact.response_time}</div>
                <div className="text-xs text-gray-600">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium text-purple-600">{contact.last_interaction}</div>
                <div className="text-xs text-gray-600">Last Contact</div>
              </div>
            </div>

            {contact.notes && (
              <div className="mt-3 p-3 bg-sage-50 rounded-lg border border-sage-200">
                <div className="text-sm text-sage-800">
                  <span className="font-medium">Notes:</span> {contact.notes}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );

  const renderReferrals = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Referral Management</h1>
          <p className="text-gray-600">Track and manage client referrals</p>
        </div>
        <Button>
          <Send className="h-4 w-4 mr-2" />
          New Referral
        </Button>
      </div>

      {/* Referral Summary */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6 text-center border-blue-200">
          <div className="text-2xl font-medium text-blue-700 mb-1">12</div>
          <div className="text-sm text-blue-600">Pending Referrals</div>
        </Card>
        <Card className="p-6 text-center border-emerald-200">
          <div className="text-2xl font-medium text-emerald-700 mb-1">89</div>
          <div className="text-sm text-emerald-600">Completed</div>
        </Card>
        <Card className="p-6 text-center border-purple-200">
          <div className="text-2xl font-medium text-purple-700 mb-1">4.8</div>
          <div className="text-sm text-purple-600">Avg Rating</div>
        </Card>
        <Card className="p-6 text-center border-amber-200">
          <div className="text-2xl font-medium text-amber-700 mb-1">18h</div>
          <div className="text-sm text-amber-600">Avg Response</div>
        </Card>
      </div>

      {/* Referral List */}
      <div className="grid gap-6">
        {referrals.map((referral) => (
          <Card key={referral.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    Referral for {referral.client_initials}
                  </h3>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(referral.status)}`}>
                    {referral.status}
                  </div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(referral.urgency)}`}>
                    {referral.urgency}
                  </div>
                  <span className="text-sm text-gray-500 capitalize">
                    {referral.referral_type.replace('-', ' ')}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 mb-3">
                  <span className="font-medium">Referring to:</span> {referral.referring_to}
                </div>
                
                <div className="text-sm text-gray-600 mb-3">
                  <span className="font-medium">Reason:</span> {referral.reason}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span>Sent: {referral.sent_date}</span>
                  {referral.response_date && <span>Responded: {referral.response_date}</span>}
                  {referral.appointment_scheduled && <span>Scheduled: {referral.appointment_scheduled}</span>}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button variant="secondary" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Follow Up
                </Button>
              </div>
            </div>

            {/* Clinical Summary */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
              <h4 className="font-medium text-blue-900 mb-2">Clinical Summary</h4>
              <p className="text-sm text-blue-800">{referral.clinical_summary}</p>
            </div>

            {/* Key Information */}
            <div className="grid md:grid-cols-3 gap-6 mb-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Strengths</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {referral.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Star className="h-3 w-3 text-emerald-500 mt-1 flex-shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Risk Factors</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {referral.risk_factors.map((risk, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="h-3 w-3 text-amber-500 mt-1 flex-shrink-0" />
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Cultural Considerations</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {referral.cultural_considerations.map((consideration, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Globe className="h-3 w-3 text-purple-500 mt-1 flex-shrink-0" />
                      <span>{consideration}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Outcome & Rating */}
            {referral.outcome && (
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-emerald-900 mb-1">Outcome</h4>
                    <p className="text-sm text-emerald-800">{referral.outcome}</p>
                  </div>
                  {referral.satisfaction_rating && (
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < referral.satisfaction_rating! 
                              ? 'text-yellow-500 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-emerald-700 ml-2">
                        {referral.satisfaction_rating}/5
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAdvocacy = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Professional Advocacy</h1>
          <p className="text-gray-600">Advance mental health policy and practice</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Action
        </Button>
      </div>

      {/* Advocacy Impact */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6 text-center border-purple-200">
          <div className="p-3 bg-purple-100 rounded-xl w-fit mx-auto mb-3">
            <Zap className="h-6 w-6 text-purple-600" />
          </div>
          <div className="text-2xl font-medium text-purple-700 mb-1">{networkMetrics.advocacy_actions}</div>
          <div className="text-sm text-purple-600">Actions Taken</div>
          <div className="text-xs text-purple-500 mt-1">This year</div>
        </Card>

        <Card className="p-6 text-center border-emerald-200">
          <div className="p-3 bg-emerald-100 rounded-xl w-fit mx-auto mb-3">
            <Target className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="text-2xl font-medium text-emerald-700 mb-1">{networkMetrics.policy_impacts}</div>
          <div className="text-sm text-emerald-600">Policy Impacts</div>
          <div className="text-xs text-emerald-500 mt-1">Successful changes</div>
        </Card>

        <Card className="p-6 text-center border-blue-200">
          <div className="p-3 bg-blue-100 rounded-xl w-fit mx-auto mb-3">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-2xl font-medium text-blue-700 mb-1">{networkMetrics.community_reach}</div>
          <div className="text-sm text-blue-600">Community Reach</div>
          <div className="text-xs text-blue-500 mt-1">People influenced</div>
        </Card>

        <Card className="p-6 text-center border-amber-200">
          <div className="p-3 bg-amber-100 rounded-xl w-fit mx-auto mb-3">
            <Award className="h-6 w-6 text-amber-600" />
          </div>
          <div className="text-2xl font-medium text-amber-700 mb-1">3</div>
          <div className="text-sm text-amber-600">Active Campaigns</div>
          <div className="text-xs text-amber-500 mt-1">Currently supporting</div>
        </Card>
      </div>

      {/* Advocacy Actions */}
      <div className="grid gap-6">
        {advocacyActions.map((action) => (
          <Card key={action.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Lightbulb className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{action.title}</h3>
                    <div className="flex items-center gap-3">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(action.status)}`}>
                        {action.status}
                      </div>
                      <span className="text-sm text-gray-600 capitalize">
                        {action.type.replace('-', ' ')}
                      </span>
                      <span className="text-sm text-purple-600 capitalize">
                        {action.impact_area.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-3">
                  <span className="font-medium">Target:</span> {action.target_audience}
                </div>
                
                <div className="text-sm text-gray-700 mb-3">{action.description}</div>

                {action.deadline && (
                  <div className="text-sm text-red-600 mb-3">
                    <span className="font-medium">Deadline:</span> {action.deadline}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button variant="secondary" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Action Details */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4">
              <h4 className="font-medium text-blue-900 mb-2">Action Taken</h4>
              <p className="text-sm text-blue-800">{action.action_taken}</p>
            </div>

            {/* Collaborators */}
            {action.collaborators.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Collaborators</h4>
                <div className="flex flex-wrap gap-2">
                  {action.collaborators.map((collaborator, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-sage-100 text-sage-800">
                      {collaborator}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Impact Metrics */}
            {action.impact_metrics && (
              <div className="grid grid-cols-3 gap-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="text-center">
                  <div className="text-lg font-medium text-emerald-700">{action.impact_metrics.reach}</div>
                  <div className="text-xs text-emerald-600">Reach</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-medium text-emerald-700">{action.impact_metrics.engagement}</div>
                  <div className="text-xs text-emerald-600">Engagement</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-medium text-emerald-700">{action.impact_metrics.policy_changes}</div>
                  <div className="text-xs text-emerald-600">Policy Changes</div>
                </div>
              </div>
            )}

            {/* Outcome */}
            {action.outcome && (
              <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <h4 className="font-medium text-emerald-900 mb-1">Outcome</h4>
                <p className="text-sm text-emerald-800">{action.outcome}</p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-xl">
            <Heart className="h-8 w-8 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-purple-900 mb-2">
              Make Your Voice Heard
            </h3>
            <p className="text-sm text-purple-800 mb-3">
              Join ongoing advocacy efforts to improve mental health care access, policy, and practice. 
              Your professional voice makes a difference.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Active Campaigns
              </Button>
              <Button variant="secondary" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Set Up Alerts
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Network Analytics</h1>
          <p className="text-gray-600">Insights into your professional network and referral patterns</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Referral Success Trends</h3>
          </div>
          <div className="text-center py-8">
            <div className="text-3xl font-medium text-blue-700 mb-2">↗ 92%</div>
            <div className="text-sm text-blue-600 mb-4">Success Rate (Last 6 Months)</div>
            <div className="text-xs text-gray-500">
              +8% improvement from previous period
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Network Growth</h3>
          </div>
          <div className="text-center py-8">
            <div className="text-3xl font-medium text-emerald-700 mb-2">+15</div>
            <div className="text-sm text-emerald-600 mb-4">New Contacts This Quarter</div>
            <div className="text-xs text-gray-500">
              47 total professional contacts
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <PieChart className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Referral Patterns</h3>
            <p className="text-sm text-gray-600">Analysis of your referral distribution</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">By Specialty</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Trauma Therapy</span>
                <span className="text-sm font-medium text-blue-600">34%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Medication Management</span>
                <span className="text-sm font-medium text-blue-600">28%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Family Therapy</span>
                <span className="text-sm font-medium text-blue-600">22%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Group Therapy</span>
                <span className="text-sm font-medium text-blue-600">16%</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">By Urgency</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Routine</span>
                <span className="text-sm font-medium text-emerald-600">67%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Urgent</span>
                <span className="text-sm font-medium text-amber-600">28%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Emergent</span>
                <span className="text-sm font-medium text-red-600">5%</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Response Times</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">&lt; 24 hours</span>
                <span className="text-sm font-medium text-emerald-600">78%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">1-3 days</span>
                <span className="text-sm font-medium text-blue-600">18%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">&gt; 3 days</span>
                <span className="text-sm font-medium text-amber-600">4%</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Advocacy Impact */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-sage-100 rounded-lg">
            <Target className="h-6 w-6 text-sage-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Advocacy Impact Summary</h3>
            <p className="text-sm text-gray-600">Your contributions to professional advocacy</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-purple-900">Policy Comments</span>
              </div>
              <div className="text-2xl font-medium text-purple-700 mb-1">4</div>
              <div className="text-sm text-purple-600">Submitted this year</div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Legislative Contacts</span>
              </div>
              <div className="text-2xl font-medium text-blue-700 mb-1">7</div>
              <div className="text-sm text-blue-600">Representatives contacted</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-5 w-5 text-emerald-600" />
                <span className="font-medium text-emerald-900">Community Outreach</span>
              </div>
              <div className="text-2xl font-medium text-emerald-700 mb-1">2,847</div>
              <div className="text-sm text-emerald-600">People reached</div>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-3 mb-2">
                <Award className="h-5 w-5 text-amber-600" />
                <span className="font-medium text-amber-900">Policy Changes</span>
              </div>
              <div className="text-2xl font-medium text-amber-700 mb-1">5</div>
              <div className="text-sm text-amber-600">Influenced outcomes</div>
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
          <div className="w-16 h-16 bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl flex items-center justify-center">
            <Users className="h-8 w-8 text-sage-600" />
          </div>
          <div>
            <h1 className="text-3xl font-medium text-gray-900 mb-1">Professional Network</h1>
            <p className="text-gray-600">Build connections, make referrals, and advocate for change</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">Network Score: 92/100</div>
            <div className="text-xs text-gray-500">Excellent connectivity</div>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
            <Award className="h-5 w-5 text-emerald-700" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 p-1 bg-gray-50 rounded-xl">
        <Button
          variant={activeTab === 'network' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('network')}
          className="px-6"
        >
          <Users className="h-4 w-4 mr-2" />
          Network
        </Button>
        <Button
          variant={activeTab === 'referrals' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('referrals')}
          className="px-6"
        >
          <Send className="h-4 w-4 mr-2" />
          Referrals
        </Button>
        <Button
          variant={activeTab === 'advocacy' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('advocacy')}
          className="px-6"
        >
          <Heart className="h-4 w-4 mr-2" />
          Advocacy
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
      {activeTab === 'network' && renderNetwork()}
      {activeTab === 'referrals' && renderReferrals()}
      {activeTab === 'advocacy' && renderAdvocacy()}
      {activeTab === 'analytics' && renderAnalytics()}
    </div>
  );
}