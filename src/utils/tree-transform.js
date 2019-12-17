function getId(row) {
  return row[0].qText;
}
function getParentId(row) {
  return row[1].qText;
}

function anyCycle(nodes) {
  const visited = {};
  const marked = {};
  function isCycleUtil(node) {
    visited[node.id] = true;
    marked[node.id] = true;
    for (let i = 0; i < node.children.length; ++i) {
      if (!visited[node.children[i].id] && isCycleUtil(node.children[i])) {
        return true;
      }
      if (marked[node.children[i].id]) {
        return true;
      }
    }
    marked[node.id] = false;
    return false;
  }

  for (let i = 0; i < nodes.length; ++i) {
    const node = nodes[i];
    if (!visited[node.id] && isCycleUtil(node)) {
      return true;
    }
  }
  return false;
}

const getDataPages = async (layout, app, model) => {
  let dataPages = layout.qHyperCube && layout.qHyperCube.qDataPages;

  // This should depend on the size of the data you want to fetch. We need all the data to build the tree to multiple iteration might be necessary. Also a maximum should be set!
  // In object-properties.js we set the size of the data fetch. This should match with the qTop used below (and subsequential itterations)
  if (layout.qHyperCube.qSize.qcx > 1) {
    await model
      .getHyperCubeData('/qHyperCubeDef', [
        {
          qTop: 500,
          qLeft: 0,
          qWidth: 5,
          qHeight: 500,
        },
      ])
      .then(data => {
        // Maybe nicer to create a new variable for this and also do the check on the data in this function
        dataPages[0].qMatrix = dataPages[0].qMatrix.concat(data[0].qMatrix);
      });
  }
  return dataPages;
};

export default async function transform({ layout, app, model }) {
  if (!layout.qHyperCube) {
    throw new Error('Require a hypercube');
  }
  if (layout.qHyperCube.qDimensionInfo.length < 2) {
    // throw new Error('Require at least two dimensions');
    console.log('two dimensions necessary');
  }

  const dataPages = await getDataPages(layout, app, model);
  // const dataPages = layout.qHyperCube && layout.qHyperCube.qDataPages;
  if (!dataPages) {
    return null;
  }
  if (dataPages.length !== 1) {
    return null;
  }
  const matrix = dataPages[0].qMatrix;
  if (!matrix) {
    return null;
  }
  if (matrix.length < 1) {
    return null;
  }

  const nodeMap = {};
  const allNodes = [];
  for (let i = 0; i < matrix.length; ++i) {
    const row = matrix[i];
    const id = getId(row);
    const parentId = getParentId(row);
    const node = {
      id,
      parentId,
      name: (row[2] && row[2].qText) || '',
      children: [],
      elemNo: row[0].qElemNumber,
      details: row[3] ? row[3].qText : '',
    };
    nodeMap[id] = node;
    allNodes.push(node);
  }

  const rootNodes = [];
  for (let i = 0; i < allNodes.length; ++i) {
    const node = allNodes[i];
    const parentNode = nodeMap[node.parentId];
    node.parent = parentNode;
    if (parentNode) {
      parentNode.children.push({ childNumber: parentNode.children.length, ...node });
    } else {
      rootNodes.push(node);
    }
  }

  // I have not looked at these functions at all. But we need to check the data as well I would say.
  if (anyCycle(allNodes)) {
    throw new Error('Cycle detected');
  }

  // We might be able to use the rootnodes lenght as well
  if (rootNodes.length === 0) {
    throw new Error('No root node');
  }
  if (rootNodes.length === 1) {
    return rootNodes[0];
  }

  // Here a fake root node is created when multiple rootnodes exist
  return {
    id: null,
    children: rootNodes,
  };
}
