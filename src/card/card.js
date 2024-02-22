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

/*
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
*/

  const imageWidthH = '50px';
  const imageHeightH = '50px';
  const textDivWidhtH = '85px';
  const textDivHeightH = '60px';

  const imageWidthV = '130px';
  const imageHeightV = '130px';
  const textDivWidhtV = '145px';
  const textDivHeightV = '60px';

  let html = '';
  if (attributes.image && cardStyling.location !== 'tooltip') {
    const textBoxHeight = ['top', 'bottom'].includes(cardStyling.alignment) && cardStyling.shape === 'round' ? '80px' : '60px';

    let textBoxCss = [undefined, 'left', 'right'].includes(cardStyling.alignment) ? `width: ${textDivWidhtH}; max-height: ${textBoxHeight}; height: fit-content;` : `width: ${textDivWidhtV}; height: ${textBoxHeight};`;
    //textBoxCss += [undefined, 'left', 'right'].includes(cardStyling.alignment) && `padding-${cardStyling.alignment}: 5px; position: relative; top: 50%; transform: translate(0, -50%);`;
    textBoxCss += [undefined, 'left', 'right'].includes(cardStyling.alignment) ? `padding-${cardStyling.alignment}: 5px; position: relative; top: 50%; transform: translate(0, -50%);` : 'padding-left: 3px;';
    textBoxCss += cardStyling.alignment === 'bottom' ? 'padding-top: 3px;': '';
    let textBox = `<div class="sn-org-textbox" style="${textBoxCss}">`;
    textBox += `<div class="sn-org-card-title" style="${titleStyle};">${encodeUtils.encodeTitle(attributes.label || data.id)}</div>`;
    if (attributes.subLabel) {
      textBox += `<div class="sn-org-card-label" style="${labelStyle};">${encodeUtils.encodeTitle(attributes.subLabel)}</div>`;
    }

    //image
    const order = cardStyling.alignment === undefined || ['top', 'left'].includes(cardStyling.alignment) ? 0 : 2;
    const imageSize = ['top', 'bottom'].includes(cardStyling.alignment) ? cardStyling.shape === 'round' ? '110px' : '130px' : '50px';

    const align = [undefined, 'left', 'right'].includes(cardStyling.alignment) ? '' : ' margin: 0 auto;';
    //const shape = cardStyling.shape === 'round' ? ' object-fit: cover; border-radius: 50%' : '';
    const shape = cardStyling.shape === 'rectangle' ? cardStyling.clip ? ' object-fit: cover' : '' : ' object-fit: cover; border-radius: 50%';
    //const outline = cardStyling.outlineColor !== 'none' ? `border: 2px solid ${cardStyling.outlineColor};` : '';
    //console.log('shape',shape);
    //html += `<div style='order:${order};${align};'><img src="${attributes.image}" class="sn-org-card-image" style="${height};${width};${shape};"/></div>`;
    html += `<div style="order:${order};${align};"><img src="${attributes.image}" class="sn-org-card-image" style="height: ${imageSize}; width: ${imageSize}; ${shape}; "/></div>`;


    if (data.measure) {
      const measureLabel = cardStyling.measureLabel ? `${cardStyling.measureLabel}: ` : '';
      textBox += `<div class="sn-org-card-label" style="${labelStyle};">${encodeUtils.encodeTitle(measureLabel + data.measure)}</div>`;
    } else if (attributes.extraLabel) {
      textBox += `<div class="sn-org-card-label" style="${labelStyle};">${encodeUtils.encodeTitle(attributes.extraLabel)}</div>`;
    }
    html += textBox;

  } else {
    html = `<div class="sn-org-textbox" style="max-height: 60px; height: fit-content; position: relative; top: 50%; transform: translate(0, -50%);">`;
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
  //let newCardHeight = constants.cardHeight;
  let newCardHeight = [undefined, 'left', 'right'].includes(cardStyling.alignment) || cardStyling.location === 'tooltip' ? constants.cardHeight : constants.cardHeightLarge;
  const flex = attributes.image && cardStyling.location !== 'tooltip'? [undefined, 'left', 'right'].includes(cardStyling.alignment) ? 'display: flex; flex-direction: row;' : 'display: flex; flex-direction: column;"' : 'display: flex;';
  if (isSelected) {
    newCardHeight -= 8;
  } else if (fullBorder) {
    newCardHeight -= 4;
  } else if (top) {
    newCardHeight -= 3;
  }
  //return `<div class="sn-org-card-text${selectedClass}" style="background-color:${backgroundColor};color:${fontColor}; border:${borderStyle}; border-top:${topBorder}; height:${newCardHeight}px;">${html}</div>`;
  //const htmlOutput = `<div class="sn-org-card-text${selectedClass}" style="background-color:${backgroundColor};color:${fontColor}; border:${borderStyle}; border-top:${topBorder}; height:${newCardHeight}px;${flex}">${html}</div></div>`;
  //console.log(htmlOutput);
  return `<div class="sn-org-card-text${selectedClass}" style="background-color:${backgroundColor};color:${fontColor}; border:${borderStyle}; border-top:${topBorder}; height:${newCardHeight}px;${flex}">${html}</div></div>`;
};