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
   * @type {object}
   */
  style: {
    /**
     * @type {object}
     */
    label: {
      /**
       * @type {boolean}
       */
      useColorExpression: false,
      /**
       * @type {object}
       */
      color: {
        index: -1,
        color: null,
      },
      /**
       * @type {string}
       */
      colorExpression: '',
    },
    /**
     * @type {object}
     */
    subLabel: {
      /**
       * @type {boolean}
       */
      useColorExpression: false,
      /**
       * @type {object}
       */
      color: {
        index: -1,
        color: null,
      },
      /**
       * @type {string}
       */
      colorExpression: '',
    },
    /**
     * @type {object}
     */
    details: {
      /**
       * @type {boolean}
       */
      useColorExpression: false,
      /**
       * @type {object}
       */
      color: {
        index: -1,
        color: null,
      },
      /**
       * @type {string}
       */
      colorExpression: '',
    },
    /**
     * @type {object}
     */
    background: {
      /**
       * @type {boolean}
       */
      useColorExpression: false,
      /**
       * @type {object}
       */
      color: {
        index: -1,
        color: null,
      },
      /**
       * @type {string}
       */
      colorExpression: '',
    },
  },
};

export default properties;
