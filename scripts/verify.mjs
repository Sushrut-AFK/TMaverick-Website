import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const base = process.env.TEST_URL || 'http://localhost:3000';
await mkdir('test-results', { recursive: true });
const report = { routes: [], viewports: [], accessibility: [], errors: [] };
try {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', e => report.errors.push(e.message));
  const routes = ['/', '/about', '/cars', '/departments', '/achievements', '/sponsors', '/team', '/join', '/contact', '/cars/avira-2', '/departments/chassis', '/departments/vehicle-dynamics', '/departments/aerodynamics', '/departments/braking', '/departments/transmission', '/departments/powertrain-lv', '/departments/sponsorship-pr', '/departments/media'];
  for (const route of routes) {
    const response = await page.goto(base + route, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200, route);
    assert.equal(await page.locator('h1').count(), 1, route + ' single heading');
    report.routes.push({ route, status: response.status() });
  }
  const missing = await page.goto(base + '/missing-page');
  assert.equal(missing.status(), 404);
  for (const width of [360, 390, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(200);
    const sizes = await page.evaluate(() => ({ viewport: window.innerWidth, document: document.documentElement.scrollWidth }));
    assert.ok(sizes.document <= width, JSON.stringify(sizes));
    const broken = await page.locator('img').evaluateAll(imgs => imgs.filter(img => img.getClientRects().length > 0 && (!img.complete || img.naturalWidth === 0)).map(img => img.src));
    assert.deepEqual(broken, [], 'all homepage images load');
    await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true });
    await page.screenshot({ path: `test-results/hero-${width}.png` });
    report.viewports.push({ width, ...sizes, brokenImages: broken.length });
  }
  for (const route of ['/', '/join', '/contact', '/departments']) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(base + route, { waitUntil: 'networkidle' });
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    report.accessibility.push({ route, violations: result.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })) });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base, { waitUntil: 'networkidle' });
  const menu = page.getByRole('button', { name: 'Open menu', exact: true });
  await menu.click();
  assert.equal(await menu.getAttribute('aria-expanded'), 'true');
  await page.keyboard.press('Escape');
  await menu.waitFor({ state: 'visible' });
  assert.ok(await menu.evaluate(el => el === document.activeElement), 'Escape restores focus');
  await menu.click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('link', { name: /Contact/ }).focus();
  await page.keyboard.press('Tab');
  assert.ok(await dialog.getByRole('button', { name: 'Close navigation' }).evaluate(el => el === document.activeElement), 'Focus loops inside menu');
  const mobileAxe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  report.accessibility.push({ route: 'mobile menu', violations: mobileAxe.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })) });
  await page.screenshot({ path: 'test-results/mobile-menu.png' });
  await dialog.getByRole('link', { name: /Our Cars/ }).click();
  await page.waitForURL('**/cars');
  assert.equal(await page.getByRole('dialog').count(), 0, 'menu closes after navigation');
  const motionContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  const animated = await motionContext.newPage();
  animated.on('pageerror', e => report.errors.push(e.message));
  await animated.goto(base, { waitUntil: 'networkidle' });
  await animated.waitForTimeout(1800);
  assert.ok(await animated.locator('h1').isVisible());
  await animated.locator('#system-aerodynamics').scrollIntoViewIfNeeded();
  await animated.waitForTimeout(400);
  assert.match(await animated.locator('.department-index > .active').innerText(), /Aerodynamics/i);
  await animated.screenshot({ path: 'test-results/engineering-desktop.png' });
  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const staticPage = await noJs.newPage();
  await staticPage.goto(base);
  assert.ok(await staticPage.locator('h1').isVisible(), 'hero visible without JS');
  assert.ok(await staticPage.getByRole('heading', { name: /ONE MACHINE/ }).isVisible(), 'engineering content remains in document');
  assert.deepEqual(report.errors, []);
  const violations = report.accessibility.reduce((n, r) => n + r.violations.length, 0);
  await writeFile('test-results/report.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  assert.equal(violations, 0, 'No automated WCAG A/AA violations');
} finally {
  await writeFile('test-results/report.json', JSON.stringify(report, null, 2));
  await browser.close();
}


