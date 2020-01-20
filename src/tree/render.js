import { hierarchy, entries, tree, select } from 'd3';
import card from '../card/card';
import treeTransform from '../utils/tree-transform';
import '../treeCss.css';

// Constants for the tree. Might be variables later in property panel
const nodeSize = { width: 300, height: 100 };
const siblingSpacing = 30;
const transitionTime = 500;
const orientation = 'ttb';
const isVertical = orientation === 'ttb' || orientation === 'btt';

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

// TODO: Does not work properly for horizontal trees
const getBBoxOfNodes = nodes => {
  const bbox = { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity };
  nodes.forEach(node => {
    bbox.left = Math.min(node.xActual || node.x, bbox.left);
    bbox.top = Math.min(node.yActual || node.y, bbox.top);
    bbox.right = Math.max(node.xActual || node.x, bbox.right);
    bbox.bottom = Math.max(node.yActual || node.y, bbox.bottom);
  });
  return {
    x: bbox.left,
    y: bbox.top,
    width: bbox.right - bbox.left + nodeSize.width,
    height: bbox.bottom - bbox.top + nodeSize.height,
  };
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
        // starting at self, ending at parent
        const start = { x: o.x(d) + o.pathOffsetSelf.x, y: o.y(d) + o.pathOffsetSelf.y };
        const end = { x: o.x(d.parent) + o.pathOffsetParent.x, y: o.y(d.parent) + o.pathOffsetParent.y };
        const size = { x: Math.abs(end.x - start.x), y: Math.abs(end.y - start.y) };
        // factors inverseíng direction of lines and curves
        const inverse = { x: end.x - start.x < 0 ? -1 : 1, y: end.y - start.y < 0 ? -1 : 1 };
        // radius of elbow
        const rDef = 30;
        const rAbs = Math.min(size.x, size.y) / 2 < rDef ? Math.min(size.x, size.y) / 2 : rDef;
        const r = { x: inverse.x * rAbs, y: inverse.y * rAbs};
        let l, firstLine, firstCurve, secondCurve;

        if (isVertical) {
          l = {x: inverse.x * (size.x - rAbs * 2) , y: inverse.y * (size.y / 2 - rAbs)}
          firstLine = `${start.x} ${start.y + l.y}`;
          firstCurve = `${start.x} ${start.y + l.y + r.y} ${start.x} ${start.y + l.y + r.y} ${start.x + r.x} ${start.y + l.y + r.y}`;
          secondCurve = `${end.x}  ${start.y + l.y + r.y} ${end.x}  ${start.y + l.y + r.y} ${end.x} ${end.y - l.y}`;
        } else {
          l = {x: inverse.x * (size.x / 2 - rAbs) , y: inverse.y * (size.y - rAbs * 2)}
          firstLine = `${start.x + l.x} ${start.y}`;
          firstCurve = `${start.x + l.x + r.x} ${start.y} ${start.x + l.x + r.x} ${start.y} ${start.x + l.x + r.x} ${start.y + r.y}`;
          secondCurve = `${start.x + l.x + r.x} ${end.y} ${start.x + l.x + r.x} ${end.y} ${end.x - l.x} ${end.y}`;
        }

        return (
          `
          M ${start.x} ${start.y}
          L ${firstLine}
          C ${firstCurve}
          L ${start.x + l.x + r.x} ${start.y + l.y + r.y}
          C ${secondCurve}
          L ${end.x} ${end.y}
          `
        );
      }
    });

  // Zooming and positioning of the tree
  const bBox = getBBoxOfNodes(nodes);
  const scaleToWidhth = bBox.width / width > bBox.height / height;
  const scaleFactor = scaleToWidhth ? bBox.width / width : bBox.height / height;
  const translation = scaleToWidhth
    ? `${-bBox.x} ${-bBox.y + (height * scaleFactor - bBox.height) / 2}`
    : `${-bBox.x + (width * scaleFactor - bBox.width) / 2} ${-bBox.y}`;
  svg
    .transition()
    .duration(transitionTime)
    .attr('transform', `scale(${1 / scaleFactor}) translate(${translation})`);
};

const renderTree = async ({ element, layout, app, model }) => {
  const b = element.getBoundingClientRect();
  element.innerHTML = '';
  const width = b.width;
  const height = b.height;

  // This would allow for different orientations of the tree structure (not needed for now)
  let orientations;
  switch (orientation) {
    case 'ttb':
      orientations = {
        'top-to-bottom': {
          depthSpacing: 200,
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
  svg.each(orientation => {
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
