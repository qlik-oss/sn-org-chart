import { event } from 'd3';
// import { isParentOf } from '../utils/tree-utils';
import card from '../card/card';

export default function box(divBox, o, appendNodes, cardStyling, activeNode, setActiveCallback) {
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
        // const isTopNode = isParentOf(d.data, activeNode.id);
        const isExpanded = activeNode.id === d.data.id ? !activeNode.isExpanded : true;
        setActiveCallback({ id: d.data.id, isExpanded });
      }
    })
    .html(d => card(d.data, cardStyling, activeNode));
}
