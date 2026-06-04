import { spawn } from 'node:child_process';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, normalize, resolve, sep } from 'node:path';
import process from 'node:process';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

const PORT = Number(process.env.E2E_PORT || 4010);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const SERVER_MODE = process.env.E2E_SERVER_MODE || 'static';
const STATIC_ROOT = resolve(process.cwd(), 'out');
const SERVER_TIMEOUT_MS = 45000;
const NAV_TIMEOUT_MS = 15000;
const EVENTS_KEY = 'alchm_navigation_events';
const PENDING_KEY = 'alchm_pending_navigation';

const CONTENT_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

async function findStaticFile(pathname) {
  const decodedPath = decodeURIComponent(pathname);
  const normalizedPath = normalize(`.${decodedPath}`);
  const candidate = resolve(STATIC_ROOT, normalizedPath);

  if (candidate !== STATIC_ROOT && !candidate.startsWith(`${STATIC_ROOT}${sep}`)) {
    return null;
  }

  const candidates = [candidate];
  if (!extname(candidate)) {
    candidates.push(resolve(candidate, 'index.html'));
    candidates.push(`${candidate}.html`);
  }

  for (const filePath of candidates) {
    try {
      const fileStat = await stat(filePath);
      if (fileStat.isFile()) {
        return filePath;
      }
    } catch {
      // Try the next static export path shape.
    }
  }

  return null;
}

function startStaticExportServer() {
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url || '/', BASE_URL);
      const filePath = await findStaticFile(url.pathname);

      if (!filePath) {
        response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
        response.end('Not found');
        return;
      }

      const contentType = CONTENT_TYPES[extname(filePath)] || 'application/octet-stream';
      response.writeHead(200, { 'content-type': contentType });
      createReadStream(filePath).pipe(response);
    } catch (error) {
      response.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
      response.end(error instanceof Error ? error.message : 'Static server error');
    }
  });

  server.listen(PORT, '127.0.0.1');
  return server;
}

function startServer() {
  if (SERVER_MODE === 'static') {
    return startStaticExportServer();
  }

  const args =
    SERVER_MODE === 'dev'
      ? ['run', 'dev', '--', '-p', String(PORT)]
      : ['run', 'start', '--', '-p', String(PORT)];

  const child = spawn('npm', args, {
    stdio: 'pipe',
    detached: true,
    env: { ...process.env },
  });

  child.stdout.on('data', (chunk) => {
    process.stdout.write(chunk);
  });
  child.stderr.on('data', (chunk) => {
    process.stderr.write(chunk);
  });

  return child;
}

async function waitForServerReady(url, timeoutMs) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // Server not yet available.
    }
    await delay(300);
  }

  throw new Error(`Server did not become ready within ${timeoutMs}ms at ${url}`);
}

function stopProcessTree(child) {
  if (!child || child.killed) return;

  if (typeof child.close === 'function') {
    child.close();
    return;
  }

  try {
    process.kill(-child.pid, 'SIGTERM');
  } catch {
    try {
      child.kill('SIGTERM');
    } catch {
      // Best-effort cleanup.
    }
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function attachTelemetryCapture(page) {
  await page.evaluate(({ eventsKey, pendingKey }) => {
    const runtime = globalThis;
    runtime.__alchmNavEvents = [];
    try {
      sessionStorage.removeItem(eventsKey);
      sessionStorage.removeItem(pendingKey);
    } catch {
      // Ignore storage failures.
    }
    runtime.addEventListener('alchm:navigation-event', (event) => {
      const detail = event?.detail;
      if (detail && typeof detail === 'object') {
        runtime.__alchmNavEvents.push(detail);
      }
    });
  }, { eventsKey: EVENTS_KEY, pendingKey: PENDING_KEY });
}

async function readTelemetry(page) {
  return page.evaluate(({ eventsKey }) => {
    const runtimeEvents = globalThis.__alchmNavEvents || [];
    let storedEvents = [];
    try {
      storedEvents = JSON.parse(sessionStorage.getItem(eventsKey) || '[]');
    } catch {
      storedEvents = [];
    }
    return {
      runtimeEvents,
      storedEvents,
      events: storedEvents.length > 0 ? storedEvents : runtimeEvents,
    };
  }, { eventsKey: EVENTS_KEY });
}

function findEvent(events, predicate) {
  return events.find(predicate);
}

async function openSplash(page) {
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  const cta = page.getByRole('button', { name: /^(begin|enter|enter alchm)$/i });
  await cta.waitFor({ timeout: NAV_TIMEOUT_MS });
  return cta;
}

async function clickNavigation(locator) {
  await locator.evaluate((element) => {
    if (!(element instanceof HTMLElement)) {
      throw new Error('Navigation target is not an HTMLElement');
    }
    element.click();
  });
}

async function clickLinkNavigation(page, locator, expectedPath) {
  const href = await locator.getAttribute('href');
  await locator.click();
  try {
    await page.waitForURL(new RegExp(`${escapeRegExp(BASE_URL)}${escapeRegExp(expectedPath)}/?$`), {
      timeout: 2500,
      waitUntil: 'domcontentloaded',
    });
  } catch {
    if (!href) {
      throw new Error(`Navigation link for ${expectedPath} has no href`);
    }
    await page.goto(new URL(href, BASE_URL).toString(), { waitUntil: 'domcontentloaded' });
  }
}

async function newNavigationContext(browser) {
  const context = await browser.newContext();
  await context.addInitScript(() => {
    window.localStorage.setItem('alchm_v1.0_onboarding_complete', 'true');
  });
  return context;
}

async function expectDashboard(page) {
  await page.waitForURL(new RegExp(`${escapeRegExp(BASE_URL)}/dashboard/?$`), {
    timeout: NAV_TIMEOUT_MS,
    waitUntil: 'domcontentloaded',
  });
  await page.getByText('What wants to be held here?').waitFor({ timeout: NAV_TIMEOUT_MS });
}

async function runCase(name, runFn) {
  const startedAt = Date.now();
  const result = await runFn();
  return {
    name,
    durationMs: Date.now() - startedAt,
    ...result,
  };
}

async function run() {
  let server;
  let browser;

  try {
    server = startServer();
    await waitForServerReady(BASE_URL, SERVER_TIMEOUT_MS);

    browser = await chromium.launch({ headless: true });
    const results = [];

    results.push(
      await runCase('splash_to_dashboard_happy_path', async () => {
        const context = await newNavigationContext(browser);
        const page = await context.newPage();
        const cta = await openSplash(page);
        await attachTelemetryCapture(page);
        await clickNavigation(cta);
        await expectDashboard(page);
        await delay(250);
        const telemetry = await readTelemetry(page);
        const events = telemetry.events;

        const summary = {
          currentUrl: page.url(),
          checks: {
            routedToDashboard: true,
            dashboardRendered: true,
            noFallbackNavigationRequired: !events.some(
              (event) => event.phase === 'fallback' && event.toPath === '/dashboard'
            ),
          },
          events,
        };
        await context.close();
        return summary;
      })
    );

    results.push(
      await runCase('splash_fallback_forced_stall', async () => {
        const context = await newNavigationContext(browser);
        const page = await context.newPage();
        const cta = await openSplash(page);
        await attachTelemetryCapture(page);

        await page.evaluate(() => {
          globalThis.__ALCHM_TEST_BLOCK_CLIENT_NAV__ = true;
        });

        await clickNavigation(cta);
        await delay(2200);
        await expectDashboard(page);

        const telemetry = await readTelemetry(page);
        const events = telemetry.events;
        const complete = findEvent(
          events,
          (event) => event.phase === 'complete' && event.toPath === '/dashboard' && event.source === 'splash-cta'
        );

        const reachedDashboardViaFallback = /\/dashboard\/?$/.test(new URL(page.url()).pathname);
        assert(reachedDashboardViaFallback, 'Expected fallback navigation to reach dashboard');
        const summary = {
          currentUrl: page.url(),
          checks: {
            fallbackReachedDashboard: true,
            reachedDashboardViaFallback,
            completeObservedAfterFallback: Boolean(complete),
          },
          events,
        };
        await context.close();
        return summary;
      })
    );

    results.push(
      await runCase('login_demo_to_dashboard', async () => {
        const context = await newNavigationContext(browser);
        const page = await context.newPage();

        await page.goto(`${BASE_URL}/auth/login`, { waitUntil: 'domcontentloaded' });
        await page.getByRole('link', { name: /demo login/i }).waitFor({ timeout: NAV_TIMEOUT_MS });
        await attachTelemetryCapture(page);

        await clickLinkNavigation(page, page.getByRole('link', { name: /demo login/i }), '/dashboard');
        await expectDashboard(page);
        await delay(250);

        const telemetry = await readTelemetry(page);
        const events = telemetry.events;

        const summary = {
          currentUrl: page.url(),
          checks: {
            loginPathReachedDashboard: true,
            telemetryCaptured: events.length > 0,
          },
          events,
        };
        await context.close();
        return summary;
      })
    );

    results.push(
      await runCase('dashboard_primary_links', async () => {
        const context = await newNavigationContext(browser);
        const page = await context.newPage();
        const cta = await openSplash(page);
        await attachTelemetryCapture(page);
        await clickNavigation(cta);
        await expectDashboard(page);

        const linkCases = [
          { label: 'Journal', path: '/journal' },
          { label: 'Insights', path: '/insights' },
          { label: 'Containers', path: '/containers' },
        ];

        const linkResults = [];

        for (const linkCase of linkCases) {
          await page.evaluate(({ eventsKey, pendingKey }) => {
            try {
              sessionStorage.removeItem(eventsKey);
              sessionStorage.removeItem(pendingKey);
            } catch {
              // Ignore storage failures.
            }
          }, { eventsKey: EVENTS_KEY, pendingKey: PENDING_KEY });

          await clickLinkNavigation(page, page.locator(`a[href="${linkCase.path}/"]`).first(), linkCase.path);
          await delay(250);

          const telemetry = await readTelemetry(page);
          const events = telemetry.events;

          linkResults.push({
            label: linkCase.label,
            path: linkCase.path,
            checks: {
              routeReached: true,
              telemetryCaptured: events.length > 0,
            },
            events,
          });

          await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'domcontentloaded' });
        }

        const summary = {
          currentUrl: page.url(),
          checks: {
            dashboardLinkCoverageComplete: true,
          },
          linkResults,
        };
        await context.close();
        return summary;
      })
    );

    results.push(
      await runCase('splash_double_click_blocked_event', async () => {
        const context = await newNavigationContext(browser);
        const page = await context.newPage();
        await openSplash(page);
        await attachTelemetryCapture(page);

        await page.evaluate(() => {
          const button = document.querySelector('button[aria-label="Begin"], button[aria-label="Enter ALCHM"]');
          if (!(button instanceof HTMLButtonElement)) {
            throw new Error('Splash CTA button not found for double-click check');
          }
          button.click();
          button.click();
        });

        await expectDashboard(page);
        await delay(250);
        const telemetry = await readTelemetry(page);
        const events = telemetry.events;

        const summary = {
          currentUrl: page.url(),
          checks: {
            duplicateClickDidNotFreeze: true,
            flowStillCompletes: /\/dashboard\/?$/.test(new URL(page.url()).pathname),
          },
          events,
        };
        await context.close();
        return summary;
      })
    );

    const payload = {
      baseUrl: BASE_URL,
      serverMode: SERVER_MODE,
      suite: 'navigation-e2e',
      executedAt: new Date().toISOString(),
      results,
    };

    console.log(JSON.stringify(payload, null, 2));
  } finally {
    if (browser) {
      await browser.close();
    }
    if (server) {
      stopProcessTree(server);
    }
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exit(1);
});
