import type { KheperaResponse } from '@/types/khepera';

export function combineKheperaResponse(response: KheperaResponse): string {
  return [response.witness, response.perspective].filter(Boolean).join('\n\n');
}

export function splitKheperaResponse(
  combined: string,
  seed?: string
): Pick<KheperaResponse, 'witness' | 'perspective' | 'seed'> {
  const parts = combined
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    witness: parts[0] ?? '',
    perspective: parts.slice(1).join('\n\n'),
    seed: seed ?? '',
  };
}
