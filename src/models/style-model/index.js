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
          fontSize: findComponent("axis")?.axis?.label?.name?.fontSize ?? themeStyle.axis.label.name.fontSize ?? "14px",
          fontFamily: findComponent("axis")?.axis?.label?.name?.fontFamily ?? themeStyle.axis.label.name.fontFamily,
        }),
      },
    },
    label: {
      value: {
        getStyle: () => ({
          fontSize: findComponent("label")?.label?.value?.fontSize ?? themeStyle.label.value.fontSize ?? "11px",
          fontFamily: findComponent("label")?.label?.value?.fontFamily ?? themeStyle.label.value.fontFamily,
          colorType: resolveStyle(
            "label",
            findComponent("label")?.label?.value?.colorType,
            layout?.style?.fontColor?.colorType,
            DEFAULTS.FONT_COLOR_TYPE,
          ),
          color: resolveStyle(
            "label",
            findComponent("label")?.label?.value?.color?.color,
            layout?.style?.fontColor?.color?.color,
            themeStyle.label.value.color,
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
          findComponent("backgroundColor")?.backgroundColor?.color?.color,
          layout?.style?.backgroundColor?.color?.color,
          DEFAULTS.BACKGROUND_COLOR.color,
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
          findComponent("border")?.border?.color?.color,
          layout?.style?.border?.color?.color,
          DEFAULTS.BORDER_COLOR.color,
        ),
        colorExpression: resolveStyle(
          "border",
          findComponent("border")?.border?.colorExpression,
          layout?.style?.border?.colorExpression,
          "",
        ),
      }),
    },
    image: {
      getStyle: () => ({
        location: findComponent("image")?.image?.location ?? DEFAULTS.IMAGE_LOCATION,
        alignment: findComponent("image")?.image?.alignment ?? DEFAULTS.IMAGE_ALIGNMENT,
        shape: findComponent("image")?.image?.shape ?? DEFAULTS.IMAGE_SHAPE,
        clip: findComponent("image")?.image?.clip ?? DEFAULTS.IMAGE_CLIP,
      }),
    },
  };
}
