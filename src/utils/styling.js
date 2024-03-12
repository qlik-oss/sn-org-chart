import DEFAULTS from "../style-defaults";
import colorUtils from "./color-utils";

export function getColor(reference, Theme, defaultColor) {
  let color;
  switch (reference.colorType) {
    case "byExpression":
      color = colorUtils.resolveExpression(reference.colorExpression);
      break;
    case "colorPicker":
      color = Theme.getColorPickerColor(reference.color);
      break;
    default:
      color = defaultColor;
  }
  return color === "none" ? defaultColor : color;
}

const stylingUtils = {
  cardStyling: ({ Theme, layout, styleModel }) => {
    const measureLabel = layout.qHyperCube.qMeasureInfo.length
      ? layout.qHyperCube.qMeasureInfo[0].qFallbackTitle
      : null;
    const axisLabelStyle = styleModel.axis.label.getStyle();
    const labelValueStyle = styleModel.label.value.getStyle();
    const cardBackgroundStyle = styleModel.backgroundColor.getStyle();
    const cardBorderStyle = styleModel.border.getStyle();

    const border = {
      top: cardBorderStyle.top,
      fullBorder: cardBorderStyle.fullBorder,
      colorType: cardBorderStyle.colorType,
    };

    const backgroundColor = getColor(cardBackgroundStyle, Theme, DEFAULTS.BACKGROUND_COLOR.color);
    const fontColor = getColor(labelValueStyle, Theme, "default");

    const borderColor =
      cardBorderStyle.colorType !== "auto"
        ? getColor(cardBorderStyle, Theme, colorUtils.getDarkColor(backgroundColor))
        : colorUtils.getDarkColor(backgroundColor);

    const styling = {
      cardTitle: axisLabelStyle,
      cardBody: {
        fontSize: labelValueStyle.fontSize,
        fontFamily: labelValueStyle.fontFamily,
      },
      backgroundColor,
      fontColor,
      measureLabel,
      border,
      borderColor,
    };
    return styling;
  },
};

export default stylingUtils;
