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
exports.healthCheck = exports.detectCrisis = void 0;
// ALCHM Minimal Production Functions - Firebase Studio Deployment
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
// Essential crisis detection patterns
const CRISIS_PATTERNS = [
    'suicide', 'kill myself', 'end it all', 'not worth living', 'want to die'
];
// Minimal crisis detection function
exports.detectCrisis = functions.https.onRequest(async (req, res) => {
    try {
        const { text, userId } = req.body;
        if (!text || !userId) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        const isCrisis = CRISIS_PATTERNS.some(pattern => text.toLowerCase().includes(pattern.toLowerCase()));
        if (isCrisis) {
            // Log crisis detection for monitoring
            await db.collection('crisis_alerts').add({
                userId,
                text: text.substring(0, 100), // Truncate for privacy
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                priority: 'high'
            });
        }
        res.json({
            crisis_detected: isCrisis,
            resources: isCrisis ? {
                helpline: '988',
                text: '741741',
                chat: 'https://suicidepreventionlifeline.org/chat/'
            } : null
        });
    }
    catch (error) {
        console.error('Crisis detection error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Health check function
exports.healthCheck = functions.https.onRequest((req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});
