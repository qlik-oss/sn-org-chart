import { hierarchy, tree, select } from 'd3';
import position from './position';
import box from './box';
import path from './path';
import '../treeCss.css';
import transform from './transform';

// Constants for the tree. Might be variables later in property panel
const nodeSize = { width: 152, height: 64, maxChildren: 5, nodeMargin: 66 };
const orientation = 'ttb';
const isVertical = orientation === 'ttb' || orientation === 'btt';

const getScrollPos = node => node.data.scrollPos || 0;

const filterTree = (id, nodeTree, maxKids) => {
  const nodes = nodeTree.descendants();
  nodes.forEach(n => {
    n.data.isExpanded = false;
  });
  let currentNode = nodes.find(node => node.data.id === id);
  if (!currentNode) {
    currentNode = nodeTree;
  } else if (
    maxKids &&
    currentNode.parent &&
    (getScrollPos(currentNode.parent) > currentNode.data.childNumber ||
      getScrollPos(currentNode.parent) + maxKids - 1 < currentNode.data.childNumber)
  ) {
    currentNode = currentNode.parent;
  }
  currentNode.data.isExpanded = true;

  const subSet = [];
  // add current node
  !currentNode.parent && subSet.push(currentNode);
  // add parent
  if (currentNode.parent) {
    subSet.push(currentNode.parent);
    currentNode.parent.data.isExpanded = true;
    // add siblings
    if (maxKids) {
      subSet.push(
        ...currentNode.parent.children.slice(
          getScrollPos(currentNode.parent),
          getScrollPos(currentNode.parent, maxKids) + maxKids
        )
      );
    } else {
      subSet.push(...currentNode.parent.children);
    }
  }
  // add children
  if (maxKids) {
    subSet.push(...currentNode.children.slice(getScrollPos(currentNode), getScrollPos(currentNode) + maxKids));
  } else {
    subSet.push(...currentNode.children);
  }
  return subSet;
};

export const paintTree = ({ objectData, activeNode, styling, setActiveCallback, selectionsAPI }) => {
  const { svg, divBox, allNodes, positioning, width, height } = objectData;
  divBox.selectAll('.node-rect').remove();
  svg.selectAll('g').remove();
  const nodes = filterTree(activeNode, allNodes, positioning.nodeSize.maxChildren);
  // create the nodes
  const node = svg
    .selectAll('.node')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', 'nodeWrapper')
    .attr('id', d => d.data.id);
  // Create cards
  box(divBox, positioning, nodes, styling, setActiveCallback, selectionsAPI);
  // Create the lines (links) between the nodes
  path(node, positioning, isVertical);
  // Scale and translate
  transform(nodes, positioning.nodeSize, width, height, svg, divBox);
};

export const getSize = ({ error, warn }, element) => {
  const size = element.getBoundingClientRect();
  if (error || (warn && warn.length)) {
    size.height -= 20;
  }
  return size;
};

export function preRenderTree(element, dataTree, styling = {}) {
  // eslint-disable-next-line no-param-reassign
  element.innerHTML = '';
  const { width, height } = getSize(dataTree, element);
  const localSize = { ...nodeSize };
  // One and a half full child list minus half a node is the max width of a tree with a given number of simultaneusly displayed children
  // width = 1.5 * (numChildren * nodeWidth + (numChildred-1) * nodeSpacing) - nodeWidth/2
  if (styling.navMode === 'scroll') {
    const childCount =
      (width + localSize.width / 2 + 1.5 * localSize.nodeMargin) / (1.5 * localSize.width + 1.5 * localSize.nodeMargin);
    localSize.maxChildren = Math.round(childCount);
  } else {
    localSize.maxChildren = null;
  }
  const positioning = position(orientation, localSize);

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
