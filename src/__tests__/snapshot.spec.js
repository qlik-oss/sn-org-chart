import { hierarchy } from 'd3';
import { createSnapshotData, createViewState } from '../snapshot';

describe('snapshot', () => {
  describe('createSnapshotData', () => {
    let nodes;
    let topId;
    let isExpanded;
    let expandedChildren;
    let nodeTree;
    let layout;

    beforeEach(() => {
      nodes = {
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

    it('should return all nodes when using expandAll navigation mode', () => {
      layout.navigationMode = 'expandAll';
      const result = createSnapshotData({ topId, isExpanded, expandedChildren }, nodeTree, layout);
      expect(result).to.eql([0, 1, 4, 2, 3]);
    });
  });

  describe('createViewState', () => {
    const expandedState = {};
    const transform = 'someTransform';
    const initialZoom = 'someZoom';
    const element = {
      clientHeight: 100,
      clientWidth: 200,
    };

    it('should return correct viewstate', () => {
      const result = createViewState(expandedState, transform, initialZoom, element);
      const expected = {
        expandedState: { useTransitions: false },
        transform,
        size: { w: 200, h: 100 },
        initialZoom,
      };
      expect(result).to.eql(expected);
    });
  });
});
