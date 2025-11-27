'use client'

import React, { useState, useEffect } from 'react'
import { getDb } from '@/lib/firebase'
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, addDoc, Timestamp, type Firestore } from 'firebase/firestore'

// ===== PROFESSIONAL TEAM MOBILE ALERT SYSTEM =====
// Real-time mobile notifications for crisis counselors

interface CrisisAlert {
  id: string
  participantId: string
  riskLevel: 'HIGH' | 'CRITICAL' | 'EXTREME'
  culturalContext: string[]
  triggerIndicators: string[]
  timestamp: Timestamp
  status: 'new' | 'acknowledged' | 'responding' | 'resolved'
  assignedProfessional?: string
  responseTime?: number
  escalationLevel: number
}

interface ProfessionalTeamMember {
  id: string
  name: string
  role: string
  culturalCompetencies: string[]
  contactMethods: {
    primaryPhone: string
    backupPhone?: string
    fcmToken?: string
    email: string
  }
  availability: {
    currentStatus: 'available' | 'busy' | 'offline'
    maxConcurrentCases: number
    currentCaseCount: number
  }
}

export default function MobileAlertSystem() {
  const [alerts, setAlerts] = useState<CrisisAlert[]>([])
  const [teamMembers, setTeamMembers] = useState<ProfessionalTeamMember[]>([])
  const [isOnline, setIsOnline] = useState(true)
  const [fcmToken, setFCMToken] = useState<string | null>(null)
  const [professionalId, setProfessionalId] = useState<string | null>(null)
  const [db, setDb] = useState<Firestore | null>(null)

  // Initialize Firebase and FCM for mobile notifications
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        const firestore = await getDb()
        setDb(firestore)
      } catch (error) {
        console.error('Failed to initialize Firebase:', error)
      }
    }
    
    initializeFirebase()
    initializeFCM()
  }, [])

  // Subscribe to real-time crisis alerts
  useEffect(() => {
    if (!professionalId || !db) return

    const alertsQuery = query(
      collection(db, 'crisis_alerts'),
      where('status', 'in', ['new', 'acknowledged']),
      orderBy('timestamp', 'desc')
    )

    const unsubscribe = onSnapshot(alertsQuery, (snapshot) => {
      const alertData: CrisisAlert[] = []
      
      snapshot.forEach((doc) => {
        const data = doc.data()
        alertData.push({
          id: doc.id,
          ...data
        } as CrisisAlert)
      })

      setAlerts(alertData)
      
      // Play alert sound for new critical alerts
      const newCriticalAlerts = alertData.filter(
        alert => alert.riskLevel === 'CRITICAL' || alert.riskLevel === 'EXTREME'
      )
      
      if (newCriticalAlerts.length > 0) {
        playAlertSound()
        vibrateMobile()
      }
    })

    return () => unsubscribe()
  }, [professionalId, db])

  const initializeFCM = async () => {
    try {
      // Request notification permissions
      if ('Notification' in window && 'serviceWorker' in navigator) {
        const permission = await Notification.requestPermission()
        
        if (permission === 'granted') {
          // Register service worker for FCM
          await navigator.serviceWorker.register('/firebase-messaging-sw.js')
          
          // Get FCM token (implementation depends on Firebase SDK setup)
          const token = await getFCMToken()
          setFCMToken(token)
          
          if (professionalId && token) {
            await updateProfessionalFCMToken(professionalId, token)
          }
        }
      }
    } catch (error) {
      console.error('FCM initialization failed:', error)
    }
  }

  const getFCMToken = async (): Promise<string | null> => {
    // Placeholder for actual FCM token retrieval
    // Would use Firebase Messaging SDK: messaging.getToken()
    return 'fcm-token-placeholder'
  }

  const updateProfessionalFCMToken = async (professionalId: string, token: string) => {
    if (!db) return
    
    try {
      await updateDoc(doc(db, 'crisis_professionals', professionalId), {
        'contactMethods.fcmToken': token,
        lastFCMUpdate: Timestamp.now()
      })
    } catch (error) {
      console.error('Failed to update FCM token:', error)
    }
  }

  const acknowledgeAlert = async (alertId: string) => {
    if (!db) return
    
    try {
      await updateDoc(doc(db, 'crisis_alerts', alertId), {
        status: 'acknowledged',
        assignedProfessional: professionalId,
        acknowledgedAt: Timestamp.now(),
        responseTime: Date.now() - alerts.find(a => a.id === alertId)?.timestamp.toMillis()!
      })

      // Log acknowledgment for analytics
      await addDoc(collection(db, 'crisis_response_logs'), {
        alertId,
        professionalId,
        action: 'acknowledged',
        timestamp: Timestamp.now(),
        responseTimeMs: Date.now() - alerts.find(a => a.id === alertId)?.timestamp.toMillis()!
      })
    } catch (error) {
      console.error('Failed to acknowledge alert:', error)
    }
  }

  const respondToAlert = async (alertId: string) => {
    if (!db) return
    
    try {
      await updateDoc(doc(db, 'crisis_alerts', alertId), {
        status: 'responding',
        respondingAt: Timestamp.now()
      })

      // Update professional availability
      if (professionalId) {
        const professional = teamMembers.find(m => m.id === professionalId)
        if (professional) {
          await updateDoc(doc(db, 'crisis_professionals', professionalId), {
            'availability.currentCaseCount': professional.availability.currentCaseCount + 1
          })
        }
      }
    } catch (error) {
      console.error('Failed to respond to alert:', error)
    }
  }

  const playAlertSound = () => {
    try {
      // Create audio context for emergency alert sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Generate emergency tone (440Hz + 880Hz for urgency)
      const oscillator1 = audioContext.createOscillator()
      const oscillator2 = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator1.frequency.setValueAtTime(440, audioContext.currentTime)
      oscillator2.frequency.setValueAtTime(880, audioContext.currentTime)
      
      oscillator1.connect(gainNode)
      oscillator2.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      
      oscillator1.start(audioContext.currentTime)
      oscillator2.start(audioContext.currentTime)
      
      oscillator1.stop(audioContext.currentTime + 1.5)
      oscillator2.stop(audioContext.currentTime + 1.5)
    } catch (error) {
      console.error('Failed to play alert sound:', error)
    }
  }

  const vibrateMobile = () => {
    if ('vibrate' in navigator) {
      // Crisis alert vibration pattern: long-short-long-short
      navigator.vibrate([500, 100, 500, 100, 500])
    }
  }

  const formatTimeAgo = (timestamp: Timestamp) => {
    const now = Date.now()
    const alertTime = timestamp.toMillis()
    const diffMinutes = Math.floor((now - alertTime) / (1000 * 60))
    
    if (diffMinutes < 1) return 'Just now'
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    return `${Math.floor(diffMinutes / 60)}h ago`
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'EXTREME': return 'bg-red-900 text-white'
      case 'CRITICAL': return 'bg-red-600 text-white'
      case 'HIGH': return 'bg-orange-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  return (
    <div className="mobile-alert-system min-h-screen bg-gray-50 font-sans">
      {/* Emergency Status Header */}
      <div className="sticky top-0 z-50 bg-white border-b-2 border-red-500 shadow-lg">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
            <h1 className="text-xl font-medium text-gray-900">Crisis Alert System</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">
              {alerts.length} Active Alerts
            </span>
            {alerts.filter(a => a.riskLevel === 'EXTREME').length > 0 && (
              <div className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                EXTREME
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Alerts List */}
      <div className="p-4 space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">✓ All Clear</div>
            <p className="text-gray-600">No active crisis alerts</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="crisis-alert-card bg-white rounded-lg shadow-md border-l-4 border-red-500">
              <div className="p-4">
                {/* Alert Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(alert.riskLevel)}`}>
                      {alert.riskLevel}
                    </span>
                    <span className="text-xs text-gray-500">
                      ID: {alert.participantId.substring(0, 8)}...
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 font-mono">
                    {formatTimeAgo(alert.timestamp)}
                  </span>
                </div>

                {/* Cultural Context */}
                {alert.culturalContext.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-1">Cultural Context:</p>
                    <div className="flex flex-wrap gap-1">
                      {alert.culturalContext.map((context, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {context}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trigger Indicators */}
                <div className="mb-4">
                  <p className="text-xs text-gray-600 mb-1">Crisis Indicators:</p>
                  <div className="flex flex-wrap gap-1">
                    {alert.triggerIndicators.map((indicator, idx) => (
                      <span key={idx} className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                        {indicator}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {alert.status === 'new' && (
                    <>
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
                      >
                        🔔 Acknowledge (2min)
                      </button>
                      <button
                        onClick={() => respondToAlert(alert.id)}
                        className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium text-sm hover:bg-green-700 transition-colors"
                      >
                        🚨 Respond Now
                      </button>
                    </>
                  )}
                  
                  {alert.status === 'acknowledged' && (
                    <button
                      onClick={() => respondToAlert(alert.id)}
                      className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium text-sm hover:bg-green-700 transition-colors animate-pulse"
                    >
                      🚨 Begin Response
                    </button>
                  )}
                  
                  {alert.status === 'responding' && (
                    <div className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg text-center font-medium text-sm">
                      ⏳ Response In Progress
                    </div>
                  )}
                </div>

                {/* Escalation Warning */}
                {alert.escalationLevel > 1 && (
                  <div className="mt-3 bg-yellow-100 border border-yellow-400 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <span className="text-lg">⚠️</span>
                      <span className="font-medium text-sm">
                        Escalation Level {alert.escalationLevel}
                      </span>
                    </div>
                    <p className="text-xs text-yellow-700 mt-1">
                      This alert has been escalated due to response time
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Access Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="flex items-center justify-around p-4">
          <button className="flex flex-col items-center gap-1 text-blue-600">
            <span className="text-xl">📊</span>
            <span className="text-xs font-medium">Dashboard</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-green-600">
            <span className="text-xl">📞</span>
            <span className="text-xs font-medium">Call Backup</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-purple-600">
            <span className="text-xl">👥</span>
            <span className="text-xs font-medium">Team Status</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-orange-600">
            <span className="text-xl">📋</span>
            <span className="text-xs font-medium">Resources</span>
          </button>
        </div>
      </div>
    </div>
  )
}