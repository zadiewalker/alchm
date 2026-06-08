import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import ts from 'typescript';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const transpileCacheDir = path.join(os.tmpdir(), 'alchm-node-ts-test-loader');

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

export async function importTypeScriptModule(specifier, parentUrl = import.meta.url) {
  const parent = parentUrl.startsWith('file:')
    ? path.dirname(fileURLToPath(parentUrl))
    : repo;
  const resolved = resolveExisting(path.resolve(parent, specifier));
  if (!resolved) {
    throw new Error(`Unable to resolve TypeScript test module: ${specifier}`);
  }

  fs.mkdirSync(transpileCacheDir, { recursive: true });
  const source = fs.readFileSync(resolved, 'utf8');
  const cacheKey = createHash('sha256')
    .update(resolved)
    .update('\0')
    .update(source)
    .digest('hex');
  const outputPath = path.join(transpileCacheDir, `${cacheKey}.mjs`);

  if (!fs.existsSync(outputPath)) {
    const output = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.ES2022,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
        importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Remove,
      },
      fileName: resolved,
    }).outputText;
    fs.writeFileSync(outputPath, output);
  }

  return import(pathToFileURL(outputPath).href);
}
