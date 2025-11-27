"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextjsApp = exports.subscriptionWebhook = exports.chatWithGemini = exports.status = exports.validateUserSession = exports.listJournalEntries = exports.saveJournalEntry = exports.healthCheck = exports.emergencyResources = exports.crisisDetectionCallable = exports.crisisDetection = void 0;
// ALCHM Production Functions - Clean Deployment
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin only once
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
// Import crisis patterns
const { CRITICAL_CRISIS_PATTERNS } = require('./emergency-crisis-patterns');
// Crisis Detection Function (HTTP Request)
exports.crisisDetection = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    try {
        const { text } = req.body;
        if (!text) {
            res.status(400).json({ error: 'Text is required' });
            return;
        }
        const allPatterns = [
            ...CRITICAL_CRISIS_PATTERNS.english,
            ...CRITICAL_CRISIS_PATTERNS.spanish,
            ...CRITICAL_CRISIS_PATTERNS.portuguese,
            ...CRITICAL_CRISIS_PATTERNS.german
        ];
        const detected = allPatterns.some(pattern => text.toLowerCase().includes(pattern.toLowerCase()));
        res.json({
            crisisDetected: detected,
            resources: detected ? [
                { name: '988 Suicide & Crisis Lifeline', contact: '988', type: 'phone' },
                { name: 'Crisis Text Line', contact: '741741', type: 'text' },
                { name: 'International Lifeline', contact: 'https://findahelpline.com', type: 'web' }
            ] : [],
            timestamp: new Date().toISOString(),
            multilingual: true
        });
    }
    catch (error) {
        console.error('Crisis detection error:', error);
        res.status(500).json({
            error: 'Crisis detection failed',
            fallback: {
                crisisDetected: true, // Default to crisis detected for safety
                resources: [
                    { name: '988 Suicide & Crisis Lifeline', contact: '988', type: 'phone' },
                    { name: 'Crisis Text Line', contact: '741741', type: 'text' }
                ]
            }
        });
    }
});
// Crisis Detection Callable
exports.crisisDetectionCallable = functions.https.onCall(async (data, context) => {
    const { text } = data;
    const allPatterns = [
        ...CRITICAL_CRISIS_PATTERNS.english,
        ...CRITICAL_CRISIS_PATTERNS.spanish,
        ...CRITICAL_CRISIS_PATTERNS.portuguese,
        ...CRITICAL_CRISIS_PATTERNS.german
    ];
    const detected = allPatterns.some(pattern => text?.toLowerCase().includes(pattern.toLowerCase()));
    return {
        crisisDetected: detected,
        resources: detected ? [
            { name: '988 Suicide & Crisis Lifeline', contact: '988', type: 'phone' },
            { name: 'Crisis Text Line', contact: '741741', type: 'text' }
        ] : [],
        timestamp: new Date().toISOString(),
        multilingual: true
    };
});
// Emergency Resources
exports.emergencyResources = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.json({
        resources: [
            { name: '988 Suicide & Crisis Lifeline', contact: '988', type: 'phone' },
            { name: 'Crisis Text Line', contact: '741741', type: 'text' },
            { name: 'LGBTQ National Hotline', contact: '1-888-843-4564', type: 'phone' },
            { name: 'RAINN National Sexual Assault Hotline', contact: '1-800-656-4673', type: 'phone' },
            { name: 'National Domestic Violence Hotline', contact: '1-800-799-7233', type: 'phone' }
        ],
        timestamp: new Date().toISOString(),
        multilingual: true
    });
});
// Health Check
exports.healthCheck = functions.https.onRequest((req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'alchm-functions',
        version: '2.1.0',
        message: 'ALCHM trauma-informed platform is operational',
        crisisSafety: 'maximum'
    });
});
// Journal Functions
exports.saveJournalEntry = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
        }
        const userId = context.auth.uid;
        const { content, mood, timestamp } = data;
        if (!content || typeof content !== 'string') {
            throw new functions.https.HttpsError('invalid-argument', 'Content is required');
        }
        const entryData = {
            userId,
            content: content.substring(0, 10000),
            mood: mood || null,
            timestamp: timestamp || admin.firestore.FieldValue.serverTimestamp(),
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            privacy: 'private'
        };
        const docRef = await db.collection('journals').add(entryData);
        return {
            success: true,
            entryId: docRef.id,
            timestamp: new Date().toISOString()
        };
    }
    catch (error) {
        console.error('Error saving journal entry:', error);
        throw new functions.https.HttpsError('internal', 'Failed to save journal entry');
    }
});
exports.listJournalEntries = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    try {
        res.status(200).json({
            success: true,
            entries: [],
            message: 'Journal entries endpoint active',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Error listing journal entries:', error);
        res.status(500).json({
            error: 'Failed to list journal entries',
            timestamp: new Date().toISOString()
        });
    }
});
// User Session Validation
exports.validateUserSession = functions.https.onCall(async (data, context) => {
    try {
        if (!context.auth) {
            return { valid: false, message: 'Not authenticated' };
        }
        const userId = context.auth.uid;
        const userEmail = context.auth.token.email;
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            await db.collection('users').doc(userId).set({
                email: userEmail,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                lastActive: admin.firestore.FieldValue.serverTimestamp(),
                privacy: {
                    dataProcessing: 'minimal',
                    aiOptOut: false
                }
            });
        }
        else {
            await db.collection('users').doc(userId).update({
                lastActive: admin.firestore.FieldValue.serverTimestamp()
            });
        }
        return {
            valid: true,
            userId,
            timestamp: new Date().toISOString()
        };
    }
    catch (error) {
        console.error('Error validating user session:', error);
        return { valid: false, message: 'Session validation failed' };
    }
});
// Status endpoint
exports.status = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Cache-Control', 'no-cache');
    res.json({
        status: 'healthy',
        service: 'alchm-functions',
        version: '2.1.0',
        timestamp: new Date().toISOString(),
        functions: {
            crisisDetection: 'active',
            crisisDetectionCallable: 'active',
            emergencyResources: 'active',
            healthCheck: 'active',
            saveJournalEntry: 'active',
            listJournalEntries: 'active',
            validateUserSession: 'active'
        },
        crisisSafety: 'maximum',
        multilingualSupport: true
    });
});
// Basic placeholder functions for compatibility
exports.chatWithGemini = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    res.status(200).json({
        message: 'Khepera AI endpoint active',
        status: 'operational',
        timestamp: new Date().toISOString()
    });
});
exports.subscriptionWebhook = functions.https.onRequest((req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type, stripe-signature');
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    res.status(200).json({
        message: 'Stripe webhook endpoint active',
        status: 'received',
        timestamp: new Date().toISOString()
    });
});
// Next.js App Export
var nextApp_1 = require("./nextApp");
Object.defineProperty(exports, "nextjsApp", { enumerable: true, get: function () { return nextApp_1.nextjsApp; } });
