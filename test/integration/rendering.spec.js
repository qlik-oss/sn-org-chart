const artifacts = {
  artifactsPath: 'test/integration/__artifacts__',
};

describe.skip('should render an', () => {
  const content = '.nebulajs-sn';
  const app = encodeURIComponent(process.env.APP_ID || '/apps/org-chart-test.qvf');

  before(async () => {
    await page.goto(`${process.testServer.url}/render/app/${app}?object=EjGZmXS`);
    await page.waitForSelector(content, { visible: true });
  });

  it('Org Chart', async () => {
    const elem = await page.$(content);
    const img = await elem.screenshot();
    return expect(img).to.matchImageOf('org-chart', artifacts);
  });
});
