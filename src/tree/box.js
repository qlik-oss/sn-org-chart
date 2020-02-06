import { event } from 'd3';
// import { isParentOf } from '../utils/tree-utils';
import card from '../card/card';

export default function box(divBox, o, appendNodes, cardStyling, { id, isExpanded, expandedChildren }, setStateCallback) {
  function getStyle(p) {
    if (p.data.id === 'Root') {
      return `top:${o.y(p) + 80}px;left:${o.x(p) + 140}px`;
    }
    return `width:${o.nodeSize.width}px;height:${o.nodeSize.height}px; top:${o.y(p)}px;left:${o.x(p)}px;`;
  }

  divBox
    .selectAll('.node')
    .data(appendNodes)
    .enter()
    .append('div')
    .attr('class', 'node-rect')
    .attr('style', getStyle)
    .attr('id', d => d.data.id)
    .on('click', d => {
      if (event.target.classList.contains('org-traverse')) {
        if (d.data.id === id) { // top
          isExpanded = !isExpanded;
          expandedChildren = [];
        } else if (d.parent.data.id === id) { // children
          expandedChildren = [d.data.id];
        } else { // grand children
          id = d.data.parent.id;
          isExpanded = true;
          expandedChildren = [d.data.id];
        }

        setStateCallback({ id, isExpanded, expandedChildren });
      }
    })
    .html(d => card(d.data, cardStyling));
}
