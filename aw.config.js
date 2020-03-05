module.exports = {
  coverage: true,
  mocks: [['**/*.{scss,less,css,html}'], ['**/node_modules/touchejs/dist/touche.umd.js']],
  glob: ['src/**/*.spec.js'],
  src: ['src/**/*.js'],
  nyc: {
    reportDir: 'coverage/unit',
  },
};
