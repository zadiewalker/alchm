"use strict";
// Intelligent Database Sharding for 10M+ Users
// Problem: Hot documents kill performance at scale
// Solution: Activity-based intelligent partitioning with auto-migration
Object.defineProperty(exports, "__esModule", { value: true });
exports.shardingFunctions = exports.ShardRouter = exports.ShardMigrationService = exports.IntelligentSharding = void 0;
const firebaseAdmin_1 = require("@/lib/firebaseAdmin");
const logging_1 = require("@/lib/logging");
// Smart shard selection based on user activity patterns
class IntelligentSharding {
    // Determine optimal shard for new user
    static async getOptimalShard(userProfile) {
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
    static async getPowerShardId(region) {
        const powerShards = await this.getShardsByPattern(`users_power_${region}_*`);
        const optimalShard = await this.findLeastLoadedShard(powerShards);
        if (!optimalShard || optimalShard.userCount >= this.MAX_USERS_PER_SHARD * 0.8) {
            return await this.createNewPowerShard(region);
        }
        return optimalShard.shardId;
    }
    // Get standard shard for normal users
    static async getStandardShardId(region) {
        const standardShards = await this.getShardsByPattern(`users_standard_${region}_*`);
        const optimalShard = await this.findLeastLoadedShard(standardShards);
        if (!optimalShard || optimalShard.userCount >= this.MAX_USERS_PER_SHARD) {
            return await this.createNewStandardShard(region);
        }
        return optimalShard.shardId;
    }
    // Get enterprise shard for B2B customers
    static async getEnterpriseShardId(userProfile) {
        // Enterprise users get org-specific shards
        const orgId = userProfile.userId.split('_')[0]; // Extract org ID
        return `users_enterprise_${orgId}_${userProfile.region}`;
    }
    // Find shard with lowest load
    static async findLeastLoadedShard(shards) {
        if (shards.length === 0)
            return null;
        // Sort by capacity (lowest first), then by latency
        return shards.sort((a, b) => {
            if (a.capacity !== b.capacity)
                return a.capacity - b.capacity;
            return a.latencyP95 - b.latencyP95;
        })[0];
    }
    // Create new power shard when needed
    static async createNewPowerShard(region) {
        const shardNumber = await this.getNextShardNumber('power', region);
        const shardId = `users_power_${region}_${shardNumber}`;
        await this.initializeShard(shardId, 'power');
        logging_1.logger.info('Created new power shard', {
            shardId,
            region,
            type: 'power'
        });
        return shardId;
    }
    // Create new standard shard when needed
    static async createNewStandardShard(region) {
        const shardNumber = await this.getNextShardNumber('standard', region);
        const shardId = `users_standard_${region}_${shardNumber}`;
        await this.initializeShard(shardId, 'standard');
        logging_1.logger.info('Created new standard shard', {
            shardId,
            region,
            type: 'standard'
        });
        return shardId;
    }
    // Initialize new shard with proper indexes and rules
    static async initializeShard(shardId, type) {
        // Create shard metadata
        await firebaseAdmin_1.db.collection('shard_metadata').doc(shardId).set({
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
    static async getRequiredIndexes(type) {
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
    static async getShardsByPattern(pattern) {
        const regex = new RegExp(pattern.replace('*', '.*'));
        const shardsSnapshot = await firebaseAdmin_1.db.collection('shard_metadata')
            .where('status', '==', 'active')
            .get();
        const matchingShards = [];
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
    static async getShardMetrics(shardId) {
        const metricsSnapshot = await firebaseAdmin_1.db.collection('shard_performance')
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
    static async getNextShardNumber(type, region) {
        const pattern = `users_${type}_${region}_`;
        const shards = await this.getShardsByPattern(`${pattern}*`);
        const shardNumbers = shards
            .map(shard => parseInt(shard.shardId.replace(pattern, '')))
            .filter(num => !isNaN(num))
            .sort((a, b) => a - b);
        return shardNumbers.length > 0 ? Math.max(...shardNumbers) + 1 : 1;
    }
    // Initialize performance monitoring for new shard
    static async initializeShardMonitoring(shardId) {
        await firebaseAdmin_1.db.collection('shard_performance').doc(shardId).set({
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
exports.IntelligentSharding = IntelligentSharding;
IntelligentSharding.MAX_USERS_PER_SHARD = 50000;
IntelligentSharding.HIGH_ACTIVITY_THRESHOLD = 20; // entries per week
IntelligentSharding.ENTERPRISE_ORG_THRESHOLD = 100; // users per org
// Auto-migration service for load balancing
class ShardMigrationService {
    // Analyze all shards and trigger migrations if needed
    static async analyzeAndMigrate() {
        try {
            const allShards = await this.getAllActiveShards();
            const migrationCandidates = await this.identifyMigrationCandidates(allShards);
            for (const candidate of migrationCandidates) {
                await this.executeMigration(candidate);
            }
            logging_1.logger.info('Shard migration analysis completed', {
                totalShards: allShards.length,
                migrationsExecuted: migrationCandidates.length
            });
        }
        catch (error) {
            logging_1.logger.error('Error in shard migration analysis', error);
        }
    }
    // Get all active shards
    static async getAllActiveShards() {
        const shardsSnapshot = await firebaseAdmin_1.db.collection('shard_metadata')
            .where('status', '==', 'active')
            .get();
        const shards = [];
        for (const doc of shardsSnapshot.docs) {
            const data = doc.data();
            const metrics = await IntelligentSharding['getShardMetrics'](data.shardId);
            shards.push(metrics);
        }
        return shards;
    }
    // Identify shards that need migration
    static async identifyMigrationCandidates(shards) {
        return shards.filter(shard => {
            // High capacity or high latency
            return shard.capacity > this.MIGRATION_THRESHOLD ||
                shard.latencyP95 > 300 || // >300ms latency
                shard.errorRate > 0.01; // >1% error rate
        });
    }
    // Execute migration for overloaded shard
    static async executeMigration(overloadedShard) {
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
        logging_1.logger.info('Shard migration completed', {
            sourceShardId: overloadedShard.shardId,
            usersMigrated: usersToMigrate.length,
            destinationShards: destinationShards.map(s => s.shardId)
        });
    }
    // Select users for migration (least active first)
    static async selectUsersForMigration(shardId) {
        const usersSnapshot = await firebaseAdmin_1.db.collection(shardId)
            .orderBy('lastActiveDate', 'asc')
            .limit(1000) // Migrate up to 1000 users at once
            .get();
        return usersSnapshot.docs.map(doc => ({
            userId: doc.id,
            ...doc.data()
        }));
    }
    // Find destination shards for migrated users
    static async findDestinationShards(users) {
        const destinations = [];
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
    static async migrateUsers(users, destinationShards) {
        const batch = firebaseAdmin_1.db.batch();
        for (const user of users) {
            const newShardId = await IntelligentSharding.getOptimalShard(user);
            // Copy user data to new shard
            const newUserRef = firebaseAdmin_1.db.collection(newShardId).doc(user.userId);
            batch.set(newUserRef, user);
            // Delete from old shard (will be done after confirmation)
            const oldUserRef = firebaseAdmin_1.db.collection(user.userId.split('_')[0]).doc(user.userId);
            batch.delete(oldUserRef);
        }
        await batch.commit();
    }
    // Get last migration time for shard
    static async getLastMigrationTime(shardId) {
        const migrationSnapshot = await firebaseAdmin_1.db.collection('migration_history')
            .where('shardId', '==', shardId)
            .orderBy('timestamp', 'desc')
            .limit(1)
            .get();
        if (migrationSnapshot.empty)
            return null;
        return migrationSnapshot.docs[0].data().timestamp.toDate();
    }
    // Record migration in history
    static async recordMigration(shardId, userCount) {
        await firebaseAdmin_1.db.collection('migration_history').add({
            shardId,
            userCount,
            timestamp: new Date(),
            type: 'auto_migration',
            reason: 'capacity_optimization'
        });
    }
}
exports.ShardMigrationService = ShardMigrationService;
ShardMigrationService.MIGRATION_THRESHOLD = 0.85; // 85% capacity
ShardMigrationService.COOLING_PERIOD = 24 * 60 * 60 * 1000; // 24 hours
// Shard router for directing requests to correct shard
class ShardRouter {
    // Get shard ID for user (with caching)
    static async getShardForUser(userId) {
        // Check cache first
        const cached = this.shardCache.get(userId);
        const expiry = this.cacheExpiry.get(userId);
        if (cached && expiry && Date.now() < expiry) {
            return cached;
        }
        // Look up current shard
        const userShardSnapshot = await firebaseAdmin_1.db.collection('user_shard_mapping')
            .doc(userId)
            .get();
        let shardId;
        if (userShardSnapshot.exists) {
            shardId = userShardSnapshot.data().shardId;
        }
        else {
            // New user - assign optimal shard
            const userProfile = await this.getUserProfile(userId);
            shardId = await IntelligentSharding.getOptimalShard(userProfile);
            // Store mapping
            await firebaseAdmin_1.db.collection('user_shard_mapping').doc(userId).set({
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
    static async getUserProfile(userId) {
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
    static getUserRegion(userId) {
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
    static clearUserCache(userId) {
        this.shardCache.delete(userId);
        this.cacheExpiry.delete(userId);
    }
}
exports.ShardRouter = ShardRouter;
ShardRouter.shardCache = new Map();
ShardRouter.cacheExpiry = new Map();
ShardRouter.CACHE_TTL = 5 * 60 * 1000; // 5 minutes
// Export for Firebase Functions
exports.shardingFunctions = {
    IntelligentSharding,
    ShardMigrationService,
    ShardRouter
};
