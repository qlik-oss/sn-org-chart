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
