import props from '../object-properties';

const defaultValues = {
  Theme: {
    getCurrent: () => ({
      properties: {
        palettes: { ui: [{ colors: ['none', 'color1', 'color2'] }] },
        dataColors: { primaryColor: 'myPrimaryColor' },
        fontFamily: 'myFont',
      },
    }),
  },
  layout: { style: props.style },
};

export default defaultValues;
