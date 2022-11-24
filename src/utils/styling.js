import colorUtils from './color-utils';
import DEFAULTS from '../style-defaults';

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
    const backgroundColor = getColor(layout.style.backgroundColor, Theme, DEFAULTS.BACKGROUND_COLOR.color);
    const fontColor = getColor(layout.style.fontColor, Theme, 'default');
    const measureLabel = layout.qHyperCube.qMeasureInfo.length
      ? layout.qHyperCube.qMeasureInfo[0].qFallbackTitle
      : null;
    const { border = { colorType: DEFAULTS.BORDER_COLOR_TYPE } } = layout.style;
    const borderColor =
      border.colorType !== 'auto'
        ? getColor(border, Theme, colorUtils.getDarkColor(backgroundColor))
        : colorUtils.getDarkColor(backgroundColor);
    const { location, alignment } = layout.style.image || {};
    return {
      backgroundColor,
      fontColor,
      measureLabel,
      border,
      borderColor,
      location,
      alignment
    };
  },
};

export default stylingUtils;
