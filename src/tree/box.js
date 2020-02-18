import card from '../card/card';
import selections from '../utils/selections';
import { haveNoChildren } from '../utils/tree-utils';
import constants from './size-constants';

export const getSign = (d, { topId, isExpanded, expandedChildren }, ancestorIds) => {
  if (
    (d.data.id === topId && isExpanded) ||
    (d.parent && d.parent.data.id === topId && expandedChildren.includes(d.data.id)) ||
    ancestorIds.includes(d.data.id)
  ) {
    return '-';
  }

  return '+';
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
      .filter(sibling => expandedChildren.includes(sibling.data.id))
      .every(n => haveNoChildren(n.children));
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

export default function box(
  { x, y },
  divBox,
  tooltip,
  nodes,
  cardStyling,
  expandedState,
  setStateCallback,
  selectionState,
  selectionsAndTransform,
  navigationMode,
  element
) {
  const {
    cardWidth,
    cardHeight,
    buttonWidth,
    buttonHeight,
    cardPadding,
    rootDiameter,
    tooltipWidth,
    tooltipPadding,
  } = constants;
  const { topId, isExpanded } = expandedState;
  const topNode = nodes.find(node => node.data.id === topId);
  const ancestorIds = topNode && topNode.parent ? topNode.parent.ancestors().map(anc => anc.data.id) : [];
  let tooltipOpen = -1;
  let tooltipClose = -1;

  // dummy root
  divBox
    .selectAll('.sn-org-nodes')
    .data(nodes.filter(node => node.parent && node.parent.data.id === 'Root'))
    .enter()
    .append('div')
    .attr('class', 'sn-org-root')
    .attr('style', d => `top:${y(d) - rootDiameter - cardPadding}px;left:${x(d) + (cardWidth - rootDiameter) / 2}px`)
    .attr('id', d => d.data.id);

  function getTooltipStyle(d) {
    const halfCardWidth = cardWidth / 2;
    const halfTooltipWidth = tooltipWidth / 2;
    return `bottom:${element.clientHeight -
      (y(d) * selectionsAndTransform.transform.zoom + selectionsAndTransform.transform.y - tooltipPadding)}px;left:${x(
      d
    ) *
      selectionsAndTransform.transform.zoom +
      selectionsAndTransform.transform.x -
      (halfTooltipWidth - halfCardWidth * selectionsAndTransform.transform.zoom)}px;visibility: visible;opacity: 0.9;`;
  }

  // cards
  divBox
    .selectAll('.sn-org-nodes')
    .data(nodes.filter(node => node.data.id !== 'Root'))
    .enter()
    .append('div')
    .attr('class', 'sn-org-card')
    .attr('style', d => `width:${cardWidth}px;height:${cardHeight}px; top:${y(d)}px;left:${x(d)}px;`)
    .attr('id', d => d.data.id)
    .on('click', node => {
      if (!selectionsAndTransform.constraints.active && node.data.id !== 'Root') {
        selections.select(node, selectionsAndTransform, selectionState);
      }
    })
    .html(d => card(d.data, cardStyling, selectionsAndTransform, selectionState))
    .on('mouseenter', d => {
      if (!selectionsAndTransform.constraints.passive && tooltipOpen === -1 && event.buttons === 0) {
        tooltipOpen = setTimeout(() => {
          tooltip
            .html(
              `${d.data.attributes.label || d.data.id}<br />${
                d.data.attributes.subLabel ? `${d.data.attributes.subLabel}<br />` : ''
              }${d.data.attributes.extraLabel ? `${d.data.attributes.extraLabel}<br />` : ''}${d.data.measure || ''}`
            )
            .attr('style', () => getTooltipStyle(d));
          tooltipOpen = -1;
        }, 250);
        tooltipClose = setTimeout(() => {
          tooltip.html('').attr('style', 'visibility: hidden;opacity: 0;');
        }, 7000);
      }
    })
    .on('mouseleave', () => {
      clearTimeout(tooltipOpen);
      tooltipOpen = -1;
      clearTimeout(tooltipClose);
      tooltip.html('').attr('style', 'visibility: hidden;opacity: 0;');
    })
    .on('mousedown', () => {
      clearTimeout(tooltipOpen);
      tooltipOpen = -1;
      clearTimeout(tooltipClose);
      tooltip.html('').attr('style', 'visibility: hidden;opacity: 0;');
    });

  // expand/collapse
  divBox
    .selectAll('.sn-org-nodes')
    .data(nodes.filter(node => !!node.children && node.data.id !== 'Root'))
    .enter()
    .append('div')
    .attr('class', 'sn-org-traverse')
    .attr(
      'style',
      d =>
        `width:${buttonWidth}px;height:${buttonHeight}px;top:${y(d) + cardHeight + cardPadding}px;left:${x(d) +
          (cardWidth - buttonWidth) / 2}px;`
    )
    .attr('id', d => `${d.data.id}-expand`)
    .on('mouseenter', () => {
      if (!selectionsAndTransform.constraints.active) event.target.style.cursor = 'pointer';
    })
    .on('click', d => {
      if (!selectionsAndTransform.constraints.active) {
        setStateCallback(getNewState(d, expandedState, ancestorIds));
      }
    })
    .html(d => `${getSign(d, expandedState, ancestorIds)} ${d.data.children.length}`);

  // go up
  if (navigationMode !== 'free') {
    divBox
      .selectAll('.sn-org-nodes')
      .data(nodes.filter(node => node.data.id === topId && node.parent))
      .enter()
      .append('div')
      .attr('class', 'sn-org-traverse')
      .attr(
        'style',
        d =>
          `width:${buttonWidth}px;height:${buttonHeight}px;top:${y(d) - buttonHeight - cardPadding}px;left:${x(d) +
            (cardWidth - buttonWidth) / 2}px;`
      )
      .attr('id', d => `${d.data.id}-up`)
      .on('click', d => {
        if (!selectionsAndTransform.constraints.active) {
          setStateCallback(getNewUpState(d, isExpanded));
        }
      })
      .html('↑');
  }
}
