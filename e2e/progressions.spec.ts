import { test, expect } from '@playwright/test';

test('progression navigation, exact B7, preferences and responsive instruments', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Practicar Progresiones' }).click();
  await page.getByLabel('Progresión', { exact: true }).selectOption('custom');
  await page.getByLabel('Progresión personalizada').fill('Em → Am → B7 → Em');
  await expect(page.getByRole('heading', { level: 2 })).toHaveText('E (Mi) menor');
  await page.getByRole('button', { name: 'Siguiente' }).click();
  await expect(page.getByRole('heading', { level: 2 })).toHaveText('A (La) menor');
  await page.getByRole('button', { name: 'Siguiente' }).click();
  await expect(page.getByRole('heading', { level: 2 })).toHaveText('B (Si) séptima dominante');
  await page.getByRole('button', { name: 'Guitarra', exact: true }).click();
  await expect(page.getByRole('img', { name: 'Guitarra B 7' })).toBeVisible();
  const guide = page.getByRole('button', { name: 'Modo guía: Dedos activos' });
  await expect(guide).toHaveAttribute('aria-pressed', 'true');
  await guide.click();
  await expect(page.getByRole('img').locator('text').filter({ hasText: /^[1-4]$/ })).toHaveCount(0);
  await page.getByRole('button', { name: 'Piano', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Modo simple: Dedos ocultos' })).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'Modo simple: Dedos ocultos' }).click();
  await page.getByRole('button', { name: 'Guitarra', exact: true }).click();
  await expect(page.getByRole('img').locator('text').filter({ hasText: /^[1-4]$/ })).toHaveCount(4);
  await expect(page.getByLabel('Idioma', { exact: true }).locator('option')).toHaveText(['Español', 'Inglés']);
  await expect(page.getByText('Laboratorio pedagógico de acordes')).toHaveCount(0);
  await expect(page.getByLabel('Progresión', { exact: true }).locator('option')).not.toContainText(['Bad Things']);

  await Promise.all([
    page.waitForResponse(r => r.url().includes('/audio/guitar/') && r.status() === 200),
    page.getByRole('button', { name: 'Play', exact: true }).click(),
  ]);
  await expect(page.getByRole('alert')).toHaveCount(0);
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const instrument of ['Guitarra', 'Piano']) {
      await page.getByRole('button', { name: instrument, exact: true }).click();
      const svg = page.getByRole('img');
      const box = await svg.boundingBox();
      expect(box).not.toBeNull();
      expect(Math.abs(box!.x + box!.width / 2 - width / 2)).toBeLessThan(2);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await page.screenshot({ path: `test-results/acordia-${instrument}-${width}.png`, fullPage: true });
    }
  }
  await page.getByRole('button', { name: 'Anterior' }).click();
  await expect(page.getByRole('heading', { level: 2 })).toHaveText('A (La) menor');
  await page.getByLabel('Notación', { exact: true }).selectOption('latin');
  await page.getByLabel('Idioma').selectOption('en');
  await expect(page.getByRole('heading', { level: 2 })).toHaveText('La minor');
  await page.reload();
  await expect(page.getByLabel('Notación', { exact: true })).toHaveValue('latin');
  await expect(page.getByLabel('Idioma')).toHaveValue('en');
});
