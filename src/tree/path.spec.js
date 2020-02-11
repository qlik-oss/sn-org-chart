import { getPoints, getPath } from './path';
import constants from './size-constants';

describe('path', () => {
  describe('getPath', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 200 },
      { x: 200, y: 200 },
    ];
    const expected = 'M 0 0 L 96 0 Q 100 0 100 4 L 100 196 Q 100 200 104 200 L 200 200 ';

    it('should return a path', () => {
      const path = getPath(points);
      expect(path).to.equal(expected);
    });
  });

  describe('getPoints', () => {
    const { heightMargin, cardHeight } = constants;
    let isVertical;
    let nodeSize;
    let parent;
    let d;
    let positioning;
    let expectedPoints;
    let topId;

    beforeEach(() => {
      topId = '0';
      parent = {
        xActual: 0,
        yActual: 0,
        children: [{
          children: [{}],
        }],
      };
      d = {
        parent,
        xActual: 300,
        yActual: cardHeight + heightMargin,
        data: {
          id: '1'
        }
      };
      positioning = {
        nodeSize,
        isVertical: true,
        depthSpacing: cardHeight + heightMargin,
        x: node => node.xActual,
        y: node => node.yActual,
      };
    });

    it('should return points for vertical tree', () => {
      expectedPoints = [
        { x: 376, y: 124 },
        { x: 376, y: 112 },
        { x: 76, y: 112 },
        { x: 76, y: 100 }
      ];
      const points = getPoints(d, topId, positioning)[0];
      expect(points).to.deep.equal(expectedPoints);
    });

    it.skip('should return points for horizontal tree', () => {
      isVertical = false;
      positioning.depthSpacing = nodeSize.width + 100;
      expectedPoints = [
        { x: 400, y: 250 },
        { x: 250, y: 250 },
        { x: 250, y: 50 },
        { x: 100, y: 50 }
      ];
      const points = getPoints(d, positioning, isVertical);
      expect(points).to.deep.equal(expectedPoints);
    });

    it('should return points for vertical tree w only leafs', () => {
      parent.children = [{}];
      expectedPoints = [
        { x: 300, y: 156 },
        { x: 0, y: 156 },
        { x: 0, y: 112 },
        { x: 76, y: 112 },
        { x: 76, y: 100 }
      ];
      const points = getPoints(d, topId, positioning)[0];
      expect(points).to.deep.equal(expectedPoints);
    });

    it.skip('should return points for horizontal tree w only leafs', () => {
      isVertical = false;
      positioning.depthSpacing = nodeSize.width + 100;
      parent.children = [{}];
      expectedPoints = [
        { x: 400, y: 250 },
        { x: 400, y: 0 },
        { x: 250, y: 0 },
        { x: 250, y: 50 },
        { x: 100, y: 50 }
      ];
      const points = getPoints(d, positioning, isVertical);
      expect(points).to.deep.equal(expectedPoints);
    });

    it('should return points for a straight vertical line', () => {
      d.xActual = 0;
      expectedPoints = [
        { x: 76, y: 124 },
        { x: 76, y: 100 }
      ];
      const points = getPoints(d, topId, positioning)[0];
      expect(points).to.deep.equal(expectedPoints);
    });

    it.skip('should return points for a straight horizontal line', () => {
      d.yActual = 0;
      expectedPoints = [
        { x: 400, y: 50 },
        { x: 100, y: 50 }
      ];
      const points = getPoints(d, positioning, isVertical);
      expect(points).to.deep.equal(expectedPoints);
    });
  });
});
