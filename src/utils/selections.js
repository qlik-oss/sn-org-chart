import { getAllTreeElemNo } from './tree-utils';

export default {
  select: (node, selections, root, linked) => {
    if (node) {
      if (node.data.elemNo < 0 && node.data.elemNo !== -3) {
        return;
      }
      if (node.data.isLocked) {
        return;
      }
      if (!root.selectionState) {
        root.selectionState = [];
      }
      const ind = root.selectionState.indexOf(node.data.elemNo);
      let linkedIds = [];

      // Not sure if we will use a boolean here. Depends how we can access the linked status
      if (linked) {
        linkedIds = getAllTreeElemNo(node);
      }
      if (ind !== -1) {
        root.selectionState.splice(ind, 1);
        node.data.selected = false;
        linkedIds.forEach(id => {
          root.selectionState.splice(root.selectionState.indexOf(id), 1);
        });
      } else {
        root.selectionState.push(node.data.elemNo);
        node.data.selected = true;
        linkedIds.forEach(id => {
          if (root.selectionState.indexOf(id) === -1) {
            root.selectionState.push(id);
          }
        });
      }

      if (!selections.isActive()) {
        selections.begin('/qHyperCubeDef');
      }

      if (root.selectionState.length === 0) {
        selections.clear();
      } else {
        selections.select({
          method: 'selectHyperCubeValues',
          params: ['/qHyperCubeDef', 0, root.selectionState, false],
        });
      }
    }
  },
};
