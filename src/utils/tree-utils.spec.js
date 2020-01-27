import { createNodes, areAllLeafs } from './tree-utils';

function generateMatrix(numRows, childCount = 1) {
  const matrix = [];
  for (let i = 0; i < numRows; i++) {
    matrix.push([{ qText: `${i}`, qElemNumber: i }, { qText: i === 0 ? '' : `${Math.floor(i / childCount)}` }]);
  }
  return matrix;
}

describe('tree-utils', () => {
  describe('createNodes', () => {
    it('should create a tree', () => {
      const matrix = [[{ qText: '007', qElemNumber: 0 }, { qText: '-' }]];
      const node = createNodes(matrix, []);
      expect(node.id).to.equal('007');
    });
    it('should detect all cycles', () => {
      const matrix = generateMatrix(10, 2);
      matrix[0][1].qText = '1';
      const node = createNodes(matrix, []);
      expect(node.error).to.equal('no_root');
    });
    it('should detect isolate cycles', () => {
      const matrix = generateMatrix(10, 2);
      matrix[1][1].qText = '5';
      const node = createNodes(matrix, []);
      expect(node.warn.length).to.equal(1);
    });
    it('should generate a dummy root', () => {
      const matrix = generateMatrix(10, 2);
      matrix[1][1].qText = '-';
      const node = createNodes(matrix, []);
      expect(node.warn.length).to.equal(1);
      expect(node.id).to.equal('Root');
    });
  });

  describe('areAllLeafs', () => {
    const children = [{}, {}];
    it('should return true for array with only leafs', () => {
      expect(areAllLeafs(children)).to.be.true;
    });

    it('should return false for array that contains at least one node with children', () => {
      children[0].children = [{}];
      expect(areAllLeafs(children)).to.be.false;
    });
  });
  // Tests to add
  // should check for cycles and output something
  // should handle orphans
  // should handle multiple roots
});
