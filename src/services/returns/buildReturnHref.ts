import type { ReturnNavigationState } from '@/types/return';

export function buildReturnHref(state: ReturnNavigationState): string {
  const params = new URLSearchParams({
    entryId: state.entryId,
    returnType: state.returnType,
  });

  if (typeof state.surfacedAt === 'number' && Number.isFinite(state.surfacedAt)) {
    params.set('surfacedAt', String(state.surfacedAt));
  }

  if (typeof state.daysElapsed === 'number' && Number.isFinite(state.daysElapsed)) {
    params.set('daysElapsed', String(state.daysElapsed));
  }

  if (state.resurfacingTone) {
    params.set('resurfacingTone', state.resurfacingTone);
  }

  return `/return?${params.toString()}`;
}
