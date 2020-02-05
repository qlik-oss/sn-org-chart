import colorUtils from '../utils/color-utils';

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

export default (data, cardStyling) => {
  if (data.id === 'Root') {
    return '<div class="org-root"/>';
  }

  const backgroundColor = getBackgroundColor(data, cardStyling);
  const topColor = colorUtils.getDarkColor(backgroundColor);
  const fontColor = getFontColor(cardStyling, backgroundColor);
  const attributes = data.attributes || {};
  let html = `<div class="org-card-title">${attributes.label || data.id}</div>`;
  if (attributes.subLabel) {
    html += `<div class="org-card-text">${attributes.subLabel}</div>`;
  }
  if (data.measure) {
    html += `<div class="org-card-text">${data.measure}</div>`;
  } else if (attributes.extraLabel) {
    html += `<div class="org-card-text">${attributes.extraLabel}</div>`;
  }
  html += `<div data-html="true" class="tooltip">${attributes.label || data.id}</br>${attributes.subLabel || ''}</br>${attributes.extraLabel || ''}</br>${data.measure || ''}</div>`;
  return `<div class="org-card-top" style="background-color:${topColor};"></div><div class="org-card-textarea" style="background-color:${backgroundColor};color:${fontColor};">${html}</div>`;
};
