import DEFAULTS from "../../style-defaults";

export default function createStyleModel({ layout, themeService, flags }) {
  const themeStyle = themeService.getStyles();

  const findComponent = (key) => layout.components?.find((o) => o.key === key) ?? undefined;

  const resolveStyle = (key, componentValue, styleValue, defaultValue) => {
    if (!flags?.isEnabled("SENSECLIENT_IM_5036_VIZBUNDLE_STYLING")) {
      return styleValue;
    }
    if (findComponent(key)) {
      if (componentValue != null) {
        return componentValue;
      }
      return defaultValue;
    }
    return styleValue;
  };

  return {
    axis: {
      label: {
        getStyle: () => ({
          fontSize: resolveStyle(
            "axis",
            findComponent("axis")?.axis?.label?.name?.fontSize,
            "14px",
            themeStyle.axis.label.name.fontSize,
          ),
          fontFamily: findComponent("axis")?.axis?.label?.name?.fontFamily ?? themeStyle.axis.label.name.fontFamily,
        }),
      },
    },
    label: {
      value: {
        getStyle: () => ({
          fontSize: resolveStyle(
            "label",
            findComponent("label")?.label?.value?.fontSize,
            "11px",
            themeStyle.label.value.fontSize,
          ),
          fontFamily: findComponent("label")?.label?.value?.fontFamily ?? themeStyle.label.value.fontFamily,
          colorType: resolveStyle(
            "label",
            findComponent("label")?.label?.value?.colorType,
            layout?.style?.fontColor?.colorType,
            DEFAULTS.FONT_COLOR_TYPE,
          ),
          color: resolveStyle(
            "label",
            findComponent("label")?.label?.value?.color,
            layout?.style?.fontColor?.color,
            DEFAULTS.FONT_COLOR_DARK,
          ),
          colorExpression: resolveStyle(
            "label",
            findComponent("label")?.label?.value?.colorExpression,
            layout?.style?.fontColor?.colorExpression,
            "",
          ),
        }),
      },
    },
    backgroundColor: {
      getStyle: () => ({
        colorType: resolveStyle(
          "backgroundColor",
          findComponent("backgroundColor")?.backgroundColor?.colorType,
          layout?.style?.backgroundColor?.colorType,
          DEFAULTS.BACKGROUND_COLOR_TYPE,
        ),
        color: resolveStyle(
          "backgroundColor",
          findComponent("backgroundColor")?.backgroundColor?.color,
          layout?.style?.backgroundColor?.color,
          DEFAULTS.BACKGROUND_COLOR,
        ),
        colorExpression: resolveStyle(
          "backgroundColor",
          findComponent("backgroundColor")?.backgroundColor?.colorExpression,
          layout?.style?.backgroundColor?.colorExpression,
          "",
        ),
      }),
    },
    border: {
      getStyle: () => ({
        top: resolveStyle(
          "border",
          findComponent("border")?.border?.top,
          layout?.style?.border?.top,
          DEFAULTS.BORDER_TOP,
        ),
        fullBorder: resolveStyle(
          "border",
          findComponent("border")?.border?.fullBorder,
          layout?.style?.border?.fullBorder,
          DEFAULTS.BORDER_FULL,
        ),
        colorType: resolveStyle(
          "border",
          findComponent("border")?.border?.colorType,
          layout?.style?.border?.colorType,
          DEFAULTS.BORDER_COLOR_TYPE,
        ),
        color: resolveStyle(
          "border",
          findComponent("border")?.border?.color,
          layout?.style?.border?.color,
          DEFAULTS.BORDER_COLOR,
        ),
        colorExpression: resolveStyle(
          "border",
          findComponent("border")?.border?.colorExpression,
          layout?.style?.border?.colorExpression,
          "",
        ),
      }),
    },
  };
}
