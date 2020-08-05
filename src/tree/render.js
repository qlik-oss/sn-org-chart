import { hierarchy, tree, select } from 'd3';
import position from './position';
import box from './box';
import createPaths from './path';
import { getBBoxOfNodes, setZooming, getInitialZoomState } from './transform';
import { createTooltip } from './tooltip';
import { homeIcon } from '../utils/svg-icons';
import constants from './size-constants';

export const filterTree = ({ topId, isExpanded, expandedChildren }, nodeTree, extended, navigationMode) => {
  if (navigationMode === 'expandAll') {
    return nodeTree.descendants();
  }
  const topNode = nodeTree.descendants().find((node) => node.data.id === topId) || nodeTree;
  const subTree = [];
  if (isExpanded && topNode.children) {
    // children
    topNode.children.forEach((child) => {
      subTree.push(child);
      if (child.children) {
        if (expandedChildren.indexOf(child.data.id) !== -1 || extended) {
          child.children.forEach((grandChild) => {
            subTree.push(grandChild);
            if (expandedChildren.indexOf(child.data.id) !== -1 && extended && grandChild.children) {
              grandChild.children.forEach((extendedChild) => {
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
    const ancestorIds = ancestors.map((anc) => anc.data.id);
    ancestors.forEach((ancestor) => {
      if (extended) {
        ancestor.children.forEach((child) => {
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

export const paintTree = ({ containerData, styling, setExpandedCallback, wrapperState, selectionObj, element }) => {
  const { svg, divBox, allNodes, positioning, tooltip } = containerData;
  const { navigationMode } = allNodes.data;
  divBox.selectAll('*').remove();
  svg.selectAll('*').remove();
  // filter the nodes the nodes
  const nodes = filterTree(wrapperState.expandedState, allNodes, false, navigationMode);
  // Create cards and naviagation buttons
  box({
    positioning,
    divBox,
    nodes,
    styling,
    setExpandedCallback,
    wrapperState,
    selectionObj,
    navigationMode,
    element,
    tooltip,
  });
  // Create the lines (links) between the nodes
  const node = svg.selectAll('.sn-org-paths').data(nodes).enter();
  createPaths(node, positioning, wrapperState.expandedState.topId, navigationMode);
  // Scale and translate only needed when user cannot zoom
  // if (navigationMode !== 'free') {
  //   transform(nodes, width, height, svg, divBox, useTransitions);
  // }
};

export const createContainer = ({
  element,
  dataTree,
  selectionObj,
  wrapperState,
  setInitialZoom,
  setTransform,
  setExpandedState,
  viewState,
  setContainerData,
  layout,
}) => {
  element.innerHTML = '';
  element.className = 'sn-org-chart';
  const { navigationMode } = layout;
  let positioning = position('ttb', element, {}, navigationMode);
  const { width, height } = element.getBoundingClientRect();

  const zoomWrapper = select(element)
    .append('span')
    .attr('class', 'sn-org-zoomwrapper')
    .on('click', () => {
      if (!wrapperState.constraints.select && (!selectionObj.api.isActive() || !selectionObj.state)) {
        selectionObj.api.begin('/qHyperCubeDef');
        selectionObj.setState([]);
      }
    })
    .node();

  const svgBox = select(zoomWrapper)
    .selectAll('svg')
    .data([{}])
    .enter()
    .append('svg')
    .attr('class', 'sn-org-svg')
    .attr('width', '100%')
    .attr('height', '100%');

  const divBox = select(zoomWrapper).selectAll('div').data([{}]).enter()
    .append('div')
    .attr('class', 'sn-org-nodes');

  const homeButton = select(element)
    .append('button')
    .attr('class', 'sn-org-homebutton disabled')
    .on('click', () => {
      createContainer({
        element,
        dataTree,
        selectionObj,
        wrapperState,
        setInitialZoom,
        setTransform,
        setExpandedState,
        viewState,
        setContainerData,
        layout,
      });
    })
    .html(homeIcon)
    .node();

  const tooltip = createTooltip(element);

  if (dataTree.error) {
    select(zoomWrapper).append('div').attr('class', 'sn-org-error').html(dataTree.message);
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
    .nodeSize([constants.cardWidth + constants.cardPadding, positioning.depthSpacing]);

  const allNodes = treemap(hierarchy(dataTree));

  const resetExpandedState =
    !wrapperState.expandedState ||
    !allNodes.descendants().find((node) => node.data.id === wrapperState.expandedState.topId);
  const newExpandedState = resetExpandedState
    ? { topId: allNodes.data.id, isExpanded: true, expandedChildren: [], useTransitions: false }
    : wrapperState.expandedState;

  const renderNodes = filterTree(newExpandedState, allNodes, false, navigationMode);
  renderNodes.forEach((node) => {
    if (!node.xActual || !node.yActual) {
      positioning.x(node);
      positioning.y(node);
    }
  });
  const bBox = getBBoxOfNodes(renderNodes);
  const initialZoomState =
    viewState && viewState.initialZoom ? viewState.initialZoom : getInitialZoomState(bBox, element, navigationMode);
  setInitialZoom(initialZoomState);
  positioning = position('ttb', element, initialZoomState, navigationMode);
  setZooming({
    containerData: { svg, divBox, width, height, zoomWrapper, element, tooltip, homeButton },
    setTransform,
    transformState: (viewState && viewState.transform) || {},
    wrapperState,
    initialZoomState,
    navigationMode,
  });
  if (resetExpandedState) {
    setExpandedState(newExpandedState);
  }

  return setContainerData({
    svg,
    divBox,
    allNodes,
    positioning,
    width,
    height,
    element,
    zoomWrapper,
    tooltip,
    homeButton,
  });
};
