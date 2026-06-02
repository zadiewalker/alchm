import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";

if (!admin.apps.length) {
  admin.initializeApp();
}

export const healthCheck = onRequest((_req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "ALCHM Health Check",
  });
});

export {
  exportUserData,
  requestAccountDeletion,
  verifyAccountDeletion,
  cancelAccountDeletion,
  processAccountDeletions,
} from "./privacyService";

export {
  enforceUserDataRetention,
  updateDataRetentionPreferences,
  getDataRetentionStats,
  enforceDataRetentionPolicies,
} from "./dataRetentionService";

export {
  withdrawConsent,
  regrantConsent,
  getUserConsentHistory,
  checkConsentExpiry,
} from "./consentService";

export {
  getUserAuditTrail,
  generateComplianceAuditReport,
  detectAuditAnomalies,
} from "./auditService";

export {
  processBudgetAlert,
  trackDailyCosts,
  cleanupOldUsageData,
} from "./budgetAlerts";

export { generateKheperaReflection } from "./kheperaGateway";
export { activateContainer, advanceSanctuaryContainer } from "./containerTransitions";
