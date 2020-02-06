import card from '../card/card';
import selections from '../utils/selections';
import { event } from 'd3';

export default function box(divBox, o, appendNodes, cardStyling, selectionsAPI) {
  function getStyle(p) {
    if (p.data.id === 'Root') {
      return `top:${o.y(p) + 80}px;left:${o.x(p) + 140}px`;
    }
    return `width:${o.nodeSize.width}px;height:${o.nodeSize.height}px; top:${o.y(p)}px;left:${o.x(p)}px;`;
  }

  function getMoreStyle(node, isRight) {
    if (!node.children || !node.data.isExpanded) {
      return 'display:none';
    }
    if (node.children.length === node.data.scrollPos + 5) {
      return 'display:none';
    }
    if (isRight) {
      const x =
        (node.data.scrollPos + 5) * (o.nodeSize.width + 100) - (node.children.length / 2) * (o.nodeSize.width + 100);
      return `width:60px;height:30px; top:130px;left:${x}px`;
    }
  }

  const node = divBox
    .selectAll('.node')
    .data(appendNodes)
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

  // should filter appendNodes down to viabler ones, then append things
  node
    .append('div')
    .attr('class', 'more')
    .attr('id', d => d.data.id)
    .attr('style', p => getMoreStyle(p, true))
    .on('click', node => {
      node.data.scrollPos += 1;
      reRender(null, node.data.scrollPos + ' ' + node.data.id);
    })
    .html('>');

  divBox;
}
