import { hierarchy, entries, tree, select } from 'd3';
import card from '../card/card';
import treeTransform from '../utils/tree-transform';
import '../treeCss.css';

// Constants for the tree. Might be variables later in property panel
const nodeSize = { width: 300, height: 100 };
const siblingSpacing = 30;
const transitionTime = 500;
const orientation = 'rtl';

// Set previous nodes to know which nodes to remain and which to remove
let previousNodes = [];

const filterTree = (id, tree) => {
  const nodes = tree.descendants();
  const currentNode = nodes.find(node => node.data.id === id);

  // Only build the current view (three levels of hiearchy)
  return nodes.filter(node => {
    return (
      currentNode.data.id === node.data.id ||
      (currentNode.parent && node.data.id === currentNode.parent.data.id) ||
      (currentNode.parent && node.parent && node.parent.data.id === currentNode.parent.data.id) ||
      (node.parent && node.parent.data.id === currentNode.data.id)
    );
  });
};

const reRenderTree = ({ svg, activeNode, allNodes, o, width, height }) => {
  const nodes = filterTree(activeNode, allNodes);

  const nodeIdList = nodes.map(node => node.data.id);
  let appendNodes = [];

  const activeNodes = svg.selectAll('.nodeWrapper');

  // Cleanup from previous render
  if (previousNodes.length > 0 && activeNodes._groups[0].length > 0) {
    let removeList = [];
    for (const node of previousNodes) {
      if (nodeIdList.indexOf(node.data.id) === -1) {
        removeList.push(node.data.id);
      }
    }
    const previousNodesIdList = previousNodes.map(node => node.data.id);
    for (const node of nodes) {
      if (previousNodesIdList.indexOf(node.data.id) === -1) {
        appendNodes.push(node);
      }
    }
    if (removeList.length > 0) {
      svg
        .selectAll('g')
        .filter(data => {
          return removeList.indexOf(data.data.id) > -1;
        })
        // This inserts a transition for the removal of nodes. However it is not in sync with zooming at the moment
        // .transition()
        // .duration(transitionTime)
        // .attr('transform', d => {
        //   return `translate(${o.x(d.parent || d) + 150},${o.y(d.parent || d) + 100}) scale(0)`;
        // })
        .remove();
    }
  } else {
    appendNodes = nodes;
  }
  previousNodes = nodes;

  // Create the nodes.
  var node = svg
    .selectAll('.node')
    .data(appendNodes)
    .enter()
    .append('g')
    .attr('class', 'nodeWrapper')
    .attr('id', d => d.data.id);

  // Create the div element for the nodes
  node
    .append('foreignObject')
    .attr('class', 'nodeRect')
    .attr('width', nodeSize.width)
    .attr('height', nodeSize.height)

    .attr('x', o.x)
    .attr('y', o.y)
    .attr('id', d => d.data.id)
    .on('click', node => {
      if (node.children) {
        reRenderTree({ svg, allNodes, o, activeNode: node.data.id, width, height });
      }
    })
    .html(d => {
      return card(d.data);
    });

  // Create the lines (links) between the nodes
  node
    .append('path')
    .attr('class', 'link')
    .attr('id', d => d.data.id)
    .attr('d', function(d) {
      if (d.parent) {
        const self = { x: o.x(d) + o.pathOffsetSelf.x, y: o.y(d) + o.pathOffsetSelf.y };
        const parent = { x: o.x(d.parent) + o.pathOffsetParent.x, y: o.y(d.parent) + o.pathOffsetParent.y };
        return (
          'M' +
          self.x +
          ',' +
          self.y +
          'C' +
          self.x +
          ',' +
          (self.y + parent.y) / 2 +
          ' ' +
          parent.x +
          ',' +
          (self.y + d.parent.y) / 2 +
          ' ' +
          parent.x +
          ',' +
          parent.y
        );
      }
    });

  // Zooming and positioning of the tree
  const bBox = svg._groups[0][0].getBBox();
  const scaleFactor = bBox.width / width > bBox.height / height ? bBox.width / width : bBox.height / height;
  svg
    .transition()
    .duration(transitionTime)
    .attr('transform', `scale(${1 / scaleFactor}) translate(${-bBox.x} ${-bBox.y})`);
};

const renderTree = async ({ element, layout, app, model }) => {
  const b = element.getBoundingClientRect();
  element.innerHTML = '';
  const width = b.width;
  const height = b.height;
  // const widthCenter = (width - nodeSize.width) / 2;
  // const heightCenter = (width - nodeSize.width) / 2;

  // This would allow for different orientations of the tree structure (not needed for now)
  let orientations;
  switch (orientation) {
    case 'ttb':
      orientations = {
        'top-to-bottom': {
          depthSpacing: 200,
          center: (width - nodeSize.width) / 2,
          rootOffset: (width - nodeSize.width) / 2,
          pathOffsetSelf: {
            x: nodeSize.width / 2,
            y: 0,
          },
          pathOffsetParent: {
            x: nodeSize.width / 2,
            y: nodeSize.height,
          },
          x: function(d) {
            // return d.x;
            d.xActual =
              d.parent && d.parent.xActual
                ? d.parent.xActual +
                  nodeSize.width / 2 +
                  siblingSpacing / 2 +
                  (d.data.childNumber - d.parent.children.length / 2) * (nodeSize.width + siblingSpacing)
                : 1;
            return d.xActual;
          },
          y: function(d) {
            return d.y;
          },
        },
      };
      break;
    case 'btt':
      orientations = {
        'bottom-to-top': {
          depthSpacing: -200,
          pathOffsetSelf: {
            x: nodeSize.width / 2,
            y: nodeSize.height,
          },
          pathOffsetParent: {
            x: nodeSize.width / 2,
            y: 0,
          },
          x: function(d) {
            // return d.x;
            d.xActual =
              d.parent && d.parent.xActual
                ? d.parent.xActual +
                  nodeSize.width / 2 +
                  siblingSpacing / 2 +
                  (d.data.childNumber - d.parent.children.length / 2) * (nodeSize.width + siblingSpacing)
                : 1;
            return d.xActual;
          },
          y: function(d) {
            return d.y;
          },
        },
      };
      break;
    case 'ltr':
      orientations = {
        'left-to-right': {
          depthSpacing: 500,
          rootOffset: (height - nodeSize.height) / 2,
          pathOffsetSelf: {
            x: 0,
            y: nodeSize.height / 2,
          },
          pathOffsetParent: {
            x: nodeSize.width,
            y: nodeSize.height / 2,
          },
          y: function(d) {
            // return d.x;
            d.yActual =
              d.parent && d.parent.yActual
                ? d.parent.yActual +
                  nodeSize.height / 2 +
                  siblingSpacing / 2 +
                  (d.data.childNumber - d.parent.children.length / 2) * (nodeSize.height + siblingSpacing)
                : 1;
            return d.yActual;
          },
          x: function(d) {
            return d.y;
          },
        },
      };
      break;
    case 'rtl':
      orientations = {
        'right-to-left': {
          depthSpacing: -500,
          rootOffset: (height - nodeSize.height) / 2,
          pathOffsetSelf: {
            x: nodeSize.width,
            y: nodeSize.height / 2,
          },
          pathOffsetParent: {
            x: 0,
            y: nodeSize.height / 2,
          },
          y: function(d) {
            // return d.x;
            d.yActual =
              d.parent && d.parent.yActual
                ? d.parent.yActual +
                  nodeSize.height / 2 +
                  siblingSpacing / 2 +
                  (d.data.childNumber - d.parent.children.length / 2) * (nodeSize.height + siblingSpacing)
                : 1;
            return d.yActual;
          },
          x: function(d) {
            return d.y;
          },
        },
      };
      break;
    default:
      break;
  }

  // Get and transform the data into a tree structure
  const data = await treeTransform({ layout, app, model });

  const svgBox = select(element)
    .selectAll('svg')
    .data(entries(orientations))
    .enter()
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const svg = svgBox.append('g');
  svg.each((orientation, i) => {
    const o = orientation.value;
    // Here are the settings for the tree. For instance nodesize can be adjusted
    const treemap = tree()
      .size([width, height])
      .nodeSize([0, o.depthSpacing]);

    var nodes = hierarchy(data);

    // Using the treemap created
    const allNodes = treemap(nodes);
    const activeNode = allNodes.data.id;
    reRenderTree({ svg, data, allNodes, activeNode, o, width, height, treemap });
  });
};

export default renderTree;
