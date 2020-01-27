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
