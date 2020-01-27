import { createNodes, areAllLeafs } from './tree-utils';

describe('tree-utils', () => {
  describe('createNodes', () => {
    const matrix = [[{ qText: '007', qElemNumber: 0 }, { qText: '-' }]];
    it('should create a tree', () => {
      const node = createNodes(matrix, []);
      expect(node.id).to.equal('007');
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
