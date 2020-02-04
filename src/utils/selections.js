import { getAllTreeElemNo } from './tree-utils';

export default {
  select: (node, selections, linked) => {
    const resetSelections = () => {
      selections.selectionState = [];
    };

    if (node) {
      if (node.data.elemNo < 0 && node.data.elemNo !== -3) {
        return;
      }
      if (node.data.isLocked) {
        return;
      }
      if (!selections.isActive()) {
        selections.begin('/qHyperCubeDef');
        resetSelections();
        selections.on('deactivated', resetSelections);
        selections.on('canceled', resetSelections);
        selections.on('cleared', resetSelections);
      }

      const ind = selections.selectionState.indexOf(node.data.elemNo);
      let linkedIds = [];

      // Not sure if we will use a boolean here. Depends how we can access the linked status
      if (linked) {
        linkedIds = getAllTreeElemNo(node);
      }
      if (ind !== -1) {
        selections.selectionState.splice(ind, 1);
        node.data.selected = false;
        linkedIds.forEach(id => {
          selections.selectionState.splice(selections.selectionState.indexOf(id), 1);
        });
      } else {
        selections.selectionState.push(node.data.elemNo);
        node.data.selected = true;
        linkedIds.forEach(id => {
          if (selections.selectionState.indexOf(id) === -1) {
            selections.selectionState.push(id);
          }
        });
      }

      if (selections.selectionState.length === 0) {
        selections.clear();
      } else {
        selections.select({
          method: 'selectHyperCubeValues',
          params: ['/qHyperCubeDef', 0, selections.selectionState, false],
        });
      }
    }
  },
};
