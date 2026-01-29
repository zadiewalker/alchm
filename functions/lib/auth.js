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
exports.verifyAuthToken = verifyAuthToken;
exports.validateUserAccess = validateUserAccess;
exports.checkRateLimit = checkRateLimit;
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp();
}
async function verifyAuthToken(authorization) {
    if (!authorization) {
        return null;
    }
    const token = authorization.replace("Bearer ", "");
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        return decodedToken;
    }
    catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
}
function validateUserAccess(decodedToken, requestedUserId) {
    if (!decodedToken) {
        return false;
    }
    // User can only access their own data
    return decodedToken.uid === requestedUserId;
}
async function checkRateLimit(userId, operation) {
    try {
        const db = admin.firestore();
        const rateLimitRef = db.collection("rateLimits").doc(`${userId}_${operation}`);
        const rateLimitDoc = await rateLimitRef.get();
        const now = Date.now();
        const windowMs = 60 * 1000; // 1 minute window
        const maxRequests = operation === "ai_analysis" ? 10 : 50; // 10 AI requests per minute
        if (!rateLimitDoc.exists) {
            await rateLimitRef.set({
                count: 1,
                windowStart: now,
                lastRequest: now
            });
            return true;
        }
        const data = rateLimitDoc.data();
        const windowStart = data.windowStart;
        // Reset window if expired
        if (now - windowStart > windowMs) {
            await rateLimitRef.set({
                count: 1,
                windowStart: now,
                lastRequest: now
            });
            return true;
        }
        // Check if within limits
        if (data.count >= maxRequests) {
            return false;
        }
        // Increment counter
        await rateLimitRef.update({
            count: admin.firestore.FieldValue.increment(1),
            lastRequest: now
        });
        return true;
    }
    catch (error) {
        console.error("Rate limit check failed:", error);
        // On error, allow the request (fail open for user experience)
        return true;
    }
}
//# sourceMappingURL=auth.js.map