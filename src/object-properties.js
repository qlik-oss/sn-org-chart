import DEFAULTS from './style-defaults';

/**
 * @extends {qae.GenericObjectProperties}
 * @entry
 */

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
   * How the org chart is navigated
   * @type {'expandAll'|'free'}
   */
  navigationMode: 'free',
  /**
   * Resize and pan chart when a node's list of children is expanded
   * @type {boolean}
   */
  resizeOnExpand: false,
  /**
   * Holds chart styling
   * @type {Style}
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

/**
 * Holds styling options
 * @typedef {object} Style
 * @property {FontColor=} fontColor - Color of the text, by default #484848
 * @property {Background=} backgroundColor - Color of the background, by default #ffffff
 * @property {Border=} border - Styling for border, by default #737373
 */

/**
 * @typedef {object} FontColor
 * @property {('auto'|'colorPicker'|'byExpression')=} [colorType='auto'] How the font color is defined
 * @property {PaletteColor=} color - Color defined by index or hex code, needed if colorType is colorPicker
 * @property {ColorExpression=} colorExpression - Color defined by expression, needed if colorType is byExpression
 */

/**
 * @typedef {object} Background
 * @property {('auto'|'colorPicker'|'byExpression')=} [colorType='colorPicker'] How the background color is defined
 * @property {PaletteColor=} color - Color defined by index or hex code, needed if colorType is colorPicker
 * @property {ColorExpression=} colorExpression - Color defined by expression, needed if colorType is byExpression
 */

/**
 * @typedef {object} Border
 * @property {boolean=} [top=true] Set to true to show thicker top border
 * @property {boolean=} [fullBorder=true] Set to true to show full border
 * @property {('auto'|'colorPicker'|'byExpression')=} [colorType='auto'] How the border color is defined
 * @property {PaletteColor=} color - Color defined by index or hex code, needed if colorType is colorPicker
 * @property {ColorExpression=} colorExpression - Color defined by expression, needed if colorType is byExpression
 */

/**
 * Color information structure. Holds the actual color and index in palette.
 * @typedef {object} PaletteColor
 * @property {string=} color - Color as hex string (only used if index: -1)
 * @property {number=} index - Index in palette
 */

/**
 * Format for using color expressions
 * @typedef {object} ColorExpression
 * @property {object} qStringExpression
 * @property {string} qStringExpression.qExpr - expression that resolves to a supported color format
 */

export default properties;
