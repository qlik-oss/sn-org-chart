import { onTakeSnapshot, useImperativeHandle, useElement } from '@nebula.js/supernova';
import { createSnapshotData } from './tree/render';

export default function snapshot(expandedState, preRenderData, layout, transform, initialZoom) {
  const element = useElement();

  const createViewState = () => {
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
  onTakeSnapshot(snapshotLayout => {
    if (!snapshotLayout.snapshotData) {
      snapshotLayout.snapshotData = {};
    }
    if (!layout.snapshotData || !layout.snapshotData.viewState) {
      snapshotLayout.snapshotData.viewState = createViewState();
    }
    snapshotLayout.snapshotData.dataMatrix = createSnapshotData(expandedState, preRenderData.allNodes, layout);
  });

  useImperativeHandle(() => ({
    getViewState() {
      return createViewState();
    },
  }));
}
