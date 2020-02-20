import { select } from 'd3';
import constants from './size-constants';

export function createTooltip(element) {
  const tooltip = select(element)
    .selectAll('.sn-org-tooltip')
    .data([{}])
    .enter()
    .append('div')
    .attr('class', 'sn-org-tooltip')
    .on('mousedown', () => {
      tooltip.html('').attr('style', 'visibility: hidden;opacity: 0;');
    });
  return tooltip;
}

export function getTooltipStyle(d, containerHeight, x, y, sel) {
  const { cardWidth, tooltipWidth, tooltipPadding } = constants;
  const halfCardWidth = cardWidth / 2;
  const halfTooltipWidth = tooltipWidth / 2;
  const yLocation = containerHeight - (y(d) * sel.transform.zoom + sel.transform.y - tooltipPadding);
  const xLocation =
    x(d) * sel.transform.zoom + sel.transform.x - (halfTooltipWidth - halfCardWidth * sel.transform.zoom);
  return `bottom: ${yLocation}px;left: ${xLocation}px;visibility: visible;opacity: 0.9;`;
}

export function openTooltip(tooltip, d, containerHeight, cardStyling, x, y, sel) {
  const label = d.data.attributes.label || d.data.id;
  const subLabel = d.data.attributes.subLabel ? `${d.data.attributes.subLabel}<br />` : '';
  const extraLabel = d.data.attributes.extraLabel ? `${d.data.attributes.extraLabel}<br />` : '';
  const measure = d.data.measure
    ? `${cardStyling.measureLabel ? `${cardStyling.measureLabel}: ` : ''}${d.data.measure}`
    : '';
  tooltip.active = true;
  tooltip.timeout = setTimeout(() => {
    if (tooltip.active) {
      tooltip
        .html(`${label}<br />${subLabel}${extraLabel}${measure}`)
        .attr('style', () => getTooltipStyle(d, containerHeight, x, y, sel));
    }
  }, 250);
}

export function closeTooltip(tooltip) {
  clearTimeout(tooltip.timeout);
  tooltip.active = false;
  tooltip.attr('style', 'visibility: hidden;opacity: 0;');
}
