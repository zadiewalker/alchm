import { detectCrisisSignals } from "../../src/services/khepera/crisisDetection";
import { validateKheperaOutput } from "../../src/services/khepera/qualityGuards";

export type KheperaGatewayResponse = {
  witness: string;
  perspective: string;
  seed: string;
};

export type KheperaGatewayResult =
  | { blockedByCrisis: true; response: null; sessionId: null }
  | { blockedByCrisis: false; response: KheperaGatewayResponse; sessionId: string | null };

export type KheperaSessionPersistenceRequest = {
  sessionId: string;
  writtenAt: string;
  reflectionTiming: "immediate" | "short_delay";
};

export type KheperaGatewayDependencies = {
  consumeRateLimit: (userId: string) => Promise<void>;
  requestReflection: (entryText: string) => Promise<unknown>;
  persistGeneratedSession?: (
    userId: string,
    entryText: string,
    response: KheperaGatewayResponse,
    session: KheperaSessionPersistenceRequest,
  ) => Promise<void>;
};

export type KheperaRateLimitState = {
  count: number;
  windowStart: number;
  lastRequest: number;
};

export type KheperaRateLimitDecision =
  | { allowed: true; state: KheperaRateLimitState }
  | { allowed: false };

export class KheperaGatewayError extends Error {
  constructor(
    readonly code: "unauthenticated" | "invalid-argument" | "failed-precondition" | "resource-exhausted" | "unavailable",
    message: string,
  ) {
    super(message);
    this.name = "KheperaGatewayError";
  }
}

export function evaluateKheperaRateLimit(
  previous: { count?: unknown; windowStart?: unknown } | undefined,
  now: number,
  windowMs: number,
  maxRequests: number,
): KheperaRateLimitDecision {
  const windowStart = typeof previous?.windowStart === "number" ? previous.windowStart : now;
  const count = typeof previous?.count === "number" ? previous.count : 0;

  if (!previous || now - windowStart >= windowMs) {
    return { allowed: true, state: { count: 1, windowStart: now, lastRequest: now } };
  }

  if (count >= maxRequests) {
    return { allowed: false };
  }

  return {
    allowed: true,
    state: { count: count + 1, windowStart, lastRequest: now },
  };
}

function parseEntryText(data: unknown): string {
  if (typeof data !== "object" || data === null || !("entryText" in data)) {
    throw new KheperaGatewayError("invalid-argument", "entryText is required");
  }

  const entryText = (data as { entryText: unknown }).entryText;
  if (typeof entryText !== "string" || entryText.trim().length < 3 || entryText.length > 12000) {
    throw new KheperaGatewayError("invalid-argument", "entryText is invalid");
  }

  return entryText;
}

function parseSessionPersistence(data: unknown): KheperaSessionPersistenceRequest | null {
  if (typeof data !== "object" || data === null || !("session" in data) || data.session == null) {
    return null;
  }
  const session = data.session;
  if (typeof session !== "object" || session === null || Array.isArray(session)) {
    throw new KheperaGatewayError("invalid-argument", "session persistence data is invalid");
  }
  const candidate = session as Record<string, unknown>;
  const sessionId = candidate.sessionId;
  const writtenAt = candidate.writtenAt;
  const reflectionTiming = candidate.reflectionTiming;
  if (
    typeof sessionId !== "string"
    || !/^[A-Za-z0-9_-]{8,128}$/.test(sessionId)
    || typeof writtenAt !== "string"
    || Number.isNaN(Date.parse(writtenAt))
    || (reflectionTiming !== "immediate" && reflectionTiming !== "short_delay")
  ) {
    throw new KheperaGatewayError("invalid-argument", "session persistence data is invalid");
  }

  return {
    sessionId,
    writtenAt,
    reflectionTiming,
  };
}

function parseKheperaResponse(value: unknown): KheperaGatewayResponse {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new KheperaGatewayError("failed-precondition", "Model response did not match the Khepera contract");
  }

  const keys = Object.keys(value);
  if (keys.length !== 3 || !keys.includes("witness") || !keys.includes("perspective") || !keys.includes("seed")) {
    throw new KheperaGatewayError("failed-precondition", "Model response did not match the Khepera contract");
  }

  const candidate = value as Record<string, unknown>;
  if (
    typeof candidate.witness !== "string"
    || typeof candidate.perspective !== "string"
    || typeof candidate.seed !== "string"
    || !candidate.witness.trim()
    || !candidate.perspective.trim()
    || !candidate.seed.trim()
  ) {
    throw new KheperaGatewayError("failed-precondition", "Model response did not match the Khepera contract");
  }

  return {
    witness: candidate.witness,
    perspective: candidate.perspective,
    seed: candidate.seed,
  };
}

export async function handleKheperaGenerationRequest(
  data: unknown,
  authenticatedUserId: string | undefined,
  dependencies: KheperaGatewayDependencies,
): Promise<KheperaGatewayResult> {
  if (!authenticatedUserId) {
    throw new KheperaGatewayError("unauthenticated", "User must be authenticated");
  }

  const entryText = parseEntryText(data);
  const session = parseSessionPersistence(data);

  if (detectCrisisSignals(entryText)) {
    return { blockedByCrisis: true, response: null, sessionId: null };
  }

  await dependencies.consumeRateLimit(authenticatedUserId);
  const rawResponse = await dependencies.requestReflection(entryText);
  const response = parseKheperaResponse(rawResponse);
  const validation = validateKheperaOutput(response);

  if (!validation.ok) {
    throw new KheperaGatewayError("failed-precondition", "Model response failed Khepera safety validation");
  }

  if (session) {
    if (!dependencies.persistGeneratedSession) {
      throw new KheperaGatewayError("unavailable", "Session persistence is unavailable");
    }
    await dependencies.persistGeneratedSession(authenticatedUserId, entryText, response, session);
  }

  return { blockedByCrisis: false, response, sessionId: session?.sessionId ?? null };
}
