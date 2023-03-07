module.exports = {
  testEnvironment: 'jsdom',
  testRegex: 'src/.+\\.(test|spec)\\.[jt]sx?$',
  coverageThreshold: {
    global: {
      lines: 74,
    },
  },
  coveragePathIgnorePatterns: ['src/__tests__/default-orgchart-props.js'],
  collectCoverageFrom: ['src/**'],
};
