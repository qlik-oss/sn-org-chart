const viewStateUtil = {
  getViewState: (opts, layout) => {
    // Get from options passed to object (used in live printing)
    let { viewState } = opts;
    if (!viewState && layout.snapshotData && layout.snapshotData.viewState) {
      // Get from layout (used in snapshot mode)
      viewState = layout.snapshotData.viewState;
    }
    return viewState;
  },
};

export default viewStateUtil;
