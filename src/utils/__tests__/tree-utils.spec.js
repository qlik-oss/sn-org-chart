import { createNodes, haveNoChildren, getAllTreeElemNo } from '../tree-utils';
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
  describe('createNodes', () => {
    it('should create a tree', () => {
      const matrix = [[{ qText: '007', qElemNumber: 0 }, { qText: '-' }]];
      const node = createNodes(matrix, [], null, null, translator);
      expect(node.id).to.equal('007');
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
  // Tests to add
  // should check for cycles and output something
  // should handle orphans
  // should handle multiple roots

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
});
