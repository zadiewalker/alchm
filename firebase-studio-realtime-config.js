// Firebase Studio Real-time Features for Mental Health Platform
// Advanced real-time capabilities with privacy protection

const REALTIME_DATABASE_RULES = `
{
  "rules": {
    // Crisis alert system - real-time professional notifications
    "crisis_alerts": {
      ".read": "auth.token.role == 'crisis_professional' || auth.token.role == 'admin'",
      ".write": "auth.token.role == 'system' || auth.token.role == 'admin'",
      "$alertId": {
        ".validate": "newData.hasChildren(['riskLevel', 'timestamp', 'professionalId'])",
        "riskLevel": {
          ".validate": "newData.isString() && (newData.val() == 'immediate' || newData.val() == 'high' || newData.val() == 'moderate')"
        },
        "timestamp": {
          ".validate": "newData.isNumber()"
        },
        "acknowledged": {
          ".write": "auth.token.role == 'crisis_professional' && data.child('assignedTo').val() == auth.uid"
        }
      }
    },

    // Professional dashboard - real-time updates
    "professional_dashboard": {
      "$professionalId": {
        ".read": "auth.uid == $professionalId || auth.token.role == 'admin'",
        ".write": "auth.uid == $professionalId || auth.token.role == 'system'",
        "active_cases": {
          ".validate": "newData.isNumber() && newData.val() >= 0"
        },
        "availability_status": {
          ".validate": "newData.isString() && (newData.val() == 'available' || newData.val() == 'busy' || newData.val() == 'off_duty')"
        },
        "last_seen": {
          ".validate": "newData.isNumber()"
        }
      }
    },

    // Anonymous community spaces - real-time peer support
    "community_spaces": {
      "$spaceId": {
        ".read": "auth != null",
        "messages": {
          "$messageId": {
            ".write": "auth != null && (!data.exists() || data.child('authorId').val() == auth.uid)",
            ".validate": "newData.hasChildren(['content', 'timestamp']) && newData.child('content').val().length <= 500",
            "content": {
              ".validate": "newData.isString()"
            },
            "timestamp": {
              ".validate": "newData.isNumber()"
            },
            "authorAlias": {
              ".validate": "newData.isString() && newData.val().matches(/^User[★⚡🌟][a-zA-Z0-9]{4}$/)"
            },
            // No personal identifiers allowed in community
            "authorId": {
              ".validate": "false"
            }
          }
        },
        "moderation": {
          ".read": "auth.token.role == 'moderator' || auth.token.role == 'admin'",
          ".write": "auth.token.role == 'moderator' || auth.token.role == 'admin'"
        }
      }
    },

    // Real-time wellness check-ins (privacy-protected)
    "wellness_checkins": {
      "$userId": {
        ".read": "auth.uid == $userId",
        ".write": "auth.uid == $userId",
        "current_mood": {
          ".validate": "newData.isNumber() && newData.val() >= 1 && newData.val() <= 10"
        },
        "support_needed": {
          ".validate": "newData.isBoolean()"
        },
        "last_checkin": {
          ".validate": "newData.isNumber()"
        },
        // Crisis detection without storing content
        "crisis_indicators": {
          ".write": "auth.token.role == 'system'",
          ".validate": "newData.hasChildren(['level', 'timestamp'])"
        }
      }
    },

    // Real-time therapy session management
    "therapy_sessions": {
      "$sessionId": {
        ".read": "auth.token.therapist_sessions && auth.token.therapist_sessions[auth.uid].indexOf($sessionId) >= 0 || auth.token.client_sessions && auth.token.client_sessions[auth.uid].indexOf($sessionId) >= 0",
        ".write": "auth.token.therapist_sessions && auth.token.therapist_sessions[auth.uid].indexOf($sessionId) >= 0",
        "status": {
          ".validate": "newData.isString() && (newData.val() == 'scheduled' || newData.val() == 'active' || newData.val() == 'completed' || newData.val() == 'cancelled')"
        },
        "participants": {
          "$participantId": {
            "presence": {
              ".validate": "newData.isString() && (newData.val() == 'online' || newData.val() == 'offline')"
            },
            "last_seen": {
              ".validate": "newData.isNumber()"
            }
          }
        }
      }
    },

    // Emergency contact system
    "emergency_contacts": {
      "$userId": {
        ".read": "auth.uid == $userId || auth.token.role == 'crisis_professional'",
        ".write": "auth.uid == $userId",
        "$contactId": {
          ".validate": "newData.hasChildren(['phone', 'relationship']) && newData.child('phone').val().matches(/^\\+[1-9]\\d{1,14}$/)",
          "relationship": {
            ".validate": "newData.isString() && newData.val().length <= 50"
          },
          "consent_given": {
            ".validate": "newData.isBoolean()"
          }
        }
      }
    },

    // Real-time location-based crisis resources
    "crisis_resources": {
      ".read": "auth != null",
      "$region": {
        "$resourceType": {
          "hotlines": {
            "$hotlineId": {
              "number": true,
              "availability": true,
              "languages": true,
              "specializations": true
            }
          },
          "locations": {
            "$locationId": {
              "address": true,
              "services": true,
              "hours": true,
              "accessibility": true
            }
          }
        }
      }
    },

    // System health monitoring
    "system_health": {
      ".read": "auth.token.role == 'admin'",
      ".write": "auth.token.role == 'system'",
      "crisis_system": {
        "status": true,
        "response_time": true,
        "last_health_check": true
      },
      "ai_processing": {
        "queue_length": true,
        "processing_time": true,
        "error_rate": true
      }
    }
  }
}`;

// Real-time Firebase Functions for mental health features
const REALTIME_FUNCTIONS = {
  // Crisis alert distribution
  crisisAlertDistribution: {
    trigger: 'realtime_database',
    path: '/crisis_alerts/{alertId}',
    event: 'written',
    function: `
      exports.crisisAlertDistribution = functions.database.ref('/crisis_alerts/{alertId}')
        .onWrite(async (change, context) => {
          const alert = change.after.val();
          const alertId = context.params.alertId;
          
          if (!alert) return; // Alert deleted
          
          // Get available crisis professionals
          const professionalsRef = admin.database().ref('professional_dashboard');
          const availableProfessionals = await professionalsRef
            .orderByChild('availability_status')
            .equalTo('available')
            .once('value');
            
          const notifications = [];
          
          availableProfessionals.forEach(snapshot => {
            const professional = snapshot.val();
            const professionalId = snapshot.key;
            
            // Check cultural competency match
            const isMatch = checkCulturalCompetency(alert.culturalContext, professional.competencies);
            
            if (isMatch || alert.riskLevel === 'immediate') {
              notifications.push(
                sendProfessionalNotification(professionalId, alert)
              );
            }
          });
          
          await Promise.all(notifications);
          
          // Update alert status
          await change.after.ref.child('notifications_sent').set({
            count: notifications.length,
            timestamp: admin.database.ServerValue.TIMESTAMP
          });
        });
    `
  },

  // Real-time community moderation
  communityModeration: {
    trigger: 'realtime_database',
    path: '/community_spaces/{spaceId}/messages/{messageId}',
    event: 'created',
    function: `
      exports.communityModeration = functions.database.ref('/community_spaces/{spaceId}/messages/{messageId}')
        .onCreate(async (snapshot, context) => {
          const message = snapshot.val();
          const spaceId = context.params.spaceId;
          const messageId = context.params.messageId;
          
          // AI-powered content moderation
          const moderationResult = await moderateContent(message.content);
          
          if (moderationResult.flagged) {
            // Remove harmful content immediately
            await snapshot.ref.remove();
            
            // Log moderation action
            await admin.database().ref(\`community_spaces/\${spaceId}/moderation/\${messageId}\`).set({
              action: 'removed',
              reason: moderationResult.reason,
              timestamp: admin.database.ServerValue.TIMESTAMP,
              originalContent: '[CONTENT REMOVED]'
            });
            
            // Alert human moderators for review
            if (moderationResult.severity === 'high') {
              await alertModerators(spaceId, messageId, moderationResult);
            }
          } else {
            // Mark as approved
            await snapshot.ref.child('moderated').set(true);
          }
        });
    `
  },

  // Presence system for therapy sessions
  therapyPresenceSystem: {
    trigger: 'realtime_database',
    path: '/therapy_sessions/{sessionId}/participants/{participantId}/presence',
    event: 'written',
    function: `
      exports.therapyPresenceSystem = functions.database.ref('/therapy_sessions/{sessionId}/participants/{participantId}/presence')
        .onWrite(async (change, context) => {
          const presence = change.after.val();
          const sessionId = context.params.sessionId;
          const participantId = context.params.participantId;
          
          if (presence === 'online') {
            // Update last seen
            await change.after.ref.parent.child('last_seen').set(admin.database.ServerValue.TIMESTAMP);
            
            // Check if session should start
            const sessionRef = admin.database().ref(\`therapy_sessions/\${sessionId}\`);
            const session = await sessionRef.once('value');
            const sessionData = session.val();
            
            if (sessionData && sessionData.status === 'scheduled') {
              const participants = sessionData.participants || {};
              const onlineCount = Object.values(participants).filter(p => p.presence === 'online').length;
              
              // Start session if all participants are online
              if (onlineCount === Object.keys(participants).length) {
                await sessionRef.child('status').set('active');
                await sessionRef.child('started_at').set(admin.database.ServerValue.TIMESTAMP);
              }
            }
          }
        });
    `
  },

  // Real-time wellness monitoring
  wellnessMonitoring: {
    trigger: 'realtime_database',
    path: '/wellness_checkins/{userId}',
    event: 'written',
    function: `
      exports.wellnessMonitoring = functions.database.ref('/wellness_checkins/{userId}')
        .onWrite(async (change, context) => {
          const checkin = change.after.val();
          const userId = context.params.userId;
          
          if (!checkin) return;
          
          // Analyze wellness trends
          const riskScore = calculateWellnessRisk(checkin);
          
          if (riskScore > 0.7) {
            // High risk detected - initiate gentle intervention
            await admin.database().ref(\`wellness_checkins/\${userId}/crisis_indicators\`).set({
              level: 'moderate',
              timestamp: admin.database.ServerValue.TIMESTAMP,
              intervention_triggered: true
            });
            
            // Offer immediate support resources
            await offerImmediateSupport(userId, riskScore);
          } else if (riskScore > 0.4) {
            // Moderate concern - provide resources
            await admin.database().ref(\`wellness_checkins/\${userId}/support_resources\`).set({
              recommended: true,
              timestamp: admin.database.ServerValue.TIMESTAMP
            });
          }
        });
    `
  }
};

// Real-time security configuration
const REALTIME_SECURITY = {
  // Connection limits to prevent abuse
  connectionLimits: {
    maxConcurrentConnections: 10,
    rateLimitPerMinute: 100,
    timeoutAfterInactivity: 300000 // 5 minutes
  },
  
  // Real-time data validation
  dataValidation: {
    maxMessageSize: 1024, // 1KB
    allowedCharacters: /^[a-zA-Z0-9\s\u00C0-\u017F\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff.,!?;:()"'`~@#$%^&*+=\-_{}[\]|\\/<>]*$/,
    profanityFilter: true,
    spamDetection: true
  },
  
  // Privacy protection
  privacyProtection: {
    anonymizeConnections: true,
    encryptSensitiveData: true,
    autoExpireMessages: 86400000, // 24 hours
    logAccessForAudit: true
  }
};

// Real-time analytics configuration
const REALTIME_ANALYTICS = {
  // System performance metrics
  performance: {
    connectionCount: true,
    messageLatency: true,
    errorRate: true,
    throughput: true
  },
  
  // Mental health specific metrics
  mentalHealth: {
    crisisResponseTime: true,
    professionalAvailability: true,
    communityEngagement: true,
    wellnessCheckInFrequency: true
  },
  
  // Privacy-preserving analytics
  privacy: {
    aggregateOnly: true,
    noPersonalIdentifiers: true,
    automaticAnonymization: true,
    dataRetentionLimits: true
  }
};

module.exports = {
  REALTIME_DATABASE_RULES,
  REALTIME_FUNCTIONS,
  REALTIME_SECURITY,
  REALTIME_ANALYTICS
};