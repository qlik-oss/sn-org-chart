import { select } from 'd3';
import constants from './size-constants';

export function createTooltip(element) {
  const tooltip = select(element)
    .append('div')
    .attr('class', 'sn-org-tooltip')
    .on('mousedown', () => {
      tooltip.classed('sn-org-tooltip-visible', false);
    });
  return tooltip;
}

export function getTooltipStyle(d, containerHeight, x, y, sel) {
  const { cardWidth, tooltipPadding } = constants;
  const halfCardWidth = cardWidth / 2;
  const yLocation = containerHeight - (y(d) * sel.transform.zoom + sel.transform.y - tooltipPadding);
  const xLocation = x(d) * sel.transform.zoom + sel.transform.x + halfCardWidth * sel.transform.zoom;
  return `bottom:${yLocation}px;left:${xLocation}px;`;
}

export function getTooltipContent(d, cardStyling) {
  const label = d.data.attributes.label || d.data.id;
  const subLabel = d.data.attributes.subLabel ? `${d.data.attributes.subLabel}<br />` : '';
  const extraLabel = d.data.attributes.extraLabel ? `${d.data.attributes.extraLabel}<br />` : '';
  const measure = d.data.measure
    ? `${cardStyling.measureLabel ? `${cardStyling.measureLabel}: ` : ''}${d.data.measure}`
    : '';
  return `<div class="sn-org-tooltip-inner"><div class="sn-org-tooltip-header">${label}</div>${subLabel}${extraLabel}${measure}</div>`;
}

export function openTooltip(tooltip, d, containerHeight, cardStyling, x, y, sel, delay = 250) {
  tooltip.active = true;
  tooltip.timeout = setTimeout(() => {
    if (tooltip.active) {
      tooltip
        .html(getTooltipContent(d, cardStyling))
        .classed('sn-org-tooltip-visible', true)
        .attr('style', () => getTooltipStyle(d, containerHeight, x, y, sel));
    }
  }, delay);
}

export function closeTooltip(tooltip) {
  clearTimeout(tooltip.timeout);
  tooltip.active = false;
  tooltip.classed('sn-org-tooltip-visible', false);
}
