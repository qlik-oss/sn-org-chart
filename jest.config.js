module.exports = {
  testEnvironment: 'jsdom',
  testRegex: 'src/.+\\.(test|spec)\\.[jt]sx?$',
  coverageThreshold: {
    global: {
      lines: 76,
    },
  },
  coveragePathIgnorePatterns: ['src/__tests__/default-orgchart-props.js'],
};
