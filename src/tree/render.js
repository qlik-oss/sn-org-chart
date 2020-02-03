import { hierarchy, entries, tree, select } from 'd3';
import treeTransform from '../utils/tree-utils';
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

export const reRenderTree = ({
  svg,
  divBox,
  activeNode,
  allNodes,
  o,
  width,
  height,
  cardStyling,
  callback,
  storage,
}) => {
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
    callback({
      svg,
      divBox,
      allNodes,
      o,
      activeNode: id,
      width,
      height,
      cardStyling,
      callback,
      storage,
    });
  });

  // Create the lines (links) between the nodes
  path(node, o, isVertical);

  transform(nodes, nodeSize, width, height, svg, divBox);
};

export const renderTree = async ({ element, layout, model, storage, callback, Theme }) => {
  const b = element.getBoundingClientRect();
  const { width } = b;
  let { height } = b;
  // eslint-disable-next-line no-param-reassign
  element.innerHTML = '';

  const orientations = position(orientation, nodeSize);

  // Get and transform the data into a tree structure
  const data = await treeTransform({ layout, model });

  if (data.error) {
    height -= 20;
    select(element)
      .append('div')
      .attr('class', 'org-error')
      .html(data.message);
    return;
  }

  if (data.warn && data.warn.length) {
    height -= 20;
    select(element)
      .append('span')
      .attr('class', 'org-warning')
      .html(`*${data.warn.join(' ')}`);
  }

  console.log(entries(orientations));

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
    // .data(entries(orientations))
    .data([{}])
    .enter()
    .append('div')
    .attr('class', 'org-node-holder');

  const svg = svgBox.append('g').attr('class', 'org-path-holder');
  // svg.eaxch(pos => {
  const o = orientations;
  // Here are the settings for the tree. For instance nodesize can be adjusted
  const treemap = tree()
    .size([width, height])
    .nodeSize([0, o.depthSpacing]);

  const nodes = hierarchy(data);

  const cardStyling = stylingUtils.cardStyling({ Theme, layout });

  // Using the treemap created
  const allNodes = treemap(nodes);
  const activeNode = storage.activeNode || allNodes.data.id;
  reRenderTree({
    svg,
    divBox,
    allNodes,
    activeNode,
    o,
    width,
    height,
    treemap,
    cardStyling,
    callback,
    storage,
  });
  // });
};

// export default renderTree;
