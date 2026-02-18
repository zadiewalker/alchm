'use client';

export interface BodySensation {
  region: BodyRegionId;
  description: string | null;
}

export const BODY_REGIONS = [
  { id: 'head', label: 'Head', prompt: 'Pressure, fog, racing thoughts?' },
  { id: 'face', label: 'Face / Jaw', prompt: 'Tension, flushing, clenching?' },
  { id: 'throat', label: 'Throat', prompt: 'Tightness, lump, holding words back?' },
  { id: 'chest', label: 'Chest', prompt: 'Tight, heavy, fluttery, hollow?' },
  { id: 'stomach', label: 'Stomach', prompt: 'Knotted, queasy, sinking, empty?' },
  { id: 'shoulders', label: 'Shoulders', prompt: 'Carrying, tense, hunched, aching?' },
  { id: 'hands', label: 'Hands', prompt: 'Clenched, shaking, numb, restless?' },
  { id: 'whole', label: 'Everywhere', prompt: "It's in your whole body." },
  { id: 'nowhere', label: "Can't tell", prompt: "That's okay. Sometimes it hides." },
] as const;

export type BodyRegionId = (typeof BODY_REGIONS)[number]['id'];

export function buildSomaticContext(sensation: BodySensation | null): string {
  if (!sensation) return '';
  const region = BODY_REGIONS.find((r) => r.id === sensation.region);
  if (!region) return '';

  let ctx = `The user reports feeling this emotion in their ${region.label.toLowerCase()}.`;
  if (sensation.description && sensation.description.trim()) {
    ctx += ` They describe the sensation as: "${sensation.description.trim()}"`;
  }
  ctx += ` Acknowledge this physical experience naturally in your reflection. Do not diagnose it.`;
  return ctx;
}

