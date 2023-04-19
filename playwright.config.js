const config = {
  testDir: './test/rendering',
  testMatch: /.*\.spec\.js/,
  webServer: {
    command: 'yarn start --port 8077',
    reuseExistingServer: !process.env.CI,
    port: '8077',
  },
  use: {
    baseURL: 'http://localhost:8077',
  },
};

export default config;
