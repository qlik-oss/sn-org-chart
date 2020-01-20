export default {
  select: function(node, selections) {
    if (node) {
      if (node.data.elemNo < 0 && node.data.elemNo !== -3) {
        return;
      }
      if (node.data.isLocked) {
        return;
      }

      /*if (!selections.isActive()) {
        selections.begin('/qHyperCubeDef');
      }*/

      //{"delta":true,"handle":10,"method":"SelectHyperCubeValues","params":["/qUndoExclude/outliers/qHyperCubeDef",1,[679],false],"id":97,"jsonrpc":"2.0"}

      selections.select({ method: 'SelectHyperCubeValues', params: ['/qHyperCubeDef', 0, [node.data.elemNo]] });
    }
  },
};
