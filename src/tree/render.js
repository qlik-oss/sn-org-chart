import { hierarchy, entries, tree, select } from 'd3';
import stylingUtils from '../utils/styling';
import treeTransform from '../utils/tree-utils';
import position from './position';
import box from './box';
import path from './path';
import '../treeCss.css';

// Constants for the tree. Might be variables later in property panel
const nodeSize = { width: 300, height: 100 };
const orientation = 'ttb';
const isVertical = orientation === 'ttb' || orientation === 'btt';

// Set previous nodes to know which nodes to remain and which to remove
let previousNodes = [];

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

const getBBoxOfNodes = nodes => {
  const bbox = {
    left: Infinity,
    top: Infinity,
    right: -Infinity,
    bottom: -Infinity,
  };
  nodes.forEach(node => {
    bbox.left = Math.min(node.xActual, bbox.left);
    bbox.top = Math.min(node.yActual, bbox.top);
    bbox.right = Math.max(node.xActual, bbox.right);
    bbox.bottom = Math.max(node.yActual, bbox.bottom);
  });
  return {
    x: bbox.left,
    y: bbox.top,
    width: bbox.right - bbox.left + nodeSize.width,
    height: bbox.bottom - bbox.top + nodeSize.height,
  };
};

const reRenderTree = ({ svg, divBox, activeNode, allNodes, o, width, height, cardStyling }) => {
  const nodes = filterTree(activeNode, allNodes);

  const nodeIdList = nodes.map(node => node.data.id);
  let appendNodes = [];

  const activeNodes = svg.selectAll('.nodeWrapper');

  // Cleanup from previous render
  // eslint-disable-next-line no-underscore-dangle
  if (previousNodes.length > 0 && activeNodes._groups[0].length > 0) {
    const removeList = [];
    previousNodes.forEach(node => {
      if (nodeIdList.indexOf(node.data.id) === -1) {
        removeList.push(node.data.id);
      }
    });
    const previousNodesIdList = previousNodes.map(node => node.data.id);
    nodes.forEach(node => {
      if (previousNodesIdList.indexOf(node.data.id) === -1) {
        appendNodes.push(node);
      }
    });
    if (removeList.length > 0) {
      svg
        .selectAll('g')
        .filter(data => removeList.indexOf(data.data.id) > -1)
        // This inserts a transition for the removal of nodes. However it is not in sync with zooming at the moment
        // .transition()
        // .duration(transitionTime)
        // .attr('transform', d => {
        //   return `translate(${o.x(d.parent || d) + 150},${o.y(d.parent || d) + 100}) scale(0)`;
        // })
        .remove();

      divBox
        .selectAll('.nodeRect')
        .filter(data => removeList.indexOf(data.data.id) > -1)
        .remove();
    }
  } else {
    appendNodes = nodes;
  }
  previousNodes = nodes;

  // Create the nodes.
  const node = svg
    .selectAll('.node')
    .data(appendNodes)
    .enter()
    .append('g')
    .attr('class', 'nodeWrapper')
    .attr('id', d => d.data.id);

  box({
    divBox,
    o,
    appendNodes,
    cardStyling,
    reRender: id => {
      reRenderTree({
        svg,
        divBox,
        allNodes,
        o,
        activeNode: id,
        width,
        height,
        cardStyling,
      });
    },
  });

  // Create the lines (links) between the nodes
  path(node, o, isVertical);

  // Zooming and positioning of the tree
  const bBox = getBBoxOfNodes(nodes);
  const scaleToWidhth = bBox.width / width > bBox.height / height;
  const scaleFactor = scaleToWidhth ? bBox.width / width : bBox.height / height;
  const translation = scaleToWidhth
    ? `${-bBox.x}px, ${-bBox.y + (height * scaleFactor - bBox.height) / 2}px`
    : `${-bBox.x + (width * scaleFactor - bBox.width) / 2}px, ${-bBox.y}px`;
  /* svg
    .transition()
    .duration(transitionTime)
    .attr('transform', `scale(${1 / scaleFactor}) translate(${translation})`);
*/
  svg.attr('style', `transform: scale(${1 / scaleFactor}) translate(${translation});`);
  divBox.attr(
    'style',
    // eslint-disable-next-line comma-dangle
    `width:${width}px;height:${height}px; transform: scale(${1 / scaleFactor}) translate(${translation});`
  );
};

const renderTree = async ({ element, layout, model, Theme }) => {
  const b = element.getBoundingClientRect();
  // eslint-disable-next-line no-param-reassign
  element.innerHTML = '';
  const { width } = b;
  const { height } = b;

  const orientations = position(orientation, nodeSize);

  // Get and transform the data into a tree structure
  const data = await treeTransform({ layout, model });

  if (data.error) {
    select(element)
      .append('div')
      .attr('class', 'org-error')
      .html(data.message);
    return;
  }

  if (data.warn && data.warn.length) {
    select(element)
      .append('span')
      .attr('class', 'org-warning')
      .html(`*${data.warn.join(' ')}`);
  }

  const svgBox = select(element)
    .selectAll('svg')
    .data(entries(orientations))
    .enter()
    .append('svg')
    .attr('style', 'position:absolute')
    .attr('width', width)
    .attr('height', height);

  const divBox = select(element)
    .selectAll('div')
    .data(entries(orientations))
    .enter()
    .append('div')
    .attr('class', 'org-node-holder');

  const svg = svgBox.append('g').attr('class', 'org-path-holder');
  svg.each(pos => {
    const o = pos.value;
    // Here are the settings for the tree. For instance nodesize can be adjusted
    const treemap = tree()
      .size([width, height])
      .nodeSize([0, o.depthSpacing]);

    const nodes = hierarchy(data);

    // Using the treemap created
    const allNodes = treemap(nodes);
    const activeNode = allNodes.data.id;

    // Get styling the cards
    const cardStyling = stylingUtils.cardStyling({ Theme, layout });

    reRenderTree({
      svg,
      divBox,
      data,
      allNodes,
      activeNode,
      o,
      width,
      height,
      treemap,
      cardStyling,
    });
  });
};

export default renderTree;
