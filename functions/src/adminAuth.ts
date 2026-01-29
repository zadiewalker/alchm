import * as admin from "firebase-admin";
import { AdminUser } from "./types";
import * as crypto from "crypto";

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

export async function verifyAdminToken(authHeader?: string): Promise<admin.auth.DecodedIdToken | null> {
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
  } catch (error) {
    console.error("Admin token verification error:", error);
    return null;
  }
}

export async function verifyAdminAccess(uid: string, email?: string): Promise<boolean> {
  try {
    const db = admin.firestore();
    
    // Check if user is in admin collection
    const adminDoc = await db.collection("adminUsers").doc(uid).get();
    
    if (adminDoc.exists) {
      const adminData = adminDoc.data() as AdminUser;
      return adminData.verified && adminData.role in ROLE_PERMISSIONS;
    }

    // If not in admin collection but email is approved, create admin record
    if (email && APPROVED_ADMIN_EMAILS.includes(email.toLowerCase())) {
      await createAdminUser(uid, email, "crisis_monitor");
      return true;
    }

    return false;
  } catch (error) {
    console.error("Admin access verification error:", error);
    return false;
  }
}

export async function createAdminUser(
  uid: string, 
  email: string, 
  role: keyof typeof ROLE_PERMISSIONS = "crisis_monitor"
): Promise<AdminUser> {
  const db = admin.firestore();
  
  const adminUser: AdminUser = {
    uid,
    email: email.toLowerCase(),
    role,
    permissions: ROLE_PERMISSIONS[role],
    verified: true,
    lastAccess: new Date()
  };

  await db.collection("adminUsers").doc(uid).set({
    ...adminUser,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    lastAccess: admin.firestore.FieldValue.serverTimestamp()
  });

  console.log(`Admin user created: ${email} with role ${role}`);
  return adminUser;
}

export async function checkAdminPermission(
  uid: string, 
  permission: string
): Promise<boolean> {
  try {
    const db = admin.firestore();
    const adminDoc = await db.collection("adminUsers").doc(uid).get();
    
    if (!adminDoc.exists) {
      return false;
    }

    const adminData = adminDoc.data() as AdminUser;
    return adminData.verified && adminData.permissions.includes(permission);
  } catch (error) {
    console.error("Permission check error:", error);
    return false;
  }
}

export async function updateAdminLastAccess(uid: string): Promise<void> {
  try {
    const db = admin.firestore();
    await db.collection("adminUsers").doc(uid).update({
      lastAccess: admin.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error("Error updating admin last access:", error);
  }
}

// Privacy-preserving functions
export function anonymizeUserId(userId: string): string {
  // Create a consistent hash of the user ID for privacy
  const hash = crypto.createHash('sha256');
  hash.update(userId + process.env.CRISIS_ANONYMIZATION_SALT || 'alchm-default-salt');
  return hash.digest('hex').substring(0, 16);
}

export function sanitizeCrisisData(crisisEvent: any): any {
  // Remove all personally identifiable information
  const sanitized: any = {
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

export async function logAdminAction(
  adminUid: string, 
  action: string, 
  details: any = {}
): Promise<void> {
  try {
    const db = admin.firestore();
    await db.collection("adminAuditLog").add({
      adminUid,
      action,
      details,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      anonymizedDetails: sanitizeAuditDetails(details)
    });
  } catch (error) {
    console.error("Error logging admin action:", error);
  }
}

function sanitizeAuditDetails(details: any): any {
  // Remove sensitive data from audit logs
  const sanitized = { ...details };
  
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