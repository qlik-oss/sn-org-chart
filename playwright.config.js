const config = {
  reporter: [['list'], ['html', { outputFolder: './test/rendering/__artifacts__/html_report' }]],
  testDir: "./test/rendering",
  testMatch: /.*\.spec\.js/,
  webServer: {
    command: "pnpm start --port 8077",
    reuseExistingServer: !process.env.CI,
    port: "8077",
  },
  use: {
    baseURL: "http://localhost:8077",
  },
};

export default config;
