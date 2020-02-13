const viewStateUtil = {
  getViewState: (opts, layout) => {
    // Get from options passed to object (used in live printing)
    let { viewState } = opts;
    if (!viewState && layout.viewState) {
      // Get from layout (used in snapshot mode)
      viewState = layout.viewState;
    }
    return viewState;
  },
};

export default viewStateUtil;
