import { hierarchy } from 'd3';
import { filterTree, createSnapshotData } from '../render';

const nodes = {
  id: '1',
  elemNo: 1,
  rowNo: 0,
  children: [
    {
      id: '2',
      elemNo: 2,
      rowNo: 1,
      children: [
        {
          id: '3',
          elemNo: 3,
          rowNo: 2,
          parent: {
            data: {
              id: '2',
            },
          },
          children: [
            {
              id: '5',
              elemNo: 798,
              rowNo: 3,
              parent: {
                id: '3',
              },
            },
          ],
        },
      ],
    },
    {
      id: '4',
      elemNo: 88,
      rowNo: 4,
      children: [],
    },
  ],
};

describe('render', () => {
  describe('filterTree', () => {
    let topId;
    let isExpanded;
    let expandedChildren;
    let nodeTree;

    beforeEach(() => {
      topId = '1';
      isExpanded = false;
      expandedChildren = [];
      nodeTree = hierarchy(nodes);
    });

    it('should return the only top node', () => {
      const result = filterTree({ topId, isExpanded, expandedChildren }, nodeTree);
      expect(result.length).to.equal(1);
      expect(result[0].data.id).to.equal('1');
    });

    it('should return only the top node when topId not found', () => {
      topId = 'someInsaneId';
      const result = filterTree({ topId, isExpanded, expandedChildren }, nodeTree);
      expect(result.length).to.equal(1);
      expect(result[0].data.id).to.equal('1');
    });

    it('should return the top node and children', () => {
      isExpanded = true;
      const result = filterTree({ topId, isExpanded, expandedChildren }, nodeTree);
      expect(result.length).to.equal(3);
      expect(result.map(node => node.data.id)).to.deep.equal(['1', '2', '4']);
    });

    it('should return the top node and children and grandchildren of expanded', () => {
      isExpanded = true;
      expandedChildren = ['2'];
      const result = filterTree({ topId, isExpanded, expandedChildren }, nodeTree);
      expect(result.length).to.equal(4);
      expect(result.map(node => node.data.id)).to.deep.equal(['1', '2', '3', '4']);
    });

    it('should return the top node and children with navigation mode free', () => {
      nodeTree.data.navigationMode = 'free';
      isExpanded = true;
      topId = '2';
      const result = filterTree({ topId, isExpanded, expandedChildren }, nodeTree);
      expect(result.length).to.equal(4);
      expect(result.map(node => node.data.id)).to.deep.equal(['1', '2', '4', '3']);
    });

    it('should return the top node and parents children with navigation mode free', () => {
      nodeTree.data.navigationMode = 'free';
      isExpanded = true;
      topId = '5';
      const result = filterTree({ topId, isExpanded, expandedChildren }, nodeTree);
      expect(result.length).to.equal(5);
      expect(result.map(node => node.data.id)).to.deep.equal(['1', '2', '4', '3', '5']);
    });
  });

  describe('createSnapshotData', () => {
    describe('createSnapshotData', () => {
      let topId;
      let isExpanded;
      let expandedChildren;
      let nodeTree;
      let layout;

      beforeEach(() => {
        topId = '1';
        isExpanded = true;
        expandedChildren = [];
        nodeTree = hierarchy(nodes);
        layout = {
          snapshotData: {},
          qHyperCube: {
            qDataPages: [{ qMatrix: [0, 1, 2, 3, 4] }],
          },
        };
      });

      it('should return matrix from snapshotData', () => {
        layout.snapshotData.dataMatrix = 'someMatrix';
        const result = createSnapshotData({ topId, isExpanded, expandedChildren }, nodeTree, layout);
        expect(result).to.equal('someMatrix');
      });

      it('should return usedMatrix', () => {
        const result = createSnapshotData({ topId, isExpanded, expandedChildren }, nodeTree, layout);
        expect(result).to.eql([0, 1, 2, 4]);
      });

      it('should return usedMatrix except node with missing rowNo', () => {
        nodeTree.children[1].data.rowNo = undefined;
        const result = createSnapshotData({ topId, isExpanded, expandedChildren }, nodeTree, layout);
        expect(result).to.eql([0, 1, 2]);
      });
    });
  });
});
