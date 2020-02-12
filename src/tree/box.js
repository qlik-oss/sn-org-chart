import card from '../card/card';

export default function box(divBox, tooltip, o, appendNodes, cardStyling, reRender) {
  function getStyle(p) {
    if (p.data.id === 'Root') {
      return `top:${o.y(p) + 80}px;left:${o.x(p) + 140}px`;
    }
    return `width:${o.nodeSize.width}px;height:${o.nodeSize.height}px; top:${o.y(p)}px;left:${o.x(p)}px;`;
  }

  function getTooltipStyle(p) {
    return `top:${o.y(p) - o.nodeSize.height}px;left:${o.x(p) + o.nodeSize.width / 3}px;visibility: visible;opacity: 0.9;`;
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
    .html(d => card(d.data, cardStyling))
    .on('mouseover', d => {
      tooltip
        .html(`${d.data.attributes.label || ''}<br />${d.data.attributes.subLabel || ''}<br />${d.data.attributes.extraLabel || ''}<br />${d.data.measure || ''}`)
        .attr('style', () => getTooltipStyle(d));
    })
    .on('mouseout', () => {
      tooltip
        .html('')
        .attr('style', 'visibility: hidden;opacity: 0;');
    });
}
