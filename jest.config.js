module.exports = {
  testEnvironment: 'jsdom',
  testRegex: 'src/.+\\.(test|spec)\\.[jt]sx?$',
  coverageThreshold: {
    global: {
      lines: 63,
    },
  },
  coveragePathIgnorePatterns: ['src/__tests__/default-orgchart-props.js', 'src/styles', 'src/extension', 'src/data.js', 'src/locale/locales/.+', 'src/locale/all.json', 'src/locale/scripts/generate-all.mjs'],
  collectCoverageFrom: ['src/**'],
};
