export default {
  select: function(node, selections, root) {
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
      if (ind !== -1) {
        root.selectionState.slice(ind, 1);
        node.data.selected = false;
      } else {
        root.selectionState.push(node.data.elemNo);
        node.data.selected = true;
      }

      if (!selections.isActive()) {
        selections.begin('/qHyperCubeDef');
      }

      //{"delta":true,"handle":10,"method":"SelectHyperCubeValues","params":["/qUndoExclude/outliers/qHyperCubeDef",1,[679],false],"id":97,"jsonrpc":"2.0"}

      // ADD Linked selection

      selections.select({ method: 'selectHyperCubeValues', params: ['/qHyperCubeDef', 0, root.selectionState, false] });
    }
  },
};
