import propertyResolver from '../utils/property-resolver';

const colorOptions = [
  { value: 'auto', translation: 'Common.Auto' },
  { value: 'colorPicker', translation: 'properties.colorMode.primary' },
  { value: 'byExpression', translation: 'properties.colorMode.byExpression' },
];

const navigationOptions = [
  { value: 'free', translation: 'Object.OrgChart.FreeMode' },
  { value: 'expandAll', translation: 'Object.OrgChart.ExpandAll' },
];

export default {
  definition: {
    type: 'items',
    component: 'accordion',
    items: {
      data: {
        uses: 'data',
        items: {
          measures: {
            disabledRef: '',
          },
          dimensions: {
            disabledRef: '',
            items: {
              dimensionLimits: {
                show: false,
              },
              attributes: {
                component: 'attribute-expression-reference',
                defaultValue: [],
                show: (dim, handler) => {
                  const dims = handler.getDimensions();
                  return dims[0] === dim;
                },
                ref: 'qAttributeExpressions',
                items: [
                  {
                    component: 'expression',
                    ref: 'qExpression',
                    translation: 'Object.OrgChart.LabelExpression',
                    defaultValue: '',
                    id: 'labelExpression',
                    tid: 'labelExpression',
                  },
                  {
                    component: 'expression',
                    ref: 'qExpression',
                    translation: 'Object.OrgChart.SubLabelExpression',
                    defaultValue: '',
                    id: 'subLabelExpression',
                    tid: 'subLabelExpression',
                  },
                  {
                    component: 'expression',
                    ref: 'qExpression',
                    translation: 'Object.OrgChart.ExtraLabelExpression',
                    defaultValue: '',
                    id: 'extraLabelExpression',
                    tid: 'extraLabelExpression',
                  },

                  {
                    component: 'expression',
                    ref: 'qExpression',
                    translation: 'Object.OrgChart.ColorLabelExpression',
                    defaultValue: '',
                    id: 'colorByExpression',
                    tid: 'nodeColorByExpression',
                  },
                ],
              },
              desc: {
                show: (dim, handler) => {
                  const dims = handler.getDimensions();
                  return dims[0] === dim;
                },
                component: 'text',
                translation: 'Object.OrgChart.ExtraLabelDesc',
                style: 'hint',
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
          styling: {
            grouped: true,
            translation: 'properties.presentation',
            type: 'items',
            items: {
              navigation: {
                type: 'items',
                items: {
                  navigtaionMode: {
                    ref: 'navigationMode',
                    type: 'string',
                    translation: 'Object.OrgChart.NavigationMode',
                    component: 'dropdown',
                    options: navigationOptions,
                  },
                },
              },
              backgroundColor: {
                type: 'items',
                items: {
                  useColorExpression: {
                    ref: 'style.backgroundColor.colorType',
                    type: 'string',
                    translation: 'Object.OrgChart.BackgroundColor',
                    component: 'dropdown',
                    options: colorOptions,
                  },
                  colorPicker: {
                    component: 'color-picker',
                    type: 'object',
                    ref: 'style.backgroundColor.color',
                    translation: 'properties.color',
                    dualOutput: true,
                    show: data => propertyResolver.getValue(data, 'style.backgroundColor.colorType') === 'colorPicker',
                  },
                  colorExpression: {
                    component: 'string',
                    type: 'string',
                    ref: 'style.backgroundColor.colorExpression',
                    translation: 'Common.Expression',
                    expression: 'optional',
                    show: data => propertyResolver.getValue(data, 'style.backgroundColor.colorType') === 'byExpression',
                  },
                },
              },
              fontColor: {
                type: 'items',
                items: {
                  useColorExpression: {
                    ref: 'style.fontColor.colorType',
                    type: 'string',
                    translation: 'Object.OrgChart.FontColor',
                    component: 'dropdown',
                    options: colorOptions,
                  },
                  colorPicker: {
                    component: 'color-picker',
                    type: 'object',
                    ref: 'style.fontColor.color',
                    translation: 'properties.color',
                    dualOutput: true,
                    show: data => propertyResolver.getValue(data, 'style.fontColor.colorType') === 'colorPicker',
                  },
                  colorExpression: {
                    component: 'string',
                    type: 'string',
                    ref: 'style.fontColor.colorExpression',
                    translation: 'Common.Expression',
                    expression: 'optional',
                    show: data => propertyResolver.getValue(data, 'style.fontColor.colorType') === 'byExpression',
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
