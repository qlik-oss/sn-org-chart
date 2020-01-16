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

const pageSize = 1500;
const maxPageCount = 30;
async function fetchPage(dataPages, dataMatrix, model, fullHeight, currentRow, callNum) {
  callNum++;
  await model
    .getHyperCubeData('/qHyperCubeDef', [
      {
        qTop: currentRow,
        qLeft: 0,
        qWidth: 3,
        qHeight: pageSize,
      },
    ])
    .then(data => {
      dataPages.push(data[0]);
      dataMatrix.push(...data[0].qMatrix);
      currentRow += data[0].qArea.qHeight;
    });
  if (callNum >= maxPageCount) {
    return; // Sanity return for very large data
  } else if (fullHeight > currentRow) {
    await fetchPage(dataPages, dataMatrix, model, fullHeight, currentRow, callNum);
  }
}

const getDataMatrix = async (layout, model) => {
  let dataPages = layout.qHyperCube && layout.qHyperCube.qDataPages;
  const fullHeight = layout.qHyperCube.qSize.qcy;
  const loadedHeight = dataPages[0].qArea.qHeight;
  const dataMatrix = [...dataPages[0].qMatrix];

  // If there seems to be more data, check if it is already loadad or load it
  if (fullHeight > loadedHeight && dataPages.length === 1) {
    await fetchPage(layout.qHyperCube.qDataPages, dataMatrix, model, fullHeight, loadedHeight, 0);
  } else {
    dataPages.forEach((page, i) => {
      i > 0 ? dataMatrix.push(...page.qMatrix) : '';
    });
  }
  return dataMatrix;
};

function getAttributIndex(attrsInfo, id) {
  if (attrsInfo && attrsInfo.length) {
    let index = false;
    attrsInfo.forEach((attr, i) => {
      if (attr.id === id) {
        index = i;
      }
    });
    return index;
  }
  return false;
}

function getAttribute(attrs, index) {
  if (index !== false) {
    return attrs.qValues[index].qText;
  }
  return false;
}

function transformColor(color) {
  if (color && color.substring(0, 4) === 'ARGB') {
    // transform the engine output to css
    const comps = color.substring(5, color.length - 1).split(',');
    return `rgba(${comps[1]},${comps[2]},${comps[3]},${comps[0]}`;
  }
  return color;
}

export default async function transform({ layout, app, model }) {
  if (!layout.qHyperCube) {
    throw new Error('Require a hypercube');
  }
  if (layout.qHyperCube.qDimensionInfo.length < 2) {
    // throw new Error('Require at least two dimensions');
    console.log('two dimensions necessary');
  }

  const matrix = await getDataMatrix(layout, model);
  if (!matrix) {
    return null;
  }
  if (matrix.length < 1) {
    return null;
  }

  const nodeMap = {};
  const allNodes = [];

  const colorIndex = getAttributIndex(layout.qHyperCube.qDimensionInfo[0].qAttrExprInfo, 'colorByExpression');
  const labelIndex = getAttributIndex(layout.qHyperCube.qDimensionInfo[0].qAttrExprInfo, 'labelExpression');
  const subLabelIndex = getAttributIndex(layout.qHyperCube.qDimensionInfo[0].qAttrExprInfo, 'subLabelExpression');

  for (let i = 0; i < matrix.length; ++i) {
    const row = matrix[i];
    const id = getId(row);
    const parentId = getParentId(row);
    const node = {
      id,
      parentId,
      children: [],
      elemNo: row[0].qElemNumber,
      details: row[3] ? row[3].qText : '',
      bgColor: transformColor(getAttribute(row[0].qAttrExps, colorIndex)),
      label: getAttribute(row[0].qAttrExps, labelIndex),
      subLabel: getAttribute(row[0].qAttrExps, subLabelIndex),
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
  const rootNode = {
    id: 'Root',
    name: 'Root',
    children: rootNodes,
  };

  rootNodes.forEach((node, i) => {
    node.parentId = 'Root';
    node.parent = rootNode;
    node.childNumber = i;
  });

  return rootNode;
}
