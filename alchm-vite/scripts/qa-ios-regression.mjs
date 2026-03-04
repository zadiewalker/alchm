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

for (const vp of viewports) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await context.newPage();

  await seed(page);
  await page.goto(`${base}/dashboard/`, { waitUntil: 'domcontentloaded' });
  await shot(page, `${vp.name}-dashboard-tab-chrome-footer.png`);

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

  await page.goto(`${base}/pathways/`, { waitUntil: 'domcontentloaded' });
  const startButtons = page.locator('button', { hasText: /Continue|Begin/i });
  if (await startButtons.count()) {
    await startButtons.first().click();
    await page.waitForTimeout(500);
  }
  await shot(page, `${vp.name}-containers-threshold-fullscreen.png`);

  await browser.close();
}

console.log(`Saved iOS regression snapshots to ${outDir}`);
