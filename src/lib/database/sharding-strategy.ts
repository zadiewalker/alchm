// Intelligent Database Sharding for 10M+ Users
// Problem: Hot documents kill performance at scale
// Solution: Activity-based intelligent partitioning with auto-migration

import { db } from '@/lib/firebaseAdmin';
import { logger } from '@/lib/logging';

export interface ShardingStrategy {
  highActivity: string;    // users_power_{region}_{shard} - Heavy journalers
  standard: string;        // users_standard_{region}_{shard} - Normal users  
  enterprise: string;      // users_enterprise_{org}_{shard} - B2B customers
  archived: string;        // users_archived_{region}_{quarter} - Inactive users
}

export interface UserActivityProfile {
  userId: string;
  entriesPerWeek: number;
  aiRequestsPerDay: number;
  realtimeConnections: number;
  lastActiveDate: Date;
  region: string;
  tier: 'free' | 'premium' | 'enterprise';
}

export interface ShardMetrics {
  shardId: string;
  userCount: number;
  writeRate: number;      // writes per second
  readRate: number;       // reads per second
  latencyP95: number;     // 95th percentile latency
  errorRate: number;      // error percentage
  capacity: number;       // 0-1 scale
}

// Smart shard selection based on user activity patterns
export class IntelligentSharding {
  private static readonly MAX_USERS_PER_SHARD = 50000;
  private static readonly HIGH_ACTIVITY_THRESHOLD = 20; // entries per week
  private static readonly ENTERPRISE_ORG_THRESHOLD = 100; // users per org
  
  // Determine optimal shard for new user
  static async getOptimalShard(userProfile: UserActivityProfile): Promise<string> {
    const { region, tier, entriesPerWeek } = userProfile;
    
    // Enterprise users get dedicated shards
    if (tier === 'enterprise') {
      return await this.getEnterpriseShardId(userProfile);
    }
    
    // High-activity users get power shards
    if (entriesPerWeek >= this.HIGH_ACTIVITY_THRESHOLD || tier === 'premium') {
      return await this.getPowerShardId(region);
    }
    
    // Standard users get balanced shards
    return await this.getStandardShardId(region);
  }
  
  // Get power shard for high-activity users
  private static async getPowerShardId(region: string): Promise<string> {
    const powerShards = await this.getShardsByPattern(`users_power_${region}_*`);
    const optimalShard = await this.findLeastLoadedShard(powerShards);
    
    if (!optimalShard || optimalShard.userCount >= this.MAX_USERS_PER_SHARD * 0.8) {
      return await this.createNewPowerShard(region);
    }
    
    return optimalShard.shardId;
  }
  
  // Get standard shard for normal users
  private static async getStandardShardId(region: string): Promise<string> {
    const standardShards = await this.getShardsByPattern(`users_standard_${region}_*`);
    const optimalShard = await this.findLeastLoadedShard(standardShards);
    
    if (!optimalShard || optimalShard.userCount >= this.MAX_USERS_PER_SHARD) {
      return await this.createNewStandardShard(region);
    }
    
    return optimalShard.shardId;
  }
  
  // Get enterprise shard for B2B customers
  private static async getEnterpriseShardId(userProfile: UserActivityProfile): Promise<string> {
    // Enterprise users get org-specific shards
    const orgId = userProfile.userId.split('_')[0]; // Extract org ID
    return `users_enterprise_${orgId}_${userProfile.region}`;
  }
  
  // Find shard with lowest load
  private static async findLeastLoadedShard(shards: ShardMetrics[]): Promise<ShardMetrics | null> {
    if (shards.length === 0) return null;
    
    // Sort by capacity (lowest first), then by latency
    return shards.sort((a, b) => {
      if (a.capacity !== b.capacity) return a.capacity - b.capacity;
      return a.latencyP95 - b.latencyP95;
    })[0];
  }
  
  // Create new power shard when needed
  private static async createNewPowerShard(region: string): Promise<string> {
    const shardNumber = await this.getNextShardNumber('power', region);
    const shardId = `users_power_${region}_${shardNumber}`;
    
    await this.initializeShard(shardId, 'power');
    
    logger.info('Created new power shard', {
      shardId,
      region,
      type: 'power'
    });
    
    return shardId;
  }
  
  // Create new standard shard when needed
  private static async createNewStandardShard(region: string): Promise<string> {
    const shardNumber = await this.getNextShardNumber('standard', region);
    const shardId = `users_standard_${region}_${shardNumber}`;
    
    await this.initializeShard(shardId, 'standard');
    
    logger.info('Created new standard shard', {
      shardId,
      region,
      type: 'standard'
    });
    
    return shardId;
  }
  
  // Initialize new shard with proper indexes and rules
  private static async initializeShard(shardId: string, type: 'power' | 'standard' | 'enterprise'): Promise<void> {
    // Create shard metadata
    await db.collection('shard_metadata').doc(shardId).set({
      shardId,
      type,
      createdAt: new Date(),
      userCount: 0,
      maxCapacity: this.MAX_USERS_PER_SHARD,
      status: 'active',
      indexes: await this.getRequiredIndexes(type)
    });
    
    // Initialize performance monitoring
    await this.initializeShardMonitoring(shardId);
  }
  
  // Get required composite indexes for shard type
  private static async getRequiredIndexes(type: string): Promise<string[]> {
    const baseIndexes = [
      'userId,timestamp',
      'userId,entryDate,mood',
      'userId,riskLevel,timestamp',
      'userId,emotionalTags,timestamp'
    ];
    
    if (type === 'power') {
      return [
        ...baseIndexes,
        'userId,aiRequestCount,timestamp',
        'userId,realtimeConnections,timestamp'
      ];
    }
    
    return baseIndexes;
  }
  
  // Get shards matching pattern
  private static async getShardsByPattern(pattern: string): Promise<ShardMetrics[]> {
    const regex = new RegExp(pattern.replace('*', '.*'));
    
    const shardsSnapshot = await db.collection('shard_metadata')
      .where('status', '==', 'active')
      .get();
    
    const matchingShards: ShardMetrics[] = [];
    
    for (const doc of shardsSnapshot.docs) {
      const data = doc.data();
      if (regex.test(data.shardId)) {
        const metrics = await this.getShardMetrics(data.shardId);
        matchingShards.push(metrics);
      }
    }
    
    return matchingShards;
  }
  
  // Get real-time shard performance metrics
  private static async getShardMetrics(shardId: string): Promise<ShardMetrics> {
    const metricsSnapshot = await db.collection('shard_performance')
      .doc(shardId)
      .get();
    
    const metrics = metricsSnapshot.data();
    
    return {
      shardId,
      userCount: metrics?.userCount || 0,
      writeRate: metrics?.writeRate || 0,
      readRate: metrics?.readRate || 0,
      latencyP95: metrics?.latencyP95 || 0,
      errorRate: metrics?.errorRate || 0,
      capacity: metrics?.capacity || 0
    };
  }
  
  // Get next available shard number
  private static async getNextShardNumber(type: string, region: string): Promise<number> {
    const pattern = `users_${type}_${region}_`;
    const shards = await this.getShardsByPattern(`${pattern}*`);
    
    const shardNumbers = shards
      .map(shard => parseInt(shard.shardId.replace(pattern, '')))
      .filter(num => !isNaN(num))
      .sort((a, b) => a - b);
    
    return shardNumbers.length > 0 ? Math.max(...shardNumbers) + 1 : 1;
  }
  
  // Initialize performance monitoring for new shard
  private static async initializeShardMonitoring(shardId: string): Promise<void> {
    await db.collection('shard_performance').doc(shardId).set({
      shardId,
      userCount: 0,
      writeRate: 0,
      readRate: 0,
      latencyP95: 0,
      errorRate: 0,
      capacity: 0,
      lastUpdated: new Date(),
      alerts: {
        highLatency: false,
        highErrorRate: false,
        nearCapacity: false
      }
    });
  }
}

// Auto-migration service for load balancing
export class ShardMigrationService {
  private static readonly MIGRATION_THRESHOLD = 0.85; // 85% capacity
  private static readonly COOLING_PERIOD = 24 * 60 * 60 * 1000; // 24 hours
  
  // Analyze all shards and trigger migrations if needed
  static async analyzeAndMigrate(): Promise<void> {
    try {
      const allShards = await this.getAllActiveShards();
      const migrationCandidates = await this.identifyMigrationCandidates(allShards);
      
      for (const candidate of migrationCandidates) {
        await this.executeMigration(candidate);
      }
      
      logger.info('Shard migration analysis completed', {
        totalShards: allShards.length,
        migrationsExecuted: migrationCandidates.length
      });
      
    } catch (error) {
      logger.error('Error in shard migration analysis', error);
    }
  }
  
  // Get all active shards
  private static async getAllActiveShards(): Promise<ShardMetrics[]> {
    const shardsSnapshot = await db.collection('shard_metadata')
      .where('status', '==', 'active')
      .get();
    
    const shards: ShardMetrics[] = [];
    
    for (const doc of shardsSnapshot.docs) {
      const data = doc.data();
      const metrics = await IntelligentSharding['getShardMetrics'](data.shardId);
      shards.push(metrics);
    }
    
    return shards;
  }
  
  // Identify shards that need migration
  private static async identifyMigrationCandidates(shards: ShardMetrics[]): Promise<ShardMetrics[]> {
    return shards.filter(shard => {
      // High capacity or high latency
      return shard.capacity > this.MIGRATION_THRESHOLD || 
             shard.latencyP95 > 300 || // >300ms latency
             shard.errorRate > 0.01;   // >1% error rate
    });
  }
  
  // Execute migration for overloaded shard
  private static async executeMigration(overloadedShard: ShardMetrics): Promise<void> {
    // Check cooling period
    const lastMigration = await this.getLastMigrationTime(overloadedShard.shardId);
    if (lastMigration && Date.now() - lastMigration.getTime() < this.COOLING_PERIOD) {
      return; // Skip if migrated recently
    }
    
    // Find users to migrate (least active users first)
    const usersToMigrate = await this.selectUsersForMigration(overloadedShard.shardId);
    
    // Find destination shards
    const destinationShards = await this.findDestinationShards(usersToMigrate);
    
    // Execute migration
    await this.migrateUsers(usersToMigrate, destinationShards);
    
    // Update migration history
    await this.recordMigration(overloadedShard.shardId, usersToMigrate.length);
    
    logger.info('Shard migration completed', {
      sourceShardId: overloadedShard.shardId,
      usersMigrated: usersToMigrate.length,
      destinationShards: destinationShards.map(s => s.shardId)
    });
  }
  
  // Select users for migration (least active first)
  private static async selectUsersForMigration(shardId: string): Promise<UserActivityProfile[]> {
    const usersSnapshot = await db.collection(shardId)
      .orderBy('lastActiveDate', 'asc')
      .limit(1000) // Migrate up to 1000 users at once
      .get();
    
    return usersSnapshot.docs.map(doc => ({
      userId: doc.id,
      ...doc.data()
    } as UserActivityProfile));
  }
  
  // Find destination shards for migrated users
  private static async findDestinationShards(users: UserActivityProfile[]): Promise<ShardMetrics[]> {
    const destinations: ShardMetrics[] = [];
    
    for (const user of users) {
      const optimalShardId = await IntelligentSharding.getOptimalShard(user);
      const shardMetrics = await IntelligentSharding['getShardMetrics'](optimalShardId);
      
      if (!destinations.find(d => d.shardId === shardMetrics.shardId)) {
        destinations.push(shardMetrics);
      }
    }
    
    return destinations;
  }
  
  // Execute user migration between shards
  private static async migrateUsers(
    users: UserActivityProfile[], 
    destinationShards: ShardMetrics[]
  ): Promise<void> {
    const batch = db.batch();
    
    for (const user of users) {
      const newShardId = await IntelligentSharding.getOptimalShard(user);
      
      // Copy user data to new shard
      const newUserRef = db.collection(newShardId).doc(user.userId);
      batch.set(newUserRef, user);
      
      // Delete from old shard (will be done after confirmation)
      const oldUserRef = db.collection(user.userId.split('_')[0]).doc(user.userId);
      batch.delete(oldUserRef);
    }
    
    await batch.commit();
  }
  
  // Get last migration time for shard
  private static async getLastMigrationTime(shardId: string): Promise<Date | null> {
    const migrationSnapshot = await db.collection('migration_history')
      .where('shardId', '==', shardId)
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get();
    
    if (migrationSnapshot.empty) return null;
    
    return migrationSnapshot.docs[0].data().timestamp.toDate();
  }
  
  // Record migration in history
  private static async recordMigration(shardId: string, userCount: number): Promise<void> {
    await db.collection('migration_history').add({
      shardId,
      userCount,
      timestamp: new Date(),
      type: 'auto_migration',
      reason: 'capacity_optimization'
    });
  }
}

// Shard router for directing requests to correct shard
export class ShardRouter {
  private static shardCache = new Map<string, string>();
  private static cacheExpiry = new Map<string, number>();
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  
  // Get shard ID for user (with caching)
  static async getShardForUser(userId: string): Promise<string> {
    // Check cache first
    const cached = this.shardCache.get(userId);
    const expiry = this.cacheExpiry.get(userId);
    
    if (cached && expiry && Date.now() < expiry) {
      return cached;
    }
    
    // Look up current shard
    const userShardSnapshot = await db.collection('user_shard_mapping')
      .doc(userId)
      .get();
    
    let shardId: string;
    
    if (userShardSnapshot.exists) {
      shardId = userShardSnapshot.data()!.shardId;
    } else {
      // New user - assign optimal shard
      const userProfile = await this.getUserProfile(userId);
      shardId = await IntelligentSharding.getOptimalShard(userProfile);
      
      // Store mapping
      await db.collection('user_shard_mapping').doc(userId).set({
        userId,
        shardId,
        assignedAt: new Date(),
        lastUpdated: new Date()
      });
    }
    
    // Update cache
    this.shardCache.set(userId, shardId);
    this.cacheExpiry.set(userId, Date.now() + this.CACHE_TTL);
    
    return shardId;
  }
  
  // Get user profile for shard assignment
  private static async getUserProfile(userId: string): Promise<UserActivityProfile> {
    // Default profile for new users
    return {
      userId,
      entriesPerWeek: 0,
      aiRequestsPerDay: 0,
      realtimeConnections: 0,
      lastActiveDate: new Date(),
      region: this.getUserRegion(userId),
      tier: 'free'
    };
  }
  
  // Determine user region from ID or IP
  private static getUserRegion(userId: string): string {
    // Simple region detection - can be enhanced with IP geolocation
    const regionCode = userId.slice(-2);
    
    switch (regionCode) {
      case 'us': return 'us-central1';
      case 'eu': return 'europe-west1';
      case 'ap': return 'asia-southeast1';
      default: return 'us-central1'; // Default to US
    }
  }
  
  // Clear cache for user (call after migration)
  static clearUserCache(userId: string): void {
    this.shardCache.delete(userId);
    this.cacheExpiry.delete(userId);
  }
}

// Export for Firebase Functions
export const shardingFunctions = {
  IntelligentSharding,
  ShardMigrationService,
  ShardRouter
};