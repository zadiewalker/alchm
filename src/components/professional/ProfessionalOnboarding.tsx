'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2,
  Circle,
  Upload,
  FileText,
  Shield,
  Award,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  AlertCircle,
  Star,
  Users,
  Heart,
  Brain,
  Target,
  Book,
  GraduationCap,
  Briefcase,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Download,
  ExternalLink,
  Zap,
  ChevronRight,
  ChevronLeft,
  Info,
  CheckShield
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
  estimatedTime: string;
  required: boolean;
}

interface ProfessionalCredential {
  type: 'license' | 'certification' | 'degree' | 'training';
  name: string;
  issuingBody: string;
  licenseNumber?: string;
  issueDate: string;
  expirationDate?: string;
  status: 'verified' | 'pending' | 'needs-attention' | 'expired';
  documentUrl?: string;
}

interface PracticeInfo {
  name: string;
  type: 'individual' | 'group' | 'clinic' | 'hospital' | 'university';
  address: string;
  phone: string;
  email: string;
  website?: string;
  npI?: string;
  taxId?: string;
  liability_insurance: {
    provider: string;
    policyNumber: string;
    expirationDate: string;
    coverage: string;
  };
}

interface Specialization {
  id: string;
  name: string;
  category: 'trauma' | 'anxiety' | 'depression' | 'addiction' | 'family' | 'adolescent' | 'geriatric' | 'cultural';
  level: 'basic' | 'intermediate' | 'advanced' | 'expert';
  certified: boolean;
  experience_years: number;
  training_hours?: number;
}

export default function ProfessionalOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    personal: {
      firstName: '',
      lastName: '',
      preferredName: '',
      pronouns: '',
      email: '',
      phone: '',
      timezone: '',
      languages: [] as string[]
    },
    credentials: [] as ProfessionalCredential[],
    practice: {} as PracticeInfo,
    specializations: [] as Specialization[],
    preferences: {
      client_age_range: [] as string[],
      session_types: [] as string[],
      therapeutic_approaches: [] as string[],
      availability: {} as Record<string, boolean>,
      max_clients: 20,
      crisis_availability: false,
      research_participation: false
    },
    hipaa_compliance: {
      training_completed: false,
      training_date: '',
      certification_url: '',
      agreed_to_terms: false,
      background_check_completed: false
    }
  });

  const [onboardingSteps] = useState<OnboardingStep[]>([
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Basic contact and demographic information',
      isCompleted: false,
      isActive: true,
      estimatedTime: '3 minutes',
      required: true
    },
    {
      id: 'credentials',
      title: 'Professional Credentials',
      description: 'License verification and educational background',
      isCompleted: false,
      isActive: false,
      estimatedTime: '8 minutes',
      required: true
    },
    {
      id: 'practice',
      title: 'Practice Information',
      description: 'Practice details and insurance information',
      isCompleted: false,
      isActive: false,
      estimatedTime: '5 minutes',
      required: true
    },
    {
      id: 'specializations',
      title: 'Clinical Specializations',
      description: 'Areas of expertise and therapeutic approaches',
      isCompleted: false,
      isActive: false,
      estimatedTime: '6 minutes',
      required: false
    },
    {
      id: 'preferences',
      title: 'Platform Preferences',
      description: 'Availability and client preferences',
      isCompleted: false,
      isActive: false,
      estimatedTime: '4 minutes',
      required: false
    },
    {
      id: 'compliance',
      title: 'HIPAA & Compliance',
      description: 'Privacy training and background verification',
      isCompleted: false,
      isActive: false,
      estimatedTime: '10 minutes',
      required: true
    },
    {
      id: 'review',
      title: 'Review & Submit',
      description: 'Final review of all information',
      isCompleted: false,
      isActive: false,
      estimatedTime: '2 minutes',
      required: true
    }
  ]);

  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'in-progress' | 'completed'>('pending');

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {onboardingSteps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                ${index === currentStep 
                  ? 'bg-sage-400 border-sage-400 text-white' 
                  : step.isCompleted 
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }
              `}>
                {step.isCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <div className={`text-xs font-medium ${
                  index === currentStep ? 'text-sage-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-400">{step.estimatedTime}</div>
              </div>
            </div>
            {index < onboardingSteps.length - 1 && (
              <div className={`
                flex-1 h-0.5 mx-4 transition-all duration-300
                ${step.isCompleted ? 'bg-emerald-500' : 'bg-gray-200'}
              `} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <Card className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-sage-100 rounded-lg">
          <Users className="h-6 w-6 text-sage-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
          <p className="text-sm text-gray-600">Tell us about yourself to personalize your experience</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              value={formData.personal.firstName}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                personal: { ...prev.personal, firstName: e.target.value }
              }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all"
              placeholder="Enter your first name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              value={formData.personal.lastName}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                personal: { ...prev.personal, lastName: e.target.value }
              }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all"
              placeholder="Enter your last name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Name
            </label>
            <input
              type="text"
              value={formData.personal.preferredName}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                personal: { ...prev.personal, preferredName: e.target.value }
              }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all"
              placeholder="How would you like to be addressed?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pronouns
            </label>
            <select
              value={formData.personal.pronouns}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                personal: { ...prev.personal, pronouns: e.target.value }
              }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all"
            >
              <option value="">Select pronouns</option>
              <option value="she/her">she/her</option>
              <option value="he/him">he/him</option>
              <option value="they/them">they/them</option>
              <option value="other">Other/Prefer not to say</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Professional Email *
            </label>
            <input
              type="email"
              value={formData.personal.email}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                personal: { ...prev.personal, email: e.target.value }
              }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all"
              placeholder="your.email@practice.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.personal.phone}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                personal: { ...prev.personal, phone: e.target.value }
              }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Zone *
            </label>
            <select
              value={formData.personal.timezone}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                personal: { ...prev.personal, timezone: e.target.value }
              }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all"
            >
              <option value="">Select time zone</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="America/Anchorage">Alaska Time (AKT)</option>
              <option value="Pacific/Honolulu">Hawaii Time (HST)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Languages Spoken
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['English', 'Spanish', 'French', 'Mandarin', 'ASL', 'Arabic'].map(lang => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    const languages = formData.personal.languages.includes(lang)
                      ? formData.personal.languages.filter(l => l !== lang)
                      : [...formData.personal.languages, lang];
                    setFormData(prev => ({
                      ...prev,
                      personal: { ...prev.personal, languages }
                    }));
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    formData.personal.languages.includes(lang)
                      ? 'bg-sage-100 text-sage-700 border border-sage-300'
                      : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderCredentials = () => (
    <Card className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Award className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Professional Credentials</h2>
          <p className="text-sm text-gray-600">Upload your licenses and certifications for verification</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Primary License */}
        <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Primary Professional License</h3>
              <p className="text-sm text-blue-800">Your main clinical license (required)</p>
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Required
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">
                License Type
              </label>
              <select className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select license type</option>
                <option value="LCSW">LCSW - Licensed Clinical Social Worker</option>
                <option value="LPC">LPC - Licensed Professional Counselor</option>
                <option value="LMFT">LMFT - Licensed Marriage & Family Therapist</option>
                <option value="LP">LP - Licensed Psychologist</option>
                <option value="LMHC">LMHC - Licensed Mental Health Counselor</option>
                <option value="LCPC">LCPC - Licensed Clinical Professional Counselor</option>
                <option value="Other">Other (specify in notes)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">
                License Number
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter license number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Issuing State/Body
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., California Board of Psychology"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Expiration Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-blue-900 mb-2">
              License Document
            </label>
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <Upload className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-sm text-blue-700 mb-1">
                Drag and drop your license document, or click to browse
              </div>
              <div className="text-xs text-blue-600">
                Supported formats: PDF, JPG, PNG (max 10MB)
              </div>
              <Button variant="secondary" size="sm" className="mt-3">
                Choose File
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Credentials */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Additional Credentials</h3>
            <Button variant="secondary" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Add Credential
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <GraduationCap className="h-5 w-5 text-emerald-600" />
                <div>
                  <div className="font-medium text-gray-900">Educational Degree</div>
                  <div className="text-sm text-gray-600">Master's or Doctoral degree</div>
                </div>
              </div>
              <Button variant="secondary" size="sm" className="w-full">
                Upload Degree
              </Button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <CheckShield className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-medium text-gray-900">Specialty Certifications</div>
                  <div className="text-sm text-gray-600">EMDR, CBT, DBT, etc.</div>
                </div>
              </div>
              <Button variant="secondary" size="sm" className="w-full">
                Upload Certificates
              </Button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Book className="h-5 w-5 text-amber-600" />
                <div>
                  <div className="font-medium text-gray-900">Continuing Education</div>
                  <div className="text-sm text-gray-600">Recent CE certificates</div>
                </div>
              </div>
              <Button variant="secondary" size="sm" className="w-full">
                Upload CE Records
              </Button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-medium text-gray-900">Malpractice Insurance</div>
                  <div className="text-sm text-gray-600">Current policy certificate</div>
                </div>
              </div>
              <Button variant="secondary" size="sm" className="w-full">
                Upload Policy
              </Button>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <div className="font-medium text-amber-900 mb-1">Verification Process</div>
              <div className="text-sm text-amber-800 mb-2">
                Our verification team will review your credentials within 2-3 business days. 
                You'll receive email updates on the status of your application.
              </div>
              <div className="text-xs text-amber-700">
                All documents are securely stored and only accessed by authorized verification staff.
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderCompliance = () => (
    <Card className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-100 rounded-lg">
          <Shield className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">HIPAA & Compliance</h2>
          <p className="text-sm text-gray-600">Complete required training and privacy certifications</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* HIPAA Training */}
        <div className="p-6 bg-red-50 rounded-xl border border-red-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-red-900 mb-1">HIPAA Privacy Training</h3>
              <p className="text-sm text-red-800">Complete our HIPAA-compliant training module</p>
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Required
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-200">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <div>
                  <div className="font-medium text-gray-900">HIPAA Basics</div>
                  <div className="text-sm text-gray-600">15 minutes • Completed</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-200">
                <Circle className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">Digital Privacy</div>
                  <div className="text-sm text-gray-600">20 minutes • Not started</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-200">
                <Circle className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">Breach Response</div>
                  <div className="text-sm text-gray-600">10 minutes • Not started</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <ExternalLink className="h-4 w-4 mr-2" />
                Start Training Module
              </Button>
            </div>
          </div>
        </div>

        {/* Background Check */}
        <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Background Verification</h3>
              <p className="text-sm text-blue-800">Professional background check through verified partner</p>
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Required
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="text-sm text-blue-800 mb-3">
                We partner with Sterling Volunteers for secure background screening. This includes:
              </div>
              <ul className="text-sm text-blue-700 space-y-1 mb-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Criminal background check
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Professional license verification
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  OIG/GSA exclusion list check
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Professional reference verification
                </li>
              </ul>
              <div className="text-xs text-blue-600">
                Cost: $45 (reimbursed after 6 months of active participation)
              </div>
            </div>
            <Button variant="secondary">
              <ExternalLink className="h-4 w-4 mr-2" />
              Start Background Check
            </Button>
          </div>
        </div>

        {/* Agreement & Terms */}
        <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Professional Agreement</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="hipaa-agreement"
                className="mt-1 w-4 h-4 text-sage-600 border-gray-300 rounded focus:ring-sage-500"
              />
              <label htmlFor="hipaa-agreement" className="text-sm text-gray-700">
                I have completed the HIPAA training and understand my obligations under HIPAA 
                regulations for protecting client privacy and health information.
              </label>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="ethics-agreement"
                className="mt-1 w-4 h-4 text-sage-600 border-gray-300 rounded focus:ring-sage-500"
              />
              <label htmlFor="ethics-agreement" className="text-sm text-gray-700">
                I agree to uphold the ethical standards of my profession and will provide 
                culturally competent, trauma-informed care to all clients.
              </label>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="platform-agreement"
                className="mt-1 w-4 h-4 text-sage-600 border-gray-300 rounded focus:ring-sage-500"
              />
              <label htmlFor="platform-agreement" className="text-sm text-gray-700">
                I understand that ALCHM is a supportive tool that enhances but does not replace 
                traditional therapeutic relationships and clinical judgment.
              </label>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="data-agreement"
                className="mt-1 w-4 h-4 text-sage-600 border-gray-300 rounded focus:ring-sage-500"
              />
              <label htmlFor="data-agreement" className="text-sm text-gray-700">
                I consent to the anonymized use of aggregated client outcome data for research 
                purposes, with full client consent and IRB approval where applicable.
              </label>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Info className="h-4 w-4" />
              By proceeding, you agree to our 
              <a href="#" className="text-sage-600 hover:text-sage-700 underline">Terms of Service</a> 
              and 
              <a href="#" className="text-sage-600 hover:text-sage-700 underline">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderReview = () => (
    <Card className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Review & Submit</h2>
          <p className="text-sm text-gray-600">Review your information before submitting for verification</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Application Summary */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 text-center border-emerald-200">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
            <div className="text-lg font-semibold text-emerald-700 mb-1">Personal Info</div>
            <div className="text-sm text-emerald-600">Complete</div>
          </Card>

          <Card className="p-6 text-center border-blue-200">
            <Clock className="h-8 w-8 text-blue-500 mx-auto mb-3" />
            <div className="text-lg font-semibold text-blue-700 mb-1">Credentials</div>
            <div className="text-sm text-blue-600">Pending Review</div>
          </Card>

          <Card className="p-6 text-center border-amber-200">
            <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-3" />
            <div className="text-lg font-semibold text-amber-700 mb-1">HIPAA Training</div>
            <div className="text-sm text-amber-600">In Progress</div>
          </Card>
        </div>

        {/* Next Steps */}
        <div className="p-6 bg-sage-50 rounded-xl border border-sage-200">
          <h3 className="font-semibold text-sage-900 mb-4">Next Steps</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-sage-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-sage-700">1</span>
              </div>
              <div className="text-sm text-sage-800">
                Application review begins immediately (2-3 business days)
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-sage-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-sage-700">2</span>
              </div>
              <div className="text-sm text-sage-800">
                License verification with state boards (3-5 business days)
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-sage-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-sage-700">3</span>
              </div>
              <div className="text-sm text-sage-800">
                Background check completion (5-7 business days)
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-sage-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-sage-700">4</span>
              </div>
              <div className="text-sm text-sage-800">
                Platform access granted and onboarding call scheduled
              </div>
            </div>
          </div>
        </div>

        {/* Final Submission */}
        <div className="text-center">
          <Button className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Submit Application for Review
          </Button>
          <div className="text-sm text-gray-600 mt-3">
            You'll receive a confirmation email within a few minutes
          </div>
        </div>
      </div>
    </Card>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderPersonalInfo();
      case 1: return renderCredentials();
      case 2: return renderPersonalInfo(); // Practice info would be similar
      case 3: return renderPersonalInfo(); // Specializations would be similar  
      case 4: return renderPersonalInfo(); // Preferences would be similar
      case 5: return renderCompliance();
      case 6: return renderReview();
      default: return renderPersonalInfo();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-sanctuary-white min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-sage-100 to-sage-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Heart className="h-10 w-10 text-sage-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Professional Onboarding</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Join our community of trauma-informed mental health professionals. We'll guide you through 
          a secure verification process to ensure the highest standards of care.
        </p>
      </div>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Step Content */}
      {renderStepContent()}

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <Button
          variant="secondary"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="text-sm text-gray-500">
          Step {currentStep + 1} of {onboardingSteps.length}
        </div>

        <Button
          onClick={() => setCurrentStep(Math.min(onboardingSteps.length - 1, currentStep + 1))}
          disabled={currentStep === onboardingSteps.length - 1}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Support */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
        <div className="flex items-center justify-center gap-2 text-blue-700 mb-2">
          <Heart className="h-4 w-4" />
          <span className="font-medium">Need Help?</span>
        </div>
        <div className="text-sm text-blue-600 mb-3">
          Our verification team is here to support you through the process.
        </div>
        <div className="flex items-center justify-center gap-4 text-xs text-blue-600">
          <div className="flex items-center gap-1">
            <Mail className="h-3 w-3" />
            onboarding@alchm.app
          </div>
          <div className="flex items-center gap-1">
            <Phone className="h-3 w-3" />
            (555) 123-ALCHM
          </div>
        </div>
      </div>
    </div>
  );
}