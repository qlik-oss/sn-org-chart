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
  style: {
    /**
     * Holds font color details
     * @type {object}
     */
    fontColor: {
      /**
       * How the font color is input
       * @type {'auto'|'colorPicker'|'byExpression'}
       */
      colorType: 'auto',
      /**
       * Font color
       * @type {object}
       */
      color: {
        /**
         * Index of theme color
         * @type {number}
         */
        index: -1,
        /**
         *  Color defined by rgb, argb or html
         * @type {string}
         */
        color: '#484848',
      },
      /**
       * An expression to decide font color
       * @type {string}
       */
      colorExpression: '',
    },
    /**
     * Hold background color details
     * @type {object}
     */
    backgroundColor: {
      /**
       * How the background color is input
       * @type {'auto'|'colorPicker'|'byExpression'}
       */
      colorType: 'colorPicker',
      /**
       * Background color
       * @type {object}
       */
      color: {
        /**
         * Index of theme color
         * @type {number}
         */
        index: -1,
        /**
        *  Color defined by rgb, argb or html
        * @type {string}
        */
        color: '#ffffff',
      },
      /**
       * An expression to decide background color
       * @type {string}
       */
      colorExpression: '',
    },
    /**
     * Holds border details
     * @type {object}
     */
    border: {
      /**
       * Shop top border
       * @type {boolean}
       */
      top: true,
      /**
       * Show full border
       * @type {boolean}
       */
      fullBorder: true,
      /**
       * How the border color is input
       * @type {'auto'|'colorPicker'|'byExpression'}
       */
      colorType: 'auto',
      /**
       * Border color
       * @type {object}
       */
      color: {
        /**
         * Index of theme color
         * @type {number}
         */
        index: -1,
        /**
         *  Color defined by rgb, argb or html
         * @type {string}
         */
        color: '#737373',
      },
      /**
       * An expression to decide border color
       * @type {string}
       */
      colorExpression: '',
    },
  },
};

export default properties;
