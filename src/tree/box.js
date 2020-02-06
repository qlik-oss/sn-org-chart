import card from '../card/card';

export const getSign = (d, { id, isExpanded, expandedChildren }) => {
  if ((d.data.id === id && isExpanded) ||
    (d.parent.data.id === id && expandedChildren.includes(d))) { // top
    return '-';
  }

  return '+';
};

export default function box(divBox, o, nodes, cardStyling, expandedState, setStateCallback) {
  let { id, isExpanded, expandedChildren } = expandedState;
  function getStyle(p) {
    if (p.data.id === 'Root') {
      return `top:${o.y(p) + 80}px;left:${o.x(p) + 140}px`;
    }
    return `width:${o.nodeSize.width}px;height:${o.nodeSize.height}px; top:${o.y(p)}px;left:${o.x(p)}px;`;
  }

  divBox
    .selectAll('.node')
    .data(nodes)
    .enter()
    .append('div')
    .attr('class', 'node-rect')
    .attr('style', getStyle)
    .attr('id', d => d.data.id)
    .html(d => card(d.data, cardStyling));

  divBox
    .selectAll('.node')
    .data(nodes.filter(node => node.children))
    .enter()
    .append('div')
    .attr('class', 'node-rect')
    .attr('style', d => `width:80px;height:50px;top:${o.y(d) + 125}px;left:${o.x(d) + 110}px;`)
    .attr('id', d => `${d.data.id}-traverse`)
    .on('click', d => {
      if (d.data.id === id) { // top
        isExpanded = !isExpanded;
        expandedChildren = [];
      } else if (d.parent.data.id === id) { // children
        expandedChildren = expandedChildren.includes(d) ? [] : [d];
      } else { // grand children
        id = d.data.parent.id;
        isExpanded = true;
        expandedChildren = [d];
      }

      setStateCallback({ id, isExpanded, expandedChildren });
    })
    .html(d => `<div class="org-traverse"> ${getSign(d, expandedState)} ${d.data.children.length}</div>`);
}
