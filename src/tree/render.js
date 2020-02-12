import { hierarchy, tree, select } from 'd3';
import position from './position';
import box from './box';
import createPaths from './path';
import transform from './transform';
import '../treeCss.css';

const filterTree = ({ topId, isExpanded, expandedChildren }, nodeTree) => {
  const topNode = nodeTree.descendants().find(node => node.data.id === topId) || nodeTree;
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

export const paintTree = ({ objectData, expandedState, styling, setStateCallback, selectionsAPI, useTransitions }) => {
  const { svg, divBox, allNodes, positioning, width, height } = objectData;
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
  box(positioning, divBox, nodes, styling, expandedState, setStateCallback, selectionsAPI);
  // Create the lines (links) between the nodes
  createPaths(node, positioning, expandedState.topId);
  // Scale and translate
  transform(nodes, width, height, svg, divBox, useTransitions);
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
  const positioning = position('ttb');
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
