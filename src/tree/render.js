import { hierarchy, tree, select } from 'd3';
import position from './position';
import box from './box';
import path from './path';
import '../treeCss.css';
import transform from './transform';

// Constants for the tree. Might be variables later in property panel
const nodeSize = { width: 152, height: 64 };
const orientation = 'ttb';
const isVertical = orientation === 'ttb' || orientation === 'btt';

const filterTree = ({ topId, isExpanded, expandedChildren }, nodeTree, setStateCallback) => {
  const topNode = topId ? nodeTree.descendants().find(node => node.data.id === topId) : null;
  if (!topNode) {
    setStateCallback({
      topId: nodeTree.data.id,
      isExpanded: true,
      expandedChildren: [],
    });
    return [];
  }
  const subTree = [];
  subTree.push(topNode); // self
  if (isExpanded && topNode.children) {
    // children
    topNode.children.forEach(child => {
      subTree.push(child);
      if (child.children && expandedChildren.indexOf(child.data.id) !== -1) {
        child.children.forEach(grandChild => {
          subTree.push(grandChild);
        });
      }
    });
  }
  return subTree;
};

export const paintTree = ({ objectData, expandedState, styling, setStateCallback, selectionsAPI }) => {
  const { svg, divBox, allNodes, positioning, width, height, zoomMode } = objectData;
  divBox.selectAll('.node-rect').remove();
  svg.selectAll('g').remove();
  const nodes = filterTree(expandedState, allNodes, setStateCallback);
  // create the nodes
  const node = svg
    .selectAll('.node')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', 'nodeWrapper')
    .attr('id', d => d.data.id);
  // Create cards and naviagation buttons
  box(divBox, positioning, nodes, styling, expandedState, setStateCallback, selectionsAPI);
  // Create the lines (links) between the nodes
  path(node, positioning, isVertical, expandedState.topId);
  // Scale and translate
  if (zoomMode !== 'zoom') {
    transform(nodes, nodeSize, width, height, svg, divBox);
  }
};

export const getSize = ({ error, warn }, element) => {
  const size = element.getBoundingClientRect();
  if (error || (warn && warn.length)) {
    size.height -= 20;
  }
  return size;
};

export function preRenderTree(element, dataTree, layout) {
  element.innerHTML = '';
  const positioning = position(orientation, nodeSize, element);
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
  const { zoomMode } = layout;
  return { svg, divBox, allNodes, positioning, width, height, zoomMode, element };
}
