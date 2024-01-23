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
          fill: findComponent('axis')?.axis?.label?.name?.color?.color ?? styles.axis.label.name.color,
        }),
      },
    },
    label: {
      value: {
        getStyle: () => ({
          fontSize: findComponent('label')?.label?.value?.fontSize ?? styles.label.value.fontSize,
          fontFamily: findComponent('label')?.label?.value?.fontFamily ?? styles.label.value.fontFamily,
          fill: findComponent('label')?.label?.value?.color?.color ?? styles.label.value.color,
          useContrastColor: findComponent('label')?.label?.value?.useContrastColor ?? true,
        }),
      },
    },
  };
}
