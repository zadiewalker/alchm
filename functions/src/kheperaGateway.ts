import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {
  evaluateKheperaRateLimit,
  handleKheperaGenerationRequest,
  KheperaGatewayError,
  type KheperaGatewayResponse,
  type KheperaSessionPersistenceRequest,
} from "./kheperaGatewayCore";

const GATEWAY_RATE_LIMIT_WINDOW_MS = 60 * 1000;
const GATEWAY_MAX_REQUESTS_PER_WINDOW = 6;
const ANTHROPIC_MESSAGES_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_KHEPERA_MODEL = "claude-sonnet-4-20250514";
const KHEPERA_GATEWAY_VERSION = "1";
const KHEPERA_SESSION_SCHEMA_VERSION = 1;

const KHEPERA_SERVER_PROMPT = `You are Khepera, a non-directive reflection system.
Return JSON with exactly these string keys: "witness", "perspective", "seed".
The three sections mean: Witness, Perspective Offer, and Seed Question.
The seed must be exactly one open-ended question.
Do not diagnose, advise, coach, prescribe action, simulate therapy, moralize, evaluate the user, or use productivity framing.
Stay observational and close to the submitted writing.`;

async function consumeRateLimit(userId: string): Promise<void> {
  const ref = admin.firestore().collection("rateLimits").doc(`khepera_generation_${userId}`);
  const now = Date.now();

  try {
    await admin.firestore().runTransaction(async (transaction) => {
      const snapshot = await transaction.get(ref);
      const decision = evaluateKheperaRateLimit(
        snapshot.exists ? snapshot.data() : undefined,
        now,
        GATEWAY_RATE_LIMIT_WINDOW_MS,
        GATEWAY_MAX_REQUESTS_PER_WINDOW,
      );

      if (!decision.allowed) {
        throw new KheperaGatewayError("resource-exhausted", "Reflection request limit reached");
      }

      transaction.set(ref, decision.state);
    });
  } catch (error) {
    if (error instanceof KheperaGatewayError) {
      throw error;
    }
    throw new KheperaGatewayError("unavailable", "Reflection request could not be authorized");
  }
}

function parseProviderResponse(value: unknown): unknown {
  if (typeof value !== "object" || value === null || !("content" in value) || !Array.isArray(value.content)) {
    throw new KheperaGatewayError("failed-precondition", "Model response was empty");
  }

  const content = value.content.find((block) => (
    typeof block === "object"
    && block !== null
    && "type" in block
    && block.type === "text"
    && "text" in block
    && typeof block.text === "string"
  ));

  if (!content || typeof content !== "object" || !("text" in content) || typeof content.text !== "string") {
    throw new KheperaGatewayError("failed-precondition", "Model response was empty");
  }

  try {
    return JSON.parse(content.text) as unknown;
  } catch {
    throw new KheperaGatewayError("failed-precondition", "Model response was not structured JSON");
  }
}

async function requestReflection(entryText: string): Promise<unknown> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new KheperaGatewayError("unavailable", "Reflection provider is unavailable");
  }

  const response = await fetch(ANTHROPIC_MESSAGES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_KHEPERA_MODEL || DEFAULT_KHEPERA_MODEL,
      temperature: 0.55,
      max_tokens: 460,
      system: KHEPERA_SERVER_PROMPT,
      messages: [
        { role: "user", content: `WRITING:\n${entryText}\n\nReturn the Khepera reflection JSON only.` },
      ],
    }),
  });

  if (!response.ok) {
    throw new KheperaGatewayError("unavailable", "Reflection provider is unavailable");
  }

  return parseProviderResponse(await response.json());
}

async function persistGeneratedSession(
  userId: string,
  entryText: string,
  response: KheperaGatewayResponse,
  session: KheperaSessionPersistenceRequest,
): Promise<void> {
  const model = process.env.ANTHROPIC_KHEPERA_MODEL || DEFAULT_KHEPERA_MODEL;
  await admin.firestore()
    .collection("users")
    .doc(userId)
    .collection("sessions")
    .doc(session.sessionId)
    .set({
      userId,
      entryText,
      kheperaResponse: `${response.witness}\n\n${response.perspective}`,
      seed: response.seed,
      emotionalTone: "processing",
      themes: [],
      isCrisis: false,
      reflectionTiming: session.reflectionTiming,
      generatedBy: "server",
      source: "kheperaGateway",
      gatewayVersion: KHEPERA_GATEWAY_VERSION,
      schemaVersion: KHEPERA_SESSION_SCHEMA_VERSION,
      modelProvider: "anthropic",
      modelIdentifier: model,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      validatedAt: admin.firestore.FieldValue.serverTimestamp(),
      writtenAt: session.writtenAt,
    });
}

export const generateKheperaReflection = functions.https.onCall(async (data, context) => {
  try {
    const result = await handleKheperaGenerationRequest(data, context.auth?.uid, {
      consumeRateLimit,
      requestReflection,
      persistGeneratedSession,
    });

    if (result.blockedByCrisis) {
      return {
        blockedByCrisis: true,
        text: null,
        provider: null,
        model: null,
        sessionId: null,
      };
    }

    return {
      blockedByCrisis: false,
      text: JSON.stringify(result.response satisfies KheperaGatewayResponse),
      provider: "anthropic",
      model: process.env.ANTHROPIC_KHEPERA_MODEL || DEFAULT_KHEPERA_MODEL,
      sessionId: result.sessionId,
    };
  } catch (error) {
    if (error instanceof KheperaGatewayError) {
      throw new functions.https.HttpsError(error.code, error.message);
    }
    throw new functions.https.HttpsError("internal", "Reflection generation failed");
  }
});
