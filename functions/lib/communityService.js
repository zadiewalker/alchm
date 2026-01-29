"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityHealingService = void 0;
// Community Healing Service for ALCHM
const firestore_1 = require("firebase-admin/firestore");
const communityUtils_1 = require("./utils/communityUtils");
const db = (0, firestore_1.getFirestore)();
class CommunityHealingService {
    // === ANONYMOUS STORY SHARING ===
    async createStory(userId, storyData) {
        try {
            // Generate anonymous ID for this story
            const anonymousId = (0, communityUtils_1.generateAnonymousId)(userId, 'story');
            // AI moderation check
            const moderationResult = await (0, communityUtils_1.aiModerationCheck)(storyData.content, 'story');
            const story = {
                anonymousId,
                content: storyData.content,
                title: storyData.title,
                healingStage: storyData.healingStage,
                wisdomTags: storyData.wisdomTags,
                contentModerationStatus: moderationResult.isApproved ? 'approved' : 'flagged',
                moderationScore: moderationResult.score,
                createdAt: firestore_1.Timestamp.now(),
                updatedAt: firestore_1.Timestamp.now(),
                reactions: {
                    resonance: 0,
                    gratitude: 0,
                    strength: 0,
                    solidarity: 0
                },
                reportCount: 0,
                location: storyData.location
            };
            const docRef = await db.collection('communityStories').add(story);
            // Log moderation action
            await this.logModerationAction({
                contentType: 'story',
                contentId: docRef.id,
                action: story.contentModerationStatus === 'approved' ? 'approved' : 'flagged',
                aiModerationScore: moderationResult.score,
                humanReviewRequired: !moderationResult.isApproved,
                timestamp: firestore_1.Timestamp.now()
            });
            // If flagged for crisis content, escalate
            if (moderationResult.crisisIndicators) {
                await this.handleCrisisEscalation(userId, docRef.id, 'story', moderationResult.crisisLevel);
            }
            return docRef.id;
        }
        catch (error) {
            console.error('Error creating community story:', error);
            throw new Error('Failed to create community story');
        }
    }
    async getStoriesByHealingStage(stage, limit = 10) {
        try {
            const snapshot = await db.collection('communityStories')
                .where('healingStage', '==', stage)
                .where('contentModerationStatus', '==', 'approved')
                .orderBy('createdAt', 'desc')
                .limit(limit)
                .get();
            return snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        }
        catch (error) {
            console.error('Error fetching stories by healing stage:', error);
            throw new Error('Failed to fetch stories');
        }
    }
    async addStoryReaction(userId, storyId, reactionType) {
        try {
            const anonymousUserId = (0, communityUtils_1.generateAnonymousId)(userId, 'reaction');
            const batch = db.batch();
            // Check if user already reacted to prevent duplicate reactions
            const existingReaction = await db.collection('storyReactions')
                .where('storyId', '==', storyId)
                .where('anonymousUserId', '==', anonymousUserId)
                .where('reactionType', '==', reactionType)
                .limit(1)
                .get();
            if (!existingReaction.empty) {
                return; // User already reacted with this type
            }
            // Add reaction document
            const reactionRef = db.collection('storyReactions').doc();
            batch.set(reactionRef, {
                storyId,
                anonymousUserId,
                reactionType,
                createdAt: firestore_1.Timestamp.now()
            });
            // Increment reaction count on story
            const storyRef = db.collection('communityStories').doc(storyId);
            batch.update(storyRef, {
                [`reactions.${reactionType}`]: firestore_1.FieldValue.increment(1)
            });
            await batch.commit();
        }
        catch (error) {
            console.error('Error adding story reaction:', error);
            throw new Error('Failed to add reaction');
        }
    }
    // === HEALING CIRCLES ===
    async createHealingCircle(facilitatorId, circleData) {
        try {
            const circle = Object.assign(Object.assign({}, circleData), { facilitatorId, isActive: true, currentCapacity: 0, participants: [], sessions: [], createdAt: firestore_1.Timestamp.now(), lastActivityAt: firestore_1.Timestamp.now() });
            const docRef = await db.collection('healingCircles').add(circle);
            return docRef.id;
        }
        catch (error) {
            console.error('Error creating healing circle:', error);
            throw new Error('Failed to create healing circle');
        }
    }
    async joinHealingCircle(userId, circleId, joinData) {
        try {
            const circleRef = db.collection('healingCircles').doc(circleId);
            const circle = await circleRef.get();
            if (!circle.exists) {
                throw new Error('Healing circle not found');
            }
            const circleData = circle.data();
            if (circleData.currentCapacity >= circleData.maxCapacity) {
                throw new Error('Healing circle is at capacity');
            }
            const anonymousId = (0, communityUtils_1.generateAnonymousId)(userId, `circle_${circleId}`);
            const participant = {
                anonymousId,
                joinedAt: firestore_1.Timestamp.now(),
                role: 'participant',
                isActive: true
            };
            await circleRef.update({
                participants: firestore_1.FieldValue.arrayUnion(participant),
                currentCapacity: firestore_1.FieldValue.increment(1),
                lastActivityAt: firestore_1.Timestamp.now()
            });
        }
        catch (error) {
            console.error('Error joining healing circle:', error);
            throw new Error('Failed to join healing circle');
        }
    }
    async getActiveHealingCircles(topic) {
        try {
            let query = db.collection('healingCircles')
                .where('isActive', '==', true)
                .where('isPublic', '==', true);
            if (topic) {
                query = query.where('topic', '==', topic);
            }
            const snapshot = await query.orderBy('lastActivityAt', 'desc').get();
            return snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        }
        catch (error) {
            console.error('Error fetching healing circles:', error);
            throw new Error('Failed to fetch healing circles');
        }
    }
    // === COMMUNITY WISDOM LIBRARY ===
    async createWisdomEntry(userId, wisdomData) {
        try {
            const anonymousId = (0, communityUtils_1.generateAnonymousId)(userId, 'wisdom');
            // AI moderation for wisdom content
            const moderationResult = await (0, communityUtils_1.aiModerationCheck)(wisdomData.content, 'wisdom');
            const wisdom = {
                contributorAnonymousId: anonymousId,
                type: wisdomData.type,
                title: wisdomData.title,
                content: wisdomData.content,
                category: wisdomData.category,
                tags: wisdomData.tags,
                isVerified: false,
                effectiveness_votes: {
                    helpful: 0,
                    somewhat_helpful: 0,
                    not_helpful: 0
                },
                createdAt: firestore_1.Timestamp.now(),
                lastUpdatedAt: firestore_1.Timestamp.now(),
                reportCount: 0,
                sourceType: wisdomData.sourceType
            };
            const docRef = await db.collection('communityWisdom').add(wisdom);
            await this.logModerationAction({
                contentType: 'wisdom_entry',
                contentId: docRef.id,
                action: 'approved',
                aiModerationScore: moderationResult.score,
                humanReviewRequired: moderationResult.score < 0.8,
                timestamp: firestore_1.Timestamp.now()
            });
            return docRef.id;
        }
        catch (error) {
            console.error('Error creating wisdom entry:', error);
            throw new Error('Failed to create wisdom entry');
        }
    }
    async searchWisdomEntries(query, category, tags) {
        try {
            let firestoreQuery = db.collection('communityWisdom');
            if (category) {
                firestoreQuery = firestoreQuery.where('category', '==', category);
            }
            if (tags && tags.length > 0) {
                firestoreQuery = firestoreQuery.where('tags', 'array-contains-any', tags);
            }
            const snapshot = await firestoreQuery
                .orderBy('createdAt', 'desc')
                .limit(20)
                .get();
            let results = snapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
            // Simple text search if query provided
            if (query) {
                const searchTerms = query.toLowerCase().split(' ');
                results = results.filter((entry) => searchTerms.some((term) => entry.title.toLowerCase().includes(term) ||
                    entry.content.toLowerCase().includes(term) ||
                    entry.tags.some((tag) => tag.toLowerCase().includes(term))));
            }
            return results;
        }
        catch (error) {
            console.error('Error searching wisdom entries:', error);
            throw new Error('Failed to search wisdom entries');
        }
    }
    async voteOnWisdomEntry(userId, entryId, vote) {
        try {
            const anonymousUserId = (0, communityUtils_1.generateAnonymousId)(userId, 'vote');
            const batch = db.batch();
            // Check for existing vote
            const existingVote = await db.collection('wisdomVotes')
                .where('entryId', '==', entryId)
                .where('voterAnonymousId', '==', anonymousUserId)
                .limit(1)
                .get();
            if (!existingVote.empty) {
                // Update existing vote
                const voteDoc = existingVote.docs[0];
                const oldVote = voteDoc.data().vote;
                batch.update(voteDoc.ref, { vote, createdAt: firestore_1.Timestamp.now() });
                // Update counters
                const entryRef = db.collection('communityWisdom').doc(entryId);
                batch.update(entryRef, {
                    [`effectiveness_votes.${oldVote}`]: firestore_1.FieldValue.increment(-1),
                    [`effectiveness_votes.${vote}`]: firestore_1.FieldValue.increment(1)
                });
            }
            else {
                // Create new vote
                const voteRef = db.collection('wisdomVotes').doc();
                batch.set(voteRef, {
                    entryId,
                    voterAnonymousId: anonymousUserId,
                    vote,
                    createdAt: firestore_1.Timestamp.now()
                });
                // Increment counter
                const entryRef = db.collection('communityWisdom').doc(entryId);
                batch.update(entryRef, {
                    [`effectiveness_votes.${vote}`]: firestore_1.FieldValue.increment(1)
                });
            }
            await batch.commit();
        }
        catch (error) {
            console.error('Error voting on wisdom entry:', error);
            throw new Error('Failed to vote on wisdom entry');
        }
    }
    // === COLLECTIVE HEALING EXPERIENCES ===
    async createCollectiveExperience(facilitatorId, experienceData) {
        var _a;
        try {
            const experience = {
                name: experienceData.name,
                description: experienceData.description,
                type: experienceData.type,
                startDate: experienceData.startDate,
                endDate: experienceData.endDate,
                isActive: true,
                participantCount: 0,
                anonymousParticipants: [],
                prompts: experienceData.prompts.map((prompt, index) => (Object.assign(Object.assign({ id: `prompt_${index}`, experienceId: '' }, prompt), { responses: [] }))),
                createdAt: firestore_1.Timestamp.now(),
                facilitatorId
            };
            const docRef = await db.collection('collectiveExperiences').add(experience);
            // Update prompts with experience ID
            await docRef.update({
                'prompts': (_a = experience.prompts) === null || _a === void 0 ? void 0 : _a.map(prompt => (Object.assign(Object.assign({}, prompt), { experienceId: docRef.id })))
            });
            return docRef.id;
        }
        catch (error) {
            console.error('Error creating collective experience:', error);
            throw new Error('Failed to create collective experience');
        }
    }
    async joinCollectiveExperience(userId, experienceId) {
        try {
            const anonymousId = (0, communityUtils_1.generateAnonymousId)(userId, `experience_${experienceId}`);
            const experienceRef = db.collection('collectiveExperiences').doc(experienceId);
            await experienceRef.update({
                anonymousParticipants: firestore_1.FieldValue.arrayUnion(anonymousId),
                participantCount: firestore_1.FieldValue.increment(1)
            });
        }
        catch (error) {
            console.error('Error joining collective experience:', error);
            throw new Error('Failed to join collective experience');
        }
    }
    // === PEER MATCHING ===
    async createPeerMatchProfile(userId, profileData) {
        try {
            const anonymousId = (0, communityUtils_1.generateAnonymousId)(userId, 'peer_profile');
            const profile = {
                anonymousId,
                healingTopics: profileData.healingTopics,
                healingStage: profileData.healingStage,
                supportType: profileData.supportType,
                communicationStyle: profileData.communicationStyle,
                timeZone: profileData.timeZone,
                availability: profileData.availability,
                experienceWith: profileData.experienceWith,
                isActive: true,
                createdAt: firestore_1.Timestamp.now(),
                lastActiveAt: firestore_1.Timestamp.now()
            };
            await db.collection('peerMatchProfiles').doc(anonymousId).set(profile);
        }
        catch (error) {
            console.error('Error creating peer match profile:', error);
            throw new Error('Failed to create peer match profile');
        }
    }
    // === SAFETY & MODERATION ===
    async reportContent(userId, contentId, contentType, reason, description) {
        try {
            const reporterAnonymousId = (0, communityUtils_1.generateAnonymousId)(userId, 'report');
            const report = {
                contentId,
                contentType,
                reporterAnonymousId,
                reason,
                description,
                createdAt: firestore_1.Timestamp.now(),
                status: 'pending'
            };
            await db.collection('contentReports').add(report);
            // Increment report count on content
            const contentCollection = this.getContentCollectionName(contentType);
            await db.collection(contentCollection).doc(contentId).update({
                reportCount: firestore_1.FieldValue.increment(1)
            });
            // Auto-flag content if report threshold reached
            const contentDoc = await db.collection(contentCollection).doc(contentId).get();
            const contentData = contentDoc.data();
            if (contentData && contentData.reportCount >= 3) {
                await this.flagContentForReview(contentId, contentType, 'multiple_reports');
            }
        }
        catch (error) {
            console.error('Error reporting content:', error);
            throw new Error('Failed to report content');
        }
    }
    async logModerationAction(logData) {
        try {
            await db.collection('communityModerationLogs').add(logData);
        }
        catch (error) {
            console.error('Error logging moderation action:', error);
        }
    }
    async handleCrisisEscalation(userId, contentId, contentType, crisisLevel) {
        try {
            // Create crisis alert
            await db.collection('crisisAlerts').add({
                userId,
                contentId,
                contentType,
                crisisLevel: crisisLevel || 'medium',
                timestamp: firestore_1.Timestamp.now(),
                status: 'active'
            });
            // Log escalation
            await this.logModerationAction({
                contentType: contentType,
                contentId,
                action: 'escalated',
                escalationLevel: crisisLevel || 'medium',
                timestamp: firestore_1.Timestamp.now(),
                humanReviewRequired: true
            });
        }
        catch (error) {
            console.error('Error handling crisis escalation:', error);
        }
    }
    async flagContentForReview(contentId, contentType, reason) {
        try {
            const contentCollection = this.getContentCollectionName(contentType);
            await db.collection(contentCollection).doc(contentId).update({
                contentModerationStatus: 'flagged'
            });
            await this.logModerationAction({
                contentType: contentType,
                contentId,
                action: 'flagged',
                reason,
                timestamp: firestore_1.Timestamp.now(),
                humanReviewRequired: true
            });
        }
        catch (error) {
            console.error('Error flagging content for review:', error);
        }
    }
    getContentCollectionName(contentType) {
        const mapping = {
            'story': 'communityStories',
            'wisdom_entry': 'communityWisdom',
            'contribution': 'healingSessions',
            'response': 'collectiveExperiences'
        };
        return mapping[contentType] || 'unknown';
    }
}
exports.CommunityHealingService = CommunityHealingService;
//# sourceMappingURL=communityService.js.map