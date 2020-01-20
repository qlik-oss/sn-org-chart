import { hierarchy, entries, tree, select } from 'd3';
import card from '../card/card';
import treeTransform from '../utils/tree-transform';
import '../treeCss.css';

// Constants for the tree. Might be variables later in property panel
const nodeSize = { width: 300, height: 100 };
const halfNodeWidth = nodeSize.width / 2;
const spaceBetweenNodes = 30;
const halfSpaceBetweenNodes = spaceBetweenNodes / 2;
const transitionTime = 500;

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
      const self = { x: o.x(d) + halfNodeWidth, y: o.y(d) };
      if (d.parent) {
        const parent = { x: o.x(d.parent) + halfNodeWidth, y: o.y(d.parent) + nodeSize.height };
        let xrvs = parent.x - self.x < 0 ? -1 : 1;
        let yrvs = parent.y - self.y < 0 ? -1 : 1;
        let rdef = 30;
        let rInitial = Math.abs(parent.x - self.x) / 2 < rdef ? Math.abs(parent.x - self.x) / 2 : rdef;
        let r = Math.abs(parent.y - self.y) / 2 < rInitial ? Math.abs(parent.y - self.y) / 2 : rInitial;
        let h = Math.abs(parent.y - self.y) / 2 - r;
        let w = Math.abs(parent.x - self.x) - r * 2;
        return (
          `
          M ${self.x} ${self.y}
          L ${self.x} ${self.y + h * yrvs}
          C  ${self.x} ${self.y + h * yrvs + r * yrvs} ${self.x} ${self.y + h * yrvs + r * yrvs} ${self.x + r * xrvs} ${self.y + h * yrvs + r * yrvs}
          L ${self.x + w * xrvs + r * xrvs} ${self.y + h * yrvs + r * yrvs}
          C ${parent.x}  ${self.y + h * yrvs + r * yrvs} ${parent.x}  ${self.y + h * yrvs + r * yrvs} ${parent.x} ${parent.y - h * yrvs}
          L ${parent.x} ${parent.y}
          `
        );
      }
    });

  // Zooming and positioning of the tree
  const bBox = svg._groups[0][0].getBBox();
  const xFactor = bBox.width / width;
  svg
    .transition()
    .duration(transitionTime)
    .attr('transform', `scale(${1 / xFactor}) translate(${-bBox.x} ${-bBox.y})`);
};

const renderTree = async ({ element, layout, app, model }) => {
  const b = element.getBoundingClientRect();
  element.innerHTML = '';
  const width = b.width;
  const height = b.height;
  const center = (width - nodeSize.width) / 2;

  // This would allow for different orientations of the tree structure (not needed for now)
  const orientations = {
    'top-to-bottom': {
      size: [width, height],
      x: function(d) {
        // return d.x;
        d.xActual =
          d.parent && d.parent.xActual
            ? d.parent.xActual +
              halfNodeWidth +
              halfSpaceBetweenNodes +
              (d.data.childNumber - d.parent.children.length / 2) * (nodeSize.width + spaceBetweenNodes)
            : center;
        return d.xActual;
      },
      y: function(d) {
        return d.y;
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
      .nodeSize([0, 200]);

    var nodes = hierarchy(data);

    // Using the treemap created
    const allNodes = treemap(nodes);
    const activeNode = allNodes.data.id;
    reRenderTree({ svg, data, allNodes, activeNode, o, width, height, treemap });
  });
};

export default renderTree;
