import DEFAULTS from './style-defaults';

const properties = {
  qHyperCubeDef: {
    qDimensions: [],
    qMeasures: [],
    qInitialDataFetch: [{ qWidth: 5, qHeight: 500 }],
    qSuppressZero: false,
    qSuppressMissing: true,
  },
  /**
   * @type {boolean}
   */
  showTitles: true,
  /**
   * @type {string}
   */
  title: '',
  /**
   * @type {string}
   */
  subtitle: '',
  /**
   * @type {string}
   */
  footnote: '',
  /**
   * @type {'regular'|'scroll'|'free'}
   */
  navigationMode: 'free',
  /**
   * @type {boolean}
   */
  resizeOnExpand: false,
  /**
   * @type {object}
   */
  style: {
    fontColor: {
      colorType: DEFAULTS.FONT_COLOR_TYPE,
      color: DEFAULTS.FONT_COLOR_DARK,
      colorExpression: '',
    },
    backgroundColor: {
      colorType: DEFAULTS.BACKGROUND_COLOR_TYPE,
      color: DEFAULTS.BACKGROUND_COLOR,
      colorExpression: '',
    },
    border: {
      top: DEFAULTS.BORDER_TOP,
      fullBorder: DEFAULTS.BORDER_FULL,
      colorType: DEFAULTS.BORDER_COLOR_TYPE,
      color: DEFAULTS.BORDER_COLOR,
      colorExpression: '',
    },
  },
};

export default properties;
