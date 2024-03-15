const config = {
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
  reporter: [
    ["list"],
    [
      "html",
      {
        outputFolder: "./test/rendering/test-report",
        open: process.env.CI ? "never" : "on-failure",
      },
    ],
  ],
};

export default config;
