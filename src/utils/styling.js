import colorUtils from './color-utils';

export function getColor(reference, palette, defaultColor) {
  let color;
  switch (reference.colorType) {
    case 'byExpression':
      color = colorUtils.resolveExpression(reference.colorExpression);
      break;
    case 'colorPicker':
      color = colorUtils.resolveColor(reference.color, palette);
      break;
    default:
      color = defaultColor;
  }
  return color === 'none' ? defaultColor : color;
}

const stylingUtils = {
  cardStyling: ({ Theme, layout }) => {
    const palette = colorUtils.getPalette(Theme);
    const backgroundColor = getColor(layout.style.background, palette, '#e6e6e6');
    const fontColor = getColor(layout.style.label, palette, 'default');
    const cardStyling = {
      backgroundColor,
      fontColor,
    };
    return cardStyling;
  },
};

export default stylingUtils;
