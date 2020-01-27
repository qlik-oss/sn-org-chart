import propertyResolver from './utils/property-resolver';

export default function ext(/* env */) {
  return {
    definition: {
      type: 'items',
      component: 'accordion',
      items: {
        data: {
          uses: 'data',
          items: {
            dimensions: {
              items: {
                attributes: {
                  component: 'attribute-expression-reference',
                  defaultValue: [],
                  ref: 'qAttributeExpressions',
                  items: [
                    {
                      component: 'expression',
                      ref: 'qExpression',
                      translation: '$Label expression',
                      defaultValue: '',
                      id: 'labelExpression',
                      tid: 'labelExpression',
                    },
                    {
                      component: 'expression',
                      ref: 'qExpression',
                      translation: '$Sub label expression',
                      defaultValue: '',
                      id: 'subLabelExpression',
                      tid: 'subLabelExpression',
                    },
                    {
                      component: 'expression',
                      ref: 'qExpression',
                      translation: '$Details expression',
                      defaultValue: '',
                      id: 'detailsExpression',
                      tid: 'detailsExpression',
                    },
                    {
                      component: 'expression',
                      ref: 'qExpression',
                      translation: '$Color expression',
                      defaultValue: '',
                      id: 'colorByExpression',
                      tid: 'nodeColorByExpression',
                    },
                  ],
                },
              },
            },
          },
        },
        sorting: {
          uses: 'sorting',
        },
        addOns: {
          type: 'items',
          component: 'expandable-items',
          translation: 'properties.addons',
          items: {
            dataHandling: {
              uses: 'dataHandling',
              items: {
                calcCond: {
                  uses: 'calcCond',
                },
                rowLimit: {
                  type: 'integer',
                  translation: '$RowLimit',
                  ref: 'rowLimit',
                  defaultValue: 30000,
                  min: 5000,
                  max: 100000,
                  show: false,
                },
              },
            },
          },
        },
        settings: {
          uses: 'settings',
          items: {
            background: {
              grouped: true,
              type: 'items',
              translation: 'properties.presentation',
              items: {
                font: {
                  type: 'items',
                  grouped: true,
                  items: {
                    label: {
                      type: 'items',
                      items: {
                        useColorExpression: {
                          ref: 'style.label.useColorExpression',
                          type: 'boolean',
                          translation: '$label color',
                          component: 'dropdown',
                          options: [
                            {
                              value: false,
                              translation: 'properties.colorMode.primary',
                            },
                            {
                              value: true,
                              translation: 'properties.colorMode.byExpression',
                            },
                          ],
                        },
                        fontColor: {
                          ref: 'style.label.color',
                          type: 'object',
                          component: 'color-picker',
                          translation: 'properties.color',
                          dualOutput: true,
                          show: data => !propertyResolver.getValue(data, 'style.label.useColorExpression'),
                        },
                        colorExpression: {
                          component: 'string',
                          type: 'string',
                          ref: 'style.label.colorExpression',
                          translation: 'Common.Expression',
                          expression: 'optional',
                          show: data => propertyResolver.getValue(data, 'style.label.useColorExpression'),
                        },
                      },
                    },
                    sublabel: {
                      type: 'items',
                      items: {
                        useColorExpression: {
                          ref: 'style.subLabel.useColorExpression',
                          type: 'boolean',
                          translation: '$Sublabel color',
                          component: 'dropdown',
                          options: [
                            {
                              value: false,
                              translation: 'properties.colorMode.primary',
                            },
                            {
                              value: true,
                              translation: 'properties.colorMode.byExpression',
                            },
                          ],
                        },
                        fontColor: {
                          ref: 'style.subLabel.color',
                          type: 'object',
                          component: 'color-picker',
                          translation: 'properties.color',
                          dualOutput: true,
                          show: data => !propertyResolver.getValue(data, 'style.subLabel.useColorExpression'),
                        },
                        colorExpression: {
                          component: 'string',
                          type: 'string',
                          ref: 'style.subLabel.colorExpression',
                          translation: 'Common.Expression',
                          expression: 'optional',
                          show: data => propertyResolver.getValue(data, 'style.subLabel.useColorExpression'),
                        },
                      },
                    },
                    details: {
                      type: 'items',
                      items: {
                        useColorExpression: {
                          ref: 'style.details.useColorExpression',
                          type: 'boolean',
                          translation: '$details color',
                          component: 'dropdown',
                          options: [
                            {
                              value: false,
                              translation: 'properties.colorMode.primary',
                            },
                            {
                              value: true,
                              translation: 'properties.colorMode.byExpression',
                            },
                          ],
                        },
                        fontColor: {
                          ref: 'style.details.color',
                          type: 'object',
                          component: 'color-picker',
                          translation: 'properties.color',
                          dualOutput: true,
                          show: data => !propertyResolver.getValue(data, 'style.details.useColorExpression'),
                        },
                        colorExpression: {
                          component: 'string',
                          type: 'string',
                          ref: 'style.details.colorExpression',
                          translation: 'Common.Expression',
                          expression: 'optional',
                          show: data => propertyResolver.getValue(data, 'style.details.useColorExpression'),
                        },
                      },
                    },
                  },
                },
                backgroundColor: {
                  type: 'items',
                  items: {
                    useColorExpression: {
                      ref: 'style.background.useColorExpression',
                      type: 'boolean',
                      translation: 'AppDetails.SheetBackgroundColor',
                      component: 'dropdown',
                      options: [
                        {
                          value: false,
                          translation: 'properties.colorMode.primary',
                        },
                        {
                          value: true,
                          translation: 'properties.colorMode.byExpression',
                        },
                      ],
                    },
                    colorPicker: {
                      component: 'color-picker',
                      type: 'object',
                      ref: 'style.background.color',
                      translation: 'properties.color',
                      dualOutput: true,
                      show: data => !propertyResolver.getValue(data, 'style.background.useColorExpression'),
                    },
                    colorExpression: {
                      component: 'string',
                      type: 'string',
                      ref: 'style.background.colorExpression',
                      translation: 'Common.Expression',
                      expression: 'optional',
                      show: data => propertyResolver.getValue(data, 'style.background.useColorExpression'),
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    support: {
      export: true,
      exportData: true,
      snapshot: true,
      viewData: true,
    },
  };
}
