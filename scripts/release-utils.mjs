import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { relative, resolve, sep } from 'node:path';
import { execFileSync } from 'node:child_process';

export const repoRoot = resolve(new URL('..', import.meta.url).pathname);

export function toPosixPath(path) {
  return path.split(sep).join('/');
}

export function sha256File(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

export function sha256Text(value) {
  return createHash('sha256').update(value).digest('hex');
}

export function fileHash(path) {
  if (!existsSync(path)) {
    return null;
  }

  return sha256File(path);
}

export function listFiles(root, options = {}) {
  const {
    ignoreNames = new Set(['.DS_Store']),
    ignoreRelativePaths = new Set(),
  } = options;

  if (!existsSync(root)) {
    return [];
  }

  const files = [];

  function walk(dir) {
    for (const name of readdirSync(dir).sort()) {
      if (ignoreNames.has(name)) {
        continue;
      }

      const absolute = resolve(dir, name);
      const relativePath = toPosixPath(relative(root, absolute));
      if (ignoreRelativePaths.has(relativePath)) {
        continue;
      }

      const stat = statSync(absolute);
      if (stat.isDirectory()) {
        walk(absolute);
      } else if (stat.isFile()) {
        files.push({ path: relativePath, absolutePath: absolute, size: stat.size });
      }
    }
  }

  walk(root);
  return files;
}

export function hashDirectory(root, options = {}) {
  const files = listFiles(root, options).map((file) => ({
    path: file.path,
    size: file.size,
    sha256: sha256File(file.absolutePath),
  }));

  const aggregateInput = files
    .map((file) => `${file.sha256}  ${file.path}\n`)
    .join('');

  return {
    path: toPosixPath(relative(repoRoot, root)) || '.',
    aggregateHash: sha256Text(aggregateInput),
    fileCount: files.length,
    files,
  };
}

export function runGit(args, fallback = '') {
  try {
    return execFileSync('git', args, {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return fallback;
  }
}

export function isGitDirty() {
  return runGit(['status', '--short']) !== '';
}

export function readPackageJson() {
  return JSON.parse(readFileSync(resolve(repoRoot, 'package.json'), 'utf8'));
}

export function requiredPath(path) {
  const absolute = resolve(repoRoot, path);
  if (!existsSync(absolute)) {
    throw new Error(`Required path missing: ${path}`);
  }
  return absolute;
}
