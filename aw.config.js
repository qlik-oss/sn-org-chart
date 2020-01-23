module.exports = {
  coverage: true,
  mocks: [['**/*.{scss,less,css,html}']],
  glob: 'src/**/*.spec.js',
  nyc: {
    reportDir: 'coverage/unit',
  },
};
