import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const dir = path.resolve('qa-screens');
const files = fs
  .readdirSync(dir)
  .filter((f) => /\.png$/i.test(f) && f !== 'grid.png' && f !== 'grid-4-clean.png')
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

if (!files.length) {
  console.error('No PNG files found in qa-screens');
  process.exit(1);
}

const cols = 4;
const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>ALCHM Grid Clean 4</title>
<style>
  body { margin: 0; padding: 16px; background: #dfe9d8; }
  .grid { display: grid; grid-template-columns: repeat(${cols}, minmax(0, 1fr)); gap: 10px; align-items: start; }
  .cell { background: rgba(255,255,255,0.35); border: 1px solid rgba(43,51,40,0.14); border-radius: 8px; padding: 6px; }
  img { display: block; width: 100%; height: auto; border-radius: 5px; }
</style>
</head>
<body>
  <div class="grid">
    ${files.map((f) => `<div class="cell"><img src="${f}" alt="" /></div>`).join('\n')}
  </div>
</body>
</html>`;

const htmlPath = path.join(dir, 'grid-4-clean.html');
fs.writeFileSync(htmlPath, html);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1380, height: 900 } });
await page.goto(`file://${htmlPath}`);
await page.waitForTimeout(300);
const fullHeight = await page.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
await page.setViewportSize({ width: 1380, height: Math.min(Math.max(fullHeight + 20, 900), 16000) });
await page.waitForTimeout(120);
await page.screenshot({ path: path.join(dir, 'grid-4-clean.png'), fullPage: true });
await browser.close();

console.log(`Created ${path.join(dir, 'grid-4-clean.png')}`);
