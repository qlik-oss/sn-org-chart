const serve = require('@nebula.js/cli-serve'); // eslint-disable-line

let s;

before(async function run() {
  this.timeout(10000);
  s = await serve({
    build: false,
    open: false,
    type: 'sn-org-chart',
  });

  process.testServer = s;

  page.on('pageerror', e => {
    // eslint-disable-next-line no-console
    console.log('Error:', e.message, e.stack);
  });
});

after(() => {
  s.close();
});
