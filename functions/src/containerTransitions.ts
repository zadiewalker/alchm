import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {
  assertActivePointerForAdvancement,
  ContainerTransitionError,
  parseContainerAdvancementRequest,
  planContainerActivation,
  planSanctuaryAdvancement,
  type ContainerActivationPlan,
} from "./containerTransitionsCore";
import { evaluateContinuityRuntimeGate } from "./continuityRuntimeGateCore";

const CONTAINER_SCHEMA_VERSION = 1;
const CONTAINER_TRANSITION_VERSION = 1;
const CONTINUITY_VERSION = 1;
const ACTIVATION_TRANSITION_SOURCE = "activateContainer";
const ADVANCEMENT_TRANSITION_SOURCE = "advanceSanctuaryContainer";

function requireContainerTransitionsEnabled(): void {
  const decision = evaluateContinuityRuntimeGate({
    enableRequested: process.env.ALCHM_CONTINUITY_TRANSITIONS_ENABLED,
    candidateSha: process.env.ALCHM_CANDIDATE_SHA,
    functionsDeploymentSha: process.env.ALCHM_FUNCTIONS_DEPLOYMENT_SHA,
    firestoreRulesDeploymentSha: process.env.ALCHM_FIRESTORE_RULES_DEPLOYMENT_SHA,
    emulatorEvidenceSha: process.env.ALCHM_FIRESTORE_EMULATOR_EVIDENCE_SHA,
    releaseScopeAttested: process.env.ALCHM_RELEASE_SCOPE_ATTESTED,
    deploymentAuthorityAttested: process.env.ALCHM_DEPLOYMENT_AUTHORITY_ATTESTED,
  });
  if (!decision.enabled) {
    functions.logger.warn("Continuity transition denied by runtime attestation gate", {
      reason: decision.reason,
      missingEvidence: decision.missingEvidence,
      requested: decision.requested,
    });
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Container transitions are unavailable until runtime attestation evidence is verified",
    );
  }
}

function requireAuthenticatedUserId(context: functions.https.CallableContext): string {
  const userId = context.auth?.uid;
  if (!userId) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
  }
  return userId;
}

async function persistContainerActivation(plan: ContainerActivationPlan): Promise<{ userContainerId: string }> {
  const db = admin.firestore();
  const userRef = db.collection("users").doc(plan.userId);
  const containerRef = userRef.collection("containers").doc();
  const activeStateRef = userRef.collection("containerState").doc("active");
  const activeContainersQuery = userRef.collection("containers").where("status", "==", "active").limit(1);

  try {
    await db.runTransaction(async (transaction) => {
      const [activeState, activeContainers] = await Promise.all([
        transaction.get(activeStateRef),
        transaction.get(activeContainersQuery),
      ]);

      if (
        (activeState.exists && activeState.data()?.status === "active")
        || !activeContainers.empty
      ) {
        throw new ContainerTransitionError(
          "failed-precondition",
          "Only one active container may exist at a time",
        );
      }

      const timestamp = admin.firestore.FieldValue.serverTimestamp();
      const provenance = {
        transitionedBy: "server",
        transitionSource: ACTIVATION_TRANSITION_SOURCE,
        schemaVersion: CONTAINER_SCHEMA_VERSION,
        transitionVersion: CONTAINER_TRANSITION_VERSION,
        continuityVersion: CONTINUITY_VERSION,
        validatedAt: timestamp,
      };

      transaction.set(containerRef, {
        userId: plan.userId,
        containerId: plan.container.id,
        containerName: plan.container.name,
        tier: plan.container.tier,
        status: "active",
        startedAt: timestamp,
        currentDay: plan.container.initialDay,
        sessionIds: [],
        completionCeremonyViewed: false,
        ...provenance,
      });
      transaction.set(activeStateRef, {
        userId: plan.userId,
        userContainerId: containerRef.id,
        status: "active",
        activatedAt: timestamp,
        ...provenance,
      });
    });
  } catch (error) {
    if (error instanceof ContainerTransitionError) {
      throw error;
    }
    throw new ContainerTransitionError("unavailable", "Container activation could not be authorized");
  }

  return { userContainerId: containerRef.id };
}

export const activateContainer = functions.https.onCall(async (data, context) => {
  try {
    const userId = requireAuthenticatedUserId(context);
    requireContainerTransitionsEnabled();
    const plan = planContainerActivation(data, userId);
    return await persistContainerActivation(plan);
  } catch (error) {
    if (error instanceof ContainerTransitionError) {
      throw new functions.https.HttpsError(error.code, error.message);
    }
    throw new functions.https.HttpsError("internal", "Container activation failed");
  }
});

export const advanceSanctuaryContainer = functions.https.onCall(async (data, context) => {
  try {
    const userId = requireAuthenticatedUserId(context);
    requireContainerTransitionsEnabled();
    const request = parseContainerAdvancementRequest(data, userId);
    const db = admin.firestore();
    const userRef = db.collection("users").doc(request.userId);
    const containerRef = userRef.collection("containers").doc(request.userContainerId);
    const activeStateRef = userRef.collection("containerState").doc("active");

    return await db.runTransaction(async (transaction) => {
      const [containerSnapshot, activeStateSnapshot] = await Promise.all([
        transaction.get(containerRef),
        transaction.get(activeStateRef),
      ]);
      if (
        !containerSnapshot.exists
        || !activeStateSnapshot.exists
      ) {
        throw new ContainerTransitionError(
          "failed-precondition",
          "An active sanctuary container is required for this transition",
        );
      }

      const containerState = containerSnapshot.data() ?? {};
      assertActivePointerForAdvancement(request, activeStateSnapshot.data() ?? {}, containerState);
      const plan = planSanctuaryAdvancement(request, containerState);
      const timestamp = admin.firestore.FieldValue.serverTimestamp();
      const provenance = {
        transitionedBy: "server",
        progressedBy: "server",
        transitionSource: ADVANCEMENT_TRANSITION_SOURCE,
        schemaVersion: CONTAINER_SCHEMA_VERSION,
        previousTransitionVersion: plan.previousTransitionVersion,
        transitionVersion: plan.transitionVersion,
        previousContinuityVersion: plan.previousContinuityVersion,
        continuityVersion: plan.continuityVersion,
        validatedAt: timestamp,
      };

      transaction.update(containerRef, {
        currentDay: plan.nextDay,
        ...provenance,
      });
      transaction.update(activeStateRef, provenance);

      return {
        userContainerId: plan.userContainerId,
        currentDay: plan.nextDay,
        continuityVersion: plan.continuityVersion,
      };
    });
  } catch (error) {
    if (error instanceof ContainerTransitionError) {
      throw new functions.https.HttpsError(error.code, error.message);
    }
    throw new functions.https.HttpsError("internal", "Container advancement failed");
  }
});
