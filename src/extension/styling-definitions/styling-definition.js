import { fontResolver as createFontResolver } from "qlik-chart-modules";
import DEFAULTS from "../../style-defaults";
import propertyResolver from "../../utils/property-resolver";
import labelStylingDefinition from "./styling-utils";

const colorOptions = [
  { value: "auto", translation: "Common.Auto" },
  { value: "colorPicker", translation: "properties.colorMode.primary" },
  { value: "byExpression", translation: "properties.colorMode.byExpression" },
];

const imageLocationOptions = [
  { value: "card", translation: "Card only" },
  { value: "tooltip", translation: "Tooltip only" },
  { value: "both", translation: "Card and tooltip" },
];

const imageAlignmentOptions = [
  { value: "left", translation: "Left" },
  { value: "right", translation: "Right" },
  { value: "top", translation: "Top" },
  { value: "bottom", translation: "Bottom" },
];

const imageShapeOptions = [
  { value: "rectangle", translation: "Rectangle" },
  { value: "round", translation: "Round" },
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
    (propertyResolver.getValue(data, "border.top") ?? DEFAULTS.BORDER_TOP) ||
    (propertyResolver.getValue(data, "border.fullBorder") ?? DEFAULTS.BORDER_FULL);

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
                    defaultValue: () => ({
                      index: -1,
                      color: theme.getStyle("object.orgChart", "label.value", "color") ?? DEFAULTS.FONT_COLOR_DARK,
                    }),
                    show: (data) =>
                      (propertyResolver.getValue(data, "label.value.colorType") ?? DEFAULTS.FONT_COLOR_TYPE) ===
                      "colorPicker",
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
                  (propertyResolver.getValue(data, "label.value.colorType") ?? DEFAULTS.FONT_COLOR_TYPE) ===
                  "byExpression",
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
                      (propertyResolver.getValue(data, "backgroundColor.colorType") ??
                        DEFAULTS.BACKGROUND_COLOR_TYPE) === "colorPicker",
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
                  (propertyResolver.getValue(data, "backgroundColor.colorType") ?? DEFAULTS.BACKGROUND_COLOR_TYPE) ===
                  "byExpression",
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
              fontColorWrapperItem: {
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
                      (propertyResolver.getValue(data, "border.colorType") ?? DEFAULTS.BORDER_COLOR_TYPE) ===
                        "colorPicker",
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
                  (propertyResolver.getValue(data, "border.colorType") ?? DEFAULTS.BORDER_COLOR_TYPE) ===
                    "byExpression",
              },
            },
          },
        },
      },
      imageSection: {
        component: "panel-section",
        translation: "Object.OrgChart.ImageOptions",
        items: {
          imageItems: {
            component: "items",
            ref: "components",
            key: "image",
            items: {
              location: {
                component: "dropdown",
                ref: "image.location",
                translation: "Object.OrgChart.ImageLocation",
                options: imageLocationOptions,
                defaultValue: DEFAULTS.IMAGE_LOCATION,
              },
              alignment: {
                component: "dropdown",
                ref: "image.alignment",
                translation: "Object.OrgChart.ImageAlignment",
                options: imageAlignmentOptions,
                defaultValue: DEFAULTS.IMAGE_ALIGNMENT,
              },
              shape: {
                component: "dropdown",
                ref: "image.shape",
                translation: "Object.OrgChart.ImageShape",
                options: imageShapeOptions,
                defaultValue: DEFAULTS.IMAGE_SHAPE,
              },
              clip: {
                component: "checkbox",
                ref: "image.clip",
                translation: "Object.OrgChart.ImageFit",
                defaultValue: DEFAULTS.IMAGE_CLIP,
                show: (data) =>
                  (propertyResolver.getValue(data, "image.shape") ?? DEFAULTS.IMAGE_SHAPE) === "rectangle",
              },
            },
          },
        },
      },
    },
  };
}

export default createStylingDefinition;
