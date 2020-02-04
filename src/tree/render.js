import { hierarchy, tree, select } from 'd3';
import position from './position';
import box from './box';
import path from './path';
import '../treeCss.css';
import stylingUtils from '../utils/styling';
import transform from './transform';

// Constants for the tree. Might be variables later in property panel
const nodeSize = { width: 300, height: 100 };
const orientation = 'ttb';
const isVertical = orientation === 'ttb' || orientation === 'btt';

const filterTree = (id, nodeTree) => {
  const nodes = nodeTree.descendants();
  const currentNode = nodes.find(node => node.data.id === id);

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

export const paintTree = ({ svg, divBox, allNodes, o, width, height, cardStyling, setActiveCallback }, activeNode) => {
  console.log('paint', activeNode);
  const nodes = filterTree(activeNode, allNodes);
  divBox.selectAll('.node-rect').remove();
  svg.selectAll('g').remove();

  // Create the nodes.
  const node = svg
    .selectAll('.node')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', 'nodeWrapper')
    .attr('id', d => d.data.id);

  box(divBox, o, nodes, cardStyling, id => {
    setActiveCallback(id);
  });

  // Create the lines (links) between the nodes
  path(node, o, isVertical);

  transform(nodes, nodeSize, width, height, svg, divBox);
};

export function preRenderTree({ element, dataTree, layout, Theme }) {
  const b = element.getBoundingClientRect();
  const { width } = b;
  let { height } = b;
  // eslint-disable-next-line no-param-reassign
  element.innerHTML = '';

  const orientations = position(orientation, nodeSize);

  // Get and transform the data into a tree structure
  const data = dataTree;

  if (data.error) {
    height -= 20;
    select(element)
      .append('div')
      .attr('class', 'org-error')
      .html(data.message);
    return false; // Promise.resolve();
  }

  if (data.warn && data.warn.length) {
    height -= 20;
    select(element)
      .append('span')
      .attr('class', 'org-warning')
      .html(`*${data.warn.join(' ')}`);
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
  const o = orientations;
  // Here are the settings for the tree. For instance nodesize can be adjusted
  const treemap = tree()
    .size([width, height])
    .nodeSize([0, o.depthSpacing]);

  const nodes = hierarchy(data);

  const cardStyling = stylingUtils.cardStyling({ Theme, layout });

  // Using the treemap created
  const allNodes = treemap(nodes);
  // const activeNode = allNodes.data.id;
  return { svg, divBox, allNodes, o, width, height, cardStyling };
}
