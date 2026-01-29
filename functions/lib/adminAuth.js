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
exports.verifyAdminToken = verifyAdminToken;
exports.verifyAdminAccess = verifyAdminAccess;
exports.createAdminUser = createAdminUser;
exports.checkAdminPermission = checkAdminPermission;
exports.updateAdminLastAccess = updateAdminLastAccess;
exports.anonymizeUserId = anonymizeUserId;
exports.sanitizeCrisisData = sanitizeCrisisData;
exports.logAdminAction = logAdminAction;
const admin = __importStar(require("firebase-admin"));
const crypto = __importStar(require("crypto"));
// Admin role permissions mapping
const ROLE_PERMISSIONS = {
    crisis_monitor: [
        "view_crisis_events",
        "view_analytics",
        "export_anonymized_data"
    ],
    crisis_supervisor: [
        "view_crisis_events",
        "view_analytics",
        "export_anonymized_data",
        "manage_alerts",
        "escalate_crisis",
        "resolve_crisis"
    ],
    system_admin: [
        "view_crisis_events",
        "view_analytics",
        "export_anonymized_data",
        "manage_alerts",
        "escalate_crisis",
        "resolve_crisis",
        "manage_admin_users",
        "system_configuration"
    ]
};
// Approved admin emails - in production, this should be in Firestore
const APPROVED_ADMIN_EMAILS = [
    // Add authorized admin emails here
    "admin@alchmapp.com",
    "crisis@alchmapp.com",
    "supervisor@alchmapp.com"
];
async function verifyAdminToken(authHeader) {
    try {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        const token = authHeader.split("Bearer ")[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        // Verify this is an admin user
        const isAdmin = await verifyAdminAccess(decodedToken.uid, decodedToken.email);
        if (!isAdmin) {
            console.warn(`Unauthorized admin access attempt: ${decodedToken.email}`);
            return null;
        }
        // Update last access time
        await updateAdminLastAccess(decodedToken.uid);
        return decodedToken;
    }
    catch (error) {
        console.error("Admin token verification error:", error);
        return null;
    }
}
async function verifyAdminAccess(uid, email) {
    try {
        const db = admin.firestore();
        // Check if user is in admin collection
        const adminDoc = await db.collection("adminUsers").doc(uid).get();
        if (adminDoc.exists) {
            const adminData = adminDoc.data();
            return adminData.verified && adminData.role in ROLE_PERMISSIONS;
        }
        // If not in admin collection but email is approved, create admin record
        if (email && APPROVED_ADMIN_EMAILS.includes(email.toLowerCase())) {
            await createAdminUser(uid, email, "crisis_monitor");
            return true;
        }
        return false;
    }
    catch (error) {
        console.error("Admin access verification error:", error);
        return false;
    }
}
async function createAdminUser(uid, email, role = "crisis_monitor") {
    const db = admin.firestore();
    const adminUser = {
        uid,
        email: email.toLowerCase(),
        role,
        permissions: ROLE_PERMISSIONS[role],
        verified: true,
        lastAccess: new Date()
    };
    await db.collection("adminUsers").doc(uid).set(Object.assign(Object.assign({}, adminUser), { createdAt: admin.firestore.FieldValue.serverTimestamp(), lastAccess: admin.firestore.FieldValue.serverTimestamp() }));
    console.log(`Admin user created: ${email} with role ${role}`);
    return adminUser;
}
async function checkAdminPermission(uid, permission) {
    try {
        const db = admin.firestore();
        const adminDoc = await db.collection("adminUsers").doc(uid).get();
        if (!adminDoc.exists) {
            return false;
        }
        const adminData = adminDoc.data();
        return adminData.verified && adminData.permissions.includes(permission);
    }
    catch (error) {
        console.error("Permission check error:", error);
        return false;
    }
}
async function updateAdminLastAccess(uid) {
    try {
        const db = admin.firestore();
        await db.collection("adminUsers").doc(uid).update({
            lastAccess: admin.firestore.FieldValue.serverTimestamp()
        });
    }
    catch (error) {
        console.error("Error updating admin last access:", error);
    }
}
// Privacy-preserving functions
function anonymizeUserId(userId) {
    // Create a consistent hash of the user ID for privacy
    const hash = crypto.createHash('sha256');
    hash.update(userId + process.env.CRISIS_ANONYMIZATION_SALT || 'alchm-default-salt');
    return hash.digest('hex').substring(0, 16);
}
function sanitizeCrisisData(crisisEvent) {
    // Remove all personally identifiable information
    const sanitized = {
        id: crisisEvent.id,
        anonymizedId: anonymizeUserId(crisisEvent.userId),
        analysisId: crisisEvent.analysisId,
        confidenceLevel: crisisEvent.confidenceLevel,
        reasoning: crisisEvent.reasoning,
        timestamp: crisisEvent.timestamp,
        escalated: crisisEvent.escalated,
        resolved: crisisEvent.resolved,
        resolvedAt: crisisEvent.resolvedAt
    };
    // Add non-identifying demographic info if available
    if (crisisEvent.demographics) {
        sanitized.demographics = {
            ageRange: crisisEvent.demographics.ageRange,
            language: crisisEvent.demographics.language
        };
    }
    if (crisisEvent.location) {
        sanitized.location = {
            country: crisisEvent.location.country,
            region: crisisEvent.location.region
        };
    }
    return sanitized;
}
async function logAdminAction(adminUid, action, details = {}) {
    try {
        const db = admin.firestore();
        await db.collection("adminAuditLog").add({
            adminUid,
            action,
            details,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            anonymizedDetails: sanitizeAuditDetails(details)
        });
    }
    catch (error) {
        console.error("Error logging admin action:", error);
    }
}
function sanitizeAuditDetails(details) {
    // Remove sensitive data from audit logs
    const sanitized = Object.assign({}, details);
    // Remove user IDs and replace with anonymized versions
    if (sanitized.userId) {
        sanitized.anonymizedUserId = anonymizeUserId(sanitized.userId);
        delete sanitized.userId;
    }
    // Remove other PII
    delete sanitized.email;
    delete sanitized.personalInfo;
    return sanitized;
}
//# sourceMappingURL=adminAuth.js.map