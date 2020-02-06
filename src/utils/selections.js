import { getAllTreeElemNo } from './tree-utils';

export default {
  select: (node, selections) => {
    const resetSelections = () => {
      selections.selectionState = [];
    };

    if (node) {
      let newState;
      if (node.data.elemNo < 0 && node.data.elemNo !== -3) {
        return;
      }
      if (node.data.isLocked) {
        return;
      }
      if (!selections.isActive()) {
        selections.begin('/qHyperCubeDef');
        newState = [];
        selections.on('deactivated', resetSelections);
        selections.on('canceled', resetSelections);
        selections.on('cleared', resetSelections);
      } else {
        newState = selections.selectionState.concat();
      }

      const ind = newState.indexOf(node.data.elemNo);
      const activate = ind === -1;
      let linkedIds = [];

      if (selections.linked) {
        linkedIds = getAllTreeElemNo(node, activate);
      }
      if (!activate) {
        newState.splice(ind, 1);
        node.data.selected = false;
        linkedIds.forEach(id => {
          newState.splice(newState.indexOf(id), 1);
        });
      } else {
        newState.push(node.data.elemNo);
        node.data.selected = true;
        linkedIds.forEach(id => {
          if (newState.indexOf(id) === -1) {
            newState.push(id);
          }
        });
      }

      if (newState.length === 0) {
        selections.clear();
      } else {
        selections.select({
          method: 'selectHyperCubeValues',
          params: ['/qHyperCubeDef', 0, newState, false],
        });
      }
      selections.selectionState = newState;
    }
  },
};
