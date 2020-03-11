import { hierarchy, tree, select } from 'd3';
import position from './position';
import box from './box';
import createPaths from './path';
import transform, { getBBoxOfNodes, setZooming, getInitialZoomState } from './transform';
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

export const paintTree = ({
  containerData,
  styling,
  setExpandedCallback,
  wrapperState,
  selectionObj,
  useTransitions,
  element,
}) => {
  const { svg, divBox, allNodes, positioning, width, height, tooltip } = containerData;
  const { navigationMode } = allNodes.data;
  divBox.selectAll('*').remove();
  svg.selectAll('*').remove();
  // filter the nodes the nodes
  const nodes = filterTree(wrapperState.expandedState, allNodes);
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
  const node = svg
    .selectAll('.sn-org-paths')
    .data(nodes)
    .enter();
  createPaths(node, positioning, wrapperState.expandedState.topId);
  // Scale and translate
  if (navigationMode !== 'free') {
    transform(nodes, width, height, svg, divBox, useTransitions);
  }
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
}) => {
  element.innerHTML = '';
  element.className = 'sn-org-chart';
  let positioning = position('ttb', element, {});
  const { width, height } = element.getBoundingClientRect();

  const zoomWrapper = select(element)
    .append('span')
    .attr('class', 'sn-org-zoomwrapper')
    .on('click', () => {
      if (!wrapperState.constraints.active && (!selectionObj.api.isActive() || !selectionObj.state)) {
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

  const divBox = select(zoomWrapper)
    .selectAll('div')
    .data([{}])
    .enter()
    .append('div')
    .attr('class', 'sn-org-nodes');

  const homeButton = select(element)
    .append('button')
    .attr('class', 'sn-org-homebutton disabled')
    .on('click', () => {
      createContainer({ element, dataTree, selectionObj, wrapperState, setInitialZoom, setTransform, setExpandedState, viewState, setContainerData });
    })
    .html(`<span class="lui-fade-button__icon sn-org-home-icon">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
              <defs>
                <path id="home-a" d="M2,7.9 L8,3.4 L14,7.9 L14,16 L12,16 L12,11.2 C12,11.0895431 11.9104569,11 11.8,11 L9.2,11 C9.08954305,11 9,11.0895431 9,11.2 L9,16 L2,16 L2,7.9 Z M7,13.8 L7,11.2 C7,11.0895431 6.91045695,11 6.8,11 L4.2,11 C4.08954305,11 4,11.0895431 4,11.2 L4,13.8 C4,13.9104569 4.08954305,14 4.2,14 L6.8,14 C6.91045695,14 7,13.9104569 7,13.8 Z M13,4.1 L16,6.5 L15,7.5 L8,2 L1,7.5 L0,6.5 L8,0 L11,2.4 L11,1 L13,1 L13,4.1 Z"/>
              </defs>
              <use xlink:href="#home-a"/>
            </svg>
          </span>`)
    .node();

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

  const resetExpandedState =
    !wrapperState.expandedState || !allNodes.descendants().find(node => node.data.id === wrapperState.expandedState.topId);
  const newExpandedState = resetExpandedState
    ? { topId: allNodes.data.id, isExpanded: true, expandedChildren: [], useTransitions: false }
    : wrapperState.expandedState;

  const renderNodes = filterTree(newExpandedState, allNodes);
  renderNodes.forEach(node => {
    if (!node.xActual || !node.yActual) {
      positioning.x(node);
      positioning.y(node);
    }
  });
  const bBox = getBBoxOfNodes(renderNodes);
  const initialZoomState =
    viewState && viewState.initialZoom ? viewState.initialZoom : getInitialZoomState(bBox, element);
  setInitialZoom(initialZoomState);
  positioning = position('ttb', element, initialZoomState);
  setZooming({
    containerData: { svg, divBox, width, height, zoomWrapper, element, tooltip, homeButton },
    setTransform,
    transformState: (viewState && viewState.transform) || {},
    wrapperState,
    initialZoomState,
  });
  if (resetExpandedState) {
    setExpandedState(newExpandedState);
  }

  return setContainerData({ svg, divBox, allNodes, positioning, width, height, element, zoomWrapper, tooltip, homeButton });
};
