import card from '../card/card';
import selections from '../utils/selections';
import { haveNoChildren } from '../utils/tree-utils';
import constants from './size-constants';

export const getSign = (d, { topId, isExpanded, expandedChildren }) => {
  if (
    (d.data.id === topId && isExpanded) ||
    (d.parent && d.parent.data.id === topId && expandedChildren.includes(d.data.id))
  ) {
    return '-';
  }

  return '+';
};

export const getNewState = (d, { topId, isExpanded, expandedChildren }) => {
  if (d.data.id === topId) {
    // top
    isExpanded = !isExpanded;
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
  nodes,
  cardStyling,
  expandedState,
  setStateCallback,
  selectionsAPI,
  allowInteractions
) {
  const { cardWidth, cardHeight, buttonWidth, buttonHeight, buttonMargin, rootDiameter } = constants;
  const { topId, isExpanded } = expandedState;
  function getStyle(d) {
    if (d.data.id === 'Root') {
      return `top:${y(d) + cardHeight - rootDiameter}px;left:${x(d) + (cardWidth - rootDiameter) / 2}px`;
    }
    return `width:${cardWidth}px;height:${cardHeight}px; top:${y(d)}px;left:${x(d)}px;`;
  }

  // cards
  divBox
    .selectAll('.node')
    .data(nodes)
    .enter()
    .append('div')
    .attr('class', 'node-rect')
    .attr('style', getStyle)
    .attr('id', d => d.data.id)
    .on('click', node => {
      if (allowInteractions && node.data.id !== 'Root') {
        selections.select(node, selectionsAPI);
      }
    })
    .html(d => card(d.data, cardStyling, selectionsAPI));

  // expand/collapse
  divBox
    .selectAll('.node')
    .data(nodes.filter(node => !!node.children))
    .enter()
    .append('div')
    .attr('class', 'node-rect')
    .attr(
      'style',
      d =>
        `width:${buttonWidth}px;height:${buttonHeight}px;top:${y(d) + cardHeight + buttonMargin}px;left:${x(d) +
          (cardWidth - buttonWidth) / 2}px;`
    )
    .attr('id', d => `${d.data.id}-expand`)
    .on('click', d => {
      if (allowInteractions) {
        setStateCallback(getNewState(d, expandedState));
      }
    })
    .html(d => `<div class="org-traverse"> ${getSign(d, expandedState)} ${d.data.children.length}</div>`);

  // go up
  divBox
    .selectAll('.node')
    .data(nodes.filter(node => node.data.id === topId && node.parent))
    .enter()
    .append('div')
    .attr('class', 'node-rect')
    .attr(
      'style',
      d =>
        `width:${buttonWidth}px;height:${buttonHeight}px;top:${y(d) - buttonHeight - buttonMargin}px;left:${x(d) +
          (cardWidth - buttonWidth) / 2}px;`
    )
    .attr('id', d => `${d.data.id}-up`)
    .on('click', d => {
      if (allowInteractions) {
        setStateCallback(getNewUpState(d, isExpanded));
      }
    })
    .html('<div class="org-traverse">↑</div>');
}
