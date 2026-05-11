import { chromium } from 'playwright';
import fs from 'node:fs';

const base = 'http://127.0.0.1:4173';
const out = 'qa-screens';

if (fs.existsSync(out)) {
  for (const file of fs.readdirSync(out)) fs.rmSync(`${out}/${file}`, { force: true });
}
fs.mkdirSync(out, { recursive: true });

const sampleEntries = [
  {
    id: 'e-1',
    content: 'The tightness in my chest showed up again tonight. I can name it without fighting it.',
    emotions: [],
    tags: ['anxiety'],
    type: 'journal',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    emotionSelection: { familyId: 'fear', specificId: 'anxious', label: 'Anxious' },
    depth: {
      emotion: { familyId: 'fear', specificId: 'anxious', label: 'Anxious' },
      sensation: { region: 'chest', description: 'tight' },
      followUp: null,
      therapeuticLens: 'somatic',
      closing: null,
      isLateNight: false,
    },
    kheperaReflection: 'You named the tightness instead of becoming it. That is a real shift.',
  },
  {
    id: 'e-2',
    content: 'I felt peaceful this morning. The room was quiet and my shoulders unclenched.',
    emotions: [],
    tags: ['peace'],
    type: 'journal',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    emotionSelection: { familyId: 'joy', specificId: 'peaceful', label: 'Peaceful' },
  },
];

async function prep(page, withData) {
  await page.goto(`${base}/dashboard/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(
    ({ includeData, entries }) => {
      localStorage.setItem('alchm-onboarding-complete', JSON.stringify(true));
      localStorage.removeItem('alchm-pending-quick-entry');
      localStorage.removeItem('alchm-draft-entry');
      if (includeData) {
        localStorage.setItem('alchm-journal-entries', JSON.stringify(entries));
        localStorage.setItem('alchm-selected-entry-id', 'e-1');
      } else {
        localStorage.removeItem('alchm-journal-entries');
        localStorage.removeItem('alchm-selected-entry-id');
      }
    },
    { includeData: withData, entries: sampleEntries },
  );
  await page.reload({ waitUntil: 'domcontentloaded' });
}

async function shot(page, name) {
  await page.evaluate(() => {
    const scroller = document.querySelector('.scrollable');
    if (scroller) scroller.scrollTop = 0;
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: false });
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 393, height: 852 } });
const page = await context.newPage();

await prep(page, false);
await page.goto(`${base}/dashboard/`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => {
  const text = document.body?.innerText || '';
  return text.includes('Something brought you here') || text.includes('Good morning') || text.includes('Good evening');
}, { timeout: 10000 });
await shot(page, '01-dashboard-empty');

await prep(page, true);
await page.goto(`${base}/dashboard/`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => {
  const text = document.body?.innerText || '';
  return text.includes('Something brought you here') || text.includes('Good morning') || text.includes('Good evening');
}, { timeout: 10000 });
await shot(page, '02-dashboard-with-entry');

await page.getByRole('button', { name: /write/i }).first().click();
await page.waitForFunction(() => (document.body?.innerText || '').includes('Take a breath.'));
await shot(page, '03-arriving');

await page.getByRole('button', { name: /ready/i }).first().click();
await shot(page, '04-body-map');

await page.goto(`${base}/dashboard/`, { waitUntil: 'domcontentloaded' });
await page.getByRole('button', { name: /write/i }).first().click();
await page.getByRole('button', { name: 'I already know what I feel →' }).click();
await shot(page, '05-emotion-select');

await page.getByRole('button', { name: 'Heavy' }).click();
await page.waitForFunction(() => !!document.querySelector('textarea'));
await shot(page, '06-writing');

const area = page.locator('textarea').first();
await area.click();
await area.fill('I can feel this in my chest and my thoughts keep spiraling, but I am still here and that has to count for something.');
await page.getByRole('button', { name: 'Save journal entry' }).click();

await page.waitForTimeout(650);
await shot(page, '07-dissolution');

const skip = page.getByRole('button', { name: 'Skip to reflection →' });
if (await skip.count()) await skip.first().click();

await page.waitForFunction(() => {
  const t = document.body?.innerText || '';
  return t.includes('Your words are held') || t.includes('Khepera');
}, { timeout: 10000 });

await shot(page, '08-reflection-wait');

await page.waitForFunction(() => {
  const t = document.body?.innerText || '';
  return t.includes('Khepera') && t.includes('Report');
}, { timeout: 15000 });
await shot(page, '09-reflection');

await prep(page, true);
await page.goto(`${base}/dashboard/`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => {
  const t = document.body?.innerText || '';
  return t.includes('Something brought you here') || t.includes('Good morning') || t.includes('Good evening');
}, { timeout: 10000 });
await page.getByRole('tab', { name: 'Containers' }).click();
await page.waitForFunction(() => (document.body?.innerText || '').includes('Containers'), { timeout: 10000 });
await page.waitForTimeout(700);
await shot(page, '10-containers');

const continueActive = page.getByRole('button', { name: 'Continue active pathway' });
const continueContainer = page.getByRole('button', { name: /Continue container/i });
const beginAny = page.getByRole('button', { name: /Begin/i });
const anyStart = page.locator('button', { hasText: /Continue|Begin/i });
if (await continueActive.count()) {
  await continueActive.first().click();
} else if (await continueContainer.count()) {
  await continueContainer.first().click();
} else if (await beginAny.count()) {
  await beginAny.first().click();
} else if (await anyStart.count()) {
  await anyStart.first().click();
}
await page.waitForFunction(() => (document.body?.innerText || '').includes('Enter →'), { timeout: 10000 });
await shot(page, '11-threshold');

const enterThreshold = page.getByRole('button', { name: 'Enter →' });
if (await enterThreshold.count()) {
  await enterThreshold.click();
  await page.waitForTimeout(700);
  const ready = page.getByRole('button', { name: /I.?m ready/i });
  if (await ready.count()) {
    await ready.first().click();
    await page.waitForFunction(
      () => (document.body?.innerText || '').includes('Where do you feel it?'),
      { timeout: 8000 },
    );
  } else {
    await page.waitForTimeout(500);
  }
}
await shot(page, '12-container-day');

const backBtn = page.getByRole('button', { name: 'Back' }).first();
if (await backBtn.count()) {
  await backBtn.click();
  await page.waitForTimeout(700);
}

let entriesTab = page.getByRole('tab', { name: 'Entries' });
if (!(await entriesTab.count())) {
  const backAgain = page.getByRole('button', { name: 'Back' }).first();
  if (await backAgain.count()) {
    await backAgain.click();
    await page.waitForTimeout(700);
  }
}
entriesTab = page.getByRole('tab', { name: 'Entries' });
if (await entriesTab.count()) {
  await entriesTab.first().click();
} else {
  await page.goto(`${base}/journal/`, { waitUntil: 'domcontentloaded' });
}
await page.waitForFunction(() => (document.body?.innerText || '').includes('Your entries'), { timeout: 10000 });
await shot(page, '13-entries-list');

const openDetail = page.getByRole('button', { name: 'Open entry detail' }).first();
if (await openDetail.count()) await openDetail.click();
await page.waitForTimeout(400);
await shot(page, '14-entry-detail');

const backBtn2 = page.getByRole('button', { name: 'Back' }).first();
if (await backBtn2.count()) {
  await backBtn2.click();
  await page.waitForTimeout(700);
}
await page.getByRole('tab', { name: 'Dashboard' }).click();
await page.waitForTimeout(500);
await page.waitForFunction(() => {
  const text = document.body?.innerText || '';
  return text.includes('Something brought you here') || text.includes('Good morning') || text.includes('Good evening');
}, { timeout: 10000 });
const settingsBtn = page.getByRole('button', { name: 'Settings' });
if (await settingsBtn.count()) {
  await settingsBtn.first().click();
  await page.waitForTimeout(800);
}
await shot(page, '15-settings');

await browser.close();
