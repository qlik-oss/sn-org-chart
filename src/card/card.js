import colorUtils from '../utils/color-utils';
import encodeUtils from '../utils/encoder';
import constants from '../tree/size-constants';
import DEFAULTS from '../style-defaults';

export function resolveColor(color) {
  const resolvedColor = colorUtils.resolveExpression(color);
  return resolvedColor !== 'none' ? resolvedColor : encodeUtils.encodeCssColor(color);
}

export function getBackgroundColor(data, cardStyling) {
  if (data.attributes && data.attributes.color) {
    const resolvedColor = colorUtils.resolveExpression(data.attributes.color);
    if (resolvedColor !== 'none') {
      return resolvedColor;
    }
  }
  return resolveColor(cardStyling.backgroundColor);
}

export function getFontColor(cardStyling, backgroundColor) {
  if (cardStyling.fontColor === 'default') {
    return colorUtils.isDarkColor(backgroundColor) ? DEFAULTS.FONT_COLOR_LIGHT.color : DEFAULTS.FONT_COLOR_DARK.color;
  }
  return cardStyling.fontColor;
}

export default (data, cardStyling, selectionObj) => {
  const { api, state } = selectionObj;
  const isSelected = api && api.isActive() && state.indexOf(data.elemNo) !== -1;
  const backgroundColor = getBackgroundColor(data, cardStyling);
  const fontColor = resolveColor(getFontColor(cardStyling, backgroundColor));
  const attributes = data.attributes || {};
  let html = '';
  if (attributes.image) {
    let textBoxCss = [undefined, 'left', 'right'].includes(cardStyling.alignment) ? 'width: 85px;' : '';
    textBoxCss += [undefined, 'left', 'right'].includes(cardStyling.alignment) && `padding-${cardStyling.alignment}: 5px`;
    let textBox = `<div class="sn-org-textbox" style="${cardStyling.location === 'tooltip' ? '' : textBoxCss}">`;
    textBox += `<div class="sn-org-card-title">${encodeUtils.encodeTitle(attributes.label || data.id)}</div>`;
    if (attributes.subLabel) {
      textBox += `<div class="sn-org-card-label">${encodeUtils.encodeTitle(attributes.subLabel)}</div>`;
    }
    if (cardStyling.location !== 'tooltip') {
      const order = cardStyling.alignment === undefined || ['top', 'left'].includes(cardStyling.alignment) ? 0 : 2;
      const height = [undefined, 'left', 'right'].includes(cardStyling.alignment) ? ' height: 50px' : '';
      html += `<img src="${attributes.image}" class="sn-org-card-image" style="order: ${order};${height}" />`;
    }
    if (data.measure) {
      const measureLabel = cardStyling.measureLabel ? `${cardStyling.measureLabel}: ` : '';
      textBox += `<div class="sn-org-card-label">${encodeUtils.encodeTitle(measureLabel + data.measure)}</div>`;
    } else if (attributes.extraLabel) {
      textBox += `<div class="sn-org-card-label">${encodeUtils.encodeTitle(attributes.extraLabel)}</div>`;
    }
    html += textBox;
  } else {
    html = `<div class="sn-org-card-title">${encodeUtils.encodeTitle(attributes.label || data.id)}</div>`;
    if (attributes.subLabel) {
      html += `<div class="sn-org-card-label">${encodeUtils.encodeTitle(attributes.subLabel)}</div>`;
    }
    if (data.measure) {
      const measureLabel = cardStyling.measureLabel ? `${cardStyling.measureLabel}: ` : '';
      html += `<div class="sn-org-card-label">${encodeUtils.encodeTitle(measureLabel + data.measure)}</div>`;
    } else if (attributes.extraLabel) {
      html += `<div class="sn-org-card-label">${encodeUtils.encodeTitle(attributes.extraLabel)}</div>`;
    }
  }
  const selectedClass = api && api.isActive() ? (isSelected ? ' selected' : ' not-selected') : '';

  const { top = DEFAULTS.BORDER_TOP, fullBorder = DEFAULTS.BORDER_FULL, colorType = DEFAULTS.BORDER_COLOR_TYPE } = cardStyling.border;
  const borderColor =
    colorType === 'auto' ? colorUtils.getDarkColor(backgroundColor) : resolveColor(cardStyling.borderColor);

  const topBorder = top && !isSelected ? `3px solid ${borderColor}` : '';
  const borderStyle = fullBorder && !isSelected ? `1px solid ${borderColor}` : '';
  let newCardHeight = [undefined, 'left', 'right'].includes(cardStyling.alignment) ? constants.cardHeight : constants.cardHeightLarge;
  const flex = attributes.image ? [undefined, 'left', 'right'].includes(cardStyling.alignment) ? 'display: flex; flex-direction: row;"' : 'display: flex; flex-direction: column;"' : '';
  if (isSelected) {
    newCardHeight -= 8;
  } else if (fullBorder) {
    newCardHeight -= 4;
  } else if (top) {
    newCardHeight -= 3;
  }
  return `<div class="sn-org-card-text${selectedClass}" style="background-color:${backgroundColor};color:${fontColor}; border:${borderStyle}; border-top:${topBorder}; height:${newCardHeight}px;${flex}">${html}</div>`;
};
