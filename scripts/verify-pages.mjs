import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';

const url = process.env.PAGES_URL || 'http://127.0.0.1:4174/acordia/';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(url);
  await page.getByRole('heading', { name: 'ACORDIA', exact: true }).waitFor();
  const background = await page.evaluate(() => getComputedStyle(document.body, '::before').backgroundImage);
  assert(background.includes('/acordia/images/glass-bg.webp'));
  const bgResponse = await page.request.get(new URL('images/glass-bg.webp', url).href);
  assert.equal(bgResponse.status(), 200);
  for (const instrument of ['piano', 'guitar']) {
    await page.getByRole('button', { name: instrument === 'piano' ? 'Piano' : 'Guitarra', exact: true }).click();
    const [response] = await Promise.all([
      page.waitForResponse(r => r.url().includes(`/acordia/audio/${instrument}/`) && r.status() === 200),
      page.getByRole('button', { name: 'Play', exact: true }).click(),
    ]);
    assert(response.ok());
    await page.waitForTimeout(1500);
    assert.equal(await page.getByRole('alert').count(), 0);
    await page.getByRole('button', { name: 'Stop', exact: true }).click();
  }
  assert.deepEqual(errors, []);
  console.log(`Pages OK: ${url} — UI, background, piano and guitar samples.`);
} finally {
  await browser.close();
}
