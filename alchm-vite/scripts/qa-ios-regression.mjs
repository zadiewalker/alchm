import fs from 'node:fs';
import path from 'node:path';

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('Playwright is not installed. Install with: npm i -D playwright');
  process.exit(1);
}

const base = process.env.BASE_URL || 'http://127.0.0.1:4173';
const outDir = path.resolve('qa-screens-ios');
fs.mkdirSync(outDir, { recursive: true });

const viewports = [
  { name: 'iphone-se', width: 375, height: 667 },
  { name: 'iphone-pro-max', width: 430, height: 932 },
];

async function seed(page) {
  await page.goto(`${base}/dashboard/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('alchm-onboarding-complete', JSON.stringify(true));
    const now = Date.now();
    const entries = [
      {
        id: 'qa-entry-1',
        type: 'journal',
        content: 'I feel heavy but present.',
        createdAt: new Date(now - 86400000).toISOString(),
        updatedAt: new Date(now - 86400000).toISOString(),
        emotionSelection: { familyId: 'sadness', specificId: 'heavy', label: 'Heavy' },
      },
    ];
    localStorage.setItem('alchm-journal-entries', JSON.stringify(entries));
    localStorage.setItem('alchm-selected-entry-id', 'qa-entry-1');
    // Keep conversion-state deterministic for snapshot QA.
    const resetNow = new Date();
    const nextReset = new Date(Date.UTC(resetNow.getUTCFullYear(), resetNow.getUTCMonth() + 1, 1, 0, 0, 0)).toISOString();
    localStorage.setItem('alchm-subscription', JSON.stringify({
      tier: 'growth',
      expiresAt: null,
      reflectionsUsedThisMonth: 0,
      monthResetDate: nextReset,
      followUpsUsedThisMonth: 0,
      hasHadExerciseTaste: true,
      hasHadPatternTaste: true,
      weeklyNudgeDismissals: 0,
      lastNudgeDate: null,
      containerCompletionUpsellShown: false,
      trialStartDate: null,
      trialEndDate: null,
    }));
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
}

async function seedActiveContainer(page) {
  await page.goto(`${base}/dashboard/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem(
      'alchm-active-pathway',
      JSON.stringify({
        pathwayId: 'sitting-with-anxiety',
        startedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
        currentStep: 11,
        completedSteps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        entryIds: [],
        status: 'active',
        showMigrationPrompt: false,
        migrationVersion: 2,
      }),
    );
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
}

async function shot(page, file) {
  await page.waitForTimeout(350);
  await page.screenshot({ path: path.join(outDir, file), fullPage: false });
}

async function openBodyMap(page) {
  await page.goto(`${base}/qa/body-map/`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.body-tap-dot, button[aria-label^="Select "]', { timeout: 12000 });
}

async function captureBreathAndPostEntryCheck(page, name) {
  await page.goto(`${base}/journal/new/`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.checkin-gate', { timeout: 12000 });

  const inHead = page.locator('button', { hasText: /In my head/i }).first();
  if (await inHead.count()) {
    await inHead.click();
    await page.waitForSelector('.breath-screen', { timeout: 12000 });
    await shot(page, `${name}-breath-screen.png`);
  }
  await page.goto(`${base}/dashboard/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    const existing = document.getElementById('qa-post-entry-check-root');
    if (existing) existing.remove();
    const shell = document.createElement('div');
    shell.id = 'qa-post-entry-check-root';
    shell.style.position = 'fixed';
    shell.style.inset = '0';
    shell.style.zIndex = '9999';
    shell.style.display = 'flex';
    shell.style.alignItems = 'center';
    shell.style.justifyContent = 'center';
    shell.style.padding = '22px 20px 120px';
    shell.style.background = 'transparent';
    shell.innerHTML = `
      <div class="card" style="width:min(360px,100%);padding:20px;">
        <div class="post-entry-check" style="min-height:0;padding-top:0;">
          <p class="post-entry-check-question" style="margin:0;">How are you leaving this entry?</p>
          <div class="post-entry-check-options">
            <button type="button" class="post-entry-option">
              <span class="option-dot" style="background: rgba(168, 176, 128, 0.95);"></span>
              <span class="option-label">Lighter</span>
            </button>
            <button type="button" class="post-entry-option">
              <span class="option-dot" style="background: rgba(144, 144, 144, 0.95);"></span>
              <span class="option-label">About the same</span>
            </button>
            <button type="button" class="post-entry-option">
              <span class="option-dot" style="background: rgba(138, 126, 153, 0.95);"></span>
              <span class="option-label">Heavier</span>
            </button>
          </div>
          <button type="button" class="post-entry-skip">Skip</button>
        </div>
      </div>
    `;
    document.body.appendChild(shell);
  });
  await page.waitForSelector('#qa-post-entry-check-root .post-entry-check', { timeout: 12000 });
  await shot(page, `${name}-post-entry-check.png`);
}

for (const vp of viewports) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await context.newPage();

  await seed(page);
  await page.goto(`${base}/journal/new/`, { waitUntil: 'domcontentloaded' });
  await shot(page, `${vp.name}-checkin-gate.png`);
  await captureBreathAndPostEntryCheck(page, vp.name);

  await page.goto(`${base}/dashboard/`, { waitUntil: 'domcontentloaded' });
  await shot(page, `${vp.name}-dashboard-tab-chrome-footer.png`);

  await page.goto(`${base}/journal/`, { waitUntil: 'domcontentloaded' });
  await shot(page, `${vp.name}-journal-list.png`);

  await page.goto(`${base}/settings/`, { waitUntil: 'domcontentloaded' });
  await shot(page, `${vp.name}-settings-list.png`);

  await openBodyMap(page);
  await shot(page, `${vp.name}-bodymap-chip-grid.png`);

  const region = page.getByRole('button', { name: /Select Chest body region|Choose Chest|Chest/i }).first();
  if (await region.count()) {
    await region.click({ force: true });
    await page.waitForTimeout(200);
  }
  const sensation = page.getByRole('button', { name: /Mark sensation as tight|tight/i }).first();
  if (await sensation.count()) {
    await sensation.click();
    await page.waitForTimeout(400);
  }

  let area = page.locator('textarea').first();
  if (!(await area.count())) {
    const skip = page.getByRole('button', { name: /I already know what I feel/i }).first();
    if (await skip.count()) {
      await skip.click();
      await page.waitForTimeout(300);
    }
    const quick = page.getByRole('button', { name: /Heavy|Anxious|Neutral|Hopeful|Peaceful/i }).first();
    if (await quick.count()) {
      await quick.click();
      await page.waitForTimeout(300);
    }
    area = page.locator('textarea').first();
  }
  if (await area.count()) {
    await area.click();
    await page.waitForTimeout(250);
    await shot(page, `${vp.name}-bodymap-keyboard-transition.png`);
  }

  await seedActiveContainer(page);
  await page.goto(`${base}/pathways/`, { waitUntil: 'domcontentloaded' });
  await shot(page, `${vp.name}-containers-list-active.png`);

  const continueContainer = page.locator('button', { hasText: /Continue active pathway|Continue container/i }).first();
  if (await continueContainer.count()) {
    await continueContainer.click();
    await page.waitForTimeout(500);
    await shot(page, `${vp.name}-containers-threshold-day11.png`);
  } else {
    await shot(page, `${vp.name}-containers-threshold-day11-missing.png`);
  }

  await browser.close();
}

console.log(`Saved iOS regression snapshots to ${outDir}`);
