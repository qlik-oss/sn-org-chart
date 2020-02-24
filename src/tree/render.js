import { hierarchy, tree, select } from 'd3';
import position from './position';
import box from './box';
import createPaths from './path';
import transform from './transform';
import { createTooltip } from './tooltip';

export const filterTree = ({ topId, isExpanded, expandedChildren }, nodeTree, extended) => {
  const topNode = nodeTree.descendants().find(node => node.data.id === topId) || nodeTree;
  const subTree = [];
  if (isExpanded && topNode.children) {
    // children
    topNode.children.forEach(child => {
      subTree.push(child);
      if (child.children) {
        if (expandedChildren.indexOf(child.data.id) !== -1 || extended) {
          child.children.forEach(grandChild => {
            subTree.push(grandChild);
            if (expandedChildren.indexOf(child.data.id) !== -1 && extended && grandChild.children) {
              grandChild.children.forEach(extendedChild => {
                subTree.push(extendedChild);
              });
            }
          });
        }
      }
    });
  }

  if (nodeTree.data.navigationMode === 'free' && topNode.parent) {
    const ancestors = topNode.parent.ancestors();
    const ancestorIds = ancestors.map(anc => anc.data.id);
    ancestors.forEach(ancestor => {
      if (extended) {
        ancestor.children.forEach(child => {
          child.children &&
            ancestorIds.indexOf(child.data.id) === -1 &&
            child.data.id !== topNode.data.id &&
            subTree.unshift(...child.children);
        });
      }
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

export const createSnapshotData = (expandedState, allNodes, layout) => {
  if (layout.snapshotData && layout.snapshotData.dataMatrix) {
    // Need a check here becuase of free resize in storytelling
    return layout.snapshotData.dataMatrix;
  }
  // filter down to the visible nodes
  const nodes = filterTree(expandedState, allNodes, true);
  const usedMatrix = [];
  const { qDataPages } = layout.qHyperCube;
  const dataMatrix = [];
  qDataPages.forEach(page => {
    dataMatrix.push(...page.qMatrix);
  });
  nodes.forEach(n => {
    usedMatrix.push(dataMatrix[n.data.rowNo]);
  });
  return usedMatrix;
};

export const paintTree = ({
  objectData,
  expandedState,
  styling,
  setStateCallback,
  selectionsAndTransform,
  selectionState,
  useTransitions,
  element,
}) => {
  const { svg, divBox, allNodes, positioning, width, height, tooltip } = objectData;
  const { navigationMode } = allNodes.data;
  divBox.selectAll('*').remove();
  svg.selectAll('*').remove();
  // filter the nodes the nodes
  const nodes = filterTree(expandedState, allNodes);
  // Create cards and naviagation buttons
  box(
    positioning,
    divBox,
    nodes,
    styling,
    expandedState,
    setStateCallback,
    selectionState,
    selectionsAndTransform,
    navigationMode,
    element,
    tooltip
  );
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
  // eslint-disable-next-line prefer-const
  let { width, height } = element.getBoundingClientRect();
  if (error || (warn && warn.length)) {
    height -= 20;
  }
  return { width, height };
};

export function preRenderTree(element, dataTree) {
  element.innerHTML = '';
  element.className = 'sn-org-chart';
  const positioning = position('ttb', element, {});
  const { width, height } = getSize(dataTree, element);

  const zoomWrapper = select(element)
    .append('span')
    .attr('class', 'sn-org-zoomwrapper')
    .node();

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

  const tooltip = createTooltip(element);

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

  const svg = svgBox.append('g').attr('class', 'sn-org-paths');
  // Here are the settings for the tree. For instance nodesize can be adjusted
  const treemap = tree()
    .size([width, height])
    .nodeSize([0, positioning.depthSpacing]);

  const allNodes = treemap(hierarchy(dataTree));
  return { svg, divBox, allNodes, positioning, width, height, element, zoomWrapper, tooltip };
}
