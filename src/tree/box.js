import card from '../card/card';

export default function box(divBox, o, appendNodes, cardStyling, reRender) {
  function getStyle(p) {
    if (p.data.id === 'Root') {
      return `top:${o.y(p) + 80}px;left:${o.x(p) + 140}px`;
    }
    return `width:${o.nodeSize.width}px;height:${o.nodeSize.height}px; top:${o.y(p)}px;left:${o.x(p)}px;`;
  }

  function getTooltipStyle(p) {
    if (p.data.id === 'Root') {
      return `top:${o.y(p) + 55}px;left:${o.x(p) + 140}px;visibility: visible; opacity: 1;`;
    }
    return `width:200px;height:50px; top:${o.y(p) - 25}px;left:${o.x(p)}px;visibility: visible;opacity: 1;`;
  }

  const tooltip = divBox
    .append('div')
    .attr('class', 'tooltip');

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
        .html(`${d.data.attributes.label || ''}<br />${d.data.attributes.subLabel || ''}<br />${d.data.attributes.extraLabel || ''}<br />${d.data.measure || ''}<br />`)
        .attr('style', 'visibility: visible;opacity: 1;')
        .attr('style', () => { getTooltipStyle(d); });
    })
    .on('mouseout', () => {
      tooltip
        .html('')
        .attr('style', 'visibility: hidden;opacity: 0;');
    });
}
