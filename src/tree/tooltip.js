import { select } from "d3";
import encodeUtils from "../utils/encoder";
import constants from "./size-constants";

export function createTooltip(element) {
  const tooltip = select(element)
    .append("div")
    .attr("class", "sn-org-tooltip")
    .on("mousedown", () => {
      tooltip.classed("sn-org-tooltip-visible", false);
    });
  return tooltip;
}

export function getTooltipStyle(d, containerHeight, x, y, transform) {
  const { cardWidth, tooltipPadding } = constants;
  const halfCardWidth = cardWidth / 2;
  const yLocation = containerHeight - (y(d) * transform.zoom + transform.y - tooltipPadding);
  const xLocation = x(d) * transform.zoom + transform.x + halfCardWidth * transform.zoom;
  return `bottom:${yLocation}px;left:${xLocation}px;`;
}

export function getTooltipContent(d, styling) {
  const label = encodeUtils.encodeTitle(d.data.attributes.label || d.data.id);
  const subLabel = d.data.attributes.subLabel ? `${encodeUtils.encodeTitle(d.data.attributes.subLabel)}<br />` : "";
  const extraLabel = d.data.attributes.extraLabel
    ? `${encodeUtils.encodeTitle(d.data.attributes.extraLabel)}<br />`
    : "";
  const measure = encodeUtils.encodeTitle(
    d.data.measure ? `${styling.measureLabel ? `${styling.measureLabel}: ` : ""}${d.data.measure}` : "",
  );
  return `<div class="sn-org-tooltip-inner"><div class="sn-org-tooltip-header">${label}</div>${subLabel}${extraLabel}${measure}</div>`;
}

export function openTooltip(tooltip, d, containerHeight, styling, x, y, transform, delay = 250) {
  tooltip.active = true;
  tooltip.timeout = setTimeout(() => {
    if (tooltip.active) {
      tooltip
        .html(getTooltipContent(d, styling))
        .classed("sn-org-tooltip-visible", true)
        .attr("style", () => getTooltipStyle(d, containerHeight, x, y, transform));
    }
  }, delay);
}

export function closeTooltip(tooltip) {
  clearTimeout(tooltip.timeout);
  tooltip.active = false;
  tooltip.classed("sn-org-tooltip-visible", false);
}
