import DEFAULTS from "../style-defaults";
import colorUtils from "./color-utils";

export function getColorStyling(reference, defaultColor) {
  let color;
  switch (reference.colorType) {
    case "byExpression":
      color = colorUtils.resolveExpression(reference.colorExpression);
      break;
    case "colorPicker":
      color = reference.color;
      break;
    default:
      color = defaultColor;
  }
  return color === "none" ? defaultColor : color;
}

const stylingUtils = {
  cardStyling: ({ layout, styleModel }) => {
    const measureLabel = layout.qHyperCube.qMeasureInfo.length
      ? layout.qHyperCube.qMeasureInfo[0].qFallbackTitle
      : null;

    const axisLabelStyle = styleModel.axis.label.getStyle();
    const labelValueStyle = styleModel.label.value.getStyle();
    const cardBackgroundStyle = styleModel.backgroundColor.getStyle();
    const cardBorderStyle = styleModel.border.getStyle();
    const imageStyle = styleModel.image.getStyle();

    const border = {
      top: cardBorderStyle.top,
      fullBorder: cardBorderStyle.fullBorder,
      colorType: cardBorderStyle.colorType,
    };

    const backgroundColor = getColorStyling(cardBackgroundStyle, DEFAULTS.BACKGROUND_COLOR.color);
    const fontColor = getColorStyling(labelValueStyle, "default");
    const borderColor =
      cardBorderStyle.colorType !== "auto"
        ? getColorStyling(cardBorderStyle, colorUtils.getDarkColor(backgroundColor))
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
      image: {
        location: imageStyle.location,
        alignment: imageStyle.alignment,
        shape: imageStyle.shape,
        clip: imageStyle.clip,
      },
    };
    return styling;
  },
};

export default stylingUtils;
