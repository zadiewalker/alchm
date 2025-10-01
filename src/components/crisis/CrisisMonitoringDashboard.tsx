'use client';

// ALCHM Crisis Monitoring Dashboard - Real-time Professional Interface
// Comprehensive crisis alert management with cultural responsiveness

import React, { useEffect, useState, useCallback } from 'react';
import { onSnapshot, collection, query, orderBy, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// ===== INTERFACES =====

interface CrisisAlert {
  id: string;
  type: string;
  participantId: string;
  riskLevel: 'immediate' | 'high' | 'moderate' | 'mild';
  confidence: number;
  triggers: string[];
  culturalContext: string[];
  timestamp: Date;
  
  response: {
    acknowledged: boolean;
    acknowledgedBy?: string;
    acknowledgedAt?: Date;
    responseTime?: number;
    professionalAssigned?: string;
    interventionStarted: boolean;
    interventionNotes?: string;
  };
  
  escalation: {
    level: number;
    escalatedAt?: Date;
    escalationReason?: string;
    emergencyServicesContacted: boolean;
  };
  
  delivery: {
    sms: { sent: boolean; sentAt?: Date; failed?: boolean; };
    mobileApp: { sent: boolean; sentAt?: Date; failed?: boolean; };
    dashboard: { sent: boolean; sentAt?: Date; failed?: boolean; };
  };
}

interface CrisisStatistics {
  today: {
    total: number;
    immediate: number;
    high: number;
    moderate: number;
    mild: number;
  };
  averageResponseTime: number;
  activeAlerts: number;
  professionalTeamStatus: {
    available: number;
    responding: number;
    unavailable: number;
  };
}

interface ProfessionalTeamMember {
  id: string;
  name: string;
  role: 'crisis_counselor' | 'clinical_director' | 'cultural_liaison' | 'backup_counselor';
  status: 'available' | 'responding' | 'busy' | 'unavailable';
  currentCases: number;
  specializations: string[];
  culturalCompetencies: string[];
  lastResponse?: Date;
}

// ===== MAIN DASHBOARD COMPONENT =====

export default function CrisisMonitoringDashboard() {
  const [activeAlerts, setActiveAlerts] = useState<CrisisAlert[]>([]);
  const [statistics, setStatistics] = useState<CrisisStatistics | null>(null);
  const [teamMembers, setTeamMembers] = useState<ProfessionalTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<CrisisAlert | null>(null);

  // ===== REAL-TIME DATA SUBSCRIPTIONS =====

  useEffect(() => {
    // Subscribe to active crisis alerts
    const alertsQuery = query(
      collection(db, 'crisis_dashboard'),
      where('status', '==', 'active'),
      where('response.acknowledged', '==', false),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribeAlerts = onSnapshot(alertsQuery, (snapshot) => {
      const alerts = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate() || new Date(),
          response: {
            ...data.response,
            acknowledgedAt: data.response?.acknowledgedAt?.toDate()
          },
          escalation: {
            ...data.escalation,
            escalatedAt: data.escalation?.escalatedAt?.toDate()
          }
        };
      }) as CrisisAlert[];

      setActiveAlerts(alerts);
      
      // Check for emergency situations
      const immediateAlerts = alerts.filter(a => a.riskLevel === 'immediate');
      setEmergencyMode(immediateAlerts.length > 0);
      
      if (alerts.length > 0) {
        fetchTeamStatus();
        calculateStatistics(alerts);
      }
      
      setLoading(false);
    }, (error) => {
      console.error('Error fetching active alerts:', error);
      setLoading(false);
    });

    // Subscribe to team status
    const teamQuery = query(
      collection(db, 'crisis_professionals'),
      orderBy('role')
    );

    const unsubscribeTeam = onSnapshot(teamQuery, (snapshot) => {
      const team = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastResponse: doc.data().lastResponse?.toDate()
      })) as ProfessionalTeamMember[];

      setTeamMembers(team);
    });

    return () => {
      unsubscribeAlerts();
      unsubscribeTeam();
    };
  }, []);

  // ===== HELPER FUNCTIONS =====

  const fetchTeamStatus = useCallback(async () => {
    // This would fetch current team availability status
    // For now, using mock data
  }, []);

  const calculateStatistics = useCallback((alerts: CrisisAlert[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAlerts = alerts.filter(alert => 
      alert.timestamp >= today
    );

    const stats: CrisisStatistics = {
      today: {
        total: todayAlerts.length,
        immediate: todayAlerts.filter(a => a.riskLevel === 'immediate').length,
        high: todayAlerts.filter(a => a.riskLevel === 'high').length,
        moderate: todayAlerts.filter(a => a.riskLevel === 'moderate').length,
        mild: todayAlerts.filter(a => a.riskLevel === 'mild').length,
      },
      averageResponseTime: calculateAverageResponseTime(todayAlerts),
      activeAlerts: alerts.length,
      professionalTeamStatus: {
        available: teamMembers.filter(t => t.status === 'available').length,
        responding: teamMembers.filter(t => t.status === 'responding').length,
        unavailable: teamMembers.filter(t => t.status === 'unavailable').length,
      }
    };

    setStatistics(stats);
  }, [teamMembers]);

  const calculateAverageResponseTime = (alerts: CrisisAlert[]): number => {
    const acknowledgedAlerts = alerts.filter(a => 
      a.response.acknowledged && a.response.responseTime
    );
    
    if (acknowledgedAlerts.length === 0) return 0;
    
    const totalResponseTime = acknowledgedAlerts.reduce((sum, alert) => 
      sum + (alert.response.responseTime || 0), 0
    );
    
    return Math.round(totalResponseTime / acknowledgedAlerts.length / 1000 / 60); // Convert to minutes
  };

  const handleAlertAcknowledgment = async (alertId: string) => {
    try {
      // This would call the Firebase function to acknowledge the alert
      console.log('Acknowledging alert:', alertId);
      
      // Update local state optimistically
      setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
      
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const handleManualEscalation = async (alertId: string) => {
    try {
      console.log('Manually escalating alert:', alertId);
      // This would trigger manual escalation
      
    } catch (error) {
      console.error('Error escalating alert:', error);
    }
  };

  // ===== RENDER FUNCTIONS =====

  if (loading) {
    return (
      <div className="crisis-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading crisis monitoring dashboard...</p>
      </div>
    );
  }

  return (
    <div className={`crisis-monitoring-dashboard ${emergencyMode ? 'emergency-mode' : ''}`}>
      {/* Emergency Mode Banner */}
      {emergencyMode && (
        <div className="emergency-banner">
          🚨 EMERGENCY MODE ACTIVE - IMMEDIATE INTERVENTIONS REQUIRED 🚨
        </div>
      )}

      {/* Dashboard Header */}
      <header className="dashboard-header">
        <h1>ALCHM Crisis Monitoring Dashboard</h1>
        <div className="header-stats">
          <div className="stat-chip critical">
            <span className="label">Active Alerts</span>
            <span className="value">{activeAlerts.length}</span>
          </div>
          <div className="stat-chip warning">
            <span className="label">Team Available</span>
            <span className="value">{statistics?.professionalTeamStatus.available || 0}</span>
          </div>
          <div className="stat-chip info">
            <span className="label">Avg Response</span>
            <span className="value">{statistics?.averageResponseTime || 0}m</span>
          </div>
        </div>
        <div className="last-updated">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </header>

      <div className="dashboard-grid">
        {/* Active Crisis Alerts - Priority 1 */}
        <div className="panel critical-alerts">
          <div className="panel-header">
            <h2>🚨 Active Crisis Alerts ({activeAlerts.length})</h2>
            <div className="panel-controls">
              <button className="refresh-btn" onClick={() => window.location.reload()}>
                Refresh
              </button>
            </div>
          </div>
          
          <div className="alerts-container">
            {activeAlerts.length === 0 ? (
              <div className="no-alerts">
                <p>✅ No active crisis alerts</p>
                <p className="subtitle">System monitoring all participants</p>
              </div>
            ) : (
              <div className="alerts-list">
                {activeAlerts.map(alert => (
                  <CrisisAlertCard
                    key={alert.id}
                    alert={alert}
                    onAcknowledge={() => handleAlertAcknowledgment(alert.id)}
                    onEscalate={() => handleManualEscalation(alert.id)}
                    onViewDetails={() => setSelectedAlert(alert)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Professional Team Status */}
        <div className="panel team-status">
          <div className="panel-header">
            <h2>👨‍⚕️ Professional Team Status</h2>
          </div>
          
          <div className="team-grid">
            {teamMembers.map(member => (
              <ProfessionalTeamCard
                key={member.id}
                member={member}
              />
            ))}
          </div>
        </div>

        {/* Crisis Statistics */}
        <div className="panel crisis-statistics">
          <div className="panel-header">
            <h2>📊 Daily Crisis Statistics</h2>
          </div>
          
          {statistics && (
            <div className="statistics-grid">
              <StatisticCard
                title="Total Alerts Today"
                value={statistics.today.total}
                trend="neutral"
              />
              <StatisticCard
                title="Immediate Risk"
                value={statistics.today.immediate}
                trend={statistics.today.immediate > 0 ? 'critical' : 'good'}
              />
              <StatisticCard
                title="High Risk"
                value={statistics.today.high}
                trend={statistics.today.high > 2 ? 'warning' : 'neutral'}
              />
              <StatisticCard
                title="Average Response Time"
                value={`${statistics.averageResponseTime}min`}
                trend={statistics.averageResponseTime < 5 ? 'good' : 'warning'}
              />
            </div>
          )}
        </div>

        {/* Cultural Safety Monitoring */}
        <div className="panel cultural-monitoring">
          <div className="panel-header">
            <h2>🌍 Cultural Safety Monitoring</h2>
          </div>
          
          <div className="cultural-metrics">
            <CulturalMetricDisplay
              alerts={activeAlerts}
              teamMembers={teamMembers}
            />
          </div>
        </div>
      </div>

      {/* Alert Details Modal */}
      {selectedAlert && (
        <AlertDetailsModal
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onAcknowledge={() => {
            handleAlertAcknowledgment(selectedAlert.id);
            setSelectedAlert(null);
          }}
        />
      )}
    </div>
  );
}

// ===== SUB-COMPONENTS =====

function CrisisAlertCard({ 
  alert, 
  onAcknowledge, 
  onEscalate, 
  onViewDetails 
}: {
  alert: CrisisAlert;
  onAcknowledge: () => void;
  onEscalate: () => void;
  onViewDetails: () => void;
}) {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(Date.now() - alert.timestamp.getTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [alert.timestamp]);

  const formatTimeElapsed = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const getRiskLevelClass = (level: string) => {
    switch (level) {
      case 'immediate': return 'risk-immediate';
      case 'high': return 'risk-high';
      case 'moderate': return 'risk-moderate';
      default: return 'risk-mild';
    }
  };

  return (
    <div className={`crisis-alert-card ${getRiskLevelClass(alert.riskLevel)}`}>
      <div className="alert-header">
        <div className="alert-id">
          #{alert.id.substring(0, 8)}
        </div>
        <div className="time-elapsed">
          {formatTimeElapsed(timeElapsed)}
        </div>
        <div className="confidence-badge">
          {Math.round(alert.confidence * 100)}%
        </div>
      </div>

      <div className="alert-body">
        <div className="risk-indicator">
          <span className={`risk-badge ${getRiskLevelClass(alert.riskLevel)}`}>
            {alert.riskLevel.toUpperCase()}
          </span>
        </div>

        <div className="participant-info">
          <strong>Participant:</strong> {alert.participantId.substring(0, 8)}...
        </div>

        {alert.culturalContext.length > 0 && (
          <div className="cultural-context">
            <strong>Cultural Context:</strong>
            <div className="context-tags">
              {alert.culturalContext.map(context => (
                <span key={context} className="context-tag">
                  {context}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="triggers">
          <strong>Triggers:</strong> {alert.triggers.slice(0, 3).join(', ')}
          {alert.triggers.length > 3 && '...'}
        </div>

        <div className="delivery-status">
          <div className="delivery-indicators">
            <span className={`delivery-indicator ${alert.delivery.sms.sent ? 'sent' : 'failed'}`}>
              SMS
            </span>
            <span className={`delivery-indicator ${alert.delivery.mobileApp.sent ? 'sent' : 'failed'}`}>
              App
            </span>
            <span className={`delivery-indicator ${alert.delivery.dashboard.sent ? 'sent' : 'failed'}`}>
              Dashboard
            </span>
          </div>
        </div>
      </div>

      <div className="alert-actions">
        <button 
          className="btn btn-primary acknowledge-btn"
          onClick={onAcknowledge}
        >
          Acknowledge
        </button>
        
        <button 
          className="btn btn-secondary details-btn"
          onClick={onViewDetails}
        >
          Details
        </button>
        
        <button 
          className="btn btn-warning escalate-btn"
          onClick={onEscalate}
        >
          Escalate
        </button>

        <a 
          href={`/crisis-intervention/${alert.id}`}
          className="btn btn-critical respond-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          RESPOND NOW
        </a>
      </div>
    </div>
  );
}

function ProfessionalTeamCard({ member }: { member: ProfessionalTeamMember }) {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'available': return 'status-available';
      case 'responding': return 'status-responding';
      case 'busy': return 'status-busy';
      default: return 'status-unavailable';
    }
  };

  return (
    <div className="professional-card">
      <div className="professional-header">
        <div className="professional-name">{member.name}</div>
        <div className={`status-indicator ${getStatusClass(member.status)}`}>
          {member.status}
        </div>
      </div>
      
      <div className="professional-details">
        <div className="role">{member.role.replace('_', ' ')}</div>
        <div className="current-cases">
          Cases: {member.currentCases}
        </div>
        
        {member.culturalCompetencies.length > 0 && (
          <div className="competencies">
            <div className="competency-tags">
              {member.culturalCompetencies.slice(0, 3).map(comp => (
                <span key={comp} className="competency-tag">
                  {comp}
                </span>
              ))}
              {member.culturalCompetencies.length > 3 && (
                <span className="competency-tag more">
                  +{member.culturalCompetencies.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatisticCard({ 
  title, 
  value, 
  trend 
}: { 
  title: string; 
  value: number | string; 
  trend: 'good' | 'warning' | 'critical' | 'neutral' 
}) {
  return (
    <div className={`statistic-card trend-${trend}`}>
      <div className="statistic-title">{title}</div>
      <div className="statistic-value">{value}</div>
    </div>
  );
}

function CulturalMetricDisplay({ 
  alerts, 
  teamMembers 
}: { 
  alerts: CrisisAlert[]; 
  teamMembers: ProfessionalTeamMember[] 
}) {
  const culturalBreakdown = alerts.reduce((breakdown, alert) => {
    alert.culturalContext.forEach(context => {
      breakdown[context] = (breakdown[context] || 0) + 1;
    });
    return breakdown;
  }, {} as Record<string, number>);

  return (
    <div className="cultural-metrics">
      <div className="cultural-breakdown">
        <h4>Alert Distribution by Cultural Context</h4>
        {Object.entries(culturalBreakdown).map(([context, count]) => (
          <div key={context} className="cultural-metric">
            <span className="context-label">{context}</span>
            <span className="context-count">{count}</span>
          </div>
        ))}
      </div>
      
      <div className="team-competencies">
        <h4>Team Cultural Competencies</h4>
        <div className="competency-coverage">
          {['lgbtq+', 'bipoc', 'youth', 'immigrant', 'veterans'].map(competency => {
            const availableExperts = teamMembers.filter(member => 
              member.culturalCompetencies.includes(competency) && 
              member.status === 'available'
            ).length;
            
            return (
              <div key={competency} className="competency-coverage-item">
                <span className="competency-name">{competency}</span>
                <span className={`expert-count ${availableExperts > 0 ? 'covered' : 'uncovered'}`}>
                  {availableExperts} available
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AlertDetailsModal({ 
  alert, 
  onClose, 
  onAcknowledge 
}: { 
  alert: CrisisAlert; 
  onClose: () => void; 
  onAcknowledge: () => void 
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="alert-details-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Crisis Alert Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="alert-overview">
            <div className="overview-grid">
              <div className="detail-item">
                <label>Alert ID:</label>
                <span>{alert.id}</span>
              </div>
              <div className="detail-item">
                <label>Risk Level:</label>
                <span className={`risk-badge ${alert.riskLevel}`}>{alert.riskLevel}</span>
              </div>
              <div className="detail-item">
                <label>Confidence:</label>
                <span>{Math.round(alert.confidence * 100)}%</span>
              </div>
              <div className="detail-item">
                <label>Timestamp:</label>
                <span>{alert.timestamp.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="triggers-section">
            <h3>Crisis Triggers</h3>
            <ul className="triggers-list">
              {alert.triggers.map((trigger, index) => (
                <li key={index}>{trigger}</li>
              ))}
            </ul>
          </div>

          {alert.culturalContext.length > 0 && (
            <div className="cultural-section">
              <h3>Cultural Context</h3>
              <div className="cultural-tags">
                {alert.culturalContext.map(context => (
                  <span key={context} className="cultural-tag">{context}</span>
                ))}
              </div>
            </div>
          )}

          <div className="delivery-section">
            <h3>Delivery Status</h3>
            <div className="delivery-details">
              <div className="delivery-channel">
                <span className="channel-name">SMS:</span>
                <span className={`status ${alert.delivery.sms.sent ? 'success' : 'failed'}`}>
                  {alert.delivery.sms.sent ? 'Delivered' : 'Failed'}
                </span>
                {alert.delivery.sms.sentAt && (
                  <span className="delivery-time">
                    {alert.delivery.sms.sentAt.toLocaleTimeString()}
                  </span>
                )}
              </div>
              <div className="delivery-channel">
                <span className="channel-name">Mobile App:</span>
                <span className={`status ${alert.delivery.mobileApp.sent ? 'success' : 'failed'}`}>
                  {alert.delivery.mobileApp.sent ? 'Delivered' : 'Failed'}
                </span>
              </div>
              <div className="delivery-channel">
                <span className="channel-name">Dashboard:</span>
                <span className={`status ${alert.delivery.dashboard.sent ? 'success' : 'failed'}`}>
                  {alert.delivery.dashboard.sent ? 'Delivered' : 'Failed'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-actions">
          <button className="btn btn-primary" onClick={onAcknowledge}>
            Acknowledge Alert
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <a 
            href={`/crisis-intervention/${alert.id}`}
            className="btn btn-critical"
            target="_blank"
          >
            Begin Intervention
          </a>
        </div>
      </div>
    </div>
  );
}