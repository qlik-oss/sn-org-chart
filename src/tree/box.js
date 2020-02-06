import card from '../card/card';
import selections from '../utils/selections';
import { haveNoChildren } from '../utils/tree-utils';

export const getSign = (d, { top, isExpanded, expandedChildren }) => {
  if ((d === top && isExpanded) ||
    (d.parent === top && expandedChildren.includes(d))) { // top
    return '-';
  }

  return '+';
};

export default function box(divBox, o, nodes, cardStyling, expandedState, setStateCallback, selectionsAPI) {
  let { top, isExpanded, expandedChildren } = expandedState;
  function getStyle(p) {
    if (p.data.id === 'Root') {
      return `top:${o.y(p) + 80}px;left:${o.x(p) + 140}px`;
    }
    return `width:${o.nodeSize.width}px;height:${o.nodeSize.height}px; top:${o.y(p)}px;left:${o.x(p)}px;`;
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
      if (node.data.id !== 'Root') {
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
    .attr('style', d => `width:52px;height:24px;top:${o.y(d) + 72}px;left:${o.x(d) + 50}px;`)
    .attr('id', d => `${d.data.id}-traverse`)
    .on('click', d => {
      if (d === top) { // top
        isExpanded = !isExpanded;
        expandedChildren = [];
      } else if (d.parent === top) { // children
        if (expandedChildren.includes(d)) {
          // Collapse if already exists in expandedChildren
          expandedChildren.splice(expandedChildren.indexOf(d), 1);
        } else if (d.parent.children.findIndex(sibling => !haveNoChildren(sibling.children)) === -1) {
          // Add this as expanded if possible
          expandedChildren.push(d);
        } else {
          // Replace expanded with this one
          expandedChildren = [d];
        }
      } else { // grand children
        top = d.parent;
        isExpanded = true;
        expandedChildren = [d];
      }

      setStateCallback({ top, isExpanded, expandedChildren });
    })
    .html(d => `<div class="org-traverse"> ${getSign(d, expandedState)} ${d.data.children.length}</div>`);

  // go up
  divBox
    .selectAll('.node')
    .data(nodes.filter(node => (node === top && node.parent)))
    .enter()
    .append('div')
    .attr('class', 'node-rect')
    .attr('style', d => `width:52px;height:24px;top:${o.y(d) - 40}px;left:${o.x(d) + 50}px;`)
    .attr('id', d => `${d.data.id}-traverse`)
    .on('click', d => {
      top = d.parent;
      isExpanded = true;
      expandedChildren = [d];
      setStateCallback({ top, isExpanded, expandedChildren });
    })
    .html('<div class="org-traverse">UP</div>');
}
