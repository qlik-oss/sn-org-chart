module.exports = {
  testEnvironment: 'jsdom',
  testRegex: 'src/.+\\.(test|spec)\\.[jt]sx?$',
  coverageThreshold: {
    global: {
      lines: 64,
    },
  },
  coveragePathIgnorePatterns: ['src/__tests__/default-orgchart-props.js', 'src/styles', 'src/extension', 'src/data.js'],
  collectCoverageFrom: ['src/**', '!**/locales/**', '!**/all.json'],
};
