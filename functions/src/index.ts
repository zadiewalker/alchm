import { onRequest, type Request } from "firebase-functions/v2/https";
import type { Response } from "express";

const allowedOrigins = new Set([
  "https://alchmapp.web.app",
  "https://alchm-digital-sanctuary.web.app",
  "https://alchm.vercel.app",
  "http://localhost:3000",
  "http://localhost:5002",
]);

type JsonResponse = {
  status: "retired" | "healthy";
  service: string;
  message: string;
  canonicalSurface: string;
};

function applyResponseHeaders(req: Request, res: Response): void {
  const origin = req.get("origin");

  if (origin && allowedOrigins.has(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
    res.set("Vary", "Origin");
  }

  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.set("Cache-Control", "no-store");
}

function sendJson(
  req: Request,
  res: Response,
  statusCode: number,
  body: JsonResponse,
): void {
  applyResponseHeaders(req, res);
  res.status(statusCode).json(body);
}

function handleOptions(req: Request, res: Response): boolean {
  if (req.method !== "OPTIONS") {
    return false;
  }

  applyResponseHeaders(req, res);
  res.status(204).send("");
  return true;
}

const retiredFunctionOptions = {
  memory: "512MiB" as const,
  timeoutSeconds: 60,
  minInstances: 0,
  maxInstances: 10,
  concurrency: 1000,
};

export const crisisDetection = onRequest(retiredFunctionOptions, (req, res) => {
  if (handleOptions(req, res)) {
    return;
  }

  sendJson(req, res, 410, {
    status: "retired",
    service: "alchm-functions",
    message: "This legacy Firebase Functions endpoint is retired. ALCHM now handles safety checks in the canonical app submission pipeline before reflection generation.",
    canonicalSurface: "src/services/journal/submissionPipeline.ts",
  });
});

export const healthCheck = onRequest(retiredFunctionOptions, (req, res) => {
  if (handleOptions(req, res)) {
    return;
  }

  sendJson(req, res, 200, {
    status: "healthy",
    service: "alchm-functions",
    message: "Only retired compatibility and health endpoints are deployed from Firebase Functions.",
    canonicalSurface: "src/services/journal/submissionPipeline.ts",
  });
});
