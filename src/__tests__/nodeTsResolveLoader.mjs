import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function resolveExisting(basePath) {
  const candidates = path.extname(basePath)
    ? [basePath]
    : [`${basePath}.ts`, `${basePath}.tsx`, `${basePath}.js`, `${basePath}.mjs`, path.join(basePath, 'index.ts')];

  return candidates.find((candidate) => fs.existsSync(candidate)) ?? null;
}

export function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const resolved = resolveExisting(path.join(repo, 'src', specifier.slice(2)));
    if (resolved) return { url: pathToFileURL(resolved).href, shortCircuit: true };
  }

  if (specifier.startsWith('.') && context.parentURL?.startsWith('file:')) {
    const parent = path.dirname(fileURLToPath(context.parentURL));
    const resolved = resolveExisting(path.resolve(parent, specifier));
    if (resolved) return { url: pathToFileURL(resolved).href, shortCircuit: true };
  }

  return nextResolve(specifier, context);
}
