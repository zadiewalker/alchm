#!/usr/bin/env node
import { readFileSync } from "node:fs";

const docPath = "docs/release/DEPLOYMENT_TOPOLOGY_DECISION.md";
const allowed = new Set([
  "FIREBASE_AUTHORITATIVE",
  "VERCEL_AUTHORITATIVE",
  "INTENTIONAL_SPLIT",
]);

function fail(message) {
  console.error(`[deployment-topology] ${message}`);
  process.exitCode = 1;
}

let doc;
try {
  doc = readFileSync(docPath, "utf8");
} catch {
  fail(`missing ${docPath}`);
}

if (doc) {
  const match = doc.match(/Selected topology:\s*`([^`]+)`/);
  const selected = match?.[1];

  if (!selected) {
    fail("missing `Selected topology:` marker");
  } else if (!allowed.has(selected)) {
    fail(`unresolved or invalid selected topology: ${selected}`);
  }

  for (const required of [
    "Functions deployment authority",
    "Firestore rules deployment authority",
    "Hosting authority",
    "Rollback authority",
    "Provider-secret deployment authority",
  ]) {
    if (!doc.includes(required)) {
      fail(`missing required authority text: ${required}`);
    }
  }
}

if (process.exitCode) {
  console.error("[deployment-topology] NOT CERTIFIED: deployment topology authority is unresolved.");
} else {
  console.log("[deployment-topology] deployment topology decision present.");
}
