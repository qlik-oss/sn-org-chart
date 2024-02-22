/* eslint-disable no-undef */
import card from "../card/card";
import selections from "../utils/selections";
import { haveNoChildren } from "../utils/tree-utils";
import constants from "./size-constants";
import { closeTooltip, openTooltip } from "./tooltip";

export const getSign = (d, { topId, isExpanded, expandedChildren }, ancestorIds) => {
  if (
    (d.data.id === topId && isExpanded) ||
    (d.parent && d.parent.data.id === topId && expandedChildren.includes(d.data.id)) ||
    ancestorIds.includes(d.data.id)
  ) {
    return "-";
  }

  return "+";
};

export const getNewState = (d, { topId, isExpanded, expandedChildren }, ancestorIds) => {
  if (d.data.id === topId) {
    // top
    isExpanded = !isExpanded;
    expandedChildren = [];
  } else if (ancestorIds.includes(d.data.id)) {
    // ancestors
    topId = d.parent ? d.parent.data.id : d.data.id;
    isExpanded = !!d.parent;
    expandedChildren = [];
  } else if (d.parent.data.id === topId) {
    // children
    const expandedHaveNoChildren = d.parent.children
      .filter((sibling) => expandedChildren.includes(sibling.data.id))
      .every((n) => haveNoChildren(n.children));
    if (expandedChildren.includes(d.data.id)) {
      // Collapse if already exists in expandedChildren
      expandedChildren.splice(expandedChildren.indexOf(d.data.id), 1);
    } else if (haveNoChildren(d.children) && expandedHaveNoChildren) {
      // Add this node as expanded if possible
      expandedChildren.push(d.data.id);
    } else {
      // Replace expanded with this node
      expandedChildren = [d.data.id];
    }
  } else {
    // grand children
    topId = d.parent.data.id;
    isExpanded = true;
    expandedChildren = [d.data.id];
  }

  return { topId, isExpanded, expandedChildren };
};

export const getNewUpState = (d, isExpanded) => ({
  topId: d.parent.data.id,
  expandedChildren: isExpanded ? [d.data.id] : [],
  isExpanded: true,
});

export default function box({
  positioning,
  divBox,
  nodes,
  styling,
  setExpandedCallback,
  wrapperState,
  selectionObj,
  navigationMode,
  element,
  tooltip,
}) {
  const { x, y } = positioning;
  const { cardWidth, cardHeight, cardHeightLarge, buttonWidth, buttonHeight, cardPadding, rootDiameter } = constants;
  const { topId } = wrapperState.expandedState;
  const topNode = nodes.find((node) => node.data.id === topId);
  const ancestorIds = topNode && topNode.parent ? topNode.parent.ancestors().map((anc) => anc.data.id) : [];
  const touchmode = document.getElementsByTagName("html")[0].classList.contains("touch-on");
  // dummy root
  divBox
    .selectAll(".sn-org-nodes")
    .data(nodes.filter((node) => node.parent && node.parent.data.id === "Root"))
    .enter()
    .append("div")
    .attr("class", "sn-org-root")
    .attr("style", (d) => `top:${y(d) - rootDiameter - cardPadding}px;left:${x(d) + (cardWidth - rootDiameter) / 2}px`)
    .attr("id", (d) => d.data.id);

  // cards
  divBox
    .selectAll(".sn-org-nodes")
    .data(nodes.filter((node) => node.data.id !== "Root"))
    .enter()
    .append("div")
    .attr("class", "sn-org-card")
    //.attr('style', (d) => `width:${cardWidth}px;height:${[undefined, 'left', 'right'].includes(styling.alignment) ? cardHeight : cardHeightLarge}px; top:${y(d)}px;left:${x(d)}px;`)
    .attr('style', (d) => `width:${cardWidth}px;height:${[undefined, 'left', 'right'].includes(styling.alignment) || styling.location === 'tooltip' ? cardHeight : cardHeightLarge}px; top:${y(d)}px;left:${x(d)}px;`)
    .attr("id", (d) => d.data.id)
    .on("click", (event, node) => {
      if (!wrapperState.constraints.active && node.data.id !== "Root") {
        touchmode && openTooltip(tooltip, node, element.clientHeight, styling, x, y, wrapperState.transform, 0);
        selections.select(node, selectionObj);
      }
    })
    .html((d) => card(d.data, styling, selectionObj))
    .on("mouseenter", (event, d) => {
      if (!touchmode && !wrapperState.constraints.active && event.buttons === 0) {
        openTooltip(tooltip, d, element.clientHeight, styling, x, y, wrapperState.transform);
      }
    })
    .on("mouseleave", () => {
      !touchmode && closeTooltip(tooltip);
    })
    .on("mousedown", () => {
      closeTooltip(tooltip);
    })
    .on("touchmove", () => {
      closeTooltip(tooltip);
    })
    .on("wheel", () => {
      closeTooltip(tooltip);
    });

  // expand/collapse
  if (navigationMode !== "expandAll") {
    divBox
      .selectAll(".sn-org-nodes")
      .data(nodes.filter((node) => !!node.children && node.data.id !== "Root"))
      .enter()
      .append("div")
      .attr("class", "sn-org-traverse")
      .attr(
        "style",
        (d) =>
          //`width:${buttonWidth}px;height:${buttonHeight}px;top:${y(d) + ([undefined, 'left', 'right'].includes(styling.alignment) ? cardHeight : cardHeightLarge) + cardPadding}px;left:${
          `width:${buttonWidth}px;height:${buttonHeight}px;top:${y(d) + ([undefined, 'left', 'right'].includes(styling.alignment) || styling.location === 'tooltip' ? cardHeight : cardHeightLarge) + cardPadding}px;left:${
            x(d) + (cardWidth - buttonWidth) / 2
          }px;`,
      )
      .attr("id", (d) => `${d.data.id}-expand`)
      .on("mouseenter", (event) => {
        if (!wrapperState.constraints.active) event.target.style.cursor = "pointer";
      })
      .on("click", (event, d) => {
        if (!wrapperState.constraints.active) {
          setExpandedCallback(getNewState(d, wrapperState.expandedState, ancestorIds));
          event.stopPropagation();
        }
      })
      .html((d) => `${getSign(d, wrapperState.expandedState, ancestorIds)} ${d.data.children.length}`);
  }
  // go up only necessary in page navigation mode
  // if (navigationMode !== 'free') {
  //   divBox
  //     .selectAll('.sn-org-nodes')
  //     .data(nodes.filter(node => node.data.id === topId && node.parent))
  //     .enter()
  //     .append('div')
  //     .attr('class', 'sn-org-traverse')
  //     .attr(
  //       'style',
  //       d =>
  //         `width:${buttonWidth}px;height:${buttonHeight}px;top:${y(d) - buttonHeight - cardPadding}px;left:${x(d) +
  //           (cardWidth - buttonWidth) / 2}px;`
  //     )
  //     .attr('id', d => `${d.data.id}-up`)
  //     .on('click', d => {
  //       if (!wrapperState.constraints.active) {
  //         setExpandedCallback(getNewUpState(d, isExpanded));
  //       }
  //     })
  //     .html('↑');
  // }
}
