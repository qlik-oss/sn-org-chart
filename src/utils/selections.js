import { getAllTreeElemNo } from './tree-utils';

export default {
  select: (node, selections, selectionState) => {
    if (node && selections.api) {
      let newState;
      if (node.data.elemNo < 0 && node.data.elemNo !== -3) {
        return;
      }
      if (node.data.isLocked) {
        return;
      }
      if (!selections.api.isActive() || !selectionState) { // selectioState !== [] ?
        selections.api.begin('/qHyperCubeDef');
        newState = [];
      } else {
        newState = selectionState.concat();
      }

      const ind = newState.indexOf(node.data.elemNo);
      const activate = ind === -1;
      let linkedIds = [];

      if (selections.linked) {
        linkedIds = getAllTreeElemNo(node, activate);
      }
      if (!activate) {
        newState.splice(ind, 1);
        linkedIds.forEach(id => {
          newState.splice(newState.indexOf(id), 1);
        });
      } else {
        newState.push(node.data.elemNo);
        linkedIds.forEach(id => {
          if (newState.indexOf(id) === -1) {
            newState.push(id);
          }
        });
      }

      if (newState.length === 0) {
        selections.api.clear();
      } else {
        selections.api.select({
          method: 'selectHyperCubeValues',
          params: ['/qHyperCubeDef', 0, newState, false],
        });
      }
      selections.setState(newState);
    }
  },
};
