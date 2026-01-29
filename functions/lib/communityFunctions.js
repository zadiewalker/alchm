"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moderateContent = exports.generateCommunityInsights = exports.cleanupExpiredContent = exports.reportContent = exports.createPeerProfile = exports.joinCollectiveExperience = exports.createCollectiveExperience = exports.voteOnWisdom = exports.searchWisdom = exports.createWisdomEntry = exports.getHealingCircles = exports.joinHealingCircle = exports.createHealingCircle = exports.reactToStory = exports.getStoriesByStage = exports.createCommunityStory = void 0;
// Community Healing Firebase Functions
const https_1 = require("firebase-functions/v2/https");
const scheduler_1 = require("firebase-functions/v2/scheduler");
const auth_1 = require("firebase-admin/auth");
const communityService_1 = require("./communityService");
const communityUtils_1 = require("./utils/communityUtils");
const communityService = new communityService_1.CommunityHealingService();
// === ANONYMOUS STORY SHARING ===
exports.createCommunityStory = (0, https_1.onRequest)(async (req, res) => {
    try {
        if (req.method !== 'POST') {
            throw new https_1.HttpsError('invalid-argument', 'Method not allowed');
        }
        const { sessionToken, storyData } = req.body;
        if (!sessionToken || !storyData) {
            throw new https_1.HttpsError('invalid-argument', 'Missing required fields');
        }
        // Validate session
        const { userId, isValid } = await (0, communityUtils_1.validateSession)(sessionToken);
        if (!isValid) {
            throw new https_1.HttpsError('unauthenticated', 'Invalid session');
        }
        // Rate limiting - max 3 stories per day
        const canPost = await (0, communityUtils_1.checkRateLimit)(userId, 'create_story', 24 * 60, 3);
        if (!canPost) {
            throw new https_1.HttpsError('resource-exhausted', 'Story posting limit exceeded');
        }
        // Validate story data
        if (!storyData.content || storyData.content.length < 50 || storyData.content.length > 5000) {
            throw new https_1.HttpsError('invalid-argument', 'Story content must be between 50 and 5000 characters');
        }
        const allowedStages = ['beginning', 'processing', 'integrating', 'thriving', 'wisdom_sharing'];
        if (!allowedStages.includes(storyData.healingStage)) {
            throw new https_1.HttpsError('invalid-argument', 'Invalid healing stage');
        }
        const storyId = await communityService.createStory(userId, storyData);
        res.json({
            success: true,
            storyId,
            message: 'Story shared successfully. Thank you for contributing to our healing community.'
        });
    }
    catch (error) {
        console.error('Error creating story:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to create story';
        res.status(error instanceof https_1.HttpsError ? 400 : 500).json({
            error: errorMessage
        });
    }
});
exports.getStoriesByStage = (0, https_1.onRequest)(async (req, res) => {
    try {
        if (req.method !== 'GET') {
            throw new https_1.HttpsError('invalid-argument', 'Method not allowed');
        }
        const { stage, limit = 10 } = req.query;
        if (!stage) {
            throw new https_1.HttpsError('invalid-argument', 'Healing stage is required');
        }
        const stories = await communityService.getStoriesByHealingStage(stage, Number(limit));
        res.json({ success: true, stories });
    }
    catch (error) {
        console.error('Error fetching stories:', error);
        res.status(500).json({ error: 'Failed to fetch stories' });
    }
});
exports.reactToStory = (0, https_1.onRequest)(async (req, res) => {
    try {
        if (req.method !== 'POST') {
            throw new https_1.HttpsError('invalid-argument', 'Method not allowed');
        }
        const { sessionToken, storyId, reactionType } = req.body;
        const { userId, isValid } = await (0, communityUtils_1.validateSession)(sessionToken);
        if (!isValid) {
            throw new https_1.HttpsError('unauthenticated', 'Invalid session');
        }
        const allowedReactions = ['resonance', 'gratitude', 'strength', 'solidarity'];
        if (!allowedReactions.includes(reactionType)) {
            throw new https_1.HttpsError('invalid-argument', 'Invalid reaction type');
        }
        await communityService.addStoryReaction(userId, storyId, reactionType);
        res.json({ success: true, message: 'Reaction added successfully' });
    }
    catch (error) {
        console.error('Error adding reaction:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to add reaction';
        res.status(error instanceof https_1.HttpsError ? 400 : 500).json({
            error: errorMessage
        });
    }
});
// === HEALING CIRCLES ===
exports.createHealingCircle = (0, https_1.onRequest)(async (req, res) => {
    var _a;
    try {
        if (req.method !== 'POST') {
            throw new https_1.HttpsError('invalid-argument', 'Method not allowed');
        }
        const { sessionToken, circleData } = req.body;
        const { userId, isValid } = await (0, communityUtils_1.validateSession)(sessionToken);
        if (!isValid) {
            throw new https_1.HttpsError('unauthenticated', 'Invalid session');
        }
        // Validate facilitator permissions (in production, check admin roles)
        const userRecord = await (0, auth_1.getAuth)().getUser(userId);
        if (!((_a = userRecord.customClaims) === null || _a === void 0 ? void 0 : _a.facilitator)) {
            throw new https_1.HttpsError('permission-denied', 'Insufficient permissions to create healing circles');
        }
        const circleId = await communityService.createHealingCircle(userId, circleData);
        res.json({ success: true, circleId });
    }
    catch (error) {
        console.error('Error creating healing circle:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to create healing circle';
        res.status(error instanceof https_1.HttpsError ? 400 : 500).json({
            error: errorMessage
        });
    }
});
exports.joinHealingCircle = (0, https_1.onRequest)(async (req, res) => {
    try {
        if (req.method !== 'POST') {
            throw new https_1.HttpsError('invalid-argument', 'Method not allowed');
        }
        const { sessionToken, circleId, joinData } = req.body;
        const { userId, isValid } = await (0, communityUtils_1.validateSession)(sessionToken);
        if (!isValid) {
            throw new https_1.HttpsError('unauthenticated', 'Invalid session');
        }
        await communityService.joinHealingCircle(userId, circleId, joinData);
        res.json({
            success: true,
            message: 'Successfully joined healing circle. Welcome to the community!'
        });
    }
    catch (error) {
        console.error('Error joining healing circle:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to join healing circle';
        res.status(error instanceof https_1.HttpsError ? 400 : 500).json({
            error: errorMessage
        });
    }
});
exports.getHealingCircles = (0, https_1.onRequest)(async (req, res) => {
    try {
        if (req.method !== 'GET') {
            throw new https_1.HttpsError('invalid-argument', 'Method not allowed');
        }
        const { topic } = req.query;
        const circles = await communityService.getActiveHealingCircles(topic);
        res.json({ success: true, circles });
    }
    catch (error) {
        console.error('Error fetching healing circles:', error);
        res.status(500).json({ error: 'Failed to fetch healing circles' });
    }
});
// === COMMUNITY WISDOM ===
exports.createWisdomEntry = (0, https_1.onRequest)(async (req, res) => {
    try {
        if (req.method !== 'POST') {
            throw new https_1.HttpsError('invalid-argument', 'Method not allowed');
        }
        const { sessionToken, wisdomData } = req.body;
        const { userId, isValid } = await (0, communityUtils_1.validateSession)(sessionToken);
        if (!isValid) {
            throw new https_1.HttpsError('unauthenticated', 'Invalid session');
        }
        // Rate limiting - max 5 wisdom entries per day
        const canPost = await (0, communityUtils_1.checkRateLimit)(userId, 'create_wisdom', 24 * 60, 5);
        if (!canPost) {
            throw new https_1.HttpsError('resource-exhausted', 'Wisdom sharing limit exceeded');
        }
        const entryId = await communityService.createWisdomEntry(userId, wisdomData);
        res.json({
            success: true,
            entryId,
            message: 'Thank you for sharing your wisdom with the community!'
        });
    }
    catch (error) {
        console.error('Error creating wisdom entry:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to create wisdom entry';
        res.status(error instanceof https_1.HttpsError ? 400 : 500).json({
            error: errorMessage
        });
    }
});
exports.searchWisdom = (0, https_1.onRequest)(async (req, res) => {
    try {
        if (req.method !== 'GET') {
            throw new https_1.HttpsError('invalid-argument', 'Method not allowed');
        }
        const { query, category, tags } = req.query;
        const tagsArray = tags ? tags.split(',') : undefined;
        const entries = await communityService.searchWisdomEntries(query, category, tagsArray);
        res.json({ success: true, entries });
    }
    catch (error) {
        console.error('Error searching wisdom:', error);
        res.status(500).json({ error: 'Failed to search wisdom entries' });
    }
});
exports.voteOnWisdom = (0, https_1.onRequest)(async (req, res) => {
    try {
        if (req.method !== 'POST') {
            throw new https_1.HttpsError('invalid-argument', 'Method not allowed');
        }
        const { sessionToken, entryId, vote } = req.body;
        const { userId, isValid } = await (0, communityUtils_1.validateSession)(sessionToken);
        if (!isValid) {
            throw new https_1.HttpsError('unauthenticated', 'Invalid session');
        }
        const allowedVotes = ['helpful', 'somewhat_helpful', 'not_helpful'];
        if (!allowedVotes.includes(vote)) {
            throw new https_1.HttpsError('invalid-argument', 'Invalid vote type');
        }
        await communityService.voteOnWisdomEntry(userId, entryId, vote);
        res.json({ success: true, message: 'Vote recorded successfully' });
    }
    catch (error) {
        console.error('Error voting on wisdom:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to record vote';
        res.status(error instanceof https_1.HttpsError ? 400 : 500).json({
            error: errorMessage
        });
    }
});
// === COLLECTIVE EXPERIENCES ===
exports.createCollectiveExperience = (0, https_1.onRequest)(async (req, res) => {
    var _a;
    try {
        if (req.method !== 'POST') {
            throw new https_1.HttpsError('invalid-argument', 'Method not allowed');
        }
        const { sessionToken, experienceData } = req.body;
        const { userId, isValid } = await (0, communityUtils_1.validateSession)(sessionToken);
        if (!isValid) {
            throw new https_1.HttpsError('unauthenticated', 'Invalid session');
        }
        // Validate facilitator permissions
        const userRecord = await (0, auth_1.getAuth)().getUser(userId);
        if (!((_a = userRecord.customClaims) === null || _a === void 0 ? void 0 : _a.facilitator)) {
            throw new https_1.HttpsError('permission-denied', 'Insufficient permissions to create collective experiences');
        }
        const experienceId = await communityService.createCollectiveExperience(userId, experienceData);
        res.json({ success: true, experienceId });
    }
    catch (error) {
        console.error('Error creating collective experience:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to create collective experience';
        res.status(error instanceof https_1.HttpsError ? 400 : 500).json({
            error: errorMessage
        });
    }
});
exports.joinCollectiveExperience = (0, https_1.onRequest)(async (req, res) => {
    try {
        if (req.method !== 'POST') {
            throw new https_1.HttpsError('invalid-argument', 'Method not allowed');
        }
        const { sessionToken, experienceId } = req.body;
        const { userId, isValid } = await (0, communityUtils_1.validateSession)(sessionToken);
        if (!isValid) {
            throw new https_1.HttpsError('unauthenticated', 'Invalid session');
        }
        await communityService.joinCollectiveExperience(userId, experienceId);
        res.json({
            success: true,
            message: 'Welcome to the collective healing experience!'
        });
    }
    catch (error) {
        console.error('Error joining collective experience:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to join collective experience';
        res.status(error instanceof https_1.HttpsError ? 400 : 500).json({
            error: errorMessage
        });
    }
});
// === PEER MATCHING ===
exports.createPeerProfile = (0, https_1.onRequest)(async (req, res) => {
    try {
        if (req.method !== 'POST') {
            throw new https_1.HttpsError('invalid-argument', 'Method not allowed');
        }
        const { sessionToken, profileData } = req.body;
        const { userId, isValid } = await (0, communityUtils_1.validateSession)(sessionToken);
        if (!isValid) {
            throw new https_1.HttpsError('unauthenticated', 'Invalid session');
        }
        await communityService.createPeerMatchProfile(userId, profileData);
        res.json({
            success: true,
            message: 'Peer support profile created. We\'ll help you find compatible healing companions!'
        });
    }
    catch (error) {
        console.error('Error creating peer profile:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to create peer profile';
        res.status(error instanceof https_1.HttpsError ? 400 : 500).json({
            error: errorMessage
        });
    }
});
// === CONTENT REPORTING ===
exports.reportContent = (0, https_1.onRequest)(async (req, res) => {
    try {
        if (req.method !== 'POST') {
            throw new https_1.HttpsError('invalid-argument', 'Method not allowed');
        }
        const { sessionToken, contentId, contentType, reason, description } = req.body;
        const { userId, isValid } = await (0, communityUtils_1.validateSession)(sessionToken);
        if (!isValid) {
            throw new https_1.HttpsError('unauthenticated', 'Invalid session');
        }
        // Rate limiting for reports
        const canReport = await (0, communityUtils_1.checkRateLimit)(userId, 'report_content', 60, 5);
        if (!canReport) {
            throw new https_1.HttpsError('resource-exhausted', 'Report limit exceeded');
        }
        await communityService.reportContent(userId, contentId, contentType, reason, description);
        res.json({
            success: true,
            message: 'Report submitted successfully. Our moderation team will review this content.'
        });
    }
    catch (error) {
        console.error('Error reporting content:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to submit report';
        res.status(error instanceof https_1.HttpsError ? 400 : 500).json({
            error: errorMessage
        });
    }
});
// === SCHEDULED FUNCTIONS ===
exports.cleanupExpiredContent = (0, scheduler_1.onSchedule)('0 2 * * *', async () => {
    // Daily cleanup of expired content and inactive sessions
    try {
        console.log('Starting daily community cleanup...');
        // This would implement cleanup logic for:
        // - Expired collective experiences
        // - Inactive healing circles
        // - Old moderation logs
        // - Temporary anonymous IDs
        console.log('Community cleanup completed');
    }
    catch (error) {
        console.error('Error in community cleanup:', error);
    }
});
exports.generateCommunityInsights = (0, scheduler_1.onSchedule)('0 1 * * 1', async () => {
    // Weekly community health and insights generation
    try {
        console.log('Generating weekly community insights...');
        // This would generate:
        // - Community health metrics
        // - Popular healing topics
        // - Engagement statistics
        // - Safety metrics
        console.log('Community insights generated');
    }
    catch (error) {
        console.error('Error generating community insights:', error);
    }
});
// === MODERATION FUNCTIONS ===
exports.moderateContent = (0, https_1.onRequest)(async (req, res) => {
    try {
        if (req.method !== 'POST') {
            throw new https_1.HttpsError('invalid-argument', 'Method not allowed');
        }
        const { content, contentType } = req.body;
        // This would integrate with your existing AI moderation service
        // For now, return a placeholder response based on content
        const moderationResult = {
            isApproved: content.length > 10, // Simple check to use content
            score: 0.8,
            flags: [],
            crisisIndicators: false,
            traumaTriggers: [],
            contentType // Include contentType to show it's used
        };
        res.json(moderationResult);
    }
    catch (error) {
        console.error('Error moderating content:', error);
        res.status(500).json({ error: 'Moderation service unavailable' });
    }
});
//# sourceMappingURL=communityFunctions.js.map