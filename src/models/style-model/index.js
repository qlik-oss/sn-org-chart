import DEFAULTS from "../../style-defaults";

export default function createStyleModel({ layout, themeService }) {
  const themeStyle = themeService.getStyles();

  const findComponent = (key) => {
    return layout.components?.find((o) => o.key === key) ?? undefined;
  };

  return {
    axis: {
      label: {
        getStyle: () => ({
          fontSize: findComponent('axis')?.axis?.label?.name?.fontSize ?? themeStyle.axis.label.name.fontSize ?? '14px',
          fontFamily: findComponent('axis')?.axis?.label?.name?.fontFamily ?? themeStyle.axis.label.name.fontFamily,
          //fill: findComponent('axis')?.axis?.label?.name?.color?.color ?? styles.axis.label.name.color,
        }),
      },
    },
    label: {
      value: {
        getStyle: () => ({
          fontSize: findComponent('label')?.label?.value?.fontSize ?? themeStyle.label.value.fontSize ?? '11px',
          fontFamily: findComponent('label')?.label?.value?.fontFamily ?? themeStyle.label.value.fontFamily,
          colorType: findComponent('label')?.label?.value?.colorType ?? layout?.style?.fontColor?.colorType ?? DEFAULTS.FONT_COLOR_TYPE,
          color: findComponent('label')?.label?.value?.color?.color ?? layout?.style?.fontColor?.color?.color ?? themeStyle.label.value.color,
          colorExpression: findComponent('label')?.label?.value?.colorExpression ?? layout?.style?.fontColor?.colorExpression ??'',
        }),
      },
    },
    backgroundColor: {
      getStyle: () => ({
        colorType: findComponent('backgroundColor')?.backgroundColor?.colorType ?? layout?.style?.backgroundColor?.colorType ?? DEFAULTS.BACKGROUND_COLOR_TYPE,
        color: findComponent('backgroundColor')?.backgroundColor?.color?.color ?? layout?.style?.backgroundColor?.color?.color ?? DEFAULTS.BACKGROUND_COLOR.color,
        colorExpression: findComponent('backgroundColor')?.backgroundColor?.colorExpression ?? layout?.style?.backgroundColor?.colorExpression  ?? '',
      }),
    },
    border: {
      getStyle: () => ({
        top: findComponent('border')?.border?.top ?? layout?.style?.border?.top ?? DEFAULTS.BORDER_TOP,
        fullBorder: findComponent('border')?.border?.fullBorder ?? layout?.style?.border?.fullBorder ?? DEFAULTS.BORDER_FULL,
        colorType: findComponent('border')?.border?.colorType ?? layout?.style?.border?.colorType ?? DEFAULTS.BORDER_COLOR_TYPE,
        color: findComponent('border')?.border?.color?.color ?? layout?.style?.border?.color?.color ?? DEFAULTS.BORDER_COLOR.color,
        colorExpression: findComponent('border')?.border?.colorExpression ?? layout?.style?.border?.colorExpression ?? '',
      }),
    },
    image: {
      getStyle: () => ({
        location: findComponent('image')?.image?.location ??  DEFAULTS.IMAGE_LOCATION,
        alignment: findComponent('image')?.image?.alignment ?? DEFAULTS.IMAGE_ALIGNMENT,
      }),
    },
  };
}
