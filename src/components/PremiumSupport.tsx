'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield,
  Phone,
  Video,
  MessageCircle,
  Calendar,
  Clock,
  Zap,
  Star,
  Heart,
  Brain,
  Users,
  Building,
  Globe,
  Link,
  Download,
  Upload,
  Settings,
  CheckCircle,
  AlertTriangle,
  Info,
  ArrowRight,
  Plus,
  Search,
  Filter,
  Eye,
  Lock,
  Unlock,
  Crown,
  Award,
  Target,
  Activity,
  TrendingUp,
  FileText,
  Database,
  Cloud,
  Server,
  Smartphone,
  Laptop,
  Headphones,
  Mic,
  Camera,
  Bell,
  BellOff,
  Mail,
  Share,
  RefreshCcw,
  ChevronRight,
  ExternalLink,
  Bookmark,
  Archive,
  Trash2,
  Edit,
  Copy,
  Send
} from 'lucide-react';

interface CrisisSupport {
  level: 'immediate' | 'urgent' | 'priority' | 'standard';
  availableChannels: ('text' | 'voice' | 'video' | 'emergency')[];
  responseTime: string;
  escalationPath: string[];
  professionalBackup: boolean;
  isActive: boolean;
}

interface ExternalIntegration {
  id: string;
  name: string;
  type: 'ehr' | 'therapy-platform' | 'wellness-app' | 'healthcare-provider' | 'educational';
  description: string;
  dataSharing: {
    canExport: boolean;
    canImport: boolean;
    dataTypes: string[];
    securityLevel: 'standard' | 'hipaa' | 'enterprise';
  };
  status: 'connected' | 'available' | 'pending' | 'blocked';
  lastSync?: string;
  apiEndpoint?: string;
  authRequired: boolean;
  cost?: string;
}

interface ProfessionalConsultation {
  id: string;
  type: 'therapy-session' | 'psychiatric-evaluation' | 'crisis-intervention' | 'wellness-coaching' | 'spiritual-direction';
  provider: {
    name: string;
    credentials: string[];
    specialties: string[];
    rating: number;
    verified: boolean;
  };
  availability: {
    nextAvailable: string;
    timezone: string;
    formats: ('in-person' | 'video' | 'phone')[];
  };
  cost: {
    session: string;
    insurance: boolean;
    slidingScale: boolean;
  };
  integrationLevel: 'basic' | 'advanced' | 'full';
  status: 'available' | 'booked' | 'waitlist';
}

interface DataPortability {
  format: 'pdf' | 'json' | 'csv' | 'hl7-fhir' | 'custom';
  scope: 'personal' | 'therapeutic' | 'research' | 'legal';
  includes: string[];
  excludes: string[];
  purpose: string;
  recipient?: string;
  expiryDate?: string;
  downloadCount: number;
  lastGenerated?: string;
}

export default function PremiumSupport() {
  const [activeTab, setActiveTab] = useState<'crisis' | 'integrations' | 'consultations' | 'portability'>('crisis');
  const [crisisSupport, setCrisisSupport] = useState<CrisisSupport>({
    level: 'priority',
    availableChannels: ['text', 'voice', 'video', 'emergency'],
    responseTime: '< 5 minutes',
    escalationPath: ['AI Crisis Detection', 'Human Crisis Counselor', 'Emergency Services', 'Healthcare Provider'],
    professionalBackup: true,
    isActive: true
  });

  const [externalIntegrations, setExternalIntegrations] = useState<ExternalIntegration[]>([]);
  const [consultations, setConsultations] = useState<ProfessionalConsultation[]>([]);
  const [dataExports, setDataExports] = useState<DataPortability[]>([]);

  useEffect(() => {
    setExternalIntegrations([
      {
        id: '1',
        name: 'Epic MyChart',
        type: 'ehr',
        description: 'Integrate with Epic Electronic Health Records for seamless healthcare coordination',
        dataSharing: {
          canExport: true,
          canImport: true,
          dataTypes: ['progress-notes', 'assessments', 'goals', 'medications'],
          securityLevel: 'hipaa'
        },
        status: 'connected',
        lastSync: '2024-03-15T10:30:00Z',
        authRequired: true,
        cost: 'Free with provider'
      },
      {
        id: '2',
        name: 'BetterHelp',
        type: 'therapy-platform',
        description: 'Share progress with your BetterHelp therapist and sync session notes',
        dataSharing: {
          canExport: true,
          canImport: false,
          dataTypes: ['session-summaries', 'mood-tracking', 'goals'],
          securityLevel: 'hipaa'
        },
        status: 'available',
        authRequired: true,
        cost: 'Included with BetterHelp subscription'
      },
      {
        id: '3',
        name: 'Headspace Health',
        type: 'wellness-app',
        description: 'Sync mindfulness practice data and meditation progress',
        dataSharing: {
          canExport: false,
          canImport: true,
          dataTypes: ['meditation-minutes', 'stress-levels', 'sleep-quality'],
          securityLevel: 'standard'
        },
        status: 'connected',
        lastSync: '2024-03-14T22:15:00Z',
        authRequired: true,
        cost: 'Free'
      },
      {
        id: '4',
        name: 'Stanford Healthcare',
        type: 'healthcare-provider',
        description: 'Direct integration with Stanford healthcare system for coordinated care',
        dataSharing: {
          canExport: true,
          canImport: true,
          dataTypes: ['comprehensive-reports', 'crisis-alerts', 'progress-metrics'],
          securityLevel: 'enterprise'
        },
        status: 'pending',
        authRequired: true,
        cost: '$25/month'
      },
      {
        id: '5',
        name: 'University Research Portal',
        type: 'educational',
        description: 'Contribute anonymized data to mental health research studies',
        dataSharing: {
          canExport: true,
          canImport: false,
          dataTypes: ['anonymized-patterns', 'outcome-metrics', 'intervention-effectiveness'],
          securityLevel: 'standard'
        },
        status: 'available',
        authRequired: false,
        cost: 'Paid participation available'
      }
    ]);

    setConsultations([
      {
        id: '1',
        type: 'therapy-session',
        provider: {
          name: 'Dr. Sarah Chen, LCSW',
          credentials: ['LCSW', 'PhD Psychology', 'Trauma Specialist'],
          specialties: ['PTSD', 'Anxiety', 'Depression', 'EMDR'],
          rating: 4.9,
          verified: true
        },
        availability: {
          nextAvailable: '2024-03-18T14:00:00Z',
          timezone: 'PST',
          formats: ['video', 'phone']
        },
        cost: {
          session: '$150/hour',
          insurance: true,
          slidingScale: true
        },
        integrationLevel: 'full',
        status: 'available'
      },
      {
        id: '2',
        type: 'psychiatric-evaluation',
        provider: {
          name: 'Dr. Michael Rodriguez, MD',
          credentials: ['MD', 'Board Certified Psychiatrist', 'Addiction Medicine'],
          specialties: ['Medication Management', 'Dual Diagnosis', 'Treatment-Resistant Depression'],
          rating: 4.8,
          verified: true
        },
        availability: {
          nextAvailable: '2024-03-22T09:00:00Z',
          timezone: 'EST',
          formats: ['video', 'in-person']
        },
        cost: {
          session: '$300/evaluation',
          insurance: true,
          slidingScale: false
        },
        integrationLevel: 'advanced',
        status: 'available'
      },
      {
        id: '3',
        type: 'spiritual-direction',
        provider: {
          name: 'Rev. Maya Patel, MDiv',
          credentials: ['MDiv', 'Certified Spiritual Director', 'Interfaith Ministry'],
          specialties: ['Spiritual Crisis', 'Religious Trauma', 'Meaning-Making', 'Interfaith Dialogue'],
          rating: 4.9,
          verified: true
        },
        availability: {
          nextAvailable: '2024-03-16T16:30:00Z',
          timezone: 'CST',
          formats: ['video', 'phone']
        },
        cost: {
          session: '$75/hour',
          insurance: false,
          slidingScale: true
        },
        integrationLevel: 'basic',
        status: 'available'
      }
    ]);

    setDataExports([
      {
        format: 'pdf',
        scope: 'therapeutic',
        includes: ['Progress summaries', 'EI assessments', 'Goal tracking', 'Crisis prevention data'],
        excludes: ['Personal reflections', 'Community interactions'],
        purpose: 'Share with therapist for treatment planning',
        recipient: 'Dr. Sarah Chen, LCSW',
        downloadCount: 3,
        lastGenerated: '2024-03-10T15:20:00Z'
      },
      {
        format: 'hl7-fhir',
        scope: 'personal',
        includes: ['All assessment data', 'Progress metrics', 'Crisis alerts', 'Intervention outcomes'],
        excludes: ['Community content', 'Spiritual narratives'],
        purpose: 'Integration with Epic MyChart EHR system',
        recipient: 'Stanford Healthcare System',
        downloadCount: 1,
        lastGenerated: '2024-03-08T11:45:00Z'
      }
    ]);
  }, []);

  const renderCrisisSupport = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-red-100 rounded-full">
            <Shield className="h-12 w-12 text-red-600" />
          </div>
        </div>
        <h1 className="text-3xl font-medium mb-4">Priority Crisis Support</h1>
        <p className="text-xl text-gray-600">
          24/7 immediate response with professional escalation pathways
        </p>
      </div>

      {/* Crisis Status */}
      <Card className={`p-6 ${crisisSupport.isActive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full ${crisisSupport.isActive ? 'bg-green-100' : 'bg-red-100'}`}>
              <Shield className={`h-6 w-6 ${crisisSupport.isActive ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <div>
              <h2 className="text-xl font-medium">Crisis Support Status</h2>
              <p className={`text-sm ${crisisSupport.isActive ? 'text-green-700' : 'text-red-700'}`}>
                {crisisSupport.isActive ? 'Active and Monitoring' : 'Inactive'}
              </p>
            </div>
          </div>
          <Badge variant={crisisSupport.isActive ? 'default' : 'destructive'}>
            {crisisSupport.level.toUpperCase()} TIER
          </Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium mb-2">Response Time</h3>
            <div className="text-2xl font-medium text-blue-600">{crisisSupport.responseTime}</div>
            <div className="text-sm text-gray-600">Average response for Oracle tier</div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Available Channels</h3>
            <div className="flex flex-wrap gap-2">
              {crisisSupport.availableChannels.map((channel) => (
                <Badge key={channel} variant="outline" className="capitalize">
                  {channel === 'emergency' ? '🚨 Emergency' : channel}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Professional Backup</h3>
            <div className="flex items-center gap-2">
              {crisisSupport.professionalBackup ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              )}
              <span className="text-sm">
                {crisisSupport.professionalBackup ? 'Licensed professionals on standby' : 'Peer support only'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Escalation Path */}
      <Card className="p-6">
        <h2 className="text-xl font-medium mb-4">Crisis Escalation Pathway</h2>
        <div className="space-y-4">
          {crisisSupport.escalationPath.map((step, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-medium">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{step}</h3>
                <div className="text-sm text-gray-600">
                  {index === 0 && 'AI monitors your interactions for crisis indicators'}
                  {index === 1 && 'Licensed crisis counselor provides immediate support'}
                  {index === 2 && 'Emergency services contacted if immediate danger'}
                  {index === 3 && 'Your healthcare provider receives crisis alert'}
                </div>
              </div>
              {index < crisisSupport.escalationPath.length - 1 && (
                <ChevronRight className="h-5 w-5 text-gray-400" />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <Phone className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h3 className="font-medium mb-2">Emergency Hotline</h3>
          <p className="text-sm text-gray-600 mb-4">
            Immediate connection to crisis professionals
          </p>
          <Button variant="destructive" className="w-full">
            <Phone className="h-4 w-4 mr-2" />
            Call Now
          </Button>
        </Card>

        <Card className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <MessageCircle className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h3 className="font-medium mb-2">Crisis Chat</h3>
          <p className="text-sm text-gray-600 mb-4">
            Text-based crisis support with trained counselors
          </p>
          <Button className="w-full">
            <MessageCircle className="h-4 w-4 mr-2" />
            Start Chat
          </Button>
        </Card>

        <Card className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Video className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <h3 className="font-medium mb-2">Video Session</h3>
          <p className="text-sm text-gray-600 mb-4">
            Face-to-face crisis intervention session
          </p>
          <Button variant="outline" className="w-full">
            <Video className="h-4 w-4 mr-2" />
            Request Session
          </Button>
        </Card>
      </div>

      {/* Crisis Resources */}
      <Card className="p-6">
        <h2 className="text-xl font-medium mb-4">Crisis Resources</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3">Immediate Coping Strategies</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>5-4-3-2-1 grounding technique (5 things you see, 4 you hear, etc.)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Box breathing: 4 counts in, hold 4, out 4, hold 4</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Hold ice cubes or splash cold water on face</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Call your crisis support person</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-3">Professional Contacts</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>National Suicide Prevention Lifeline</span>
                <span className="font-medium">988</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>Crisis Text Line</span>
                <span className="font-medium">Text HOME to 741741</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>Your Primary Therapist</span>
                <span className="font-medium">Dr. Sarah Chen: (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">External Service Integration</h1>
          <p className="text-gray-600">Connect with healthcare providers, therapy platforms, and wellness apps</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </div>

      <div className="grid gap-6">
        {externalIntegrations.map((integration) => (
          <Card key={integration.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${
                  integration.type === 'ehr' ? 'bg-blue-100' :
                  integration.type === 'therapy-platform' ? 'bg-purple-100' :
                  integration.type === 'wellness-app' ? 'bg-green-100' :
                  integration.type === 'healthcare-provider' ? 'bg-red-100' :
                  'bg-yellow-100'
                }`}>
                  {integration.type === 'ehr' && <Database className="h-6 w-6 text-blue-600" />}
                  {integration.type === 'therapy-platform' && <Users className="h-6 w-6 text-purple-600" />}
                  {integration.type === 'wellness-app' && <Heart className="h-6 w-6 text-green-600" />}
                  {integration.type === 'healthcare-provider' && <Building className="h-6 w-6 text-red-600" />}
                  {integration.type === 'educational' && <Award className="h-6 w-6 text-yellow-600" />}
                </div>
                <div>
                  <h2 className="text-lg font-medium">{integration.name}</h2>
                  <p className="text-gray-600">{integration.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                    <Badge variant="outline" className="capitalize">
                      {integration.type.replace('-', ' ')}
                    </Badge>
                    <span>{integration.cost}</span>
                    {integration.lastSync && (
                      <span>Last sync: {new Date(integration.lastSync).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={
                  integration.status === 'connected' ? 'default' :
                  integration.status === 'pending' ? 'secondary' :
                  integration.status === 'blocked' ? 'destructive' : 'outline'
                }>
                  {integration.status}
                </Badge>
                {integration.status === 'connected' ? (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCcw className="h-4 w-4 mr-2" />
                      Sync
                    </Button>
                  </div>
                ) : integration.status === 'available' ? (
                  <Button size="sm">
                    <Link className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                ) : integration.status === 'pending' ? (
                  <Button variant="secondary" size="sm" disabled>
                    <Clock className="h-4 w-4 mr-2" />
                    Pending
                  </Button>
                ) : (
                  <Button variant="outline" size="sm">
                    <Info className="h-4 w-4 mr-2" />
                    Details
                  </Button>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
              <div>
                <h3 className="font-medium mb-2">Data Sharing Capabilities</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    {integration.dataSharing.canExport ? (
                      <Upload className="h-4 w-4 text-green-500" />
                    ) : (
                      <Upload className="h-4 w-4 text-gray-400" />
                    )}
                    <span>Export data to this service</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {integration.dataSharing.canImport ? (
                      <Download className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Download className="h-4 w-4 text-gray-400" />
                    )}
                    <span>Import data from this service</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-purple-500" />
                    <span className="capitalize">{integration.dataSharing.securityLevel} security</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Shared Data Types</h3>
                <div className="flex flex-wrap gap-1">
                  {integration.dataSharing.dataTypes.map((type) => (
                    <Badge key={type} variant="outline" className="text-xs">
                      {type.replace('-', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderConsultations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Professional Consultations</h1>
          <p className="text-gray-600">Connect with licensed mental health professionals and specialists</p>
        </div>
        <Button>
          <Search className="h-4 w-4 mr-2" />
          Find Providers
        </Button>
      </div>

      <div className="grid gap-6">
        {consultations.map((consultation) => (
          <Card key={consultation.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-medium">{consultation.provider.name}</h2>
                  {consultation.provider.verified && (
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                  )}
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{consultation.provider.rating}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {consultation.provider.credentials.map((credential) => (
                    <Badge key={credential} variant="outline" className="text-xs">
                      {credential}
                    </Badge>
                  ))}
                </div>

                <Badge variant="outline" className="capitalize mb-3">
                  {consultation.type.replace('-', ' ')}
                </Badge>

                <div className="text-sm text-gray-600 mb-3">
                  Specializes in: {consultation.provider.specialties.join(', ')}
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-700">Next Available</div>
                    <div>{new Date(consultation.availability.nextAvailable).toLocaleDateString()} at {new Date(consultation.availability.nextAvailable).toLocaleTimeString()}</div>
                    <div className="text-gray-500">{consultation.availability.timezone}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">Session Formats</div>
                    <div className="flex flex-wrap gap-1">
                      {consultation.availability.formats.map((format) => (
                        <Badge key={format} variant="outline" className="text-xs capitalize">
                          {format.replace('-', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">Cost & Insurance</div>
                    <div>{consultation.cost.session}</div>
                    <div className="text-green-600">
                      {consultation.cost.insurance && '✓ Insurance accepted'}
                      {consultation.cost.slidingScale && ' • Sliding scale available'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button>
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Session
                </Button>
                <Button variant="outline" size="sm">
                  <Info className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Integration Level</h3>
              <div className="flex items-center gap-4">
                <Badge variant={
                  consultation.integrationLevel === 'full' ? 'default' :
                  consultation.integrationLevel === 'advanced' ? 'secondary' : 'outline'
                }>
                  {consultation.integrationLevel}
                </Badge>
                <div className="text-sm text-gray-600">
                  {consultation.integrationLevel === 'full' && 'Full ALCHM integration with shared progress tracking and automated reporting'}
                  {consultation.integrationLevel === 'advanced' && 'Progress sharing and basic integration features'}
                  {consultation.integrationLevel === 'basic' && 'Manual data sharing available'}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-start gap-4">
          <Building className="h-8 w-8 text-blue-600 mt-1" />
          <div>
            <h2 className="text-xl font-medium mb-2">Enterprise Healthcare Integration</h2>
            <p className="text-gray-700 mb-4">
              ALCHM partners with major healthcare systems to provide seamless care coordination. 
              Your progress data can be automatically shared with your treatment team while maintaining 
              complete privacy control.
            </p>
            <div className="flex gap-4">
              <Button>
                <ExternalLink className="h-4 w-4 mr-2" />
                Find Partner Providers
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Integration Settings
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderDataPortability = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Enhanced Data Portability</h1>
          <p className="text-gray-600">Export your data for therapy, education, research, and personal records</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Export
        </Button>
      </div>

      {/* Current Exports */}
      <div className="grid gap-6">
        {dataExports.map((exportData, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-lg font-medium capitalize">{exportData.scope} Data Export</h2>
                  <Badge variant="outline" className="uppercase">
                    {exportData.format}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-3">{exportData.purpose}</p>
                <div className="text-sm text-gray-500">
                  {exportData.recipient && `Prepared for: ${exportData.recipient}`}
                  {exportData.lastGenerated && ` • Generated: ${new Date(exportData.lastGenerated).toLocaleDateString()}`}
                  {exportData.downloadCount && ` • Downloaded ${exportData.downloadCount} times`}
                </div>
              </div>

              <div className="flex gap-2">
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Included Data</h3>
                <ul className="space-y-1 text-sm">
                  {exportData.includes.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">Excluded for Privacy</h3>
                <ul className="space-y-1 text-sm">
                  {exportData.excludes.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Lock className="h-3 w-3 text-gray-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Export Templates */}
      <Card className="p-6">
        <h2 className="text-xl font-medium mb-4">Export Templates</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg text-center">
            <FileText className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-medium mb-2">Therapeutic Report</h3>
            <p className="text-sm text-gray-600 mb-3">
              Comprehensive progress summary for therapy sessions
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Generate PDF
            </Button>
          </div>

          <div className="p-4 border rounded-lg text-center">
            <Database className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-medium mb-2">Healthcare Integration</h3>
            <p className="text-sm text-gray-600 mb-3">
              HL7 FHIR format for electronic health records
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Generate FHIR
            </Button>
          </div>

          <div className="p-4 border rounded-lg text-center">
            <Award className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-medium mb-2">Research Data</h3>
            <p className="text-sm text-gray-600 mb-3">
              Anonymized data for academic research participation
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Generate CSV
            </Button>
          </div>
        </div>
      </Card>

      {/* Legal & Compliance */}
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="flex items-start gap-3">
          <Shield className="h-6 w-6 text-green-600 mt-1" />
          <div>
            <h3 className="font-medium text-green-900 mb-2">Data Rights & Compliance</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Complete data ownership - you control all exports and sharing</li>
              <li>• HIPAA compliant data handling for all healthcare integrations</li>
              <li>• GDPR compliant with right to data portability</li>
              <li>• All exports include audit trails and access logs</li>
              <li>• Secure deletion available for any exported data</li>
              <li>• Legal support for data use in court proceedings if needed</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-full">
            <Crown className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-medium">Premium Support & Integration</h1>
            <p className="text-gray-600">Professional-grade support with seamless healthcare integration</p>
          </div>
        </div>
        <Badge className="bg-purple-600">
          <Crown className="h-3 w-3 mr-1" />
          Oracle Tier
        </Badge>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 p-1 bg-gray-100 rounded-lg">
        <Button
          variant={activeTab === 'crisis' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('crisis')}
        >
          <Shield className="h-4 w-4 mr-2" />
          Crisis Support
        </Button>
        <Button
          variant={activeTab === 'integrations' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('integrations')}
        >
          <Link className="h-4 w-4 mr-2" />
          Integrations
        </Button>
        <Button
          variant={activeTab === 'consultations' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('consultations')}
        >
          <Users className="h-4 w-4 mr-2" />
          Consultations
        </Button>
        <Button
          variant={activeTab === 'portability' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('portability')}
        >
          <Database className="h-4 w-4 mr-2" />
          Data Portability
        </Button>
      </div>

      {/* Content */}
      {activeTab === 'crisis' && renderCrisisSupport()}
      {activeTab === 'integrations' && renderIntegrations()}
      {activeTab === 'consultations' && renderConsultations()}
      {activeTab === 'portability' && renderDataPortability()}
    </div>
  );
}