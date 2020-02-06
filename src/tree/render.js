import { hierarchy, tree, select } from 'd3';
import position from './position';
import box from './box';
import path from './path';
import '../treeCss.css';
import transform from './transform';

// Constants for the tree. Might be variables later in property panel
const nodeSize = { width: 300, height: 100 };
const orientation = 'ttb';
const isVertical = orientation === 'ttb' || orientation === 'btt';

const getScrollPos = node => node.data.scrollPos || 0;

const filterTree = (id, nodeTree) => {
  const nodes = nodeTree.descendants();
  let currentNode = nodes.find(node => node.data.id === id);
  if (!currentNode) {
    currentNode = nodeTree;
  }
  currentNode.data.isExpanded = true;

  const subSet = [];
  // add current node
  subSet.push(currentNode);
  // add parent
  if (currentNode.parent) {
    subSet.push(currentNode.parent);
    currentNode.parent.data.isExpanded = true;
    // add siblings
    subSet.push(
      ...currentNode.parent.children.slice(getScrollPos(currentNode.parent), getScrollPos(currentNode.parent) + 5)
    );
  }
  // add children
  subSet.push(...currentNode.children.slice(getScrollPos(currentNode), getScrollPos(currentNode) + 5));
  return subSet;

  // Only build the current view (three levels of hiearchy)
  // eslint-disable-next-line arrow-body-style
  return nodes.filter(node => {
    return (
      currentNode.data.id === node.data.id ||
      (currentNode.parent && node.data.id === currentNode.parent.data.id) ||
      (currentNode.parent && node.parent && node.parent.data.id === currentNode.parent.data.id) ||
      (node.parent && node.parent.data.id === currentNode.data.id)
    );
  });
};

export const paintTree = ({ objectData, activeNode, styling, setActiveCallback, selectionsAPI }) => {
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
  box(divBox, positioning, nodes, styling, setActiveCallback);
  // Create the lines (links) between the nodes
  path(node, positioning, isVertical);
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
  // eslint-disable-next-line no-param-reassign
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
