const playwright = (page) => ({
  async open(url) {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForSelector('.njs-viz');
  },
  async screenshot() {
    return page.screenshot();
  },
});

export default playwright;
