export default (baseUrl) => ({
  renderSnapshot: (fixturePath) => `${baseUrl}/render?snapshot=${fixturePath}`,
});
