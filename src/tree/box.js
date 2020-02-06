import card from '../card/card';
import selections from '../utils/selections';

export default function box(divBox, o, appendNodes, cardStyling, selectionsAPI) {
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
    .on('click', node => {
      if (node.data.id !== 'Root') {
        selections.select(node, selectionsAPI);
      }
    })
    .html(d => card(d.data, cardStyling, selectionsAPI));
}
