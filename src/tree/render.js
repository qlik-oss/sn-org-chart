import { hierarchy, tree, select } from 'd3';
import position from './position';
import box from './box';
import createPaths from './path';
import transform from './transform';

export const filterTree = ({ topId, isExpanded, expandedChildren }, nodeTree) => {
  const topNode = nodeTree.descendants().find(node => node.data.id === topId) || nodeTree;
  const subTree = [];
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

  if (nodeTree.data.navigationMode === 'free' && topNode.parent) {
    const ancestors = topNode.parent.ancestors();
    ancestors.forEach(ancestor => {
      subTree.unshift(...ancestor.children);
      if (!ancestor.parent) {
        subTree.unshift(ancestor);
      }
    });
  } else {
    subTree.unshift(topNode); // self
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
  const { svg, divBox, allNodes, positioning, width, height } = objectData;
  const { navigationMode } = allNodes.data;
  divBox.selectAll('*').remove();
  svg.selectAll('*').remove();
  // filter the nodes the nodes
  const nodes = filterTree(expandedState, allNodes);
  // Create cards and naviagation buttons
  box(positioning, divBox, nodes, styling, expandedState, setStateCallback, selectionState, selections, navigationMode);
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

export function preRenderTree(element, dataTree) {
  element.innerHTML = '';
  element.className = 'sn-org-chart';
  const positioning = position('ttb', element);
  const { width, height } = getSize(dataTree, element);

  const zoomWrapper = select(element)
    .append('span')
    .attr('class', 'sn-org-zoomwrapper')
    .node();

  if (dataTree.error) {
    select(zoomWrapper)
      .append('div')
      .attr('class', 'sn-org-error')
      .html(dataTree.message);
    return false;
  }

  if (dataTree.warn && dataTree.warn.length) {
    select(zoomWrapper)
      .append('span')
      .attr('class', 'sn-org-warning')
      .html(`*${dataTree.warn.join(' ')}`);
  }

  const svgBox = select(zoomWrapper)
    .selectAll('svg')
    .data([{}])
    .enter()
    .append('svg')
    .attr('class', 'sn-org-svg')
    .attr('width', '100%')
    .attr('height', '100%');

  const divBox = select(zoomWrapper)
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
  return { svg, divBox, allNodes, positioning, width, height, element, zoomWrapper };
}
