import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const directClientWriteFindings = [
  {
    file: 'src/services/journal/processQueuedEntry.ts',
    pattern: /await deps\.setDoc\(entryRef,\s*\{[\s\S]*?\bkheperaResponse\b/,
    description: 'canonical session reflection fields are written by the client processor',
  },
  {
    file: 'src/services/khepera/delayedReflectionQueue.ts',
    pattern: /await setDoc\(sessionRef,\s*\{[\s\S]*?\bkheperaResponse\b/,
    description: 'delayed reflection output is written by a client service',
  },
  {
    file: 'src/services/khepera/delayedReflectionQueue.ts',
    pattern: /await setDoc\(delayedReflectionRef\(userId,\s*job\.entryId\),\s*\{/,
    description: 'delayed reflection job metadata is written by a client service',
  },
  {
    file: 'src/services/khepera/memory.ts',
    pattern: /await setDoc\(memoryRef,\s*\{/,
    description: 'Khepera memory metadata is written directly by a client service',
  },
  {
    file: 'src/services/containers/containerService.ts',
    pattern: /transaction\.(?:set|update)\((?:containerRef|activeStateRef)|await updateDoc\(containerRef/,
    description: 'container invariant-sensitive state is written directly by a client service',
  },
];

const ruleAuthorityFindings = [
  {
    marker: 'sessions',
    pattern: /allow create, update: if (?!false)/,
    description: 'Firestore rules permit clients to submit generated session and crisis fields',
  },
  {
    marker: 'khepera',
    pattern: /allow create, update: if (?!false)/,
    description: 'Firestore rules permit clients to write minimized Khepera memory metadata',
  },
  {
    marker: 'kheperaDelayedReflections',
    pattern: /allow create, update: if (?!false)/,
    description: 'Firestore rules permit clients to write delayed reflection state',
  },
  {
    marker: 'containers',
    pattern: /allow create, update: if (?!false)/,
    description: 'Firestore rules permit clients to write container state',
  },
];

const directFindings = directClientWriteFindings.filter(({ file, pattern }) => (
  pattern.test(fs.readFileSync(path.join(repo, file), 'utf8'))
));
const rules = fs.readFileSync(path.join(repo, 'firestore.rules'), 'utf8');
function getRuleBlock(marker) {
  const expression = new RegExp(`match \\/users\\/\\{userId\\}\\/${marker}\\/\\{[^}]+\\} \\{[\\s\\S]*?\\n    \\}`);
  return rules.match(expression)?.[0] ?? '';
}
const permissionFindings = ruleAuthorityFindings
  .filter(({ marker, pattern }) => pattern.test(getRuleBlock(marker)))
  .map(({ description }) => ({ file: 'firestore.rules', description }));
const gateway = fs.readFileSync(path.join(repo, 'functions/src/kheperaGateway.ts'), 'utf8');
const containerTransitions = fs.readFileSync(path.join(repo, 'functions/src/containerTransitions.ts'), 'utf8');
const containerTransitionsCore = fs.readFileSync(path.join(repo, 'functions/src/containerTransitionsCore.ts'), 'utf8');
const continuityRuntimeGateCore = fs.readFileSync(path.join(repo, 'functions/src/continuityRuntimeGateCore.ts'), 'utf8');
const runtimeAttestationVerifierCore = fs.readFileSync(path.join(repo, 'functions/src/runtimeAttestationVerifierCore.ts'), 'utf8');
const functionsIndex = fs.readFileSync(path.join(repo, 'functions/src/index.ts'), 'utf8');
const containerService = fs.readFileSync(path.join(repo, 'src/services/containers/containerService.ts'), 'utf8');
const containerAuthority = fs.readFileSync(path.join(repo, 'src/config/containerAuthority.ts'), 'utf8');
const missingServerAuthority = [];

if (!/collection\(["']users["']\)[\s\S]*?collection\(["']sessions["']\)/.test(gateway)) {
  missingServerAuthority.push({
    file: 'functions/src/kheperaGateway.ts',
    description: 'the server Khepera gateway does not persist canonical session records',
  });
}

if (!/generatedBy[\s\S]*?server|derivedBy[\s\S]*?server/.test(gateway)) {
  missingServerAuthority.push({
    file: 'functions/src/kheperaGateway.ts',
    description: 'the server Khepera gateway does not write persistence provenance metadata',
  });
}

if (/containerId:\s*session\.containerId|userContainerId:\s*session\.userContainerId|containerDay:\s*session\.containerDay/.test(gateway)) {
  missingServerAuthority.push({
    file: 'functions/src/kheperaGateway.ts',
    description: 'new canonical sessions persist client-supplied container continuity linkage without server transition validation',
  });
}

if (!/export const activateContainer/.test(containerTransitions)
  || !/export const advanceSanctuaryContainer/.test(containerTransitions)
  || !/export \{ activateContainer, advanceSanctuaryContainer \} from "\.\/containerTransitions"/.test(functionsIndex)
  || !/runTransaction/.test(containerTransitions)
  || !/activeContainersQuery/.test(containerTransitions)
  || !/Only one active container may exist at a time/.test(containerTransitions)
  || !/transitionedBy:\s*"server"/.test(containerTransitions)
  || !/transitionSource:\s*ACTIVATION_TRANSITION_SOURCE/.test(containerTransitions)
  || !/continuityVersion:\s*CONTINUITY_VERSION/.test(containerTransitions)
  || !/evaluateContinuityRuntimeGate/.test(containerTransitions)
  || !/CONTINUITY_RUNTIME_ATTESTATION_IMPLEMENTED\s*=\s*false/.test(continuityRuntimeGateCore)
  || !/enabled:\s*false/.test(continuityRuntimeGateCore)
  || !/same-SHA Firestore emulator evidence/.test(continuityRuntimeGateCore)
  || !/verified runtime attestation receipt/.test(continuityRuntimeGateCore)
  || !/RuntimeAttestationVerificationResult/.test(continuityRuntimeGateCore)
  || !/verifyRuntimeAttestationReceipt/.test(runtimeAttestationVerifierCore)
  || !/verifySignature/.test(runtimeAttestationVerifierCore)
  || !/consumedReceiptIds/.test(runtimeAttestationVerifierCore)
  || !/expectedCandidateSha/.test(runtimeAttestationVerifierCore)
  || !/expectedEvidenceDigest/.test(runtimeAttestationVerifierCore)
  || !/expectedDeploymentEnvironment/.test(runtimeAttestationVerifierCore)
  || !/expectedFunctionsDeploymentSha/.test(runtimeAttestationVerifierCore)
  || !/expectedFirestoreRulesDeploymentSha/.test(runtimeAttestationVerifierCore)
  || !/expectedDeploymentEvidenceDigest/.test(runtimeAttestationVerifierCore)
  || !/expectedProviderSecretLineageDigest/.test(runtimeAttestationVerifierCore)
  || !/deploymentEvidenceDigest/.test(runtimeAttestationVerifierCore)
  || !/providerSecretLineageDigest/.test(runtimeAttestationVerifierCore)
  || !/calculateVerifierPublicKeyFingerprint/.test(runtimeAttestationVerifierCore)
  || !/duplicate verifier fingerprints/.test(runtimeAttestationVerifierCore)
  || !/authorityScope/.test(runtimeAttestationVerifierCore)
  || !/duplicate verifier IDs/.test(runtimeAttestationVerifierCore)
  || !/cannot self-attest trust/.test(runtimeAttestationVerifierCore)
  || /attestationVerification:\s*process\.env|verifiedAttestationReceipt:\s*process\.env/.test(containerTransitions)
  || !/requireContainerTransitionsEnabled\(\)/.test(containerTransitions)
  || !/Continuity transition denied by runtime attestation gate/.test(containerTransitions)
  || !/Container transitions are unavailable until runtime attestation evidence is verified/.test(containerTransitions)
  || !/requireAuthenticatedUserId\(context\)/.test(containerTransitions)
  || !/planContainerActivation\(data,\s*userId\)/.test(containerTransitions)
  || !/ACTIVATABLE_SANCTUARY_CONTAINERS/.test(containerTransitionsCore)
  || !/httpsCallable[\s\S]*?activateContainer/.test(containerService)) {
  missingServerAuthority.push({
    file: 'functions/src/containerTransitions.ts',
    description: 'sanctuary container activation is not implemented behind authenticated provenance-stamped server authority',
  });
}

if (!/SERVER_SANCTUARY_ACTIVATION_IMPLEMENTED\s*=\s*true/.test(containerAuthority)
  || !/SERVER_SANCTUARY_ADVANCEMENT_IMPLEMENTED\s*=\s*true/.test(containerAuthority)
  || !/CONTAINER_TRANSITIONS_AVAILABLE\s*=\s*false/.test(containerAuthority)
  || !/Container transitions are unavailable until server-authoritative continuity evidence is complete/.test(containerAuthority)
  || !/recordContainerEntry[\s\S]*?CONTAINER_TRANSITIONS_UNAVAILABLE/.test(containerService)
  || !/completeContainer[\s\S]*?CONTAINER_TRANSITIONS_UNAVAILABLE/.test(containerService)) {
  missingServerAuthority.push({
    file: 'src/services/containers/containerService.ts',
    description: 'non-activation container transitions are not explicitly fail-closed while continuity authority remains incomplete',
  });
}

if (!/parseContainerAdvancementRequest/.test(containerTransitionsCore)
  || !/planSanctuaryAdvancement/.test(containerTransitionsCore)
  || !/assertActivePointerForAdvancement/.test(containerTransitionsCore)
  || !/expectedContinuityVersion/.test(containerTransitionsCore)
  || !/previousContinuityVersion/.test(containerTransitions)
  || !/continuityVersion:\s*plan\.continuityVersion/.test(containerTransitions)
  || !/assertActivePointerForAdvancement\(request,\s*activeStateSnapshot\.data\(\) \?\? \{\},\s*containerState\)/.test(containerTransitions)
  || !/pointer\.transitionVersion !== containerState\.transitionVersion/.test(containerTransitionsCore)
  || !/progressedBy:\s*"server"/.test(containerTransitions)
  || !/transitionSource:\s*ADVANCEMENT_TRANSITION_SOURCE/.test(containerTransitions)) {
  missingServerAuthority.push({
    file: 'functions/src/containerTransitions.ts',
    description: 'sanctuary advancement does not enforce server-owned monotonic continuity and stale-request rejection',
  });
}

const presentFindings = [...directFindings, ...permissionFindings, ...missingServerAuthority];

if (presentFindings.length > 0) {
  console.error('Sensitive write authority status: NOT SERVER-AUTHORITATIVE');
  presentFindings.forEach(({ file, description }) => {
    console.error(`- ${file}: ${description}`);
  });
  console.error('RB-017 remains open until sensitive records are written behind reviewed server authority or explicitly approved with tested limits and emulator evidence.');
  process.exitCode = 1;
} else {
  console.log('Sensitive write authority source boundary is enforced: generated sessions are server-owned; sanctuary activation and versioned advancement have server-only implementations behind a fail-closed gate requiring signed candidate-bound and deployment-bound attestation verification; pointer/version divergence is rejected; derived and remaining continuity mutations fail closed.');
  console.log('Certification still requires candidate-bound emulator and deployed evidence for this contract.');
}
