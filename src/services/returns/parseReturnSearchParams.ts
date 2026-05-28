import type {
  ParsedReturnSearchParams,
  ReturnType,
} from '@/types/return';
import type { ResurfacingToneMode } from '@/types/resurfacingTone';

type SearchParamValue = string | string[] | undefined;

export interface ReturnPageSearchParams {
  entryId?: SearchParamValue;
  returnType?: SearchParamValue;
  surfacedAt?: SearchParamValue;
  daysElapsed?: SearchParamValue;
  resurfacingTone?: SearchParamValue;
}

function readSingle(value: SearchParamValue): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseFiniteNumber(value: SearchParamValue): number | undefined {
  const parsed = readSingle(value);

  if (!parsed) {
    return undefined;
  }

  const numeric = Number(parsed);

  if (!Number.isFinite(numeric)) {
    return undefined;
  }

  return numeric;
}

function parseReturnType(value: SearchParamValue): ReturnType {
  const parsed = readSingle(value);

  switch (parsed) {
    case 'pattern':
    case 'contrast':
    case 'seed':
      return parsed;
    default:
      return 'seed';
  }
}

function parseResurfacingTone(value: SearchParamValue): ResurfacingToneMode | undefined {
  const parsed = readSingle(value);

  switch (parsed) {
    case 'quiet_continuity':
    case 'seasonal_return':
    case 'emotional_echo':
    case 'unresolved_warmth':
    case 'parallel_texture':
    case 'soft_recurrence':
      return parsed;
    default:
      return undefined;
  }
}

export function parseReturnSearchParams(
  searchParams?: ReturnPageSearchParams,
): ParsedReturnSearchParams {
  return {
    entryId: readSingle(searchParams?.entryId),
    returnType: parseReturnType(searchParams?.returnType),
    surfacedAt: parseFiniteNumber(searchParams?.surfacedAt),
    daysElapsed: parseFiniteNumber(searchParams?.daysElapsed),
    resurfacingTone: parseResurfacingTone(searchParams?.resurfacingTone),
  };
}
