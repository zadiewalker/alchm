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
const outDir = path.resolve('qa-reports');
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 393, height: 852 } });
const page = await context.newPage();

await page.goto(`${base}/dashboard/`, { waitUntil: 'domcontentloaded' });
await page.evaluate(() => {
  localStorage.setItem('alchm-onboarding-complete', JSON.stringify(true));
  localStorage.setItem(
    'alchm-journal-entries',
    JSON.stringify([
      { id: 'qa-entry-1', type: 'journal', content: 'Check-in', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'qa-entry-2', type: 'journal', content: 'Second', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'qa-entry-3', type: 'journal', content: 'Third', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'qa-entry-4', type: 'journal', content: 'Fourth', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'qa-entry-5', type: 'journal', content: 'Fifth', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ]),
  );
});
await page.reload({ waitUntil: 'domcontentloaded' });

const expectedTabs = ['Dashboard', 'Containers', 'Mirror', 'Entries'];
const foundTabs = [];
const missingTabs = [];
for (const name of expectedTabs) {
  const count = await page.getByRole('tab', { name }).count();
  if (count > 0) foundTabs.push(name);
  else missingTabs.push(name);
}

await page.goto(`${base}/qa/body-map/`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.body-tap-dot, button[aria-label^="Select "]', { timeout: 12000 });
const bodyTargets = ['Select Head body region', 'Select Throat body region', 'Select Chest body region', 'I don’t feel it in my body'];
const foundBodyTargets = [];
const missingBodyTargets = [];
for (const name of bodyTargets) {
  const count = await page.getByRole('button', { name }).count();
  if (count > 0) foundBodyTargets.push(name);
  else missingBodyTargets.push(name);
}

const report = {
  timestamp: new Date().toISOString(),
  pass: missingTabs.length === 0 && missingBodyTargets.length === 0,
  tabs: { found: foundTabs, missing: missingTabs },
  bodyMapButtons: { found: foundBodyTargets, missing: missingBodyTargets },
};

const reportPath = path.join(outDir, 'voiceover-ios.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`VoiceOver QA report: ${reportPath}`);
if (!report.pass) {
  console.error('VoiceOver QA failed', JSON.stringify(report, null, 2));
  process.exitCode = 1;
}

await browser.close();
