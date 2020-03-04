import { onTakeSnapshot, useImperativeHandle, useElement } from '@nebula.js/supernova';
import { filterTree } from './tree/render';

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
    if (n.data.rowNo !== undefined) {
      usedMatrix.push(dataMatrix[n.data.rowNo]);
    }
  });
  return usedMatrix;
};

export const createViewState = (expandedState, transform, initialZoom, element) => {
  const size = { w: element.clientWidth, h: element.clientHeight };
  const vs = {
    expandedState,
    transform,
    size,
    initialZoom,
  };
  vs.expandedState.useTransitions = false;
  return vs;
};

export default function snapshot(expandedState, containerData, layout, transform, initialZoom) {
  const element = useElement();
  onTakeSnapshot(snapshotLayout => {
    if (!snapshotLayout.snapshotData) {
      snapshotLayout.snapshotData = {};
    }
    if (!layout.snapshotData || !layout.snapshotData.viewState) {
      snapshotLayout.snapshotData.viewState = createViewState(expandedState, transform, initialZoom, element);
    }
    snapshotLayout.snapshotData.dataMatrix = createSnapshotData(expandedState, containerData.allNodes, layout);
  });

  useImperativeHandle(() => ({
    getViewState() {
      return createViewState();
    },
  }));
}
