import Interactions from '../interaction-utils';

describe('Interactions', () => {
  beforeEach(() => {
    global.window = {};
    global.document = {};
  });
  it('should create interactions class', () => {
    const interactions = new Interactions();
    expect(interactions.swiping).to.equal(false);
    expect(interactions.isIE).to.equal(false);
  });
  it('should create interactions class for IE', () => {
    global.window.MSInputMethodContext = {};
    global.document.documentMode = {};
    const interactions = new Interactions();
    expect(interactions.swiping).to.equal(false);
    expect(interactions.isIE).to.equal(true);
  });
});
