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
   * @type {object}
   */
  style: {
    /**
     * @type {object}
     */
    fontColor: {
      /**
       * @type {'auto'|'colorPicker'|'byExpression'}
       */
      colorType: 'auto',
      /**
       * @type {object}
       */
      color: {
        index: -1,
        color: '#484848',
      },
      /**
       * @type {string}
       */
      colorExpression: '',
    },
    /**
     * @type {object}
     */
    backgroundColor: {
      /**
       * @type {'auto'|'colorPicker'|'byExpression'}
       */
      colorType: 'auto',
      /**
       * @type {object}
       */
      color: {
        index: -1,
        color: '#e6e6e6',
      },
      /**
       * @type {string}
       */
      colorExpression: '',
    },
    /**
     * @type {object}
     */
    border: {
      /**
       * @type {boolean}
       */
      top: true,
      /**
       * @type {boolean}
       */
      fullBorder: false,
      /**
       * @type {string}
       */
      colorType: 'auto',
      /**
       * @type {object}
       */
      color: {
        index: -1,
        color: '#737373',
      },
      /**
       * @type {string}
       */
      colorExpression: '',
    },
  },
};

export default properties;
