function labelStylingDefinition(path, fontResolver, theme) {
  const pathFontFamily = `${path}.fontFamily`;
  const pathFontSize = `${path}.fontSize`;

return {
  fontWrapperItem: {
    component: 'inline-wrapper',
    items: {
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
    },
  },
};

  /*
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
    fontWrapperItem: {
      component: 'inline-wrapper',
      items: {
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
        fontColorItem: {
          component: 'color-picker',
          width: false,
          ref: `${path}.color`,
          defaultValue: () => ({
            color: theme.getStyle('object.orgChart', path, 'color'),
          }),
        },
      },
    },
  };
}
*/
}

export default labelStylingDefinition;
