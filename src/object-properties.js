const properties = {
  qHyperCubeDef: {
    qDimensions: [],
    qMeasures: [],
    qInitialDataFetch: [{ qWidth: 5, qHeight: 500 }],
    qSuppressZero: false,
    qSuppressMissing: true,
  },
  /**
   * Show title for the visualization
   * @type {boolean}
   */
  showTitles: true,
  /**
   * Visualization title
   * @type {string}
   */
  title: '',
  /**
   * Visualization subtitle
   * @type {string}
   */
  subtitle: '',
  /**
   * Visualization footnote
   * @type {string}
   */
  footnote: '',
  /**
   * @type {'regular'|'scroll'|'free'}
   */
  navigationMode: 'free',
  /**
   * Resize and pan chart when a node's list of children is expanded
   * @type {boolean}
   */
  resizeOnExpand: false,
  /**
   * Holds chart styling
   * @type {object}
   */
  style: {},
};

export default properties;
