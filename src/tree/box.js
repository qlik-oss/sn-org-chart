import card from '../card/card';

export default function box(divBox, o, nodeSize, appendNodes, reRender) {
  function getStyle(p) {
    return `width:${nodeSize.width}px;height:${nodeSize.height}px; top:${o.y(p)}px;left:${o.x(p)}px`;
  }

  divBox
    .selectAll('.node')
    .data(appendNodes)
    .enter()
    .append('div')
    .attr('class', 'nodeRect')
    .attr('style', getStyle)
    .attr('id', (d) => d.data.id)
    .on('click', (node) => {
      if (node.children) {
        reRender(node.data.id);
      }
    })
    .html((d) => card(d.data));
}
