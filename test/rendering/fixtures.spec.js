import fs from 'fs';
import path from 'path';
import { test, expect } from '@playwright/test';
import events from './utils/events';

const fixtures = path.join(__dirname, '../component');

test.describe('sn org chart: Rendering tests', () => {
  test.beforeEach(({ page }) => {
    events.addListeners(page);
  });

  test.afterEach(({ page }) => {
    events.removeListeners(page);
  });

  fs.readdirSync(fixtures).forEach((file) => {
    const name = file.replace('.fix.js', '');
    const fixturePath = `/render?fixture=./${file}`;
    test(name, async ({ page }) => {
      await page.goto(fixturePath, { waitUntil: 'networkidle' });
      await page.waitForSelector('.sn-org-chart');
      // Capture screenshot
      await expect(page).toHaveScreenshot();
    });
  });
});
