import { createNodes } from './tree-utils';

describe('Tree transform', () => {
  describe('createNodes', () => {
    const matrix = [[{ qText: '007', qElemNumber: 0 }, { qText: '-' }]];
    it('should create a tree', () => {
      const node = createNodes(matrix, []);
      expect(node.id).to.equal('007');
    });
  });
  // Tests to add
  // should check for cycles and output something
  // should handle orphans
  // should handle multiple roots
});
