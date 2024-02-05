import DEFAULTS from "../../style-defaults";

export default function createStyleModel({ layout, themeService }) {
  const styles = themeService.getStyles();

  const findComponent = (key) => {
    return layout.components?.find((o) => o.key === key) ?? undefined;
  };

  return {
    axis: {
      label: {
        getStyle: () => ({
          fontSize: findComponent('axis')?.axis?.label?.name?.fontSize ?? styles.axis.label.name.fontSize,
          fontFamily: findComponent('axis')?.axis?.label?.name?.fontFamily ?? styles.axis.label.name.fontFamily,
          //fill: findComponent('axis')?.axis?.label?.name?.color?.color ?? styles.axis.label.name.color,
        }),
      },
    },
    label: {
      value: {
        getStyle: () => ({
          fontSize: findComponent('label')?.label?.value?.fontSize ?? styles.label.value.fontSize,
          fontFamily: findComponent('label')?.label?.value?.fontFamily ?? styles.label.value.fontFamily,
          colorType: findComponent('label')?.label?.value?.colorType ?? layout.style.fontColor.colorType ?? DEFAULTS.FONT_COLOR_TYPE,
          color: findComponent('label')?.label?.value?.color?.color ?? layout.style.fontColor.color.color ?? DEFAULTS.FONT_COLOR_DARK.color,
          colorExpression: findComponent('label')?.label?.value?.colorExpression ?? layout.style.fontColor.colorExpression ?? '',
        }),
      },
    },
    card: {
      backgroundColor: {
        getStyle: () => ({
          colorType: findComponent('card')?.card?.backgroundColor?.colorType ?? layout.style.backgroundColor.colorType ?? DEFAULTS.BACKGROUND_COLOR_TYPE,
          color: findComponent('card')?.card?.backgroundColor?.color?.color ?? layout.style.backgroundColor.color.color ?? DEFAULTS.BACKGROUND_COLOR.color,
          colorExpression: findComponent('card')?.card?.backgroundColor?.colorExpression ?? layout.style.backgroundColor.colorExpression ?? '',
        }),
      },
      border: {
        getStyle: () => ({
          top: findComponent('card')?.card?.border?.top ?? layout.style.border.top ?? DEFAULTS.BORDER_TOP,
          fullBorder: findComponent('card')?.card?.border?.fullBorder ?? layout.style.border.fullBorder ?? DEFAULTS.BORDER_FULL,
          colorType: findComponent('card')?.card?.border?.colorType ?? layout.style.border.colorType ?? DEFAULTS.BORDER_COLOR_TYPE,
          color: findComponent('card')?.card?.border?.color?.color ?? layout.style.border.color.color ?? DEFAULTS.BORDER_COLOR.color,
          colorExpression: findComponent('card')?.card?.border?.colorExpression ?? layout.style.border.colorExpression ?? '',
        }),
      },
    },
  };
}
   