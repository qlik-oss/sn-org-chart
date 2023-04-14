import { test, expect } from '@playwright/test';

test.describe('should render', () => {
  const content = '.sn-org-chart';

  test.describe('from snapshot', () => {
    test('basic example', async ({ page }) => {
      await page.goto('/render?snapshot=basic', { waitUntil: 'networkidle' });
      await page.waitForSelector('.sn-org-chart-snapshot', { visible: true });
      const elem = await page.$(content);
      const img = await elem.screenshot();
      expect(img).toMatchSnapshot('basic-snapshot.png');
    });
  });
});
