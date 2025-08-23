// Scalable Real-Time Architecture for 1M+ Concurrent Users
// Problem: Firestore listeners don't scale to millions
// Solution: WebSocket + Pub/Sub hybrid with intelligent batching

import { db } from '@/lib/firebaseAdmin';
import { logger } from '@/lib/logging';

export interface ScalableRealTime {
  premium: 'WebSocketDirect';     // High-value users get instant updates
  standard: 'PubSubBatched';      // Standard users get batched updates every 5 seconds  
  dormant: 'EmailDigest';         // Low-activity users get hourly summaries
}

export interface ConnectionStrategy {
  type: 'websocket' | 'pubsub' | 'polling' | 'digest';
  heartbeatInterval: number;      // milliseconds
  batchSize: number;              // messages per batch
  priority: number;               // 1-5 (1 = highest)
  maxConnections: number;         // per instance
}

export interface UserTier {
  tier: 'premium' | 'standard' | 'dormant';
  activity: 'high' | 'medium' | 'low';
  lastActiveDate: Date;
  entriesPerWeek: number;
  realtimePreference: boolean;
}

export interface RealTimeMessage {
  id: string;
  userId: string;
  type: 'insight' | 'mood_update' | 'celebration' | 'notification' | 'system';
  data: any;
  timestamp: number;
  priority: number;
  expiresAt?: number;
}

export interface BatchUpdate {
  userId: string;
  messages: RealTimeMessage[];
  batchId: string;
  createdAt: number;
  deliveredAt?: number;
}

// Connection strategies based on user tier and activity
const CONNECTION_STRATEGIES: Record<string, ConnectionStrategy> = {
  premium_high: {
    type: 'websocket',
    heartbeatInterval: 10000,  // 10 seconds
    batchSize: 1,              // Immediate delivery
    priority: 1,
    maxConnections: 10000      // Per instance
  },
  premium_medium: {
    type: 'websocket',
    heartbeatInterval: 30000,  // 30 seconds
    batchSize: 3,
    priority: 2,
    maxConnections: 20000
  },
  standard_high: {
    type: 'pubsub',
    heartbeatInterval: 30000,  // 30 seconds
    batchSize: 5,
    priority: 3,
    maxConnections: 50000
  },
  standard_medium: {
    type: 'pubsub',
    heartbeatInterval: 60000,  // 1 minute
    batchSize: 10,
    priority: 4,
    maxConnections: 100000
  },
  standard_low: {
    type: 'polling',
    heartbeatInterval: 300000, // 5 minutes
    batchSize: 20,
    priority: 5,
    maxConnections: 500000
  },
  dormant: {
    type: 'digest',
    heartbeatInterval: 3600000, // 1 hour
    batchSize: 50,
    priority: 6,
    maxConnections: 1000000
  }
};

// Smart connection manager
export class SmartConnectionManager {
  private connections: Map<string, ConnectionInfo> = new Map();
  private userTiers: Map<string, UserTier> = new Map();
  private messageQueue: Map<string, RealTimeMessage[]> = new Map();
  private batchTimers: Map<string, NodeJS.Timeout> = new Map();
  
  // Get optimal connection strategy for user
  async getConnectionStrategy(userId: string): Promise<ConnectionStrategy> {
    const userTier = await this.getUserTier(userId);
    const strategyKey = `${userTier.tier}_${userTier.activity}`;
    
    return CONNECTION_STRATEGIES[strategyKey] || CONNECTION_STRATEGIES.standard_medium;
  }
  
  // Analyze user tier based on activity and preferences
  private async getUserTier(userId: string): Promise<UserTier> {
    // Check cache first
    const cached = this.userTiers.get(userId);
    if (cached) return cached;
    
    // Get user profile and activity data
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    if (!userData) {
      // Default for new users
      const defaultTier: UserTier = {
        tier: 'standard',
        activity: 'medium',
        lastActiveDate: new Date(),
        entriesPerWeek: 0,
        realtimePreference: true
      };
      
      this.userTiers.set(userId, defaultTier);
      return defaultTier;
    }
    
    // Get recent activity
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const entriesSnapshot = await db.collection('users')
      .doc(userId)
      .collection('entries')
      .where('timestamp', '>=', oneWeekAgo)
      .get();
    
    const entriesPerWeek = entriesSnapshot.size;
    
    // Determine tier
    let tier: 'premium' | 'standard' | 'dormant' = 'standard';
    if (userData.subscription === 'premium') {
      tier = 'premium';
    } else if (entriesPerWeek === 0 && userData.lastActiveDate < oneWeekAgo) {
      tier = 'dormant';
    }
    
    // Determine activity level
    let activity: 'high' | 'medium' | 'low' = 'medium';
    if (entriesPerWeek >= 10) {
      activity = 'high';
    } else if (entriesPerWeek <= 2) {
      activity = 'low';
    }
    
    const userTier: UserTier = {
      tier,
      activity,
      lastActiveDate: userData.lastActiveDate?.toDate() || new Date(),
      entriesPerWeek,
      realtimePreference: userData.realtimePreference !== false
    };
    
    // Cache for 1 hour
    this.userTiers.set(userId, userTier);
    setTimeout(() => this.userTiers.delete(userId), 60 * 60 * 1000);
    
    return userTier;
  }
  
  // Register new connection
  async registerConnection(userId: string, connectionId: string, websocket?: any): Promise<ConnectionInfo> {
    const strategy = await this.getConnectionStrategy(userId);
    
    const connectionInfo: ConnectionInfo = {
      userId,
      connectionId,
      strategy,
      connectedAt: Date.now(),
      lastHeartbeat: Date.now(),
      websocket,
      messageQueue: [],
      status: 'connected'
    };
    
    this.connections.set(connectionId, connectionInfo);
    
    // Initialize message batching if needed
    if (strategy.batchSize > 1) {
      this.initializeBatching(userId, strategy);
    }
    
    // Start heartbeat monitoring
    this.startHeartbeatMonitoring(connectionId, strategy.heartbeatInterval);
    
    logger.info('Real-time connection registered', {
      userId,
      connectionId,
      strategy: strategy.type,
      batchSize: strategy.batchSize
    });
    
    return connectionInfo;
  }
  
  // Send message to user (with intelligent batching)
  async sendMessage(userId: string, message: RealTimeMessage): Promise<void> {
    const userConnections = this.getUserConnections(userId);
    
    if (userConnections.length === 0) {
      // Store for later delivery
      await this.storeOfflineMessage(userId, message);
      return;
    }
    
    for (const connection of userConnections) {
      if (connection.strategy.batchSize === 1) {
        // Immediate delivery for premium users
        await this.deliverMessageImmediately(connection, message);
      } else {
        // Add to batch queue
        this.addToBatch(connection, message);
      }
    }
  }
  
  // Get all connections for a user
  private getUserConnections(userId: string): ConnectionInfo[] {
    return Array.from(this.connections.values()).filter(conn => 
      conn.userId === userId && conn.status === 'connected'
    );
  }
  
  // Deliver message immediately (WebSocket)
  private async deliverMessageImmediately(connection: ConnectionInfo, message: RealTimeMessage): Promise<void> {
    try {
      if (connection.websocket && connection.websocket.readyState === 1) {
        connection.websocket.send(JSON.stringify(message));
        
        // Log delivery
        await this.logMessageDelivery(connection.userId, message.id, 'immediate');
      }
    } catch (error) {
      logger.error('Failed to deliver real-time message', error, {
        userId: connection.userId,
        messageId: message.id
      });
      
      // Mark connection as failed
      connection.status = 'failed';
    }
  }
  
  // Add message to batch queue
  private addToBatch(connection: ConnectionInfo, message: RealTimeMessage): void {
    const userId = connection.userId;
    
    if (!this.messageQueue.has(userId)) {
      this.messageQueue.set(userId, []);
    }
    
    this.messageQueue.get(userId)!.push(message);
    
    // Check if batch is ready
    const queue = this.messageQueue.get(userId)!;
    if (queue.length >= connection.strategy.batchSize) {
      this.deliverBatch(userId);
    }
  }
  
  // Initialize batching timer for user
  private initializeBatching(userId: string, strategy: ConnectionStrategy): void {
    // Clear existing timer
    const existingTimer = this.batchTimers.get(userId);
    if (existingTimer) {
      clearInterval(existingTimer);
    }
    
    // Set up new batching timer
    const batchInterval = Math.max(strategy.heartbeatInterval / 2, 5000); // At least 5 seconds
    const timer = setInterval(() => {
      this.deliverBatch(userId);
    }, batchInterval);
    
    this.batchTimers.set(userId, timer);
  }
  
  // Deliver batched messages
  private async deliverBatch(userId: string): Promise<void> {
    const queue = this.messageQueue.get(userId);
    if (!queue || queue.length === 0) return;
    
    const messages = queue.splice(0); // Take all messages
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const batch: BatchUpdate = {
      userId,
      messages,
      batchId,
      createdAt: Date.now()
    };
    
    const userConnections = this.getUserConnections(userId);
    
    for (const connection of userConnections) {
      try {
        if (connection.strategy.type === 'websocket' && connection.websocket) {
          connection.websocket.send(JSON.stringify(batch));
        } else if (connection.strategy.type === 'pubsub') {
          await this.sendViaPubSub(userId, batch);
        }
        
        batch.deliveredAt = Date.now();
        
      } catch (error) {
        logger.error('Failed to deliver batch', error, {
          userId,
          batchId,
          messageCount: messages.length
        });
      }
    }
    
    // Log batch delivery
    await this.logBatchDelivery(userId, batchId, messages.length);
  }
  
  // Send via Pub/Sub for standard users
  private async sendViaPubSub(userId: string, batch: BatchUpdate): Promise<void> {
    // Store batch in Firestore for Pub/Sub pickup
    await db.collection('realtime_batches').doc(batch.batchId).set({
      ...batch,
      status: 'pending',
      attempts: 0
    });
    
    // Trigger Pub/Sub delivery (would be handled by Cloud Function)
    logger.info('Batch queued for Pub/Sub delivery', {
      userId,
      batchId: batch.batchId,
      messageCount: batch.messages.length
    });
  }
  
  // Store message for offline users
  private async storeOfflineMessage(userId: string, message: RealTimeMessage): Promise<void> {
    await db.collection('users')
      .doc(userId)
      .collection('offline_messages')
      .doc(message.id)
      .set({
        ...message,
        storedAt: Date.now(),
        delivered: false
      });
  }
  
  // Start heartbeat monitoring for connection
  private startHeartbeatMonitoring(connectionId: string, interval: number): void {
    const heartbeatTimer = setInterval(() => {
      const connection = this.connections.get(connectionId);
      
      if (!connection) {
        clearInterval(heartbeatTimer);
        return;
      }
      
      const now = Date.now();
      const timeSinceLastHeartbeat = now - connection.lastHeartbeat;
      
      // Check if connection is stale
      if (timeSinceLastHeartbeat > interval * 2) {
        logger.warn('Stale connection detected', {
          userId: connection.userId,
          connectionId,
          timeSinceLastHeartbeat
        });
        
        this.closeConnection(connectionId, 'stale');
        clearInterval(heartbeatTimer);
      }
    }, interval);
  }
  
  // Update heartbeat for connection
  updateHeartbeat(connectionId: string): void {
    const connection = this.connections.get(connectionId);
    if (connection) {
      connection.lastHeartbeat = Date.now();
    }
  }
  
  // Close connection
  closeConnection(connectionId: string, reason: string): void {
    const connection = this.connections.get(connectionId);
    
    if (connection) {
      connection.status = 'disconnected';
      
      if (connection.websocket) {
        connection.websocket.close();
      }
      
      // Clean up timers
      const timer = this.batchTimers.get(connection.userId);
      if (timer) {
        clearInterval(timer);
        this.batchTimers.delete(connection.userId);
      }
      
      this.connections.delete(connectionId);
      
      logger.info('Real-time connection closed', {
        userId: connection.userId,
        connectionId,
        reason
      });
    }
  }
  
  // Get connection statistics
  getConnectionStats(): ConnectionStats {
    const connections = Array.from(this.connections.values());
    
    const stats: ConnectionStats = {
      total: connections.length,
      byStrategy: {},
      byTier: {},
      avgLatency: 0,
      activeUsers: new Set(connections.map(c => c.userId)).size
    };
    
    // Group by strategy
    connections.forEach(conn => {
      const strategy = conn.strategy.type;
      stats.byStrategy[strategy] = (stats.byStrategy[strategy] || 0) + 1;
    });
    
    // Group by tier (would need to fetch user tiers)
    return stats;
  }
  
  // Log message delivery
  private async logMessageDelivery(userId: string, messageId: string, method: string): Promise<void> {
    await db.collection('delivery_logs').add({
      userId,
      messageId,
      method,
      timestamp: new Date(),
      latency: 0 // Would calculate actual latency
    });
  }
  
  // Log batch delivery
  private async logBatchDelivery(userId: string, batchId: string, messageCount: number): Promise<void> {
    await db.collection('batch_logs').add({
      userId,
      batchId,
      messageCount,
      timestamp: new Date(),
      deliveryMethod: 'batch'
    });
  }
}

// Connection information interface
interface ConnectionInfo {
  userId: string;
  connectionId: string;
  strategy: ConnectionStrategy;
  connectedAt: number;
  lastHeartbeat: number;
  websocket?: any;
  messageQueue: RealTimeMessage[];
  status: 'connected' | 'disconnected' | 'failed';
}

// Connection statistics interface
interface ConnectionStats {
  total: number;
  byStrategy: Record<string, number>;
  byTier: Record<string, number>;
  avgLatency: number;
  activeUsers: number;
}

// Graceful degradation manager
export class GracefulDegradationManager {
  private loadThreshold = 0.8; // 80% capacity
  private currentLoad = 0;
  private maxConnections = 1000000; // 1M connections
  
  // Check if system should degrade
  shouldDegrade(): boolean {
    return this.currentLoad > this.loadThreshold;
  }
  
  // Get degraded connection strategy
  getDegradedStrategy(originalStrategy: ConnectionStrategy): ConnectionStrategy {
    if (!this.shouldDegrade()) return originalStrategy;
    
    // Degrade WebSocket to Pub/Sub
    if (originalStrategy.type === 'websocket') {
      return {
        ...originalStrategy,
        type: 'pubsub',
        batchSize: Math.max(originalStrategy.batchSize * 2, 5),
        heartbeatInterval: originalStrategy.heartbeatInterval * 2
      };
    }
    
    // Degrade Pub/Sub to polling
    if (originalStrategy.type === 'pubsub') {
      return {
        ...originalStrategy,
        type: 'polling',
        batchSize: Math.max(originalStrategy.batchSize * 2, 10),
        heartbeatInterval: Math.max(originalStrategy.heartbeatInterval * 2, 60000)
      };
    }
    
    return originalStrategy;
  }
  
  // Update system load
  updateLoad(connectionCount: number): void {
    this.currentLoad = connectionCount / this.maxConnections;
    
    if (this.currentLoad > 0.9) {
      logger.warn('High system load detected', {
        currentLoad: this.currentLoad,
        connectionCount,
        degradationActive: this.shouldDegrade()
      });
    }
  }
  
  // Get fallback page content for extreme load
  getFallbackPageContent(): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>ALCHM - High Load</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 20px; text-align: center; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .status { color: #f59e0b; font-size: 18px; margin-bottom: 20px; }
          .message { color: #374151; font-size: 16px; line-height: 1.6; }
          .retry { background: #3b82f6; color: white; padding: 12px 24px; border: none; border-radius: 6px; margin-top: 20px; cursor: pointer; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🌟 ALCHM</h1>
          <div class="status">Experiencing High Traffic</div>
          <div class="message">
            We're experiencing higher than normal traffic right now. 
            Your journaling experience is still available, but some real-time features may be temporarily limited.
            <br><br>
            Thank you for your patience as we scale to serve everyone.
          </div>
          <button class="retry" onclick="location.reload()">Try Again</button>
        </div>
      </body>
      </html>
    `;
  }
}

// Export for use in API routes and WebSocket handlers
export { CONNECTION_STRATEGIES };