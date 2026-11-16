import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('test-results', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
const base = process.env.TEST_URL || 'http://127.0.0.1:3000';
const report = { checks: [], errors: [], accessibility: [] };
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  page.on('pageerror', e => report.errors.push(e.message));
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.locator('#engineering').scrollIntoViewIfNeeded();
  const stage = page.locator('.exploded-canvas');
  await page.waitForFunction(() => document.querySelector('.exploded-canvas')?.dataset.ready === 'true', null, { timeout: 60000 });
  const slider = page.getByRole('slider', { name: 'Car assembly separation' });
  await slider.focus(); await page.keyboard.press('Home'); await page.waitForTimeout(250);
  assert.equal(await stage.getAttribute('data-explode'), '0.000');
  await page.locator('.exploded-demo').screenshot({ path: 'test-results/assembly-closed.png' });
  await page.keyboard.press('End'); await page.waitForTimeout(250);
  assert.equal(await stage.getAttribute('data-explode'), '1.000');
  await page.locator('.exploded-demo').screenshot({ path: 'test-results/assembly-exploded.png' });
  await page.getByRole('button', { name: 'Follow scroll' }).click();
  await page.locator('#system-powertrain-lv').scrollIntoViewIfNeeded(); await page.waitForTimeout(700);
  assert.ok(Number(await stage.getAttribute('data-explode')) > 0.5, 'scroll separates the real meshes');
  report.checks.push('WebGL model loads; keyboard slider assembles/explodes; scroll controls part separation');
  await page.locator('.engineering-layout').screenshot({ path: 'test-results/engineering-v2.png' });

  const marquee = page.locator('.sponsor-marquee'); await marquee.scrollIntoViewIfNeeded(); await page.mouse.move(0, 0);
  const track = page.locator('.sponsor-track');
  const transform = () => track.evaluate(el => getComputedStyle(el).transform);
  const before = await transform(); await page.waitForTimeout(400); assert.notEqual(await transform(), before);
  await marquee.hover(); assert.equal(await track.evaluate(el => getComputedStyle(el).animationPlayState), 'paused');
  await page.getByRole('button', { name: 'Pause sponsor animation' }).click(); await page.mouse.move(0, 0);
  assert.equal(await marquee.getAttribute('data-paused'), 'true');
  await page.locator('.partners').screenshot({ path: 'test-results/sponsors-v2.png' });
  assert.equal(await marquee.locator('ul:not([aria-hidden]) li').count(), 8);
  assert.equal(await marquee.locator('ul[aria-hidden] a').count(), 0);
  report.checks.push('Sponsor strip moves, pauses on hover/focus/button, and exposes only one accessible sponsor set');

  const photo = page.locator('.about-image'); await photo.scrollIntoViewIfNeeded(); await photo.hover(); await page.waitForTimeout(800);
  assert.ok(Number(await photo.locator('img').evaluate(el => getComputedStyle(el).scale)) > 1);
  const trigger = photo.getByRole('button', { name: /View photo/ });
  await trigger.click();
  const viewer = page.getByRole('dialog', { name: 'Photo viewer' });
  assert.ok(await viewer.isVisible());
  const viewerAxe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  report.accessibility.push({ target: 'photo viewer', violations: viewerAxe.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.failureSummary) })) });
  await page.screenshot({ path: 'test-results/photo-viewer.png' });
  await page.keyboard.press('Escape'); await page.waitForTimeout(150);
  assert.equal(await viewer.isVisible(), false);
  assert.ok(await trigger.evaluate(el => el === document.activeElement));
  report.checks.push('Photo zoom reacts to hover; accessible lightbox opens, Escape closes, and focus returns');

  const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const reduced = await reducedContext.newPage();
  reduced.on('pageerror', e => report.errors.push(e.message));
  await reduced.goto(base, { waitUntil: 'networkidle' });
  await reduced.locator('#engineering').scrollIntoViewIfNeeded();
  await reduced.waitForFunction(() => document.querySelector('.exploded-canvas')?.dataset.ready === 'true', null, { timeout: 60000 });
  assert.equal(await reduced.locator('.exploded-canvas').getAttribute('data-explode'), '0.000');
  await reduced.locator('#system-aerodynamics').scrollIntoViewIfNeeded();
  assert.equal(await reduced.locator('.exploded-canvas').getAttribute('data-explode'), '0.000');
  assert.equal(await reduced.locator('.sponsor-track').evaluate(el => getComputedStyle(el).animationName), 'none');
  report.checks.push('Reduced motion keeps the car assembled and stops the sponsor animation');
  assert.deepEqual(report.errors, []);
  assert.equal(report.accessibility.reduce((count, entry) => count + entry.violations.length, 0), 0, 'No automated WCAG A/AA violations');
  console.log(JSON.stringify(report, null, 2));
} finally {
  await writeFile('test-results/interactions-report.json', JSON.stringify(report, null, 2));
  await browser.close();
}
