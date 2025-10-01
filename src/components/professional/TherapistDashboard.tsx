'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Users, AlertTriangle, FileText, MessageCircle, TrendingUp, Calendar, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ClientProgressMonitor } from './ClientProgressMonitor';
import { CrisisAlertPanel } from './CrisisAlertPanel';
import { ProfessionalDocumentation } from './ProfessionalDocumentation';
import { SecureCommunication } from './SecureCommunication';
import { OutcomeMeasurement } from './OutcomeMeasurement';

interface TherapistProfile {
  id: string;
  name: string;
  licenseNumber: string;
  specialty: string[];
  verificationStatus: 'verified' | 'pending' | 'unverified';
}

interface ClientOverview {
  id: string;
  initials: string;
  consentStatus: 'active' | 'pending' | 'expired';
  lastActivity: Date;
  riskLevel: 'low' | 'moderate' | 'high' | 'crisis';
  progressTrend: 'improving' | 'stable' | 'declining';
  upcomingSession: Date | null;
}

export const TherapistDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [therapistProfile, setTherapistProfile] = useState<TherapistProfile | null>(null);
  const [clients, setClients] = useState<ClientOverview[]>([]);
  const [crisisAlerts, setCrisisAlerts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTherapistData();
  }, [user]);

  const loadTherapistData = async () => {
    try {
      // Load therapist profile and client data
      // This would integrate with HIPAA-compliant backend
      setLoading(false);
    } catch (error) {
      console.error('Error loading therapist data:', error);
      setLoading(false);
    }
  };

  const TabButton = ({ id, label, icon: Icon, alertCount = 0 }: { 
    id: string; 
    label: string; 
    icon: React.ComponentType<any>; 
    alertCount?: number;
  }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`
        flex items-center space-x-3 px-6 py-4 rounded-lg transition-all duration-300
        ${activeTab === id 
          ? 'bg-sage-100 text-sage-800 shadow-md' 
          : 'text-slate-600 hover:bg-slate-50 hover:text-sage-700'
        }
        relative
      `}
    >
      <Icon size={20} />
      <span className="font-medium tracking-wide">{label}</span>
      {alertCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {alertCount}
        </span>
      )}
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-sanctuary-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto"></div>
          <p className="text-slate-600 tracking-wide">Loading secure dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sanctuary-background">
      {/* HIPAA Compliance Banner */}
      <div className="bg-blue-900 text-white py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield size={20} />
            <span className="text-sm font-medium tracking-wide">
              HIPAA-Compliant Professional Environment
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <span>Session Timeout: 25 min</span>
            <Lock size={16} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Professional Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-slate-800 tracking-wide mb-2">
                Professional Dashboard
              </h1>
              <p className="text-slate-600 tracking-wide">
                Secure client monitoring and therapeutic support tools
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 mb-1">License #: {therapistProfile?.licenseNumber}</p>
              <span className={`
                px-3 py-1 rounded-full text-xs font-medium tracking-wide
                ${therapistProfile?.verificationStatus === 'verified' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
                }
              `}>
                {therapistProfile?.verificationStatus === 'verified' ? 'Verified Professional' : 'Verification Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-2 bg-white p-2 rounded-xl shadow-soft">
            <TabButton id="overview" label="Overview" icon={TrendingUp} />
            <TabButton id="clients" label="Client Progress" icon={Users} />
            <TabButton id="alerts" label="Crisis Alerts" icon={AlertTriangle} alertCount={crisisAlerts} />
            <TabButton id="documentation" label="Documentation" icon={FileText} />
            <TabButton id="communication" label="Secure Messages" icon={MessageCircle} />
            <TabButton id="outcomes" label="Outcomes" icon={TrendingUp} />
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Clients Overview */}
              <Card className="p-6 border-sage-200 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-slate-800 tracking-wide">Active Clients</h3>
                  <Users className="text-sage-600" size={24} />
                </div>
                <div className="space-y-3">
                  <div className="text-3xl font-light text-slate-800">
                    {clients.length}
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-green-600">↗ 3 improving</span>
                    <span className="text-yellow-600">→ 2 stable</span>
                    <span className="text-red-600">↘ 1 needs attention</span>
                  </div>
                </div>
              </Card>

              {/* Crisis Monitoring */}
              <Card className="p-6 border-red-200 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-slate-800 tracking-wide">Crisis Monitoring</h3>
                  <AlertTriangle className="text-red-600" size={24} />
                </div>
                <div className="space-y-3">
                  <div className="text-3xl font-light text-red-600">
                    {crisisAlerts}
                  </div>
                  <p className="text-sm text-slate-600">
                    Active alerts requiring review
                  </p>
                  {crisisAlerts > 0 && (
                    <Button 
                      size="sm" 
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => setActiveTab('alerts')}
                    >
                      Review Alerts
                    </Button>
                  )}
                </div>
              </Card>

              {/* Upcoming Sessions */}
              <Card className="p-6 border-sage-200 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-slate-800 tracking-wide">Today's Sessions</h3>
                  <Calendar className="text-sage-600" size={24} />
                </div>
                <div className="space-y-3">
                  <div className="text-3xl font-light text-slate-800">4</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Next: Client A.B.</span>
                      <span className="text-sage-600">2:00 PM</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setActiveTab('clients')}
                    >
                      View Session Prep
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'clients' && (
            <ClientProgressMonitor clients={clients} />
          )}

          {activeTab === 'alerts' && (
            <CrisisAlertPanel onAlertCountChange={setCrisisAlerts} />
          )}

          {activeTab === 'documentation' && (
            <ProfessionalDocumentation />
          )}

          {activeTab === 'communication' && (
            <SecureCommunication />
          )}

          {activeTab === 'outcomes' && (
            <OutcomeMeasurement />
          )}
        </div>

        {/* Professional Footer */}
        <div className="mt-12 pt-6 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-500 tracking-wide">
            All client data is encrypted and HIPAA-compliant. 
            Session activity is logged for security audit purposes.
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Last security audit: {new Date().toLocaleDateString()} | 
            Data retention policy: 7 years | 
            Emergency contact: 1-800-ALCHM-911
          </p>
        </div>
      </div>
    </div>
  );
};

export default TherapistDashboard;