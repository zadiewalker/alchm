/** @type {import('next').NextConfig} */
const fs = require('fs');
const os = require('os');
const path = require('path');

let serverBuildSnapshotDir = null;
let restoreInterval = null;

function copyDirectory(source, destination) {
  fs.rmSync(destination, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.cpSync(source, destination, { recursive: true });
}

function serverBuildPath(fileName = '') {
  return path.join(__dirname, '.next/server', fileName);
}

function hasRequiredServerBuildFiles() {
  return fs.existsSync(serverBuildPath('pages-manifest.json'))
    && fs.existsSync(serverBuildPath('app-paths-manifest.json'));
}

function hasSnapshotableServerBuildFiles() {
  return fs.existsSync(serverBuildPath('app-paths-manifest.json'))
    || fs.existsSync(serverBuildPath('pages-manifest.json'));
}

function ensureRequiredServerBuildFiles() {
  fs.mkdirSync(serverBuildPath(), { recursive: true });
  const pagesManifestPath = serverBuildPath('pages-manifest.json');
  if (!fs.existsSync(pagesManifestPath)) {
    fs.writeFileSync(pagesManifestPath, '{}\n');
  }
}

function restoreServerBuildSnapshot() {
  if (
    serverBuildSnapshotDir
    && fs.existsSync(serverBuildSnapshotDir)
    && !hasRequiredServerBuildFiles()
  ) {
    copyDirectory(serverBuildSnapshotDir, serverBuildPath());
    ensureRequiredServerBuildFiles();
  }
}

const nextConfig = {
  output: 'export',
  outputFileTracing: false,
  trailingSlash: true,
  experimental: {
    webpackBuildWorker: false,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    config.plugins.push({
      apply(compiler) {
        compiler.hooks.done.tap('ALCHMServerBuildSnapshotPlugin', () => {
          const serverDir = serverBuildPath();

          if (isServer && fs.existsSync(serverDir) && hasSnapshotableServerBuildFiles()) {
            ensureRequiredServerBuildFiles();
            serverBuildSnapshotDir = path.join(os.tmpdir(), `alchm-next-server-${process.pid}`);
            copyDirectory(serverDir, serverBuildSnapshotDir);
          }

          if (!isServer && serverBuildSnapshotDir && !hasRequiredServerBuildFiles()) {
            restoreServerBuildSnapshot();
            if (!restoreInterval) {
              restoreInterval = setInterval(restoreServerBuildSnapshot, 100);
              setTimeout(() => {
                clearInterval(restoreInterval);
                restoreInterval = null;
              }, 15000);
            }
          }
        });
      },
    });
    config.output.clean = false;
    return config;
  },
};

module.exports = nextConfig;
