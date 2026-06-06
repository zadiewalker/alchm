import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = (relativePath) => fs.readFileSync(path.join(repo, relativePath), 'utf8');

test('privacy export and deletion include canonical user journal data', () => {
  const privacy = read('functions/src/privacyService.ts');
  const dataRightsMap = read('DATA_RIGHTS_MAP.md');
  const exportGuard = privacy.indexOf('if (!SECURE_DATA_EXPORT_DELIVERY_ENABLED)');
  const exportWrite = privacy.indexOf('db.collection("dataExportRequests").add');
  const deletionGuard = privacy.indexOf('if (!VERIFIED_DELETION_REQUEST_DELIVERY_ENABLED)');
  const deletionWrite = privacy.indexOf('db.collection("accountDeletionRequests").add');
  const deletionProcessor = privacy.slice(privacy.indexOf('export const processAccountDeletions'));
  const deletionProcessingGuard = deletionProcessor.indexOf('if (!ACCOUNT_DELETION_PROCESSING_ENABLED)');
  const deletionProcessingRead = deletionProcessor.indexOf('db.collection("accountDeletionRequests")');

  assert.match(privacy, /\.collection\(["']users["']\)\.doc\(userId\)\s*\.collection\(["']sessions["']\)/s);
  assert.match(privacy, /CANONICAL_USER_SUBCOLLECTIONS/);
  assert.match(privacy, /["']sessions["']/);
  assert.match(privacy, /["']khepera["']/);
  assert.match(privacy, /["']kheperaDelayedReflections["']/);
  assert.match(privacy, /["']containers["']/);
  assert.match(privacy, /["']containerState["']/);
  assert.match(privacy, /kheperaMemory/);
  assert.match(privacy, /delayedReflections/);
  assert.match(privacy, /continuityRecords/);
  assert.match(privacy, /collectUserOwnedDocuments\(userRef\.collection\("khepera"\)\)/);
  assert.match(privacy, /collectUserOwnedDocuments\(userRef\.collection\("kheperaDelayedReflections"\)\)/);
  assert.match(privacy, /collectUserOwnedDocuments\(userRef\.collection\("containers"\)\)/);
  assert.match(privacy, /collectUserOwnedDocuments\(userRef\.collection\("containerState"\)\)/);
  assert.match(privacy, /serializeFirestoreValue/);
  assert.match(privacy, /kheperaResponse:/);
  assert.match(privacy, /reflectionTiming:/);
  assert.doesNotMatch(privacy, /originalUserId:\s*userId/);
  assert.match(dataRightsMap, /users\/\{uid\}\/sessions\/\{entryId\}/);
  assert.match(dataRightsMap, /IndexedDB/);
  assert.match(dataRightsMap, /continuity\/provenance records are mapped in Functions source/);
  assert.match(dataRightsMap, /user-facing export remains unavailable until secure delivery/);
  assert.match(privacy, /SECURE_DATA_EXPORT_DELIVERY_ENABLED = false/);
  assert.match(privacy, /VERIFIED_DELETION_REQUEST_DELIVERY_ENABLED = false/);
  assert.match(privacy, /ACCOUNT_DELETION_PROCESSING_ENABLED = false/);
  assert.ok(exportGuard !== -1 && exportWrite !== -1 && exportGuard < exportWrite);
  assert.ok(deletionGuard !== -1 && deletionWrite !== -1 && deletionGuard < deletionWrite);
  assert.ok(
    deletionProcessingGuard !== -1
      && deletionProcessingRead !== -1
      && deletionProcessingGuard < deletionProcessingRead,
  );
  assert.match(privacy, /Data export is unavailable until secure delivery is configured/);
  assert.match(privacy, /Account deletion requests are unavailable until verification delivery is configured/);
  assert.match(privacy, /Account deletion processing is disabled pending verified request delivery and policy review/);
});

test('retention covers canonical sessions and cannot enable inactivity deletion', () => {
  const retention = read('functions/src/dataRetentionService.ts');
  const automatedGuard = retention.indexOf('if (!AUTOMATED_RETENTION_ENFORCEMENT_ENABLED)');
  const settingsRead = retention.indexOf('db.collection("userPrivacySettings").get()');
  const manualEnforcement = retention.slice(retention.indexOf('export const enforceUserDataRetention'));

  assert.match(retention, /\.collection\(["']users["']\)\.doc\(userId\)\s*\.collection\(["']sessions["']\)/s);
  assert.match(retention, /AUTOMATED_RETENTION_ENFORCEMENT_ENABLED = false/);
  assert.ok(automatedGuard !== -1 && settingsRead !== -1 && automatedGuard < settingsRead);
  assert.match(retention, /Automatic inactivity deletion is disabled/);
  assert.match(retention, /automaticDeletion === true/);
  assert.doesNotMatch(retention, /scheduleAccountForAutomaticDeletion|createInactivityWarning/);
  assert.match(manualEnforcement, /Manual retention enforcement is unavailable pending verified user authorization and policy review/);
});

test('settings describes local preference reset without claiming journal deletion', () => {
  const settingsPage = read('src/app/settings/page.tsx');

  assert.match(settingsPage, /Reset local preferences/);
  assert.match(settingsPage, /does not delete journal entries or account data/);
  assert.doesNotMatch(settingsPage, /permanently delete all journal entries|Delete everything/);
});

test('client Khepera paths cannot invoke provider key modules directly', () => {
  const modelProvider = read('src/services/ai/modelProvider.ts');
  const clientProviders = [
    read('src/services/ai/anthropicProvider.ts'),
    read('src/services/ai/openAIProvider.ts'),
  ].join('\n');
  const gateway = read('functions/src/kheperaGateway.ts');
  const gatewayCore = read('functions/src/kheperaGatewayCore.ts');
  const mirrorService = read('src/services/mirror/mirrorService.ts');
  const kheperaService = read('src/services/khepera/service.ts');
  const clientCallers = [
    'src/services/khepera/generateResponse.ts',
    'src/services/khepera/extractThemes.ts',
    'src/services/khepera/service.ts',
    'src/services/journal/submissionPipeline.ts',
    'src/services/journal/processQueuedEntry.ts',
  ].map(read).join('\n');

  assert.doesNotMatch(modelProvider, /anthropicProvider|openAIProvider|requestAnthropicText|requestOpenAIText/);
  assert.match(modelProvider, /httpsCallable/);
  assert.match(modelProvider, /generateKheperaReflection/);
  assert.doesNotMatch(clientCallers, /anthropicProvider|openAIProvider/);
  assert.doesNotMatch(clientProviders, /API_KEY|api\.openai\.com|api\.anthropic\.com|fetch\(/);
  assert.match(gateway, /process\.env\.ANTHROPIC_API_KEY/);
  assert.doesNotMatch(gateway, /process\.env\.OPENAI_API_KEY|new OpenAI/);
  assert.match(gateway, /provider: "anthropic"/);
  assert.match(gateway, /context\.auth\?\.uid/);
  assert.match(gatewayCore, /detectCrisisSignals/);
  assert.match(gatewayCore, /validateKheperaOutput/);
  assert.doesNotMatch(gateway, /console\.(?:log|info|warn|error)\([^)]*entryText|entryText[^)]*console\.(?:log|info|warn|error)/s);
  assert.match(gateway, /persistGeneratedSession/);
  assert.match(gateway, /\.collection\("sessions"\)/);
  assert.match(gateway, /generatedBy: "server"/);
  assert.match(gateway, /validatedAt: admin\.firestore\.FieldValue\.serverTimestamp\(\)/);
  assert.doesNotMatch(kheperaService, /\/api\/khepera\/onboarding|fetch\(/);
  assert.doesNotMatch(mirrorService, /\/api\/khepera\/mirror-observation|fetch\(/);
});

test('privacy and terms only state behavior currently enforced by the build', () => {
  const privacy = read('src/app/privacy-policy/page.tsx');
  const terms = read('src/app/terms/page.tsx');

  assert.match(privacy, /processing is routed through an authenticated server-controlled gateway/);
  assert.match(privacy, /remains unavailable unless that gateway is deployed and configured/);
  assert.match(privacy, /does not delete journal entries or\s+account data/);
  assert.doesNotMatch(privacy, /AES-256|end-to-end encryption|complete control|automatic deletion|OpenAI API/);
  assert.match(terms, /stored in ALCHM&apos;s\s*cloud data store/);
  assert.match(terms, /authenticated server-controlled gateway/);
  assert.doesNotMatch(terms, /stored locally on your device\./);
});

test('journal submission does not automatically schedule return notifications', () => {
  const journalHook = read('src/hooks/useJournal.ts');
  const appShell = read('src/components/shell/AppShell.tsx');
  const notificationService = read('src/services/notifications/notificationService.ts');
  const localReminderService = read('src/services/notifications/localReminderService.ts');
  const operatingRules = read('docs/integrity/OPERATING_RULES.md');

  assert.doesNotMatch(journalHook, /scheduleNotification\('seedReturn'/);
  assert.doesNotMatch(appShell, /NotificationPermissionPrompt/);
  assert.match(notificationService, /RETURN_NOTIFICATION_SCHEDULING_ENABLED = false/);
  assert.match(notificationService, /Return notifications are unavailable until explicit user-choice handling is verified/);
  assert.doesNotMatch(localReminderService, /LocalNotifications\.schedule/);
  assert.match(operatingRules, /Do not automatically schedule writing-return notifications/);
});

test('transparency page does not publish placeholder metrics as a real report', () => {
  const transparency = read('src/app/transparency/page.tsx');

  assert.match(transparency, /No verified transparency report is published in this build/);
  assert.doesNotMatch(transparency, /SAMPLE_TRANSPARENCY_DATA|totalUsers|dataExports|kheperaReflectionOptIn/);
});

test('live support page uses bounded email preparation rather than unsupported Firestore ticket writes', () => {
  const supportPage = read('src/app/support/page.tsx');
  const supportForm = read('src/services/support/supportService.ts');

  assert.match(supportPage, /SupportForm/);
  assert.doesNotMatch(supportPage, /SupportEscalationForm/);
  assert.match(supportForm, /mailto:/);
  assert.doesNotMatch(supportForm, /firebase|firestore|setDoc|addDoc/);
});

test('release configuration references a present closed storage policy and existing validation only', () => {
  const firebaseConfig = read('firebase.json');
  const workflow = read('.github/workflows/validate.yml');
  const storageRules = read('storage.rules');

  assert.match(firebaseConfig, /"rules": "storage\.rules"/);
  assert.match(storageRules, /allow read, write: if false/);
  assert.match(firebaseConfig, /"__tests__\/\*\*"/);
  assert.match(firebaseConfig, /"cd functions && npm ci && npm run build"/);
  assert.doesNotMatch(firebaseConfig, /npm ci --only=production && npm run build/);
  assert.match(workflow, /npm run validate/);
  assert.doesNotMatch(workflow, /check-seed-return-guards|check-notification-routes|check-no-manual-return-url-construction|check-no-return-threshold-bypass|check-no-legacy-imports/);
});

test('release certification remains evidence-gated until required authorities are proven', () => {
  const certification = read('docs/release/RELEASE_CERTIFICATION.md');
  const blockers = read('docs/release/RELEASE_BLOCKERS.md');
  const checklist = JSON.parse(read('docs/release/release-certification-checklist.json'));
  const packageConfig = JSON.parse(read('package.json'));
  const releaseCheck = read('scripts/check-release-trust-evidence.mjs');
  const emulatorSuite = read('src/__tests__/firestoreRulesEmulator.test.mjs');
  const releaseScope = read('docs/release/RELEASE_SCOPE.md');
  const releaseScopeCheck = read('scripts/check-release-scope.mjs');
  const releaseAuthorityCheck = read('scripts/check-release-authority.mjs');
  const sensitiveWriteAuthorityCheck = read('scripts/check-sensitive-write-authority.mjs');
  const sensitiveWriteAuthorityMap = read('docs/release/SENSITIVE_WRITE_AUTHORITY.md');
  const containerAuthorityMap = read('docs/release/CONTAINER_STATE_AUTHORITY.md');
  const provenanceModel = read('docs/release/REFLECTIVE_PROVENANCE_MODEL.md');
  const continuityTransitions = read('docs/release/REFLECTIVE_CONTINUITY_TRANSITIONS.md');
  const longitudinalInvariants = read('docs/release/LONGITUDINAL_CONTINUITY_INVARIANTS.md');
  const continuityReplay = read('docs/release/CONTINUITY_VERSIONING_AND_REPLAY.md');
  const sameShaLineage = read('docs/release/SAME_SHA_DEPLOYMENT_LINEAGE.md');
  const runtimeAttestation = read('docs/release/RUNTIME_ATTESTATION_MODEL.md');
  const runtimeAttestationEvidence = JSON.parse(read('docs/release/runtime-attestation-evidence.json'));
  const trustedRuntimeVerifiers = JSON.parse(read('docs/release/trusted-runtime-verifiers.json'));
  const candidateBoundLineage = read('docs/release/CANDIDATE_BOUND_LINEAGE_VERIFICATION.md');
  const executableVerifierModel = read('docs/release/EXECUTABLE_RUNTIME_VERIFIER_MODEL.md');
  const executableSameSha = read('docs/release/EXECUTABLE_SAME_SHA_VERIFICATION.md');
  const executableSemanticAuthority = read('docs/release/EXECUTABLE_SEMANTIC_AUTHORITY_MODEL.md');
  const trustedVerifierAuthority = read('docs/release/TRUSTED_VERIFIER_AUTHORITY_MODEL.md');
  const deploymentBoundAttestation = read('docs/release/DEPLOYMENT_BOUND_ATTESTATION_MODEL.md');
  const executableTrustedVerifierIntegration = read('docs/release/EXECUTABLE_TRUSTED_VERIFIER_INTEGRATION.md');
  const executableDeploymentAttestation = read('docs/release/EXECUTABLE_DEPLOYMENT_ATTESTATION_MODEL.md');
  const executableReceiptLifecycle = read('docs/release/EXECUTABLE_DEPLOYMENT_RECEIPT_LIFECYCLE.md');
  const deploymentLineageVerification = read('docs/release/DEPLOYMENT_LINEAGE_VERIFICATION.md');
  const semanticAuthority = read('docs/release/LONGITUDINAL_SEMANTIC_AUTHORITY.md');
  const semanticExecution = read('docs/release/SEMANTIC_AUTHORITY_EXECUTION_MODEL.md');
  const emulatorRunner = read('scripts/run-firestore-emulator-evidence.mjs');
  const runtimeAttestationCheck = read('scripts/check-runtime-attestation-evidence.mjs');
  const deploymentDecision = read('docs/release/DEPLOYMENT_AUTHORITY_DECISION.md');
  const nativeDecision = read('docs/release/NATIVE_AUTHORITY_DECISION.md');
  const lintClassification = read('docs/release/FUNCTIONS_LINT_CLASSIFICATION.md');
  const containerTransitions = read('functions/src/containerTransitions.ts');
  const continuityRuntimeGate = read('functions/src/continuityRuntimeGateCore.ts');
  const runtimeAttestationVerifierCore = read('functions/src/runtimeAttestationVerifierCore.ts');

  assert.equal(checklist.certificationStatus, 'ATTESTED RELEASE CANDIDATE, NOT CERTIFIED');
  assert.match(checklist.candidateSha, /^[0-9a-f]{40}$/);
  assert.equal(checklist.requiredEvidence.cleanWorktree, true);
  assert.equal(checklist.requiredEvidence.releaseScopeNormalized, true);
  assert.equal(checklist.requiredEvidence.deploymentAuthorityResolved, true);
  assert.equal(checklist.requiredEvidence.nativeConfigReconciled, true);
  assert.equal(checklist.requiredEvidence.trustCriticalFunctionsLint, true);
  assert.equal(checklist.requiredEvidence.firestoreEmulatorAuthorization, true);
  assert.equal(checklist.requiredEvidence.serverAuthoritativeSensitiveWrites, true);
  assert.equal(checklist.requiredEvidence.providerSecretsConfigured, true);
  assert.equal(checklist.requiredEvidence.runtimeContinuityAttestation, true);
  assert.equal(checklist.requiredEvidence.deploymentLineageSameSha, true);
  assert.equal(checklist.requiredEvidence.continuityExportDeletionVerified, true);
  assert.equal(checklist.requiredEvidence.privacyClaimsMatchDeployment, true);
  assert.equal(checklist.requiredEvidence.supportSurfaceApproved, true);
  assert.equal(checklist.requiredEvidence.transparencySurfaceApproved, true);
  assert.equal(checklist.requiredEvidence.iosArchiveSameSha, false);
  assert.match(certification, /Dirty and not suitable for release certification/);
  assert.match(blockers, /Dirty integration worktree/);
  assert.match(blockers, /Firestore rules deployment and candidate-bound emulator authorization evidence absent/);
  assert.match(blockers, /Sensitive reflective persistence and continuity authority lack runtime evidence and completion/);
  assert.match(certification, /server gateway now writes immediate generated sessions with source-level\s+provenance/i);
  assert.match(sensitiveWriteAuthorityCheck, /NOT SERVER-AUTHORITATIVE/);
  assert.match(sensitiveWriteAuthorityCheck, /processQueuedEntry/);
  assert.match(sensitiveWriteAuthorityCheck, /delayedReflectionQueue/);
  assert.match(sensitiveWriteAuthorityCheck, /memory\.ts/);
  assert.match(sensitiveWriteAuthorityCheck, /containerService/);
  assert.match(sensitiveWriteAuthorityCheck, /Firestore rules permit clients to submit generated session and crisis fields/);
  assert.match(sensitiveWriteAuthorityCheck, /does not persist canonical session records/);
  assert.match(sensitiveWriteAuthorityMap, /SOURCE BOUNDARY ENFORCED - CERTIFICATION BLOCKING/);
  assert.match(sensitiveWriteAuthorityMap, /Canonical immediate session record/);
  assert.match(sensitiveWriteAuthorityMap, /Delayed reflection job\/result/);
  assert.match(sensitiveWriteAuthorityMap, /Khepera memory/);
  assert.match(sensitiveWriteAuthorityMap, /Container activation\/state/);
  assert.match(sensitiveWriteAuthorityMap, /Sanctuary day advancement/);
  assert.match(sensitiveWriteAuthorityMap, /Container linkage\/completion/);
  assert.match(sensitiveWriteAuthorityMap, /SOURCE BOUNDARY ENFORCED - CERTIFICATION BLOCKING/);
  assert.match(containerAuthorityMap, /PARTIAL SERVER AUTHORITY - CERTIFICATION BLOCKING/);
  assert.match(containerAuthorityMap, /currentDay.*Server-authoritative/s);
  assert.match(provenanceModel, /Canonical generated session/);
  assert.match(provenanceModel, /new canonical sessions do not persist client-supplied container continuity/i);
  assert.match(provenanceModel, /Sanctuary activation records include/);
  assert.match(provenanceModel, /Sanctuary advancement records retain/);
  assert.match(continuityTransitions, /PARTIAL SERVER AUTHORITY - CERTIFICATION BLOCKING/);
  assert.match(continuityTransitions, /Activate approved sanctuary container/);
  assert.match(continuityTransitions, /Advance sanctuary day/);
  assert.match(continuityTransitions, /stale, repeated, or terminal sanctuary day-advance request/);
  assert.match(longitudinalInvariants, /Monotonic advancement/);
  assert.match(longitudinalInvariants, /Replay rejection/);
  assert.match(continuityReplay, /expectedContinuityVersion/);
  assert.match(continuityReplay, /stale or repeated requests/);
  assert.match(sameShaLineage, /DEPLOYMENT LINEAGE RECORDED/);
  assert.match(sameShaLineage, /final\s+certification remains blocked/i);
  assert.match(sameShaLineage, /Source provenance fields/);
  assert.match(runtimeAttestation, /evidence-tail/);
  assert.match(runtimeAttestation, /environment configuration is an assertion, not attestation evidence/i);
  assert.equal(runtimeAttestationEvidence.attestationStatus, 'ATTESTED');
  assert.equal(runtimeAttestationEvidence.runtimeEnablementAuthorized, true);
  assert.match(runtimeAttestationEvidence.candidateSha, /^[0-9a-f]{40}$/);
  assert.equal(runtimeAttestationEvidence.deploymentEnvironment, 'production');
  assert.equal(runtimeAttestationEvidence.receipt.algorithm, 'RSA-SHA256');
  assert.equal(runtimeAttestationEvidence.evidence.rollbackAuthority.verified, true);
  assert.equal(runtimeAttestationEvidence.evidence.firestoreEmulatorAuthorization.verified, true);
  assert.equal(runtimeAttestationEvidence.evidence.providerSecretPresence.verified, true);
  assert.equal(trustedRuntimeVerifiers.status, 'APPROVED VERIFIER REGISTERED');
  assert.match(trustedRuntimeVerifiers.trustModel, /explicit-human-approved-verifier-registry/);
  assert.match(trustedRuntimeVerifiers.requirements.join('\n'), /publicKeyFingerprintSha256/);
  assert.equal(trustedRuntimeVerifiers.approvedVerifiers.length, 1);
  assert.equal(trustedRuntimeVerifiers.approvedVerifiers[0].verifierId, 'alchm-release-owner-2026-05');
  assert.equal(trustedRuntimeVerifiers.approvedVerifiers[0].authorityScope, 'runtime-continuity-attestation');
  assert.equal(trustedRuntimeVerifiers.approvedVerifiers[0].status, 'approved');
  assert.equal(trustedRuntimeVerifiers.approvedVerifiers[0].receiptAlgorithm, 'RSA-SHA256');
  assert.match(candidateBoundLineage, /EXECUTABLE CHECK PRESENT - NO ATTESTATION ACCEPTED/);
  assert.match(candidateBoundLineage, /check:runtime-attestation/);
  assert.match(executableVerifierModel, /VERIFIER CONTRACT IMPLEMENTED - APPROVED VERIFIER AND RECEIPT RECORDED/);
  assert.match(executableVerifierModel, /RSA-SHA256/);
  assert.match(executableSameSha, /STRUCTURAL VERIFICATION IMPLEMENTED - LINEAGE NOT ESTABLISHED/);
  assert.match(executableSameSha, /evidence digest/i);
  assert.match(executableSemanticAuthority, /UNRESOLVED MEANING-BEARING TRANSITIONS REMAIN UNAVAILABLE/);
  assert.match(trustedVerifierAuthority, /GOVERNANCE CONTRACT IMPLEMENTED - APPROVED VERIFIER REGISTERED/);
  assert.match(trustedVerifierAuthority, /self-attested verifier records are invalid/i);
  assert.match(deploymentBoundAttestation, /RECEIPT BINDING CONTRACT IMPLEMENTED - DEPLOYMENT LINEAGE NOT ESTABLISHED/);
  assert.match(deploymentBoundAttestation, /deployment evidence digest/i);
  assert.match(deploymentBoundAttestation, /provider-secret lineage digest/i);
  assert.match(executableTrustedVerifierIntegration, /INTEGRATION CONTRACT IMPLEMENTED - NO TRUSTED VERIFIER ADMITTED/);
  assert.match(executableTrustedVerifierIntegration, /verifier compromise/i);
  assert.match(executableDeploymentAttestation, /ISSUANCE CONTRACT DEFINED - NO DEPLOYMENT ATTESTATION ISSUED/);
  assert.match(executableDeploymentAttestation, /providerSecretLineageDigest/);
  assert.match(executableReceiptLifecycle, /LIFECYCLE CONTRACT DEFINED - NO RECEIPT ISSUED/);
  assert.match(executableReceiptLifecycle, /Rollback And Supersession/);
  assert.match(deploymentLineageVerification, /SAME-SHA DEPLOYMENT EVIDENCE RECORDED/);
  assert.match(deploymentLineageVerification, /same-SHA/i);
  assert.match(semanticAuthority, /UNRESOLVED SEMANTICS REMAIN UNAVAILABLE/);
  assert.match(semanticAuthority, /completion/i);
  assert.match(semanticExecution, /UNRESOLVED SEMANTIC TRANSITIONS REMAIN FAIL CLOSED/);
  assert.match(sensitiveWriteAuthorityCheck, /CONTAINER_TRANSITIONS_AVAILABLE/);
  assert.match(sensitiveWriteAuthorityCheck, /client-supplied container continuity linkage/);
  assert.match(sensitiveWriteAuthorityCheck, /activateContainer/);
  assert.match(sensitiveWriteAuthorityCheck, /advanceSanctuaryContainer/);
  assert.match(sensitiveWriteAuthorityCheck, /expectedContinuityVersion/);
  assert.match(containerTransitions, /evaluateContinuityRuntimeGate/);
  assert.match(containerTransitions, /Continuity transition denied by runtime attestation gate/);
  assert.match(containerTransitions, /Container transitions are unavailable until runtime attestation evidence is verified/);
  assert.match(continuityRuntimeGate, /CONTINUITY_RUNTIME_ATTESTATION_IMPLEMENTED = false/);
  assert.match(continuityRuntimeGate, /enabled: false/);
  assert.match(continuityRuntimeGate, /same-SHA Firestore emulator evidence/);
  assert.match(continuityRuntimeGate, /verified runtime attestation receipt/);
  assert.match(continuityRuntimeGate, /RuntimeAttestationVerificationResult/);
  assert.match(runtimeAttestationVerifierCore, /verifyRuntimeAttestationReceipt/);
  assert.match(runtimeAttestationVerifierCore, /verifySignature/);
  assert.match(runtimeAttestationVerifierCore, /consumedReceiptIds/);
  assert.match(runtimeAttestationVerifierCore, /deploymentEvidenceDigest/);
  assert.match(runtimeAttestationVerifierCore, /providerSecretLineageDigest/);
  assert.match(runtimeAttestationVerifierCore, /calculateVerifierPublicKeyFingerprint/);
  assert.match(runtimeAttestationVerifierCore, /duplicate verifier fingerprints/);
  assert.match(runtimeAttestationVerifierCore, /authorityScope/);
  assert.match(runtimeAttestationVerifierCore, /cannot self-attest trust/);
  assert.match(runtimeAttestationVerifierCore, /duplicate verifier IDs/);
  assert.match(runtimeAttestationVerifierCore, /functionsDeploymentSha/);
  assert.doesNotMatch(containerTransitions, /attestationVerification:\s*process\.env|verifiedAttestationReceipt:\s*process\.env/);
  assert.match(sensitiveWriteAuthorityCheck, /pointer\/version divergence is rejected/);
  assert.match(sensitiveWriteAuthorityCheck, /activeContainersQuery/);
  assert.match(sensitiveWriteAuthorityCheck, /functionsIndex/);
  assert.match(releaseCheck, /--require-certified/);
  assert.match(releaseCheck, /runtime-attestation-evidence\.json/);
  assert.match(runtimeAttestationCheck, /Runtime attestation evidence check failed/);
  assert.match(runtimeAttestationCheck, /Candidate binding mode/);
  assert.match(runtimeAttestationCheck, /evidence-tail/);
  assert.match(runtimeAttestationCheck, /trusted-runtime-verifiers\.json/);
  assert.match(runtimeAttestationCheck, /verifySignature/);
  assert.match(runtimeAttestationCheck, /deploymentEvidenceDigest/);
  assert.match(runtimeAttestationCheck, /providerSecretLineageDigest/);
  assert.match(runtimeAttestationCheck, /calculateVerifierPublicKeyFingerprint/);
  assert.match(runtimeAttestationCheck, /duplicate runtime verifier fingerprint/);
  assert.match(runtimeAttestationCheck, /cannot self-attest trust/);
  assert.match(emulatorSuite, /@firebase\/rules-unit-testing/);
  assert.match(packageConfig.scripts['check:firestore-emulator-evidence'], /run-firestore-emulator-evidence/);
  assert.match(emulatorRunner, /Java runtime not found/);
  assert.match(emulatorRunner, /firebase-tools binary not found/);
  assert.match(emulatorRunner, /emulators:exec/);
  assert.match(releaseScope, /functions\/functions/);
  assert.match(releaseScopeCheck, /functions\/functions/);
  assert.match(releaseAuthorityCheck, /authoritative checkout is dirty/);
  assert.match(releaseAuthorityCheck, /generated paths present but not treated as authority/);
  assert.match(deploymentDecision, /DECIDED - INTENTIONAL SPLIT SELECTED, EVIDENCE PENDING/);
  assert.match(deploymentDecision, /Firebase Hosting \+ Functions/);
  assert.match(nativeDecision, /com\.alchm\.sanctuary/);
  assert.match(nativeDecision, /NATIVE_IN_SCOPE/);
  assert.match(lintClassification, /Tier 1 - Trust, Security, and Release Authority/);
  assert.match(packageConfig.scripts['check:release-authority'], /check-release-authority/);
  assert.match(packageConfig.scripts['check:runtime-attestation'], /check-runtime-attestation-evidence/);
  assert.match(packageConfig.scripts['check:sensitive-write-authority'], /check-sensitive-write-authority/);
  assert.match(packageConfig.scripts['check:container-transitions'], /containerTransitionsCore/);
  assert.match(packageConfig.scripts['check:container-transitions'], /continuityRuntimeGateCore/);
  assert.match(packageConfig.scripts['check:container-transitions'], /runtimeAttestationVerifierCore/);
  assert.match(packageConfig.scripts['check:functions-trust-lint'], /lint:trust-critical/);
  assert.match(packageConfig.scripts.validate, /check:release-trust/);
  assert.match(packageConfig.scripts.validate, /check:release-scope/);
  assert.match(packageConfig.scripts.validate, /check:release-authority/);
  assert.match(packageConfig.scripts.validate, /check:runtime-attestation/);
  assert.match(packageConfig.scripts.validate, /check:sensitive-write-authority/);
});
