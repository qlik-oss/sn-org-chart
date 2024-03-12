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

function isHorizontal(cardStyling) {
  return [undefined, "left", "right"].includes(cardStyling.image.alignment);
}

function isVertical(cardStyling) {
  return !isHorizontal(cardStyling);
}

function imageOnCard(cardStyling, attributes) {
  return attributes.image && cardStyling.image.location !== "tooltip";
}

function defineImageSize(cardStyling) {
  if (isHorizontal(cardStyling)) {
    return "50px";
  }
  if (cardStyling.image.shape === "round") {
    return "110px";
  }
  return "130px";
}

function defineShapeFit(cardStyling) {
  if (cardStyling.image.shape === "round") {
    return " object-fit: cover; border-radius: 50%";
  }
  if (cardStyling.image.clip) {
    return " object-fit: cover";
  }
  return "";
}

export default (data, cardStyling, selectionObj, flags) => {
  const { api, state } = selectionObj;
  const isSelected = api && api.isActive() && state.indexOf(data.elemNo) !== -1;
  const backgroundColor = getBackgroundColor(data, cardStyling);
  const fontColor = resolveColor(getFontColor(cardStyling, backgroundColor));
  const titleStyle = `font-family:${cardStyling.cardTitle.fontFamily};font-size:${cardStyling.cardTitle.fontSize}`;
  const labelStyle = `font-family:${cardStyling.cardBody.fontFamily};font-size:${cardStyling.cardBody.fontSize}`;
  const attributes = data.attributes || {};

  let html = "";
  if (imageOnCard(cardStyling, attributes)) {
    const textBoxHeight = isVertical(cardStyling) && cardStyling.image.shape === "round" ? "80px" : "60px";

    let textBoxCss = isHorizontal(cardStyling)
      ? `width: 85px; max-height: ${textBoxHeight}; height: fit-content;`
      : `width: 145px; max-height: ${textBoxHeight};`;
    textBoxCss += isHorizontal(cardStyling)
      ? `padding-${cardStyling.image.alignment}: 5px; position: relative; top: 50%; transform: translate(0, -50%);`
      : "padding-left: 3px; margin-bottom: 3px; ";
    textBoxCss += cardStyling.image.alignment === "bottom" ? "padding-top: 3px;" : "";
    let textBox = `<div class="sn-org-textbox" style="${textBoxCss}">`;
    textBox += `<div class="sn-org-card-title" style="${titleStyle};">${encodeUtils.encodeTitle(attributes.label || data.id)}</div>`;
    if (attributes.subLabel) {
      textBox += `<div class="sn-org-card-label" style="${labelStyle};">${encodeUtils.encodeTitle(attributes.subLabel)}</div>`;
    }

    // images
    const order =
      cardStyling.image.alignment === undefined || ["top", "left"].includes(cardStyling.image.alignment) ? 0 : 2;
    const align = isHorizontal(cardStyling) ? "" : " margin: 0 auto;";
    const imageSize = defineImageSize(cardStyling);
    const shapeFit = defineShapeFit(cardStyling);
    html += `<div style="order:${order};${align}"><img src="${attributes.image}" class="sn-org-card-image" style="height: ${imageSize}; width: ${imageSize}; ${shapeFit}; "/></div>`;

    if (data.measure) {
      const measureLabel = cardStyling.measureLabel ? `${cardStyling.measureLabel}: ` : "";
      textBox += `<div class="sn-org-card-label" style="${labelStyle};">${encodeUtils.encodeTitle(measureLabel + data.measure)}</div>`;
    } else if (attributes.extraLabel) {
      textBox += `<div class="sn-org-card-label" style="${labelStyle};">${encodeUtils.encodeTitle(attributes.extraLabel)}</div>`;
    }
    html += `${textBox}</div>`;
  } else {
    html += flags?.isEnabled("SENSECLIENT_IM_5036_VIZBUNDLE_STYLING")
      ? `<div class="sn-org-textbox" style="max-height: 60px; height: fit-content; position: relative; top: 50%; transform: translate(0, -50%); padding-left: 3px; ">`
      : `<div class="sn-org-textbox">`;
    html += `<div class="sn-org-card-title" style="${titleStyle};">${encodeUtils.encodeTitle(attributes.label || data.id)}</div>`;
    if (attributes.subLabel) {
      html += `<div class="sn-org-card-label" style="${labelStyle};">${encodeUtils.encodeTitle(attributes.subLabel)}</div>`;
    }
    if (data.measure) {
      const measureLabel = cardStyling.measureLabel ? `${cardStyling.measureLabel}: ` : "";
      html += `<div class="sn-org-card-label" style="${labelStyle};">${encodeUtils.encodeTitle(measureLabel + data.measure)}</div>`;
    } else if (attributes.extraLabel) {
      html += `<div class="sn-org-card-label" style="${labelStyle};">${encodeUtils.encodeTitle(attributes.extraLabel)}</div>`;
    }
    html += "</div>";
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
  let newCardHeight =
    isHorizontal(cardStyling) || cardStyling.image.location === "tooltip"
      ? constants.cardHeight
      : constants.cardHeightLarge;

  let flex;
  if (imageOnCard(cardStyling, attributes)) {
    if (isHorizontal(cardStyling)) {
      flex = "display: flex; flex-direction: row;";
    } else {
      flex = "display: flex; flex-direction: column;";
    }
  } else {
    flex = "";
    if (flags?.isEnabled("SENSECLIENT_IM_5036_VIZBUNDLE_STYLING")) {
      flex = "display: flex;";
    }
  }

  if (isSelected) {
    newCardHeight -= 8;
  } else if (fullBorder) {
    newCardHeight -= 4;
  } else if (top) {
    newCardHeight -= 3;
  }

  const htmlOutput = `<div class="sn-org-card-text${selectedClass}" style="background-color:${backgroundColor};color:${fontColor}; border:${borderStyle}; border-top:${topBorder}; height:${newCardHeight}px;${flex}">${html}</div>`;
  return htmlOutput;
};
