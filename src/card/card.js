import colorUtils from '../utils/color-utils';
import encodeUtils from '../utils/encoder';
import constants from '../tree/size-constants';

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
    return colorUtils.isDarkColor(backgroundColor) ? '#e6e6e6' : '#484848';
  }
  return cardStyling.fontColor;
}

export default (data, cardStyling, selectionObj) => {
  const { api, state } = selectionObj;
  const isSelected = api && api.isActive() && state.indexOf(data.elemNo) !== -1;
  const backgroundColor = getBackgroundColor(data, cardStyling);
  const fontColor = resolveColor(getFontColor(cardStyling, backgroundColor));
  const attributes = data.attributes || {};
  let html = `<div class="sn-org-card-title">${encodeUtils.encodeTitle(attributes.label || data.id)}</div>`;
  if (attributes.subLabel) {
    html += `<div class="sn-org-card-label">${encodeUtils.encodeTitle(attributes.subLabel)}</div>`;
  }
  if (data.measure) {
    const measureLabel = cardStyling.measureLabel ? `${cardStyling.measureLabel}: ` : '';
    html += `<div class="sn-org-card-label">${encodeUtils.encodeTitle(measureLabel + data.measure)}</div>`;
  } else if (attributes.extraLabel) {
    html += `<div class="sn-org-card-label">${encodeUtils.encodeTitle(attributes.extraLabel)}</div>`;
  }
  const selectedClass = api && api.isActive() ? (isSelected ? ' selected' : ' not-selected') : '';

  const { top = true, fullBorder, colorType = 'auto' } = cardStyling.border;
  const borderColor =
    colorType === 'auto' ? colorUtils.getDarkColor(backgroundColor) : resolveColor(cardStyling.borderColor);

  const topBorder = top && !isSelected ? `3px solid ${borderColor}` : '';
  const borderStyle = fullBorder && !isSelected ? `1px solid ${borderColor}` : '';
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
