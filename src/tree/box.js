import card from '../card/card';

export default function box({ divBox, o, appendNodes, reRender, cardStyling }) {
  function getStyle(p) {
    return `width:${o.nodeSize.width}px;height:${o.nodeSize.height}px; top:${o.y(p)}px;left:${o.x(
      p
    )}px;background-color:${cardStyling.backgroundColor || '#e6e6e6'};text-align:center;`;
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
