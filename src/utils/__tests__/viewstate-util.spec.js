import viewstateUtiils from '../viewstate-utils';

describe('viewstateUtiils', () => {
  describe('getViewState', () => {
    const { getViewState } = viewstateUtiils;
    let opts;
    let layout;
    let viewState;
    beforeEach(() => {
      opts = { viewState: 'optsViewState' };
      layout = {
        snapshotData: { viewState: 'layoutViewState' },
      };
    });
    it('should return viewState from opts object', () => {
      viewState = getViewState(opts, layout);
      expect(viewState).to.equal('optsViewState');
    });
    it('should return viewState from layout object', () => {
      opts = {};
      viewState = getViewState(opts, layout);
      expect(viewState).to.equal('layoutViewState');
    });
    it('should return undefined when no viewState on either layout or opts', () => {
      opts = {};
      layout = {};
      viewState = getViewState(opts, layout);
      expect(viewState).to.equal(undefined);
    });
  });
});
