const pageSize = 1500;
const maxPageCount = 30;
const attributeIDs = { colorByExpression: 'color', labelExpression: 'label', subLabelExpression: 'subLabel' };

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

async function fetchPage(dataPages, dataMatrix, model, fullHeight, currentRow, callNum) {
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
      // eslint-disable-next-line no-param-reassign
      currentRow += data[0].qArea.qHeight;
    });

  if (callNum >= maxPageCount) {
    // Sanity return for very large data
  } else if (fullHeight > currentRow) {
    // eslint-disable-next-line no-param-reassign
    await fetchPage(dataPages, dataMatrix, model, fullHeight, currentRow, callNum++);
  }
}

const getDataMatrix = async (layout, model) => {
  const dataPages = layout.qHyperCube && layout.qHyperCube.qDataPages;
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

function getAttributIndecies(attrsInfo) {
  if (attrsInfo && attrsInfo.length) {
    const indecies = [];
    attrsInfo.forEach((attr, i) => {
      if (attributeIDs[attr.id]) {
        indecies.push({ prop: attributeIDs[attr.id], index: i });
      }
    });
    return indecies;
  }
  return [];
}

function transformColor(color) {
  if (color && color.substring(0, 4) === 'ARGB') {
    // transform the engine output to css
    const comps = color.substring(5, color.length - 1).split(',');
    return `rgba(${comps[1]},${comps[2]},${comps[3]},${comps[0]}`;
  }
  return color;
}

function getAttributes(indecies, qAttrExps) {
  const attributes = {};
  indecies.forEach(attr => {
    if (attr.prop === 'color') {
      attributes[attr.prop] = transformColor(qAttrExps.qValues[attr.index].qText);
    } else {
      attributes[attr.prop] = qAttrExps.qValues[attr.index].qText;
    }
  });
  return attributes;
}

export default async function transform({ layout, model }) {
  if (!layout.qHyperCube) {
    throw new Error('Require a hypercube');
  }
  if (layout.qHyperCube.qDimensionInfo.length < 2) {
    return false; // throw new Error('Require at least two dimensions');
  }

  const matrix = await getDataMatrix(layout, model);
  const attributeIndecies = getAttributIndecies(layout.qHyperCube.qDimensionInfo[0].qAttrExprInfo);

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
      attributes: getAttributes(attributeIndecies, row[0].qAttrExps),
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
    // eslint-disable-next-line no-param-reassign
    node.parentId = 'Root';
    // eslint-disable-next-line no-param-reassign
    node.parent = rootNode;
    // eslint-disable-next-line no-param-reassign
    node.childNumber = i;
  });

  return rootNode;
}
