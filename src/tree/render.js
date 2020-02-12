import { hierarchy, tree, select } from 'd3';
import position from './position';
import box from './box';
import createPaths from './path';
import transform from './transform';

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

export const paintTree = ({
  objectData,
  expandedState,
  styling,
  setStateCallback,
  selections,
  selectionState,
  useTransitions,
}) => {
  const { svg, divBox, allNodes, positioning, width, height, navigationMode } = objectData;
  divBox.selectAll('*').remove();
  svg.selectAll('*').remove();
  // filter the nodes the nodes
  const nodes = filterTree(expandedState, allNodes, setStateCallback);
  // Create cards and naviagation buttons
  box(positioning, divBox, nodes, styling, expandedState, setStateCallback, selectionState, selections);
  // Create the lines (links) between the nodes
  const node = svg
    .selectAll('.sn-org-paths')
    .data(nodes)
    .enter();
  createPaths(node, positioning, expandedState.topId);
  // Scale and translate
  if (navigationMode !== 'free') {
    transform(nodes, width, height, svg, divBox, useTransitions);
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
  element.className = 'sn-org-chart';
  const positioning = position('ttb');
  const { width, height } = getSize(dataTree, element);

  if (dataTree.error) {
    select(element)
      .append('div')
      .attr('class', 'sn-org-error')
      .html(dataTree.message);
    return false;
  }

  if (dataTree.warn && dataTree.warn.length) {
    select(element)
      .append('span')
      .attr('class', 'sn-org-warning')
      .html(`*${dataTree.warn.join(' ')}`);
  }

  const svgBox = select(element)
    .selectAll('svg')
    .data([{}])
    .enter()
    .append('svg')
    .attr('class', 'sn-org-svg')
    .attr('width', width)
    .attr('height', height);

  const divBox = select(element)
    .selectAll('div')
    .data([{}])
    .enter()
    .append('div')
    .attr('class', 'sn-org-nodes');

  const svg = svgBox.append('g').attr('class', 'sn-org-paths');
  // Here are the settings for the tree. For instance nodesize can be adjusted
  const treemap = tree()
    .size([width, height])
    .nodeSize([0, positioning.depthSpacing]);

  const allNodes = treemap(hierarchy(dataTree));
  const { navigationMode } = layout;
  return { svg, divBox, allNodes, positioning, width, height, navigationMode, element };
}
