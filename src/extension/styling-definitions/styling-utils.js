function labelStylingDefinition(path, fontResolver) {
  const pathFontFamily = `${path}.fontFamily`;
  const pathFontSize = `${path}.fontSize`;

  return {
    fontFamilyItem: {
      component: 'dropdown',
      ref: pathFontFamily,
      options: () => fontResolver.getOptions(pathFontFamily),
      defaultValue: () => fontResolver.getDefaultValue(pathFontFamily),
    },
    fontSizeItem: {
      component: 'dropdown',
      ref: pathFontSize,
      options: () => fontResolver.getOptions(pathFontSize),
      defaultValue: () => fontResolver.getDefaultValue(pathFontSize),
    },
  };
}

export default labelStylingDefinition;
