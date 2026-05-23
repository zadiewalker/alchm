#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import {
  fileHash,
  hashDirectory,
  isGitDirty,
  readPackageJson,
  repoRoot,
  runGit,
} from './release-utils.mjs';

const outputPath = resolve(repoRoot, process.argv[2] || 'release-artifacts/release-manifest.json');
const packageJson = readPackageJson();
const capacitorOnlyFiles = new Set(['cordova.js', 'cordova_plugins.js']);

function commandVersion(command, args) {
  try {
    return execFileSync(command, args, {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
}

function getReleaseInfo() {
  try {
    const text = readFileSync(resolve(repoRoot, 'src/config/releaseInfo.ts'), 'utf8');
    return {
      appVersion: text.match(/APP_VERSION\s*=\s*['"]([^'"]+)['"]/)?.[1] ?? packageJson.version,
      iosBuildNumber: text.match(/IOS_BUILD_NUMBER\s*=\s*['"]([^'"]+)['"]/)?.[1] ?? null,
    };
  } catch {
    return {
      appVersion: packageJson.version,
      iosBuildNumber: null,
    };
  }
}

function getGitBranch() {
  const localBranch = runGit(['branch', '--show-current'], '');
  if (localBranch) {
    return localBranch;
  }

  return process.env.GITHUB_HEAD_REF
    || process.env.GITHUB_REF_NAME
    || process.env.VERCEL_GIT_COMMIT_REF
    || process.env.GITHUB_REF?.replace(/^refs\/heads\//, '')
    || process.env.GITHUB_REF?.replace(/^refs\/pull\//, 'pull/')
    || 'detached';
}

const outHash = hashDirectory(resolve(repoRoot, 'out'));
const iosPublicHash = hashDirectory(resolve(repoRoot, 'ios/App/App/public'), {
  ignoreRelativePaths: capacitorOnlyFiles,
});
const releaseInfo = getReleaseInfo();

const manifest = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  git: {
    branch: getGitBranch(),
    commit: runGit(['rev-parse', 'HEAD'], 'unknown'),
    dirty: isGitDirty(),
  },
  runtime: {
    node: process.version,
    npm: commandVersion('npm', ['--version']),
    packageManager: 'npm',
  },
  app: {
    packageName: packageJson.name,
    packageVersion: packageJson.version,
    appVersion: releaseInfo.appVersion,
    iosBuildNumber: releaseInfo.iosBuildNumber,
  },
  inputs: {
    lockfile: {
      path: 'package-lock.json',
      sha256: fileHash(resolve(repoRoot, 'package-lock.json')),
    },
    packageJson: {
      path: 'package.json',
      sha256: fileHash(resolve(repoRoot, 'package.json')),
    },
    nextConfig: {
      path: 'next.config.js',
      sha256: fileHash(resolve(repoRoot, 'next.config.js')),
    },
    capacitorConfig: {
      path: 'capacitor.config.ts',
      sha256: fileHash(resolve(repoRoot, 'capacitor.config.ts')),
    },
    firebaseConfig: {
      path: 'firebase.json',
      sha256: fileHash(resolve(repoRoot, 'firebase.json')),
    },
  },
  artifacts: {
    out: outHash,
    iosPublic: iosPublicHash,
  },
  ci: {
    provider: process.env.GITHUB_ACTIONS ? 'github-actions' : process.env.VERCEL ? 'vercel' : null,
    runId: process.env.GITHUB_RUN_ID ?? null,
    runAttempt: process.env.GITHUB_RUN_ATTEMPT ?? null,
    workflow: process.env.GITHUB_WORKFLOW ?? null,
    ref: process.env.GITHUB_REF ?? null,
    sha: process.env.GITHUB_SHA ?? process.env.VERCEL_GIT_COMMIT_SHA ?? null,
  },
  native: {
    xcodeWorkspace: 'ios/App/App.xcworkspace',
    xcodeScheme: 'App',
    capacitorIosPublicDir: 'ios/App/App/public',
    allowedCapacitorOnlyFiles: Array.from(capacitorOnlyFiles).sort(),
  },
  deployment: {
    authoritativeWebTarget: 'vercel',
    firebaseHostingSite: 'alchmapp',
    firebaseAppHostingBackend: 'studio',
    firebaseAppHostingStatus: 'de-scoped until disabled or explicitly re-certified',
  },
};

mkdirSync(resolve(outputPath, '..'), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Release manifest written: ${outputPath}`);
