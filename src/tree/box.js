import card from '../card/card';
import selections from '../utils/selections';

export default function box(divBox, o, appendNodes, cardStyling, setActiveCallback, selectionsAPI) {
  function getStyle(p) {
    if (p.data.id === 'Root') {
      return `top:${o.y(p) + 80}px;left:${o.x(p) + 140}px`;
    }
    return `width:${o.nodeSize.width}px;height:${o.nodeSize.height}px; top:${o.y(p)}px;left:${o.x(p)}px;`;
  }

  function getMoreStyle(node, isRight) {
    if (
      !node.children ||
      !node.data.isExpanded ||
      !o.nodeSize.maxChildren ||
      o.nodeSize.maxChildren > node.children.length
    ) {
      return 'display:none';
    }
    if (!isRight && node.children.length === node.data.scrollPos + o.nodeSize.maxChildren) {
      return 'display:none';
    }
    if (isRight && node.data.scrollPos === 0) {
      return 'display:none';
    }
    if (isRight) {
      return `top:${node.yActual + 65}px;left:${node.xActual}px`;
    }
    return `top:${node.yActual + 65}px;left:${node.xActual + o.nodeSize.width - 50}px`;
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
      /* if (node.data.id !== 'Root') {
        selections.select(node, selectionsAPI);
      } */
      if (node.children) {
        setActiveCallback(node.data.id);
      }
    })
    .html(d => card(d.data, cardStyling, selectionsAPI));

  const scrollableNodes = appendNodes.filter(n => n.children && n.data.isExpanded);
  divBox.selectAll('.more').remove();
  // should filter appendNodes down to viabler ones, then append things
  divBox
    .selectAll('.node')
    .data(scrollableNodes)
    .enter()
    .append('div')
    .attr('class', 'more')
    .attr('id', d => d.data.id)
    .attr('style', p => getMoreStyle(p, true))
    .on('click', node => {
      node.data.scrollPos -= 1;
      setActiveCallback(null, `${node.data.scrollPos} ${node.data.id}`);
    })
    .html('<');

  divBox
    .selectAll('.node')
    .data(scrollableNodes)
    .enter()
    .append('div')
    .attr('class', 'more')
    .attr('id', d => d.data.id)
    .attr('style', p => getMoreStyle(p, false))
    .on('click', node => {
      node.data.scrollPos += 1;
      setActiveCallback(null, `${node.data.scrollPos} ${node.data.id}`);
    })
    .html('>');
}
