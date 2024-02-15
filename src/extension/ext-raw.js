import DEFAULTS from "../style-defaults";
import propertyResolver from "../utils/property-resolver";
import createStylingDefinition from './styling-definitions/styling-definition';

const colorOptions = [
  { value: "auto", translation: "Common.Auto" },
  { value: "colorPicker", translation: "properties.colorMode.primary" },
  { value: "byExpression", translation: "properties.colorMode.byExpression" },
];

const navigationOptions = [
  { value: "free", translation: "Object.OrgChart.FreeMode" },
  { value: "expandAll", translation: "Object.OrgChart.ExpandAll" },
];

const bordersActive = (data) =>
  propertyResolver.getValue(data, "style.border.top") || propertyResolver.getValue(data, "style.border.fullBorder");

const data = {
  uses: "data",
  items: {
    measures: {
      disabledRef: "",
    },
    dimensions: {
      disabledRef: "",
      items: {
        dimensionLimits: {
          show: false,
        },
        attributes: {
          component: "attribute-expression-reference",
          defaultValue: [],
          show: (dim, handler) => {
            const dims = handler.getDimensions();
            return dims[0] === dim;
          },
          ref: "qAttributeExpressions",
          items: [
            {
              component: "expression",
              ref: "qExpression",
              translation: "Object.OrgChart.LabelExpression",
              defaultValue: "",
              id: "labelExpression",
              tid: "labelExpression",
            },
            {
              component: "expression",
              ref: "qExpression",
              translation: "Object.OrgChart.SubLabelExpression",
              defaultValue: "",
              id: "subLabelExpression",
              tid: "subLabelExpression",
            },
            {
              component: "expression",
              ref: "qExpression",
              translation: "Object.OrgChart.ExtraLabelExpression",
              defaultValue: "",
              id: "extraLabelExpression",
              tid: "extraLabelExpression",
            },
            {
              component: 'expression',
              ref: 'qExpression',
              //translation: 'Object.OrgChart.Images',
              translation: 'Images',
              defaultValue: '',
              id: 'imageExpression',
              tid: 'imageExpression',
            },
            {
              component: "expression",
              ref: "qExpression",
              translation: "Object.OrgChart.ColorLabelExpression",
              defaultValue: "",
              id: "colorByExpression",
              tid: "nodeColorByExpression",
            },
          ],
        },
        desc: {
          show: (dim, handler) => {
            const dims = handler.getDimensions();
            return dims[0] === dim;
          },
          component: "text",
          translation: "Object.OrgChart.ExtraLabelDesc",
          style: "hint",
        },
      },
    },
  },
};

const sorting = {
  uses: 'sorting',
};

const addOns = {
  type: "items",
  component: "expandable-items",
  translation: "properties.addons",
  items: {
    dataHandling: {
      uses: "dataHandling",
      items: {
        calcCond: {
          uses: "calcCond",
        },
        rowLimit: {
          type: "integer",
          translation: "$RowLimit",
          ref: "rowLimit",
          defaultValue: 30000,
          min: 5000,
          max: 100000,
          show: false,
        },
      },
    },
  },
};

const getSettings = (translator, flags, anything) => {
  const theme = anything?.sense?.theme;
  const settings = {
    uses: "settings",
    items: {
      styling: {
        grouped: true,
        translation: "properties.presentation",
        type: "items",
        items: {
          ...(flags?.isEnabled('SENSECLIENT_IM_5036_VIZBUNDLE_STYLING') && {
            orgChartStyling: createStylingDefinition(theme, flags, translator),
          }),
          navigation: {
            type: "items",
            items: {
              navigationMode: {
                ref: "navigationMode",
                type: "string",
                translation: "Object.OrgChart.NavigationMode",
                component: "dropdown",
                defaultValue: "free",
                options: navigationOptions,
              },
              resizeOnExpand: {
                ref: "resizeOnExpand",
                type: "boolean",
                defaultValue: false,
                translation: "Object.OrgChart.resizeOnExpand",
                show: (data) => propertyResolver.getValue(data, "navigationMode") !== "expandAll",
              },
            },
          },
          backgroundColor: {},
          fontColor: {},
          border: {},
        },
      },
    },
  };

  if (!flags?.isEnabled('SENSECLIENT_IM_5036_VIZBUNDLE_STYLING')) {

    settings.items.styling.items.backgroundColor = {
      type: "items",
      items: {
        useColorExpression: {
          ref: "style.backgroundColor.colorType",
          type: "string",
          translation: "Object.OrgChart.BackgroundColor",
          component: "dropdown",
          defaultValue: DEFAULTS.BACKGROUND_COLOR_TYPE,
          options: colorOptions,
        },
        colorPicker: {
          component: "color-picker",
          type: "object",
          ref: "style.backgroundColor.color",
          translation: "properties.color",
          dualOutput: true,
          defaultValue: DEFAULTS.BACKGROUND_COLOR,
          show: (data) =>
            propertyResolver.getValue(data, "style.backgroundColor.colorType") === "colorPicker",
        },
        colorExpression: {
          component: "string",
          type: "string",
          ref: "style.backgroundColor.colorExpression",
          translation: "Common.Expression",
          expression: "optional",
          defaultValue: "",
          show: (data) =>
            propertyResolver.getValue(data, "style.backgroundColor.colorType") === "byExpression",
        },
      },
    };

    settings.items.styling.items.fontColor = {
      type: "items",
      items: {
        useColorExpression: {
          ref: "style.fontColor.colorType",
          type: "string",
          translation: "Object.OrgChart.FontColor",
          component: "dropdown",
          defaultValue: DEFAULTS.FONT_COLOR_TYPE,
          options: colorOptions,
        },
        colorPicker: {
          component: "color-picker",
          type: "object",
          ref: "style.fontColor.color",
          translation: "properties.color",
          dualOutput: true,
          defaultValue: DEFAULTS.FONT_COLOR_DARK,
          show: (data) => propertyResolver.getValue(data, "style.fontColor.colorType") === "colorPicker",
        },
        colorExpression: {
          component: "string",
          type: "string",
          ref: "style.fontColor.colorExpression",
          translation: "Common.Expression",
          expression: "optional",
          defaultValue: "",
          show: (data) => propertyResolver.getValue(data, "style.fontColor.colorType") === "byExpression",
        },
      },
    };

    settings.items.styling.items.border = {
      type: "items",
      items: {
        appearanceHeader: {
          component: "text",
          translation: "Object.OrgChart.CardAppearance",
          style: "pp-nm-hcd__list-header",
        },
        topBar: {
          type: "boolean",
          ref: "style.border.top",
          translation: "Object.OrgChart.TopBar",
          defaultValue: DEFAULTS.BORDER_TOP,
        },
        fullBorder: {
          type: "boolean",
          ref: "style.border.fullBorder",
          translation: "properties.border",
          defaultValue: DEFAULTS.BORDER_FULL,
        },
        colorType: {
          component: "dropdown",
          type: "string",
          ref: "style.border.colorType",
          translation: "properties.border.color",
          defaultValue: DEFAULTS.BORDER_COLOR_TYPE,
          options: colorOptions,
          show: (data) => bordersActive(data),
        },
        colorPicker: {
          component: "color-picker",
          type: "object",
          ref: "style.border.color",
          translation: "properties.color",
          dualOutput: true,
          defaultValue: DEFAULTS.BORDER_COLOR,
          show: (data) =>
            bordersActive(data) &&
            propertyResolver.getValue(data, "style.border.colorType") === "colorPicker",
        },
        colorExpression: {
          component: "string",
          type: "string",
          ref: "style.border.colorExpression",
          translation: "Common.Expression",
          expression: "optional",
          defaultValue: "",
          show: (data) =>
            bordersActive(data) &&
            propertyResolver.getValue(data, "style.border.colorType") === "byExpression",
        },
      },
    };
  }

  return settings;
};  

export default function ({ translator, flags, anything }) {
  return {
    definition: {
      type: 'items',
      component: 'accordion',
      items: {
        data,
        sorting,
        addOns,
        settings: getSettings(translator, flags, anything),
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


/*
export default {
  definition: {
    type: "items",
    component: "accordion",
    items: {
      data: {
        uses: "data",
        items: {
          measures: {
            disabledRef: "",
          },
          dimensions: {
            disabledRef: "",
            items: {
              dimensionLimits: {
                show: false,
              },
              attributes: {
                component: "attribute-expression-reference",
                defaultValue: [],
                show: (dim, handler) => {
                  const dims = handler.getDimensions();
                  return dims[0] === dim;
                },
                ref: "qAttributeExpressions",
                items: [
                  {
                    component: "expression",
                    ref: "qExpression",
                    translation: "Object.OrgChart.LabelExpression",
                    defaultValue: "",
                    id: "labelExpression",
                    tid: "labelExpression",
                  },
                  {
                    component: "expression",
                    ref: "qExpression",
                    translation: "Object.OrgChart.SubLabelExpression",
                    defaultValue: "",
                    id: "subLabelExpression",
                    tid: "subLabelExpression",
                  },
                  {
                    component: "expression",
                    ref: "qExpression",
                    translation: "Object.OrgChart.ExtraLabelExpression",
                    defaultValue: "",
                    id: "extraLabelExpression",
                    tid: "extraLabelExpression",
                  },

                  {
                    component: "expression",
                    ref: "qExpression",
                    translation: "Object.OrgChart.ColorLabelExpression",
                    defaultValue: "",
                    id: "colorByExpression",
                    tid: "nodeColorByExpression",
                  },
                ],
              },
              desc: {
                show: (dim, handler) => {
                  const dims = handler.getDimensions();
                  return dims[0] === dim;
                },
                component: "text",
                translation: "Object.OrgChart.ExtraLabelDesc",
                style: "hint",
              },
            },
          },
        },
      },
      sorting: {
        uses: "sorting",
      },
      addOns: {
        type: "items",
        component: "expandable-items",
        translation: "properties.addons",
        items: {
          dataHandling: {
            uses: "dataHandling",
            items: {
              calcCond: {
                uses: "calcCond",
              },
              rowLimit: {
                type: "integer",
                translation: "$RowLimit",
                ref: "rowLimit",
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
        uses: "settings",
        items: {
          styling: {
            grouped: true,
            translation: "properties.presentation",
            type: "items",
            items: {
              navigation: {
                type: "items",
                items: {
                  navigationMode: {
                    ref: "navigationMode",
                    type: "string",
                    translation: "Object.OrgChart.NavigationMode",
                    component: "dropdown",
                    defaultValue: "free",
                    options: navigationOptions,
                  },
                  resizeOnExpand: {
                    ref: "resizeOnExpand",
                    type: "boolean",
                    defaultValue: false,
                    translation: "Object.OrgChart.resizeOnExpand",
                    show: (data) => propertyResolver.getValue(data, "navigationMode") !== "expandAll",
                  },
                },
              },
              backgroundColor: {
                type: "items",
                items: {
                  useColorExpression: {
                    ref: "style.backgroundColor.colorType",
                    type: "string",
                    translation: "Object.OrgChart.BackgroundColor",
                    component: "dropdown",
                    defaultValue: DEFAULTS.BACKGROUND_COLOR_TYPE,
                    options: colorOptions,
                  },
                  colorPicker: {
                    component: "color-picker",
                    type: "object",
                    ref: "style.backgroundColor.color",
                    translation: "properties.color",
                    dualOutput: true,
                    defaultValue: DEFAULTS.BACKGROUND_COLOR,
                    show: (data) =>
                      propertyResolver.getValue(data, "style.backgroundColor.colorType") === "colorPicker",
                  },
                  colorExpression: {
                    component: "string",
                    type: "string",
                    ref: "style.backgroundColor.colorExpression",
                    translation: "Common.Expression",
                    expression: "optional",
                    defaultValue: "",
                    show: (data) =>
                      propertyResolver.getValue(data, "style.backgroundColor.colorType") === "byExpression",
                  },
                },
              },
              fontColor: {
                type: "items",
                items: {
                  useColorExpression: {
                    ref: "style.fontColor.colorType",
                    type: "string",
                    translation: "Object.OrgChart.FontColor",
                    component: "dropdown",
                    defaultValue: DEFAULTS.FONT_COLOR_TYPE,
                    options: colorOptions,
                  },
                  colorPicker: {
                    component: "color-picker",
                    type: "object",
                    ref: "style.fontColor.color",
                    translation: "properties.color",
                    dualOutput: true,
                    defaultValue: DEFAULTS.FONT_COLOR_DARK,
                    show: (data) => propertyResolver.getValue(data, "style.fontColor.colorType") === "colorPicker",
                  },
                  colorExpression: {
                    component: "string",
                    type: "string",
                    ref: "style.fontColor.colorExpression",
                    translation: "Common.Expression",
                    expression: "optional",
                    defaultValue: "",
                    show: (data) => propertyResolver.getValue(data, "style.fontColor.colorType") === "byExpression",
                  },
                },
              },
              border: {
                type: "items",
                items: {
                  appearanceHeader: {
                    component: "text",
                    translation: "Object.OrgChart.CardAppearance",
                    style: "pp-nm-hcd__list-header",
                  },
                  topBar: {
                    type: "boolean",
                    ref: "style.border.top",
                    translation: "Object.OrgChart.TopBar",
                    defaultValue: DEFAULTS.BORDER_TOP,
                  },
                  fullBorder: {
                    type: "boolean",
                    ref: "style.border.fullBorder",
                    translation: "properties.border",
                    defaultValue: DEFAULTS.BORDER_FULL,
                  },
                  colorType: {
                    component: "dropdown",
                    type: "string",
                    ref: "style.border.colorType",
                    translation: "properties.border.color",
                    defaultValue: DEFAULTS.BORDER_COLOR_TYPE,
                    options: colorOptions,
                    show: (data) => bordersActive(data),
                  },
                  colorPicker: {
                    component: "color-picker",
                    type: "object",
                    ref: "style.border.color",
                    translation: "properties.color",
                    dualOutput: true,
                    defaultValue: DEFAULTS.BORDER_COLOR,
                    show: (data) =>
                      bordersActive(data) &&
                      propertyResolver.getValue(data, "style.border.colorType") === "colorPicker",
                  },
                  colorExpression: {
                    component: "string",
                    type: "string",
                    ref: "style.border.colorExpression",
                    translation: "Common.Expression",
                    expression: "optional",
                    defaultValue: "",
                    show: (data) =>
                      bordersActive(data) &&
                      propertyResolver.getValue(data, "style.border.colorType") === "byExpression",
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
*/