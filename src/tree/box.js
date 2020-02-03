import card from '../card/card';

export default function box(divBox, o, appendNodes, cardStyling, reRender) {
  function getStyle(p) {
    if (p.data.id === 'Root') {
      return `top:${o.y(p) + 80}px;left:${o.x(p) + 140}px`;
    }
    return `top:${o.y(p)}px;left:${o.x(p)}px;`;
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
      if (node.children) {
        reRender(node.data.id);
      }
    })
    .html(d => card(d.data, cardStyling));
}
