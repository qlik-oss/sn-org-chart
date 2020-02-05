import { hierarchy, tree, select } from 'd3';
import position from './position';
import box from './box';
import path from './path';
import '../treeCss.css';
import transform from './transform';

// Constants for the tree. Might be variables later in property panel
const nodeSize = { width: 300, height: 200 };
const orientation = 'ttb';
const isVertical = orientation === 'ttb' || orientation === 'btt';

const filterTree = (activeNode, nodeTree) => {
  const nodes = nodeTree.descendants();
  const currentNode = nodes.find(node => node.data.id === activeNode.id);

  // Only build the current view (three levels of hiearchy)
  // eslint-disable-next-line arrow-body-style
  return nodes.filter(node => {
    return (
      currentNode.data.id === node.data.id || // itself
      (currentNode.parent && node.data.id === currentNode.parent.data.id) || // parent
      (currentNode.parent && node.parent && node.parent.data.id === currentNode.parent.data.id) || // siblings
      (activeNode.isExpanded && node.parent && node.parent.data.id === currentNode.data.id) // children
    );
  });
};

export const paintTree = ({ objectData, activeNode, styling, setActiveCallback }) => {
  const { svg, divBox, allNodes, positioning, width, height } = objectData;
  divBox.selectAll('.node-rect').remove();
  svg.selectAll('g').remove();
  const nodes = filterTree(activeNode, allNodes);
  // create the nodes
  const node = svg
    .selectAll('.node')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', 'nodeWrapper')
    .attr('id', d => d.data.id);
  // Create cards
  box(divBox, positioning, nodes, styling, activeNode, id => {
    setActiveCallback(id);
  });
  // Create the lines (links) between the nodes
  path(node, positioning, isVertical, activeNode);
  // Scale and translate
  transform(nodes, nodeSize, width, height, svg, divBox);
};

export const getSize = ({ error, warn }, element) => {
  const size = element.getBoundingClientRect();
  if (error || (warn && warn.length)) {
    size.height -= 20;
  }
  return size;
};

export function preRenderTree(element, dataTree) {
  element.innerHTML = '';
  const positioning = position(orientation, nodeSize);
  const { width, height } = getSize(dataTree, element);

  if (dataTree.error) {
    select(element)
      .append('div')
      .attr('class', 'org-error')
      .html(dataTree.message);
    return false;
  }

  if (dataTree.warn && dataTree.warn.length) {
    select(element)
      .append('span')
      .attr('class', 'org-warning')
      .html(`*${dataTree.warn.join(' ')}`);
  }

  const svgBox = select(element)
    .selectAll('svg')
    .data([{}])
    .enter()
    .append('svg')
    .attr('style', 'position:absolute')
    .attr('width', width)
    .attr('height', height);

  const divBox = select(element)
    .selectAll('div')
    .data([{}])
    .enter()
    .append('div')
    .attr('class', 'org-node-holder');

  const svg = svgBox.append('g').attr('class', 'org-path-holder');
  // Here are the settings for the tree. For instance nodesize can be adjusted
  const treemap = tree()
    .size([width, height])
    .nodeSize([0, positioning.depthSpacing]);

  const allNodes = treemap(hierarchy(dataTree));
  return { svg, divBox, allNodes, positioning, width, height };
}
