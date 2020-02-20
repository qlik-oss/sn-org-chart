import colorUtils from './color-utils';

export function getColor(reference, Theme, defaultColor) {
  let color;
  switch (reference.colorType) {
    case 'byExpression':
      color = colorUtils.resolveExpression(reference.colorExpression);
      break;
    case 'colorPicker':
      color = Theme.getColorPickerColor(reference.color);
      break;
    default:
      color = defaultColor;
  }
  return color === 'none' ? defaultColor : color;
}

const stylingUtils = {
  cardStyling: ({ Theme, layout }) => {
    const backgroundColor = getColor(layout.style.backgroundColor, Theme, '#e6e6e6');
    const fontColor = getColor(layout.style.fontColor, Theme, 'default');
    const measureLabel = layout.qHyperCube.qMeasureInfo.length
      ? layout.qHyperCube.qMeasureInfo[0].qFallbackTitle
      : null;
    const cardStyling = {
      backgroundColor,
      fontColor,
      measureLabel,
    };
    return cardStyling;
  },
};

export default stylingUtils;
