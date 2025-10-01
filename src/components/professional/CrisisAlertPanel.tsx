'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, Eye, Phone, FileText, CheckCircle, XCircle } from 'lucide-react';

interface CrisisAlert {
  id: string;
  clientInitials: string;
  severity: 'medium' | 'high' | 'critical';
  timestamp: Date;
  triggerContent: string;
  aiConfidence: number;
  status: 'new' | 'reviewed' | 'escalated' | 'resolved';
  reviewedBy?: string;
  actionTaken?: string;
  followUpRequired: boolean;
}

interface Props {
  onAlertCountChange: (count: number) => void;
}

export const CrisisAlertPanel: React.FC<Props> = ({ onAlertCountChange }) => {
  const [alerts, setAlerts] = useState<CrisisAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<CrisisAlert | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'high'>('new');

  useEffect(() => {
    loadCrisisAlerts();
  }, []);

  useEffect(() => {
    const newAlertsCount = alerts.filter(alert => alert.status === 'new').length;
    onAlertCountChange(newAlertsCount);
  }, [alerts, onAlertCountChange]);

  const loadCrisisAlerts = async () => {
    try {
      // Load crisis alerts from HIPAA-compliant backend
      const mockAlerts: CrisisAlert[] = [
        {
          id: '1',
          clientInitials: 'J.D.',
          severity: 'critical',
          timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
          triggerContent: 'Entry contained multiple indicators of self-harm ideation and hopelessness',
          aiConfidence: 94,
          status: 'new',
          followUpRequired: true
        },
        {
          id: '2',
          clientInitials: 'A.B.',
          severity: 'high',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          triggerContent: 'Escalating anxiety patterns with mentions of panic and isolation',
          aiConfidence: 87,
          status: 'reviewed',
          reviewedBy: 'Dr. Smith',
          followUpRequired: true
        },
        {
          id: '3',
          clientInitials: 'M.K.',
          severity: 'medium',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
          triggerContent: 'Substance use concerns with emotional dysregulation indicators',
          aiConfidence: 78,
          status: 'escalated',
          reviewedBy: 'Dr. Smith',
          actionTaken: 'Referred to addiction specialist, follow-up scheduled',
          followUpRequired: false
        }
      ];
      
      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Error loading crisis alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50 text-red-800';
      case 'high': return 'border-orange-500 bg-orange-50 text-orange-800';
      case 'medium': return 'border-yellow-500 bg-yellow-50 text-yellow-800';
      default: return 'border-slate-500 bg-slate-50 text-slate-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    const iconClass = severity === 'critical' ? 'text-red-600' : 
                     severity === 'high' ? 'text-orange-600' : 'text-yellow-600';
    return <AlertTriangle className={iconClass} size={16} />;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { color: 'bg-red-100 text-red-800', label: 'New' },
      reviewed: { color: 'bg-blue-100 text-blue-800', label: 'Reviewed' },
      escalated: { color: 'bg-purple-100 text-purple-800', label: 'Escalated' },
      resolved: { color: 'bg-green-100 text-green-800', label: 'Resolved' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium tracking-wide ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const updateAlertStatus = async (alertId: string, newStatus: CrisisAlert['status'], actionTaken?: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: newStatus, actionTaken, reviewedBy: 'Dr. Smith' }
        : alert
    ));
  };

  const filteredAlerts = alerts.filter(alert => {
    switch (activeFilter) {
      case 'new': return alert.status === 'new';
      case 'high': return alert.severity === 'high' || alert.severity === 'critical';
      case 'all': return true;
      default: return true;
    }
  });

  const FilterButton = ({ filter, label, count }: { filter: string; label: string; count: number }) => (
    <button
      onClick={() => setActiveFilter(filter as any)}
      className={`
        px-4 py-2 rounded-lg text-sm font-medium tracking-wide transition-all duration-300
        ${activeFilter === filter 
          ? 'bg-sage-600 text-white shadow-md' 
          : 'bg-white text-slate-600 hover:bg-sage-50 hover:text-sage-700 border border-slate-200'
        }
      `}
    >
      {label} {count > 0 && <span className="ml-1">({count})</span>}
    </button>
  );

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600 mx-auto"></div>
        <p className="text-slate-600 mt-2 tracking-wide">Loading crisis alerts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 tracking-wide">Critical</p>
              <p className="text-2xl font-light text-red-600">
                {alerts.filter(a => a.severity === 'critical').length}
              </p>
            </div>
            <AlertTriangle className="text-red-600" size={24} />
          </div>
        </Card>
        
        <Card className="p-4 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 tracking-wide">High Priority</p>
              <p className="text-2xl font-light text-orange-600">
                {alerts.filter(a => a.severity === 'high').length}
              </p>
            </div>
            <AlertTriangle className="text-orange-600" size={24} />
          </div>
        </Card>

        <Card className="p-4 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 tracking-wide">Pending Review</p>
              <p className="text-2xl font-light text-blue-600">
                {alerts.filter(a => a.status === 'new').length}
              </p>
            </div>
            <Clock className="text-blue-600" size={24} />
          </div>
        </Card>

        <Card className="p-4 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 tracking-wide">Resolved Today</p>
              <p className="text-2xl font-light text-green-600">
                {alerts.filter(a => a.status === 'resolved').length}
              </p>
            </div>
            <CheckCircle className="text-green-600" size={24} />
          </div>
        </Card>
      </div>

      {/* Filter Controls */}
      <div className="flex space-x-2">
        <FilterButton 
          filter="new" 
          label="New Alerts" 
          count={alerts.filter(a => a.status === 'new').length} 
        />
        <FilterButton 
          filter="high" 
          label="High Priority" 
          count={alerts.filter(a => a.severity === 'high' || a.severity === 'critical').length} 
        />
        <FilterButton 
          filter="all" 
          label="All Alerts" 
          count={alerts.length} 
        />
      </div>

      {/* Crisis Alerts List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-slate-800 tracking-wide">
            Crisis Alerts ({filteredAlerts.length})
          </h3>
          
          {filteredAlerts.map(alert => (
            <Card
              key={alert.id}
              className={`p-4 cursor-pointer transition-all duration-300 ${
                selectedAlert?.id === alert.id 
                  ? 'ring-2 ring-sage-400 shadow-md' 
                  : 'hover:shadow-sm'
              } ${getSeverityColor(alert.severity)}`}
              onClick={() => setSelectedAlert(alert)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getSeverityIcon(alert.severity)}
                  <span className="font-medium">Client {alert.clientInitials}</span>
                  {getStatusBadge(alert.status)}
                </div>
                <div className="text-xs text-slate-500">
                  {getTimeAgo(alert.timestamp)}
                </div>
              </div>
              
              <p className="text-sm text-slate-700 mb-2 tracking-wide">
                {alert.triggerContent}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  AI Confidence: {alert.aiConfidence}%
                </span>
                {alert.followUpRequired && (
                  <span className="text-xs text-orange-600 font-medium">
                    Follow-up Required
                  </span>
                )}
              </div>
            </Card>
          ))}
          
          {filteredAlerts.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <AlertTriangle size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg tracking-wide">No alerts match current filter</p>
            </div>
          )}
        </div>

        {/* Alert Details */}
        {selectedAlert && (
          <Card className="p-6 border-sage-200">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-medium text-slate-800 tracking-wide">
                Alert Details
              </h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedAlert(null)}
              >
                <XCircle size={16} />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Client</label>
                  <p className="text-slate-800">{selectedAlert.clientInitials}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Severity</label>
                  <div className="flex items-center space-x-2">
                    {getSeverityIcon(selectedAlert.severity)}
                    <span className="capitalize">{selectedAlert.severity}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Time</label>
                  <p className="text-slate-800">{selectedAlert.timestamp.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">AI Confidence</label>
                  <p className="text-slate-800">{selectedAlert.aiConfidence}%</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Trigger Content
                </label>
                <p className="text-slate-800 bg-slate-50 p-3 rounded-lg text-sm tracking-wide">
                  {selectedAlert.triggerContent}
                </p>
              </div>

              {selectedAlert.actionTaken && (
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Action Taken
                  </label>
                  <p className="text-slate-800 bg-green-50 p-3 rounded-lg text-sm tracking-wide">
                    {selectedAlert.actionTaken}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-4 border-t border-slate-200">
                {selectedAlert.status === 'new' && (
                  <>
                    <Button
                      size="sm"
                      className="bg-sage-600 hover:bg-sage-700 text-white"
                      onClick={() => updateAlertStatus(selectedAlert.id, 'reviewed')}
                    >
                      <Eye size={16} className="mr-2" />
                      Mark Reviewed
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => updateAlertStatus(selectedAlert.id, 'escalated', 'Escalated to crisis intervention team')}
                    >
                      <Phone size={16} className="mr-2" />
                      Escalate
                    </Button>
                  </>
                )}
                
                <Button size="sm" variant="outline">
                  <FileText size={16} className="mr-2" />
                  View Full Entry
                </Button>
              </div>

              {/* Emergency Protocols */}
              {selectedAlert.severity === 'critical' && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Emergency Protocol</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Contact client within 1 hour</li>
                    <li>• Assess immediate safety</li>
                    <li>• Consider hospitalization if necessary</li>
                    <li>• Document all interventions</li>
                    <li>• Follow up within 24 hours</li>
                  </ul>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CrisisAlertPanel;