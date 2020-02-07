import card from '../card/card';
import selections from '../utils/selections';
import { haveNoChildren } from '../utils/tree-utils';

export const getSign = (d, { topId, isExpanded, expandedChildren }) => {
  if (
    (d.data.id === topId && isExpanded) ||
    (d.parent && d.parent.data.id === topId && expandedChildren.includes(d.data.id))
  ) {
    // top
    return '-';
  }

  return '+';
};

export default function box(divBox, o, nodes, cardStyling, expandedState, setStateCallback, selectionsAPI) {
  let { topId, isExpanded, expandedChildren } = expandedState;
  function getStyle(p) {
    if (p.data.id === 'Root') {
      return `top:${o.y(p) + 17}px;left:${o.x(p) + 66}px`;
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
      if (d.data.id === topId) {
        // top
        isExpanded = !isExpanded;
        expandedChildren = [];
      } else if (d.parent.data.id === topId) {
        // children
        if (expandedChildren.includes(d.data.id)) {
          // Collapse if already exists in expandedChildren
          expandedChildren.splice(expandedChildren.indexOf(d.data.id), 1);
        } else if (
          // change this, think it works?
          // haveNoChildren(d.children) &&
          d.parent.children
            // .filter(n => expandedChildren.indexOf(n.data.id) !== -1)
            .every(n => haveNoChildren(n.children))
        ) {
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

      setStateCallback({ topId, isExpanded, expandedChildren });
    })
    .html(d => `<div class="org-traverse"> ${getSign(d, expandedState)} ${d.data.children.length}</div>`);

  // go up
  divBox
    .selectAll('.node')
    .data(nodes.filter(node => node.data.id === topId && node.parent))
    .enter()
    .append('div')
    .attr('class', 'node-rect')
    .attr('style', d => `width:52px;height:24px;top:${o.y(d) - 40}px;left:${o.x(d) + 50}px;`)
    .attr('id', d => `${d.data.id}-traverse`)
    .on('click', d => {
      topId = d.parent.data.id;
      isExpanded = true;
      expandedChildren = [d.data.id];
      setStateCallback({ topId, isExpanded, expandedChildren });
    })
    .html('<div class="org-traverse">↑</div>');
}
