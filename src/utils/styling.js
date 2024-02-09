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
  cardStyling: ({ Theme, layout, flags, styleModel }) => {

    const measureLabel = layout.qHyperCube.qMeasureInfo.length
      ? layout.qHyperCube.qMeasureInfo[0].qFallbackTitle
      : null;

    //if (flags?.isEnabled('SENSECLIENT_IM_5036_VIZBUNDLE_STYLING')) {
      const axisLabelStyle = styleModel.axis.label.getStyle();
      const labelValueStyle = styleModel.label.value.getStyle();
      const cardBackgroundStyle = styleModel.card.backgroundColor.getStyle();
      const cardBorderStyle = styleModel.card.border.getStyle();

      const border = { 
        top: cardBorderStyle.top,
        fullBorder: cardBorderStyle.fullBorder,
        colorType: cardBorderStyle.colorType,
      };

      const backgroundColor = getColorStyling(cardBackgroundStyle, DEFAULTS.BACKGROUND_COLOR.color);
      const fontColor = getColorStyling(labelValueStyle, "default");
      const borderColor = cardBorderStyle.colorType !== "auto"
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
      };
      return styling;
    //}
    /*
    const backgroundColor = getColor(layout.style.backgroundColor, Theme, DEFAULTS.BACKGROUND_COLOR.color);
    const fontColor = getColor(layout.style.fontColor, Theme, "default");
    const { border = { colorType: DEFAULTS.BORDER_COLOR_TYPE } } = layout.style;
    const borderColor =
      border.colorType !== "auto"
        ? getColor(border, Theme, colorUtils.getDarkColor(backgroundColor))
        : colorUtils.getDarkColor(backgroundColor);
    return {
      backgroundColor,
      fontColor,
      measureLabel,
      border,
      borderColor,
    };
    */

  },
};

export default stylingUtils;
