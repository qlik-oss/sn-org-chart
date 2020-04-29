export default ({ flags, translator }) => ({
  targets: [
    {
      path: 'qHyperCubeDef',
      dimensions: {
        min: 2,
        max: 2,
        description: (properties, index) => {
          if (flags && flags.isEnabled('FIRST_USER_EXPERIENCE')) {
            return index === 0 && properties.qHyperCubeDef.qDimensions.length === 0
              ? translator.get('Object.OrgChart.FirstDimensionDescription')
              : translator.get('Object.OrgChart.SecondDimensionDescription');
          }
          return '';
        },
      },
      measures: {
        min: 0,
        max: 1,
        description: () => {
          if (flags && flags.isEnabled('FIRST_USER_EXPERIENCE')) {
            return translator.get('Object.OrgChart.MeasureDescription');
          }
          return '';
        },
      },
    },
  ],
});
