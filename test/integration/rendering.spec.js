const artifacts = {
  artifactsPath: 'test/integration/__artifacts__',
};

describe('should render', () => {
  const content = '.sn-org-chart';
  const app = encodeURIComponent(process.env.APP_ID || '/apps/org-chart-test.qvf');
  describe.skip('from app', () => {
    before(async () => {
      await page.goto(`${process.testServer.url}/render/app/${app}?object=EjGZmXS`);
      await page.waitForSelector(content, { visible: true });
    });

    it('basic example', async () => {
      const elem = await page.$(content);
      const img = await elem.screenshot();
      return expect(img).to.matchImageOf('app-basic', artifacts);
    });
  });
  describe('from snapshot', () => {
    before(async () => {
      await page.goto(`${process.testServer.url}/render/?snapshot=basic`);
      await page.waitForSelector(content, {
        timeout: 5000,
      });
    });

    it('basic example', async () => {
      const elem = await page.$(content);
      const img = await elem.screenshot();
      return expect(img).to.matchImageOf('snapshot-basic', artifacts);
    });
  });
});
