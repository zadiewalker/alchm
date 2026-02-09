'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Users, Phone, Clock, TrendingUp, Activity, Heart } from 'lucide-react';
import { crisisMonitoring, CrisisNotification } from '@/lib/crisisMonitoring';

interface CrisisDashboardProps {
  userId: string;
}

interface CrisisStats {
  totalAssessments: number;
  highRiskAlerts: number;
  interventionsTriggered: number;
  safetyPlanUpdated: Date | null;
  lastCrisisCheck: Date | null;
}

export default function CrisisDashboard({ userId }: CrisisDashboardProps) {
  const [notifications, setNotifications] = useState<CrisisNotification[]>([]);
  const [stats, setStats] = useState<CrisisStats>({
    totalAssessments: 0,
    highRiskAlerts: 0,
    interventionsTriggered: 0,
    safetyPlanUpdated: null,
    lastCrisisCheck: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to crisis notifications
    const unsubscribe = crisisMonitoring.subscribeToNotifications(userId, (notifs) => {
      setNotifications(notifs);
      
      // Update stats from notifications
      setStats(prev => ({
        ...prev,
        highRiskAlerts: notifs.filter(n => n.riskLevel === 'high' || n.riskLevel === 'critical').length,
        interventionsTriggered: notifs.length,
        lastCrisisCheck: notifs.length > 0 ? notifs[0].timestamp?.toDate() : null
      }));
      
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'text-red-300 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-300 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-300 bg-yellow-500/20 border-yellow-500/30';
      default: return 'text-blue-300 bg-blue-500/20 border-blue-500/30';
    }
  };

  const getRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <Clock className="w-4 h-4" />;
      default: return <Heart className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
          <div className="animate-pulse">
            <div className="h-6 bg-white/20 rounded mb-4"></div>
            <div className="h-4 bg-white/20 rounded mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-white text-2xl font-light mb-2">Crisis Support Dashboard</h2>
        <p className="text-white/70 text-sm leading-relaxed">
          Monitoring your wellbeing and providing support when needed
        </p>
      </div>

      {/* Current Status */}
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-medium">Current Status</h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-300 text-sm">Monitoring Active</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 rounded-2xl p-4">
            <div className="text-white/60 text-xs uppercase tracking-wide mb-1">Last Check</div>
            <div className="text-white text-sm">
              {stats.lastCrisisCheck 
                ? stats.lastCrisisCheck.toLocaleDateString()
                : 'No checks yet'
              }
            </div>
          </div>
          <div className="bg-white/10 rounded-2xl p-4">
            <div className="text-white/60 text-xs uppercase tracking-wide mb-1">Safety Plan</div>
            <div className="text-white text-sm">
              {stats.safetyPlanUpdated ? 'Updated' : 'Not created'}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h4 className="text-white/60 text-sm uppercase tracking-wide">Quick Support</h4>
          
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => window.open('tel:988', '_self')}
              className="bg-red-500/30 hover:bg-red-500/40 text-red-200 p-4 rounded-xl transition-colors flex items-center"
            >
              <Phone className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Crisis Lifeline: 988</div>
                <div className="text-sm opacity-80">24/7 immediate support</div>
              </div>
            </button>

            <button
              onClick={() => window.open('sms:741741?body=HOME', '_self')}
              className="bg-blue-500/30 hover:bg-blue-500/40 text-blue-200 p-4 rounded-xl transition-colors flex items-center"
            >
              <Activity className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Crisis Text Line</div>
                <div className="text-sm opacity-80">Text HOME to 741741</div>
              </div>
            </button>

            <button
              onClick={() => {
                console.log("Opening safety plan builder");
                console.log('Open safety plan builder');
              }}
              className="bg-green-500/30 hover:bg-green-500/40 text-green-200 p-4 rounded-xl transition-colors flex items-center"
            >
              <Shield className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Update Safety Plan</div>
                <div className="text-sm opacity-80">Prepare for difficult moments</div>
              </div>
            </button>

            <button
              onClick={() => {
                console.log("Opening community support");
                console.log('Navigate to community');
              }}
              className="bg-purple-500/30 hover:bg-purple-500/40 text-purple-200 p-4 rounded-xl transition-colors flex items-center"
            >
              <Users className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Community Support</div>
                <div className="text-sm opacity-80">Connect with peer support</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {notifications.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
          <h3 className="text-white text-lg font-medium mb-4">Recent Support Activity</h3>
          
          <div className="space-y-3">
            {notifications.slice(0, 5).map((notification) => (
              <div
                key={notification.id}
                className={`rounded-2xl p-4 border ${getRiskLevelColor(notification.riskLevel)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getRiskLevelIcon(notification.riskLevel)}
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium mb-1">
                        Support Check-in
                      </div>
                      <p className="text-white/80 text-sm mb-2">
                        {notification.message}
                      </p>
                      <div className="text-white/60 text-xs">
                        {notification.timestamp?.toDate?.()?.toLocaleString() || 'Recently'}
                      </div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    notification.riskLevel === 'critical' ? 'bg-red-500/30 text-red-300' :
                    notification.riskLevel === 'high' ? 'bg-orange-500/30 text-orange-300' :
                    notification.riskLevel === 'medium' ? 'bg-yellow-500/30 text-yellow-300' :
                    'bg-blue-500/30 text-blue-300'
                  }`}>
                    {notification.riskLevel}
                  </div>
                </div>

                {notification.resources && notification.resources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <h4 className="text-white/70 text-xs uppercase tracking-wide mb-2">
                      Recommended Resources
                    </h4>
                    <div className="space-y-2">
                      {notification.resources.slice(0, 2).map((resource, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-white/80 text-sm">{resource.name}</span>
                          {resource.phone && (
                            <button
                              onClick={() => window.open(`tel:${resource.phone}`, '_self')}
                              className="text-white/60 hover:text-white text-xs underline"
                            >
                              Call
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {notifications.length > 5 && (
            <div className="text-center mt-4">
              <button className="text-white/60 hover:text-white text-sm underline">
                View All Activity
              </button>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
        <h3 className="text-white text-lg font-medium mb-4">Wellbeing Overview</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-2xl p-4 text-center">
            <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-white/60 text-xs uppercase tracking-wide mb-1">
              Support Events
            </div>
            <div className="text-white text-2xl font-light">
              {stats.interventionsTriggered}
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 text-center">
            <Shield className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-white/60 text-xs uppercase tracking-wide mb-1">
              Monitoring Days
            </div>
            <div className="text-white text-2xl font-light">
              {stats.lastCrisisCheck 
                ? Math.max(0, Math.ceil((new Date().getTime() - stats.lastCrisisCheck.getTime()) / (1000 * 60 * 60 * 24)))
                : 0
              }
            </div>
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
        <h3 className="text-white text-lg font-medium mb-4">Understanding Crisis Support</h3>
        
        <div className="space-y-4 text-white/80 text-sm leading-relaxed">
          <div>
            <h4 className="text-white text-sm font-medium mb-2">How It Works</h4>
            <p>
              Our AI-powered system continuously monitors your journal entries and interactions 
              for signs that you might be struggling. This helps us provide timely support 
              and resources exactly when you need them most.
            </p>
          </div>
          
          <div>
            <h4 className="text-white text-sm font-medium mb-2">Your Privacy</h4>
            <p>
              All crisis assessments are conducted with the highest privacy standards. 
              Your data is encrypted and only used to provide you with appropriate support 
              and resources.
            </p>
          </div>
          
          <div>
            <h4 className="text-white text-sm font-medium mb-2">Getting Help</h4>
            <p>
              If you're in immediate danger, please call 911. For crisis support, 
              call 988 or text HOME to 741741. These services are free, confidential, 
              and available 24/7.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}