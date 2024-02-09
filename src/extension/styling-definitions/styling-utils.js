function labelStylingDefinition(path, fontResolver, theme) {
  const pathFontFamily = `${path}.fontFamily`;
  const pathFontSize = `${path}.fontSize`;

  return {
    fontFamilyItem: {
      component: 'dropdown',
      ref: pathFontFamily,
      options: () => {
        return fontResolver.getOptions(pathFontFamily);
      },
      defaultValue: () => {
        return fontResolver.getDefaultValue(pathFontFamily);
      },
    },
    fontSizeItem: {
      component: 'dropdown',
      ref: pathFontSize,
      options: () => {
        return fontResolver.getOptions(pathFontSize);
      },
      defaultValue: () => {
        return fontResolver.getDefaultValue(pathFontSize);
      },
    },
  };
}

export default labelStylingDefinition;
