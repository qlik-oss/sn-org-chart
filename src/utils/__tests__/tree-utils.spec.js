import transform, {
  createNodes,
  haveNoChildren,
  getAllTreeElemNo,
  getAttributeIndecies,
  getAttributes,
  anyCycle,
  fetchPage,
  getDataMatrix,
} from '../tree-utils';
import defaultValues from '../../__tests__/default-orgchart-props';

function generateMatrix(numRows, childCount = 1) {
  const matrix = [];
  for (let i = 0; i < numRows; i++) {
    matrix.push([{ qText: `${i}`, qElemNumber: i }, { qText: i === 0 ? '' : `${Math.floor(i / childCount)}` }]);
  }
  return matrix;
}

const translator = { get: d => d };

describe('tree-utils', () => {
  describe('anyCycle', () => {
    let nodes;
    beforeEach(() => {
      const node3 = { id: '3', children: [] };
      const node2 = { id: '2', children: [node3] };
      const node1 = { id: '1', children: [node2] };
      nodes = [node1, node2, node3];
    });
    it('should not detect a cycle in the nodes', () => {
      const result = anyCycle(nodes);
      expect(result).to.be.false;
    });
    it('should detect a cycle in the nodes', () => {
      nodes[2].children = [{ id: '1', children: [] }];
      const result = anyCycle(nodes);
      expect(result).to.be.true;
    });
  });

  describe('fetchPage', () => {
    const model = { getHyperCubeData: async () => [{ qMatrix: [{}], qArea: { qHeight: 1 } }] };
    it('should return empty string when fetch correctly', async () => {
      const result = await fetchPage([], [], model, 1, 1, 1, 10);
      expect(result).to.equal('');
    });
    it('should return max data when limit reached', async () => {
      const result = await fetchPage([], [], model, 10, 1, 1, 3);
      expect(result).to.equal('max-data-limit');
    });
  });

  describe('getDataMatrix', () => {
    let layout;
    const model = { getHyperCubeData: async () => [{ qMatrix: [{}], qArea: { qHeight: 1 } }] };
    beforeEach(() => {
      layout = { qHyperCube: { qDataPages: [{ qArea: { qHeight: 1 }, qMatrix: [{}] }], qSize: { qcy: 1 } } };
    });
    it('should return snapshotData', async () => {
      const dataMatrix = { dataMatrix: 'SomeFakeSnapshotData' };
      layout.snapshotData = dataMatrix;
      const result = await getDataMatrix(layout, model);
      expect(result.status).to.equal('');
      expect(result.dataMatrix).to.equal('SomeFakeSnapshotData');
    });

    it('should return data matrix', async () => {
      const result = await getDataMatrix(layout, model);
      expect(result.status).to.equal('');
      expect(result.dataMatrix.length).to.equal(1);
    });

    it('should fetch more data', async () => {
      layout.qHyperCube.qSize.qcy = 2;
      const result = await getDataMatrix(layout, model);
      expect(result.status).to.equal('');
      expect(result.dataMatrix.length).to.equal(2);
    });
  });

  describe('createNodes', () => {
    it('should create a tree', () => {
      const matrix = [[{ qText: '007', qElemNumber: 0 }, { qText: '-' }]];
      const node = createNodes(matrix, [], null, null, translator);
      expect(node.id).to.equal('007');
    });
    it('should add a warning for max data', () => {
      const matrix = [[{ qText: '007', qElemNumber: 0 }, { qText: '-' }]];
      const node = createNodes(matrix, [], 'max-data-limit', null, translator);
      expect(node.warn).to.eql(['Object.OrgChart.MaxData']);
    });
    it('should add a warning for max children', () => {
      const matrix = generateMatrix(103, 103);
      const node = createNodes(matrix, [], null, null, translator);
      expect(node.warn).to.eql(['Object.OrgChart.MaxChildren']);
    });
    it('should detect all cycles', () => {
      const matrix = generateMatrix(10, 2);
      matrix[0][1].qText = '1';
      const node = createNodes(matrix, [], null, null, translator);
      expect(node.error).to.equal('no_root');
    });
    it('should detect isolate cycles', () => {
      const matrix = generateMatrix(10, 2);
      matrix[1][1].qText = '5';
      const node = createNodes(matrix, [], null, null, translator);
      expect(node.warn.length).to.equal(1);
    });
    it('should generate a dummy root', () => {
      const matrix = generateMatrix(10, 2);
      matrix[1][1].qText = '-';
      const node = createNodes(matrix, [], null, null, translator);
      expect(node.warn.length).to.equal(1);
      expect(node.id).to.equal('Root');
    });
  });

  describe('getAttributesIndecies', () => {
    let attrsInfo;
    let indecies;
    beforeEach(() => {
      attrsInfo = [];
    });
    it('should return empty array when attrsInfo is empty', () => {
      indecies = getAttributeIndecies(attrsInfo);
      expect(indecies).to.eql([]);
    });
    it('should return empty array when attrsInfo is empty', () => {
      attrsInfo = [{ id: 'colorByExpression' }, {}, { id: 'labelExpression' }];
      const expected = [
        { prop: 'color', index: 0 },
        { prop: 'label', index: 2 },
      ];
      indecies = getAttributeIndecies(attrsInfo);
      expect(indecies).to.eql(expected);
    });
  });

  describe('getAttributes', () => {
    let qAttrExpr;
    let indecies;
    let attributes;
    let expected;
    beforeEach(() => {
      indecies = [];
      qAttrExpr = {
        qValues: [
          {
            qText: 'someExpression',
          },
        ],
      };
    });
    it('should return array with atrtibute', () => {
      indecies.push({ prop: 'label', index: 0 });
      expected = { label: 'someExpression' };
      attributes = getAttributes(indecies, qAttrExpr);
      expect(attributes).to.eql(expected);
    });
    it('should return array with resolved color', () => {
      indecies.push({ prop: 'color', index: 0 });
      expected = { color: 'none' };
      attributes = getAttributes(indecies, qAttrExpr);
      expect(attributes).to.eql(expected);
    });
  });

  describe('haveNoChildren', () => {
    const nodes = [{}, {}];
    it('should return true for undifined input', () => {
      expect(haveNoChildren(undefined)).to.be.true;
    });
    it('should return true for array with only leafs', () => {
      expect(haveNoChildren(nodes)).to.be.true;
    });

    it('should return false for array that contains at least one node with children', () => {
      nodes[0].children = [{}];
      expect(haveNoChildren(nodes)).to.be.false;
    });
  });

  describe('getAllTreeElemNo', () => {
    it('should return all ids in tree and activate', () => {
      const result = getAllTreeElemNo(defaultValues.nodes, true);
      expect(result).to.deep.equal([2, 3, 798, 88]);
      expect(defaultValues.nodes.children[0].data.selected).to.equal(true);
    });

    it('should return all ids in tree and de-activate', () => {
      const result = getAllTreeElemNo(defaultValues.nodes, false);
      expect(result).to.deep.equal([2, 3, 798, 88]);
      expect(defaultValues.nodes.children[0].data.selected).to.equal(false);
    });
  });

  describe('transform', () => {
    let layout;
    let model;
    it('should throw error when no qHyperCube', async () => {
      layout = {};
      try {
        await transform({ layout, model, translator });
      } catch (error) {
        expect(error).to.be.an('error');
      }
    });
    it('should return false when only one dimension in the hypercube', async () => {
      layout = { qHyperCube: { qDimensionInfo: [{}] } };
      const result = await transform({ layout, model, translator });
      expect(result).to.be.false;
    });
    it('should return null for empty dataMatrix', async () => {
      layout = {
        qHyperCube: {
          qDimensionInfo: [{}, {}],
          qDataPages: [{ qArea: { qHeight: 1 }, qMatrix: [] }],
          qSize: { qcy: 1 },
        },
      };
      const result = await transform({ layout, model, translator });
      expect(result).to.be.null;
    });
    it('should return tree object', async () => {
      layout = {
        qHyperCube: {
          qDimensionInfo: [{}, {}],
          qDataPages: [{ qArea: { qHeight: 1 }, qMatrix: [[{ qText: 'node' }, { qText: 'parent' }]] }],
          qSize: { qcy: 1 },
        },
      };
      const result = await transform({ layout, model, translator });
      expect(result).to.be.an('object');
    });
  });
});
