import { select } from 'd3';
import constants from './size-constants';

let tooltipOpen = -1;
let tooltipClose = -1;
let tooltip;

export function createTooltip(element) {
  tooltip = select(element)
    .selectAll('.sn-org-tooltip')
    .data([{}])
    .enter()
    .append('div')
    .attr('class', 'sn-org-tooltip')
    .on('mousedown', () => {
      tooltip
        .html('')
        .attr('style', 'visibility: hidden;opacity: 0;');
    });
}

function getTooltipStyle(d, containerHeight, x, y, sel) {
  const { cardWidth, tooltipWidth, tooltipPadding } = constants;
  const halfCardWidth = cardWidth / 2;
  const halfTooltipWidth = tooltipWidth / 2;
  const yLocation = containerHeight - ((y(d)) * sel.transform.zoom + sel.transform.y - tooltipPadding);
  const xLocation = x(d) * sel.transform.zoom + sel.transform.x - (halfTooltipWidth - (halfCardWidth * sel.transform.zoom));
  return `bottom:${yLocation}px;left:${xLocation}px;visibility: visible;opacity: 0.9;`;
}

export function openTooltip(d, containerHeight, cardStyling, x, y, sel) {
  if (tooltipOpen === -1) {
    const label = d.data.attributes.label || d.data.id;
    const subLabel = d.data.attributes.subLabel ? `${d.data.attributes.subLabel}<br />` : '';
    const extraLabel = d.data.attributes.extraLabel ? `${d.data.attributes.extraLabel}<br />` : '';
    const measure = d.data.measure ? `${cardStyling.measureLabel ? `${cardStyling.measureLabel}: ` : ''}${d.data.measure}` : '';
    tooltipOpen = setTimeout(() => {
      tooltip
        .html(`${label}<br />${subLabel}${extraLabel}${measure}`)
        .attr('style', () => getTooltipStyle(d, containerHeight, x, y, sel));
      tooltipOpen = -1;
    }, 250);
    tooltipClose = setTimeout(() => {
      tooltip
        .html('')
        .attr('style', 'visibility: hidden;opacity: 0;');
    }, 7000);
  }
}

export function closeTooltip() {
  clearTimeout(tooltipOpen);
  tooltipOpen = -1;
  clearTimeout(tooltipClose);
  tooltip
    .attr('style', 'visibility: hidden;opacity: 0;');
}
