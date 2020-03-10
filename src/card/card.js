import colorUtils from '../utils/color-utils';
import constants from '../tree/size-constants';

export function getBackgroundColor(data, cardStyling) {
  let color = cardStyling.backgroundColor;
  if (data.attributes && data.attributes.color) {
    const resolvedColor = colorUtils.resolveExpression(data.attributes.color);
    color = resolvedColor !== 'none' ? resolvedColor : color;
  }
  return color;
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
  const topColor = colorUtils.getDarkColor(backgroundColor);
  const fontColor = getFontColor(cardStyling, backgroundColor);
  const attributes = data.attributes || {};
  let html = `<div class="sn-org-card-title">${attributes.label || data.id}</div>`;
  if (attributes.subLabel) {
    html += `<div class="sn-org-card-label">${attributes.subLabel}</div>`;
  }
  if (data.measure) {
    const measureLabel = cardStyling.measureLabel ? `${cardStyling.measureLabel}: ` : '';
    html += `<div class="sn-org-card-label">${measureLabel}${data.measure}</div>`;
  } else if (attributes.extraLabel) {
    html += `<div class="sn-org-card-label">${attributes.extraLabel}</div>`;
  }
  const selectedClass = api && api.isActive() ? (isSelected ? ' selected' : ' not-selected') : '';

  const { show = 'top' } = cardStyling.border;
  const topBorder = show !== 'none' && !isSelected ? `3px solid ${topColor}` : '';
  const borderStyle = show === 'all' && !isSelected ? `1px solid ${topColor}` : '';
  const { cardHeight } = constants;
  let newCardHeight = cardHeight;
  if (isSelected) {
    newCardHeight -= 8;
  } else if (show === 'all') {
    newCardHeight -= 4;
  } else if (show === 'top') {
    newCardHeight -= 3;
  }
  return `<div class="sn-org-card-text${selectedClass}" style="background-color:${backgroundColor};color:${fontColor}; border:${borderStyle}; border-top:${topBorder}; height:${newCardHeight}px;">${html}</div>`;
};
