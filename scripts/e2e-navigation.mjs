import { spawn } from 'node:child_process';
import process from 'node:process';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

const PORT = Number(process.env.E2E_PORT || 4010);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const SERVER_MODE = process.env.E2E_SERVER_MODE || 'start';
const SERVER_TIMEOUT_MS = 45000;
const NAV_TIMEOUT_MS = 15000;
const EVENTS_KEY = 'alchm_navigation_events';
const PENDING_KEY = 'alchm_pending_navigation';

function startServer() {
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
  const cta = page.getByRole('button', { name: /begin your journey/i });
  await cta.waitFor({ timeout: NAV_TIMEOUT_MS });
  return cta;
}

async function expectDashboard(page) {
  await page.waitForURL(new RegExp(`${escapeRegExp(BASE_URL)}/dashboard/?$`), {
    timeout: NAV_TIMEOUT_MS,
    waitUntil: 'domcontentloaded',
  });
  await page.getByText('Your Sanctuary', { exact: false }).waitFor({ timeout: NAV_TIMEOUT_MS });
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
        const context = await browser.newContext();
        const page = await context.newPage();
        const cta = await openSplash(page);
        await attachTelemetryCapture(page);
        await cta.click();
        await expectDashboard(page);
        await delay(250);
        const telemetry = await readTelemetry(page);
        const events = telemetry.events;

        const attemptIndex = events.findIndex(
          (event) => event.phase === 'attempt' && event.toPath === '/dashboard' && event.source === 'splash-cta'
        );
        const completeIndex = events.findIndex(
          (event) => event.phase === 'complete' && event.toPath === '/dashboard' && event.source === 'splash-cta'
        );
        const fallback = findEvent(
          events,
          (event) => event.phase === 'fallback' && event.toPath === '/dashboard' && event.source === 'splash-cta'
        );

        assert(attemptIndex >= 0, 'Missing splash attempt event');
        assert(completeIndex >= 0, 'Missing splash complete event');
        assert(completeIndex > attemptIndex, 'Complete event must occur after attempt');
        assert(!fallback, 'Fallback should not trigger on healthy splash navigation');

        const summary = {
          currentUrl: page.url(),
          checks: {
            routedToDashboard: true,
            dashboardRendered: true,
            telemetryOrderValid: true,
            noFallbackTriggered: true,
          },
          events,
        };
        await context.close();
        return summary;
      })
    );

    results.push(
      await runCase('splash_fallback_forced_stall', async () => {
        const context = await browser.newContext();
        const page = await context.newPage();
        const cta = await openSplash(page);
        await attachTelemetryCapture(page);

        await page.evaluate(() => {
          globalThis.__ALCHM_TEST_BLOCK_CLIENT_NAV__ = true;
        });

        await cta.click();
        await delay(2200);

        const telemetry = await readTelemetry(page);
        const events = telemetry.events;
        const fallback = findEvent(
          events,
          (event) => event.phase === 'fallback' && event.toPath === '/dashboard' && event.source === 'splash-cta'
        );
        const complete = findEvent(
          events,
          (event) => event.phase === 'complete' && event.toPath === '/dashboard' && event.source === 'splash-cta'
        );

        assert(fallback, 'Expected fallback event when router state updates are blocked');

        const reachedDashboardViaFallback = /\/dashboard\/?$/.test(new URL(page.url()).pathname);
        const summary = {
          currentUrl: page.url(),
          checks: {
            fallbackTriggered: true,
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
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto(`${BASE_URL}/auth/login`, { waitUntil: 'domcontentloaded' });
        await page.getByRole('link', { name: /demo login/i }).waitFor({ timeout: NAV_TIMEOUT_MS });
        await attachTelemetryCapture(page);

        await page.getByRole('link', { name: /demo login/i }).click();
        await expectDashboard(page);
        await delay(250);

        const telemetry = await readTelemetry(page);
        const events = telemetry.events;
        const attempt = findEvent(
          events,
          (event) => event.phase === 'attempt' && event.toPath === '/dashboard' && `${event.source || ''}`.startsWith('link:')
        );
        const complete = findEvent(
          events,
          (event) => event.phase === 'complete' && event.toPath === '/dashboard' && `${event.source || ''}`.startsWith('link:')
        );

        assert(attempt, 'Expected login->dashboard attempt event');
        assert(complete, 'Expected login->dashboard complete event');

        const summary = {
          currentUrl: page.url(),
          checks: {
            loginPathReachedDashboard: true,
            telemetryCaptured: true,
          },
          events,
        };
        await context.close();
        return summary;
      })
    );

    results.push(
      await runCase('dashboard_primary_links', async () => {
        const context = await browser.newContext();
        const page = await context.newPage();
        const cta = await openSplash(page);
        await attachTelemetryCapture(page);
        await cta.click();
        await expectDashboard(page);

        const linkCases = [
          { label: 'Journal', path: '/journal' },
          { label: 'Insights', path: '/insights' },
          { label: 'Pathways', path: '/pathways' },
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

          await page.getByRole('link', { name: linkCase.label }).click();
          await page.waitForURL(new RegExp(`${escapeRegExp(BASE_URL)}${escapeRegExp(linkCase.path)}/?$`), {
            timeout: NAV_TIMEOUT_MS,
          });
          await delay(250);

          const telemetry = await readTelemetry(page);
          const events = telemetry.events;
          const attempt = findEvent(
            events,
            (event) => event.phase === 'attempt' && event.toPath === linkCase.path && `${event.source || ''}`.startsWith('link:')
          );
          const complete = findEvent(
            events,
            (event) => event.phase === 'complete' && event.toPath === linkCase.path && `${event.source || ''}`.startsWith('link:')
          );

          assert(attempt, `Missing attempt event for ${linkCase.path}`);
          assert(complete, `Missing complete event for ${linkCase.path}`);

          linkResults.push({
            label: linkCase.label,
            path: linkCase.path,
            checks: {
              routeReached: true,
              telemetryCaptured: true,
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
        const context = await browser.newContext();
        const page = await context.newPage();
        await openSplash(page);
        await attachTelemetryCapture(page);

        await page.evaluate(() => {
          const button = document.querySelector('button[aria-label="Begin your journey"]');
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

        const blocked = findEvent(
          events,
          (event) => event.phase === 'blocked' && event.toPath === '/dashboard' && event.source === 'splash-cta'
        );
        const complete = findEvent(
          events,
          (event) => event.phase === 'complete' && event.toPath === '/dashboard' && event.source === 'splash-cta'
        );

        assert(blocked, 'Expected blocked event after rapid double click');
        assert(complete, 'Expected successful completion despite blocked duplicate click');

        const summary = {
          currentUrl: page.url(),
          checks: {
            blockedEventCaptured: true,
            flowStillCompletes: true,
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
