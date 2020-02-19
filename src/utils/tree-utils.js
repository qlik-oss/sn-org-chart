const pageSize = 3300;
const attributeIDs = {
  colorByExpression: 'color',
  labelExpression: 'label',
  subLabelExpression: 'subLabel',
  extraLabelExpression: 'extraLabel',
};
const MAX_DATA = 'max-data-limit';
const NO_ROOT = 'no_root';

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

async function fetchPage(dataPages, dataMatrix, model, fullHeight, currentRow, callNum, maxCalls) {
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
  if (callNum >= maxCalls) {
    return MAX_DATA;
  }
  if (fullHeight > currentRow) {
    // eslint-disable-next-line no-param-reassign
    return fetchPage(dataPages, dataMatrix, model, fullHeight, currentRow, callNum + 1, maxCalls);
  }
  return '';
}

const getDataMatrix = async (layout, model) => {
  if (layout.snapshotData) {
    return { status: '', dataMatrix: layout.snapshotData.dataMatrix };
  }

  const dataPages = layout.qHyperCube && layout.qHyperCube.qDataPages;
  const fullHeight = layout.qHyperCube.qSize.qcy;
  const loadedHeight = dataPages[0].qArea.qHeight;
  const dataMatrix = [...dataPages[0].qMatrix];
  let status = '';

  // If there seems to be more data, check if it is already loadad or load it
  if (fullHeight > loadedHeight && dataPages.length === 1 && model) {
    status = await fetchPage(
      layout.qHyperCube.qDataPages,
      dataMatrix,
      model,
      fullHeight,
      loadedHeight,
      0,
      layout.rowLimit / pageSize || 10
    );
  } else {
    dataPages.forEach((page, i) => {
      i > 0 ? dataMatrix.push(...page.qMatrix) : '';
    });
  }
  return { status, dataMatrix };
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

export function getAllTreeElemNo(node, activate) {
  const idList = [];
  const pushChildrenIds = currentNode => {
    currentNode.children.forEach(child => {
      child.data.selected = activate;
      idList.push(child.data.elemNo);
      if (child.children && child.children.length > 0) {
        pushChildrenIds(child);
      }
    });
  };
  node.children && pushChildrenIds(node);
  return idList;
}

export function haveNoChildren(nodes) {
  if (!nodes) {
    return true;
  }
  for (let i = 0; i < nodes.length; ++i) {
    if (nodes[i].children !== undefined) {
      return false;
    }
  }
  return true;
}

export function createNodes(matrix, attributeIndecies, status, navigationMode, translator) {
  const nodeMap = {};
  const allNodes = [];
  for (let i = 0; i < matrix.length; ++i) {
    const row = matrix[i];
    const id = getId(row);
    const parentId = getParentId(row);
    const node = {
      id,
      parentId,
      children: [],
      elemNo: row[0].qElemNumber,
      attributes: getAttributes(attributeIndecies, row[0].qAttrExps),
      measure: row[2] && row[2].qText,
      rowNo: i,
    };
    nodeMap[id] = node;
    allNodes.push(node);
  }

  const rootNodes = [];
  let maxNodeWarning = false;
  for (let i = 0; i < allNodes.length; ++i) {
    const node = allNodes[i];
    const parentNode = nodeMap[node.parentId];
    node.parent = parentNode;
    if (parentNode) {
      parentNode.children.length > 100
        ? (maxNodeWarning = true)
        : parentNode.children.push({ childNumber: parentNode.children.length, ...node });
    } else {
      rootNodes.length > 100 ? (maxNodeWarning = true) : rootNodes.push(node);
    }
  }

  // We might be able to use the rootnodes lenght as well
  if (rootNodes.length === 0) {
    // The only way to have no root noot is to have a single cycle, which means we cannot break it
    return { error: NO_ROOT, message: translator.get('Object.OrgChart.MissingRoot') };
  }
  const warn = [];
  if (status === MAX_DATA) {
    warn.push(translator.get('Object.OrgChart.MaxData'));
  }
  // Only show a maximum of children.
  if (maxNodeWarning) {
    warn.push(translator.get('Object.OrgChart.MaxChildren'));
  }
  // I have not looked at these functions at all. But we need to check the data as well I would say.
  if (anyCycle(allNodes)) {
    warn.push(translator.get('Object.OrgChart.CycleWarning'));
  }

  if (rootNodes.length === 1) {
    rootNodes[0].warn = warn;
    rootNodes[0].navigationMode = navigationMode;
    return rootNodes[0];
  }

  // Here a fake root node is created when multiple rootnodes exist
  warn.push(translator.get('Object.OrgChart.DummyWarn'));
  const rootNode = {
    id: 'Root',
    name: translator.get('Object.OrgChart.DummyRoot'),
    isDummy: true, // Should be rendered in a specific way?
    warn,
    children: rootNodes,
    navigationMode,
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

export default async function transform({ layout, model, translator }) {
  if (!layout.qHyperCube) {
    throw new Error('Require a hypercube');
  }
  if (layout.qHyperCube.qDimensionInfo.length < 2) {
    return false; // throw new Error('Require at least two dimensions');
  }

  const { status, dataMatrix } = await getDataMatrix(layout, model);
  const attributeIndecies = getAttributIndecies(layout.qHyperCube.qDimensionInfo[0].qAttrExprInfo);

  if (!dataMatrix) {
    return null;
  }
  if (dataMatrix.length < 1) {
    return null;
  }

  return createNodes(dataMatrix, attributeIndecies, status, layout.navigationMode, translator);
}
