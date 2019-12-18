import { hierarchy, entries, tree, select } from 'd3';
import card from '../card/card';
import treeTransform from '../utils/tree-transform';
import '../treeCss.css';

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
        // .duration(500)
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
    .attr('width', 300)
    .attr('height', 100)
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
      const self = { x: o.x(d) + 150, y: o.y(d) };
      if (d.parent) {
        const parent = { x: o.x(d.parent) + 150, y: o.y(d.parent) + 100 };
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
  const xFactor = bBox.width / width;
  svg
    .transition()
    .duration(500)
    .attr('transform', `scale(${1 / xFactor}) translate(${-bBox.x} ${-bBox.y})`);
};

const renderTree = async ({ element, layout, app, model }) => {
  const b = element.getBoundingClientRect();
  element.innerHTML = '';
  const width = b.width;
  const height = b.height;
  const center = width / 2 - 150;

  // This would allow for different orientations of the tree structure (not needed for now)
  const orientations = {
    'top-to-bottom': {
      size: [width, height],
      x: function(d) {
        // return d.x;
        d.xActual = d.parent && d.parent.xActual
          ? d.parent.xActual + 165 + (d.data.childNumber - d.parent.children.length / 2) * 330
          : center;
        return d.xActual;
      },
      xLine: d => {
        // return d.x;
        if (!d.parent) {
          return center;
        }
        return center + 150 + (d.data.childNumber - (d.parent.children.length - 1) / 2) * 330;
      },
      y: function(d) {
        return d.y;
      },
      yLine: function(d) {
        return d.depth * 150 + 75;
      },
    },
  };

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
  svg.each(orientation => {
    const o = orientation.value;
    // Here are the settings for the tree. For instance nodesize can be adjusted
    const treemap = tree()
      .size(o.size)
      .nodeSize([1, 200])
      .separation((a, b) => {
        return 400;
        if (a.children && b.children) {
          return 400;
        }
        return 0;
      });

    var nodes = hierarchy(data);

    // Using the treemap created
    const allNodes = treemap(nodes);
    const activeNode = allNodes.data.id;
    reRenderTree({ svg, data, allNodes, activeNode, o, width, height, treemap });
  });
};

export default renderTree;
