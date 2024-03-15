import DEFAULTS from "../../style-defaults";

export default function createStyleModel({ layout, themeService, flags }) {
  const themeStyle = themeService.getStyles();

  const findComponent = (key) => layout.components?.find((o) => o.key === key) ?? undefined;

  const resolveStyle = (component, componentValue, styleValue, defaultValue) => {
    if (!flags?.isEnabled("SENSECLIENT_IM_5036_VIZBUNDLE_STYLING") || component === undefined) {
      return styleValue;
    }
    return componentValue ?? defaultValue;
  };

  const axisComponent = findComponent("axis");
  const labelComponent = findComponent("label");
  const backgroundComponent = findComponent("backgroundColor");
  const borderComponent = findComponent("border");

  return {
    axis: {
      label: {
        getStyle: () => ({
          fontSize: resolveStyle(
            axisComponent,
            axisComponent?.axis?.label?.name?.fontSize,
            "14px",
            themeStyle.axis.label.name.fontSize,
          ),
          fontFamily: axisComponent?.axis?.label?.name?.fontFamily ?? themeStyle.axis.label.name.fontFamily,
        }),
      },
    },
    label: {
      value: {
        getStyle: () => ({
          fontSize: resolveStyle(
            labelComponent,
            labelComponent?.label?.value?.fontSize,
            "11px",
            themeStyle.label.value.fontSize,
          ),
          fontFamily: labelComponent?.label?.value?.fontFamily ?? themeStyle.label.value.fontFamily,
          colorType: resolveStyle(
            labelComponent,
            labelComponent?.label?.value?.colorType,
            layout?.style?.fontColor?.colorType,
            DEFAULTS.FONT_COLOR_TYPE,
          ),
          color: resolveStyle(
            labelComponent,
            labelComponent?.label?.value?.color,
            layout?.style?.fontColor?.color,
            DEFAULTS.FONT_COLOR_DARK,
          ),
          colorExpression: resolveStyle(
            labelComponent,
            labelComponent?.label?.value?.colorExpression,
            layout?.style?.fontColor?.colorExpression,
            "",
          ),
        }),
      },
    },
    backgroundColor: {
      getStyle: () => ({
        colorType: resolveStyle(
          backgroundComponent,
          backgroundComponent?.backgroundColor?.colorType,
          layout?.style?.backgroundColor?.colorType,
          DEFAULTS.BACKGROUND_COLOR_TYPE,
        ),
        color: resolveStyle(
          backgroundComponent,
          backgroundComponent?.backgroundColor?.color,
          layout?.style?.backgroundColor?.color,
          DEFAULTS.BACKGROUND_COLOR,
        ),
        colorExpression: resolveStyle(
          backgroundComponent,
          backgroundComponent?.backgroundColor?.colorExpression,
          layout?.style?.backgroundColor?.colorExpression,
          "",
        ),
      }),
    },
    border: {
      getStyle: () => ({
        top: resolveStyle(
          borderComponent,
          borderComponent?.border?.top,
          layout?.style?.border?.top,
          DEFAULTS.BORDER_TOP,
        ),
        fullBorder: resolveStyle(
          borderComponent,
          borderComponent?.border?.fullBorder,
          layout?.style?.border?.fullBorder,
          DEFAULTS.BORDER_FULL,
        ),
        colorType: resolveStyle(
          borderComponent,
          borderComponent?.border?.colorType,
          layout?.style?.border?.colorType,
          DEFAULTS.BORDER_COLOR_TYPE,
        ),
        color: resolveStyle(
          borderComponent,
          borderComponent?.border?.color,
          layout?.style?.border?.color,
          DEFAULTS.BORDER_COLOR,
        ),
        colorExpression: resolveStyle(
          borderComponent,
          borderComponent?.border?.colorExpression,
          layout?.style?.border?.colorExpression,
          "",
        ),
      }),
    },
  };
}
