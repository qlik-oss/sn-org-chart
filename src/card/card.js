import DEFAULTS from "../style-defaults";
import constants from "../tree/size-constants";
import colorUtils from "../utils/color-utils";
import encodeUtils from "../utils/encoder";

export function resolveColor(color) {
  const resolvedColor = colorUtils.resolveExpression(color);
  return resolvedColor !== "none" ? resolvedColor : encodeUtils.encodeCssColor(color);
}

export function getBackgroundColor(data, cardStyling) {
  if (data.attributes && data.attributes.color) {
    const resolvedColor = colorUtils.resolveExpression(data.attributes.color);
    if (resolvedColor !== "none") {
      return resolvedColor;
    }
  }
  return resolveColor(cardStyling.backgroundColor);
}

export function getFontColor(cardStyling, backgroundColor) {
  if (cardStyling.fontColor === "default") {
    return colorUtils.isDarkColor(backgroundColor) ? DEFAULTS.FONT_COLOR_LIGHT.color : DEFAULTS.FONT_COLOR_DARK.color;
  }
  return cardStyling.fontColor;
}

export default (data, cardStyling, selectionObj) => {
  const { api, state } = selectionObj;
  const isSelected = api && api.isActive() && state.indexOf(data.elemNo) !== -1;
  const backgroundColor = getBackgroundColor(data, cardStyling);
  const fontColor = resolveColor(getFontColor(cardStyling, backgroundColor));
  const titleStyle = `font-family:${cardStyling.cardTitle.fontFamily};font-size:${cardStyling.cardTitle.fontSize}`;
  const labelStyle = `font-family:${cardStyling.cardBody.fontFamily};font-size:${cardStyling.cardBody.fontSize}`;
  const attributes = data.attributes || {};
  let html = `<div class="sn-org-card-title" style="${titleStyle};">${encodeUtils.encodeTitle(attributes.label || data.id)}</div>`;
  if (attributes.subLabel) {
    html += `<div class="sn-org-card-label" style="${labelStyle};">${encodeUtils.encodeTitle(attributes.subLabel)}</div>`;
  }
  if (data.measure) {
    const measureLabel = cardStyling.measureLabel ? `${cardStyling.measureLabel}: ` : "";
    html += `<div class="sn-org-card-label" style="${labelStyle};">${encodeUtils.encodeTitle(measureLabel + data.measure)}</div>`;
  } else if (attributes.extraLabel) {
    html += `<div class="sn-org-card-label" style="${labelStyle};">${encodeUtils.encodeTitle(attributes.extraLabel)}</div>`;
  }
  const isSelectedClass = isSelected ? " selected" : " not-selected";
  const selectedClass = api && api.isActive() ? isSelectedClass : "";

  const {
    top = DEFAULTS.BORDER_TOP,
    fullBorder = DEFAULTS.BORDER_FULL,
    colorType = DEFAULTS.BORDER_COLOR_TYPE,
  } = cardStyling.border;
  const borderColor =
    colorType === "auto" ? colorUtils.getDarkColor(backgroundColor) : resolveColor(cardStyling.borderColor);

  const topBorder = top && !isSelected ? `3px solid ${borderColor}` : "";
  const borderStyle = fullBorder && !isSelected ? `1px solid ${borderColor}` : "";
  let newCardHeight = constants.cardHeight;
  if (isSelected) {
    newCardHeight -= 8;
  } else if (fullBorder) {
    newCardHeight -= 4;
  } else if (top) {
    newCardHeight -= 3;
  }
  return `<div class="sn-org-card-text${selectedClass}" style="background-color:${backgroundColor};color:${fontColor}; border:${borderStyle}; border-top:${topBorder}; height:${newCardHeight}px;">${html}</div>`;
};