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

export function getColorNew(reference, Theme, defaultColor, colorType) {
  let color;
  switch (colorType) {
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


export function getColorBackground(reference, Theme, defaultColor) {
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

const findComponent = (key, layout) => {
  return layout.components?.find((o) => o.key === key) ?? undefined;
};

const stylingUtils = {
  cardStyling: ({ Theme, layout, flags, styleModel }) => {
    const axisLabelStyle = styleModel.axis.label.getStyle();
    const labelValueStyle = styleModel.label.value.getStyle();
    const cardBackgrounStyle = styleModel.card.backgroundColor.getStyle();
    const cardBorderStyle = styleModel.card.border.getStyle();

    console.log('************ in stylingUtils *****************');

    console.log ('axisLabelStyle font size', axisLabelStyle.fontSize);
    console.log ('axisLabelStyle font family', axisLabelStyle.fontFamily);

    console.log ('labelValueStyle font size', labelValueStyle.fontSize);
    console.log ('labelValueStyle font family', labelValueStyle.fontFamily);
    console.log ('labelValueStyle color type', labelValueStyle.colorType);
    console.log ('labelValueStyle color', labelValueStyle.color);
    console.log ('labelValueStyle color expression', labelValueStyle.colorExpression);

    console.log ('cardBackgrounStyle color type', cardBackgrounStyle.colorType);
    console.log ('cardBackgrounStyle color', cardBackgrounStyle.color);
    console.log ('cardBackgrounStyle color expression', cardBackgrounStyle.colorExpression);

    console.log ('cardBorderStyle top', cardBorderStyle.top);
    console.log ('cardBorderStyle full border', cardBorderStyle.fullBorder);
    console.log ('cardBorderStyle color type', cardBorderStyle.colorType);
    console.log ('cardBorderStyle color', cardBorderStyle.color);
    console.log ('cardBorderStyle color expression', cardBorderStyle.colorExpression);
 
    console.log('layout is', layout);
  

    //const backgroundColor = getColorNew(refBackgroundColor, Theme, DEFAULTS.BACKGROUND_COLOR.color, colorType);
    //const backgroundColor = getColorBackground(refBackgroundColor, Theme, DEFAULTS.BACKGROUND_COLOR.color);

    const backgroundColor = getColor(layout.style.backgroundColor, Theme, DEFAULTS.BACKGROUND_COLOR.color);
    const fontColor = getColor(layout.style.fontColor, Theme, "default");
    const measureLabel = layout.qHyperCube.qMeasureInfo.length
      ? layout.qHyperCube.qMeasureInfo[0].qFallbackTitle
      : null;
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

  },
};

export default stylingUtils;
