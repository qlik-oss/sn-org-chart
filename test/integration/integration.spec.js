import { test, expect } from '@playwright/test';
import serve from '@nebula.js/cli-serve';
import createNebulaRoutes from './utils/routes';

test.describe('should render', () => {
  let nebulaServer;
  let route;

  test.beforeAll(async () => {
    nebulaServer = await serve({
      build: false,
      open: false,
      type: 'sn-org-chart',
    });
    route = createNebulaRoutes(nebulaServer.url);
  });

  test.afterAll(() => {
    nebulaServer.close();
  });
  const content = '.sn-org-chart';

  test.describe('from snapshot', () => {
    test('basic example', async ({ page }) => {
      await page.goto(route.renderSnapshot('basic'));
      await page.waitForSelector(content, { visible: true });
      const elem = await page.$(content);
      const img = await elem.screenshot();
      expect(img).toMatchSnapshot('basic-snapshot.png');
    });
  });
});
