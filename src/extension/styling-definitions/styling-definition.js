import { fontResolver as createFontResolver } from "qlik-chart-modules";
import DEFAULTS from "../../style-defaults";
import labelStylingDefinition from "./styling-utils";

const colorOptions = [
  { value: "auto", translation: "Common.Auto" },
  { value: "colorPicker", translation: "properties.colorMode.primary" },
  { value: "byExpression", translation: "properties.colorMode.byExpression" },
];

function createStylingDefinition(theme, flags, translator) {
  const fontResolver = createFontResolver({
    theme,
    translator,
    flags,
    config: {
      id: "orgChart",
      paths: ["axis.label.name", "label.value"],
    },
  });

  const bordersActive = (data) =>
    (data.border?.top ?? DEFAULTS.BORDER_TOP) ||
    (data.border?.fullBorder ?? DEFAULTS.BORDER_FULL);

  return {
    component: "styling-panel",
    show: true,
    chartType: "orgchart",
    translation: "LayerStyleEditor.component.styling",
    chartTitle: "Object.OrgChart",
    subtitle: "LayerStyleEditor.component.styling",
    useGeneral: true,
    useBackground: true,
    items: {
      axisLabelSection: {
        translation: "Object.OrgChart.Title",
        component: "panel-section",
        items: {
          axisLabelItems: {
            component: "items",
            ref: "components",
            key: "axis",
            items: labelStylingDefinition("axis.label.name", fontResolver),
          },
        },
      },
      labelSection: {
        translation: "Object.OrgChart.Body",
        component: "panel-section",
        items: {
          labelItems: {
            component: "items",
            ref: "components",
            key: "label",
            items: labelStylingDefinition("label.value", fontResolver),
          },
        },
      },
      fontColorSection: {
        component: "panel-section",
        type: "items",
        translation: "Object.OrgChart.FontColor",
        items: {
          fontColorItems: {
            component: "items",
            ref: "components",
            key: "label",
            items: {
              fontColorWrapperItem: {
                component: "inline-wrapper",
                items: {
                  useColorExpression: {
                    ref: "label.value.colorType",
                    width: 9,
                    component: "dropdown",
                    defaultValue: DEFAULTS.FONT_COLOR_TYPE,
                    options: colorOptions,
                  },
                  colorPicker: {
                    component: "color-picker",
                    ref: "label.value.color",
                    width: 3,
                    dualOutput: true,
                    defaultValue: DEFAULTS.FONT_COLOR_DARK,
                    show: (data) =>
                      (data.label?.value?.colorType ?? DEFAULTS.FONT_COLOR_TYPE) === "colorPicker",
                  },
                },
              },
              colorExpression: {
                component: "input-field-expression",
                type: "string",
                ref: "label.value.colorExpression",
                expression: "optional",
                defaultValue: "",
                show: (data) =>
                  (data.label?.value?.colorType ?? DEFAULTS.FONT_COLOR_TYPE) === "byExpression",
              },
            },
          },
        },
      },
      backgroundColorSection: {
        component: "panel-section",
        translation: "Object.OrgChart.ColorLabelExpression",
        items: {
          backgroundColorItems: {
            component: "items",
            ref: "components",
            key: "backgroundColor",
            items: {
              fontColorWrapperItem: {
                component: "inline-wrapper",
                items: {
                  useColorExpression: {
                    ref: "backgroundColor.colorType",
                    width: 9,
                    component: "dropdown",
                    defaultValue: DEFAULTS.BACKGROUND_COLOR_TYPE,
                    options: colorOptions,
                  },
                  colorPicker: {
                    component: "color-picker",
                    type: "object",
                    ref: "backgroundColor.color",
                    width: 3,
                    dualOutput: true,
                    defaultValue: DEFAULTS.BACKGROUND_COLOR,
                    show: (data) =>
                      (data.backgroundColor?.colorType ?? DEFAULTS.BACKGROUND_COLOR_TYPE) === "colorPicker",
                  },
                },
              },
              colorExpression: {
                component: "input-field-expression",
                type: "string",
                ref: "backgroundColor.colorExpression",
                expression: "optional",
                defaultValue: "",
                show: (data) =>
                  (data.backgroundColor?.colorType ?? DEFAULTS.BACKGROUND_COLOR_TYPE) === "byExpression",
              },
            },
          },
        },
      },
      cardBorderSection: {
        component: "panel-section",
        translation: "Object.OrgChart.CardAppearance",
        items: {
          cardBorderItems: {
            component: "items",
            ref: "components",
            key: "border",
            items: {
              topBar: {
                component: "checkbox",
                ref: "border.top",
                translation: "Object.OrgChart.TopBar",
                defaultValue: DEFAULTS.BORDER_TOP,
              },
              fullBorder: {
                component: "checkbox",
                ref: "border.fullBorder",
                translation: "properties.border",
                defaultValue: DEFAULTS.BORDER_FULL,
              },
              borderColorWrapperItem: {
                component: "inline-wrapper",
                items: {
                  colorType: {
                    component: "dropdown",
                    type: "string",
                    ref: "border.colorType",
                    width: 9,
                    translation: "properties.border.color",
                    defaultValue: DEFAULTS.BORDER_COLOR_TYPE,
                    options: colorOptions,
                    show: (data) => bordersActive(data),
                  },
                  colorPicker: {
                    component: "color-picker",
                    type: "object",
                    ref: "border.color",
                    width: 3,
                    dualOutput: true,
                    defaultValue: DEFAULTS.BORDER_COLOR,
                    show: (data) =>
                      bordersActive(data) &&
                      (data.border?.colorType ?? DEFAULTS.BORDER_COLOR_TYPE) === "colorPicker",
                  },
                },
              },
              colorExpression: {
                component: "input-field-expression",
                type: "string",
                ref: "border.colorExpression",
                expression: "optional",
                defaultValue: "",
                show: (data) =>
                  bordersActive(data) &&
                  (data.border?.colorType ?? DEFAULTS.BORDER_COLOR_TYPE) === "byExpression",
              },
            },
          },
        },
      },
    },
  };
}

export default createStylingDefinition;
